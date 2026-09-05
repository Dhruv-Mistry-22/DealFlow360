# Requirements Traceability Matrix

This document maps every requirement from the official problem statement to its corresponding implementation details in DealFlow360.

| Requirement | Module | API Endpoints | Database Entities | Frontend Screen | Business Logic / Rules | Test | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A1 Authentication** | Auth | `POST /api/v1/auth/login`<br>`POST /api/v1/auth/register` | `User`, `Role` | `/login` | JWT generation, RBAC middleware | `test_auth.py` | PLANNED |
| **A2 Product & Price List** | Catalog | `GET /api/v1/products`<br>`GET /api/v1/price-lists` | `Product`, `ProductVariant`, `PriceList`, `PriceListItem` | `/products`, `/admin` | Apply tier-based pricing | `test_products.py` | PLANNED |
| **A3 Discount Tier & Approval Chain** | Approvals | `GET/POST /api/v1/discounts`<br>`POST /api/v1/approvals` | `DiscountTier`, `ApprovalRule`, `Approval`, `Quote` | `/quotes/[id]`, `/approvals` | Blended risk score calculation, routing to Manager/Finance | `test_approvals.py` | PLANNED |
| **A4 Warehouse/Fulfillment** | Inventory | `GET /api/v1/warehouses`<br>`POST /api/v1/fulfillment` | `Warehouse`, `Inventory`, `Fulfillment`, `Shipment` | `/fulfillment`, `/quotes/[id]` | Auto-split stock, greedy minimization algorithm | `test_inventory.py` | PLANNED |
| **A5 Subscription/Recurring** | Billing | `GET/POST /api/v1/subscriptions` | `SubscriptionPlan`, `Subscription`, `Invoice` | `/billing` | Hybrid billing, prorations, credit note trigger | `test_billing.py` | PLANNED |
| **A6 Upsell/Cross-sell** | AI / Core | `GET /api/v1/quotes/[id]/recommendations` | `Product` (co-purchase stats) | `/quotes/[id]` | Margin calculation on addition, product pairing | `test_ai.py` | PLANNED |
| **A7 Reporting/Dashboard** | Reports | `GET /api/v1/reports/*` | All entities | `/dashboard` | Period/Rep/Status/Category filters | `test_reports.py` | PLANNED |
| **B1 Sales Navigation** | Workspace | - | - | Top Nav | State resets, tab management | Frontend Tests | PLANNED |
| **B2 Quotation/Pipeline** | Quotes | `GET /api/v1/quotes` | `Quote`, `Customer` | `/quotes` | Status transitions | `test_quotes.py` | PLANNED |
| **B3 Quote Builder** | Quotes | `POST /api/v1/quotes`<br>`PATCH /api/v1/quotes/[id]` | `Quote`, `QuoteLine` | `/quotes/[id]` | Cart management, real-time margin update | `test_quotes.py` | PLANNED |
| **B4 Approval** | Approvals | `POST /api/v1/approvals/[id]/action` | `Approval`, `AuditLog` | `/approvals` | Auth verification, transition, log creation | `test_approvals.py` | PLANNED |
| **B5 Upsell/Cross-sell** | AI / Core | `POST /api/v1/quotes/[id]/lines` | `QuoteLine` | `/quotes/[id]` | - | - | PLANNED |
| **B6 Fulfillment** | Inventory | `POST /api/v1/fulfillment` | `Fulfillment`, `Backorder` | `/fulfillment` | Consolidate backorders trigger | `test_inventory.py` | PLANNED |
| **B7 Billing** | Billing | `POST /api/v1/billing` | `Invoice`, `InvoiceLine`, `Payment` | `/billing` | Generate one-time + recurring | `test_billing.py` | PLANNED |
| **B8 Customer Portal** | Portal | `GET /api/v1/portal/quotes`<br>`POST /api/v1/portal/negotiate` | `Quote`, `NegotiationMessage` | `/customer-portal` | Counter-offer triggers re-approval if > threshold | `test_portal.py` | PLANNED |
| **B9 Deal Health/Anomaly** | Deal Health | `GET /api/v1/deal-health` | `DealAlert`, `Quote` | `/deal-health` | Stalled deals > X days, historical anomaly | `test_health.py` | PLANNED |

## Additional Requirements
- **Audit trail:** `AuditLog` table tracks all actions.
- **Blended discount risk:** Deterministic pure math, logic in `backend/app/services/approval_service.py`.
- **Customer negotiation:** Separated portal routes and auth.
- **Automatic reapproval:** Logic in quote update endpoints.
- **Mixed billing:** Separated display and schedules.
- **Warehouse split:** Cost/shipment optimization math shown openly with manual override.
- **Backorder consolidation:** Triggered if stock arrives mid-fulfillment.
- **Reporting filters:** Covered in `/api/v1/reports`.
- **PDF/XLS export:** (Optional/Planned).
- **Demo requirements:** Seed data will support end-to-end 5 minute demo flow.
