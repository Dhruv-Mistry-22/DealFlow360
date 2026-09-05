import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import {
  Lock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileText,
  Clock,
  Check
} from 'lucide-react';

export const S11_CustomerPortal: React.FC = () => {
  const {
    quotations,
    selectedQuoteId,
    submitCustomerCounter,
    confirmCustomerQuote,
    calculateQuoteFinancials,
    setActiveScreen
  } = useDealContext();

  const quote = quotations.find((q) => q.id === selectedQuoteId) || quotations[0];
  const financials = calculateQuoteFinancials(quote);

  const [counterDiscount, setCounterDiscount] = useState(22);
  const [counterMessage, setCounterMessage] = useState('We need 22% discount on setup services to close before Friday.');
  const [clientSignatory, setClientSignatory] = useState('Sarah Jenkins');
  const [commentInput, setCommentInput] = useState('');
  const [hasSubmittedCounter, setHasSubmittedCounter] = useState(false);
  const [hasConfirmedOrder, setHasConfirmedOrder] = useState(false);

  const handleCounterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCustomerCounter(quote.id, counterDiscount, counterMessage);
    setHasSubmittedCounter(true);
  };

  const handleConfirmOrder = () => {
    confirmCustomerQuote(quote.id);
    setHasConfirmedOrder(true);
    setTimeout(() => {
      setActiveScreen('s13_invoice_detail');
    }, 1200);
  };

  return (
    <div className="min-h-[88vh] bg-[#090D16] text-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Customer Portal Top Banner */}
        <div className="p-3 rounded-xl bg-[#0D1322] border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-telemetry-cyan" />
            <span className="font-mono text-slate-400">acme-corp.dealflow360.com/portal/q-1042</span>
          </div>
          <button
            onClick={() => setActiveScreen('s04_builder')}
            className="text-[11px] font-semibold text-brand-orange hover:text-white transition-colors"
          >
            ← Return to Sales Rep Workspace
          </button>
        </div>

        {/* Quotation Status Stepper matching Excalidraw Screen 11 */}
        <div className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quotation Status:</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                hasConfirmedOrder
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : hasSubmittedCounter
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-telemetry-blue/20 text-telemetry-blue border border-telemetry-blue/30'
              }`}
            >
              {hasConfirmedOrder
                ? 'Confirmed & Locked'
                : hasSubmittedCounter
                ? 'Under Re-Approval Review'
                : 'Under Active Negotiation'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Valid Until: {quote.validUntil}</span>
          </div>
        </div>

        {/* Proposal Paper Card */}
        <div className="bg-[#0D1322] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-start justify-between pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Official Proposal</span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Commercial Agreement #{quote.quoteNumber}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Prepared for: <strong>Acme Corporation</strong> (Attn: Sarah Jenkins, VP Operations)
              </p>
            </div>
            <div className="text-right font-mono text-xs text-slate-400">
              <div>Issue Date: {quote.createdAt}</div>
              <div className="text-emerald-400 font-semibold mt-1">Tier: {quote.customerTier} Pricing Applied</div>
            </div>
          </div>

          {/* Line Items Table with Line-Level Comments */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-4">Line Item</th>
                  <th className="py-2.5 px-4">Qty</th>
                  <th className="py-2.5 px-4">Unit Price</th>
                  <th className="py-2.5 px-4">Discount</th>
                  <th className="py-2.5 px-4 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {quote.lines.map((line) => {
                  const lineNet = line.unitPrice * line.quantity * (1 - line.discountPct / 100);

                  return (
                    <tr key={line.id}>
                      <td className="py-3 px-4 font-sans font-semibold text-white">
                        <div>{line.name}</div>
                        {line.name.includes('Setup') && (
                          <div className="text-[10px] text-telemetry-blue font-sans mt-0.5 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>Client note: "Can we push on-premise installation to next month?"</span>
                          </div>
                        )}
                        {line.name.includes('Warranty') && (
                          <div className="text-[10px] text-slate-400 font-sans mt-0.5 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>Client note: "Can this be 12% off instead of 10%?"</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">{line.quantity}</td>
                      <td className="py-3 px-4">${line.unitPrice.toLocaleString()}</td>
                      <td className="py-3 px-4 text-emerald-400">{line.discountPct}%</td>
                      <td className="py-3 px-4 text-right font-bold text-white">
                        ${lineNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Running Totals */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400 font-sans">
                <span>Gross Subtotal:</span>
                <span className="font-bold text-white">${financials.grossTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-sans">
                <span>Approved Discount:</span>
                <span className="font-bold text-rose-400">-${financials.discountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span className="font-sans">Total Proposal Value:</span>
                <span className="text-brand-orange">${financials.netTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Counter-Discount Proposal Tool matching Excalidraw Screen 11 */}
        <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-orange uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Interactive Counter-Offer Negotiation Tool</span>
          </div>

          <form onSubmit={handleCounterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Propose Counter Discount on Setup Service (%)
                </label>
                <div className="flex items-center gap-2 bg-[#131B2E] border border-white/10 rounded-lg px-3 py-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={counterDiscount}
                    onChange={(e) => setCounterDiscount(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-mono font-bold text-white outline-none"
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Requested Delivery Date</label>
                <input
                  type="date"
                  defaultValue="2026-09-20"
                  className="w-full bg-[#131B2E] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Negotiation Note to Sales Rep</label>
              <textarea
                rows={2}
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-3 text-xs text-white placeholder-slate-500 outline-none resize-none"
              />
            </div>

            {/* Re-Approval Warning */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Automated Re-Approval Warning:</strong> Proposing a {counterDiscount}% discount exceeds the
                automated 10% Gold tier ceiling. Submitting this counter will automatically send Quote #{quote.quoteNumber}{' '}
                back into the internal Sales & Finance approval workflow.
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="py-2.5 px-5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-brand-orange" />
                <span>Submit Counter Proposal</span>
              </button>
            </div>
          </form>

          {hasSubmittedCounter && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>Counter submitted. Quote #{quote.quoteNumber} returned to Approvals Queue (Screen 6).</span>
              </span>
              <button
                onClick={() => setActiveScreen('s06_approval_detail')}
                className="text-xs underline font-bold text-white hover:text-brand-orange"
              >
                View Internal Review ➔
              </button>
            </div>
          )}
        </div>

        {/* Digital Signature & Confirm Final Terms */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/15 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Accept & Confirm Final Terms</h3>
            <p className="text-xs text-slate-400">
              One-click digital signature locks proposal terms and automatically initiates fulfillment & billing.
            </p>
            <div className="pt-2">
              <input
                type="text"
                value={clientSignatory}
                onChange={(e) => setClientSignatory(e.target.value)}
                placeholder="Type your full legal name to sign"
                className="bg-[#131B2E] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={hasConfirmedOrder}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{hasConfirmedOrder ? 'Quotation Confirmed!' : 'Sign & Confirm Quotation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
