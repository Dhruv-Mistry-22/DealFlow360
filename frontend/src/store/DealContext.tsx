import React, { createContext, useContext, useState } from 'react';
import {
  Quotation,
  Product,
  ApprovalRecord,
  WarehouseStock,
  FulfillmentOrder,
  SubscriptionRecord,
  InvoiceItem,
  DealHealthItem,
  QuoteLineItem,
  CustomerTier
} from '../types/dealflow';
import {
  INITIAL_PRODUCTS,
  INITIAL_QUOTATIONS,
  INITIAL_APPROVALS,
  INITIAL_WAREHOUSES,
  INITIAL_FULFILLMENT_ORDERS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_INVOICES,
  INITIAL_DEAL_HEALTH
} from './initialMockData';

export type ScreenId =
  | 'landing'
  | 's01_auth'
  | 's02_dashboard'
  | 's03_quotations'
  | 's04_builder'
  | 's05_approvals'
  | 's06_approval_detail'
  | 's07_fulfillment'
  | 's08_fulfillment_detail'
  | 's09_subscriptions'
  | 's10_billing_detail'
  | 's11_customer_portal'
  | 's12_invoices'
  | 's13_invoice_detail'
  | 's14_deal_health'
  | 's15_reports'
  | 's16_products'
  | 's17_product_detail'
  | 's18_discount_setup';

export type UserPersona = 'Sales Rep' | 'Sales Manager' | 'Finance Approver' | 'Customer' | 'Admin';

interface DealContextType {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  activePersona: UserPersona;
  setActivePersona: (persona: UserPersona) => void;
  selectedQuoteId: string;
  setSelectedQuoteId: (id: string) => void;
  isGlassBoxOpen: boolean;
  setIsGlassBoxOpen: (open: boolean) => void;

  // Data collections
  products: Product[];
  quotations: Quotation[];
  approvals: ApprovalRecord[];
  warehouses: WarehouseStock[];
  fulfillmentOrders: FulfillmentOrder[];
  subscriptions: SubscriptionRecord[];
  invoices: InvoiceItem[];
  dealHealthItems: DealHealthItem[];

  // Helper computation functions
  calculateQuoteFinancials: (quote: Quotation) => {
    grossTotal: number;
    discountTotal: number;
    netTotal: number;
    totalCost: number;
    profitGross: number;
    marginPct: number;
    blendedRiskScore: number;
    worstLineOverage: number;
    requiredApproval: 'None' | 'Sales Manager' | 'Finance';
    lineBreakdowns: Array<{
      lineId: string;
      productName: string;
      category: string;
      discountGiven: number;
      categoryCeiling: number;
      overage: number;
      lineValue: number;
      weightedOverage: number;
      isOver: boolean;
    }>;
  };

  // State mutations
  updateLineDiscount: (quoteId: string, lineId: string, discount: number) => void;
  updateLineQuantity: (quoteId: string, lineId: string, qtyDelta: number) => void;
  apply13PercentFix: (quoteId: string) => void;
  addUpsellToQuote: (quoteId: string, productId: string) => void;
  submitForApproval: (quoteId: string) => void;
  approveQuote: (quoteId: string, role: string, note?: string) => void;
  returnQuoteForRevision: (quoteId: string, role: string, reason: string) => void;
  submitCustomerCounter: (quoteId: string, counterDiscountPct: number, message: string) => void;
  confirmCustomerQuote: (quoteId: string) => void;
  consolidateFulfillment: (orderId: string) => void;
  recordInvoicePayment: (invoiceId: string) => void;
  nudgeRepAction: (healthId: string) => void;
  escalateDealAction: (healthId: string) => void;
}

const DealContext = createContext<DealContextType | undefined>(undefined);

export const DealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('landing');
  const [activePersona, setActivePersona] = useState<UserPersona>('Sales Rep');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('quote-1042');
  const [isGlassBoxOpen, setIsGlassBoxOpen] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [approvals, setApprovals] = useState<ApprovalRecord[]>(INITIAL_APPROVALS);
  const [warehouses, setWarehouses] = useState<WarehouseStock[]>(INITIAL_WAREHOUSES);
  const [fulfillmentOrders, setFulfillmentOrders] = useState<FulfillmentOrder[]>(INITIAL_FULFILLMENT_ORDERS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(INITIAL_SUBSCRIPTIONS);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [dealHealthItems, setDealHealthItems] = useState<DealHealthItem[]>(INITIAL_DEAL_HEALTH);

  // Pure Deterministic Math Engine according to Spec Section 10 & Design Doc Section 06
  const calculateQuoteFinancials = (quote: Quotation) => {
    let grossTotal = 0;
    let discountTotal = 0;
    let totalCost = 0;

    // First pass: line values and gross sum
    const rawLines = quote.lines.map((l) => {
      const lineGross = l.unitPrice * l.quantity;
      const discountVal = lineGross * (l.discountPct / 100);
      const lineNet = lineGross - discountVal;
      const lineCost = l.cost * l.quantity;

      grossTotal += lineGross;
      discountTotal += discountVal;
      totalCost += lineCost;

      return {
        ...l,
        lineGross,
        discountVal,
        lineNet,
        lineCost
      };
    });

    const netTotal = grossTotal - discountTotal;
    const profitGross = netTotal - totalCost;
    const marginPct = netTotal > 0 ? (profitGross / netTotal) * 100 : 0;

    // Second pass: Blended Risk Score
    let blendedScoreAccumulator = 0;
    let worstLineOverage = 0;

    const lineBreakdowns = rawLines.map((l) => {
      // Step 1: overage_i = max(0, discount_given - category_ceiling)
      const overage = Math.max(0, l.discountPct - l.categoryCeiling);
      if (overage > worstLineOverage) {
        worstLineOverage = overage;
      }

      // Step 2: weighted_i = overage_i * (line_value / order_total)
      const weight = grossTotal > 0 ? l.lineGross / grossTotal : 0;
      const weightedOverage = overage * weight;

      // Step 3: blended_score = sum(weighted_i) * 100
      blendedScoreAccumulator += weightedOverage;

      return {
        lineId: l.id,
        productName: l.name,
        category: l.category,
        discountGiven: l.discountPct,
        categoryCeiling: l.categoryCeiling,
        overage,
        lineValue: l.lineGross,
        weightedOverage: weightedOverage * 100,
        isOver: overage > 0
      };
    });

    // Score normalized 0 - 100
    const blendedRiskScore = Math.min(100, Math.round(blendedScoreAccumulator * 2.5)); // scaled for visual impact per spec

    // Step 4 & 5: Routing decision
    // score 0-25 -> None | 25-50 -> Manager | 50+ -> Manager + Finance
    // Worst-line check: single line overage > 15pts -> escalate to Finance regardless
    let requiredApproval: 'None' | 'Sales Manager' | 'Finance' = 'None';
    if (blendedRiskScore >= 50 || worstLineOverage >= 8) {
      requiredApproval = 'Finance';
    } else if (blendedRiskScore >= 25 || worstLineOverage > 0) {
      requiredApproval = 'Sales Manager';
    } else {
      requiredApproval = 'None';
    }

    return {
      grossTotal,
      discountTotal,
      netTotal,
      totalCost,
      profitGross,
      marginPct,
      blendedRiskScore,
      worstLineOverage,
      requiredApproval,
      lineBreakdowns
    };
  };

  const updateLineDiscount = (quoteId: string, lineId: string, discount: number) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id !== quoteId) return q;
        const newLines = q.lines.map((l) => (l.id === lineId ? { ...l, discountPct: Math.max(0, Math.min(100, discount)) } : l));
        return { ...q, lines: newLines };
      })
    );
  };

  const updateLineQuantity = (quoteId: string, lineId: string, qtyDelta: number) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id !== quoteId) return q;
        const newLines = q.lines.map((l) => (l.id === lineId ? { ...l, quantity: Math.max(1, l.quantity + qtyDelta) } : l));
        return { ...q, lines: newLines };
      })
    );
  };

  // "The 1-Click Fix" from Design Doc
  const apply13PercentFix = (quoteId: string) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id !== quoteId) return q;
        const newLines = q.lines.map((l) => {
          if (l.category === 'Services' && l.discountPct > 13) {
            return { ...l, discountPct: 13 };
          }
          return l;
        });
        return { ...q, lines: newLines };
      })
    );
  };

  const addUpsellToQuote = (quoteId: string, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id !== quoteId) return q;
        if (q.appliedUpsells.includes(productId)) return q;

        const newLine: QuoteLineItem = {
          id: `line-upsell-${Date.now()}`,
          productId: prod.id,
          name: prod.name,
          category: prod.category,
          unitPrice: prod.price,
          cost: prod.cost,
          quantity: 1,
          discountPct: 0,
          categoryCeiling: prod.categoryCeiling,
          isSubscription: prod.isSubscription,
          billingCycle: prod.recurringCycle
        };

        return {
          ...q,
          lines: [...q.lines, newLine],
          appliedUpsells: [...q.appliedUpsells, productId]
        };
      })
    );
  };

  const submitForApproval = (quoteId: string) => {
    const quote = quotations.find((q) => q.id === quoteId);
    if (!quote) return;

    const financials = calculateQuoteFinancials(quote);

    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, stage: 'Pending Approval' } : q))
    );

    setApprovals((prev) => {
      const existing = prev.find((a) => a.quoteId === quoteId);
      const auditEntry = {
        id: `aud-${Date.now()}`,
        timestamp: 'Just now',
        user: activePersona,
        role: activePersona,
        action: 'Submitted Quote for Approval',
        note: `Quote resubmitted. Blended Risk Score: ${financials.blendedRiskScore}. Route: ${financials.requiredApproval}.`
      };

      if (existing) {
        return prev.map((a) =>
          a.quoteId === quoteId
            ? {
                ...a,
                blendedRiskScore: financials.blendedRiskScore,
                requiredStage: financials.requiredApproval as any,
                currentStage: financials.requiredApproval === 'Finance' ? 'Sales Manager' : 'Sales Manager',
                status: 'Pending',
                auditTrail: [auditEntry, ...a.auditTrail]
              }
            : a
        );
      } else {
        return [
          {
            id: `appr-${Date.now()}`,
            quoteId,
            quoteNumber: quote.quoteNumber,
            customerName: quote.customerName,
            customerTier: quote.customerTier,
            blendedRiskScore: financials.blendedRiskScore,
            riskLevel: financials.blendedRiskScore > 40 ? 'HIGH' : 'MEDIUM',
            requiredStage: financials.requiredApproval as any,
            currentStage: 'Sales Manager',
            assignedTo: 'M. Shah',
            status: 'Pending',
            createdAt: '2026-09-05',
            auditTrail: [auditEntry]
          },
          ...prev
        ];
      }
    });

    setActiveScreen('s06_approval_detail');
  };

  const approveQuote = (quoteId: string, role: string, note?: string) => {
    setApprovals((prev) =>
      prev.map((a) => {
        if (a.quoteId !== quoteId) return a;
        const newAudit = {
          id: `aud-${Date.now()}`,
          timestamp: 'Just now',
          user: `${role} Approver`,
          role,
          action: 'Approved Quotation',
          note: note || 'Discount verified against margin model. Cleared for customer delivery.'
        };
        return {
          ...a,
          status: 'Approved',
          currentStage: 'Approved',
          auditTrail: [newAudit, ...a.auditTrail]
        };
      })
    );

    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, stage: 'Approved' } : q))
    );
  };

  const returnQuoteForRevision = (quoteId: string, role: string, reason: string) => {
    setApprovals((prev) =>
      prev.map((a) => {
        if (a.quoteId !== quoteId) return a;
        const newAudit = {
          id: `aud-${Date.now()}`,
          timestamp: 'Just now',
          user: `${role} Reviewer`,
          role,
          action: 'Returned for Revision',
          note: reason || 'Please reduce Service line discount below 13%.'
        };
        return {
          ...a,
          status: 'Returned',
          currentStage: 'Returned',
          auditTrail: [newAudit, ...a.auditTrail]
        };
      })
    );
  };

  const submitCustomerCounter = (quoteId: string, counterDiscountPct: number, message: string) => {
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id !== quoteId) return q;
        return {
          ...q,
          stage: 'Negotiation',
          customerCounter: {
            proposedDiscountPct: counterDiscountPct,
            targetLineId: 'line-2',
            message,
            requestedDeliveryDate: '2026-09-20',
            submittedAt: 'Just now'
          }
        };
      })
    );

    // Auto trigger re-approval if counter exceeds ceiling (Design doc Section 05)
    setApprovals((prev) =>
      prev.map((a) => {
        if (a.quoteId !== quoteId) return a;
        const counterAudit = {
          id: `aud-${Date.now()}`,
          timestamp: 'Just now',
          user: 'Sarah Jenkins (Customer)',
          role: 'Customer Client',
          action: 'Proposed Counter Offer',
          note: `Customer counter-proposed ${counterDiscountPct}% on Setup Service. Breaches ceiling -> Re-approval required.`
        };
        return {
          ...a,
          status: 'Pending',
          currentStage: 'Sales Manager',
          blendedRiskScore: 48,
          auditTrail: [counterAudit, ...a.auditTrail]
        };
      })
    );
  };

  const confirmCustomerQuote = (quoteId: string) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, stage: 'Confirmed' } : q))
    );

    // Generate Invoice INV-1042 automatically
    setInvoices((prev) => [
      {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
        orderId: 'ORD-2341',
        quoteNumber: 'Q-1042',
        customerName: 'Acme Corp',
        type: 'CapEx (One-time)',
        amount: 2730,
        status: 'Unpaid',
        issueDate: '2026-09-05',
        dueDate: '2026-09-19',
        lifecycleStage: 'Invoiced'
      },
      ...prev
    ]);
  };

  const consolidateFulfillment = (orderId: string) => {
    setFulfillmentOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          hasConsolidated: true,
          totalShipments: 1,
          totalFreightCost: 42,
          avoidableSplitLoss: 0,
          status: 'Fulfillment In Progress',
          allocations: [
            {
              warehouseId: 'wh-main',
              warehouseName: 'Main Warehouse (Consolidated via Transfer)',
              productId: 'prod-1',
              productName: 'Laptop Pro 14',
              quantity: 16,
              estimatedCost: 42,
              shipmentCount: 1,
              status: 'Ready'
            }
          ]
        };
      })
    );
  };

  const recordInvoicePayment = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'Paid',
              paidAt: 'Just now (via Odoo Gateway)',
              lifecycleStage: 'Paid'
            }
          : inv
      )
    );
  };

  const nudgeRepAction = (healthId: string) => {
    setDealHealthItems((prev) =>
      prev.map((item) =>
        item.id === healthId ? { ...item, actionTaken: 'Automated Slack & Email Nudge Dispatched' } : item
      )
    );
  };

  const escalateDealAction = (healthId: string) => {
    setDealHealthItems((prev) =>
      prev.map((item) =>
        item.id === healthId ? { ...item, actionTaken: 'Escalated to VP of Sales with Co-Pilot Context' } : item
      )
    );
  };

  return (
    <DealContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        activePersona,
        setActivePersona,
        selectedQuoteId,
        setSelectedQuoteId,
        isGlassBoxOpen,
        setIsGlassBoxOpen,
        products,
        quotations,
        approvals,
        warehouses,
        fulfillmentOrders,
        subscriptions,
        invoices,
        dealHealthItems,
        calculateQuoteFinancials,
        updateLineDiscount,
        updateLineQuantity,
        apply13PercentFix,
        addUpsellToQuote,
        submitForApproval,
        approveQuote,
        returnQuoteForRevision,
        submitCustomerCounter,
        confirmCustomerQuote,
        consolidateFulfillment,
        recordInvoicePayment,
        nudgeRepAction,
        escalateDealAction
      }}
    >
      {children}
    </DealContext.Provider>
  );
};

export const useDealContext = () => {
  const context = useContext(DealContext);
  if (!context) {
    throw new Error('useDealContext must be used within a DealProvider');
  }
  return context;
};
