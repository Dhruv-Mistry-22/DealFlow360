import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function InvoiceDetails() {
  const { navigate, pageParams, addToast } = useApp();
  const invoiceId = pageParams.invoiceId || 'INV-2024-8891';
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Top Breadcrumb */}
      <nav className="flex items-center gap-spacing-2xs font-body-small text-body-small">
        <button onClick={() => navigate('overview')} className="text-on-surface-variant hover:text-secondary">
          Operations
        </button>
        <span className="text-outline-variant">/</span>
        <button onClick={() => navigate('invoices')} className="text-on-surface-variant hover:text-secondary">
          Invoices
        </button>
        <span className="text-outline-variant">/</span>
        <span className="text-secondary font-semibold">{invoiceId}</span>
      </nav>

      {/* Header Area */}
      <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-spacing-sm">
            <h1 className="font-title-large text-title-large text-on-surface tracking-tight font-black">
              Invoice {invoiceId}
            </h1>
            <span className="inline-flex items-center gap-1 px-spacing-sm py-1 rounded-full bg-primary-container text-on-primary-container font-label-small text-label-small font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              PAID · RECONCILED
            </span>
            <span className="inline-flex items-center gap-1 px-spacing-sm py-1 rounded-full bg-surface-container-high text-on-secondary-container font-label-small text-label-small font-semibold">
              <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
              EDI 810 Cleared
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant">
            <span>
              Quoted via{' '}
              <button
                onClick={() => navigate('quotation-detail', { quoteId: 'Q-1024' })}
                className="font-semibold text-primary hover:underline"
              >
                Q-1024
              </button>
            </span>
            <span>•</span>
            <span>
              Waybill:{' '}
              <button
                onClick={() => navigate('fulfillment-detail', { orderId: 'SH-9402' })}
                className="font-semibold text-secondary hover:underline"
              >
                SH-9402 (BOL-BNSF-88190)
              </button>
            </span>
            <span>•</span>
            <span>
              Carrier: <strong className="text-on-surface">BNSF Logistics</strong>
            </span>
            <span>•</span>
            <span>Net 30 Corporate Terms</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-spacing-sm">
          <button
            onClick={() => addToast('PDF Exported', `Downloaded PDF for ${invoiceId}.`, 'info')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-variant text-on-surface hover:bg-surface border border-outline text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>PDF Invoice</span>
          </button>
          <button
            onClick={() => navigate('quotation-detail', { quoteId: 'Q-1024' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-on-primary-container text-on-primary text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>View Quote Q-1024</span>
          </button>
        </div>
      </div>

      {/* Invoice Card & 3-Way Match */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-lg">
        {/* Left 8 Cols: Line Items */}
        <div className="lg:col-span-8 flex flex-col gap-spacing-lg">
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <div className="flex items-center justify-between pb-3 border-b border-outline mb-4">
              <div>
                <h2 className="font-title-small text-title-small text-on-secondary-container">
                  Settlement Breakdown &amp; Pass-Through Charges
                </h2>
                <span className="text-xs text-on-surface-variant">
                  Bill To: Acme Global Logistics Inc. (Account #ACC-88910)
                </span>
              </div>
              <span className="text-xs font-mono text-on-surface-variant">Currency: USD</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    <th className="py-2.5 px-4">Line Item</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4 text-center">Qty / TEU</th>
                    <th className="py-2.5 px-4 text-right">Unit Rate</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  <tr>
                    <td className="py-3 px-4 font-mono font-bold text-primary">001</td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      Mainline Rail Intermodal Freight (Newark → Chicago)
                    </td>
                    <td className="py-3 px-4 text-center font-mono">24 TEU</td>
                    <td className="py-3 px-4 text-right font-mono">$758.33</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-on-surface">
                      $18,200.00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono font-bold text-primary">002</td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      DOE National Weekly Fuel Surcharge Pass-Through
                    </td>
                    <td className="py-3 px-4 text-center font-mono">24 TEU</td>
                    <td className="py-3 px-4 text-right font-mono">$143.75</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-on-surface">
                      $3,450.00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono font-bold text-primary">003</td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      Terminal Drayage &amp; Chassis Hostler Access
                    </td>
                    <td className="py-3 px-4 text-center font-mono">24 TEU</td>
                    <td className="py-3 px-4 text-right font-mono">$75.00</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-on-surface">
                      $1,800.00
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono font-bold text-primary">004</td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      Customs Bonded Security Transit Fee
                    </td>
                    <td className="py-3 px-4 text-center font-mono">1 Lot</td>
                    <td className="py-3 px-4 text-right font-mono">$1,400.00</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-on-surface">
                      $1,400.00
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-surface-variant/70 font-bold border-t-2 border-outline">
                    <td colSpan="4" className="py-3 px-4 text-right uppercase tracking-wider text-on-surface-variant">
                      Total Invoice Balance:
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-base text-secondary">
                      $24,850.00
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: 3-Way Match & Bank Settlement */}
        <div className="lg:col-span-4 flex flex-col gap-spacing-lg">
          {/* Automated 3-Way Match Card */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <div className="flex items-center justify-between pb-3 border-b border-outline mb-3">
              <span className="font-bold text-on-surface text-sm">Automated 3-Way Match</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                100% Cleared
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span className="font-semibold text-on-surface">1. Quote Authorization:</span>
                </div>
                <span className="font-mono text-primary font-bold">Q-1024 ($24.8k)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span className="font-semibold text-on-surface">2. Carrier Waybill:</span>
                </div>
                <span className="font-mono text-secondary font-bold">SH-9402 Match</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span className="font-semibold text-on-surface">3. Ingate Milestone:</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">Verified</span>
              </div>
            </div>
          </div>

          {/* Settlement Wire Confirmation */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <span className="font-bold text-on-surface text-sm block mb-3">Wire &amp; Clearing Details</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Settlement Method:</span>
                <span className="font-semibold text-on-surface">Federal Reserve Fedwire</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Transaction Ref:</span>
                <span className="font-mono text-on-surface">WIRE-2024-99182</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Cleared At:</span>
                <span className="text-on-surface">Oct 28, 2024 · 14:22 EST</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
