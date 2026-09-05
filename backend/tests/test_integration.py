"""
Integration tests for DealFlow360.

Tests cover:
- Authentication (login, RBAC)
- Customer & Product CRUD
- Quote lifecycle (create, add lines, totals, submit)
- Blended risk calculation
- Approval routing (none, manager, manager+finance)
- Approval decisions (approve, reject, self-approve guard)
- Invalid state transitions
- Upsell recommendations
- Audit log
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import get_db
from app.models import Base

# Use an in-memory SQLite for tests
TEST_DB_URL = "sqlite:///./test_dealflow360.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestSession()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# ─── FIXTURES ────────────────────────────────────────────────────────────────

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    """Create tables and seed minimal test data."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="session")
def admin_token():
    # Register admin
    client.post("/api/v1/auth/register", json={
        "email": "testadmin@test.com", "password": "Admin123!", "role": "ADMIN", "full_name": "Test Admin"
    })
    resp = client.post("/api/v1/auth/login", json={"email": "testadmin@test.com", "password": "Admin123!"})
    return resp.json()["access_token"]


@pytest.fixture(scope="session")
def sales_rep_token():
    client.post("/api/v1/auth/register", json={
        "email": "testsales@test.com", "password": "Sales123!", "role": "SALES_REP", "full_name": "Test Sales Rep"
    })
    resp = client.post("/api/v1/auth/login", json={"email": "testsales@test.com", "password": "Sales123!"})
    return resp.json()["access_token"]


@pytest.fixture(scope="session")
def manager_token():
    client.post("/api/v1/auth/register", json={
        "email": "testmanager@test.com", "password": "Manager123!", "role": "SALES_MANAGER", "full_name": "Test Manager"
    })
    resp = client.post("/api/v1/auth/login", json={"email": "testmanager@test.com", "password": "Manager123!"})
    return resp.json()["access_token"]


@pytest.fixture(scope="session")
def finance_token():
    client.post("/api/v1/auth/register", json={
        "email": "testfinance@test.com", "password": "Finance123!", "role": "FINANCE", "full_name": "Test Finance"
    })
    resp = client.post("/api/v1/auth/login", json={"email": "testfinance@test.com", "password": "Finance123!"})
    return resp.json()["access_token"]


@pytest.fixture(scope="session")
def customer_id(admin_token):
    resp = client.post("/api/v1/customers", json={
        "name": "Test Customer ACME", "email": "acme@testco.com", "tier": "STANDARD"
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 201
    return resp.json()["id"]


@pytest.fixture(scope="session")
def product_id(admin_token):
    resp = client.post("/api/v1/products", json={
        "name": "Test Laptop", "category": "HARDWARE", "base_price": 1000.0,
        "unit": "each", "tax_rate": 18.0
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 201
    return resp.json()["id"]


@pytest.fixture(scope="session")
def service_product_id(admin_token):
    resp = client.post("/api/v1/products", json={
        "name": "Test Setup Service", "category": "SERVICES", "base_price": 200.0,
        "unit": "hour", "tax_rate": 0.0
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 201
    return resp.json()["id"]


@pytest.fixture(scope="session")
def discount_tier(admin_token):
    """Seed the discount tiers needed for risk calculation."""
    client.post("/api/v1/discounts/tiers", json={
        "product_category": "HARDWARE", "customer_tier": "STANDARD", "max_discount_pct": 10.0
    }, headers={"Authorization": f"Bearer {admin_token}"})
    client.post("/api/v1/discounts/tiers", json={
        "product_category": "SERVICES", "customer_tier": "STANDARD", "max_discount_pct": 15.0
    }, headers={"Authorization": f"Bearer {admin_token}"})


# ─── HEALTH ──────────────────────────────────────────────────────────────────

def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


# ─── AUTHENTICATION ───────────────────────────────────────────────────────────

def test_register_and_login(admin_token):
    assert admin_token is not None
    assert len(admin_token) > 20


def test_me_endpoint(admin_token):
    resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert resp.json()["role"] == "ADMIN"


def test_invalid_login():
    resp = client.post("/api/v1/auth/login", json={"email": "noone@nowhere.com", "password": "wrong"})
    assert resp.status_code == 401


def test_no_token_returns_403():
    resp = client.get("/api/v1/quotes")
    # FastAPI HTTPBearer returns 403 when no credentials provided
    assert resp.status_code in (401, 403)


# ─── RBAC GUARDS ─────────────────────────────────────────────────────────────

def test_customer_role_cannot_access_internal_api(admin_token):
    # Register a customer-role user
    client.post("/api/v1/auth/register", json={
        "email": "cust_role@test.com", "password": "Cust123!", "role": "CUSTOMER"
    })
    login_resp = client.post("/api/v1/auth/login", json={"email": "cust_role@test.com", "password": "Cust123!"})
    cust_token = login_resp.json()["access_token"]

    # Customer cannot list internal quotes
    resp = client.get("/api/v1/quotes", headers={"Authorization": f"Bearer {cust_token}"})
    assert resp.status_code == 403


def test_sales_rep_cannot_access_admin_config(sales_rep_token):
    resp = client.post("/api/v1/discounts/tiers", json={
        "product_category": "HARDWARE", "customer_tier": "GOLD", "max_discount_pct": 5.0
    }, headers={"Authorization": f"Bearer {sales_rep_token}"})
    assert resp.status_code == 403


# ─── CATALOG ──────────────────────────────────────────────────────────────────

def test_list_products(admin_token, product_id):
    resp = client.get("/api/v1/products", headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


def test_list_customers(admin_token, customer_id):
    resp = client.get("/api/v1/customers", headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert any(c["id"] == customer_id for c in resp.json())


# ─── QUOTES ───────────────────────────────────────────────────────────────────

def test_create_quote_and_add_lines_normal_discount(
    sales_rep_token, customer_id, product_id, discount_tier
):
    """Normal discount (within ceiling) → no approval required."""
    # Create quote
    resp = client.post("/api/v1/quotes", json={"customer_id": customer_id},
                       headers={"Authorization": f"Bearer {sales_rep_token}"})
    assert resp.status_code == 201
    quote = resp.json()
    qid = quote["id"]
    assert quote["status"] == "DRAFT"

    # Add a line with 5% discount (HARDWARE ceiling is 10% for STANDARD)
    resp = client.post(f"/api/v1/quotes/{qid}/lines", json={
        "product_id": product_id, "quantity": 2, "discount_given": 5.0
    }, headers={"Authorization": f"Bearer {sales_rep_token}"})
    assert resp.status_code == 200
    q = resp.json()
    assert q["blended_risk_score"] == 0.0
    assert q["required_approval_level"] == "NONE"
    assert q["total_amount"] > 0
    assert q["subtotal"] > 0

    # Submit → auto-approve (risk is 0)
    resp = client.post(f"/api/v1/quotes/{qid}/submit",
                        headers={"Authorization": f"Bearer {sales_rep_token}"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "APPROVED"

    return qid


def test_quote_manager_approval_required(
    sales_rep_token, manager_token, finance_token, customer_id, product_id, discount_tier
):
    """Discount above ceiling → blended risk > 25 → Manager approval required."""
    resp = client.post("/api/v1/quotes", json={"customer_id": customer_id},
                       headers={"Authorization": f"Bearer {sales_rep_token}"})
    qid = resp.json()["id"]

    # Add line with 30% discount on HARDWARE (ceiling=10%) → big overage
    resp = client.post(f"/api/v1/quotes/{qid}/lines", json={
        "product_id": product_id, "quantity": 1, "discount_given": 30.0
    }, headers={"Authorization": f"Bearer {sales_rep_token}"})
    q = resp.json()
    assert q["required_approval_level"] in ("MANAGER", "MANAGER_AND_FINANCE")
    assert q["blended_risk_score"] > 25.0
    level = q["required_approval_level"]

    # Submit for approval
    resp = client.post(f"/api/v1/quotes/{qid}/submit",
                        headers={"Authorization": f"Bearer {sales_rep_token}"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "PENDING_APPROVAL"

    # Manager approves
    resp = client.post(f"/api/v1/approvals/{qid}/action",
                        json={"action": "APPROVE", "comment": "Approved for strategic customer"},
                        headers={"Authorization": f"Bearer {manager_token}"})
    assert resp.status_code == 200

    if level == "MANAGER_AND_FINANCE":
        # Still PENDING_APPROVAL — Finance needs to approve too
        assert resp.json()["status"] == "PENDING_APPROVAL"
        resp = client.post(f"/api/v1/approvals/{qid}/action",
                            json={"action": "APPROVE", "comment": "Finance sign-off"},
                            headers={"Authorization": f"Bearer {finance_token}"})
        assert resp.status_code == 200
        assert resp.json()["status"] == "APPROVED"
    else:
        assert resp.json()["status"] == "APPROVED"


def test_self_approval_blocked(sales_rep_token, customer_id, product_id, discount_tier):
    """Sales rep cannot approve their own quote."""
    resp = client.post("/api/v1/quotes", json={"customer_id": customer_id},
                       headers={"Authorization": f"Bearer {sales_rep_token}"})
    qid = resp.json()["id"]
    client.post(f"/api/v1/quotes/{qid}/lines", json={
        "product_id": product_id, "quantity": 1, "discount_given": 35.0
    }, headers={"Authorization": f"Bearer {sales_rep_token}"})
    client.post(f"/api/v1/quotes/{qid}/submit",
                headers={"Authorization": f"Bearer {sales_rep_token}"})

    resp = client.post(f"/api/v1/approvals/{qid}/action",
                        json={"action": "APPROVE"},
                        headers={"Authorization": f"Bearer {sales_rep_token}"})
    assert resp.status_code == 403


def test_rejection_requires_comment(sales_rep_token, manager_token, customer_id, product_id, discount_tier):
    resp = client.post("/api/v1/quotes", json={"customer_id": customer_id},
                       headers={"Authorization": f"Bearer {sales_rep_token}"})
    qid = resp.json()["id"]
    client.post(f"/api/v1/quotes/{qid}/lines", json={
        "product_id": product_id, "quantity": 1, "discount_given": 35.0
    }, headers={"Authorization": f"Bearer {sales_rep_token}"})
    client.post(f"/api/v1/quotes/{qid}/submit",
                headers={"Authorization": f"Bearer {sales_rep_token}"})

    resp = client.post(f"/api/v1/approvals/{qid}/action",
                        json={"action": "REJECT"},  # no comment!
                        headers={"Authorization": f"Bearer {manager_token}"})
    assert resp.status_code == 400


def test_quote_rejection(sales_rep_token, manager_token, customer_id, product_id, discount_tier):
    resp = client.post("/api/v1/quotes", json={"customer_id": customer_id},
                       headers={"Authorization": f"Bearer {sales_rep_token}"})
    qid = resp.json()["id"]
    client.post(f"/api/v1/quotes/{qid}/lines", json={
        "product_id": product_id, "quantity": 1, "discount_given": 35.0
    }, headers={"Authorization": f"Bearer {sales_rep_token}"})
    client.post(f"/api/v1/quotes/{qid}/submit",
                headers={"Authorization": f"Bearer {sales_rep_token}"})

    resp = client.post(f"/api/v1/approvals/{qid}/action",
                        json={"action": "REJECT", "comment": "Discount too high for this customer tier"},
                        headers={"Authorization": f"Bearer {manager_token}"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "REJECTED"


def test_invalid_state_transition(sales_rep_token, customer_id, product_id, discount_tier):
    """Cannot add lines to an APPROVED quote."""
    resp = client.post("/api/v1/quotes", json={"customer_id": customer_id},
                       headers={"Authorization": f"Bearer {sales_rep_token}"})
    qid = resp.json()["id"]
    client.post(f"/api/v1/quotes/{qid}/lines", json={
        "product_id": product_id, "quantity": 1, "discount_given": 5.0
    }, headers={"Authorization": f"Bearer {sales_rep_token}"})
    client.post(f"/api/v1/quotes/{qid}/submit",
                headers={"Authorization": f"Bearer {sales_rep_token}"})
    # Now APPROVED — try adding a line
    resp = client.post(f"/api/v1/quotes/{qid}/lines", json={
        "product_id": product_id, "quantity": 1, "discount_given": 0.0
    }, headers={"Authorization": f"Bearer {sales_rep_token}"})
    assert resp.status_code == 400


def test_upsell_recommendations(admin_token, product_id, customer_id, discount_tier):
    """Upsell recommendations returned when products have seeded relationships."""
    resp = client.post("/api/v1/quotes", json={"customer_id": customer_id},
                       headers={"Authorization": f"Bearer {admin_token}"})
    qid = resp.json()["id"]
    client.post(f"/api/v1/quotes/{qid}/lines", json={
        "product_id": product_id, "quantity": 1, "discount_given": 0.0
    }, headers={"Authorization": f"Bearer {admin_token}"})

    resp = client.get(f"/api/v1/quotes/{qid}/recommendations",
                       headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    # Might be empty if no upsell relationships seeded for the test product
    assert isinstance(resp.json(), list)


def test_audit_log_populated(admin_token):
    resp = client.get("/api/v1/audit-log", headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    assert len(resp.json()) > 0


def test_copilot_feed(admin_token, customer_id, product_id, discount_tier):
    resp = client.post("/api/v1/quotes", json={"customer_id": customer_id},
                       headers={"Authorization": f"Bearer {admin_token}"})
    qid = resp.json()["id"]
    resp = client.get(f"/api/v1/copilot/feed/{qid}",
                       headers={"Authorization": f"Bearer {admin_token}"})
    assert resp.status_code == 200
    feed = resp.json()
    assert len(feed) >= 1  # At minimum QUOTE_CREATED event
    assert any(e["event_type"] == "QUOTE_CREATED" for e in feed)
