import sys
import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

# Add app to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.models.base import Base
from app.models.user import User, UserRole
from app.models.product import Product, ProductCategory, Warehouse

# Since we're using sync sqlite for now, we'll use a sync engine
engine = create_engine("sqlite:///./dealflow360.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed():
    db = SessionLocal()
    try:
        # Seed Users
        if not db.query(User).first():
            admin = User(email="admin@dealflow360.com", hashed_password="hashed_pwd", role=UserRole.ADMIN, full_name="System Admin")
            sales = User(email="sales@dealflow360.com", hashed_password="hashed_pwd", role=UserRole.SALES_REP, full_name="Sales Rep")
            manager = User(email="manager@dealflow360.com", hashed_password="hashed_pwd", role=UserRole.SALES_MANAGER, full_name="Sales Manager")
            finance = User(email="finance@dealflow360.com", hashed_password="hashed_pwd", role=UserRole.FINANCE, full_name="Finance Ops")
            db.add_all([admin, sales, manager, finance])
            db.commit()
            print("Users seeded.")

        # Seed Products
        if not db.query(Product).first():
            p1 = Product(name="Laptop Pro", category=ProductCategory.HARDWARE, base_price=1500.0)
            p2 = Product(name="Setup Service", category=ProductCategory.SERVICES, base_price=300.0)
            p3 = Product(name="Cloud Subscription", category=ProductCategory.SUBSCRIPTION, base_price=50.0)
            db.add_all([p1, p2, p3])
            db.commit()
            print("Products seeded.")

        # Seed Warehouses
        if not db.query(Warehouse).first():
            w1 = Warehouse(name="Main Warehouse", location="East Coast")
            w2 = Warehouse(name="Backup Depot", location="West Coast")
            db.add_all([w1, w2])
            db.commit()
            print("Warehouses seeded.")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
