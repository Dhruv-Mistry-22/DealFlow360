# DealFlow360 - Enterprise Logistics & Deal Execution Platform

> **Turn Every Deal Into Momentum.**  
> Intelligently governing multi-modal freight pricing, delegated approvals, execution fulfillment, automated EDI billing, and customer negotiation — from quotation to cash.

---

## Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- npm v9+ (or `npm.cmd` on Windows)

### 1. Installation
```bash
npm install
```

### 2. Start the Development Server
You can launch the dev server with one click via:
```cmd
run.bat
```
Or via terminal:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Stop the Server
```cmd
stop.bat
```

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, minified bundle in the `dist/` directory.

---

## Key Features & Platform Capabilities

- **100% Pure React Architecture**: Single-Page Application (SPA) with zero full-page reloads, stateful client-side routing, and responsive layouts.
- **CPQ Margin Guard Engine**: Configurable margin floors (18.0% hard safeguard) with automated multi-tier approval delegation (Tier 1 Rep &rarr; Tier 2 Regional &rarr; Tier 3 Pricing Desk &rarr; Tier 4 VP/CFO).
- **Interactive Deal Health Matrix**: Interactive SVG scatter plot visualizing deals across margin percentage and contract volume with real-time exception alerts.
- **IoT Cold-Chain Telemetry**: Live sensor tracking for Reefer containers (-18.2°C temperature monitoring, genset battery, waypoint milestone ingates).
- **Automated 3-Way Match & Settlement**: Reconciles quotes (`Q-1024`), carrier waybills (`SH-9402`), and EDI-810 invoices (`INV-2024-8891`) with multi-party remittance splits.
- **Global Command Palette (`⌘K` / `Ctrl+K`)**: Instant modal search across all quotes, shipments, invoices, customers, and navigation views.
- **Live "+ New Quotation" Modal**: CPQ deal creator with instant margin calculation and policy violation detection.

---

## Application Modules & Screen Directory

| # | Screen / Module | React Component | Path / Route | Key Features |
|---|---|---|---|---|
| 1 | **Public Landing Page** | `LandingPage.jsx` | `'landing'` | Hero section, tracking card (enter `Q-1024`/`SH-9402`), metrics bar, "Launch Platform" CTA. |
| 2 | **Dashboard / Overview** | `DashboardOverview.jsx` | `'overview'` | Discount Matrix, Delegated Authority rules, 4 KPI cards, corridor safeguards. |
| 3 | **Quotations List** | `QuotationList.jsx` | `'quotations'` | Live CPQ sync table, multi-status filters (All, Awaiting, Drafts, Converted), CSV export. |
| 4 | **Quotation Details** | `QuotationDetails.jsx` | `'quotation-detail'` | `Q-1024` detail view, 5-stage stepper, itemized tariff rates, margin concession slider. |
| 5 | **Approvals & Governance** | `ApprovalsList.jsx` | `'approvals'` | SLA timer alert banner (&lt; 45m expirations), fast-track queue, quick decision buttons. |
| 6 | **Approval Request Details** | `ApprovalDetails.jsx` | `'approval-detail'` | `AP-8821` detail view, deal economics (-6.2% variance vs 18% floor), PKI electronic signature. |
| 7 | **Deal Health & Risk AI** | `DealHealth.jsx` | `'deal-health'` | Margin erosion scatter plot, clickable deal bubbles, algorithmic stress test simulation. |
| 8 | **Fulfillment & Dispatch** | `FulfillmentList.jsx` | `'fulfillment'` | Active dispatches, BOL status, terminal ingate progress, carrier SLA tracking. |
| 9 | **Fulfillment Order Details** | `FulfillmentDetails.jsx` | `'fulfillment-detail'` | `SH-9402` GPS waypoints (Port Newark to Chicago Corwith), -18.2°C IoT Reefer diagnostics. |
| 10 | **Invoices & Billing** | `InvoicesList.jsx` | `'invoices'` | Quote-to-cash ledger, aging buckets, EDI-810 status, batch reconciliation. |
| 11 | **Invoice Details** | `InvoiceDetails.jsx` | `'invoice-detail'` | `INV-2024-8891` itemized pass-through charges, 3-way match audit, Fedwire clearing. |
| 12 | **Settlement & Ledger** | `BillingDetails.jsx` | `'billing-detail'` | `INV-88291` multi-party carrier payout vs platform margin split, ACH settlement recorder. |
| 13 | **Customer Portal 360** | `CustomerPortal.jsx` | `'customer-portal'` | Shipper CRM profiles (Acme Global, Falcon Aerospace, Pacific Rim), credit facilities, DSO. |
| 14 | **Products & Catalog** | `ProductDashboard.jsx` | `'products'` | Multi-modal freight inventory (Ocean, Air, Rail, Truckload), Cass index sync, rate books. |
| 15 | **Product SKU Details** | `ProductDetails.jsx` | `'product-detail'` | `SKU-OCN-40HC` Reefer machinery specs, dynamic tariff calculation formula. |
| 16 | **Subscriptions List** | `SubscriptionList.jsx` | `'subscriptions'` | Recurring platform contracts, $18.4M ARR metrics, seat allocations, auto-renewals. |
| 17 | **Admin & Compliance** | `AdminReport.jsx` | `'admin-report'` | Immutable SOX-404 audit ledger, delegated commercial authority enforcement, exports. |

---

## Tech Stack & Design System

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Design Tokens**:
  - Primary Blue: `#006196`
  - Secondary Navy: `#116398`
  - Tertiary / Brand Orange: `#f94c10` / `#ea3e07`
  - Neutral Background: `#F7F9FB`
  - Dark Surface Container: `#0d1322`
- **Typography**: Google Fonts Inter & Plus Jakarta Sans
- **Iconography**: Google Material Symbols Outlined

---

## Project Structure

```text
├── index.html                   # HTML entry point with Google Fonts & Material Symbols
├── vite.config.js               # Vite config
├── tailwind.config.js           # Design tokens, color system, and spacing
├── postcss.config.js            # PostCSS configuration
├── package.json                 # Dependencies & build scripts
├── run.bat                      # One-click dev server launcher
├── stop.bat                     # Server process terminator
├── PROJECT.md                   # Project context log
│
└── src/
    ├── main.jsx                 # React root mount
    ├── App.jsx                  # Main router & platform layout
    ├── index.css                # Tailwind directives & glassmorphism utilities
    ├── context/
    │   └── AppContext.jsx       # Shared global state, routes, quotes, approvals, toasts
    ├── components/
    │   ├── Sidebar.jsx          # Collapsible desktop & mobile drawer navigation
    │   ├── Header.jsx           # Global search trigger, notifications, and New Quote CTA
    │   ├── CommandPalette.jsx   # ⌘K / Ctrl+K quick search modal
    │   ├── NewQuotationModal.jsx# Interactive CPQ quotation generator with margin rules
    │   └── Toast.jsx            # Toast alert notifications
    └── pages/                   # All 17 unified DealFlow360 React pages
```

---

## License
Proprietary & Confidential - DealFlow360 Enterprise Logistics.
