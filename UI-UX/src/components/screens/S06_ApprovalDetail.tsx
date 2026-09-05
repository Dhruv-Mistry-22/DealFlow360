import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { ShieldAlert, CheckCircle2, XCircle, RotateCcw, ArrowRight, UserCheck, Clock, FileCheck } from 'lucide-react';

export const S06_ApprovalDetail: React.FC = () => {
  const {
    selectedQuoteId,
    quotations,
    approvals,
    activePersona,
    calculateQuoteFinancials,
    approveQuote,
    returnQuoteForRevision,
    setActiveScreen
  } = useDealContext();

  const [reviewNote, setReviewNote] = useState('');

  const quote = quotations.find((q) => q.id === selectedQuoteId) || quotations[0];
  const approval = approvals.find((a) => a.quoteId === quote.id) || approvals[0];
  const financials = calculateQuoteFinancials(quote);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              {quote.quoteNumber}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Approval Diagnostic: {quote.customerName}
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                approval.riskLevel === 'HIGH'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              Blended Risk: {approval.riskLevel} ({approval.blendedRiskScore})
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
              Tier: {quote.customerTier}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Status: <span className="text-white font-semibold">{approval.status}</span> • Current Stage:{' '}
            <span className="text-brand-orange font-semibold">{approval.currentStage}</span>
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('s04_builder')}
          className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
        >
          View in Builder
        </button>
      </div>

      {/* Flagged Breaches Table from Excalidraw Screen 6 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Why this Quote was Flagged</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-2.5 px-4">Line Item</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Discount Given</th>
                <th className="py-2.5 px-4">Category Limit</th>
                <th className="py-2.5 px-4">Over By</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {financials.lineBreakdowns.map((line) => (
                <tr key={line.lineId} className={line.isOver ? 'bg-rose-950/20' : ''}>
                  <td className="py-3 px-4 font-sans font-bold text-white">{line.productName}</td>
                  <td className="py-3 px-4 font-sans text-slate-400">{line.category}</td>
                  <td className="py-3 px-4 font-bold">{line.discountGiven}%</td>
                  <td className="py-3 px-4 text-slate-400">{line.categoryCeiling}%</td>
                  <td className="py-3 px-4">
                    {line.isOver ? (
                      <span className="text-rose-400 font-bold">+{line.overage} pt OVER</span>
                    ) : (
                      <span className="text-slate-400">0 pt - OK</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    {line.isOver ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                        Requires Approval
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                        Within Policy
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed pt-2">
          <strong>Deterministic Math Note:</strong> Worst single-line overage (Setup Service: +8pt) plus weighted pattern
          across the order sets the blended score. Even if the customer is Gold (15% overall ceiling), the service category has a
          strict 10% ceiling. One breach mandates multi-tier governance.
        </p>
      </div>

      {/* Approval Stepper from Excalidraw Screen 6 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Multi-Tier Approval Routing Flow</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {[
            { label: 'Submitted', actor: 'Sales Rep (J. Rao)', state: 'Completed', color: 'bg-emerald-500 text-white' },
            {
              label: 'Sales Manager',
              actor: 'M. Shah (Reviewer)',
              state: approval.status === 'Approved' ? 'Completed' : 'Active',
              color: approval.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-brand-orange text-white'
            },
            {
              label: 'Finance Approver',
              actor: 'R. Iyer (Approver)',
              state: approval.status === 'Approved' ? 'Completed' : 'Pending',
              color: approval.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            },
            {
              label: 'Confirmed',
              actor: 'Customer Order',
              state: quote.stage === 'Confirmed' ? 'Completed' : 'Pending',
              color: quote.stage === 'Confirmed' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
            }
          ].map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#131B2E] border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{step.label}</span>
                <span className={`w-2 h-2 rounded-full ${step.color.includes('emerald') ? 'bg-emerald-400' : 'bg-brand-orange'}`} />
              </div>
              <div className="text-[11px] text-slate-400">{step.actor}</div>
              <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-brand-orange pt-1">
                {step.state}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Audit Trail & Review Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Audit Trail Timeline */}
        <div className="lg:col-span-7 bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Immutable Audit Trail</h3>
          <div className="space-y-4">
            {approval.auditTrail.map((entry) => (
              <div key={entry.id} className="p-3.5 rounded-xl bg-[#131B2E] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{entry.user}</span>
                  <span className="text-slate-500 font-mono text-[10px]">{entry.timestamp}</span>
                </div>
                <div className="text-[11px] font-semibold text-brand-orange">{entry.action}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{entry.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviewer Action Box */}
        <div className="lg:col-span-5 bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Approver Decision</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Act as <strong>{activePersona}</strong>. Approving clears this quote for fulfillment splitting and billing.
            </p>

            <label className="block text-xs font-medium text-slate-300 mb-1.5">Reviewer Audit Comment</label>
            <textarea
              rows={3}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="e.g. Cleared based on multi-year customer relationship."
              className="w-full bg-[#131B2E] border border-white/10 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                approveQuote(quote.id, activePersona, reviewNote);
                setActiveScreen('s07_fulfillment');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>[Approve Quotation] ➔ Proceed to Fulfillment</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => returnQuoteForRevision(quote.id, activePersona, reviewNote)}
                className="py-2 px-3 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return Revision</span>
              </button>

              <button
                onClick={() => returnQuoteForRevision(quote.id, activePersona, 'Rejected')}
                className="py-2 px-3 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
