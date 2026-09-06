"""
Co-Pilot event service.

Emits structured events when key things happen in DealFlow360.
Initially uses deterministic template narrations.
LLM enhancement can be added later without changing the interface.
"""

from sqlalchemy.orm import Session
import json

from app.models.audit import CopilotEvent

# Event types
QUOTE_CREATED = "QUOTE_CREATED"
QUOTE_LINE_CHANGED = "QUOTE_LINE_CHANGED"
DISCOUNT_THRESHOLD_CROSSED = "DISCOUNT_THRESHOLD_CROSSED"
APPROVAL_SUBMITTED = "APPROVAL_SUBMITTED"
APPROVAL_COMPLETED = "APPROVAL_COMPLETED"
CUSTOMER_COUNTERED = "CUSTOMER_COUNTERED"
QUOTE_INACTIVE = "QUOTE_INACTIVE"
STOCK_CHANGED = "STOCK_CHANGED"


def _build_narration(event_type: str, payload: dict) -> str:
    """Deterministic template-based narration. No LLM involved."""
    if event_type == QUOTE_CREATED:
        return f"Quote #{payload.get('quote_id')} created for customer {payload.get('customer_name', '')}."
    elif event_type == QUOTE_LINE_CHANGED:
        return (
            f"Line item updated: {payload.get('product_name', '')} — "
            f"qty {payload.get('quantity')}, discount {payload.get('discount_given', 0):.1f}%."
        )
    elif event_type == DISCOUNT_THRESHOLD_CROSSED:
        level = payload.get("required_approval_level", "NONE")
        score = payload.get("blended_score", 0)
        return (
            f"Discount threshold crossed. Blended risk score: {score:.1f}. "
            f"Required approval level: {level}."
        )
    elif event_type == APPROVAL_SUBMITTED:
        return f"Quote #{payload.get('quote_id')} submitted for approval (level: {payload.get('level', '')})."
    elif event_type == APPROVAL_COMPLETED:
        decision = payload.get("decision", "")
        approver = payload.get("approver_name", "Approver")
        return f"{approver} {decision} the quote. {payload.get('comment', '')}".strip()
    elif event_type == CUSTOMER_COUNTERED:
        return (
            f"Customer submitted a counter-offer on Quote #{payload.get('quote_id')}."
        )
    elif event_type == QUOTE_INACTIVE:
        return f"Quote #{payload.get('quote_id')} has been inactive for {payload.get('days_inactive', '?')} days."
    else:
        return f"Event: {event_type}."


def emit_event(
    db: Session,
    event_type: str,
    payload: dict,
    quote_id: int | None = None,
) -> CopilotEvent:
    narration = _build_narration(event_type, payload)
    event = CopilotEvent(
        quote_id=quote_id,
        event_type=event_type,
        payload=json.dumps(payload),
        narration=narration,
    )
    db.add(event)
    db.flush()
    return event
