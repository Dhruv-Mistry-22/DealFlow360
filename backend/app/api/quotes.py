from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_internal
from app.models.user import User
from app.models.quote import Quote, QuoteStatus
from app.models.audit import AuditLog, CopilotEvent
from app.schemas.quotes import (
    QuoteCreate,
    QuoteOut,
    QuoteLineCreate,
    QuoteLineUpdate,
    ApprovalAction,
    ApprovalOut,
)
from app.services import quote_service, approval_service, upsell_service
from app.services.upsell_service import Recommendation

router = APIRouter()


# ─── QUOTES ──────────────────────────────────────────────────────────────────


@router.get("/quotes", response_model=list[QuoteOut])
def list_quotes(
    db: Session = Depends(get_db), current_user: User = Depends(require_internal)
):
    q = db.query(Quote)
    # Sales reps only see their own quotes
    if current_user.role.value == "SALES_REP":
        q = q.filter(Quote.sales_rep_id == current_user.id)
    return q.order_by(Quote.id.desc()).all()


@router.post("/quotes", response_model=QuoteOut, status_code=201)
def create_quote(
    payload: QuoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
):
    return quote_service.create_quote(
        db, payload.customer_id, current_user.id, payload.notes
    )


@router.get("/quotes/{quote_id}", response_model=QuoteOut)
def get_quote(
    quote_id: int, db: Session = Depends(get_db), _: User = Depends(require_internal)
):
    q = db.query(Quote).filter(Quote.id == quote_id).first()
    if not q:
        raise HTTPException(404, "Quote not found")
    return q


@router.post("/quotes/{quote_id}/lines", response_model=QuoteOut)
def add_line(
    quote_id: int,
    payload: QuoteLineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
):
    return quote_service.add_line(
        db,
        quote_id,
        payload.product_id,
        payload.quantity,
        payload.discount_given,
        current_user.id,
        payload.variant_id,
    )


@router.patch("/quotes/{quote_id}/lines/{line_id}", response_model=QuoteOut)
def update_line(
    quote_id: int,
    line_id: int,
    payload: QuoteLineUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
):
    return quote_service.update_line(
        db, quote_id, line_id, payload.quantity, payload.discount_given, current_user.id
    )


@router.delete("/quotes/{quote_id}/lines/{line_id}", response_model=QuoteOut)
def remove_line(
    quote_id: int,
    line_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
):
    return quote_service.remove_line(db, quote_id, line_id, current_user.id)


@router.post("/quotes/{quote_id}/submit", response_model=QuoteOut)
def submit_for_approval(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
):
    q = db.query(Quote).filter(Quote.id == quote_id).first()
    if not q:
        raise HTTPException(404, "Quote not found")
    return quote_service.submit_for_approval(db, q, current_user.id)


# ─── APPROVALS ────────────────────────────────────────────────────────────────


@router.get("/approvals", response_model=list[QuoteOut])
def list_pending_approvals(
    db: Session = Depends(get_db), current_user: User = Depends(require_internal)
):
    """List all quotes pending approval — for manager/finance dashboards."""
    return db.query(Quote).filter(Quote.status == QuoteStatus.PENDING_APPROVAL).all()


@router.post("/approvals/{quote_id}/action", response_model=QuoteOut)
def approval_action(
    quote_id: int,
    payload: ApprovalAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
):
    action = payload.action.upper()
    if action == "APPROVE":
        return approval_service.approve(db, quote_id, current_user, payload.comment)
    elif action == "REJECT":
        if not payload.comment:
            raise HTTPException(400, "Rejection requires a comment/reason")
        return approval_service.reject(db, quote_id, current_user, payload.comment)
    elif action == "RETURN":
        if not payload.comment:
            raise HTTPException(400, "Return for revision requires a comment/reason")
        return approval_service.return_for_revision(
            db, quote_id, current_user, payload.comment
        )
    else:
        raise HTTPException(
            400, f"Unknown action: {action}. Use APPROVE, REJECT, or RETURN."
        )


# ─── UPSELL ───────────────────────────────────────────────────────────────────


@router.get("/quotes/{quote_id}/recommendations")
def get_recommendations(
    quote_id: int, db: Session = Depends(get_db), _: User = Depends(require_internal)
) -> list[dict]:
    recs = upsell_service.get_recommendations(db, quote_id)
    return [
        {
            "product_id": r.product_id,
            "product_name": r.product_name,
            "category": r.category,
            "base_price": r.base_price,
            "reason": r.reason,
            "is_promoted": r.is_promoted,
            "recommendation_score": r.recommendation_score,
            "margin_delta_estimate": r.margin_delta_estimate,
        }
        for r in recs
    ]


# ─── CO-PILOT FEED ────────────────────────────────────────────────────────────


@router.get("/copilot/feed/{quote_id}")
def get_copilot_feed(
    quote_id: int, db: Session = Depends(get_db), _: User = Depends(require_internal)
) -> list[dict]:
    events = (
        db.query(CopilotEvent)
        .filter(CopilotEvent.quote_id == quote_id)
        .order_by(CopilotEvent.id.asc())
        .all()
    )
    return [
        {
            "id": e.id,
            "event_type": e.event_type,
            "narration": e.narration,
            "created_at": str(e.created_at),
        }
        for e in events
    ]


# ─── AUDIT LOG ────────────────────────────────────────────────────────────────


@router.get("/audit-log")
def get_audit_log(
    entity_type: str | None = None,
    entity_id: int | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_internal),
) -> list[dict]:
    q = db.query(AuditLog)
    if entity_type:
        q = q.filter(AuditLog.entity_type == entity_type)
    if entity_id:
        q = q.filter(AuditLog.entity_id == entity_id)
    logs = q.order_by(AuditLog.id.desc()).limit(100).all()
    return [
        {
            "id": l.id,
            "action": l.action,
            "entity_type": l.entity_type,
            "entity_id": l.entity_id,
            "detail": l.detail,
            "reason": l.reason,
            "actor_id": l.actor_id,
            "created_at": str(l.created_at),
        }
        for l in logs
    ]
