# DealFlow360 — Self-Governing Sales Operations Engine

> **A minimal, high-contrast, black-and-white sales operations cockpit featuring explainable AI, greedy multi-warehouse allocation, dual hybrid billing, and proactive deal health triage.**

[![React 18](https://img.shields.io/badge/React-18.x-black?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-black?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-black?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Design](https://img.shields.io/badge/Aesthetic-Monochrome_Linear_Style-black?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)]()

---

## 📖 Executive Summary

Traditional ERP quotation interfaces are static, passive forms where sales reps spend hours cross-referencing discount policy sheets, guessing warehouse availability, and chasing managers across Slack.

**DealFlow360** re-architects quotation operations into an active, deterministic co-pilot:
1. **Explainable AI ("The Glass Box Moment")**: Zero opaque recommendations. Every risk score is calculated via transparent mathematical formulas visible down to line-item weights.
2. **Greedy Multi-Warehouse Allocation**: Minimizes split shipments and freight loss across regional depots in real time.
3. **Dual CapEx/OpEx Hybrid Billing**: Separates one-time hardware/setup fees from recurring SaaS subscriptions, complete with a live mid-cycle proration calculator.
4. **Client-Facing Negotiation Portal**: Lets customers propose counter-discounts, with automated safeguards returning quotes to internal approval queues if thresholds are breached.
5. **Deal Health War Room**: Surfaces stalled sign-offs (>24h), pricing anomalies, and enables one-click automated nudges and auto-healing.

---

## 🖥️ Live Core Modules

```
DealFlow360 Navigation (Tabbed Cockpit + Real-Time Persona Switcher)
├── 1. Quote Workspace (3-Panel Cockpit: Catalog, Cart with inline breach flags, Co-Pilot Feed)
├── 2. The Glass Box Drawer (Explainable AI formula breakdown + 1-click [Apply 13% Fix])
├── 3. Multi-Warehouse Split Modal (Main Hub vs East Depot greedy routing + restock trigger)
├── 4. Hybrid Billing Engine (CapEx vs OpEx bifurcation + 30-day proration slider + Credit Notes)
├── 5. Customer Portal (Clean client proposal view + Counter-discount review trigger + E-Sign)
├── 6. Deal Health War Room (4 KPI cards + Pipeline triage table + Auto-Nudge + Audit stream)
└── 7. Reference Auth Studio (1:1 Pixel-perfect Tuga 2-Column & Phone OTP screens)
```

---

## 🧮 Mathematical Proofs & Algorithms

### 1. Blended Risk Score (Section 06 Policy Standard)
$$\text{Overage}_i = \max(0, \text{Discount}_i - \text{Ceiling}_i)$$
$$\text{Weight}_i = \frac{\text{Line Total}_i}{\text{Total Order Value}}$$
$$\text{Weighted Overage} = \sum (\text{Overage}_i \times \text{Weight}_i)$$
$$\text{Blended Score} = \min(100, \text{Round}(\text{Weighted Overage} \times 3.5 + \text{Max Line Overage} \times 2.5))$$

* **Score 0–25**: Auto-Approved (Zero-touch dispatch)
* **Score 25–50**: Sales Manager Approval
* **Score 50+ or any single line overage > 5pts**: Sales Manager + Finance Approver

---

## 🚀 Quickstart Guide

### Prerequisites
* **Node.js**: v18.0 or higher
* **npm**: v9.0 or higher

### Option 1: One-Click Run (Windows)
Double-click the launcher in the root directory:
```bash
start-frontend.bat
```

### Option 2: Command Line
```bash
# 1. Clone repository
git clone https://github.com/Dhruv-Mistry-22/DealFlow360.git
cd DealFlow360

# 2. Checkout ui-v1 branch
git checkout ui-v1

# 3. Enter frontend directory
cd frontend

# 4. Install dependencies
npm install

# 5. Launch development server
npm run dev
```
The application will be live at: **`http://localhost:3000/`**

---

## 🧪 8-Step Hackathon Judge Walkthrough

1. **Quote Composition & Search**: Open `Quote Workspace`. Filter catalog by category (Hardware, Services, Subscriptions) and observe live gross/net totals.
2. **Ceiling Breach & Blended Score**: Observe `Setup Service` line flagged with `+8pt OVER CEILING` (18% discount vs 10% Gold tier ceiling). Command bar indicates required **Sales Manager + Finance** approval.
3. **The Glass Box Moment**: Click **Score: 32 / View Math →** to slide out the diagnostic drawer. Inspect line weights and ceiling bars. Click **`[Apply 13% Fix]`** — watch score drop and approval downgrade to **Sales Manager only**.
4. **Proactive Co-Pilot Upsell**: On the right panel card, click **`[Add to Quote]`** on the Care Plan 2yr recommendation — observe immediate cart insertion and margin increase.
5. **Multi-Warehouse Fulfillment Split**: Click **`[Fulfillment Split]`** in the bottom command bar. View greedy allocation of Laptop Pro 14 across Main Warehouse (1 unit) and East Depot (1 unit), total freight cost ($80), and simulate inventory consolidation.
6. **Hybrid Billing & Mid-Cycle Proration**: Switch to the **Hybrid Billing** tab. Drag the **Billing Start Day of Month** slider to inspect dynamic 30-day proration. Click **`[Simulate Credit Note]`** to preview draft `CN-2026-09 (-$45.00)`.
7. **Customer Portal & Escalation**: Change the top persona switcher to **Customer: Acme Corp**. Review the formal client document. Click **`[Request Discount Revision]`**, propose a 20% discount on Setup Service, and observe the immediate alert that the proposal has returned to the internal approval queue. Complete digital e-signature.
8. **Deal Health War Room**: Open the **Deal Health War Room** tab. Review 4 high-level KPI cards. Click **`[Nudge]`** to simulate an automated alert to approver Rohan, or **`[Auto-Fix]`** to heal pricing anomalies directly from the triage table.

---

## 👥 Hackathon Team Attribution

* **Person 1 (Backend Lead)**: Odoo 19 Data Models, XML-RPC & Postgres Integration
* **Person 2 (Frontend & UI Lead)**: **Chaitany Thakar** ([@chaitany851P](https://github.com/chaitany851P)) — React 18, Tailwind v4 UI, Glass Box Engine, Dynamic Workspaces
* **Person 3 (AI / Logic Lead)**: Co-Pilot Suggestion Engine & Risk Algorithms
