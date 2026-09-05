import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import {
  Plus,
  Minus,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Boxes,
  Send,
  Save,
  Clock,
  TrendingUp,
  Tag
} from 'lucide-react';
import { ProductCategory } from '../../types/dealflow';

export const S04_QuoteWorkspace: React.FC = () => {
  const {
    quotations,
    selectedQuoteId,
    products,
    updateLineDiscount,
    updateLineQuantity,
    addUpsellToQuote,
    calculateQuoteFinancials,
    setIsGlassBoxOpen,
    apply13PercentFix,
    submitForApproval
  } = useDealContext();

  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'All'>('All');

  const quote = quotations.find((q) => q.id === selectedQuoteId) || quotations[0];
  const financials = calculateQuoteFinancials(quote);

  const filteredProducts =
    categoryFilter === 'All' ? products : products.filter((p) => p.category === categoryFilter);

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              {quote.quoteNumber}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {quote.customerName} — Deal Builder Cockpit
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
              Tier: {quote.customerTier}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Assigned Rep: {quote.repName} • Pricing rules enforced against Odoo 19 tier ceilings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGlassBoxOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all flex items-center gap-2 hover:scale-105"
          >
            <Cpu className="w-4 h-4 text-brand-orange" />
            <span>Glass Box Math</span>
          </button>

          <button
            onClick={() => submitForApproval(quote.id)}
            className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit for Approval</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Layout from Design Document Section 05 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PANEL 1: Left (3 cols) - Product Picker */}
        <div className="lg:col-span-3 bg-[#0D1322] border border-white/10 rounded-2xl p-4 flex flex-col h-[700px] shadow-xl">
          <div className="pb-3 border-b border-white/10">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">Product Catalog</span>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {['All', 'Hardware', 'Services', 'Subscriptions'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat as any)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                    categoryFilter === cat ? 'bg-brand-orange text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items List */}
          <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 mt-3">
            {filteredProducts.map((p) => {
              const baseMargin = Math.round(((p.price - p.cost) / p.price) * 100);

              return (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-[#131B2E] border border-white/5 hover:border-brand-orange/30 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {p.category} • Ceiling: {p.categoryCeiling}%
                      </div>
                    </div>
                    <button
                      onClick={() => addUpsellToQuote(quote.id, p.id)}
                      className="w-6 h-6 rounded bg-brand-orange/20 hover:bg-brand-orange text-brand-orange hover:text-white flex items-center justify-center transition-colors shadow-sm"
                      title="Add to Quote"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-white">
                      ${p.price.toLocaleString()}
                      {p.isSubscription && <span className="text-[10px] text-slate-400">/mo</span>}
                    </span>
                    <span className="text-emerald-400 font-semibold">{baseMargin}% margin</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: Center (6 cols) - Live Order Builder & Margin Bar */}
        <div className="lg:col-span-6 bg-[#0D1322] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl min-h-[700px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quotation Line Items</h2>
              <span className="text-xs text-slate-400 font-mono">{quote.lines.length} products attached</span>
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              {quote.lines.map((line) => {
                const isOver = line.discountPct > line.categoryCeiling;
                const overagePts = Math.max(0, line.discountPct - line.categoryCeiling);
                const lineNet = line.unitPrice * line.quantity * (1 - line.discountPct / 100);

                return (
                  <div
                    key={line.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isOver
                        ? 'bg-[#1B1D28] border-rose-500/40 shadow-rose-950/20 shadow-md'
                        : 'bg-[#131B2E] border-white/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{line.name}</span>
                          <span className="text-[10px] text-slate-400">({line.category})</span>
                          {isOver ? (
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>+{overagePts}pt OVER CEILING</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Within Policy
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">
                          ${line.unitPrice.toLocaleString()} base • Category Limit: {line.categoryCeiling}%
                        </div>
                      </div>

                      {/* Quantity & Discount Controls */}
                      <div className="flex items-center gap-3">
                        {/* Qty Counter */}
                        <div className="flex items-center rounded-lg bg-slate-900 border border-white/10 p-1">
                          <button
                            onClick={() => updateLineQuantity(quote.id, line.id, -1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono font-bold text-xs text-white">{line.quantity}</span>
                          <button
                            onClick={() => updateLineQuantity(quote.id, line.id, 1)}
                            className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Inline Discount Field */}
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-lg px-2 py-1">
                          <span className="text-[11px] text-slate-400">Disc:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={line.discountPct}
                            onChange={(e) => updateLineDiscount(quote.id, line.id, Number(e.target.value))}
                            className="w-10 bg-transparent text-right font-mono font-bold text-xs text-white outline-none"
                          />
                          <span className="text-[11px] text-slate-400">%</span>
                        </div>

                        {/* Line Net Total */}
                        <div className="w-20 text-right font-mono font-bold text-xs text-white">
                          ${lineNet.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Upsell Suggestions Bar from Wireframe Screen 4 */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#131B2E] to-[#1B253D] border border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upsell and Cross-Sell Suggestions (Live Co-Purchase Model)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'prod-6', name: '+ Wireless Mouse', badge: 'Margin: +$18' },
                  { id: 'prod-4', name: '+ Docking Station', badge: 'Promo: 12% off' },
                  { id: 'prod-3', name: '+ Care Plan 2yr', badge: 'Margin: +$45' }
                ].map((up) => (
                  <button
                    key={up.id}
                    onClick={() => addUpsellToQuote(quote.id, up.id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-brand-orange/20 border border-white/10 hover:border-brand-orange/40 text-left transition-colors flex items-center justify-between group"
                  >
                    <span className="text-xs font-semibold text-white group-hover:text-brand-orange">{up.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">{up.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Running Totals & Live Margin Bar */}
          <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
            <div className="grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[11px]">Gross Subtotal</span>
                <span className="text-sm font-bold text-white">
                  ${financials.grossTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Discount</span>
                <span className="text-sm font-bold text-rose-400">
                  -${financials.discountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Net Order Value</span>
                <span className="text-base font-black text-brand-orange">
                  ${financials.netTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Gross Margin Bar */}
            <div className="p-3 rounded-xl bg-[#131B2E] border border-white/10">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gross Profit Margin</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {financials.marginPct.toFixed(1)}% (${financials.profitGross.toLocaleString(undefined, { minimumFractionDigits: 2 })} profit)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, financials.marginPct * 2)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 3: Right (3 cols) - Deal Intelligence Feed (State-Triggered Co-Pilot) */}
        <div className="lg:col-span-3 bg-[#0D1322] border border-white/10 rounded-2xl p-4 flex flex-col h-[700px] shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Deal Co-Pilot Feed</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
              ● Active Listeners
            </span>
          </div>

          <div className="space-y-3.5 overflow-y-auto flex-1 pr-1">
            {/* Card 1: Red Risk Escalation */}
            {financials.worstLineOverage > 0 && (
              <div className="p-3.5 rounded-xl bg-[#131B2E] border-l-4 border-l-rose-500 border-t border-r border-b border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Risk Escalation</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">2 min ago</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Setup Service crossed category ceiling by <strong>8 pts</strong>. Quote now requires Finance approval
                  (was Manager only).
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => apply13PercentFix(quote.id)}
                    className="flex-1 py-1 px-2 rounded bg-brand-orange hover:bg-brand-deepOrange text-white text-[11px] font-bold transition-colors"
                  >
                    [Apply 13% Fix]
                  </button>
                  <button
                    onClick={() => submitForApproval(quote.id)}
                    className="py-1 px-2 rounded bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold transition-colors"
                  >
                    Keep & Escalate
                  </button>
                </div>
              </div>
            )}

            {/* Card 2: Green Upsell Opportunity */}
            <div className="p-3.5 rounded-xl bg-[#131B2E] border-l-4 border-l-emerald-500 border-t border-r border-b border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upsell Opportunity</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">just now</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                3 of last 4 Laptop Pro buyers added Care Plan 2yr within 30 days. Adding it here lifts margin by{' '}
                <strong>+2.1%</strong> with no ceiling impact.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => addUpsellToQuote(quote.id, 'prod-3')}
                  className="flex-1 py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors"
                >
                  [Add Care Plan 2yr]
                </button>
              </div>
            </div>

            {/* Card 3: Amber Stalled Deal */}
            <div className="p-3.5 rounded-xl bg-[#131B2E] border-l-4 border-l-amber-500 border-t border-r border-b border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deal Inactivity Flag</span>
                </span>
                <span className="text-slate-500 font-mono text-[10px]">31 hrs ago</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Acme Corp quotation inactive for 31 hours. Finance approver Rohan last logged in Tuesday.
              </p>
              <div className="flex gap-2 pt-1">
                <button className="flex-1 py-1 px-2 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 text-[11px] font-bold transition-colors">
                  [Review Draft]
                </button>
                <button className="py-1 px-2 rounded bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold transition-colors">
                  Snooze 24h
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Command Bar */}
      <div className="glass-metric-bar rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/15 shadow-2xl">
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Gross Margin</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{financials.marginPct.toFixed(1)}%</span>
          </div>

          <button
            onClick={() => setIsGlassBoxOpen(true)}
            className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left"
          >
            <div>
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Blended Risk Score</span>
              <span className="font-mono font-black text-rose-400 text-sm">
                {financials.blendedRiskScore} / 100 — Requires {financials.requiredApproval}
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => submitForApproval(quote.id)}
            className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-lg shadow-brand-orange/30 transition-all flex items-center gap-2 active:scale-95"
          >
            <span>Confirm & Submit for Approval</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
