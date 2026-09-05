import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SubscriptionList() {
  const { navigate, addToast } = useApp();
  const [filter, setFilter] = useState('all');

  const subscriptions = [
    {
      id: 'SUB-ENT-9012',
      customer: 'Acme Global Logistics Inc.',
      tier: 'Enterprise Global Fleet Tier',
      seats: '250 Seats + Full API',
      cadence: 'Annual (Paid Monthly)',
      amount: '$45,000.00 / mo',
      arr: '$540,000 ARR',
      renewal: 'Dec 15, 2025',
      status: 'Active · Auto-Renew',
      health: '99% Health'
    },
    {
      id: 'SUB-ENT-8841',
      customer: 'Falcon Aerospace Supply',
      tier: 'Strategic Multi-Modal Fleet Tier',
      seats: '500 Seats + Dedicated Telemetry',
      cadence: 'Multi-Year Contract',
      amount: '$72,000.00 / mo',
      arr: '$864,000 ARR',
      renewal: 'Oct 31, 2026',
      status: 'Active · Strategic Lock',
      health: '94% Health'
    },
    {
      id: 'SUB-MID-3391',
      customer: 'Pacific Rim FMCG',
      tier: 'Mid-Market Corridor Tier',
      seats: '75 Seats + EDI 810 Gateway',
      cadence: 'Annual Prepaid',
      amount: '$18,500.00 / mo',
      arr: '$222,000 ARR',
      renewal: 'Nov 30, 2024',
      status: 'Renewal Upcoming (30d)',
      health: '97% Health'
    },
    {
      id: 'SUB-MID-1102',
      customer: 'Swift Freight Systems',
      tier: 'Intermodal Logistics Seat Tier',
      seats: '50 Seats',
      cadence: 'Quarterly',
      amount: '$12,400.00 / mo',
      arr: '$148,800 ARR',
      renewal: 'Jan 15, 2025',
      status: 'Active',
      health: '91% Health'
    }
  ];

  const filtered = subscriptions.filter((s) => {
    if (filter === 'enterprise' && !s.tier.includes('Enterprise') && !s.tier.includes('Strategic')) return false;
    if (filter === 'midmarket' && !s.tier.includes('Mid-Market') && !s.tier.includes('Intermodal')) return false;
    if (filter === 'renewal' && !s.status.includes('Renewal')) return false;
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-small text-label-small uppercase tracking-widest text-secondary font-bold">
              DealFlow360 Recurring Contracts
            </span>
          </div>
          <h1 className="font-title-large text-title-large text-on-surface tracking-tight font-black">
            Enterprise Subscriptions &amp; Platform Tiers
          </h1>
          <p className="font-body-medium text-body-medium text-on-surface-variant leading-relaxed max-w-3xl">
            Manage enterprise shipper software seats, recurring carrier network allocations, API telemetry throughput, and billing cadence across multimodal freight networks.
          </p>
        </div>

        <div className="flex items-center gap-spacing-xs shrink-0">
          <button
            onClick={() => addToast('Ledger Exported', 'Recurring revenue ledger downloaded.', 'info')}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 bg-surface-variant hover:bg-surface text-secondary font-label-large text-label-large rounded-lg border border-outline transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export Ledger</span>
          </button>
          <button
            onClick={() => addToast('New Agreement Wizard', 'Initiated new recurring software/carrier subscription contract.', 'info')}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 bg-tertiary hover:opacity-95 text-on-tertiary font-label-large text-label-large rounded-lg transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ New Subscription</span>
          </button>
        </div>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-spacing-xs overflow-x-auto pb-1 text-nowrap">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-spacing-sm py-1.5 rounded-full font-label-medium text-label-medium transition-all ${
            filter === 'all'
              ? 'bg-primary text-on-primary shadow-sm font-bold'
              : 'bg-surface hover:bg-surface-variant text-on-surface-variant border border-outline'
          }`}
        >
          <span>All Subscriptions</span>
          <span className="px-1.5 py-0.5 rounded-full bg-primary-container text-primary text-[11px] font-bold">
            {subscriptions.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('enterprise')}
          className={`flex items-center gap-2 px-spacing-sm py-1.5 rounded-full font-label-medium text-label-medium transition-all ${
            filter === 'enterprise'
              ? 'bg-primary text-on-primary shadow-sm font-bold'
              : 'bg-surface hover:bg-surface-variant text-on-surface-variant border border-outline'
          }`}
        >
          <span>Enterprise Volume Tier</span>
          <span className="px-1.5 py-0.5 rounded-full bg-surface-variant text-on-surface text-[11px] font-bold">
            2
          </span>
        </button>

        <button
          onClick={() => setFilter('midmarket')}
          className={`flex items-center gap-2 px-spacing-sm py-1.5 rounded-full font-label-medium text-label-medium transition-all ${
            filter === 'midmarket'
              ? 'bg-primary text-on-primary shadow-sm font-bold'
              : 'bg-surface hover:bg-surface-variant text-on-surface-variant border border-outline'
          }`}
        >
          <span>Mid-Market Tiers</span>
          <span className="px-1.5 py-0.5 rounded-full bg-surface-variant text-on-surface text-[11px] font-bold">
            2
          </span>
        </button>

        <button
          onClick={() => setFilter('renewal')}
          className={`flex items-center gap-2 px-spacing-sm py-1.5 rounded-full font-label-medium text-label-medium transition-all ${
            filter === 'renewal'
              ? 'bg-primary text-on-primary shadow-sm font-bold'
              : 'bg-surface hover:bg-surface-variant text-on-surface-variant border border-outline'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-tertiary"></span>
          <span>Renewals This Month</span>
          <span className="px-1.5 py-0.5 rounded-full bg-tertiary-container text-tertiary text-[11px] font-bold">
            1
          </span>
        </button>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-spacing-md">
        <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Annual Recurring Revenue (ARR)
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">$18.4M</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">+24.2% YoY Growth</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Net Revenue Retention (NRR)
          </span>
          <div className="text-2xl font-black text-secondary mt-1">118.4%</div>
          <span className="text-xs text-secondary font-semibold mt-1">Expansion across shipper seats</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Monthly Recurring Revenue (MRR)
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">$1.53M</div>
          <span className="text-xs text-on-surface-variant mt-1">Consistent monthly billing</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Gross Churn Rate
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">0.8%</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">Industry low benchmark</span>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-6">Contract ID</th>
                <th className="py-3 px-4">Shipper Account</th>
                <th className="py-3 px-4">Platform Tier &amp; Capacity</th>
                <th className="py-3 px-4 text-right">Recurring Fee</th>
                <th className="py-3 px-4 text-right">Annual Run-Rate</th>
                <th className="py-3 px-4">Renewal Date</th>
                <th className="py-3 px-4">Contract Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-surface-variant/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-secondary text-sm">{s.id}</td>
                  <td className="py-4 px-4 font-bold text-on-surface">{s.customer}</td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-on-surface">{s.tier}</div>
                    <div className="text-[11px] text-on-surface-variant">{s.seats}</div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-on-secondary-container">
                    {s.amount}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-emerald-700">
                    {s.arr}
                  </td>
                  <td className="py-4 px-4 font-mono text-on-surface whitespace-nowrap">{s.renewal}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        s.status.includes('Upcoming')
                          ? 'bg-amber-100 text-amber-800 font-bold'
                          : 'bg-primary-container text-primary'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => addToast('Contract Details', `Managing recurring contract for ${s.customer}.`, 'info')}
                      className="px-3 py-1.5 rounded-lg bg-surface-variant hover:bg-surface text-secondary text-xs font-semibold border border-outline transition-colors"
                    >
                      Manage
                    </button>
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
