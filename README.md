# DealFlow360 — Intelligent Self-Governing Sales Operations Platform

> **A complete B2B Sales platform** covering everything from Quotation → Approval → Fulfillment → Billing → Customer Negotiation → Reporting, built for the Odoo 2026 Hackathon.

---
## Team Number 9
Dhruv Mistry (Leader)
Chaitanaya Thakar
Harsh Verma

## 📌 Table of Contents

1. [What is DealFlow360?](#1-what-is-dealflow360)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [How to Run Locally](#4-how-to-run-locally)
5. [Default Login Credentials](#5-default-login-credentials)
6. [Features & Modules](#6-features--modules)
   - [Landing Page](#landing-page)
   - [Authentication](#authentication--sign-in--sign-up)
   - [Dashboard Overview](#dashboard-overview)
   - [Quotation Management](#quotation-management)
   - [Approvals & Deal Governance](#approvals--deal-governance)
   - [Fulfillment & Warehouse Split](#fulfillment--warehouse-split)
   - [Invoices & Billing](#invoices--billing)
   - [Customer Portal](#customer-portal)
   - [Products & Catalog](#products--catalog)
   - [Subscriptions](#subscriptions)
   - [Deal Health & Risk AI](#deal-health--risk-ai)
   - [Admin Reporting](#admin-reporting)
   - [Backend Configuration](#backend-configuration)
7. [End-to-End Workflow](#7-end-to-end-workflow)
8. [Key Business Rules (Implemented in Code)](#8-key-business-rules-implemented-in-code)
9. [API Endpoints Reference](#9-api-endpoints-reference)
10. [Database & Seeding](#10-database--seeding)
11. [What We Would Build Next](#11-what-we-would-build-next)

---

## 1. What is DealFlow360?

DealFlow360 is a **self-governing sales deal engine** — not just a quote-to-invoice form. It handles the real complexity of B2B sales:

- **Multi-tier discount governance** — Discounts are capped by customer tier AND product category. Quotes that exceed limits are **automatically routed** to the correct approval chain (Sales Manager → Finance) without any manual intervention.
- **Live upsell/cross-sell panel** — While building a quote, the system suggests co-purchase products with real margin impact calculations.
- **Multi-warehouse fulfillment splitting** — When an order is confirmed, the system suggests an optimal warehouse split based on stock levels, with manual override support.
- **Hybrid billing** — A single order can contain one-time hardware products AND recurring subscription lines, generating separate billing schedules automatically.
- **Customer portal negotiation** — Customers get a dedicated, restricted URL to view and negotiate their quotation directly, without email back-and-forth.
- **Deal Health monitoring** — A real-time dashboard flags stalled quotes, discount anomalies, and delivery slippage risks.
- **Full audit trail** — Every action (approval, rejection, counter-offer, status change) is logged with actor, timestamp, and reason.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS (custom design system) |
| **Backend** | FastAPI (Python) |
| **Database** | SQLite (via SQLAlchemy ORM) |
| **Auth** | JWT Bearer Token (`/api/v1/auth/login`) |
| **Migrations** | Alembic |
| **AI Feature** | Google Gemini 1.5 Flash (risk summary, 5s timeout, graceful fallback) |

---

## 3. System Architecture

```
┌─────────────────────────────────────┐
│           React Frontend            │
│  Vite · Tailwind · AppContext       │
│  (Port 5173)                        │
└──────────────┬──────────────────────┘
               │ REST API (JSON)
               ▼
┌─────────────────────────────────────┐
│           FastAPI Backend           │
│  Python · SQLAlchemy ORM            │
│  (Port 8000)                        │
│                                     │
│  ┌─────────┐  ┌──────────────────┐  │
│  │  Auth   │  │  Risk Engine     │  │
│  │ JWT     │  │  Blended Score   │  │
│  └─────────┘  └──────────────────┘  │
│  ┌─────────┐  ┌──────────────────┐  │
│  │ Catalog │  │  Upsell Engine   │  │
│  │ Products│  │  Co-purchase     │  │
│  └─────────┘  └──────────────────┘  │
│  ┌─────────┐  ┌──────────────────┐  │
│  │ Quotes  │  │  Billing Service │  │
│  │Approvals│  │  Proration Logic │  │
│  └─────────┘  └──────────────────┘  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      SQLite Database                │
│  dealflow360.db                     │
└─────────────────────────────────────┘
```

---

## 4. How to Run Locally

### Prerequisites
- Python 3.12+
- Node.js 18+
- Git

### One-Command Start (Windows)
```bash
git clone https://github.com/Dhruv-Mistry-22/DealFlow360.git
cd DealFlow360
run_dev.bat
```

### Manual Start

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |

### Seed 100 Test Records
```bash
cd backend
venv\Scripts\python.exe scripts/seed_100_quotes.py
```

---

## 5. Default Login Credentials

> These are pre-filled on the Sign In page — just click **Sign In**.

| Field | Value |
|---|---|
| **Email** | `admin@dealflow360.com` |
| **Password** | `Admin@123` |
| **Role** | ADMIN |

---

## 6. Features & Modules

### Landing Page
- Public-facing marketing page with hero section.
- **Live Quotation / Shipment Tracker** widget — search a Quote ID (`Q-1024`) or Shipment ID and navigate directly to it.
- Sign In / Sign Up buttons in the header navigation.

---

### Authentication — Sign In / Sign Up
- **Sign In** — JWT login. Token stored in `localStorage` for session persistence through browser refreshes.
- **Sign Up** — New internal user registration with email + password.
- Unauthenticated users are automatically redirected to Sign In.
- Logging out clears all session data.

---

### Dashboard Overview
- Real-time pipeline metrics: total active quotes, pending approvals, fulfillment in-progress.
- Total deal value currently in the pipeline.
- Quick action buttons: Create new quotation, jump to approvals queue.
- All numbers are live from the backend — no hardcoded values.

---

### Quotation Management

**Quotation List**
- View all quotations in **List View** (table) or **Kanban Pipeline View**.
- Toggle between views using the 🔲/☰ buttons in the toolbar.
- **Kanban Board** — 5 columns: Draft · Awaiting Approval · Approved · Fulfillment · Completed. Each card is clickable.
- Filter by: status, search by customer / quote reference.
- **+ New Quotation** button creates a new quote for any customer.

**Quotation Builder (Detail Page)**
- Pick products across Hardware, Services, Subscription categories.
- Adjust quantities and apply line-level discount percentages.
- Apply an additional order-level discount.
- **Live margin indicator** updates in real time.
- **Upsell / Cross-Sell Panel:**
  - Shows smart suggestions based on co-purchase history.
  - Displays margin delta if the suggested item is added.
  - "Add to Quote" button — margin updates immediately.
  - "Dismiss" button removes the suggestion.
- **AI Risk Summary** — plain-English explanation generated by Gemini (graceful fallback if no API key).
- **Submit for Approval** — triggers automatic routing based on risk score.
- **Copilot Event Feed** — system-narrated timeline of all events on this quote.

---

### Approvals & Deal Governance

**Approvals List**
- All quotes in `PENDING_APPROVAL` status, with live badge count on the sidebar.
- Shows: Customer, Volume, Date, Status per pending deal.
- **Approve Deal** — instantly approves and advances the quote.
- **Reject** — returns the deal to Draft status.

**Approval Details**
- Full quotation line breakdown with blended risk score.
- Approval chain showing which levels are complete and which are pending.
- **Approve / Reject / Return for Revision** actions with optional text comment.
- AI-generated risk narrative for this specific quote.

**How Automatic Routing Works:**

| Situation | Outcome |
|---|---|
| No line exceeds its discount ceiling | Auto-approved, skips queue |
| At least one line has overage > 0 | Routed to Sales Manager |
| High blended risk (multiple/large overages) | Routed to Sales Manager + Finance |

---

### Fulfillment & Warehouse Split

**Fulfillment List**
- All quotes currently in `FULFILLMENT` status (confirmed orders being dispatched).

**Fulfillment Details**
- **Warehouse Split Suggestion** — system recommends how to split the order across warehouses based on stock availability.
- **Accept Suggested Split** — locks in the allocation.
- **Manual Override** — adjust per-warehouse quantities freely.
- **Progress Stepper** — visual: Quotation → Approval → Fulfillment → Billing → Complete.
- **🔔 Backorder Consolidation Banner** — amber alert when stock arrives mid-fulfillment:
  - "Consolidate Remaining Backorder" button merges units into the active shipment.
  - "Dismiss" to close without action.
  - On consolidation, a green success banner replaces the alert.
- Download BOL / EDI-214 (Bill of Lading).
- Reroute Order action.
- Update Telemetry button.

---

### Invoices & Billing

**Invoices List**
- All quotes that have reached billing stage (BILLING / COMPLETED status).
- Shows: Invoice reference, customer, issued date, amount.

**Billing Details**
- One-time lines and recurring subscription lines shown separately.
- **Billing schedule** for recurring lines — upcoming charge dates and amounts.
- **Activate Subscriptions** — triggers the recurring billing engine.
- **Cancel Subscription** — marks a line as cancelled with proration.

---

### Customer Portal

**Internal Customer List View**
- Internal team views all customers, fetched live from the database.
- Select a customer to see their details and active quotations.

**Customer-Facing Portal (Separate, Restricted View)**
- Customers receive a unique **magic link** (token-based URL) to view only their quotation.
- Cannot see any other data from the system.
- **Portal actions:**
  - View complete quotation details and current status (Sent / Under Negotiation / Confirmed).
  - Submit a **counter-offer** with a requested discount amount and optional message.
  - **Confirm the Quotation** with one click.
- **Post-confirmation logic:**
  - Terms within policy → order moves directly to Fulfillment.
  - Terms exceed approval limits → quote **automatically re-enters the approval flow**.

---

### Products & Catalog

**Products List**
- All active products from the backend database.
- Filter by category: Hardware / Services / Subscription.
- Shows: name, category, base price, billing cycle, tax rate.

**Product Details**
- Edit general product info.
- Manage **Product Variants** (e.g. Storage: 256GB / 512GB) with additional price per variant.
- View linked upsell/cross-sell relationships.

---

### Subscriptions

**Subscription List**
- All active subscription lines across all confirmed orders.
- Shows: product, plan type, unit price, next billing date, status.
- **Cancel** individual subscription lines (triggers proration credit where applicable).

---

### Deal Health & Risk AI

**Deal Health Dashboard**
- **Risk Matrix** — scatter plot of all active quotes: X-axis = volume, Y-axis = risk score. Outliers visible instantly.
- **Stalled deals** — quotes inactive beyond configured threshold.
- **Discount anomaly alerts** — reps whose discount is well above their historical average.
- **Delivery slippage indicators** — orders at risk of late delivery.
- Clicking any alert navigates directly to the related quotation.
- **Escalation actions** available from within the dashboard.
- All data from `/api/v1/dashboard/deal-health` — fully live.

---

### Admin Reporting

**Admin Report**
- **100% live data** — fetched from the backend database. No fake or hardcoded figures.
- **Filter controls:**
  - Period: All Time / Today / Last 7 Days
  - Approval Status: All / Pending Approval / Approved / Rejected / Fulfillment / Completed
  - Reset button to clear all filters
- **KPI Cards (6):** Total Quotes · Pipeline Volume · Avg Margin · Approved · Pending · Rejected
- **Quotation Report Table:** Quote Ref, Customer, Volume, Margin %, Risk Score, Status, Date
- **Live Audit Log Table:** Every recorded system event with entity, action, detail, timestamp
- **📄 PDF Export:** Generates and opens a print-ready formatted report in a new tab. Press Ctrl+P / Cmd+P to save as PDF.

---

### Backend Configuration

**Backend Config** (sidebar: "Backend Config" with settings icon)

Three tabs for full backend management:

**Tab 1 — Discount Tiers**
- Create rules: Customer Tier (Standard / Gold / Platinum) × Product Category (Hardware / Services / Subscription) = Max Discount Ceiling %
- These rules are what the risk engine reads when calculating overages.
- View all existing tiers in a live table.

**Tab 2 — Warehouses**
- Create warehouses with a name and location (city/region).
- These warehouses appear in the fulfillment split engine.
- View all registered warehouses with their system IDs.

**Tab 3 — Subscription Plans**
- Create recurring billing plans: Monthly / Quarterly / Yearly.
- Set price per billing cycle and optional description.
- Plans appear in the product selector when building quotes.

---

## 7. End-to-End Workflow

```
1. ADMIN SETS UP THE SYSTEM
   └── Backend Config → Set Discount Tiers, add Warehouses, create Subscription Plans

2. SALES REP BUILDS A QUOTE
   └── Quotations → + New Quotation → Select Customer
       └── Add product lines, set quantities, apply discounts
           └── Review upsell panel → add suggested items (margin updates live)

3. SYSTEM AUTO-ROUTES FOR APPROVAL
   └── Rep clicks "Submit for Approval"
       └── Risk Engine calculates blended risk score
           ├── No overages → Auto-approved → Fulfillment
           ├── Minor overages → Sales Manager queue
           └── Major overages → Sales Manager + Finance queue

4. APPROVER REVIEWS
   └── Approvals → Select quote → Review AI risk summary + line breakdown
       ├── Approve → Fulfillment
       ├── Reject → Back to Draft
       └── Return for Revision → Rep edits and resubmits

5. FULFILLMENT
   └── View fulfillment split suggestion → Accept or manually override
       └── If stock arrives mid-fulfillment → Consolidate Backorder prompt appears

6. CUSTOMER RECEIVES PORTAL LINK
   └── Customer opens magic link → Views quote
       ├── Confirm → Order proceeds to Billing
       └── Counter-offer → If terms exceed policy, auto re-enters Approval flow

7. BILLING
   └── One-time products → Single invoice
       └── Subscription lines → Recurring billing schedule activated

8. ADMIN REVIEWS REPORTS
   └── Admin Report → Filter by period/status → Export PDF
       └── Deal Health → Monitor stalled / risky deals → Escalate if needed
```

---

## 8. Key Business Rules (Implemented in Code)

### Blended Discount Risk Score

Each quote line is evaluated independently against its product category's ceiling:

```
overage_i = max(0, discount_given_i - category_ceiling_i)
blended_risk_score = sum(overage_i × line_weight_i)
```

This prevents a rep from keeping each line technically within limits while still discounting the total order beyond acceptable levels.

### Approval Routing Matrix

| Blended Risk Score | Approval Chain |
|---|---|
| 0 (no overages) | None — auto-approved |
| > 0 (any overage) | MANAGER |
| High (multiple or large overages) | MANAGER + FINANCE |

### Customer Portal Counter-Offer Re-Entry

When a customer submits a counter-offer:
1. The system recalculates the risk score with the customer's proposed discount.
2. If the new terms exceed approval thresholds → quote **automatically re-enters the approval queue** (no manual trigger).
3. If terms are within policy → quote moves straight to Fulfillment.

---

## 9. API Endpoints Reference

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | POST | `/api/v1/auth/login` | Login, returns JWT token |
| **Auth** | POST | `/api/v1/auth/register` | Register new internal user |
| **Auth** | GET | `/api/v1/auth/me` | Get current logged-in user |
| **Catalog** | GET | `/api/v1/customers` | List all customers |
| **Catalog** | POST | `/api/v1/customers` | Create new customer |
| **Catalog** | GET | `/api/v1/products` | List all active products |
| **Catalog** | POST | `/api/v1/products` | Create new product / plan |
| **Catalog** | GET | `/api/v1/discounts/tiers` | List discount ceiling rules |
| **Catalog** | POST | `/api/v1/discounts/tiers` | Create new discount tier |
| **Catalog** | GET | `/api/v1/catalog/warehouses` | List warehouses |
| **Catalog** | POST | `/api/v1/catalog/warehouses` | Create warehouse |
| **Quotes** | GET | `/api/v1/quotes` | List all quotes |
| **Quotes** | POST | `/api/v1/quotes` | Create new quote |
| **Quotes** | GET | `/api/v1/quotes/{id}` | Get quote details |
| **Quotes** | POST | `/api/v1/quotes/{id}/lines` | Add line item to quote |
| **Quotes** | PUT | `/api/v1/quotes/{id}/lines/{lid}` | Update line item |
| **Quotes** | DELETE | `/api/v1/quotes/{id}/lines/{lid}` | Remove line item |
| **Quotes** | POST | `/api/v1/quotes/{id}/submit` | Submit for approval |
| **Approvals** | GET | `/api/v1/approvals` | List pending approvals |
| **Approvals** | POST | `/api/v1/approvals/{id}/action` | Approve / Reject / Return |
| **Upsell** | GET | `/api/v1/quotes/{id}/recommendations` | Get upsell suggestions |
| **AI** | GET | `/api/v1/quotes/{id}/ai-risk-summary` | Gemini risk summary |
| **Risk** | GET | `/api/v1/quotes/{id}/risk` | Risk score breakdown |
| **Fulfillment** | GET | `/api/v1/quotes/{id}/fulfillment-split` | Suggested warehouse split |
| **Fulfillment** | POST | `/api/v1/quotes/{id}/accept-split` | Accept warehouse split |
| **Billing** | GET | `/api/v1/quotes/{id}/billing` | Billing schedule |
| **Billing** | POST | `/api/v1/quotes/{id}/billing/activate-subscriptions` | Activate recurring billing |
| **Portal** | POST | `/api/v1/portal/auth` | Customer portal login |
| **Portal** | GET | `/api/v1/portal/quotes/{token}` | View quote (customer view) |
| **Portal** | POST | `/api/v1/portal/quotes/{token}/counter` | Submit counter-offer |
| **Portal** | POST | `/api/v1/portal/quotes/{token}/confirm` | Confirm quotation |
| **Portal** | POST | `/api/v1/quotes/{id}/generate-portal-link` | Generate magic link |
| **Dashboard** | GET | `/api/v1/dashboard/deal-health` | Deal health analytics |
| **Audit** | GET | `/api/v1/audit-log` | Full system audit log |

> Full interactive documentation: **http://localhost:8000/docs** (Swagger UI)

---

## 10. Database & Seeding

### Database
- **File:** `backend/dealflow360.db` (SQLite)
- **ORM:** SQLAlchemy with Pydantic schemas
- **Migrations:** Alembic

### Core Tables

| Table | Purpose |
|---|---|
| `users` | Internal sales reps, managers, admins |
| `customers` | B2B customer accounts with tier |
| `products` | Product catalog (hardware, services, subscriptions) |
| `product_variants` | Size/config variants with price delta |
| `warehouses` | Physical warehouse locations |
| `warehouse_inventory` | Stock levels per product per warehouse |
| `quotes` | Master quote records with status + financials |
| `quote_lines` | Line items: product, qty, discount, margin, overage |
| `fulfillment_splits` | Warehouse allocation per line |
| `approvals` | Approval records with level, status, comment |
| `subscription_lines` | Recurring billing attachments on a quote |
| `billing_schedule` | Upcoming billing dates and amounts |
| `customer_counters` | Customer portal counter-offer requests |
| `discount_tiers` | Discount ceiling rules per tier × category |
| `upsell_relationships` | Product co-purchase recommendation mappings |
| `audit_log` | Full immutable event log |

### Auto-Seed on Startup
On first boot, the backend automatically:
- Creates all tables.
- Seeds admin user: `admin@dealflow360.com` / `Admin@123`.

### Test Data Script
```bash
cd backend
venv\Scripts\python.exe scripts/seed_100_quotes.py
```
Generates: 15 customers · 5 products · 100 quotes across all statuses with realistic line items.

---

## 11. What We Would Build Next

| Feature | Rationale |
|---|---|
| **Email Notifications** | Notify approvers when a quote enters their queue; notify customers when their portal quote is updated |
| **Real Warehouse Inventory UI** | Full stock management screen — view and update stock levels per product per warehouse |
| **Recurring Billing Cron Job** | Scheduled task that auto-generates invoices on subscription billing dates |
| **PDF Quote Document** | Branded, printable PDF version of a quotation for emailing to customers |
| **Role-Based Access (RBAC)** | Separate dashboards and action permissions per role: Rep / Manager / Finance / Customer |
| **Real-Time WebSocket Notifications** | Live in-app alerts when quote status changes (instead of manual refresh) |
| **Multi-Currency Support** | Price quotes in different currencies with live FX conversion |
| **Advanced Analytics** | Win/loss rate by rep, margin trend charts, product category performance over time |
| **Mobile-Optimized Portal** | Full responsive design for customer portal on mobile devices |
| **Multi-Tenant / Multi-Company** | Support multiple independent business units under one installation |

---

## 🏆 Odoo 2026 Hackathon

**Project:** DealFlow360

**GitHub:** https://github.com/Dhruv-Mistry-22/DealFlow360

> *DealFlow360 — Turn every deal into momentum.*
