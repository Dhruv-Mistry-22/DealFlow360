import React from 'react';
import { X, ShieldAlert, Sparkles, Check, ArrowRight, Calculator } from 'lucide-react';

export default function GlassBoxDrawer({ isOpen, onClose, quoteData, onApplyFix }) {
  if (!isOpen) return null;

  const { blendedScore, routing, severity, lines, totalValue } = quoteData;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-neutral-200 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-200 flex items-start justify-between bg-neutral-50/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <h2 className="text-base font-bold text-neutral-950">The Glass Box Moment</h2>
                <span className="text-[10px] font-mono bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full font-bold">
                  EXPLAINABLE AI
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Every calculation is visible, deterministic math. No black boxes.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Score & Path Callout Card */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Blended Risk Score</span>
                <div className="text-3xl font-black font-mono text-neutral-950 mt-0.5">
                  {blendedScore} <span className="text-sm font-normal text-neutral-400">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Current Required Routing</span>
                <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full mt-1">
                  {routing}
                </div>
              </div>
            </div>

            {/* Line-by-Line Diagnostic Breakdown */}
            <div>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span>Per-Line Ceiling Diagnostics</span>
              </h3>

              <div className="space-y-3">
                {lines.map((line, idx) => {
                  const isBreach = line.overage > 0;
                  const ratio = Math.min(100, Math.round((line.discount / line.effectiveCeiling) * 100));

                  return (
                    <div key={idx} className="p-3.5 rounded-xl border border-neutral-200 bg-white shadow-2xs space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-semibold text-neutral-900 flex items-center gap-2">
                          <span>{line.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">({line.category})</span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          isBreach 
                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {isBreach ? `+${line.overage}pt OVER` : 'Within Ceiling'}
                        </span>
                      </div>

                      {/* Ceiling Progress Bar */}
                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 rounded-full ${
                            isBreach ? 'bg-rose-500' : 'bg-neutral-800'
                          }`}
                          style={{ width: `${Math.min(100, ratio)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                        <span>Discount Given: <strong className="text-neutral-900">{line.discount}%</strong></span>
                        <span>Allowed Ceiling: <strong className="text-neutral-900">{line.effectiveCeiling}%</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mathematical Formula Explanation */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-neutral-900">
                <Calculator className="w-4 h-4 text-neutral-700" />
                <span>Deterministic Math Proof</span>
              </div>
              <p className="text-neutral-600 leading-relaxed text-[11px]">
                <code>Blended Score = &Sigma; (Overage_i &times; Weight_i) &times; 100</code>.
                Even if individual lines appear acceptable in isolation, cumulative overages erode the deal's profit margin.
              </p>
            </div>

            {/* Actionable One-Click Fix Card */}
            {blendedScore > 25 && (
              <div className="p-4 rounded-xl border-2 border-dashed border-emerald-500/50 bg-emerald-50/40 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">Recommended One-Click Resolution</h4>
                    <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                      Reduce <strong>Setup Service</strong> discount from <strong>18%</strong> down to <strong>13%</strong>. 
                      This lowers the blended risk score below 25 and downgrades required approval from <strong>Finance</strong> to <strong>Sales Manager only</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onApplyFix();
                    onClose();
                  }}
                  className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply 13% Fix (Auto-Recalculate)</span>
                </button>
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500 font-mono">Audited by Glass Box Engine</span>
            <button 
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-black transition-all cursor-pointer"
            >
              Close Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}