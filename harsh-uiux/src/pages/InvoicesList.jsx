import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function InvoicesList() {
  const { navigate, addToast } = useApp();
  const [filter, setFilter] = useState('all');

  const invoices = [
    {
      id: 'INV-2024-8891',
      quoteRef: 'Q-1024',
      account: 'Acme Global Logistics Inc.',
      carrier: 'BNSF Logistics',
      issued: 'Oct 28, 2024',
      due: 'Nov 28, 2024',
      terms: 'Net 30 Terms',
      amount: '$24,850.00',
      status: 'Paid · Reconciled',
      statusColor: 'bg-primary-container text-on-primary-container',
      ediStatus: 'EDI 810 Cleared'
    },
    {
      id: 'INV-2024-8892',
      quoteRef: 'Q-1025',
      account: 'Falcon Aerospace Supply',
      carrier: 'Maersk Line Ocean',
      issued: 'Oct 28, 2024',
      due: 'Dec 28, 2024',
      terms: 'Net 60 Corporate',
      amount: '$112,400.00',
      status: 'Awaiting Settlement',
      statusColor: 'bg-surface-container text-secondary',
      ediStatus: 'EDI 810 Queued'
    },
    {
      id: 'INV-2024-8884',
      quoteRef: 'Q-9012',
      account: 'Pacific Rim FMCG',
      carrier: 'ONE Ocean Network',
      issued: 'Oct 26, 2024',
      due: 'Nov 26, 2024',
      terms: 'Net 30 Terms',
      amount: '$410,000.00',
      status: 'Paid · Reconciled',
      statusColor: 'bg-primary-container text-on-primary-container',
      ediStatus: 'EDI 810 Cleared'
    },
    {
      id: 'INV-2024-8879',
      quoteRef: 'Q-7822',
      account: 'OmniCold Storage',
      carrier: 'Hapag-Lloyd Reefer',
      issued: 'Oct 24, 2024',
      due: 'Nov 24, 2024',
      terms: 'Net 30 Terms',
      amount: '$84,200.00',
      status: 'Disputed Fuel Surcharge',
      statusColor: 'bg-error-container text-on-tertiary-container',
      ediStatus: 'Pending Review'
    }
  ];

  const filtered = invoices.filter((inv) => {
    if (filter === 'paid' && !inv.status.includes('Paid')) return false;
    if (filter === 'pending' && !inv.status.includes('Awaiting')) return false;
    if (filter === 'disputed' && !inv.status.includes('Disputed')) return false;
    return true;
  });

  const handleBatchReconcile = () => {
    addToast('Batch Reconciliation', 'Reconciled 8 active carrier ledger matches with ERP.', 'success');
  };

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Page Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight font-black">
              Enterprise Invoices &amp; Billing Operations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-primary font-bold text-xs">
              EDI 810 Live
            </span>
          </div>
          <p className="font-body-medium text-body-medium text-on-surface-variant max-w-4xl">
            Automated quote-to-cash settlement, multi-currency carrier pass-through, milestone billing, and reconciliation.
          </p>
        </div>

        {/* Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-spacing-sm shrink-0">
          <button
            onClick={() => addToast('Ledger Exported', 'Downloaded EDI 810 & CSV invoice ledger.', 'info')}
            className="px-spacing-md py-2.5 rounded-lg bg-surface-variant text-on-secondary-container font-label-large text-label-large shadow-sm hover:bg-surface border border-outline transition-all flex items-center gap-spacing-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Ledger</span>
          </button>
          <button
            onClick={handleBatchReconcile}
            className="px-spacing-md py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-large text-label-large shadow-sm hover:bg-surface-container-highest transition-all flex items-center gap-spacing-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            <span>Batch Reconcile (8)</span>
          </button>
          <button
            onClick={() => navigate('billing-detail')}
            className="px-spacing-md py-2.5 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-large text-label-large shadow-sm transition-all flex items-center gap-spacing-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">receipt</span>
            <span>Settlement Detail (INV-88291)</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-spacing-md">
        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Total Billed MTD
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">$28.4M</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">+14.2% MoM pacing</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Pending Settlement
          </span>
          <div className="text-2xl font-black text-secondary mt-1">$6.8M</div>
          <span className="text-xs text-on-surface-variant mt-1">Net 30/60 receivables</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Under Dispute / Hold
          </span>
          <div className="text-2xl font-black text-tertiary mt-1">$240k</div>
          <span className="text-xs text-tertiary font-semibold mt-1">3 non-standard claims</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Automated 3-Way Match
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">99.2%</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">Zero manual audit needed</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-outline">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          All Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'paid' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          Paid &amp; Reconciled
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'pending' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          Awaiting Settlement
        </button>
        <button
          onClick={() => setFilter('disputed')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'disputed' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          Disputed Surcharges
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-6">Invoice Number</th>
                <th className="py-3 px-4">Account / Shipper</th>
                <th className="py-3 px-4">Quote Ref &amp; Carrier</th>
                <th className="py-3 px-4">Issued &amp; Due Date</th>
                <th className="py-3 px-4 text-right">Invoice Total</th>
                <th className="py-3 px-4">Settlement Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-surface-variant/40 transition-colors cursor-pointer"
                  onClick={() => navigate('invoice-detail', { invoiceId: inv.id })}
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-mono font-bold text-secondary text-sm">{inv.id}</div>
                    <span className="text-[10px] text-on-surface-variant">{inv.ediStatus}</span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-on-surface">{inv.account}</td>
                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-primary">{inv.quoteRef}</div>
                    <div className="text-[11px] text-on-surface-variant">{inv.carrier}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-on-surface font-medium">{inv.issued}</div>
                    <div className="text-[10px] text-on-surface-variant">Due: {inv.due} ({inv.terms})</div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-base text-on-secondary-container">
                    {inv.amount}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${inv.statusColor}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate('invoice-detail', { invoiceId: inv.id })}
                        className="p-1.5 rounded hover:bg-surface-variant text-secondary"
                        title="View Invoice"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        onClick={() => addToast('PDF Export', `Downloaded PDF for ${inv.id}.`, 'info')}
                        className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant"
                        title="Download PDF"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
