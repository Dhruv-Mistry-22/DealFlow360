from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base
import enum

class QuoteStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    UNDER_NEGOTIATION = "UNDER_NEGOTIATION"
    CONFIRMED = "CONFIRMED"
    REJECTED = "REJECTED"

class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, index=True) # ForeignKey in real implementation
    sales_rep_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(QuoteStatus), default=QuoteStatus.DRAFT)
    total_amount = Column(Float, default=0.0)
    blended_risk_score = Column(Float, default=0.0)

class QuoteLine(Base):
    __tablename__ = "quote_lines"

    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey("quotes.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    discount_given = Column(Float, default=0.0)
    line_total = Column(Float, default=0.0)
