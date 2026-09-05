from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import Base
import enum


class DiscountTier(Base):
    """
    Defines max allowed discount percentage for a given product category
    and customer tier combination.

    This is the ceiling. Going beyond requires approval.
    """

    __tablename__ = "discount_tiers"

    id = Column(Integer, primary_key=True, index=True)
    product_category = Column(String, nullable=False)  # ProductCategory enum value
    customer_tier = Column(String, nullable=False)  # CustomerTier enum value
    max_discount_pct = Column(Float, nullable=False)  # e.g. 15.0 = 15%

    # Optional: product-specific override
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    product_category_ref = relationship("Product", foreign_keys=[product_id])


class ApprovalConfig(Base):
    """
    Configurable thresholds for blended risk routing.
    Stored in DB so they can evolve without code changes.
    """

    __tablename__ = "approval_configs"

    id = Column(Integer, primary_key=True, index=True)
    config_key = Column(
        String, unique=True, nullable=False
    )  # e.g. "RISK_MANAGER_THRESHOLD"
    config_value = Column(Float, nullable=False)
    description = Column(String, nullable=True)


class PriceList(Base):
    """Named pricing schedule for a customer tier."""

    __tablename__ = "price_lists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    customer_tier = Column(String, nullable=False)  # CustomerTier value
    currency = Column(String, default="USD")
    is_active = Column(Boolean, default=True)

    items = relationship("PriceListItem", back_populates="price_list")


class PriceListItem(Base):
    """A specific product price override within a price list."""

    __tablename__ = "price_list_items"

    id = Column(Integer, primary_key=True, index=True)
    price_list_id = Column(Integer, ForeignKey("price_lists.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    override_price = Column(Float, nullable=False)

    price_list = relationship("PriceList", back_populates="items")
    product = relationship("Product")
