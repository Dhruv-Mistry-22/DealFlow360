from datetime import datetime
from pydantic import BaseModel, Field
from app.models.quote import QuoteStatus, ApprovalLevel


class QuoteLineCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)
    discount_given: float = Field(default=0.0, ge=0.0, le=100.0)
    variant_id: int | None = None


class QuoteLineUpdate(BaseModel):
    quantity: int | None = Field(default=None, ge=1)
    discount_given: float | None = Field(default=None, ge=0.0, le=100.0)


class FulfillmentSplitOut(BaseModel):
    id: int
    quote_line_id: int
    warehouse_id: int
    quantity_allocated: int
    warehouse_name: str | None = None

    class Config:
        from_attributes = True


class QuoteLineOut(BaseModel):
    id: int
    product_id: int
    variant_id: int | None
    quantity: int
    unit_price: float
    discount_given: float
    tax_rate: float
    line_total: float
    margin_pct: float
    category_ceiling: float
    overage: float
    splits: list[FulfillmentSplitOut] = []

    class Config:
        from_attributes = True


class QuoteCreate(BaseModel):
    customer_id: int
    notes: str | None = None


class QuoteOut(BaseModel):
    id: int
    customer_id: int
    sales_rep_id: int
    status: QuoteStatus
    subtotal: float
    order_discount_pct: float
    tax_amount: float
    total_amount: float
    margin_pct: float
    blended_risk_score: float
    required_approval_level: ApprovalLevel
    notes: str | None
    created_at: datetime | None = None
    lines: list[QuoteLineOut] = []

    class Config:
        from_attributes = True


class ApprovalOut(BaseModel):
    id: int
    quote_id: int
    approver_id: int | None
    level: str
    status: str
    comment: str | None

    class Config:
        from_attributes = True


class ApprovalAction(BaseModel):
    action: str  # "APPROVE", "REJECT", "RETURN"
    comment: str | None = None
