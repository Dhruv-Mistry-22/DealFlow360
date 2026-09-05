"""
Deal Health Dashboard API.
All data is live from DB — no hardcoded values.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta

from app.core.database import get_db
from app.core.deps import require_internal
from app.models.user import User
from app.models.quote import Quote, QuoteStatus, Approval
from app.models.audit import AuditLog
from app.models.customer import Customer

router = APIRouter()

STALL_HOURS = 24  # Quote is stalled if no audit log in 24h
ANOMALY_DELTA_PP = 8.0  # Anomaly if this quote's avg discount > rep's 10-quote avg by 8pp


@router.get("/dashboard/deal-health")
def get_deal_health(
    db: Session = Depends(get_db),
    _: User = Depends(require_internal),
) -> dict:
    """
    Return deal health summary:
    - Stalled deals (pending approval with no activity in 24h)
    - Discount anomalies (this quote's avg discount >> rep's historical avg)
    - Pending approvals with waiting time
    """
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=STALL_HOURS)

    # ─── STALLED DEALS ────────────────────────────────────────────────────────
    pending_quotes = (
        db.query(Quote)
        .filter(Quote.status == QuoteStatus.PENDING_APPROVAL)
        .all()
    )

    stalled_deals = []
    for q in pending_quotes:
        # Get last audit log entry for this quote
        last_log = (
            db.query(AuditLog)
            .filter(AuditLog.entity_type == "Quote", AuditLog.entity_id == q.id)
            .order_by(AuditLog.id.desc())
            .first()
        )
        last_at = last_log.created_at if last_log else q.created_at
        if last_at is None:
            continue

        # Make timezone-aware for comparison
        if last_at.tzinfo is None:
            last_at = last_at.replace(tzinfo=timezone.utc)

        days_stalled = (now - last_at).total_seconds() / 86400

        if last_at < cutoff:
            customer = db.query(Customer).filter(Customer.id == q.customer_id).first()
            pending_approval = (
                db.query(Approval)
                .filter(Approval.quote_id == q.id, Approval.status == "PENDING")
                .first()
            )
            stalled_deals.append({
                "quote_id": q.id,
                "customer_name": customer.name if customer else "Unknown",
                "deal_value": q.total_amount,
                "days_stalled": round(days_stalled, 1),
                "stuck_at_role": pending_approval.level if pending_approval else "UNKNOWN",
                "last_action_at": str(last_at),
            })

    # ─── DISCOUNT ANOMALIES ───────────────────────────────────────────────────
    discount_anomalies = []
    all_draft_pending = (
        db.query(Quote)
        .filter(Quote.status.in_([QuoteStatus.PENDING_APPROVAL, QuoteStatus.DRAFT]))
        .all()
    )

    for q in all_draft_pending:
        if not q.lines:
            continue
        # This quote's average discount
        this_avg = sum(l.discount_given for l in q.lines) / len(q.lines)

        # Rep's last 10 approved quotes avg discount
        rep_quotes = (
            db.query(Quote)
            .filter(
                Quote.sales_rep_id == q.sales_rep_id,
                Quote.status == QuoteStatus.APPROVED,
                Quote.id != q.id,
            )
            .order_by(Quote.id.desc())
            .limit(10)
            .all()
        )

        if not rep_quotes:
            continue

        rep_discounts = []
        for rq in rep_quotes:
            if rq.lines:
                rep_discounts.append(sum(l.discount_given for l in rq.lines) / len(rq.lines))

        if not rep_discounts:
            continue

        rep_avg = sum(rep_discounts) / len(rep_discounts)
        delta = this_avg - rep_avg

        if delta > ANOMALY_DELTA_PP:
            customer = db.query(Customer).filter(Customer.id == q.customer_id).first()
            rep = db.query(User).filter(User.id == q.sales_rep_id).first()
            discount_anomalies.append({
                "quote_id": q.id,
                "customer_name": customer.name if customer else "Unknown",
                "rep_name": rep.full_name if rep else f"User #{q.sales_rep_id}",
                "rep_90day_avg_discount": round(rep_avg, 1),
                "this_quote_discount": round(this_avg, 1),
                "delta": round(delta, 1),
            })

    # ─── PENDING APPROVALS ────────────────────────────────────────────────────
    pending_approvals_list = []
    for q in pending_quotes:
        pending_approval = (
            db.query(Approval)
            .filter(Approval.quote_id == q.id, Approval.status == "PENDING")
            .order_by(Approval.id.asc())
            .first()
        )
        if not pending_approval:
            continue

        created_at = pending_approval.created_at
        if created_at is None:
            created_at = q.created_at
        if created_at and created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=timezone.utc)

        waiting_hours = (now - created_at).total_seconds() / 3600 if created_at else 0
        customer = db.query(Customer).filter(Customer.id == q.customer_id).first()

        pending_approvals_list.append({
            "quote_id": q.id,
            "customer_name": customer.name if customer else "Unknown",
            "deal_value": q.total_amount,
            "waiting_since_hours": round(waiting_hours, 1),
            "required_role": pending_approval.level,
        })

    return {
        "stalled_deals": stalled_deals,
        "discount_anomalies": discount_anomalies,
        "pending_approvals": pending_approvals_list,
        "summary": {
            "total_stalled": len(stalled_deals),
            "total_anomalies": len(discount_anomalies),
            "total_pending": len(pending_approvals_list),
        },
    }
