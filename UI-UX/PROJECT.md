# DealFlow360 — Intelligent, Self-Governing Sales Operations Platform

An intelligent, self-governing B2B sales operations platform that enforces pricing discipline, auto-routes multi-tier approvals using deterministic math, splits multi-warehouse fulfillment, reconciles hybrid CapEx/OpEx subscriptions, and co-pilots every deal from quotation to cash.

## Tech Stack
- **Framework**: React 18 + TypeScript + Vite 6
- **Styling**: Tailwind CSS v3 (Custom Brand Orange `#f94c10` & dark elevation tokens `#090D16`, `#0D1322`, `#131B2E`)
- **Icons**: Lucide React
- **Architecture**: Glass Box Logic + Stateful AI Co-Pilot + SaaS-Grade UX

## How to Run
Run via `run.bat` in the project root (`E:\odoo-hack\UI-UX\run.bat`), or manually:
```cmd
npm.cmd run dev
```
Access in browser: `http://localhost:5173`

## Directory Structure
```
E:\odoo-hack\UI-UX/
├── index.html                   # HTML shell with Google Fonts & meta
├── package.json                 # React, Vite, Tailwind, Lucide dependencies
├── tailwind.config.js           # Brand orange & dark glassmorphic tokens
├── vite.config.ts               # Vite configuration
├── run.bat                      # 1-click Windows runner
├── src/
│   ├── main.tsx                 # App mount
│   ├── App.tsx                  # Tab router & glass box overlay orchestrator
│   ├── index.css                # Glassmorphism utilities, scrollbars, tabs
│   ├── types/
│   │   └── dealflow.ts          # Complete data models (Quotations, Approvals, Fulfillment, Subscriptions, Invoices)
│   ├── store/
│   │   ├── DealContext.tsx      # Central reactive store linking all 18 screens
│   │   └── initialMockData.ts   # Pre-seeded test data matching Excalidraw wireframe
│   └── components/
│       ├── layout/
│       │   ├── TopHeaderNav.tsx # Universal navbar with tabs and persona switcher
│       │   └── GlassBoxDrawer.tsx # The Glass Box Moment explainable AI math drawer
│       └── screens/
│           ├── S00_LandingPage.tsx      # Public landing page from harsh_code.html + Deal Sandbox
│           ├── S01_AuthGate.tsx         # Screen 1: Login / Signup & Persona gate
│           ├── S02_SalesDashboard.tsx   # Screen 2: Sales Dashboard (KPIs, Quick Actions)
│           ├── S03_QuotationsList.tsx   # Screen 3: Quotations List (Kanban & Table View)
│           ├── S04_QuoteWorkspace.tsx   # Screen 4: 3-Panel Builder (Catalog, Cart, Co-Pilot Feed)
│           ├── S05_ApprovalsList.tsx    # Screen 5: Approvals Queue (Pending, Returned, Approved)
│           ├── S06_ApprovalDetail.tsx   # Screen 6: Approval Detail (Math breakdown & Audit Trail)
│           ├── S07_FulfillmentList.tsx  # Screen 7: Warehouse Stock & Awaiting Orders
│           ├── S08_FulfillmentDetail.tsx# Screen 8: Greedy Split & Backorder Consolidator
│           ├── S09_SubscriptionsList.tsx# Screen 9: Subscriptions List (Active, Paused, Cancelled)
│           ├── S10_BillingDetail.tsx    # Screen 10: CapEx vs OpEx Proration Calculator
│           ├── S11_CustomerPortal.tsx   # Screen 11: Dedicated Customer Negotiation Portal (/portal)
│           ├── S12_InvoicesList.tsx     # Screen 12: Invoices List (Unpaid & Paid)
│           ├── S13_InvoiceDetail.tsx    # Screen 13: Invoice Lifecycle Stepper & Payment Recording
│           ├── S14_DealHealthWarRoom.tsx# Screen 14: Deal Health & 90-Day Rep Anomaly War Room
│           ├── S15_AdminReporting.tsx   # Screen 15: Admin Reporting & Export (PDF/XLS)
│           ├── S16_ProductCatalog.tsx   # Screen 16: Product & Variant Catalog
│           ├── S17_ProductDetail.tsx    # Screen 17: Product Configurator & Tier Pricing Rules
│           └── S18_DiscountSetup.tsx    # Screen 18: Discount Tiers & Approval Chains Setup
```

## Key Implemented Features
1. **Public Hero & Deal Sandbox**: Hero styled with harsh-uiux base theme, live quotation search (`Q-1042 Acme Corp`), 4 role gateways.
2. **3-Panel Quote Workspace**: Product picker with live margins, keystroke margin bar, live ceiling check (`+8pt OVER CEILING`).
3. **The Glass Box Moment**: Diagnostic drawer showing line-by-line formula math with 1-click `[Apply 13% Fix]`.
4. **Multi-Tier Discount Governance**: Auto-routes between Sales Manager and Finance based on weighted blended risk score.
5. **Greedy Multi-Warehouse Fulfillment**: Stock allocation across Main Warehouse and East Depot, avoiding split freight loss with 1-click backorder consolidation.
6. **Hybrid Billing & Proration**: CapEx hardware and OpEx recurring plans reconciled on a single order with day-of-month proration slider and simulated credit notes.
7. **Customer Negotiation Portal**: Separate client route (`/portal`) with line-level discussions, counter-offers, and automated re-approval triggers.
8. **Deal Health War Room**: Real-time flags for stalled deals, delivery slippage, and rep 90-day discount anomalies.
9. **Invoices & Payment Recording**: Progress stepper (`Confirmed` ➔ `Shipped` ➔ `Invoiced` ➔ `Paid`) with payment recording.
10. **Admin Master Data**: Product catalog, variant configurator, tier discount ceilings, and approval chains.

## Recent Changes
- **2026-09-05**: Initialized and built the complete 18-screen DealFlow360 platform in React + Tailwind CSS adopting harsh_code.html as the base theme.
