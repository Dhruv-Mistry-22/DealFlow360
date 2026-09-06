"""
Fulfillment split API — deterministic warehouse allocation algorithm.
No AI. Pure greedy stock-first algorithm.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.deps import require_internal
from app.models.user import User
from app.models.quote import Quote, QuoteLine, QuoteStatus, VALID_TRANSITIONS
from app.models.product import Warehouse, WarehouseInventory
from app.services.audit_service import write_audit

router = APIRouter()


def _get_stock(db: Session, product_id: int) -> list[dict]:
    """Return warehouses sorted by available stock descending."""
    inventories = (
        db.query(WarehouseInventory)
        .filter(WarehouseInventory.product_id == product_id, WarehouseInventory.stock_quantity > 0)
        .order_by(WarehouseInventory.stock_quantity.desc())
        .all()
    )
    return [
        {
            "warehouse_id": inv.warehouse_id,
            "warehouse_name": inv.warehouse.name,
            "stock_available": inv.stock_quantity,
        }
        for inv in inventories
    ]


@router.get("/quotes/{quote_id}/fulfillment-split")
def get_fulfillment_split(
    quote_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_internal),
) -> dict:
    """
    Deterministic warehouse split algorithm:
    1. For each line, query stock across all warehouses
    2. Fill from warehouse with highest stock first
    3. Split to next warehouse if needed
    4. Remaining = backorder (ETA 7 days)
    """
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(404, "Quote not found")

    if quote.status not in (QuoteStatus.APPROVED,):
        raise HTTPException(400, "Fulfillment split only available for APPROVED quotes")

    lines_result = []
    total_shipment_warehouses = set()
    reasoning_parts = []
    total_backorder = 0

    for line in quote.lines:
        product_name = line.product.name if line.product else f"Product #{line.product_id}"
        qty_required = line.quantity
        stock_list = _get_stock(db, line.product_id)

        allocations = []
        qty_remaining = qty_required

        for stock in stock_list:
            if qty_remaining <= 0:
                break
            allocated = min(qty_remaining, stock["stock_available"])
            if allocated > 0:
                allocations.append({
                    "warehouse_id": stock["warehouse_id"],
                    "warehouse_name": stock["warehouse_name"],
                    "qty_allocated": allocated,
                    "stock_available": stock["stock_available"],
                })
                total_shipment_warehouses.add(stock["warehouse_id"])
                qty_remaining -= allocated

        backorder_qty = max(0, qty_remaining)
        total_backorder += backorder_qty

        # Build reasoning string
        if not allocations:
            reasoning_parts.append(f"{product_name}: No stock available — full backorder of {qty_required}.")
        elif len(allocations) == 1 and backorder_qty == 0:
            reasoning_parts.append(f"{product_name}: Fulfilled from {allocations[0]['warehouse_name']} (full stock).")
        elif len(allocations) > 1:
            alloc_str = ", ".join(f"{a['warehouse_name']} ({a['qty_allocated']})" for a in allocations)
            reasoning_parts.append(f"{product_name}: Split across {alloc_str}.")
        if backorder_qty > 0:
            reasoning_parts.append(f"{product_name}: {backorder_qty} unit(s) on backorder.")

        lines_result.append({
            "line_id": line.id,
            "product_name": product_name,
            "qty_required": qty_required,
            "allocations": allocations,
            "backorder_qty": backorder_qty,
            "backorder_eta_days": 7 if backorder_qty > 0 else 0,
        })

    if total_backorder == 0:
        reasoning_parts.append("No backorders.")

    return {
        "quote_id": quote_id,
        "lines": lines_result,
        "total_shipments": len(total_shipment_warehouses),
        "total_backorder_items": total_backorder,
        "split_reasoning": " ".join(reasoning_parts),
    }


@router.post("/quotes/{quote_id}/accept-split")
def accept_fulfillment_split(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
) -> dict:
    """Confirm fulfillment split — moves quote to FULFILLMENT status."""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(404, "Quote not found")

    allowed = VALID_TRANSITIONS.get(quote.status, [])
    if QuoteStatus.FULFILLMENT not in allowed:
        raise HTTPException(400, f"Cannot move quote from {quote.status} to FULFILLMENT")

    quote.status = QuoteStatus.FULFILLMENT
    write_audit(
        db, "FULFILLMENT_ACCEPTED", "Quote", quote_id,
        actor_id=current_user.id,
        detail={"status": "FULFILLMENT"},
    )
    db.commit()
    return {"success": True, "quote_id": quote_id, "new_status": "FULFILLMENT"}
