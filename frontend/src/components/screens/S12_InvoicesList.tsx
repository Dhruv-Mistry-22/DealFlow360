import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { Receipt, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

export const S12_InvoicesList: React.FC = () => {
  const { invoices, setActiveScreen } = useDealContext();
  const [tabFilter, setTabFilter] = useState<'Unpaid' | 'Paid'>('Unpaid');

  const filteredInvoices = invoices.filter((inv) => inv.status === tabFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Financial Operations</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Invoices & Accounts Receivable
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every invoice generated from one-time product lines and recurring subscription cycles.
          </p>
        </div>

        <div className="flex rounded-lg bg-[#0D1322] border border-white/10 p-1">
          {(['Unpaid', 'Paid'] as const).map((tab) => {
            const count = invoices.filter((i) => i.status === tab).length;

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

      {/* Invoices Table matching Excalidraw Screen 12 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Revenue Type</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {filteredInvoices.map((inv) => (
              <tr
                key={inv.id}
                onClick={() => setActiveScreen('s13_invoice_detail')}
                className="hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-bold text-white">{inv.invoiceNumber}</td>
                <td className="py-3.5 px-4 text-slate-400">{inv.orderId}</td>
                <td className="py-3.5 px-4 font-sans font-semibold text-white">{inv.customerName}</td>
                <td className="py-3.5 px-4 font-sans text-slate-300">{inv.type}</td>
                <td className="py-3.5 px-4 font-bold text-white">
                  ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3.5 px-4 text-slate-400">{inv.dueDate}</td>
                <td className="py-3.5 px-4 font-sans">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button className="px-3 py-1 rounded bg-white/10 text-white hover:bg-brand-orange text-[11px] font-sans font-bold transition-colors">
                    View
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
