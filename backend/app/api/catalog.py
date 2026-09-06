from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.deps import get_current_user, require_internal, require_admin
from app.models.user import User
from app.models.customer import Customer
from app.models.product import Product, ProductVariant, ProductCategory, Warehouse
from app.models.pricing import DiscountTier
from app.schemas.catalog import (
    CustomerCreate,
    CustomerOut,
    ProductCreate,
    ProductOut,
    ProductVariantCreate,
    ProductVariantOut,
    DiscountTierCreate,
    DiscountTierOut,
)

router = APIRouter()

# ─── CUSTOMERS ───────────────────────────────────────────────────────────────


@router.get("/customers", response_model=list[CustomerOut])
def list_customers(db: Session = Depends(get_db), _: User = Depends(require_internal)):
    return db.query(Customer).all()


@router.post("/customers", response_model=CustomerOut, status_code=201)
def create_customer(
    payload: CustomerCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_internal),
):
    if db.query(Customer).filter(Customer.email == payload.email).first():
        raise HTTPException(400, "Customer email already exists")
    c = Customer(**payload.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.get("/customers/{customer_id}", response_model=CustomerOut)
def get_customer(
    customer_id: int, db: Session = Depends(get_db), _: User = Depends(require_internal)
):
    c = db.query(Customer).filter(Customer.id == customer_id).first()
    if not c:
        raise HTTPException(404, "Customer not found")
    return c


# ─── PRODUCTS ─────────────────────────────────────────────────────────────────


@router.get("/products", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return db.query(Product).filter(Product.is_active == True).all()


@router.post("/products", response_model=ProductOut, status_code=201)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_internal),
):
    p = Product(**payload.model_dump())
    if p.base_price < 0 or p.base_price > 100000:
        raise HTTPException(400, "Base price must be between 0 and 100,000")
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(
    product_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)
):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    return p


@router.post(
    "/products/{product_id}/variants", response_model=ProductVariantOut, status_code=201
)
def add_variant(
    product_id: int,
    payload: ProductVariantCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_internal),
):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    v = ProductVariant(product_id=product_id, **payload.model_dump())
    db.add(v)
    db.commit()
    db.refresh(v)
    return v


# ─── DISCOUNT TIERS ──────────────────────────────────────────────────────────


@router.get("/discounts/tiers", response_model=list[DiscountTierOut])
def list_discount_tiers(
    db: Session = Depends(get_db), _: User = Depends(require_internal)
):
    return db.query(DiscountTier).all()


@router.post("/discounts/tiers", response_model=DiscountTierOut, status_code=201)
def create_discount_tier(
    payload: DiscountTierCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_internal),
):
    tier = DiscountTier(**payload.model_dump())
    db.add(tier)
    db.commit()
    db.refresh(tier)
    return tier


# ─── WAREHOUSES ───────────────────────────────────────────────────────────────

class WarehouseCreate(BaseModel):
    name: str
    location: str | None = None

class WarehouseOut(BaseModel):
    id: int
    name: str
    location: str | None = None

    class Config:
        from_attributes = True


@router.get("/catalog/warehouses", response_model=list[WarehouseOut])
def list_warehouses(db: Session = Depends(get_db), _: User = Depends(require_internal)):
    return db.query(Warehouse).all()


@router.post("/catalog/warehouses", response_model=WarehouseOut, status_code=201)
def create_warehouse(
    payload: WarehouseCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_internal),
):
    wh = Warehouse(name=payload.name, location=payload.location)
    db.add(wh)
    db.commit()
    db.refresh(wh)
    return wh
