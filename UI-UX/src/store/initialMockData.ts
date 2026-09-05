import { Product, Quotation, ApprovalRecord, WarehouseStock, FulfillmentOrder, SubscriptionRecord, InvoiceItem, DealHealthItem } from '../types/dealflow';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Laptop Pro 14',
    category: 'Hardware',
    price: 1200,
    cost: 820,
    taxPct: 18,
    unit: 'Each',
    description: '14-inch flagship business workstation with M3-tier performance',
    isSubscription: false,
    categoryCeiling: 15,
    stockMain: 40,
    stockEast: 10,
    attributes: { RAM: ['16GB', '32GB'], Color: ['Space Gray', 'Silver'] }
  },
  {
    id: 'prod-2',
    name: 'Onsite Setup Service',
    category: 'Services',
    price: 450,
    cost: 180,
    taxPct: 18,
    unit: 'Each',
    description: 'Professional on-premise installation, identity setup & network hardening',
    isSubscription: false,
    categoryCeiling: 10,
    stockMain: 999,
    stockEast: 999
  },
  {
    id: 'prod-3',
    name: 'Care Plan 2yr',
    category: 'Subscriptions',
    price: 45,
    cost: 10,
    taxPct: 18,
    unit: 'Month',
    description: '24-month comprehensive SLA, zero-downtime hardware swap warranty',
    isSubscription: true,
    recurringCycle: 'Monthly',
    categoryCeiling: 20,
    stockMain: 999,
    stockEast: 999
  },
  {
    id: 'prod-4',
    name: 'Wireless Docking Station',
    category: 'Hardware',
    price: 220,
    cost: 110,
    taxPct: 18,
    unit: 'Each',
    description: 'Dual 4K Thunderbolt 4 dock with 100W Power Delivery pass-through',
    isSubscription: false,
    categoryCeiling: 15,
    stockMain: 65,
    stockEast: 5
  },
  {
    id: 'prod-5',
    name: 'Extended Warranty',
    category: 'Services',
    price: 180,
    cost: 40,
    taxPct: 18,
    unit: 'Each',
    description: '12-month tier-1 replacement coverage',
    isSubscription: false,
    categoryCeiling: 15,
    stockMain: 999,
    stockEast: 999
  },
  {
    id: 'prod-6',
    name: 'Wireless Ergonomic Mouse',
    category: 'Hardware',
    price: 45,
    cost: 18,
    taxPct: 18,
    unit: 'Each',
    description: 'Precision Bluetooth laser mouse with quiet clicks',
    isSubscription: false,
    categoryCeiling: 15,
    stockMain: 120,
    stockEast: 40
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'quote-1042',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    customerTier: 'Gold',
    stage: 'Pending Approval',
    createdAt: '2026-09-02',
    validUntil: '2026-09-16',
    repName: 'J. Rao',
    appliedUpsells: [],
    lines: [
      {
        id: 'line-1',
        productId: 'prod-1',
        name: 'Laptop Pro 14',
        category: 'Hardware',
        unitPrice: 1200,
        cost: 820,
        quantity: 2,
        discountPct: 12,
        categoryCeiling: 15
      },
      {
        id: 'line-2',
        productId: 'prod-2',
        name: 'Onsite Setup Service',
        category: 'Services',
        unitPrice: 450,
        cost: 180,
        quantity: 1,
        discountPct: 18,
        categoryCeiling: 10
      },
      {
        id: 'line-3',
        productId: 'prod-5',
        name: 'Extended Warranty',
        category: 'Services',
        unitPrice: 180,
        cost: 40,
        quantity: 1,
        discountPct: 10,
        categoryCeiling: 15
      }
    ]
  },
  {
    id: 'quote-1039',
    quoteNumber: 'Q-1039',
    customerName: 'Beta Industries',
    customerTier: 'Silver',
    stage: 'Pending Approval',
    createdAt: '2026-08-30',
    validUntil: '2026-09-14',
    repName: 'M. Mehta',
    appliedUpsells: [],
    lines: [
      {
        id: 'line-39',
        productId: 'prod-1',
        name: 'Laptop Pro 14',
        category: 'Hardware',
        unitPrice: 1200,
        cost: 820,
        quantity: 20,
        discountPct: 22,
        categoryCeiling: 10
      }
    ]
  },
  {
    id: 'quote-1035',
    quoteNumber: 'Q-1035',
    customerName: 'Nova Retail',
    customerTier: 'Gold',
    stage: 'Approved',
    createdAt: '2026-08-28',
    validUntil: '2026-09-12',
    repName: 'J. Rao',
    appliedUpsells: [],
    lines: [
      {
        id: 'line-35',
        productId: 'prod-4',
        name: 'Wireless Docking Station',
        category: 'Hardware',
        unitPrice: 220,
        cost: 110,
        quantity: 40,
        discountPct: 8,
        categoryCeiling: 15
      }
    ]
  },
  {
    id: 'quote-1038',
    quoteNumber: 'Q-1038',
    customerName: 'Zenith Co',
    customerTier: 'Bronze',
    stage: 'Negotiation',
    createdAt: '2026-09-01',
    validUntil: '2026-09-15',
    repName: 'A. Patel',
    appliedUpsells: [],
    lines: [
      {
        id: 'line-38',
        productId: 'prod-1',
        name: 'Laptop Pro 14',
        category: 'Hardware',
        unitPrice: 1200,
        cost: 820,
        quantity: 15,
        discountPct: 9,
        categoryCeiling: 5
      }
    ]
  },
  {
    id: 'quote-1041',
    quoteNumber: 'Q-1041',
    customerName: 'Orion Ltd',
    customerTier: 'Gold',
    stage: 'Confirmed',
    createdAt: '2026-08-25',
    validUntil: '2026-09-08',
    repName: 'J. Rao',
    appliedUpsells: [],
    lines: [
      {
        id: 'line-41',
        productId: 'prod-1',
        name: 'Laptop Pro 14',
        category: 'Hardware',
        unitPrice: 1200,
        cost: 820,
        quantity: 30,
        discountPct: 10,
        categoryCeiling: 15
      }
    ]
  }
];

export const INITIAL_APPROVALS: ApprovalRecord[] = [
  {
    id: 'appr-1042',
    quoteId: 'quote-1042',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    customerTier: 'Gold',
    blendedRiskScore: 32,
    riskLevel: 'HIGH',
    requiredStage: 'Finance',
    currentStage: 'Sales Manager',
    assignedTo: 'M. Shah',
    status: 'Pending',
    createdAt: '2026-09-02',
    auditTrail: [
      {
        id: 'aud-1',
        timestamp: 'Aug 20, 10:15 AM',
        user: 'J. Rao',
        role: 'Sales Rep',
        action: 'Submitted Quote',
        note: 'Initial 12% Hardware and 18% Setup Service discount requested'
      },
      {
        id: 'aud-2',
        timestamp: 'Aug 21, 02:40 PM',
        user: 'M. Shah',
        role: 'Sales Manager',
        action: 'Reviewed & Conditional Approve',
        note: 'Requested line-item gross margin justification before forwarding to Finance'
      },
      {
        id: 'aud-3',
        timestamp: 'Aug 22, 11:05 AM',
        user: 'J. Rao',
        role: 'Sales Rep',
        action: 'Resubmitted with Commentary',
        note: 'Customer agreed to add 2yr Care Plan if setup fee discounted'
      }
    ]
  },
  {
    id: 'appr-1039',
    quoteId: 'quote-1039',
    quoteNumber: 'Q-1039',
    customerName: 'Beta Industries',
    customerTier: 'Silver',
    blendedRiskScore: 54,
    riskLevel: 'HIGH',
    requiredStage: 'Finance',
    currentStage: 'Finance',
    assignedTo: 'R. Iyer',
    status: 'Pending',
    createdAt: '2026-08-30',
    auditTrail: [
      {
        id: 'aud-39',
        timestamp: 'Aug 30, 04:20 PM',
        user: 'M. Mehta',
        role: 'Sales Rep',
        action: 'Submitted High-Value Deal',
        note: 'Laptop Pro bulk order with 22% discount requested'
      }
    ]
  },
  {
    id: 'appr-1035',
    quoteId: 'quote-1035',
    quoteNumber: 'Q-1035',
    customerName: 'Nova Retail',
    customerTier: 'Gold',
    blendedRiskScore: 12,
    riskLevel: 'LOW',
    requiredStage: 'Auto-Approved',
    currentStage: 'Approved',
    assignedTo: 'System Engine',
    status: 'Approved',
    createdAt: '2026-08-28',
    auditTrail: [
      {
        id: 'aud-35',
        timestamp: 'Aug 28, 09:00 AM',
        user: 'System Engine',
        role: 'Policy Daemon',
        action: 'Auto-Approved',
        note: 'All line items within Gold tier ceiling parameters'
      }
    ]
  }
];

export const INITIAL_WAREHOUSES: WarehouseStock[] = [
  {
    id: 'wh-main',
    name: 'Main Warehouse',
    location: 'Central Depot - North Zone',
    priority: 1.0,
    shippingBaseCost: 42,
    inventory: {
      'prod-1': { inStock: 40, reserved: 18, available: 22 },
      'prod-4': { inStock: 65, reserved: 12, available: 53 },
      'prod-6': { inStock: 120, reserved: 20, available: 100 }
    }
  },
  {
    id: 'wh-east',
    name: 'East Depot',
    location: 'Regional Hub - East Zone',
    priority: 2.0,
    shippingBaseCost: 28,
    inventory: {
      'prod-1': { inStock: 10, reserved: 6, available: 4 },
      'prod-4': { inStock: 5, reserved: 2, available: 3 },
      'prod-6': { inStock: 40, reserved: 5, available: 35 }
    }
  }
];

export const INITIAL_FULFILLMENT_ORDERS: FulfillmentOrder[] = [
  {
    id: 'ful-1042',
    orderNumber: 'ORD-2341',
    quoteId: 'quote-1042',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    status: 'Split Pending',
    totalShipments: 2,
    totalFreightCost: 70,
    avoidableSplitLoss: 28,
    hasConsolidated: false,
    allocations: [
      {
        warehouseId: 'wh-main',
        warehouseName: 'Main Warehouse',
        productId: 'prod-1',
        productName: 'Laptop Pro 14',
        quantity: 10,
        estimatedCost: 42,
        shipmentCount: 1,
        status: 'Ready'
      },
      {
        warehouseId: 'wh-east',
        warehouseName: 'East Depot',
        productId: 'prod-1',
        productName: 'Laptop Pro 14',
        quantity: 6,
        estimatedCost: 28,
        shipmentCount: 1,
        status: 'Ready'
      }
    ]
  },
  {
    id: 'ful-1038',
    orderNumber: 'ORD-2340',
    quoteId: 'quote-1038',
    quoteNumber: 'Q-1038',
    customerName: 'Zenith Co',
    status: 'Backorder',
    totalShipments: 1,
    totalFreightCost: 28,
    avoidableSplitLoss: 0,
    hasConsolidated: false,
    allocations: [
      {
        warehouseId: 'wh-east',
        warehouseName: 'East Depot',
        productId: 'prod-1',
        productName: 'Laptop Pro 14',
        quantity: 15,
        estimatedCost: 28,
        shipmentCount: 1,
        status: 'Backorder'
      }
    ]
  }
];

export const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 'sub-1',
    quoteId: 'quote-1042',
    customerName: 'Acme Corp',
    planName: 'Care Plan 2yr',
    billingCycle: 'Monthly',
    amount: 45,
    nextBillDate: 'Sep 15, 2026',
    status: 'Active',
    startDate: '2026-08-15'
  },
  {
    id: 'sub-2',
    quoteId: 'quote-1039',
    customerName: 'Beta Industries',
    planName: 'Enterprise Support SLA',
    billingCycle: 'Quarterly',
    amount: 180,
    nextBillDate: 'Nov 01, 2026',
    status: 'Active',
    startDate: '2026-08-01'
  },
  {
    id: 'sub-3',
    quoteId: 'quote-1031',
    customerName: 'Delta LLC',
    planName: 'Care Plan 1yr',
    billingCycle: 'Monthly',
    amount: 35,
    nextBillDate: '-',
    status: 'Paused',
    startDate: '2026-05-10'
  }
];

export const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: 'inv-1042',
    invoiceNumber: 'INV-1042',
    orderId: 'ORD-2341',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    type: 'CapEx (One-time)',
    amount: 2730,
    status: 'Unpaid',
    issueDate: '2026-09-02',
    dueDate: '2026-09-16',
    lifecycleStage: 'Invoiced'
  },
  {
    id: 'inv-1043',
    invoiceNumber: 'INV-1043',
    orderId: 'ORD-2341',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    type: 'OpEx (Recurring)',
    amount: 45,
    status: 'Paid',
    issueDate: '2026-09-02',
    dueDate: '2026-09-16',
    paidAt: '2026-09-02 11:30 AM',
    lifecycleStage: 'Paid'
  },
  {
    id: 'inv-1041',
    invoiceNumber: 'INV-1041',
    orderId: 'ORD-2339',
    quoteNumber: 'Q-1035',
    customerName: 'Nova Retail',
    type: 'CapEx (One-time)',
    amount: 8750,
    status: 'Paid',
    issueDate: '2026-08-28',
    dueDate: '2026-09-12',
    paidAt: '2026-08-30 04:15 PM',
    lifecycleStage: 'Paid'
  }
];

export const INITIAL_DEAL_HEALTH: DealHealthItem[] = [
  {
    id: 'dh-1',
    quoteId: 'quote-1042',
    quoteNumber: 'Q-1042',
    customerName: 'Acme Corp',
    dealValue: 2730,
    issueType: 'Stalled Deal',
    details: 'Quotation inactive for 3 days awaiting Finance response',
    flaggedDate: 'Aug 24, 2026',
    daysIdle: 3,
    repName: 'J. Rao',
    rep90DayAvgDiscount: 10.5,
    currentDiscount: 13.8,
    healthScore: 42,
    actionTaken: 'Nudge sent'
  },
  {
    id: 'dh-2',
    quoteId: 'quote-1039',
    quoteNumber: 'Q-1039',
    customerName: 'Beta LLC',
    dealValue: 28600,
    issueType: 'Discount Anomaly',
    details: 'Discount 22% is 14% above M. Mehta 90-day rep historical average (8%)',
    flaggedDate: 'Aug 25, 2026',
    daysIdle: 2,
    repName: 'M. Mehta',
    rep90DayAvgDiscount: 8.0,
    currentDiscount: 22.0,
    healthScore: 28,
    actionTaken: 'Escalated to Manager'
  },
  {
    id: 'dh-3',
    quoteId: 'quote-1045',
    quoteNumber: 'Q-1045',
    customerName: 'Stark Industries',
    dealValue: 14200,
    issueType: 'Delivery Slippage',
    details: 'Warehouse split penalty incurring $38 avoidable freight cost',
    flaggedDate: 'Aug 26, 2026',
    daysIdle: 1,
    repName: 'J. Rao',
    rep90DayAvgDiscount: 10.5,
    currentDiscount: 9.0,
    healthScore: 78
  }
];
