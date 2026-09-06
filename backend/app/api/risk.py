"""
Risk breakdown API — dedicated endpoint for the Glass Box Risk Drawer.
Returns per-line risk data plus approval path and fix suggestions.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user, require_internal
from app.models.user import User
from app.models.quote import Quote, QuoteLine
from app.models.customer import Customer
from app.services.quote_service import update_line
from app.core.config import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/quotes/{quote_id}/risk")
def get_risk_breakdown(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
) -> dict:
    """Return full risk breakdown for the Glass Box drawer."""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(404, "Quote not found")

    customer = db.query(Customer).filter(Customer.id == quote.customer_id).first()

    line_risks = []
    for line in quote.lines:
        product_name = line.product.name if line.product else f"Product #{line.product_id}"
        category = line.product.category.value if line.product else "UNKNOWN"
        is_over = line.overage > 0
        status = "OVER" if is_over else "OK"

        line_risks.append({
            "line_id": line.id,
            "product_id": line.product_id,
            "product_name": product_name,
            "category": category,
            "discount_given": line.discount_given,
            "category_ceiling": line.category_ceiling,
            "overage": round(line.overage, 2),
            "line_total": line.line_total,
            "status": status,
            # For fix suggestion: how much to reduce to go below Finance threshold
            "suggested_discount": max(0.0, line.category_ceiling) if is_over else line.discount_given,
        })

    # Approval path
    score = quote.blended_risk_score
    level = quote.required_approval_level.value

    if level == "NONE":
        approval_path = ["AUTO_APPROVED"]
        path_description = f"Score {score:.1f} is below {settings.RISK_MANAGER_THRESHOLD} — auto-approved."
    elif level == "MANAGER":
        approval_path = ["MANAGER"]
        path_description = f"Score {score:.1f} requires Manager sign-off (threshold: {settings.RISK_MANAGER_THRESHOLD})."
    else:
        approval_path = ["MANAGER", "FINANCE"]
        path_description = f"Score {score:.1f} requires Manager + Finance approval (threshold: {settings.RISK_FINANCE_THRESHOLD})."

    # Fix suggestions — pick the line with the highest overage
    fix_suggestions = []
    overages = [l for l in line_risks if l["overage"] > 0]
    if overages:
        worst = max(overages, key=lambda x: x["overage"])
        fix_suggestions.append({
            "line_id": worst["line_id"],
            "product_name": worst["product_name"],
            "current_discount": worst["discount_given"],
            "suggested_discount": worst["suggested_discount"],
            "message": (
                f"Reduce {worst['product_name']} discount from "
                f"{worst['discount_given']}% to {worst['suggested_discount']}% "
                f"to eliminate the overage on this line."
            ),
        })

    return {
        "quote_id": quote_id,
        "blended_score": score,
        "required_approval_level": level,
        "approval_path": approval_path,
        "path_description": path_description,
        "line_risks": line_risks,
        "fix_suggestions": fix_suggestions,
        "customer_tier": customer.tier.value if customer else "STANDARD",
    }


@router.patch("/quotes/{quote_id}/lines/{line_id}/fix-discount")
def apply_fix_discount(
    quote_id: int,
    line_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_internal),
) -> dict:
    """Apply the suggested discount fix to a line — called from the Apply Fix button."""
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(404, "Quote not found")

    line = db.query(QuoteLine).filter(
        QuoteLine.id == line_id,
        QuoteLine.quote_id == quote_id,
    ).first()
    if not line:
        raise HTTPException(404, "Line not found")

    # The fix: set discount to exactly the category ceiling
    suggested = line.category_ceiling
    updated_quote = update_line(db, quote_id, line_id, None, suggested, current_user.id)

    return {
        "success": True,
        "line_id": line_id,
        "new_discount": suggested,
        "new_blended_score": updated_quote.blended_risk_score,
        "new_required_level": updated_quote.required_approval_level.value,
    }
