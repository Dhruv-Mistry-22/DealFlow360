import React from 'react';
import { useDealContext } from '../../store/DealContext';
import { ShieldAlert, Clock, AlertTriangle, Send, ArrowRight, Zap, TrendingDown } from 'lucide-react';

export const S14_DealHealthWarRoom: React.FC = () => {
  const { dealHealthItems, nudgeRepAction, escalateDealAction, setActiveScreen, setSelectedQuoteId } = useDealContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Managerial Governance</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Deal Health War Room
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry flags for stalled deals, discount margin anomalies vs rep historical averages, and fulfillment leakage.
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('s15_reports')}
          className="px-4 py-2 rounded-lg bg-[#131B2E] hover:bg-[#1B253D] border border-white/10 text-white text-xs font-semibold transition-colors flex items-center gap-2"
        >
          <span>Executive Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Anomaly KPI Cards matching Excalidraw Screen 14 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Stalled Deals */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stalled Deals</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">3 Quotes</div>
          <p className="text-xs text-amber-400">Pipeline deals inactive for &gt;4 days without customer or rep response.</p>
        </div>

        {/* Metric 2: Discount Anomalies */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Discount Anomalies</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">2 Anomalies</div>
          <p className="text-xs text-rose-400">Quotes exceeding rep 90-day average discounting pattern by &gt;10%.</p>
        </div>

        {/* Metric 3: Delivery Slippage */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Slippage</span>
            <div className="w-9 h-9 rounded-xl bg-telemetry-blue/10 border border-telemetry-blue/20 flex items-center justify-center text-telemetry-blue">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">3 Promises</div>
          <p className="text-xs text-slate-300">Warehouse stock availability poses delivery risk on open commitments.</p>
        </div>
      </div>

      {/* Deals Triage Table matching Excalidraw Screen 14 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-orange" />
          <span>At-Risk Deals Triage Matrix</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Deal / Quote</th>
                <th className="py-3 px-4">Deal Value</th>
                <th className="py-3 px-4">Anomaly Flag</th>
                <th className="py-3 px-4">Diagnosis & Rep History</th>
                <th className="py-3 px-4">Flagged Date</th>
                <th className="py-3 px-4">Action Status</th>
                <th className="py-3 px-4 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {dealHealthItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold text-white">
                    <button
                      onClick={() => {
                        setSelectedQuoteId(item.quoteId);
                        setActiveScreen('s04_builder');
                      }}
                      className="hover:text-brand-orange transition-colors text-left"
                    >
                      {item.customerName} ({item.quoteNumber})
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-bold">${item.dealValue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.issueType === 'Discount Anomaly'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.issueType === 'Stalled Deal'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {item.issueType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-xs text-slate-300">
                    <div>{item.details}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Rep {item.repName}: {item.rep90DayAvgDiscount}% 90d avg vs {item.currentDiscount}% on deal
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{item.flaggedDate}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="text-brand-orange font-semibold text-[11px]">
                      {item.actionTaken || 'Pending Review'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 font-sans">
                    <button
                      onClick={() => nudgeRepAction(item.id)}
                      className="px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 font-bold text-[11px] transition-colors"
                    >
                      Nudge Rep
                    </button>
                    <button
                      onClick={() => escalateDealAction(item.id)}
                      className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 font-bold text-[11px] transition-colors"
                    >
                      Escalate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
