"""
Audit log service — append-only. Never update or delete.
"""

from sqlalchemy.orm import Session
from app.models.audit import AuditLog
import json


def write_audit(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: int | None = None,
    actor_id: int | None = None,
    detail: dict | str | None = None,
    reason: str | None = None,
) -> AuditLog:
    log = AuditLog(
        actor_id=actor_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        detail=json.dumps(detail) if isinstance(detail, dict) else detail,
        reason=reason,
    )
    db.add(log)
    db.flush()  # get id without committing
    return log
