# DealFlow360 - Enterprise Logistics & Deal Execution Platform

One unified React web application consolidating all 17 scattered UI/UX modules and screens of DealFlow360.

## Overview & Purpose
DealFlow360 is an enterprise multi-modal logistics CPQ (Configure, Price, Quote) and deal execution platform. It intelligently governs pricing, delegated multi-tier approvals, freight fulfillment, automated EDI billing, and customer negotiation — from quotation to cash.

## Tech Stack
- **Framework**: React 18, Vite 5
- **Styling**: Tailwind CSS 3 (configured with exact DealFlow360 design tokens, spacing, and typography)
- **Typography & Icons**: Google Fonts Inter, Plus Jakarta Sans, Google Material Symbols Outlined
- **Build Output**: Clean ESM build via Vite

## Unified Screens & Modules Included
1. **Public Landing Page** (`src/pages/LandingPage.jsx`): Hero section, live quotation/order tracking card, solution dropdown, global metrics bar, direct "Launch Platform" integration.
2. **Dashboard / Overview** (`src/pages/DashboardOverview.jsx`): Discount Matrix & Commercial Approval Governance, 4 KPI cards, safeguard floors, delegated authority tiers.
3. **Quotations List** (`src/pages/QuotationList.jsx`): Real-time CPQ sync, multi-status filters, search, KPI stats, batch approvals, CSV export.
4. **Quotation Details** (`src/pages/QuotationDetails.jsx`): Q-1024 detailed view, 5-stage deal lifecycle stepper, cargo specs, itemized pricing matrix, interactive margin concession slider, conversion trigger.
5. **Approvals & Governance** (`src/pages/ApprovalsList.jsx`): Critical SLA expiration alert banner, pending review queue, fast-track queue, margin floor exception exposure.
6. **Approval Details** (`src/pages/ApprovalDetails.jsx`): AP-8821 single deal authorization, deal economics, SLA countdown, electronic PKI smart-card signing, reject/rework/approve actions.
7. **Deal Health & Risk Intelligence** (`src/pages/DealHealth.jsx`): Margin erosion scatter plot matrix with clickable bubbles, 18% floor line, algorithmic stress test simulation, real-time risk alerts.
8. **Fulfillment & Carrier Dispatch** (`src/pages/FulfillmentList.jsx`): Live telemetry status, active dispatches, terminal milestones, bill of lading tracking.
9. **Fulfillment Order Details** (`src/pages/FulfillmentDetails.jsx`): SH-9402 order view, live GPS waypoints (Port Newark to Chicago Corwith), container IoT telematics (-18.2°C reefer monitoring), waybill telemetry update.
10. **Enterprise Invoices & Billing** (`src/pages/InvoicesList.jsx`): Quote-to-cash ledger, aging buckets, EDI-810 clearance statuses, batch reconciliation.
11. **Invoice Details** (`src/pages/InvoiceDetails.jsx`): INV-2024-8891 3-way match audit, itemized pass-through charges, Fedwire clearing.
12. **Settlement & Billing Details** (`src/pages/BillingDetails.jsx`): INV-88291 multi-party settlement split (carrier remittance vs platform margin), ACH wire confirmation.
13. **Customer Portal & Account 360** (`src/pages/CustomerPortal.jsx`): Shipper CRM 360° profile (Acme Global, Falcon Aerospace, Pacific Rim), credit facilities, DSO, active quotes and orders.
14. **Products Catalog** (`src/pages/ProductDashboard.jsx`): Multi-modal freight asset inventory (Ocean, Air, Rail, Truckload), Cass index sync, tariff rules.
15. **Product SKU Details** (`src/pages/ProductDetails.jsx`): SKU-OCN-40HC 40ft high-cube cold-chain reefer specifications, machinery specs, dynamic tariff pricing formula.
16. **Enterprise Subscriptions** (`src/pages/SubscriptionList.jsx`): Recurring platform contracts, ARR ($18.4M) & MRR metrics, renewals, seat allocations.
17. **Admin Reporting & Compliance** (`src/pages/AdminReport.jsx`): Immutable audit ledger, SOX-404 compliance status, delegated authority enforcement, audit log export.

## Application-Wide Features
- **Global Command Palette (⌘K / Ctrl+K)**: Instant search and jumping to any quote, shipment, invoice, customer, or navigation module.
- **Interactive "+ New Quotation" Modal**: CPQ wizard that calculates live margins, validates against the 18% hard floor, and inserts new quotes dynamically.
- **Toast Notifications**: Interactive feedback for approvals, rejections, conversions, exports, and stress tests.
- **Responsive Navigation**: Desktop sidebar + mobile slide-out drawer.

## How to Run
- Start application: `run.bat` (or `npm.cmd run dev`) -> runs at `http://localhost:5173`
- Stop application: `stop.bat`

## Recent Changes
- 2026-09-05: Initialized unified React + Vite + Tailwind CSS web application consolidating all 17 scattered UI/UX mockups into a single cohesive, fully interactive app. Verified production build.
