import random
from datetime import datetime, timedelta
import sys
import os

# Add backend to path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.customer import Customer, CustomerTier
from app.models.product import Product, ProductCategory, BillingCycle
from app.models.quote import Quote, QuoteStatus, QuoteLine, ApprovalLevel
from app.core.security import hash_password

def seed_db():
    db = SessionLocal()
    try:
        # Create user if not exists
        admin = db.query(User).filter(User.email == "admin@dealflow360.com").first()
        if not admin:
            admin = User(
                email="admin@dealflow360.com",
                hashed_password=hash_password("Admin@123"),
                full_name="System Admin",
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # Create some Customers
        customer_names = [
            "Acme Global Logistics Inc.", "Falcon Aerospace Supply", "Pacific Rim FMCG",
            "Swift Freight Systems", "OmniCold Storage", "Stark Industries",
            "Wayne Enterprises", "LexCorp", "Umbrella Corp", "Cyberdyne Systems",
            "Globex Corp", "Massive Dynamic", "Soylent Corp", "Initech", "Hooli"
        ]
        customers = []
        for name in customer_names:
            c = db.query(Customer).filter(Customer.name == name).first()
            if not c:
                c = Customer(
                    name=name,
                    email=f"contact@{name.replace(' ', '').replace('.', '').lower()}.com",
                    tier=random.choice(list(CustomerTier)),
                    company=name
                )
                db.add(c)
                db.commit()
                db.refresh(c)
            customers.append(c)

        # Create some Products
        product_data = [
            # Services
            ("Ocean FCL Base Freight", ProductCategory.SERVICES, 2500.0),
            ("Air Expedited Freight", ProductCategory.SERVICES, 5000.0),
            ("Truckload Intermodal", ProductCategory.SERVICES, 1200.0),
            ("LTL Freight Routing", ProductCategory.SERVICES, 450.0),
            ("White-Glove Final Mile Delivery", ProductCategory.SERVICES, 850.0),
            ("Hazardous Materials Handling (HazMat)", ProductCategory.SERVICES, 1100.0),
            ("Port Drayage & Chassis Rental", ProductCategory.SERVICES, 600.0),
            ("Supply Chain Consulting Retainer", ProductCategory.SERVICES, 10000.0),
            ("Expedited Freight Border Clearance", ProductCategory.SERVICES, 750.0),
            
            # Subscriptions
            ("Customs Brokerage Retainer", ProductCategory.SUBSCRIPTION, 500.0),
            ("DealFlow360 Analytics Pro Plan", ProductCategory.SUBSCRIPTION, 299.0),
            ("Warehouse Inventory API Access", ProductCategory.SUBSCRIPTION, 150.0),
            ("Cold-Chain Monitoring SaaS", ProductCategory.SUBSCRIPTION, 350.0),
            ("Fleet Routing Optimization AI", ProductCategory.SUBSCRIPTION, 999.0),
            ("Compliance & Trade Audit Software", ProductCategory.SUBSCRIPTION, 450.0),
            ("Supplier Risk Management Tool", ProductCategory.SUBSCRIPTION, 600.0),
            ("Carbon Offset Tracking Subscription", ProductCategory.SUBSCRIPTION, 120.0),
            
            # Hardware
            ("Cold-Chain Telemetry Tracker", ProductCategory.HARDWARE, 150.0),
            ("RFID Smart Pallet Tags (Box of 100)", ProductCategory.HARDWARE, 250.0),
            ("GPS Fleet Tracking Module", ProductCategory.HARDWARE, 320.0),
            ("Warehouse Handheld Barcode Scanner", ProductCategory.HARDWARE, 850.0),
            ("Heavy-Duty Forklift IoT Sensor", ProductCategory.HARDWARE, 400.0),
            ("Automated Conveyor Weight Scale", ProductCategory.HARDWARE, 3500.0),
            ("Dock Door Security Camera", ProductCategory.HARDWARE, 550.0),
            ("Industrial Rugged Tablet", ProductCategory.HARDWARE, 1200.0),
        ]
        products = []
        for pname, pcat, pprice in product_data:
            p = db.query(Product).filter(Product.name == pname).first()
            if not p:
                cycle = BillingCycle.MONTHLY if pcat == ProductCategory.SUBSCRIPTION else BillingCycle.ONE_TIME
                p = Product(name=pname, category=pcat, base_price=pprice, billing_cycle=cycle)
                db.add(p)
                db.commit()
                db.refresh(p)
            products.append(p)

        # Create 100 Quotes
        statuses = list(QuoteStatus)
        for i in range(100):
            cust = random.choice(customers)
            status = random.choice(statuses)
            
            # create quote
            quote = Quote(
                customer_id=cust.id,
                sales_rep_id=admin.id,
                status=status,
                blended_risk_score=random.uniform(10.0, 95.0),
                required_approval_level=random.choice(list(ApprovalLevel)),
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 60)),
                notes=f"Auto-generated quote #{i+1}"
            )
            db.add(quote)
            db.flush()

            # add quote lines
            num_lines = random.randint(1, 4)
            subtotal = 0.0
            for _ in range(num_lines):
                prod = random.choice(products)
                qty = random.randint(1, 100)
                disc = random.uniform(0.0, 25.0)
                line_total = (prod.base_price * qty) * (1 - disc / 100.0)
                subtotal += line_total
                
                ql = QuoteLine(
                    quote_id=quote.id,
                    product_id=prod.id,
                    quantity=qty,
                    unit_price=prod.base_price,
                    discount_given=disc,
                    line_total=line_total,
                    margin_pct=random.uniform(5.0, 30.0),
                    category_ceiling=15.0,
                    overage=max(0, disc - 15.0)
                )
                db.add(ql)
            
            # Calculate final amounts
            quote.subtotal = subtotal
            quote.tax_amount = subtotal * 0.1
            quote.total_amount = subtotal + quote.tax_amount
            quote.margin_pct = random.uniform(10.0, 25.0)

        db.commit()
        print("Successfully seeded 100 quotes along with customers and products!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
