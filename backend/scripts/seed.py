"""
DealFlow360 deterministic seed data.
Run: python scripts/seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.customer import Customer, CustomerTier
from app.models.product import Product, ProductVariant, Warehouse, UpsellRelationship, ProductCategory
from app.models.pricing import DiscountTier, PriceList, PriceListItem, ApprovalConfig

db = SessionLocal()

def seed_users():
    users = [
        {"email": "admin@dealflow360.com", "password": "Admin@123", "role": UserRole.ADMIN, "full_name": "System Admin"},
        {"email": "sales@dealflow360.com", "password": "Sales@123", "role": UserRole.SALES_REP, "full_name": "Alice Johnson (Rep)"},
        {"email": "manager@dealflow360.com", "password": "Manager@123", "role": UserRole.SALES_MANAGER, "full_name": "Bob Smith (Manager)"},
        {"email": "finance@dealflow360.com", "password": "Finance@123", "role": UserRole.FINANCE, "full_name": "Carol White (Finance)"},
        {"email": "customer@acme.com", "password": "Customer@123", "role": UserRole.CUSTOMER, "full_name": "Dave Brown (ACME)"},
    ]
    for u in users:
        if not db.query(User).filter(User.email == u["email"]).first():
            db.add(User(
                email=u["email"],
                hashed_password=hash_password(u["password"]),
                role=u["role"],
                full_name=u["full_name"],
            ))
    db.commit()
    print("✅ Users seeded")


def seed_customers():
    customers = [
        {"name": "ACME Corp", "email": "acme@corp.com", "company": "ACME Corp", "tier": CustomerTier.STANDARD, "currency": "USD"},
        {"name": "Gold Industries", "email": "gold@industries.com", "company": "Gold Industries", "tier": CustomerTier.GOLD, "currency": "USD"},
        {"name": "Platinum Partners", "email": "platinum@partners.com", "company": "Platinum Partners", "tier": CustomerTier.PLATINUM, "currency": "USD"},
    ]
    for c in customers:
        if not db.query(Customer).filter(Customer.email == c["email"]).first():
            db.add(Customer(**c))
    db.commit()
    print("✅ Customers seeded")


def seed_products():
    products_data = [
        # Hardware
        {"name": "Laptop Pro X1", "category": ProductCategory.HARDWARE, "base_price": 1500.0, "unit": "each", "tax_rate": 18.0, "description": "High-performance business laptop"},
        {"name": "Server Unit 2U", "category": ProductCategory.HARDWARE, "base_price": 5000.0, "unit": "each", "tax_rate": 18.0, "description": "2U rack server"},
        {"name": "Network Switch 24-port", "category": ProductCategory.HARDWARE, "base_price": 800.0, "unit": "each", "tax_rate": 18.0, "description": "24-port managed switch"},
        # Services
        {"name": "Setup & Configuration", "category": ProductCategory.SERVICES, "base_price": 300.0, "unit": "hour", "tax_rate": 18.0, "description": "Professional setup service"},
        {"name": "Annual Maintenance Contract", "category": ProductCategory.SERVICES, "base_price": 600.0, "unit": "year", "tax_rate": 18.0, "description": "Full hardware maintenance"},
        # Subscription
        {"name": "CloudSpace Pro", "category": ProductCategory.SUBSCRIPTION, "base_price": 50.0, "unit": "month", "tax_rate": 18.0, "description": "Cloud storage & collaboration"},
        {"name": "SecurityShield", "category": ProductCategory.SUBSCRIPTION, "base_price": 30.0, "unit": "month", "tax_rate": 18.0, "description": "Endpoint security subscription"},
    ]
    products = {}
    for pd in products_data:
        p = db.query(Product).filter(Product.name == pd["name"]).first()
        if not p:
            p = Product(**pd)
            db.add(p)
            db.flush()
        products[pd["name"]] = p

    # Product variants
    laptop = products.get("Laptop Pro X1")
    if laptop and not db.query(ProductVariant).filter(ProductVariant.product_id == laptop.id).first():
        db.add(ProductVariant(product_id=laptop.id, attribute="Storage", value="512GB SSD", additional_price=0.0, sku="LPX1-512"))
        db.add(ProductVariant(product_id=laptop.id, attribute="Storage", value="1TB SSD", additional_price=200.0, sku="LPX1-1TB"))

    db.commit()
    print("✅ Products & variants seeded")
    return products


def seed_warehouses():
    warehouses = [
        {"name": "East Coast Warehouse", "location": "New York, NY"},
        {"name": "West Coast Depot", "location": "Los Angeles, CA"},
    ]
    for w in warehouses:
        if not db.query(Warehouse).filter(Warehouse.name == w["name"]).first():
            db.add(Warehouse(**w))
    db.commit()
    print("✅ Warehouses seeded")


def seed_discount_tiers():
    """
    Category × CustomerTier discount ceilings.
    Going above these triggers the approval flow.
    """
    tiers = [
        # STANDARD tier
        {"product_category": "HARDWARE", "customer_tier": "STANDARD", "max_discount_pct": 10.0},
        {"product_category": "SERVICES", "customer_tier": "STANDARD", "max_discount_pct": 15.0},
        {"product_category": "SUBSCRIPTION", "customer_tier": "STANDARD", "max_discount_pct": 20.0},
        # GOLD tier — more generous ceilings
        {"product_category": "HARDWARE", "customer_tier": "GOLD", "max_discount_pct": 15.0},
        {"product_category": "SERVICES", "customer_tier": "GOLD", "max_discount_pct": 20.0},
        {"product_category": "SUBSCRIPTION", "customer_tier": "GOLD", "max_discount_pct": 25.0},
        # PLATINUM — most generous
        {"product_category": "HARDWARE", "customer_tier": "PLATINUM", "max_discount_pct": 20.0},
        {"product_category": "SERVICES", "customer_tier": "PLATINUM", "max_discount_pct": 25.0},
        {"product_category": "SUBSCRIPTION", "customer_tier": "PLATINUM", "max_discount_pct": 30.0},
    ]
    for t in tiers:
        exists = db.query(DiscountTier).filter(
            DiscountTier.product_category == t["product_category"],
            DiscountTier.customer_tier == t["customer_tier"],
            DiscountTier.product_id == None,
        ).first()
        if not exists:
            db.add(DiscountTier(**t))
    db.commit()
    print("✅ Discount tiers seeded")


def seed_price_lists(products: dict):
    """Gold tier gets 5% off base price."""
    pl = db.query(PriceList).filter(PriceList.name == "Gold Tier Standard").first()
    if not pl:
        pl = PriceList(name="Gold Tier Standard", customer_tier="GOLD", currency="USD", is_active=True)
        db.add(pl)
        db.flush()
        for name, prod in products.items():
            db.add(PriceListItem(price_list_id=pl.id, product_id=prod.id, override_price=round(prod.base_price * 0.95, 2)))
    db.commit()
    print("✅ Price lists seeded")


def seed_upsell(products: dict):
    pairs = [
        ("Laptop Pro X1", "Setup & Configuration", "Frequently bought together", True, 0.9),
        ("Laptop Pro X1", "CloudSpace Pro", "Common complement for laptop buyers", True, 0.85),
        ("Server Unit 2U", "Annual Maintenance Contract", "Recommended for all server deployments", False, 0.95),
        ("Server Unit 2U", "SecurityShield", "Protect your server infrastructure", False, 0.80),
        ("Network Switch 24-port", "Annual Maintenance Contract", "Bundle with server", False, 0.7),
    ]
    for src_name, tgt_name, reason, promoted, score in pairs:
        src = products.get(src_name)
        tgt = products.get(tgt_name)
        if src and tgt:
            exists = db.query(UpsellRelationship).filter(
                UpsellRelationship.source_product_id == src.id,
                UpsellRelationship.target_product_id == tgt.id,
            ).first()
            if not exists:
                db.add(UpsellRelationship(
                    source_product_id=src.id,
                    target_product_id=tgt.id,
                    reason=reason,
                    is_promoted=promoted,
                    recommendation_score=score,
                ))
    db.commit()
    print("✅ Upsell relationships seeded")


def seed_approval_config():
    configs = [
        {"config_key": "RISK_MANAGER_THRESHOLD", "config_value": 25.0, "description": "Blended risk score above which Manager approval is required"},
        {"config_key": "RISK_FINANCE_THRESHOLD", "config_value": 50.0, "description": "Blended risk score above which Manager + Finance approval is required"},
        {"config_key": "WORST_LINE_OVERAGE_ESCALATE", "config_value": 15.0, "description": "If any single line exceeds ceiling by this many pp, escalate to Finance"},
    ]
    for c in configs:
        if not db.query(ApprovalConfig).filter(ApprovalConfig.config_key == c["config_key"]).first():
            db.add(ApprovalConfig(**c))
    db.commit()
    print("✅ Approval configs seeded")


if __name__ == "__main__":
    try:
        seed_users()
        seed_customers()
        products = seed_products()
        seed_warehouses()
        seed_discount_tiers()
        seed_price_lists(products)
        seed_upsell(products)
        seed_approval_config()
        print("\n🎉 All seed data applied successfully!")
    finally:
        db.close()
