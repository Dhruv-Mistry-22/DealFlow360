from pydantic import BaseModel
from app.models.customer import CustomerTier


class CustomerCreate(BaseModel):
    name: str
    email: str
    phone: str | None = None
    company: str | None = None
    tier: CustomerTier = CustomerTier.STANDARD
    currency: str = "USD"


class CustomerOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    company: str | None
    tier: CustomerTier
    currency: str

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    category: str
    base_price: float
    unit: str = "each"
    tax_rate: float = 0.0
    description: str | None = None


class ProductVariantCreate(BaseModel):
    attribute: str
    value: str
    additional_price: float = 0.0
    sku: str | None = None


class ProductVariantOut(BaseModel):
    id: int
    attribute: str
    value: str
    additional_price: float
    sku: str | None

    class Config:
        from_attributes = True


class ProductOut(BaseModel):
    id: int
    name: str
    category: str
    base_price: float
    unit: str
    tax_rate: float
    description: str | None
    is_active: bool
    variants: list[ProductVariantOut] = []

    class Config:
        from_attributes = True


class DiscountTierCreate(BaseModel):
    product_category: str
    customer_tier: str
    max_discount_pct: float


class DiscountTierOut(BaseModel):
    id: int
    product_category: str
    customer_tier: str
    max_discount_pct: float

    class Config:
        from_attributes = True
