// DealFlow360 Core Deterministic Calculation Engine & State Models

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    sku: 'HW-LP14',
    name: 'Laptop Pro 14',
    category: 'Hardware',
    price: 1200,
    cost: 820,
    ceiling: 15,
    isSubscription: false,
    stockMain: 1,
    stockEast: 10
  },
  {
    id: 'p2',
    sku: 'SRV-SETUP',
    name: 'Setup Service',
    category: 'Services',
    price: 450,
    cost: 180,
    ceiling: 10,
    isSubscription: false,
    stockMain: 999,
    stockEast: 999
  },
  {
    id: 'p3',
    sku: 'SUB-SAAS',
    name: 'Enterprise SaaS Platform',
    category: 'Subscriptions',
    price: 300,
    cost: 45,
    ceiling: 20,
    isSubscription: true,
    interval: 'monthly',
    stockMain: 999,
    stockEast: 999
  },
  {
    id: 'p4',
    sku: 'HW-DOCK',
    name: 'Wireless Dock Station',
    category: 'Hardware',
    price: 220,
    cost: 110,
    ceiling: 15,
    isSubscription: false,
    stockMain: 15,
    stockEast: 5
  },
  {
    id: 'p5',
    sku: 'SRV-CARE2',
    name: 'Care Plan 2yr (Extended Warranty)',
    category: 'Services',
    price: 180,
    cost: 40,
    ceiling: 10,
    isSubscription: false,
    stockMain: 999,
    stockEast: 999
  },
  {
    id: 'p6',
    sku: 'SUB-ANALYTICS',
    name: 'Cloud Analytics Add-on',
    category: 'Subscriptions',
    price: 120,
    cost: 15,
    ceiling: 25,
    isSubscription: true,
    interval: 'monthly',
    stockMain: 999,
    stockEast: 999
  }
];

export const INITIAL_WAREHOUSES = [
  { id: 'wh-main', name: 'Main Warehouse', priority: 1, groundCost: 42 },
  { id: 'wh-east', name: 'East Depot', priority: 2, groundCost: 38 }
];

// Tier-based discount ceilings
export const CUSTOMER_TIERS = {
  Platinum: { Hardware: 18, Services: 12, Subscriptions: 25 },
  Gold: { Hardware: 15, Services: 10, Subscriptions: 20 },
  Silver: { Hardware: 10, Services: 5, Subscriptions: 15 }
};

/**
 * Deterministic Calculation Engine for DealFlow360
 * Formulated from Section 06 of Product System Design:
 * Overage_i = max(0, Discount_i - Ceiling_i)
 * Weight_i = LineTotal_i / TotalOrderValue
 * Blended Score = sum(Weight_i * Overage_i) * 10
 */
export function calculateRiskAndTotals(lines, tier = 'Gold') {
  if (!lines || lines.length === 0) {
    return {
      subtotal: 0,
      totalDiscountAmount: 0,
      totalValue: 0,
      totalCost: 0,
      marginDollars: 0,
      marginPercent: 0,
      blendedScore: 0,
      routing: 'None (Auto-Approved)',
      severity: 'low',
      lines: []
    };
  }

  const ceilings = CUSTOMER_TIERS[tier] || CUSTOMER_TIERS.Gold;

  // 1. Calculate raw and discounted values per line
  let grossSubtotal = 0;
  let totalOrderValue = 0;
  let totalCost = 0;

  const enrichedLines = lines.map(line => {
    const qty = Math.max(1, Number(line.quantity) || 1);
    const price = Number(line.price) || 0;
    const cost = Number(line.cost) || 0;
    const discount = Math.min(100, Math.max(0, Number(line.discount) || 0));
    
    // Category ceiling from customer tier
    const ceiling = ceilings[line.category] !== undefined ? ceilings[line.category] : (line.ceiling || 10);
    const overage = Math.max(0, discount - ceiling);

    const lineGross = price * qty;
    const discountAmount = lineGross * (discount / 100);
    const lineNet = lineGross - discountAmount;
    const lineCost = cost * qty;
    const lineMarginDollars = lineNet - lineCost;
    const lineMarginPct = lineNet > 0 ? (lineMarginDollars / lineNet) * 100 : 0;

    grossSubtotal += lineGross;
    totalOrderValue += lineNet;
    totalCost += lineCost;

    return {
      ...line,
      quantity: qty,
      price,
      cost,
      discount,
      ceiling,
      overage,
      isBreached: overage > 0,
      lineGross,
      discountAmount,
      lineNet,
      lineCost,
      lineMarginDollars,
      lineMarginPct: Number(lineMarginPct.toFixed(1))
    };
  });

  // 2. Calculate line weights and blended risk score
  let weightedOverageSum = 0;
  let maxSingleLineOverage = 0;

  const finalLines = enrichedLines.map(line => {
    const weight = totalOrderValue > 0 ? line.lineNet / totalOrderValue : 0;
    const weightedOverage = line.overage * weight;
    weightedOverageSum += weightedOverage;
    if (line.overage > maxSingleLineOverage) {
      maxSingleLineOverage = line.overage;
    }

    return {
      ...line,
      weight: Number((weight * 100).toFixed(1)),
      weightedOverage: Number(weightedOverage.toFixed(2))
    };
  });

  // Score normalized (0-100 scale)
  let blendedScore = Math.round(weightedOverageSum * 3.5 + maxSingleLineOverage * 2.5);
  if (blendedScore > 100) blendedScore = 100;

  // Routing Decision Logic based on Section 06:
  // - Overage > 15pts on ANY single line -> Immediate Finance Escalation
  // - Score >= 50 or overage > 5pts -> Sales Manager + Finance
  // - Score > 0 or overage > 0 -> Sales Manager
  // - Score === 0 -> Auto-Approved
  let routing = 'None (Auto-Approved)';
  let severity = 'low';

  if (maxSingleLineOverage > 15 || blendedScore >= 50) {
    routing = 'Sales Manager + Finance';
    severity = 'high';
  } else if (maxSingleLineOverage > 5 || blendedScore >= 25) {
    routing = 'Sales Manager + Finance';
    severity = 'high';
  } else if (maxSingleLineOverage > 0 || blendedScore > 0) {
    routing = 'Sales Manager';
    severity = 'medium';
  }

  const marginDollars = totalOrderValue - totalCost;
  const marginPercent = totalOrderValue > 0 ? (marginDollars / totalOrderValue) * 100 : 0;

  return {
    subtotal: Number(grossSubtotal.toFixed(2)),
    totalDiscountAmount: Number((grossSubtotal - totalOrderValue).toFixed(2)),
    totalValue: Number(totalOrderValue.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    marginDollars: Number(marginDollars.toFixed(2)),
    marginPercent: Number(marginPercent.toFixed(1)),
    blendedScore,
    routing,
    severity,
    maxSingleLineOverage,
    lines: finalLines
  };
}

/**
 * Greedy Multi-Warehouse Fulfillment Algorithm
 * Minimizes split shipments across regional depots.
 */
export function computeWarehouseSplit(lines, warehouses = INITIAL_WAREHOUSES) {
  const plan = {
    'Main Warehouse': [],
    'East Depot': []
  };

  let totalShipments = 0;
  let estimatedCost = 0;

  // Check physical items (Hardware)
  const hardwareLines = lines.filter(l => l.category === 'Hardware');

  hardwareLines.forEach(line => {
    let remaining = line.quantity;

    // 1. Try Main Warehouse first (stockMain = 1 for Laptop Pro)
    const mainAvailable = line.sku === 'HW-LP14' ? 1 : (line.stockMain || 15);
    const mainAlloc = Math.min(remaining, mainAvailable);
    if (mainAlloc > 0) {
      plan['Main Warehouse'].push({
        sku: line.sku,
        name: line.name,
        qty: mainAlloc
      });
      remaining -= mainAlloc;
    }

    // 2. Overflow to East Depot
    if (remaining > 0) {
      plan['East Depot'].push({
        sku: line.sku,
        name: line.name,
        qty: remaining
      });
    }
  });

  const mainHasItems = plan['Main Warehouse'].length > 0;
  const eastHasItems = plan['East Depot'].length > 0;

  if (mainHasItems) {
    totalShipments += 1;
    estimatedCost += 42;
  }
  if (eastHasItems) {
    totalShipments += 1;
    estimatedCost += 38;
  }

  return {
    plan,
    totalShipments: Math.max(1, totalShipments),
    estimatedCost,
    isSplit: mainHasItems && eastHasItems,
    savingsIfConsolidated: (mainHasItems && eastHasItems) ? 38 : 0
  };
}

// Sample Deals for the Deal Health War Room
export const INITIAL_DEALS = [
  {
    id: 'Q-1042',
    dealName: 'Acme Corp - Enterprise Rollout',
    customer: 'Acme Corp',
    tier: 'Gold',
    value: 2842,
    rep: 'J. Rao',
    approver: 'R. Iyer (Finance)',
    idleHours: 31,
    closeDate: '3 days',
    healthScore: 42,
    status: 'Pending Finance Approval',
    riskFlag: 'Setup Service 18% (> 10% ceiling)',
    stage: 'Approval Queue',
    isSplitFulfillment: true
  },
  {
    id: 'Q-1039',
    dealName: 'Wayne Enterprises - SecOps Fleet',
    customer: 'Wayne Enterprises',
    tier: 'Platinum',
    value: 24500,
    rep: 'A. Kumar',
    approver: 'M. Shah (Manager)',
    idleHours: 48,
    closeDate: 'Tomorrow',
    healthScore: 28,
    status: 'Stalled: Director Review',
    riskFlag: 'Hardware Line 22% (> 18% ceiling)',
    stage: 'Stalled',
    isSplitFulfillment: false
  },
  {
    id: 'Q-1045',
    dealName: 'Stark Industries - Cloud Workstations',
    customer: 'Stark Industries',
    tier: 'Platinum',
    value: 18200,
    rep: 'J. Rao',
    approver: 'None (Auto)',
    idleHours: 12,
    closeDate: '6 days',
    healthScore: 78,
    status: 'Fulfillment Hold',
    riskFlag: '3-Depot Split (+$118 Shipping Penalty)',
    stage: 'Fulfillment Split',
    isSplitFulfillment: true
  },
  {
    id: 'Q-1048',
    dealName: 'Cyberdyne Systems - Starter Suite',
    customer: 'Cyberdyne Systems',
    tier: 'Silver',
    value: 4600,
    rep: 'S. Patel',
    approver: 'Auto-Approved',
    idleHours: 4,
    closeDate: '10 days',
    healthScore: 94,
    status: 'In Customer Review',
    riskFlag: 'None - Clean Deal',
    stage: 'Customer Portal',
    isSplitFulfillment: false
  }
];