from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base


class AuditLog(Base):
    """
    Immutable append-only log of all important state changes.
    Never update or delete records here.
    """

    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # None = system
    action = Column(String, nullable=False, index=True)  # e.g. "QUOTE_CREATED"
    entity_type = Column(String, nullable=False, index=True)  # e.g. "Quote"
    entity_id = Column(Integer, nullable=True, index=True)
    detail = Column(Text, nullable=True)  # JSON or text
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    actor = relationship("User", back_populates="audit_logs")


class CopilotEvent(Base):
    """
    Events fed into the Deal Intelligence Co-Pilot feed.
    Initially uses deterministic template narrations.
    """

    __tablename__ = "copilot_events"

    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey("quotes.id"), nullable=True, index=True)
    event_type = Column(String, nullable=False)  # e.g. "DISCOUNT_THRESHOLD_CROSSED"
    payload = Column(Text, nullable=True)  # JSON
    narration = Column(Text, nullable=True)  # Generated message shown in UI
    created_at = Column(DateTime(timezone=True), server_default=func.now())
