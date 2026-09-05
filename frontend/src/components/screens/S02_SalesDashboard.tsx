import React from 'react';
import { useDealContext } from '../../store/DealContext';
import { ShieldAlert, FileText, CheckCircle2, Clock, Plus, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';

export const S02_SalesDashboard: React.FC = () => {
  const { setActiveScreen, setSelectedQuoteId, quotations, approvals, dealHealthItems } = useDealContext();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const openQuotesCount = quotations.length;
  const atRiskCount = dealHealthItems.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Central Deal Operations</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Sales Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline governance, automated discount routing, and fulfillment health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedQuoteId('quote-1042');
              setActiveScreen('s04_builder');
            }}
            className="px-4 py-2.5 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Quotation</span>
          </button>

          <button
            onClick={() => setActiveScreen('s05_approvals')}
            className="px-4 py-2.5 rounded-lg bg-[#131B2E] hover:bg-[#1B253D] border border-white/10 text-white text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <span>View Approvals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Large KPI Cards from Screen 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Pending Approvals */}
        <div
          onClick={() => setActiveScreen('s05_approvals')}
          className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 hover:border-brand-orange/40 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">{pendingApprovalsCount}</div>
          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
            <span>{pendingApprovalsCount} quotations awaiting manager/finance</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 2: Open Quotations */}
        <div
          onClick={() => setActiveScreen('s03_quotations')}
          className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 hover:border-brand-orange/40 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Open Quotations</span>
            <div className="w-9 h-9 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">{openQuotesCount}</div>
          <p className="text-xs text-slate-300 mt-2 flex items-center gap-1.5">
            <span>12 active deals in sales pipeline</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 3: At-Risk Deals */}
        <div
          onClick={() => setActiveScreen('s14_deal_health')}
          className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 hover:border-brand-orange/40 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">At-Risk Deals</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">{atRiskCount}</div>
          <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
            <span>{atRiskCount} flagged by Deal Health War Room</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </div>

      {/* Recent Operational Activity & Live Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Activity Feed */}
        <div className="lg:col-span-6 bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Activity</h3>
            <span className="text-[11px] text-brand-orange font-semibold">Live System Events</span>
          </div>

          <div className="space-y-3.5">
            {[
              {
                time: '12m ago',
                user: 'Finance Approver (R. Iyer)',
                text: 'Acme Corp quotation (Q-1042) approved by Finance',
                chip: 'Approved',
                color: 'text-emerald-400 bg-emerald-500/10'
              },
              {
                time: '35m ago',
                user: 'Customer (Beta Industries)',
                text: 'Beta Industries requested a discount change to 22%',
                chip: 'Under Negotiation',
                color: 'text-telemetry-blue bg-telemetry-blue/10'
              },
              {
                time: '1h ago',
                user: 'Logistics Daemon',
                text: 'East Depot stock updated for Order #ORD-2341 (6 units allocated)',
                chip: 'Stock Sync',
                color: 'text-amber-400 bg-amber-500/10'
              },
              {
                time: '2h ago',
                user: 'Sales Rep (J. Rao)',
                text: 'Added Care Plan 2yr upsell on quote Q-1042 (Margin lifted +2.1%)',
                chip: 'Upsell Added',
                color: 'text-brand-orange bg-brand-orange/10'
              }
            ].map((act, i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-[#131B2E] border border-white/5">
                <div>
                  <div className="text-xs font-semibold text-white">{act.text}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                    <span>{act.user}</span>
                    <span>•</span>
                    <span>{act.time}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${act.color}`}>
                  {act.chip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Quotations Snapshot */}
        <div className="lg:col-span-6 bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Quotations</h3>
            <button
              onClick={() => setActiveScreen('s03_quotations')}
              className="text-[11px] text-brand-orange hover:text-white font-semibold transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {quotations.slice(0, 4).map((q) => (
              <div
                key={q.id}
                onClick={() => {
                  setSelectedQuoteId(q.id);
                  setActiveScreen('s04_builder');
                }}
                className="p-3 rounded-xl bg-[#131B2E] hover:bg-[#1B253D] border border-white/5 hover:border-brand-orange/30 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
                    {q.quoteNumber} — {q.customerName}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Tier: {q.customerTier} • Rep: {q.repName}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.stage === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : q.stage === 'Pending Approval'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {q.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
