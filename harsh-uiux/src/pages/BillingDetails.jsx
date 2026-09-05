import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function BillingDetails() {
  const { navigate, addToast } = useApp();
  const [cleared, setCleared] = useState(false);

  const handleRecordSettlement = () => {
    setCleared(true);
    addToast('Settlement Recorded', 'INV-88291 marked as fully settled via Corporate ACH wire.', 'success');
  };

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-spacing-2xs font-body-small text-body-small">
        <button onClick={() => navigate('overview')} className="text-on-surface-variant hover:text-secondary">
          Operations
        </button>
        <span className="text-outline-variant">/</span>
        <button onClick={() => navigate('invoices')} className="text-on-surface-variant hover:text-secondary">
          Billing Operations
        </button>
        <span className="text-outline-variant">/</span>
        <span className="text-secondary font-semibold">Settlement INV-88291</span>
      </nav>

      {/* Header & Meta */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-spacing-lg bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="flex flex-col gap-spacing-xs max-w-3xl">
          <div className="flex flex-wrap items-center gap-spacing-sm">
            <h1 className="font-title-large text-title-large text-on-surface tracking-tight font-black">
              Invoice &amp; Settlement: INV-88291
            </h1>
            <span className="px-spacing-sm py-spacing-2xs rounded-full bg-primary-container text-secondary font-label-small text-label-small font-bold">
              Automated 3-Way Match
            </span>
          </div>
          <p className="font-body-medium text-body-medium text-on-surface-variant">
            Generated from Quotation{' '}
            <button
              onClick={() => navigate('quotation-detail', { quoteId: 'Q-1024' })}
              className="font-label-medium text-secondary hover:underline"
            >
              Q-1024
            </button>{' '}
            · Waybill{' '}
            <button
              onClick={() => navigate('fulfillment-detail', { orderId: 'SH-9402' })}
              className="font-label-medium text-on-surface hover:underline"
            >
              SH-9402
            </button>{' '}
            · Carrier Consolidation Verified
          </p>

          <div className="flex flex-wrap items-center gap-spacing-xs pt-spacing-2xs text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-variant">
              <span className="material-symbols-outlined text-secondary text-[16px]">calendar_today</span>
              <span className="text-on-surface-variant">Due Date:</span>
              <span className="text-on-surface font-semibold">Nov 28, 2024</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-variant">
              <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
              <span className="text-on-surface-variant">Terms:</span>
              <span className="text-on-surface font-semibold">Net-60 Corporate ACH</span>
            </div>

            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md ${
                cleared ? 'bg-emerald-100 text-emerald-800' : 'bg-tertiary-container/20 text-tertiary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {cleared ? 'check_circle' : 'hourglass_top'}
              </span>
              <span className="font-bold">{cleared ? 'Status: Cleared & Settled' : 'Status: Awaiting Clearing'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-spacing-xs self-start">
          <button
            onClick={() => addToast('EDI Exported', 'EDI-810 XML payload saved.', 'info')}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 bg-surface text-secondary hover:bg-surface-variant font-label-large text-label-large rounded-lg transition-colors border border-outline shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">sim_card_download</span>
            <span>Export EDI-810</span>
          </button>
          <button
            onClick={() => addToast('Reminder Dispatched', 'Automated statement reminder sent to Acme Accounts Payable.', 'info')}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-variant font-label-large text-label-large rounded-lg transition-colors border border-outline shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
            <span>Send Reminder</span>
          </button>
          <button
            onClick={handleRecordSettlement}
            className={`flex items-center gap-spacing-xs px-spacing-md py-2.5 rounded-lg font-label-large text-label-large shadow-md transition-all text-on-tertiary ${
              cleared ? 'bg-emerald-600' : 'bg-tertiary hover:opacity-90'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {cleared ? 'check_circle' : 'paid'}
            </span>
            <span>{cleared ? 'Settlement Complete' : 'Record Settlement →'}</span>
          </button>
        </div>
      </div>

      {/* Main Reconciliation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-lg">
        <div className="lg:col-span-8 flex flex-col gap-spacing-lg">
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <h2 className="font-title-small text-title-small text-on-secondary-container mb-4 pb-3 border-b border-outline">
              Settlement Allocation &amp; Ledger Rebalancing
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-outline">
                <span className="text-on-surface-variant font-medium">Mainline Intermodal Transport (BNSF):</span>
                <span className="font-mono font-bold text-on-surface">$21,450.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-outline">
                <span className="text-on-surface-variant font-medium">DOE National Fuel Surcharge (Index Pass-Through):</span>
                <span className="font-mono font-bold text-on-surface">$2,180.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-outline">
                <span className="text-on-surface-variant font-medium">Terminal Drayage &amp; Hostler Chassis:</span>
                <span className="font-mono font-bold text-on-surface">$1,220.00</span>
              </div>
              <div className="flex justify-between py-3 bg-surface-variant px-3 rounded-lg text-sm font-bold">
                <span className="text-on-surface">Total Gross Amount Quoted:</span>
                <span className="font-mono text-secondary text-base">$24,850.00</span>
              </div>
            </div>

            {/* Fund Flow Split */}
            <div className="mt-6 pt-4 border-t border-outline">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                Automated Multi-Party Split
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-surface-variant/70 rounded-lg">
                  <div className="text-xs text-on-surface-variant">Carrier Net Remittance:</div>
                  <div className="text-lg font-bold font-mono text-on-surface mt-1">$21,122.50</div>
                  <div className="text-[10px] text-on-surface-variant">BNSF Freight Account via ACH Direct</div>
                </div>

                <div className="p-3 bg-primary-container rounded-lg border border-secondary">
                  <div className="text-xs text-secondary font-semibold">DealFlow360 Platform Margin:</div>
                  <div className="text-lg font-bold font-mono text-secondary mt-1">$3,727.50 (15.0%)</div>
                  <div className="text-[10px] text-on-primary-container">Retained Trading Margin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols */}
        <div className="lg:col-span-4 flex flex-col gap-spacing-lg">
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <span className="font-bold text-on-surface text-sm block mb-3">Banking &amp; Clearing Profile</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Corporate ACH Routing:</span>
                <span className="font-mono font-bold text-on-surface">071000288</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipper Account:</span>
                <span className="font-mono text-on-surface">Acme Global Logistics</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Audit Reference:</span>
                <span className="font-mono text-primary font-bold">SOX-SET-9402</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
