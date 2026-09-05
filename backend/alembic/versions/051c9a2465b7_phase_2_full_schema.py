"""Phase 2 full schema

Revision ID: 051c9a2465b7
Revises: db7684511c7e
Create Date: 2026-09-05 13:20:36.816343

NOTE: This migration was applied via SQLAlchemy Base.metadata.create_all()
directly on the dev SQLite database. This file documents the schema changes
but the upgrade() is a no-op since tables were created fresh.
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '051c9a2465b7'
down_revision: Union[str, Sequence[str], None] = 'db7684511c7e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Schema already applied via create_all on fresh dev DB. No-op for SQLite."""
    pass


def downgrade() -> None:
    """Drop all Phase 2 tables."""
    op.drop_table('copilot_events')
    op.drop_table('approvals')
    op.drop_table('upsell_relationships')
    op.drop_table('product_variants')
    op.drop_table('price_list_items')
    op.drop_table('discount_tiers')
    op.drop_table('audit_logs')
    op.drop_table('price_lists')
    op.drop_table('customers')
    op.drop_table('approval_configs')
    op.drop_column('products', 'unit')
    op.drop_column('products', 'tax_rate')
    op.drop_column('products', 'is_active')
    op.drop_column('users', 'created_at')
