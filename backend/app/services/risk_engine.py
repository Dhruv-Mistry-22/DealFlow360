"""
Blended Discount Risk Engine — DETERMINISTIC.

This module must never call an LLM or external service.
All calculations are pure math.

Formula (from Product/System Design):
  overage_i     = max(0, discount_given - category_ceiling)
  weighted_i    = overage_i × (line_value / order_total)
  blended_score = sum(weighted_i) × 100

Escalation:
  worst_line overage > WORST_LINE_OVERAGE_ESCALATE  →  escalate to MANAGER_AND_FINANCE

Routing:
  0  – RISK_MANAGER_THRESHOLD   : NONE
  RISK_MANAGER_THRESHOLD – RISK_FINANCE_THRESHOLD : MANAGER
  RISK_FINANCE_THRESHOLD+       : MANAGER_AND_FINANCE
"""

from dataclasses import dataclass
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.quote import Quote, QuoteLine, ApprovalLevel
from app.models.pricing import DiscountTier

settings = get_settings()


@dataclass
class LineRisk:
    line_id: int
    product_id: int
    category: str
    discount_given: float
    category_ceiling: float
    overage: float
    line_value: float
    weighted: float  # before × 100


@dataclass
class RiskResult:
    blended_score: float
    required_approval_level: ApprovalLevel
    line_risks: list[LineRisk]
    worst_line_overage: float
    escalated: bool
    explanation: str


def _get_ceiling(db: Session, category: str, customer_tier: str) -> float:
    """Fetch category ceiling for a given category+tier. Returns 100 if no rule found."""
    tier = (
        db.query(DiscountTier)
        .filter(
            DiscountTier.product_category == category,
            DiscountTier.customer_tier == customer_tier,
            DiscountTier.product_id == None,
        )
        .first()
    )
    return tier.max_discount_pct if tier else 100.0


def calculate_blended_risk(db: Session, quote: Quote, customer_tier: str) -> RiskResult:
    """
    Calculate the blended discount risk score for the given quote.

    Returns a RiskResult containing the score, required approval level, and per-line detail.
    This is the authoritative calculation — frontend may display it but never override it.
    """
    lines: list[QuoteLine] = quote.lines
    if not lines:
        return RiskResult(
            blended_score=0.0,
            required_approval_level=ApprovalLevel.NONE,
            line_risks=[],
            worst_line_overage=0.0,
            escalated=False,
            explanation="No lines on quote — no risk.",
        )

    # Calculate line values (post-discount, pre-tax)
    line_values = []
    for line in lines:
        discounted_price = line.unit_price * (1 - line.discount_given / 100)
        line_value = discounted_price * line.quantity
        line_values.append(max(0.0, line_value))

    order_total = sum(line_values)
    if order_total <= 0:
        order_total = 1.0  # avoid divide-by-zero

    line_risks: list[LineRisk] = []
    worst_overage = 0.0

    for i, line in enumerate(lines):
        category = line.product.category.value if line.product else "UNKNOWN"
        ceiling = _get_ceiling(db, category, customer_tier)
        overage = max(0.0, line.discount_given - ceiling)
        weighted = overage * (line_values[i] / order_total)
        worst_overage = max(worst_overage, overage)

        # Update line fields in-place for persistence
        line.category_ceiling = ceiling
        line.overage = overage

        line_risks.append(
            LineRisk(
                line_id=line.id,
                product_id=line.product_id,
                category=category,
                discount_given=line.discount_given,
                category_ceiling=ceiling,
                overage=overage,
                line_value=line_values[i],
                weighted=weighted,
            )
        )

    blended_score = sum(lr.weighted for lr in line_risks) * 100

    # Escalation: worst overage > threshold → bump to MANAGER_AND_FINANCE
    escalated = worst_overage > settings.WORST_LINE_OVERAGE_ESCALATE

    if escalated or blended_score >= settings.RISK_FINANCE_THRESHOLD:
        level = ApprovalLevel.MANAGER_AND_FINANCE
    elif blended_score >= settings.RISK_MANAGER_THRESHOLD:
        level = ApprovalLevel.MANAGER
    else:
        level = ApprovalLevel.NONE

    # Build human-readable explanation (deterministic template)
    if level == ApprovalLevel.NONE:
        explanation = f"Blended risk score {blended_score:.1f} — within policy. No approval required."
    elif level == ApprovalLevel.MANAGER:
        explanation = (
            f"Blended risk score {blended_score:.1f} — exceeds {settings.RISK_MANAGER_THRESHOLD}. "
            f"Manager approval required."
        )
    else:
        esc_note = (
            f" Worst line overage {worst_overage:.1f}pp exceeds {settings.WORST_LINE_OVERAGE_ESCALATE}pp escalation threshold."
            if escalated
            else ""
        )
        explanation = (
            f"Blended risk score {blended_score:.1f} — exceeds {settings.RISK_FINANCE_THRESHOLD}.{esc_note} "
            f"Manager + Finance approval required."
        )

    return RiskResult(
        blended_score=round(blended_score, 2),
        required_approval_level=level,
        line_risks=line_risks,
        worst_line_overage=round(worst_overage, 2),
        escalated=escalated,
        explanation=explanation,
    )
