import React from 'react';
import { useDealContext } from '../../store/DealContext';
import { X, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export const GlassBoxDrawer: React.FC = () => {
  const { isGlassBoxOpen, setIsGlassBoxOpen, quotations, selectedQuoteId, calculateQuoteFinancials, apply13PercentFix } =
    useDealContext();

  if (!isGlassBoxOpen) return null;

  const quote = quotations.find((q) => q.id === selectedQuoteId) || quotations[0];
  const financials = calculateQuoteFinancials(quote);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div
        className="w-full max-w-2xl bg-[#0D1322] border-l border-white/15 h-full overflow-y-auto shadow-2xl p-6 sm:p-8 flex flex-col justify-between"
        style={{ background: 'linear-gradient(180deg, rgba(13, 19, 34, 0.98) 0%, rgba(9, 13, 22, 0.99) 100%)' }}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center text-brand-orange">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">The Glass Box Moment</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Explainable AI Diagnostic — Pure Deterministic Math Engine (Zero Hallucination)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsGlassBoxOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Score Banner */}
          <div className="mt-6 p-5 rounded-2xl bg-[#131B2E] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Blended Risk Score</span>
              <div className="flex items-baseline gap-1 mt-1 justify-center sm:justify-start">
                <span className="text-3xl font-black text-white font-mono">{financials.blendedRiskScore}</span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Required Approval</span>
              <span
                className={`inline-block mt-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  financials.requiredApproval === 'Finance'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : financials.requiredApproval === 'Sales Manager'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {financials.requiredApproval === 'None' ? 'Auto-Approved' : `Sales Manager + ${financials.requiredApproval}`}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Single-Line Worst Check</span>
              <span className="text-xs font-bold text-rose-400 mt-1.5 block">
                {financials.worstLineOverage > 0 ? `+${financials.worstLineOverage}pt over ceiling` : '0 pt over ceiling (OK)'}
              </span>
            </div>
          </div>

          {/* Section 06 Algorithmic Formula */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-white/10 text-xs font-mono text-slate-300 space-y-1.5">
            <div className="text-[11px] font-bold text-brand-orange uppercase tracking-wider mb-2 font-sans flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Section 06 Formulated Logic Proof</span>
            </div>
            <div className="text-slate-400">Step 1: per-line overage_i = max(0, discount_given - category_ceiling)</div>
            <div className="text-slate-400">Step 2: weighted_i = overage_i × (line_value / order_total)</div>
            <div className="text-slate-400">Step 3: blended_score = Σ weighted_i × 100</div>
            <div className="text-slate-400">Step 4: routing = 0–25 None | 25–50 Manager | 50+ Manager + Finance</div>
          </div>

          {/* Per-Line Math Proof Table */}
          <div className="mt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Line-by-Line Calculation Breakdown</h3>
            <div className="space-y-3">
              {financials.lineBreakdowns.map((line) => (
                <div key={line.lineId} className="p-3.5 rounded-xl bg-[#131B2E] border border-white/10">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div>
                      <span className="font-bold text-white">{line.productName}</span>
                      <span className="text-slate-400 ml-2">({line.category})</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Ceiling: {line.categoryCeiling}% | Given: </span>
                      <span className={line.isOver ? 'font-bold text-rose-400' : 'font-bold text-emerald-400'}>
                        {line.discountGiven}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        line.isOver ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (line.discountGiven / (line.categoryCeiling * 1.5)) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                    <span>
                      Overage: {line.overage > 0 ? `+${line.overage} pts` : '0 pt'}
                    </span>
                    <span>
                      Line Value: ${line.lineValue.toLocaleString()} ({Math.round((line.lineValue / (financials.grossTotal || 1)) * 100)}% order weight)
                    </span>
                    <span className={line.isOver ? 'text-rose-300 font-bold' : 'text-slate-400'}>
                      Weighted: +{line.weightedOverage.toFixed(1)} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Remediation Card */}
          {financials.worstLineOverage > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-brand-orange/15 to-amber-500/10 border border-brand-orange/30">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Recommended Co-Pilot Action</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Setup Service line crossed ceiling by <strong>8 pts</strong>. Reduce Setup Service discount from{' '}
                <strong>18%</strong> to <strong>13%</strong> to drop the line overage down to 3 pts. This lowers the blended
                risk score to <strong>18</strong>, immediately downgrading required approval from{' '}
                <strong>Finance</strong> to <strong>Manager Only</strong>!
              </p>

              <button
                onClick={() => {
                  apply13PercentFix(quote.id);
                }}
                className="mt-3.5 w-full py-2.5 px-4 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>[Apply 13% Fix to Quote] — 1-Click Instant Recalculation</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">DealFlow360 v24.2 • Odoo 19 Core Engine</span>
          <button
            onClick={() => setIsGlassBoxOpen(false)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
