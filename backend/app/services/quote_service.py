"""
Quote service — orchestrates all quote operations.

Business rules:
- Totals/margin/risk are ALWAYS calculated by the backend. Never trust frontend values.
- State transitions are validated against VALID_TRANSITIONS.
- Every mutation writes to AuditLog.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone

from app.models.quote import (
    Quote,
    QuoteLine,
    Approval,
    QuoteStatus,
    ApprovalLevel,
    VALID_TRANSITIONS,
)
from app.models.customer import Customer
from app.models.product import Product, ProductVariant
from app.models.pricing import PriceListItem, PriceList, DiscountTier
from app.services.risk_engine import calculate_blended_risk
from app.services.audit_service import write_audit
from app.services import copilot_service as copilot


def _get_effective_price(
    db: Session, product: Product, customer_tier: str, variant: ProductVariant | None
) -> float:
    """
    Look up the effective unit price for a product given customer tier.
    Falls back to base_price if no price list found.
    """
    price_list = (
        db.query(PriceList)
        .filter(PriceList.customer_tier == customer_tier, PriceList.is_active == True)
        .first()
    )
    if price_list:
        override = (
            db.query(PriceListItem)
            .filter(
                PriceListItem.price_list_id == price_list.id,
                PriceListItem.product_id == product.id,
            )
            .first()
        )
        if override:
            return override.override_price + (
                variant.additional_price if variant else 0
            )

    return product.base_price + (variant.additional_price if variant else 0)


def _recalculate_quote(db: Session, quote: Quote, customer: Customer) -> None:
    """
    Recalculate all financial fields and risk score for the quote.
    Called after every line change.
    """
    subtotal = 0.0
    total_tax = 0.0
    total_cost = 0.0  # assumed cost = 60% of base for margin calc (configurable later)

    for line in quote.lines:
        discounted_price = line.unit_price * (1 - line.discount_given / 100)
        line_subtotal = discounted_price * line.quantity
        tax = line_subtotal * (line.tax_rate / 100)
        line.line_total = round(line_subtotal + tax, 4)
        # Margin: assume 60% of base_price is cost
        if line.unit_price > 0:
            cost_per_unit = line.product.base_price * 0.60
            cost_total = cost_per_unit * line.quantity
            line.margin_pct = (
                round(((line_subtotal - cost_total) / line_subtotal) * 100, 2)
                if line_subtotal > 0
                else 0.0
            )
        subtotal += line_subtotal
        total_tax += tax
        total_cost += (
            (line.product.base_price * 0.60 * line.quantity) if line.product else 0
        )

    # Apply order-level discount
    order_discount_amount = subtotal * (quote.order_discount_pct / 100)
    final_subtotal = subtotal - order_discount_amount

    quote.subtotal = round(subtotal, 2)
    quote.tax_amount = round(total_tax, 2)
    quote.total_amount = round(final_subtotal + total_tax, 2)
    quote.margin_pct = (
        round(((final_subtotal - total_cost) / final_subtotal) * 100, 2)
        if final_subtotal > 0
        else 0.0
    )

    # Risk engine runs here — deterministic
    risk = calculate_blended_risk(db, quote, customer.tier.value)
    quote.blended_risk_score = risk.blended_score
    quote.required_approval_level = risk.required_approval_level


def create_quote(
    db: Session, customer_id: int, sales_rep_id: int, notes: str | None = None
) -> Quote:
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    quote = Quote(
        customer_id=customer_id,
        sales_rep_id=sales_rep_id,
        status=QuoteStatus.DRAFT,
        notes=notes,
    )
    db.add(quote)
    db.flush()

    write_audit(
        db,
        "QUOTE_CREATED",
        "Quote",
        quote.id,
        actor_id=sales_rep_id,
        detail={"customer_id": customer_id},
    )
    copilot.emit_event(
        db,
        copilot.QUOTE_CREATED,
        {"quote_id": quote.id, "customer_name": customer.name},
        quote_id=quote.id,
    )
    db.commit()
    db.refresh(quote)
    return quote


def add_line(
    db: Session,
    quote_id: int,
    product_id: int,
    quantity: int,
    discount_given: float,
    actor_id: int,
    variant_id: int | None = None,
) -> Quote:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    if quote.status not in (QuoteStatus.DRAFT,):
        raise HTTPException(
            status_code=400, detail=f"Cannot modify quote in status '{quote.status}'"
        )

    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.is_active == True)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    variant = (
        db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
        if variant_id
        else None
    )
    customer = db.query(Customer).filter(Customer.id == quote.customer_id).first()

    unit_price = _get_effective_price(db, product, customer.tier.value, variant)

    line = QuoteLine(
        quote_id=quote_id,
        product_id=product_id,
        variant_id=variant_id,
        quantity=quantity,
        unit_price=unit_price,
        discount_given=discount_given,
        tax_rate=product.tax_rate or 0.0,
    )
    db.add(line)
    db.flush()

    _recalculate_quote(db, quote, customer)

    write_audit(
        db,
        "QUOTE_LINE_ADDED",
        "QuoteLine",
        line.id,
        actor_id=actor_id,
        detail={
            "product_id": product_id,
            "quantity": quantity,
            "discount": discount_given,
        },
    )
    copilot.emit_event(
        db,
        copilot.QUOTE_LINE_CHANGED,
        {
            "quote_id": quote_id,
            "product_name": product.name,
            "quantity": quantity,
            "discount_given": discount_given,
        },
        quote_id=quote_id,
    )

    if quote.blended_risk_score >= 25:
        copilot.emit_event(
            db,
            copilot.DISCOUNT_THRESHOLD_CROSSED,
            {
                "quote_id": quote_id,
                "blended_score": quote.blended_risk_score,
                "required_approval_level": quote.required_approval_level.value,
            },
            quote_id=quote_id,
        )

    db.commit()
    db.refresh(quote)
    return quote


def update_line(
    db: Session,
    quote_id: int,
    line_id: int,
    quantity: int | None,
    discount_given: float | None,
    actor_id: int,
) -> Quote:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    if quote.status not in (QuoteStatus.DRAFT,):
        raise HTTPException(status_code=400, detail="Cannot modify quote in this state")

    line = (
        db.query(QuoteLine)
        .filter(QuoteLine.id == line_id, QuoteLine.quote_id == quote_id)
        .first()
    )
    if not line:
        raise HTTPException(status_code=404, detail="Line not found")

    if quantity is not None:
        line.quantity = quantity
    if discount_given is not None:
        line.discount_given = discount_given

    customer = db.query(Customer).filter(Customer.id == quote.customer_id).first()
    _recalculate_quote(db, quote, customer)

    write_audit(db, "QUOTE_LINE_UPDATED", "QuoteLine", line_id, actor_id=actor_id)
    db.commit()
    db.refresh(quote)
    return quote


def remove_line(db: Session, quote_id: int, line_id: int, actor_id: int) -> Quote:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    if quote.status not in (QuoteStatus.DRAFT,):
        raise HTTPException(status_code=400, detail="Cannot modify quote in this state")

    line = (
        db.query(QuoteLine)
        .filter(QuoteLine.id == line_id, QuoteLine.quote_id == quote_id)
        .first()
    )
    if not line:
        raise HTTPException(status_code=404, detail="Line not found")

    db.delete(line)
    customer = db.query(Customer).filter(Customer.id == quote.customer_id).first()
    _recalculate_quote(db, quote, customer)

    write_audit(db, "QUOTE_LINE_REMOVED", "QuoteLine", line_id, actor_id=actor_id)
    db.commit()
    db.refresh(quote)
    return quote


def transition_state(
    db: Session,
    quote: Quote,
    new_status: QuoteStatus,
    actor_id: int,
    reason: str | None = None,
) -> Quote:
    """
    Validate and apply a state transition.
    Raises 400 if the transition is not allowed.
    """
    allowed = VALID_TRANSITIONS.get(quote.status, [])
    if new_status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Transition '{quote.status}' → '{new_status}' is not allowed.",
        )
    old_status = quote.status
    quote.status = new_status
    write_audit(
        db,
        f"STATUS_{new_status.value}",
        "Quote",
        quote.id,
        actor_id=actor_id,
        detail={"from": old_status.value, "to": new_status.value},
        reason=reason,
    )
    db.commit()
    db.refresh(quote)
    return quote


def submit_for_approval(db: Session, quote: Quote, actor_id: int) -> Quote:
    """
    Submit quote for approval.
    Creates Approval records based on required_approval_level.
    """
    if quote.status != QuoteStatus.DRAFT:
        raise HTTPException(
            status_code=400, detail="Only DRAFT quotes can be submitted for approval"
        )
    if not quote.lines:
        raise HTTPException(
            status_code=400, detail="Cannot submit a quote with no line items"
        )

    level = quote.required_approval_level

    if level == ApprovalLevel.NONE:
        # Auto-approve
        quote.status = QuoteStatus.APPROVED
        write_audit(
            db,
            "QUOTE_AUTO_APPROVED",
            "Quote",
            quote.id,
            actor_id=actor_id,
            detail={"reason": "Risk score below threshold"},
        )
        copilot.emit_event(
            db,
            copilot.APPROVAL_COMPLETED,
            {
                "quote_id": quote.id,
                "decision": "auto-approved",
                "approver_name": "System",
            },
            quote_id=quote.id,
        )
    else:
        quote.status = QuoteStatus.PENDING_APPROVAL
        # Create manager approval record
        manager_approval = Approval(
            quote_id=quote.id, level="MANAGER", status="PENDING"
        )
        db.add(manager_approval)
        if level == ApprovalLevel.MANAGER_AND_FINANCE:
            finance_approval = Approval(
                quote_id=quote.id, level="FINANCE", status="PENDING"
            )
            db.add(finance_approval)

        write_audit(
            db,
            "APPROVAL_SUBMITTED",
            "Quote",
            quote.id,
            actor_id=actor_id,
            detail={"level": level.value},
        )
        copilot.emit_event(
            db,
            copilot.APPROVAL_SUBMITTED,
            {"quote_id": quote.id, "level": level.value},
            quote_id=quote.id,
        )

    db.commit()
    db.refresh(quote)
    return quote
