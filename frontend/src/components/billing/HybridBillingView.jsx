import React, { useState } from 'react';
import { 
  Repeat, Calendar, CreditCard, Receipt, ArrowRight, 
  CheckCircle2, AlertCircle, FileText, Download, Split
} from 'lucide-react';

export default function HybridBillingView({ quoteLines = [] }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly', 'quarterly', 'annual'
  const [prorateStartDay, setProrateStartDay] = useState(12); // Day 12 of current 30-day month
  const [isProrated, setIsProrated] = useState(true);
  const [creditNoteGenerated, setCreditNoteGenerated] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Default lines if not provided
  const lines = quoteLines.length > 0 ? quoteLines : [
    { id: 'p1', sku: 'HW-LP14', name: 'Laptop Pro 14', category: 'Hardware', price: 1200, quantity: 2, discount: 12, isSubscription: false },
    { id: 'p2', sku: 'SRV-SETUP', name: 'Setup Service', category: 'Services', price: 450, quantity: 1, discount: 13, isSubscription: false },
    { id: 'p3', sku: 'SUB-SAAS', name: 'Enterprise SaaS Platform', category: 'Subscriptions', price: 300, quantity: 1, discount: 10, isSubscription: true, interval: 'monthly' },
    { id: 'p6', sku: 'SUB-ANALYTICS', name: 'Cloud Analytics Add-on', category: 'Subscriptions', price: 120, quantity: 1, discount: 0, isSubscription: true, interval: 'monthly' }
  ];

  const oneTimeLines = lines.filter(l => !l.isSubscription);
  const recurringLines = lines.filter(l => l.isSubscription);

  // Calculations
  const oneTimeTotal = oneTimeLines.reduce((acc, l) => {
    const net = (l.price * l.quantity) * (1 - (l.discount || 0) / 100);
    return acc + net;
  }, 0);

  const baseRecurringMonthly = recurringLines.reduce((acc, l) => {
    const net = (l.price * l.quantity) * (1 - (l.discount || 0) / 100);
    return acc + net;
  }, 0);

  // Multiplier for billing cycle
  const cycleMultiplier = billingCycle === 'annual' ? 12 * 0.9 : billingCycle === 'quarterly' ? 3 : 1;
  const cycleLabel = billingCycle === 'annual' ? 'Billed Annually (10% off)' : billingCycle === 'quarterly' ? 'Billed Quarterly' : 'Billed Monthly';
  const fullRecurringCycleTotal = baseRecurringMonthly * cycleMultiplier;

  // Proration calculation (assuming 30-day month)
  const daysInMonth = 30;
  const daysRemaining = Math.max(0, daysInMonth - prorateStartDay);
  const prorationFactor = isProrated ? daysRemaining / daysInMonth : 1;
  const proratedRecurringAmount = baseRecurringMonthly * prorationFactor;

  // First Invoice Total
  const firstInvoiceTotal = oneTimeTotal + proratedRecurringAmount;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <Split className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-neutral-950">Hybrid Billing Engine</h1>
            <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
              DUAL REVENUE SPLIT
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Automated bifurcation of Capital Expenditures (One-Time) and Operating Expenditures (Recurring SaaS) with mid-cycle proration.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCreditNoteGenerated(true);
              showToast('✓ Simulated Credit Note CN-2026-09 Generated (-$45.00)');
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-800 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5 text-neutral-500" />
            <span>Simulate Credit Note</span>
          </button>

          <button
            onClick={() => showToast('✓ Draft Invoices INV-8821 & SUB-019 exported as PDF')}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-black hover:bg-neutral-800 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Invoices</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split View: One-Time vs Recurring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL 1: ONE-TIME REVENUE (Hardware & Services) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-neutral-900" />
                <span className="text-sm font-bold text-neutral-950">One-Time Charges (CapEx)</span>
              </div>
              <span className="text-xs font-mono font-semibold text-neutral-500">
                {oneTimeLines.length} line items
              </span>
            </div>

            <div className="divide-y divide-neutral-100 mt-3">
              {oneTimeLines.map(line => {
                const lineTotal = (line.price * line.quantity) * (1 - (line.discount || 0) / 100);
                return (
                  <div key={line.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{line.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {line.quantity}x @ ${line.price}
                        {line.discount > 0 && <span className="text-neutral-600"> ({line.discount}% off)</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-neutral-950">${lineTotal.toFixed(2)}</div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono">Pay on delivery</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 bg-neutral-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-500 font-medium">One-Time Subtotal</span>
              <div className="text-lg font-black font-mono text-neutral-950">${oneTimeTotal.toFixed(2)}</div>
            </div>
            <span className="text-[11px] font-mono bg-neutral-200/70 text-neutral-800 px-2.5 py-1 rounded-md">
              Invoice: INV-8821
            </span>
          </div>
        </div>

        {/* PANEL 2: RECURRING SUBSCRIPTIONS (OpEx) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-neutral-900" />
                <span className="text-sm font-bold text-neutral-950">Recurring Subscriptions (OpEx)</span>
              </div>
              
              {/* Billing Cycle Selector */}
              <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
                {['monthly', 'quarterly', 'annual'].map(cycle => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded capitalize cursor-pointer transition-all ${
                      billingCycle === cycle ? 'bg-black text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-neutral-100 mt-3">
              {recurringLines.map(line => {
                const lineTotal = (line.price * line.quantity) * (1 - (line.discount || 0) / 100);
                return (
                  <div key={line.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{line.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {line.quantity} user seat @ ${line.price}/mo
                        {line.discount > 0 && <span className="text-neutral-600"> ({line.discount}% off)</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-neutral-950">
                        ${(lineTotal * cycleMultiplier).toFixed(2)}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono lowercase">/{billingCycle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 bg-neutral-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-500 font-medium">Recurring Cycle Rate ({cycleLabel})</span>
              <div className="text-lg font-black font-mono text-neutral-950">${fullRecurringCycleTotal.toFixed(2)}</div>
            </div>
            <span className="text-[11px] font-mono bg-neutral-200/70 text-neutral-800 px-2.5 py-1 rounded-md">
              Schedule: Active
            </span>
          </div>
        </div>

      </div>

      {/* MID-CYCLE PRORATION ENGINE */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-900" />
              <h2 className="text-sm font-bold text-neutral-950">Mid-Cycle Proration Engine</h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Configures activation date and exact day-count revenue recognition for the opening invoice.
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isProrated} 
              onChange={(e) => setIsProrated(e.target.checked)}
              className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
            />
            <span>Enable Mid-Cycle Proration</span>
          </label>
        </div>

        {isProrated && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Billing Start Day of Month
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="1" 
                  max="29" 
                  value={prorateStartDay}
                  onChange={(e) => setProrateStartDay(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <span className="font-mono text-xs font-bold w-12 text-right">Day {prorateStartDay}</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">Contract active from day {prorateStartDay} of current 30-day month</p>
            </div>

            <div>
              <span className="block text-xs font-semibold text-neutral-700 mb-1">
                Proration Factor
              </span>
              <div className="text-lg font-bold font-mono text-neutral-900">
                {(prorationFactor * 100).toFixed(1)}%
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">{daysRemaining} active days out of {daysInMonth} calendar days</p>
            </div>

            <div>
              <span className="block text-xs font-semibold text-neutral-700 mb-1">
                Prorated Recurring Line (Invoice #1)
              </span>
              <div className="text-lg font-bold font-mono text-neutral-900">
                ${proratedRecurringAmount.toFixed(2)}
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">Normal rate: ${baseRecurringMonthly.toFixed(2)}/mo</p>
            </div>
          </div>
        )}

        {/* INVOICE SCHEDULE BREAKDOWN */}
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <div className="bg-neutral-100/60 px-4 py-2.5 border-b border-neutral-200 flex justify-between items-center text-xs font-bold text-neutral-800">
            <span>Invoice Generation Schedule</span>
            <span className="font-mono text-[11px] text-neutral-500">Automated Dispatch</span>
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            
            {/* Invoice 1: First Bill */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-950">INV-8821</span>
                  <span className="bg-neutral-100 text-neutral-700 text-[10px] px-2 py-0.5 rounded font-semibold">Immediate</span>
                </div>
                <div className="text-neutral-500 text-[11px]">
                  One-time hardware/setup (${oneTimeTotal.toFixed(2)}) + Prorated SaaS days 12-30 (${proratedRecurringAmount.toFixed(2)})
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black font-mono text-neutral-950">${firstInvoiceTotal.toFixed(2)}</div>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready for dispatch
                </span>
              </div>
            </div>

            {/* Invoice 2+: Regular Recurring */}
            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-950">INV-8822 (Recurring)</span>
                  <span className="bg-neutral-200 text-neutral-700 text-[10px] px-2 py-0.5 rounded font-semibold">1st of Next Month</span>
                </div>
                <div className="text-neutral-500 text-[11px]">
                  Standard subscription renewal ({cycleLabel})
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black font-mono text-neutral-950">${fullRecurringCycleTotal.toFixed(2)}</div>
                <span className="text-[10px] text-neutral-500 font-mono">Scheduled Auto-Charge</span>
              </div>
            </div>

          </div>
        </div>

        {/* CREDIT NOTE SIMULATION PREVIEW */}
        {creditNoteGenerated && (
          <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-100/70 flex items-start justify-between gap-4 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-900" />
                <span className="text-xs font-bold text-neutral-950">Credit Note Draft: CN-2026-09</span>
                <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">-$45.00</span>
              </div>
              <p className="text-xs text-neutral-600">
                Reason: Pre-calculated adjustment credit for Setup Service discount renegotiation.
              </p>
            </div>
            <button 
              onClick={() => setCreditNoteGenerated(false)}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
