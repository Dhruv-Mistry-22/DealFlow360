# Database Schema

The DealFlow360 data model is designed for PostgreSQL.

## Core Entities

### User & Authentication
- **User**: internal system users (Reps, Managers, Finance, Admin).
- **Role**: RBAC definition.

### Catalog & Pricing
- **Product**: General info (Name, Category).
- **ProductVariant**: Variations (Size/Pack).
- **PriceList**: Base pricing tied to Customer Tiers.
- **DiscountTier**: Defines ceilings for discount approval paths.
- **ApprovalRule**: Defines who needs to approve based on blended risk score.
- **SubscriptionPlan**: Defines recurring intervals (Monthly/Yearly).

### CRM
- **Customer**: External clients. Associates with a customer tier (Standard, Gold).

### Deal Execution
- **Quote**: Represents the order. Tracks status (Draft, Pending Approval, Under Negotiation, Confirmed).
- **QuoteLine**: Products/Subscriptions within a quote. Tracks line-level discount and overage.
- **Approval**: Links a quote to an approval request with status and audit log.
- **NegotiationMessage**: Line-level or quote-level comments and counter-offers from the portal.
- **AuditLog**: Immutable ledger of all state changes, who made them, and why.

### Fulfillment & Inventory
- **Warehouse**: Physical locations (Main, East Depot).
- **Inventory**: Stock count per product variant per warehouse.
- **Fulfillment**: The warehouse split decision for a confirmed quote.
- **Shipment**: Tracking individual shipments.
- **Backorder**: Tracks items waiting for stock.
- **ReplenishmentRule**: ETAs for stock.

### Billing
- **Subscription**: Active recurring billing instances.
- **Invoice**: A generated bill.
- **InvoiceLine**: Specific lines (one-time or recurring segment).
- **Payment**: Payment records.

### AI & Intelligence
- **DealAlert**: Anomaly or stall flags.
- **CopilotEvent**: The underlying state change that triggered reasoning.
- **CopilotMessage**: The generated narrative card shown in the Deal Intelligence Feed.

## Migrations
Alembic is used to track and apply database changes. Do not manually modify the database schema; always create an Alembic revision.
