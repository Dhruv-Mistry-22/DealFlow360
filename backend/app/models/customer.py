from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import enum


class CustomerTier(str, enum.Enum):
    STANDARD = "STANDARD"
    GOLD = "GOLD"
    PLATINUM = "PLATINUM"


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    tier = Column(Enum(CustomerTier), default=CustomerTier.STANDARD, nullable=False)
    currency = Column(String, default="USD", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    quotes = relationship("Quote", back_populates="customer")
