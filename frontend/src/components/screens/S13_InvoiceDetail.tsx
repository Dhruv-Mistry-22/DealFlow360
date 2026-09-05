import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { Receipt, CheckCircle2, CreditCard, Send, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const S13_InvoiceDetail: React.FC = () => {
  const { invoices, recordInvoicePayment, setActiveScreen } = useDealContext();
  const invoice = invoices.find((i) => i.invoiceNumber === 'INV-1042') || invoices[0];
  const recurringInv = invoices.find((i) => i.invoiceNumber === 'INV-1043');

  const [paymentRecorded, setPaymentRecorded] = useState(invoice.status === 'Paid');

  const handleRecordPayment = () => {
    recordInvoicePayment(invoice.id);
    setPaymentRecorded(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              {invoice.invoiceNumber}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Invoice Detail: {invoice.customerName}
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                paymentRecorded
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              Status: {paymentRecorded ? 'Paid' : 'Unpaid'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Order Reference: {invoice.orderId} • Quote Reference: {invoice.quoteNumber}
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('s14_deal_health')}
          className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
        >
          <span>Open Deal Health War Room</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Payment & Order Progress Stepper matching Excalidraw Screen 13 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Order to Cash Lifecycle Stepper
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Order Confirmed', time: 'Sep 02, 10:00 AM', status: 'Completed', color: 'bg-emerald-500' },
            { label: 'Stock Dispatched', time: 'Sep 02, 02:15 PM', status: 'Completed', color: 'bg-emerald-500' },
            { label: 'Invoiced', time: 'Sep 02, 04:30 PM', status: 'Completed', color: 'bg-emerald-500' },
            {
              label: 'Payment Cleared',
              time: paymentRecorded ? 'Just now' : 'Due Sep 16',
              status: paymentRecorded ? 'Completed' : 'Pending',
              color: paymentRecorded ? 'bg-emerald-500' : 'bg-amber-500'
            }
          ].map((st, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#131B2E] border border-white/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{st.label}</span>
                <span className={`w-2 h-2 rounded-full ${st.color}`} />
              </div>
              <div className="text-[11px] font-mono text-slate-400">{st.time}</div>
              <div className="text-[10px] font-bold text-brand-orange pt-1">{st.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices Attached to this Order */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Invoices Attached to this Deal</h3>

        <div className="space-y-3 font-mono text-xs">
          {/* Main CapEx Invoice */}
          <div className="p-4 rounded-xl bg-[#131B2E] border border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">INV-1042</span>
                <span className="text-slate-400 font-sans">(One-Time CapEx Lines)</span>
              </div>
              <div className="text-slate-400 font-sans text-[11px] mt-1">Due Date: Sep 16, 2026</div>
            </div>
            <div className="text-right">
              <div className="text-base font-bold text-white">$2,730.00</div>
              <span
                className={`text-[10px] font-bold font-sans px-2 py-0.5 rounded-full ${
                  paymentRecorded ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {paymentRecorded ? 'Paid via Wire Transfer' : 'Unpaid (Awaiting Receipt)'}
              </span>
            </div>
          </div>

          {/* Recurring OpEx Invoice */}
          {recurringInv && (
            <div className="p-4 rounded-xl bg-[#131B2E] border border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">INV-1043</span>
                  <span className="text-slate-400 font-sans">(Recurring OpEx - Care Plan 2yr)</span>
                </div>
                <div className="text-slate-400 font-sans text-[11px] mt-1">Paid: Sep 02, 2026 (Stripe Auto-Debit)</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-emerald-400">$45.00</div>
                <span className="text-[10px] font-bold font-sans px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  Paid Automatically
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Partial Invoicing Guardrail */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-brand-orange flex-shrink-0" />
          <span>
            <strong>Policy Enforced:</strong> Partial invoicing steps enabled on partial depot delivery; nothing is
            billed before physical stock dispatches from warehouse.
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono">Ledger: General Accounts Odoo 19</span>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRecordPayment}
            disabled={paymentRecorded}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>{paymentRecorded ? 'Payment Cleared & Logged' : 'Record Customer Payment ($2,730)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
