from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey
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
    description = Column(String, nullable=True)

class Warehouse(Base):
    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
