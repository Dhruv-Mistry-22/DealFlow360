import React, { useState } from 'react';
import { 
  Plus, Minus, Trash2, Search, Sparkles, AlertTriangle, CheckCircle2, 
  TrendingUp, Clock, ExternalLink, ArrowRight, ShieldAlert, FileText 
} from 'lucide-react';
import GlassBoxDrawer from './GlassBoxDrawer';
import { INITIAL_PRODUCTS, calculateRiskAndTotals } from '../../state/dealStore';

export default function QuoteWorkspace({ onOpenFulfillment, onOpenPortal, onOpenBilling }) {
  const [catalogCategory, setCatalogCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Active Quote Lines State (Default Q-1042 from Product System Design)
  const [quoteLines, setQuoteLines] = useState([
    { id: 'p1', sku: 'HW-LP14', name: 'Laptop Pro 14', category: 'Hardware', price: 1200, cost: 820, ceiling: 15, quantity: 2, discount: 12, isSubscription: false },
    { id: 'p2', sku: 'SRV-SETUP', name: 'Setup Service', category: 'Services', price: 450, cost: 180, ceiling: 10, quantity: 1, discount: 18, isSubscription: false }
  ]);

  // Co-Pilot Feed Cards State
  const [coPilotCards, setCoPilotCards] = useState([
    {
      id: 'cp-risk',
      type: 'risk',
      title: 'Risk Escalation',
      time: '2 min ago',
      content: 'Setup Service line crossed category ceiling by 8 pts. Quote now requires Finance approval (was Manager only).',
      suggestion: '→ Reduce Setup Service to 13% to drop back to Manager only.',
      primaryAction: 'Apply 13% Fix',
      secondaryAction: 'Keep & Escalate'
    },
    {
      id: 'cp-upsell',
      type: 'upsell',
      title: 'Upsell Opportunity',
      time: 'Just now',
      content: '3 of last 4 Laptop Pro buyers added Extended Warranty / Care Plan within 30 days.',
      suggestion: 'Adding it here lifts order margin by +2.1% with no ceiling impact.',
      primaryAction: 'Add to Quote',
      secondaryAction: 'Dismiss'
    },
    {
      id: 'cp-stall',
      type: 'stall',
      title: 'Deal Stalled Warning',
      time: '31 hrs ago',
      content: 'Acme Corp quotation has been inactive for 31 hours. Finance approver Rohan last logged in Tuesday.',
      suggestion: 'Close date is in 3 days. Escalation draft prepared for Sales Director.',
      primaryAction: 'Review Draft',
      secondaryAction: 'Snooze 24h'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Live Recalculations
  const quoteData = calculateRiskAndTotals(quoteLines, 'Gold');

  // Quantity Handlers
  const updateQuantity = (id, delta) => {
    setQuoteLines(prev => prev.map(line => {
      if (line.id === id) {
        const newQty = Math.max(1, line.quantity + delta);
        return { ...line, quantity: newQty };
      }
      return line;
    }));
  };

  // Discount Handlers
  const updateDiscount = (id, discountVal) => {
    const val = Math.min(100, Math.max(0, Number(discountVal) || 0));
    setQuoteLines(prev => prev.map(line => line.id === id ? { ...line, discount: val } : line));
  };

  // Add Product from Catalog
  const addProductToQuote = (product) => {
    const existing = quoteLines.find(l => l.id === product.id);
    if (existing) {
      updateQuantity(product.id, 1);
      showToast(`Incremented ${product.name} quantity`);
    } else {
      setQuoteLines(prev => [...prev, { ...product, quantity: 1, discount: 0 }]);
      showToast(`Added ${product.name} to quotation`);
    }
  };

  // Remove Line
  const removeLine = (id) => {
    setQuoteLines(prev => prev.filter(l => l.id !== id));
    showToast('Removed line item');
  };

  // Apply One-Click Fix from Co-Pilot or Drawer
  const applyFix = () => {
    setQuoteLines(prev => prev.map(line => {
      if (line.id === 'p2') {
        return { ...line, discount: 13 };
      }
      return line;
    }));
    // Remove the risk card or update it
    setCoPilotCards(prev => prev.filter(c => c.id !== 'cp-risk'));
    showToast('✓ Setup Service discount adjusted to 13%. Approval downgraded to Manager only.');
  };

  // Add Upsell from Co-Pilot
  const applyUpsell = () => {
    const carePlan = INITIAL_PRODUCTS.find(p => p.id === 'p5');
    if (carePlan) {
      addProductToQuote(carePlan);
      setCoPilotCards(prev => prev.filter(c => c.id !== 'cp-upsell'));
      showToast('✓ Care Plan 2yr added to quote! Margin boosted.');
    }
  };

  // Filter Catalog
  const filteredCatalog = INITIAL_PRODUCTS.filter(p => {
    const matchCat = catalogCategory === 'All' || p.category === catalogCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-10rem)]">
      
      {/* 3-PANEL WORKSPACE GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 pb-20">
        
        {/* LEFT PANEL: PRODUCT CATALOG (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Product Catalog</span>
            <span className="text-[10px] text-neutral-400 font-mono">6 SKUs</span>
          </div>

          {/* Search Box */}
          <div className="relative my-3">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 pb-3 overflow-x-auto">
            {['All', 'Hardware', 'Services', 'Subscriptions'].map(cat => (
              <button
                key={cat}
                onClick={() => setCatalogCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  catalogCategory === cat 
                    ? 'bg-black text-white' 
                    : 'text-neutral-600 bg-neutral-100 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredCatalog.map(p => (
              <div 
                key={p.id}
                className="p-3 rounded-xl border border-neutral-200 hover:border-neutral-400 bg-neutral-50/50 hover:bg-white transition-all flex items-center justify-between gap-2 group shadow-2xs"
              >
                <div>
                  <div className="font-semibold text-xs text-neutral-900 leading-tight">{p.name}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">{p.sku} · Max {p.ceiling}% disc</div>
                  <div className="text-xs font-mono font-bold text-neutral-900 mt-1">
                    ${p.price} <span className="text-[10px] font-normal text-neutral-400">{p.isSubscription ? `/${p.interval}` : ''}</span>
                  </div>
                </div>

                <button
                  onClick={() => addProductToQuote(p)}
                  className="w-7 h-7 rounded-lg bg-white border border-neutral-300 text-neutral-700 hover:bg-black hover:text-white hover:border-black flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  title="Add to quotation"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER PANEL: LIVE ORDER BUILDER (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col p-5">
          
          {/* Quote Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-neutral-950 font-mono tracking-tight">Quotation: Q-1042</h2>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                  Pending Review
                </span>
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                Customer: <strong className="text-neutral-900">Acme Corp</strong> (Gold Tier · Max 15% discount limit)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenPortal}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Customer View</span>
              </button>
            </div>
          </div>

          {/* Cart Table Header */}
          <div className="grid grid-cols-12 text-[11px] font-bold text-neutral-400 uppercase tracking-wider py-3 border-b border-neutral-100 px-1">
            <span className="col-span-4">Item</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Price</span>
            <span className="col-span-2 text-center">Discount</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {/* Order Lines */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 py-1">
            {quoteData.lines.map((line) => {
              const isOver = line.overage > 0;

              return (
                <div key={line.id} className="grid grid-cols-12 items-center py-3 px-1 gap-2 text-xs hover:bg-neutral-50/70 rounded-lg transition-colors">
                  {/* Item info */}
                  <div className="col-span-4">
                    <div className="font-semibold text-neutral-900">{line.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Ceiling: {line.effectiveCeiling}% 
                      {isOver && <span className="text-rose-600 font-bold ml-1.5">+{line.overage}pt OVER</span>}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <button 
                      onClick={() => updateQuantity(line.id, -1)}
                      className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold w-5 text-center">{line.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(line.id, 1)}
                      className="w-5 h-5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Unit Price */}
                  <div className="col-span-2 text-right font-mono text-neutral-600">
                    ${line.price}
                  </div>

                  {/* Discount Input */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="relative w-16">
                      <input 
                        type="number" 
                        value={line.discount}
                        onChange={(e) => updateDiscount(line.id, e.target.value)}
                        className={`w-full h-7 pl-2 pr-5 text-xs font-mono font-bold text-center border rounded-md focus:outline-none transition-all ${
                          isOver ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-neutral-200 bg-white'
                        }`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400">%</span>
                    </div>
                  </div>

                  {/* Row Total & Delete */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="font-mono font-bold text-neutral-900">
                      ${Math.round(line.lineNet)}
                    </span>
                    <button 
                      onClick={() => removeLine(line.id)}
                      className="text-neutral-300 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center Summary Breakdown */}
          <div className="pt-4 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>List Value Subtotal:</span>
              <span className="font-mono font-semibold">${quoteLines.reduce((acc, l) => acc + (l.price * l.quantity), 0)}</span>
            </div>
            <div className="flex justify-between text-neutral-950 font-bold text-sm pt-1 border-t border-neutral-100">
              <span>Net Quotation Value:</span>
              <span className="font-mono">${Math.round(quoteData.totalValue)}</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: DEAL INTELLIGENCE CO-PILOT FEED (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-200 shadow-xs flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider">Deal Co-Pilot Feed</span>
            </div>
            <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">
              State-Triggered
            </span>
          </div>

          {/* Cards Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pt-3">
            {coPilotCards.map(card => {
              const isRisk = card.type === 'risk';
              const isUpsell = card.type === 'upsell';
              const isStall = card.type === 'stall';

              return (
                <div 
                  key={card.id}
                  className={`p-3.5 rounded-xl border bg-white shadow-2xs space-y-2 transition-all ${
                    isRisk 
                      ? 'border-l-4 border-l-rose-500 border-neutral-200' 
                      : isUpsell 
                        ? 'border-l-4 border-l-emerald-500 border-neutral-200' 
                        : 'border-l-4 border-l-amber-500 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                      {isRisk && <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />}
                      {isUpsell && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                      {isStall && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{card.title}</span>
                    </span>
                    <span className="text-neutral-400 text-[10px] font-mono">{card.time}</span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-snug">
                    {card.content}
                  </p>

                  <div className="text-[11px] font-medium text-neutral-800 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                    {card.suggestion}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        if (isRisk) applyFix();
                        if (isUpsell) applyUpsell();
                        if (isStall) showToast('Escalation draft sent to Sales Director');
                      }}
                      className="flex-1 h-7 text-[11px] font-bold bg-neutral-900 hover:bg-black text-white rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{card.primaryAction}</span>
                    </button>
                    <button
                      onClick={() => setCoPilotCards(prev => prev.filter(c => c.id !== card.id))}
                      className="px-2.5 h-7 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 rounded-md transition-colors cursor-pointer"
                    >
                      {card.secondaryAction}
                    </button>
                  </div>
                </div>
              );
            })}

            {coPilotCards.length === 0 && (
              <div className="text-center py-12 text-neutral-400 text-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <span>All deal health conditions optimal. Co-pilot watching state.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* PERSISTENT BOTTOM COMMAND BAR */}
      <div className="fixed bottom-0 inset-x-0 h-16 bg-white border-t border-neutral-200 z-30 px-6 flex items-center justify-between shadow-lg">
        
        {/* Left: Financial & Risk Summary */}
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Total Net Value</span>
            <div className="font-mono font-black text-base text-neutral-950">
              ${Math.round(quoteData.totalValue)}
            </div>
          </div>

          <div className="h-7 w-[1px] bg-neutral-200" />

          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Live Margin</span>
            <div className="font-mono font-bold text-sm text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{quoteData.overallMargin}% (Healthy)</span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-neutral-200" />

          {/* Interactive Blended Risk Score Button (Opens Drawer) */}
          <div>
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Blended Risk Score</span>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                quoteData.severity === 'high'
                  ? 'bg-rose-100 text-rose-700 border border-rose-200 hover:bg-rose-200'
                  : quoteData.severity === 'medium'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
              title="Click to view Glass Box math breakdown"
            >
              <span>Score: {quoteData.blendedScore}</span>
              <span className="text-[10px] underline">View Math →</span>
            </button>
          </div>

          <div className="h-7 w-[1px] bg-neutral-200 hidden sm:block" />

          <div className="hidden sm:block">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Required Approval</span>
            <div className="text-xs font-semibold text-neutral-900">
              {quoteData.routing}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFulfillment}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 transition-all cursor-pointer"
          >
            Fulfillment Split
          </button>
          <button
            onClick={() => {
              if (quoteData.routing === 'None') {
                showToast('✓ Quote auto-approved! Ready for client confirmation.');
              } else {
                showToast(`✓ Submitted for ${quoteData.routing} approval queue.`);
              }
            }}
            className="px-5 py-2 text-xs font-bold rounded-lg bg-black hover:bg-neutral-800 active:scale-[0.99] text-white shadow-xs transition-all cursor-pointer"
          >
            {quoteData.routing === 'None' ? 'Confirm & Finalize' : 'Submit for Approval'}
          </button>
        </div>

      </div>

      {/* Glass Box Diagnostic Drawer */}
      <GlassBoxDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        quoteData={quoteData}
        onApplyFix={applyFix}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}

    </div>
  );
}