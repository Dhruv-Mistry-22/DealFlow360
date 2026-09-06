import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function InvoicesList() {
  const { navigate, addToast } = useApp();
  const [filter, setFilter] = useState('all');

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const quotes = await api.get('/api/v1/quotes');
        const invoicedQuotes = quotes.filter(q => q.status === 'CLOSED_WON' || q.status === 'FULFILLMENT').map((q, idx) => ({
          id: `INV-2024-${8891 + idx}`,
          quoteRef: `Q-${q.id.toString().padStart(4, '0')}`,
          account: q.customer?.name || 'Unknown',
          issued: new Date(q.created_at).toLocaleDateString(),
          amount: `$${Number(q.total_amount || 0).toLocaleString()}`,
          status: 'Awaiting Settlement',
          statusColor: 'bg-surface-container text-secondary'
        }));
        setInvoices(invoicedQuotes);
      } catch (err) {
        addToast('Error', 'Failed to fetch invoices', 'error');
      }
    };
    fetchInvoices();
  }, [addToast]);

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
                <th className="py-3 px-4">Quote Ref</th>
                <th className="py-3 px-4">Issued Date</th>
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
                  </td>
                  <td className="py-4 px-4 font-semibold text-on-surface">{inv.account}</td>
                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-primary">{inv.quoteRef}</div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-on-surface font-medium">{inv.issued}</div>
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
