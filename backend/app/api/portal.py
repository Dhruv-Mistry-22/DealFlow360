"""
Customer Portal API — completely separate from internal API.
Uses portal-scoped JWT with restricted access (no margin data, no internal notes).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import secrets

from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.models.user import User, UserRole
from app.models.quote import Quote, QuoteStatus, QuoteLine, CustomerCounter, CustomerCounterLine, Approval, ApprovalLevel, VALID_TRANSITIONS
from app.models.customer import Customer
from app.models.product import Product
from app.services.audit_service import write_audit
from app.services.risk_engine import calculate_blended_risk

router = APIRouter()


def _portal_token_to_quote(token: str, db: Session) -> Quote:
    """Look up a quote by its portal magic token."""
    quote = db.query(Quote).filter(Quote.portal_magic_token == token).first()
    if not quote:
        raise HTTPException(401, "Invalid or expired portal link")
    return quote


# ─── PORTAL AUTH ─────────────────────────────────────────────────────────────

class PortalAuthRequest:
    def __init__(self, email: str, portal_token: str):
        self.email = email
        self.portal_token = portal_token

from pydantic import BaseModel

class PortalLoginRequest(BaseModel):
    email: str
    portal_token: str


@router.post("/portal/auth")
def portal_login(payload: PortalLoginRequest, db: Session = Depends(get_db)) -> dict:
    """
    Portal auth: validate customer email + portal token.
    Returns a customer-scoped JWT that cannot access internal APIs.
    """
    quote = db.query(Quote).filter(Quote.portal_magic_token == payload.portal_token).first()
    if not quote:
        raise HTTPException(401, "Invalid portal link")

    customer = db.query(Customer).filter(Customer.id == quote.customer_id).first()
    if not customer or customer.email.lower() != payload.email.lower():
        raise HTTPException(401, "Email does not match this quote")

    # Issue portal-scoped token (role=CUSTOMER, limited scope)
    token = create_access_token(
        data={"sub": f"portal:{customer.id}", "role": "CUSTOMER_PORTAL", "quote_id": quote.id}
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "customer_name": customer.name,
        "quote_id": quote.id,
        "portal_token": payload.portal_token,
    }


# ─── PORTAL QUOTE VIEW ────────────────────────────────────────────────────────

@router.get("/portal/quotes/{portal_token}")
def get_portal_quote(portal_token: str, db: Session = Depends(get_db)) -> dict:
    """
    Return quote data safe for customer view.
    NO margin data. NO internal notes. NO risk scores.
    """
    quote = _portal_token_to_quote(portal_token, db)
    customer = db.query(Customer).filter(Customer.id == quote.customer_id).first()

    lines = []
    one_time_total = 0.0
    recurring_total = 0.0

    for line in quote.lines:
        product = line.product
        cycle = product.billing_cycle.value if product and product.billing_cycle else "ONE_TIME"
        line_data = {
            "line_id": line.id,
            "product_name": product.name if product else f"Item #{line.product_id}",
            "quantity": line.quantity,
            "unit_price": round(line.unit_price * (1 - line.discount_given / 100), 2),
            "discount_pct": line.discount_given,
            "line_total": round(line.line_total, 2),
            "billing_cycle": cycle,
        }
        lines.append(line_data)
        if cycle == "ONE_TIME":
            one_time_total += line.line_total
        else:
            recurring_total += line.unit_price * line.quantity * (1 - line.discount_given / 100)

    return {
        "quote_id": quote.id,
        "portal_token": portal_token,
        "customer_name": customer.name if customer else "Customer",
        "status": quote.status.value,
        "lines": lines,
        "one_time_total": round(one_time_total, 2),
        "recurring_monthly_total": round(recurring_total, 2),
        "created_at": str(quote.created_at),
        # No margin, no risk score, no internal notes
    }


# ─── PORTAL COUNTER OFFER ────────────────────────────────────────────────────

class CounterOfferLine(BaseModel):
    line_id: int
    requested_discount: float


class CounterOfferRequest(BaseModel):
    portal_token: str
    message: str = ""
    line_counters: list[CounterOfferLine] = []


@router.post("/portal/quotes/{portal_token}/counter")
def submit_counter_offer(
    portal_token: str,
    payload: CounterOfferRequest,
    db: Session = Depends(get_db),
) -> dict:
    """
    Customer submits a counter offer.
    1. Store in CustomerCounters
    2. Re-evaluate risk with proposed discounts
    3. If thresholds breached, re-enter approval flow
    4. Write audit log
    """
    quote = _portal_token_to_quote(portal_token, db)
    customer = db.query(Customer).filter(Customer.id == quote.customer_id).first()

    # Store counter
    counter = CustomerCounter(
        quote_id=quote.id,
        customer_id=quote.customer_id,
        message=payload.message,
        status="PENDING",
    )
    db.add(counter)
    db.flush()

    for lc in payload.line_counters:
        line = db.query(QuoteLine).filter(
            QuoteLine.id == lc.line_id,
            QuoteLine.quote_id == quote.id,
        ).first()
        if line:
            db.add(CustomerCounterLine(
                counter_id=counter.id,
                quote_line_id=lc.line_id,
                requested_discount=lc.requested_discount,
            ))
            # Apply proposed discount temporarily to re-evaluate risk
            line.discount_given = lc.requested_discount

    # Re-evaluate risk with customer's proposed discounts
    risk = calculate_blended_risk(db, quote, customer.tier.value if customer else "STANDARD")
    quote.blended_risk_score = risk.blended_score
    quote.required_approval_level = risk.required_approval_level

    # If the proposed terms exceed thresholds, re-enter approval flow
    re_approval_triggered = False
    if risk.required_approval_level.value != "NONE":
        quote.status = QuoteStatus.PENDING_APPROVAL
        # Create new approval record
        db.add(Approval(quote_id=quote.id, level="MANAGER", status="PENDING"))
        if risk.required_approval_level.value == "MANAGER_AND_FINANCE":
            db.add(Approval(quote_id=quote.id, level="FINANCE", status="PENDING"))
        re_approval_triggered = True
    else:
        quote.status = QuoteStatus.UNDER_NEGOTIATION

    write_audit(
        db, "CUSTOMER_COUNTER_RECEIVED", "Quote", quote.id,
        detail={
            "counter_id": counter.id,
            "message": payload.message,
            "re_approval_triggered": re_approval_triggered,
        },
    )
    db.commit()

    return {
        "success": True,
        "counter_id": counter.id,
        "re_approval_triggered": re_approval_triggered,
        "message": "Your request has been received. The sales team will respond shortly.",
        "new_status": quote.status.value,
    }


@router.post("/portal/quotes/{portal_token}/confirm")
def confirm_quote(portal_token: str, db: Session = Depends(get_db)) -> dict:
    """Customer accepts current terms — sets status to CONFIRMED."""
    quote = _portal_token_to_quote(portal_token, db)
    customer = db.query(Customer).filter(Customer.id == quote.customer_id).first()

    if quote.status not in (QuoteStatus.SENT, QuoteStatus.UNDER_NEGOTIATION, QuoteStatus.APPROVED):
        raise HTTPException(400, f"Cannot confirm a quote in status {quote.status.value}")

    quote.status = QuoteStatus.CONFIRMED
    write_audit(
        db, "CUSTOMER_CONFIRMED", "Quote", quote.id,
        detail={"customer_name": customer.name if customer else "Customer"},
    )
    db.commit()

    return {
        "success": True,
        "message": "Order confirmed! Thank you.",
        "new_status": "CONFIRMED",
    }


# ─── HELPER: Generate portal token ────────────────────────────────────────────

@router.post("/quotes/{quote_id}/generate-portal-link")
def generate_portal_link(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(lambda: None),
) -> dict:
    """Generate a magic link token for a quote (called by Sales Rep)."""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(404, "Quote not found")
    if not quote.portal_magic_token:
        quote.portal_magic_token = secrets.token_urlsafe(32)
        db.commit()
        db.refresh(quote)
    return {
        "portal_token": quote.portal_magic_token,
        "portal_url": f"http://localhost:3000/portal/login?token={quote.portal_magic_token}",
    }
