import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CustomerPortal() {
  const { navigate, setIsNewQuoteOpen, addToast } = useApp();
  const [selectedAccount, setSelectedAccount] = useState('acme');

  const clients = [
    {
      id: 'acme',
      name: 'Acme Global Logistics Inc.',
      tier: 'Tier 1 Enterprise',
      contact: 'Eleanor Vance / David Miller',
      email: 'logistics@acmeglobal.com',
      creditLine: '$2,500,000',
      utilized: '$480,000 (19.2%)',
      dso: '32 Days',
      health: '98/100',
      activeQuotes: 4,
      dispatches: 12
    },
    {
      id: 'falcon',
      name: 'Falcon Aerospace Supply',
      tier: 'Strategic Partner',
      contact: 'Marcus Vance / Dr. Aris Thorne',
      email: 'procurement@falcon-aero.com',
      creditLine: '$5,000,000',
      utilized: '$1,420,000 (28.4%)',
      dso: '38 Days',
      health: '92/100',
      activeQuotes: 2,
      dispatches: 8
    },
    {
      id: 'pacific',
      name: 'Pacific Rim FMCG',
      tier: 'Mid-Market Volume',
      contact: 'Sarah Jenkins / Kenji Sato',
      email: 'freight@pacificrim-fmcg.jp',
      creditLine: '$1,200,000',
      utilized: '$410,000 (34.1%)',
      dso: '24 Days',
      health: '97/100',
      activeQuotes: 1,
      dispatches: 18
    }
  ];

  const currentClient = clients.find((c) => c.id === selectedAccount) || clients[0];

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div>
          <h1 className="font-title-large text-title-large text-on-surface tracking-tight font-black">
            Customer Portal &amp; Account 360
          </h1>
          <p className="font-body-medium text-body-medium text-on-surface-variant max-w-3xl">
            Manage institutional accounts, shipper master credit lines, active contract commitments, and dedicated logistics contacts.
          </p>
        </div>

        <div className="flex items-center gap-spacing-sm shrink-0">
          <button
            onClick={() => addToast('CRM Exported', 'Downloaded client directory & ledger balances.', 'info')}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 rounded-lg bg-surface text-on-surface hover:bg-surface-variant border border-outline transition-colors shadow-sm font-label-large text-label-large"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export CRM Data</span>
          </button>
          <button
            onClick={() => setIsNewQuoteOpen(true)}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary transition-colors shadow-md font-label-large text-label-large"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Request Instant Quote</span>
          </button>
        </div>
      </div>

      {/* Bento KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-spacing-md">
        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Active Client Accounts
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">142 Shippers</div>
          <span className="text-xs text-primary font-bold mt-1">+8 this quarter · 99.1% Retention</span>
        </div>

        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Underwritten Facility
          </span>
          <div className="text-2xl font-black text-secondary mt-1">$48.5M</div>
          <span className="text-xs text-on-surface-variant mt-1">Total credit pool committed</span>
        </div>

        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Active Contract Volume
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">$12.4M</div>
          <span className="text-xs text-on-surface-variant mt-1">Across 86 ongoing lanes</span>
        </div>

        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Weighted Health Score
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">96.8 / 100</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">Prime Shipper Portfolio</span>
        </div>
      </div>

      {/* Client Selector & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-lg">
        {/* Client List (4 cols) */}
        <div className="lg:col-span-4 bg-surface rounded-xl p-spacing-md shadow-sm border border-outline">
          <h2 className="font-bold text-sm text-on-surface mb-3 px-2">Institutional Shippers</h2>
          <div className="space-y-2">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedAccount(client.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedAccount === client.id
                    ? 'bg-primary-container border-secondary-container shadow-sm'
                    : 'bg-surface hover:bg-surface-variant border-outline'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface">{client.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-variant font-bold text-secondary">
                    {client.tier}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant mt-1">
                  Credit: <strong>{client.creditLine}</strong> ({client.utilized})
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Client 360 View (8 cols) */}
        <div className="lg:col-span-8 bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-title-small text-title-small text-on-surface font-extrabold">
                  {currentClient.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-primary font-bold text-xs">
                  {currentClient.tier}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Dedicated Contacts: <strong>{currentClient.contact}</strong> ({currentClient.email})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('quotations')}
                className="px-3 py-1.5 bg-surface-variant hover:bg-surface text-secondary text-xs font-bold rounded-lg border border-outline transition-colors"
              >
                View Lane Quotes ({currentClient.activeQuotes})
              </button>
              <button
                onClick={() => navigate('fulfillment')}
                className="px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-secondary transition-colors"
              >
                Track Dispatches ({currentClient.dispatches})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-xl bg-surface-variant/70 border border-outline">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Credit Facility Limit
              </span>
              <div className="text-xl font-black font-mono text-on-surface mt-1">
                {currentClient.creditLine}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">Available Capacity</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-variant/70 border border-outline">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Utilized Outstanding
              </span>
              <div className="text-xl font-black font-mono text-secondary mt-1">
                {currentClient.utilized}
              </div>
              <span className="text-[11px] text-on-surface-variant">Revolving ACH Net-30</span>
            </div>

            <div className="p-4 rounded-xl bg-surface-variant/70 border border-outline">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Account Health Score
              </span>
              <div className="text-xl font-black font-mono text-emerald-700 mt-1">
                {currentClient.health}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">DSO: {currentClient.dso}</span>
            </div>
          </div>

          {/* Quick Active Quotes Table */}
          <div className="border border-outline rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-variant text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Active Negotiated Freight Contracts
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-outline">
                <div>
                  <div className="font-bold text-on-surface">Quotation Q-1024 - 24 TEU Rotterdam → New York</div>
                  <div className="text-on-surface-variant">Ocean FCL + BNSF Intermodal Rail · 22.4% Gross Margin</div>
                </div>
                <button
                  onClick={() => navigate('quotation-detail', { quoteId: 'Q-1024' })}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Inspect $124.5k →
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-on-surface">Order SH-9402 - Rail Mainline Rolling</div>
                  <div className="text-on-surface-variant">BOL-BNSF-88190 · ETA Today 18:30 EST · Milepost 314</div>
                </div>
                <button
                  onClick={() => navigate('fulfillment-detail', { orderId: 'SH-9402' })}
                  className="text-xs font-bold text-secondary hover:underline"
                >
                  Track Waybill →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
