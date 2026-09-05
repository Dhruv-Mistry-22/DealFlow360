import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { ShieldAlert, Clock, CheckCircle2, ChevronRight, Filter } from 'lucide-react';

export const S05_ApprovalsList: React.FC = () => {
  const { approvals, setActiveScreen, setSelectedQuoteId } = useDealContext();
  const [tabFilter, setTabFilter] = useState<'Pending' | 'Returned' | 'Approved'>('Pending');

  const filteredApprovals = approvals.filter((a) => a.status === tabFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Discount Governance</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Approvals Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every quotation that exceeded ceilings or requires multi-level discount authorization.
          </p>
        </div>

        <div className="flex rounded-lg bg-[#0D1322] border border-white/10 p-1">
          {(['Pending', 'Returned', 'Approved'] as const).map((tab) => {
            const count = approvals.filter((a) => a.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setTabFilter(tab)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors ${
                  tabFilter === tab ? 'bg-brand-orange text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Approvals Table matching Excalidraw Screen 5 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="py-3 px-4">Quotation</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Customer Tier</th>
              <th className="py-3 px-4">Blended Risk</th>
              <th className="py-3 px-4">Approval Stage</th>
              <th className="py-3 px-4">Assigned Reviewer</th>
              <th className="py-3 px-4">Submitted Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredApprovals.map((appr) => (
              <tr
                key={appr.id}
                onClick={() => {
                  setSelectedQuoteId(appr.quoteId);
                  setActiveScreen('s06_approval_detail');
                }}
                className="hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-mono font-bold text-white">{appr.quoteNumber}</td>
                <td className="py-3 px-4 font-semibold text-white">{appr.customerName}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[11px]">
                    {appr.customerTier}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                      appr.riskLevel === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : appr.riskLevel === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {appr.riskLevel} ({appr.blendedRiskScore})
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-200">{appr.requiredStage}</td>
                <td className="py-3 px-4 text-slate-400">{appr.assignedTo}</td>
                <td className="py-3 px-4 text-slate-400">{appr.createdAt}</td>
                <td className="py-3 px-4 text-right">
                  <button className="px-3 py-1 rounded bg-brand-orange/20 text-brand-orange hover:bg-brand-orange hover:text-white font-bold text-[11px] transition-colors">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
