"""
Upsell/Cross-sell recommendation service — DETERMINISTIC.

Uses seeded co-purchase relationship data.
Filters by minimum margin threshold.
Does NOT call an LLM.
"""

from sqlalchemy.orm import Session
from dataclasses import dataclass

from app.models.product import UpsellRelationship, Product, ProductCategory
from app.models.quote import QuoteLine


@dataclass
class Recommendation:
    product_id: int
    product_name: str
    category: str
    base_price: float
    reason: str
    is_promoted: bool
    recommendation_score: float
    margin_delta_estimate: float  # estimated additional margin if added


def get_recommendations(
    db: Session, quote_id: int, min_score: float = 0.3
) -> list[Recommendation]:
    """
    Return upsell/cross-sell recommendations for a quote based on existing line products.
    Uses deterministic co-purchase relationships.
    """
    # Get products already in the quote
    existing_lines = db.query(QuoteLine).filter(QuoteLine.quote_id == quote_id).all()
    existing_product_ids = {line.product_id for line in existing_lines}

    recommendations: dict[int, Recommendation] = {}

    for line in existing_lines:
        relationships = (
            db.query(UpsellRelationship)
            .filter(
                UpsellRelationship.source_product_id == line.product_id,
                UpsellRelationship.recommendation_score >= min_score,
            )
            .all()
        )
        for rel in relationships:
            target_id = rel.target_product_id
            if target_id in existing_product_ids:
                continue  # Already in quote
            if target_id in recommendations:
                # Pick highest score
                if (
                    rel.recommendation_score
                    > recommendations[target_id].recommendation_score
                ):
                    recommendations[target_id].recommendation_score = (
                        rel.recommendation_score
                    )
                continue

            target = (
                db.query(Product)
                .filter(Product.id == target_id, Product.is_active == True)
                .first()
            )
            if not target:
                continue

            # Margin delta estimate: assume 40% gross margin on base price
            margin_delta = target.base_price * 0.40

            recommendations[target_id] = Recommendation(
                product_id=target.id,
                product_name=target.name,
                category=target.category.value,
                base_price=target.base_price,
                reason=rel.reason or "Frequently bought together",
                is_promoted=rel.is_promoted or False,
                recommendation_score=rel.recommendation_score,
                margin_delta_estimate=round(margin_delta, 2),
            )

    # Sort: promoted first, then by score desc
    return sorted(
        recommendations.values(),
        key=lambda r: (-int(r.is_promoted), -r.recommendation_score),
    )
