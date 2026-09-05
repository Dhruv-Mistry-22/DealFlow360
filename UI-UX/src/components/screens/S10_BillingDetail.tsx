import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { Receipt, Calendar, Calculator, FileCheck, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const S10_BillingDetail: React.FC = () => {
  const { setActiveScreen, confirmCustomerQuote } = useDealContext();
  const [billingStartDay, setBillingStartDay] = useState(12);
  const [creditNoteSimulated, setCreditNoteSimulated] = useState(false);

  // Proration math from Section 06
  const totalCycleDays = 30;
  const daysRemaining = totalCycleDays - billingStartDay;
  const prorationFactor = daysRemaining / totalCycleDays;
  const standardMonthlySaaS = 45.0;
  const proratedFirstInvoiceSaaS = standardMonthlySaaS * prorationFactor;

  const capexSubtotal = 2730.0;
  const firstInvoiceTotal = capexSubtotal + proratedFirstInvoiceSaaS;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              Q-1042 Billing
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Hybrid Billing Engine: Acme Corp
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              CapEx + OpEx Unified
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            One-time hardware/service charges and recurring subscription lines reconciled on a single order record.
          </p>
        </div>

        <button
          onClick={() => {
            confirmCustomerQuote('quote-1042');
            setActiveScreen('s12_invoices');
          }}
          className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
        >
          <span>Generate Invoices & Schedules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Column Split: CapEx vs OpEx matching System Design Section 05 & Excalidraw Screen 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: One-Time Charges (CapEx) */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">One-Time Lines (CapEx)</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
              Invoice Issued Immediate
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#131B2E] border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-sans font-bold text-white block">Laptop Pro 14</span>
                <span className="text-[10px] text-slate-400">2 units @ $1,140.00</span>
              </div>
              <span className="font-bold text-white">$2,280.00</span>
            </div>

            <div className="p-3 rounded-xl bg-[#131B2E] border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-sans font-bold text-white block">Onsite Setup Service</span>
                <span className="text-[10px] text-slate-400">1 unit @ $450.00</span>
              </div>
              <span className="font-bold text-white">$450.00</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between text-xs font-mono">
            <span className="text-slate-400 font-sans">CapEx Subtotal:</span>
            <span className="font-black text-brand-orange text-sm">${capexSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* RIGHT: Recurring Subscriptions (OpEx) */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recurring Lines (OpEx)</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Automated Subscription
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#131B2E] border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-sans font-bold text-white block">Care Plan 2yr</span>
                <span className="text-[10px] text-slate-400">Monthly Cycle • Next Bill: Sep 15</span>
              </div>
              <span className="font-bold text-emerald-400">$45.00 / mo</span>
            </div>

            <div className="p-3 rounded-xl bg-[#131B2E] border border-white/5 flex justify-between items-center">
              <div>
                <span className="font-sans font-bold text-white block">Support SLA (Optional)</span>
                <span className="text-[10px] text-slate-400">Quarterly Cycle • Next Bill: Nov 01</span>
              </div>
              <span className="font-bold text-slate-400">$180.00 / qtr</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between text-xs font-mono">
            <span className="text-slate-400 font-sans">Monthly Recurring Run Rate:</span>
            <span className="font-black text-emerald-400 text-sm">$45.00 / month</span>
          </div>
        </div>
      </div>

      {/* Mid-Cycle Proration Calculator from Section 06 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Interactive Mid-Cycle Proration Engine (Spec Section 06)</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Formula: First Invoice = (Days Remaining / Total Days) × Rate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Billing Activation Day of Month:</span>
              <span className="font-mono font-bold text-brand-orange">Day {billingStartDay} of 30</span>
            </div>
            <input
              type="range"
              min="1"
              max="29"
              value={billingStartDay}
              onChange={(e) => setBillingStartDay(Number(e.target.value))}
              className="w-full accent-brand-orange bg-slate-800"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Day 1 (Full Month)</span>
              <span>Day 15 (Mid Cycle 50%)</span>
              <span>Day 29 (1 Day Active)</span>
            </div>
          </div>

          <div className="md:col-span-5 p-4 rounded-xl bg-[#131B2E] border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Active Days Remaining:</span>
              <span className="font-bold text-white">{daysRemaining} / 30 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Proration Factor:</span>
              <span className="font-bold text-emerald-400">{(prorationFactor * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 text-slate-300">
              <span className="font-sans">Prorated SaaS (Invoice 1):</span>
              <span className="font-bold text-emerald-400">${proratedFirstInvoiceSaaS.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-orange font-bold text-sm">
              <span className="font-sans">Total First Invoice Due:</span>
              <span>${firstInvoiceTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Note Simulation Card */}
      <div className="p-4 rounded-xl bg-[#131B2E] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white">Cancellation & Partial Refund Controls</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-generate credit notes upon mid-cycle plan downgrades or terminations.
          </p>
          {creditNoteSimulated && (
            <div className="mt-2 text-xs text-rose-300 flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulated Credit Note CN-2026-09 (-$15.00) issued for unused 10 days.</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCreditNoteSimulated(true)}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
        >
          Simulate Mid-Cycle Credit Note
        </button>
      </div>
    </div>
  );
};
