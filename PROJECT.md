# DealFlow360 — Frontend Application (Self-Governing Sales Operations)

Built for **Person 2 ("The Face" / Frontend Lead)** on the DealFlow360 Hackathon Team.

---

## 1. Project Overview & Aesthetic
* **System Design Origin**: [DealFlow360_Product_System_Design.pdf](file:///E:/odoo-hack/DealFlow360_Product_System_Design.pdf) and [16-screen Excalidraw flow](file:///E:/odoo-hack/DealFlow360%20-%20End%20to%20End%20Product%20Flow%2024%20hours%20oxp.excalidraw).
* **Theme**: Minimal, high-contrast, black-and-white theme inspired by Linear, Vercel, and Shadcn (crisp borders, neutral grays, zero cartoonish clutter).
* **Core Philosophy**: Glass Box Explainable AI with deterministic math — every blended risk score, warehouse split, and proration is calculated live in the client without fake mock delays or random values.

---

## 2. Tech Stack & Architecture
* **Framework**: React 18
* **Build Tool**: Vite v8.2.2 (Build time: ~220ms)
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
* **Icons**: `lucide-react`
* **Local Launcher**: [start-frontend.bat](file:///E:/odoo-hack/start-frontend.bat) (One-click launch on `http://localhost:3000/`)

---

## 3. Application Structure
```
E:\odoo-hack\frontend\src\
├── state\
│   └── dealStore.js            # Deterministic math engine (risk formulas, split algorithms, seed deals)
├── components\
│   ├── common\
│   │   └── Navbar.jsx          # Minimal B&W navigation & Persona Switcher (Rep, Manager, Finance, Customer)
│   ├── workspace\
│   │   ├── QuoteWorkspace.jsx  # 3-Panel cockpit (Catalog, Live Cart, State-Triggered Co-Pilot cards)
│   │   └── GlassBoxDrawer.jsx  # Line-by-line ceiling proof, formula breakdown & 1-click [Apply 13% Fix]
│   ├── modals\
│   │   └── WarehouseSplitModal.jsx # Greedy multi-warehouse allocation & restock consolidation
│   ├── billing\
│   │   └── HybridBillingView.jsx   # One-time vs Recurring dual split, mid-cycle proration, credit notes
│   ├── portal\
│   │   └── CustomerPortalView.jsx  # Client proposal (/portal), counter-discount escalation & digital e-sign
│   ├── dashboard\
│   │   └── DealHealthWarRoom.jsx   # 4 KPI cards, deals triage table, auto-nudge Slack, live audit trail
│   ├── TugaLoginScreen.jsx     # 1:1 Pixel-perfect 2-column login (Ui-refer/Login-signup-2.jpg)
│   └── PhoneOtpScreen.jsx      # 1:1 Pixel-perfect phone & OTP login (Ui-refer/Login-signup.jpg)
├── App.jsx                     # Top-level view router and state coordinator
└── index.css                   # Tailwind v4 import & global styles
```

---

## 4. Live Hackathon Test Flow (All 8 Steps Verified)

1. **Quote Composition & Catalog Search**:
   * Navigate to `Quote Workspace`. Filter catalog by category (Hardware, Services, Subscriptions) or search SKUs.
   * Add or increment quantities with immediate subtotal and margin updates.
2. **Ceiling Breach & Blended Risk Score**:
   * Observe `Setup Service` set to 18% discount (against 10% Gold tier ceiling).
   * Notice inline warning flag `+8pt OVER CEILING` and the bottom bar showing high risk requiring **Sales Manager + Finance** approval.
3. **The Glass Box Drawer**:
   * Click **Score: 32 / View Math →** in the bottom command bar to open the drawer.
   * Review the exact formula $\sum (\text{Overage}_i \times \text{Weight}_i)$, line weights, and visual ceiling progress bars.
   * Click **[Apply 13% Fix]** — discount instantly adjusts, blended score drops, and approval downgrades to **Sales Manager only**.
4. **Co-Pilot Upsell & Proactive Cards**:
   * In the right panel, review the **Upsell Opportunity** card (Care Plan 2yr for Laptop Pro buyers).
   * Click **[Add to Quote]** — product is immediately inserted and cart margins recomputed.
5. **Multi-Warehouse Fulfillment Split**:
   * Click **[Fulfillment Split]** in the bottom bar.
   * View greedy stock allocation between *Main Warehouse* (1 unit) and *East Depot* (1 unit).
   * Review shipping routes, freight costs ($80 total), and the **[Consolidate / Restock]** simulation.
6. **Hybrid Billing & Mid-Cycle Proration**:
   * Click the **Hybrid Billing** tab.
   * Inspect bifurcation of CapEx (One-Time) and OpEx (Recurring SaaS).
   * Adjust the **Billing Start Day of Month** slider to watch the 30-day proration factor update live.
   * Click **[Simulate Credit Note]** to preview automated credit note `CN-2026-09 (-$45.00)`.
7. **Customer Portal & Counter-Discount Escalation**:
   * Switch the top persona dropdown to **Customer: Acme Corp** (or click the **Customer Portal** tab).
   * Review the clean, client-facing PDF-style proposal.
   * Click **[Request Discount Revision]**, enter 20% on Setup Service, and click **[Submit Counter Offer]**.
   * Notice immediate notification that proposal has returned to internal Finance approval queue.
   * Type authorized name and test digital e-signature execution.
8. **Deal Health War Room**:
   * Click the **Deal Health War Room** tab.
   * View 4 high-level KPI cards (Stalled Deals, Policy Breaches, Split Freight Loss, Auto-Approval Rate).
   * Click **[Nudge]** to simulate a Slack/Teams alert to Approver Rohan.
   * Click **[Auto-Fix]** to heal discount anomalies directly from the triage table.

---

## 5. How to Run
```bash
# Option 1: Double-click start-frontend.bat in the root folder
start-frontend.bat

# Option 2: Run via CLI
cd frontend
npm run dev
# App will run on http://localhost:3000/
```
