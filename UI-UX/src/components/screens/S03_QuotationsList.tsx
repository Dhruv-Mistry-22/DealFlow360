import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { Plus, LayoutGrid, List, ChevronRight, ShieldAlert, ArrowRight } from 'lucide-react';
import { DealStage } from '../../types/dealflow';

export const S03_QuotationsList: React.FC = () => {
  const { quotations, setActiveScreen, setSelectedQuoteId, calculateQuoteFinancials } = useDealContext();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const stages: DealStage[] = ['Draft', 'Pending Approval', 'Approved', 'Negotiation', 'Confirmed'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Pipeline Management</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Quotations & Deals
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every quotation in the system, one card per deal. Click any deal to open the live builder and co-pilot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-[#0D1322] border border-white/10 p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-brand-orange text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-brand-orange text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedQuoteId('quote-1042');
              setActiveScreen('s04_builder');
            }}
            className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Quotation</span>
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        /* Kanban Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageQuotes = quotations.filter((q) => q.stage === stage);

            return (
              <div key={stage} className="bg-[#0D1322] border border-white/10 rounded-2xl p-4 flex flex-col min-h-[500px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{stage}</span>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300">
                    {stageQuotes.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1">
                  {stageQuotes.map((q) => {
                    const financials = calculateQuoteFinancials(q);

                    return (
                      <div
                        key={q.id}
                        onClick={() => {
                          setSelectedQuoteId(q.id);
                          setActiveScreen('s04_builder');
                        }}
                        className="p-4 rounded-xl bg-[#131B2E] hover:bg-[#1B253D] border border-white/10 hover:border-brand-orange/40 cursor-pointer transition-all shadow-md group"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
                            {q.customerName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                            {q.quoteNumber}
                          </span>
                        </div>

                        <div className="mt-2 text-sm font-black text-white font-mono">
                          ${financials.netTotal.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Tier: {q.customerTier}</span>
                          <span
                            className={`font-mono font-bold ${
                              financials.blendedRiskScore > 40
                                ? 'text-rose-400'
                                : financials.blendedRiskScore > 20
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            Risk: {financials.blendedRiskScore}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#0D1322] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Quote #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Rep</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Margin %</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quotations.map((q) => {
                const financials = calculateQuoteFinancials(q);

                return (
                  <tr
                    key={q.id}
                    onClick={() => {
                      setSelectedQuoteId(q.id);
                      setActiveScreen('s04_builder');
                    }}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-white">{q.quoteNumber}</td>
                    <td className="py-3 px-4 font-semibold text-white">{q.customerName}</td>
                    <td className="py-3 px-4">{q.customerTier}</td>
                    <td className="py-3 px-4 text-slate-400">{q.repName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${financials.netTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                      {financials.marginPct.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          financials.blendedRiskScore > 40
                            ? 'bg-rose-500/20 text-rose-300'
                            : financials.blendedRiskScore > 20
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {financials.blendedRiskScore}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 font-semibold text-[10px]">
                        {q.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-400 inline-block" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
