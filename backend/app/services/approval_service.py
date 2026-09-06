"""
Approval service — handles manager/finance approval decisions.

Rules:
- A sales rep CANNOT approve their own quote.
- Manager approves MANAGER level approvals.
- Finance approves FINANCE level approvals.
- When all pending approvals are resolved → APPROVED.
- Any rejection → REJECTED.
- Every decision creates an AuditLog entry.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime, timezone

from app.models.quote import Quote, Approval, QuoteStatus
from app.models.user import User, UserRole
from app.services.audit_service import write_audit
from app.services import copilot_service as copilot


def _get_pending_approval(db: Session, quote_id: int, level: str) -> Approval | None:
    return (
        db.query(Approval)
        .filter(
            Approval.quote_id == quote_id,
            Approval.level == level,
            Approval.status == "PENDING",
        )
        .first()
    )


def _check_all_approved(db: Session, quote: Quote) -> bool:
    pending = (
        db.query(Approval)
        .filter(Approval.quote_id == quote.id, Approval.status == "PENDING")
        .count()
    )
    return pending == 0


def approve(
    db: Session, quote_id: int, approver: User, comment: str | None = None
) -> Quote:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    if quote.status != QuoteStatus.PENDING_APPROVAL:
        raise HTTPException(status_code=400, detail="Quote is not pending approval")

    # Prevent self-approval (unless Admin)
    if quote.sales_rep_id == approver.id and approver.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403, detail="Sales rep cannot approve their own quote"
        )

    # Determine which level this approver can action
    if approver.role == UserRole.SALES_MANAGER:
        approval = _get_pending_approval(db, quote_id, "MANAGER")
    elif approver.role == UserRole.FINANCE:
        # Check if MANAGER approval is still pending (sequential approval)
        manager_pending = _get_pending_approval(db, quote_id, "MANAGER")
        if manager_pending:
            raise HTTPException(
                status_code=400, detail="Manager must approve before Finance"
            )
        approval = _get_pending_approval(db, quote_id, "FINANCE")
    elif approver.role == UserRole.ADMIN:
        # Admin can action any pending approval
        approval = (
            db.query(Approval)
            .filter(Approval.quote_id == quote_id, Approval.status == "PENDING")
            .first()
        )
    else:
        raise HTTPException(
            status_code=403, detail="You do not have approval authority"
        )

    if not approval:
        # Fallback for seeded/legacy quotes that lack Approval records
        approval = Approval(
            quote_id=quote_id,
            level="MANAGER",
            status="PENDING",
            created_at=datetime.now(timezone.utc)
        )
        db.add(approval)
        db.flush()

    approval.status = "APPROVED"
    approval.approver_id = approver.id
    approval.comment = comment
    approval.decided_at = datetime.now(timezone.utc)

    write_audit(
        db,
        "APPROVAL_APPROVED",
        "Approval",
        approval.id,
        actor_id=approver.id,
        detail={"quote_id": quote_id, "level": approval.level},
        reason=comment,
    )

    if _check_all_approved(db, quote):
        quote.status = QuoteStatus.APPROVED
        write_audit(db, "QUOTE_APPROVED", "Quote", quote.id, actor_id=approver.id)
        copilot.emit_event(
            db,
            copilot.APPROVAL_COMPLETED,
            {
                "quote_id": quote.id,
                "decision": "APPROVED",
                "approver_name": approver.full_name or approver.email,
                "comment": comment or "",
            },
            quote_id=quote.id,
        )

    db.commit()
    db.refresh(quote)
    return quote


def reject(db: Session, quote_id: int, approver: User, comment: str) -> Quote:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    if quote.status != QuoteStatus.PENDING_APPROVAL:
        raise HTTPException(status_code=400, detail="Quote is not pending approval")

    if quote.sales_rep_id == approver.id and approver.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403, detail="Sales rep cannot reject their own quote"
        )

    if approver.role not in (UserRole.SALES_MANAGER, UserRole.FINANCE, UserRole.ADMIN):
        raise HTTPException(
            status_code=403, detail="You do not have approval authority"
        )

    # Mark all pending approvals as rejected
    pending = (
        db.query(Approval)
        .filter(Approval.quote_id == quote_id, Approval.status == "PENDING")
        .all()
    )
    for a in pending:
        a.status = "REJECTED"
        a.approver_id = approver.id
        a.comment = comment
        a.decided_at = datetime.now(timezone.utc)

    quote.status = QuoteStatus.REJECTED
    write_audit(
        db,
        "QUOTE_REJECTED",
        "Quote",
        quote.id,
        actor_id=approver.id,
        reason=comment,
        detail={"quote_id": quote_id},
    )
    copilot.emit_event(
        db,
        copilot.APPROVAL_COMPLETED,
        {
            "quote_id": quote.id,
            "decision": "REJECTED",
            "approver_name": approver.full_name or approver.email,
            "comment": comment,
        },
        quote_id=quote.id,
    )

    db.commit()
    db.refresh(quote)
    return quote


def return_for_revision(
    db: Session, quote_id: int, approver: User, comment: str
) -> Quote:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    if quote.status != QuoteStatus.PENDING_APPROVAL:
        raise HTTPException(status_code=400, detail="Quote is not pending approval")

    if approver.role not in (UserRole.SALES_MANAGER, UserRole.FINANCE, UserRole.ADMIN):
        raise HTTPException(
            status_code=403, detail="You do not have approval authority"
        )

    pending = (
        db.query(Approval)
        .filter(Approval.quote_id == quote_id, Approval.status == "PENDING")
        .all()
    )
    for a in pending:
        a.status = "RETURNED"
        a.approver_id = approver.id
        a.comment = comment
        a.decided_at = datetime.now(timezone.utc)

    quote.status = QuoteStatus.DRAFT
    write_audit(
        db,
        "QUOTE_RETURNED_FOR_REVISION",
        "Quote",
        quote.id,
        actor_id=approver.id,
        reason=comment,
    )
    db.commit()
    db.refresh(quote)
    return quote
