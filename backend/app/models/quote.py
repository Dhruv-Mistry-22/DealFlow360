from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Enum,
    ForeignKey,
    Boolean,
    Text,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import enum


class QuoteStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SENT = "SENT"
    UNDER_NEGOTIATION = "UNDER_NEGOTIATION"
    CONFIRMED = "CONFIRMED"
    FULFILLMENT = "FULFILLMENT"
    BILLING = "BILLING"
    COMPLETED = "COMPLETED"


# Valid state transitions — deterministic, never skip
VALID_TRANSITIONS: dict[QuoteStatus, list[QuoteStatus]] = {
    QuoteStatus.DRAFT: [QuoteStatus.PENDING_APPROVAL, QuoteStatus.DRAFT],
    QuoteStatus.PENDING_APPROVAL: [
        QuoteStatus.APPROVED,
        QuoteStatus.REJECTED,
        QuoteStatus.DRAFT,
    ],
    QuoteStatus.APPROVED: [QuoteStatus.SENT, QuoteStatus.FULFILLMENT],
    QuoteStatus.REJECTED: [QuoteStatus.DRAFT],
    QuoteStatus.SENT: [QuoteStatus.UNDER_NEGOTIATION, QuoteStatus.CONFIRMED],
    QuoteStatus.UNDER_NEGOTIATION: [
        QuoteStatus.SENT,
        QuoteStatus.CONFIRMED,
        QuoteStatus.DRAFT,
    ],
    QuoteStatus.CONFIRMED: [QuoteStatus.FULFILLMENT],
    QuoteStatus.FULFILLMENT: [QuoteStatus.BILLING],
    QuoteStatus.BILLING: [QuoteStatus.COMPLETED],
    QuoteStatus.COMPLETED: [],
}


class ApprovalLevel(str, enum.Enum):
    NONE = "NONE"
    MANAGER = "MANAGER"
    MANAGER_AND_FINANCE = "MANAGER_AND_FINANCE"


class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(
        Integer, ForeignKey("customers.id"), nullable=False, index=True
    )
    sales_rep_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(QuoteStatus), default=QuoteStatus.DRAFT, nullable=False)

    # Financials (recalculated by backend, never trusted from frontend)
    subtotal = Column(Float, default=0.0)
    order_discount_pct = Column(Float, default=0.0)  # order-level additional discount
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    margin_pct = Column(Float, default=0.0)

    # Risk & Approval
    blended_risk_score = Column(Float, default=0.0)
    required_approval_level = Column(Enum(ApprovalLevel), default=ApprovalLevel.NONE)

    # Metadata
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    customer = relationship("Customer", back_populates="quotes")
    sales_rep = relationship(
        "User", back_populates="quotes", foreign_keys=[sales_rep_id]
    )
    lines = relationship(
        "QuoteLine", back_populates="quote", cascade="all, delete-orphan"
    )
    approvals = relationship("Approval", back_populates="quote")


class QuoteLine(Base):
    __tablename__ = "quote_lines"

    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey("quotes.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)

    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(
        Float, nullable=False
    )  # effective price from price list or base
    discount_given = Column(Float, default=0.0)  # percentage, e.g. 10.0 = 10%
    tax_rate = Column(Float, default=0.0)
    line_total = Column(Float, default=0.0)  # after discount + tax
    margin_pct = Column(Float, default=0.0)

    # Risk per line (populated by risk engine)
    category_ceiling = Column(
        Float, default=0.0
    )  # the ceiling that applies to this line
    overage = Column(Float, default=0.0)  # overage_i = max(0, discount - ceiling)

    product = relationship("Product", back_populates="quote_lines")
    variant = relationship("ProductVariant")
    quote = relationship("Quote", back_populates="lines")
    splits = relationship(
        "FulfillmentSplit", back_populates="quote_line", cascade="all, delete-orphan"
    )


class FulfillmentSplit(Base):
    __tablename__ = "fulfillment_splits"

    id = Column(Integer, primary_key=True, index=True)
    quote_line_id = Column(Integer, ForeignKey("quote_lines.id"), nullable=False)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    quantity_allocated = Column(Integer, default=0, nullable=False)

    quote_line = relationship("QuoteLine", back_populates="splits")
    warehouse = relationship("Warehouse")


class Approval(Base):
    __tablename__ = "approvals"

    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey("quotes.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    level = Column(String, nullable=False)  # "MANAGER" or "FINANCE"
    status = Column(String, default="PENDING")  # PENDING, APPROVED, REJECTED, RETURNED
    comment = Column(Text, nullable=True)
    decided_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    quote = relationship("Quote", back_populates="approvals")
    approver = relationship("User", back_populates="approvals")
