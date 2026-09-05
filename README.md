# DealFlow360 — Intelligent, Self-Governing Sales Operations Platform

> **An Intelligent Deal Co-Pilot & Sales Engine for B2B Operations**  
> Built for the **Odoo 19 Hackathon** • 100% Spec-Matched Implementation of `DealFlow360.pdf` & `DealFlow360_Product_System_Design.pdf`

---

## 🌟 Executive Overview

Most simple sales tools handle the basics: create a quote, confirm an order, invoice it. Real B2B sales teams operate in messier conditions:
- Multi-level discount approval bottlenecks.
- Partial stock spread across multiple regional depots.
- Bundled recurring subscriptions mixed with one-time CapEx hardware.
- Prolonged email negotiations with customers outside the deal.
- Managers discovering stalled deals after momentum is already lost.

**DealFlow360** is a self-governing deal engine that acts, not just reacts:
1. **Enforces Pricing Discipline**: Automatically calculates the mathematically rigorous **Blended Discount Risk Score** (per-line category ceiling overage + order-level weighted accumulation + single worst-line check) and auto-routes approvals between Sales Manager and Finance without rep manual effort.
2. **The "Glass Box Moment"**: Diagnostic drawer showing line-by-line formula math with progress bars and a **1-click `[Apply 13% Fix]`** button that instantaneously reduces the score and downgrades required approval from Finance to Manager only.
3. **Greedy Multi-Warehouse Splitter**: Real-time stock coverage matrix across Main Warehouse and East Depot, greedy shipment minimization, avoidable freight loss detection, and 1-click backorder consolidation.
4. **Hybrid Billing & Proration Engine**: Reconciles CapEx hardware/services and OpEx recurring plans on a single order with an interactive day-of-month proration slider and simulated credit notes.
5. **Dedicated Customer Negotiation Portal (`/portal`)**: A separate restricted client route with proposal documents, line-level discussion threads, counter-discount proposals, and automated re-approval triggers.
6. **Deal Health War Room**: Real-time operational snapshot detecting stalled deals (>24h), delivery slippage, and rep 90-day discount anomalies.
7. **State-Triggered Deal Co-Pilot Feed**: Real-time event cards (Risk Escalation, Upsell Opportunity, Deal Stalled, Customer Countered) with action buttons and deterministic offline fallback templates.

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18+ (tested on Node v24.20.0)
- **npm**: v9+ (tested on npm 11.19.0)

### 1-Click Launch (Windows)
Double click **`run.bat`** in this directory, or run from terminal:
```cmd
./run.bat
```

### Manual Launch
```cmd
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm.cmd install

# 3. Start Vite dev server
npm.cmd run dev

# 4. Production build verification
npm.cmd run build
```
Once started, navigate to **`http://localhost:5173`** in your browser.

---

## 📐 Architecture & 18-Screen System Map

Directly implements the complete end-to-end blueprint from `DealFlow360 - End to End Product Flow 24 hours oxp.png`:

| Screen # | Screen Name | Role & Core Capability |
|---|---|---|
| **Landing** | Public Gateway | Brand hero from `harsh-uiux`, **Live Deal Sandbox** for looking up `Q-1042 Acme Corp`, 4 Role Gateways, calibrated metrics (`0s delay`, `100% math`, `32.4% margin`), 5 Core Engines showcase, and Spec Section 9 checklist. |
| **Screen 1** | Auth Gate | Dual-tab Sign-In / Sign-Up with 1-click **Judge Demo Personas** (*Sales Rep*, *Sales Manager*, *Finance Approver*, *Customer*, *Admin*). |
| **Screen 2** | Sales Dashboard | Executive cockpit with 3 KPI Cards (*Pending Approvals*, *Open Quotations*, *At-Risk Deals*), Quick Actions (`+ New Quotation`), and live activity feed. |
| **Screen 3** | Quotations Pipeline | Pipeline Kanban & Table view spanning 5 deal stages (*Draft*, *Pending Approval*, *Approved*, *Negotiation*, *Confirmed*). |
| **Screen 4** | Quotation Builder | **3-Panel Cockpit**: Product Picker (left), Live Order Builder with keystroke Gross Margin Bar (center), Deal Co-Pilot Feed (right), and live ceiling check (`+8pt OVER CEILING`). |
| **Overlay** | The Glass Box Drawer | Slides over with step-by-step mathematical proof, progress bars, and a 1-click **`[Apply 13% Fix to Quote]`** button. |
| **Screen 5** | Approvals Queue | Approvals queue filtered by *Pending*, *Returned*, and *Approved*, showing blended risk level and stage. |
| **Screen 6** | Approval Detail | Detailed breakdown of "Why this Quote was Flagged", multi-tier approval stepper, immutable audit trail, and `Approve` / `Return` / `Reject` actions. |
| **Screen 7** | Fulfillment & Stock List | Live stock matrix across *Main Warehouse* and *East Depot*, plus queue of orders awaiting fulfillment. |
| **Screen 8** | Fulfillment Detail | Greedy warehouse split breakdown, split shipment penalty alert, and a 1-click **`[Consolidate Remaining Backorder]`** button saving $28 freight fees. |
| **Screen 9** | Subscriptions List | Active, paused, and cancelled recurring subscription plans. |
| **Screen 10** | Hybrid Billing Detail | CapEx vs OpEx hybrid separation, interactive **Mid-Cycle Proration Slider** (Day 1 to 30), and simulated credit note generator. |
| **Screen 11** | Customer Portal | Dedicated client route (`/portal`) with proposal document, line-item discussion notes, counter-discount proposal tool, automated re-approval warning, and digital signature. |
| **Screen 12** | Invoices List | Unpaid and Paid invoices list for CapEx and OpEx billing lines. |
| **Screen 13** | Invoice Detail | Order to cash lifecycle stepper (`Confirmed` ➔ `Shipped` ➔ `Invoiced` ➔ `Paid`) with 1-click **`[Record Customer Payment]`** action. |
| **Screen 14** | Deal Health War Room | Managerial war room with 3 KPI flags (*Stalled Deals*, *Discount Anomalies*, *Delivery Slippage*) + deals triage table and `[Nudge Rep]` / `[Escalate]` actions. |
| **Screen 15** | Admin Reporting | Period & rep filter controls, high-level metrics, and PDF/XLS export simulation. |
| **Screen 16** | Product Catalog | Master SKU list with price lists, variants, categories, and stock availability. |
| **Screen 17** | Product Detail | Variant attributes (RAM, Color) and customer tier price rules (Gold -10%). |
| **Screen 18** | Discount Setup | Customer tier discount ceilings (Gold: 15%, Silver: 10%, Bronze: 5%), category ceilings, and routing matrix. |

---

## 🧮 Pure Math Specification (Spec Section 10)

Core business rules are implemented in pure deterministic TypeScript — **zero hallucinations, instant response, and explainable logic**:

$$\text{Overage}_i = \max(0, \text{Discount Given}_i - \text{Category Ceiling}_i)$$

$$\text{Weighted Overage}_i = \text{Overage}_i \times \frac{\text{Line Value}_i}{\text{Order Total}}$$

$$\text{Blended Score} = \sum \text{Weighted Overage}_i \times 100$$

### Routing Thresholds:
- **0 – 24**: `Auto-Approved` (Zero delay)
- **25 – 49**: `Sales Manager Approval`
- **50+ OR any single line overage > 15pt**: `Sales Manager followed by Finance Approval`

---

## 🎯 8-Step Judge Verification Walkthrough (Spec Section 9)

1. **Step 1 (Admin Setup)**: Review Gold Tier (15% HW, 10% Serv), 2 Warehouses, and Subscription plans in Screen 18.
2. **Step 2 (Quote Creation)**: Open Screen 4, build quote with Laptop Pro @ 12% and Setup Service @ 18% (`+8pt OVER CEILING` rose alert badge).
3. **Step 3 (Auto-Routing & Glass Box)**: Click Risk Score pill (32 / 100); view exact mathematical formula in the Glass Box Drawer. Click `[Apply 13% Fix]` to downgrade to Manager Only.
4. **Step 4 (Live Upsell)**: Click `+ Care Plan 2yr` in the Upsell suggestion bar; order total and gross margin (32.4%) update immediately.
5. **Step 5 (Multi-Warehouse Split)**: Open Screen 8; observe greedy allocation (10 Main, 6 East). Click `[Consolidate Remaining Backorder]` to merge into 1 shipment and eliminate the $28 split fee.
6. **Step 6 (Hybrid Billing)**: Open Screen 10; observe CapEx ($2,730) separated from OpEx SaaS ($45/mo). Move proration slider to test mid-cycle day-ratio math.
7. **Step 7 (Customer Portal)**: Open Screen 11 (`/portal`); submit a 22% counter-offer on Setup Service. Verify quote status automatically resets to `Under Re-Approval Review`. Click `Sign & Confirm Quotation`.
8. **Step 8 (Invoices & Payment)**: Open Screen 13; click `Record Customer Payment`. Verify invoice changes to `Paid` and payment clears on the lifecycle stepper.

---

## 🛠️ Tech Stack & Directory Structure

```
E:\odoo-hack\UI-UX/
├── index.html                   # HTML entry point with Google Fonts
├── package.json                 # React 18, Vite 6, Tailwind CSS, Lucide React
├── tailwind.config.js           # Brand orange (#f94c10) and dark canvas tokens
├── vite.config.ts               # Vite configuration
├── run.bat                      # 1-click Windows runner
├── README.md                    # System documentation
├── PROJECT.md                   # Project context
├── src/
│   ├── main.tsx                 # React mount
│   ├── App.tsx                  # App shell & router
│   ├── index.css                # Glassmorphism utilities & scrollbars
│   ├── types/
│   │   └── dealflow.ts          # Complete data models
│   ├── store/
│   │   ├── DealContext.tsx      # Central reactive store linking all 18 screens
│   │   └── initialMockData.ts   # Pre-seeded mock data matching Excalidraw wireframe
│   └── components/
│       ├── layout/
│       │   ├── TopHeaderNav.tsx # Universal navbar with tabs and persona switcher
│       │   └── GlassBoxDrawer.tsx # The Glass Box Moment explainable AI math drawer
│       └── screens/
│           ├── S00_LandingPage.tsx      # Landing page from harsh_code.html + Deal Sandbox
│           ├── S01_AuthGate.tsx         # Screen 1: Login / Signup & Persona gate
│           ├── S02_SalesDashboard.tsx   # Screen 2: Sales Dashboard
│           ├── S03_QuotationsList.tsx   # Screen 3: Pipeline Kanban & Table view
│           ├── S04_QuoteWorkspace.tsx   # Screen 4: 3-Panel Builder
│           ├── S05_ApprovalsList.tsx    # Screen 5: Approvals Queue
│           ├── S06_ApprovalDetail.tsx   # Screen 6: Approval Detail & Audit Trail
│           ├── S07_FulfillmentList.tsx  # Screen 7: Warehouse Stock & Awaiting Orders
│           ├── S08_FulfillmentDetail.tsx# Screen 8: Greedy Split & Consolidator
│           ├── S09_SubscriptionsList.tsx# Screen 9: Subscriptions List
│           ├── S10_BillingDetail.tsx    # Screen 10: CapEx vs OpEx Proration
│           ├── S11_CustomerPortal.tsx   # Screen 11: Customer Negotiation Portal (/portal)
│           ├── S12_InvoicesList.tsx     # Screen 12: Invoices List
│           ├── S13_InvoiceDetail.tsx    # Screen 13: Invoice Detail & Payment
│           ├── S14_DealHealthWarRoom.tsx# Screen 14: Deal Health War Room
│           ├── S15_AdminReporting.tsx   # Screen 15: Admin Reporting
│           ├── S16_ProductCatalog.tsx   # Screen 16: Product & Variant Catalog
│           ├── S17_ProductDetail.tsx    # Screen 17: Product Detail
│           └── S18_DiscountSetup.tsx    # Screen 18: Discount Setup
```

---

## 👥 Team & Hackathon Information
- **Project**: DealFlow360 — Intelligent Sales Operations Platform
- **Problem Statement**: B2B Deal Engine, Discount Governance & Hybrid Billing
- **Engine**: Glass Box Deterministic Math + Stateful AI Co-Pilot + SaaS-Grade UX
