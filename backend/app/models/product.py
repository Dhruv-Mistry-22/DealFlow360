from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import Base
import enum


class ProductCategory(str, enum.Enum):
    HARDWARE = "HARDWARE"
    SERVICES = "SERVICES"
    SUBSCRIPTION = "SUBSCRIPTION"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category = Column(Enum(ProductCategory), nullable=False)
    base_price = Column(Float, nullable=False)
    unit = Column(String, default="each", nullable=False)
    tax_rate = Column(Float, default=0.0)  # percentage, e.g. 18.0 = 18%
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    variants = relationship("ProductVariant", back_populates="product")
    quote_lines = relationship("QuoteLine", back_populates="product")
    discount_tiers = relationship(
        "DiscountTier",
        back_populates="product_category_ref",
        primaryjoin="and_(Product.category == foreign(DiscountTier.product_category), "
        "DiscountTier.product_id == None)",
        viewonly=True,
    )
    upsell_from = relationship(
        "UpsellRelationship",
        foreign_keys="UpsellRelationship.source_product_id",
        back_populates="source_product",
    )
    upsell_to = relationship(
        "UpsellRelationship",
        foreign_keys="UpsellRelationship.target_product_id",
        back_populates="target_product",
    )


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    attribute = Column(String, nullable=False)  # e.g. "Storage"
    value = Column(String, nullable=False)  # e.g. "512GB"
    additional_price = Column(Float, default=0.0)
    sku = Column(String, nullable=True, unique=True)

    product = relationship("Product", back_populates="variants")


class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)

    inventory = relationship("WarehouseInventory", back_populates="warehouse")


class WarehouseInventory(Base):
    __tablename__ = "warehouse_inventory"

    id = Column(Integer, primary_key=True, index=True)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    stock_quantity = Column(Integer, default=0, nullable=False)

    warehouse = relationship("Warehouse", back_populates="inventory")
    product = relationship("Product")


class UpsellRelationship(Base):
    """Deterministic co-purchase relationships for upsell/cross-sell recommendations."""

    __tablename__ = "upsell_relationships"

    id = Column(Integer, primary_key=True, index=True)
    source_product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    target_product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    reason = Column(String, nullable=True)  # e.g. "Frequently bought together"
    is_promoted = Column(Boolean, default=False)
    recommendation_score = Column(Float, default=1.0)  # 0-1, higher = stronger

    source_product = relationship(
        "Product", foreign_keys=[source_product_id], back_populates="upsell_from"
    )
    target_product = relationship(
        "Product", foreign_keys=[target_product_id], back_populates="upsell_to"
    )
