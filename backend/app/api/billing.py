"""
Billing API — handles one-time and recurring billing schedules.
Implements proration math for mid-cycle changes.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import Optional

from app.core.database import get_db
from app.core.deps import require_internal
from app.models.user import User
from app.models.quote import Quote, QuoteStatus, SubscriptionLine, BillingScheduleEntry
from app.models.product import BillingCycle
from app.services.audit_service import write_audit

router = APIRouter()

CYCLE_DAYS = {
    "MONTHLY": 30,
    "QUARTERLY": 90,
    "YEARLY": 365,
}


def _build_billing_schedule(db: Session, quote: Quote) -> dict:
    """Build the full billing view from quote lines and subscription_lines."""
    one_time_lines = []
    recurring_lines = []
    one_time_total = 0.0
    recurring_monthly_total = 0.0

    today = date.today()

    for line in quote.lines:
        product = line.product
        if not product:
            continue

        cycle = product.billing_cycle.value if product.billing_cycle else "ONE_TIME"

        if cycle == "ONE_TIME":
            one_time_lines.append({
                "product_id": product.id,
                "product_name": product.name,
                "quantity": line.quantity,
                "unit_price": line.unit_price,
                "discount": line.discount_given,
                "total": round(line.line_total, 2),
                "status": "PENDING",
            })
            one_time_total += line.line_total
        else:
            # Find or create subscription line record
            sub = (
                db.query(SubscriptionLine)
                .filter(
                    SubscriptionLine.quote_id == quote.id,
                    SubscriptionLine.product_id == product.id,
                )
                .first()
            )

            monthly_amount = line.unit_price * line.quantity * (1 - line.discount_given / 100)
            plan = cycle

            # Proration for first invoice
            cycle_days = CYCLE_DAYS.get(plan, 30)
            start = sub.start_date if sub else today
            days_in_cycle = cycle_days
            day_of_cycle = (today - start).days % cycle_days if sub else 0
            days_remaining = days_in_cycle - day_of_cycle
            proration_factor = days_remaining / days_in_cycle
            first_invoice = round(monthly_amount * proration_factor, 2)
            is_prorated = abs(proration_factor - 1.0) > 0.01

            # Next 3 billing dates
            next_dates = []
            base_date = start + timedelta(days=cycle_days - day_of_cycle) if sub else today + timedelta(days=cycle_days)
            for i in range(3):
                next_dates.append({
                    "date": str(base_date + timedelta(days=cycle_days * i)),
                    "amount": round(monthly_amount, 2),
                })

            recurring_lines.append({
                "product_id": product.id,
                "product_name": product.name,
                "quantity": line.quantity,
                "unit_price": line.unit_price,
                "plan": plan,
                "monthly_amount": round(monthly_amount, 2),
                "first_invoice_amount": first_invoice,
                "is_prorated": is_prorated,
                "proration_factor": round(proration_factor, 4),
                "next_billing_dates": next_dates,
                "status": sub.status if sub else "ACTIVE",
                "subscription_line_id": sub.id if sub else None,
            })
            recurring_monthly_total += monthly_amount

    return {
        "quote_id": quote.id,
        "one_time_lines": one_time_lines,
        "one_time_total": round(one_time_total, 2),
        "recurring_lines": recurring_lines,
        "recurring_monthly_total": round(recurring_monthly_total, 2),
    }


@router.get("/quotes/{quote_id}/billing")
def get_billing(
    quote_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_internal),
) -> dict:
    """Return the billing breakdown for a quote."""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(404, "Quote not found")
    return _build_billing_schedule(db, quote)


@router.post("/quotes/{quote_id}/billing/cancel/{product_id}")
def cancel_subscription(
    quote_id: int,
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
) -> dict:
    """Cancel a subscription line — calculate refund for remaining days."""
    sub = (
        db.query(SubscriptionLine)
        .filter(
            SubscriptionLine.quote_id == quote_id,
            SubscriptionLine.product_id == product_id,
            SubscriptionLine.status == "ACTIVE",
        )
        .first()
    )
    if not sub:
        raise HTTPException(404, "Active subscription not found")

    today = date.today()
    cycle_days = CYCLE_DAYS.get(sub.plan_type, 30)
    day_of_cycle = (today - sub.start_date).days % cycle_days if sub.start_date else 0
    days_remaining = cycle_days - day_of_cycle
    monthly_amount = sub.unit_price * sub.quantity
    refund_amount = round((days_remaining / cycle_days) * monthly_amount, 2)

    sub.status = "CANCELLED"
    write_audit(
        db, "SUBSCRIPTION_CANCELLED", "SubscriptionLine", sub.id,
        actor_id=current_user.id,
        detail={"product_id": product_id, "refund_amount": refund_amount},
    )
    db.commit()

    return {
        "success": True,
        "subscription_line_id": sub.id,
        "refund_amount": refund_amount,
        "days_remaining": days_remaining,
        "message": f"Subscription cancelled. Credit of ${refund_amount:.2f} for {days_remaining} remaining days.",
    }


@router.post("/quotes/{quote_id}/billing/activate-subscriptions")
def activate_subscriptions(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
) -> dict:
    """Create subscription line records when billing is confirmed."""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(404, "Quote not found")

    today = date.today()
    created = 0

    for line in quote.lines:
        if not line.product:
            continue
        cycle = line.product.billing_cycle.value if line.product.billing_cycle else "ONE_TIME"
        if cycle == "ONE_TIME":
            continue

        cycle_days = CYCLE_DAYS.get(cycle, 30)
        existing = db.query(SubscriptionLine).filter(
            SubscriptionLine.quote_id == quote_id,
            SubscriptionLine.product_id == line.product_id,
        ).first()

        if not existing:
            sub = SubscriptionLine(
                quote_id=quote_id,
                product_id=line.product_id,
                quantity=line.quantity,
                plan_type=cycle,
                unit_price=line.unit_price * (1 - line.discount_given / 100),
                start_date=today,
                next_billing_date=today + timedelta(days=cycle_days),
                status="ACTIVE",
            )
            db.add(sub)
            created += 1

    write_audit(
        db, "SUBSCRIPTIONS_ACTIVATED", "Quote", quote_id,
        actor_id=current_user.id,
        detail={"subscriptions_created": created},
    )
    db.commit()
    return {"success": True, "subscriptions_activated": created}
