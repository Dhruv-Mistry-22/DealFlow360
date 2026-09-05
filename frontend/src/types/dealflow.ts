export type CustomerTier = 'Tier A' | 'Tier B' | 'Tier C' | 'Gold' | 'Silver' | 'Bronze';

export type ProductCategory = 'Hardware' | 'Services' | 'Subscriptions';

export type DealStage = 'Draft' | 'Pending Approval' | 'Approved' | 'Negotiation' | 'Confirmed';

export type ApprovalStage = 'None' | 'Sales Manager' | 'Finance' | 'Auto-Approved';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface QuoteLineItem {
  id: string;
  productId: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  cost: number;
  quantity: number;
  discountPct: number;
  categoryCeiling: number;
  isSubscription?: boolean;
  billingCycle?: 'Monthly' | 'Quarterly' | 'Yearly';
}

export interface UpsellSuggestion {
  id: string;
  productId: string;
  name: string;
  price: number;
  cost: number;
  marginDelta: number;
  promoTag?: string;
  reason: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  note: string;
  stateChange?: string;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerTier: CustomerTier;
  stage: DealStage;
  createdAt: string;
  validUntil: string;
  lines: QuoteLineItem[];
  appliedUpsells: string[];
  repName: string;
  notes?: string;
  customerCounter?: {
    proposedDiscountPct: number;
    targetLineId: string;
    message: string;
    requestedDeliveryDate: string;
    submittedAt: string;
  };
}

export interface ApprovalRecord {
  id: string;
  quoteId: string;
  quoteNumber: string;
  customerName: string;
  customerTier: CustomerTier;
  blendedRiskScore: number;
  riskLevel: RiskLevel;
  requiredStage: ApprovalStage;
  currentStage: 'Sales Manager' | 'Finance' | 'Approved' | 'Returned' | 'Rejected';
  assignedTo: string;
  status: 'Pending' | 'Approved' | 'Returned' | 'Rejected';
  createdAt: string;
  auditTrail: AuditEntry[];
}

export interface WarehouseStock {
  id: string;
  name: string;
  location: string;
  priority: number;
  shippingBaseCost: number;
  inventory: {
    [productId: string]: {
      inStock: number;
      reserved: number;
      available: number;
    };
  };
}

export interface FulfillmentAllocation {
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  quantity: number;
  estimatedCost: number;
  shipmentCount: number;
  status: 'Ready' | 'Backorder';
}

export interface FulfillmentOrder {
  id: string;
  orderNumber: string;
  quoteId: string;
  quoteNumber: string;
  customerName: string;
  status: 'Split Pending' | 'Fulfillment In Progress' | 'Shipped' | 'Backorder';
  allocations: FulfillmentAllocation[];
  totalShipments: number;
  totalFreightCost: number;
  avoidableSplitLoss: number;
  hasConsolidated: boolean;
}

export interface SubscriptionRecord {
  id: string;
  quoteId: string;
  customerName: string;
  planName: string;
  billingCycle: 'Monthly' | 'Quarterly' | 'Yearly';
  amount: number;
  nextBillDate: string;
  status: 'Active' | 'Paused' | 'Cancelled';
  startDate: string;
  prorationApplied?: number;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  orderId: string;
  quoteNumber: string;
  customerName: string;
  type: 'CapEx (One-time)' | 'OpEx (Recurring)';
  amount: number;
  status: 'Unpaid' | 'Paid' | 'Draft';
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  lifecycleStage: 'Order Confirmed' | 'Shipped' | 'Invoiced' | 'Paid';
}

export interface DealHealthItem {
  id: string;
  quoteId: string;
  quoteNumber: string;
  customerName: string;
  dealValue: number;
  issueType: 'Stalled Deal' | 'Discount Anomaly' | 'Delivery Slippage';
  details: string;
  flaggedDate: string;
  daysIdle?: number;
  repName: string;
  rep90DayAvgDiscount: number;
  currentDiscount: number;
  healthScore: number;
  actionTaken?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  cost: number;
  taxPct: number;
  unit: string;
  description: string;
  isSubscription: boolean;
  recurringCycle?: 'Monthly' | 'Quarterly' | 'Yearly';
  categoryCeiling: number;
  stockMain: number;
  stockEast: number;
  attributes?: { [key: string]: string[] };
}
