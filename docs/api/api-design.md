# API Design

This document details the REST API endpoints for DealFlow360.

Status markers:
- [P] PLANNED
- [I] IN PROGRESS
- [D] DONE

## /api/v1/auth
- [P] `POST /login` - Authenticate user and return JWT.
- [P] `POST /register` - Register a new user.

## /api/v1/users
- [P] `GET /` - List internal users.
- [P] `GET /{id}` - Get user details.

## /api/v1/customers
- [P] `GET /` - List customers.
- [P] `POST /` - Create a customer.

## /api/v1/products
- [P] `GET /` - List products.
- [P] `GET /{id}` - Get product details.

## /api/v1/price-lists
- [P] `GET /` - List price lists for discount logic.

## /api/v1/discounts
- [P] `GET /tiers` - List discount tiers and ceilings.

## /api/v1/quotes
- [P] `GET /` - List quotes.
- [P] `POST /` - Create a new quote.
- [P] `GET /{id}` - Get quote details including lines.
- [P] `PATCH /{id}` - Update quote details.
- [P] `POST /{id}/lines` - Add a line item.
- [P] `PATCH /{id}/lines/{line_id}` - Update a line item.

## /api/v1/approvals
- [P] `GET /` - List pending approvals.
- [P] `POST /{id}/action` - Approve or reject a quote.

## /api/v1/warehouses
- [P] `GET /` - List warehouses.

## /api/v1/inventory
- [P] `GET /` - View live stock.

## /api/v1/subscriptions
- [P] `GET /` - List recurring plans.

## /api/v1/fulfillment
- [P] `POST /split` - Recommend/confirm warehouse split for a quote.

## /api/v1/billing
- [P] `POST /generate` - Generate invoice for a confirmed quote.

## /api/v1/portal
- [P] `GET /quotes/{id}` - Customer view of a quote.
- [P] `POST /quotes/{id}/negotiate` - Submit customer counter-offer.
- [P] `POST /quotes/{id}/confirm` - Customer accepts quote.

## /api/v1/deal-health
- [P] `GET /` - Dashboard stats (stalled deals, anomalies, etc).

## /api/v1/copilot
- [P] `GET /feed/{quote_id}` - Get co-pilot events for a deal.
