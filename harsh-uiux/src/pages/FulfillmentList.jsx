import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function FulfillmentList() {
  const { navigate, addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const shipments = [
    {
      id: 'SH-9402',
      quoteRef: 'Q-1024',
      bol: 'BOL-BNSF-88190',
      consignee: 'Acme Global Logistics',
      carrier: 'BNSF Logistics',
      carrierMode: 'Intermodal Rail',
      lane: 'Rotterdam (NLRTM) → New York → Chicago',
      value: '$24,850.00',
      status: 'Rail Mainline Rolling',
      statusColor: 'bg-primary-container text-primary',
      eta: 'Today 18:30',
      telemetry: 'Active IoT Ping',
      exception: false
    },
    {
      id: 'SH-9405',
      quoteRef: 'Q-1028',
      bol: 'BOL-MSK-44910',
      consignee: 'Falcon Aerospace Supply',
      carrier: 'Maersk Line Ocean',
      carrierMode: 'Ocean FCL',
      lane: 'Hamburg (DEHAM) → New York (USNYC)',
      value: '$112,400.00',
      status: 'At Sea / Vessel Transit',
      statusColor: 'bg-surface-container text-secondary',
      eta: 'Nov 02 06:00',
      telemetry: 'AIS Satellite Active',
      exception: false
    },
    {
      id: 'SH-9388',
      quoteRef: 'Q-9904',
      bol: 'BOL-JBHT-1192',
      consignee: 'Swift Freight Systems',
      carrier: 'J.B. Hunt Transport',
      carrierMode: 'Dedicated Truckload',
      lane: 'Shenzhen → Long Beach Ramp',
      value: '$58,000.00',
      status: 'At Rail Terminal',
      statusColor: 'bg-surface-variant text-on-surface',
      eta: 'Tomorrow 09:00',
      telemetry: 'Gate In Verified',
      exception: false
    },
    {
      id: 'SH-9370',
      quoteRef: 'Q-7822',
      bol: 'BOL-HAP-7782',
      consignee: 'OmniCold Storage',
      carrier: 'Hapag-Lloyd Reefer',
      carrierMode: 'Cold-Chain Ocean',
      lane: 'Antwerp (BEANR) → Savannah (USSAV)',
      value: '$84,200.00',
      status: 'Customs Dwell Exception',
      statusColor: 'bg-error-container text-on-tertiary-container',
      eta: 'Delayed (+4h)',
      telemetry: 'FDA Hold Notice',
      exception: true
    }
  ];

  const filtered = shipments.filter((s) => {
    if (filter === 'transit' && !s.status.includes('Transit') && !s.status.includes('Rolling')) return false;
    if (filter === 'terminal' && !s.status.includes('Terminal')) return false;
    if (filter === 'exception' && !s.exception) return false;

    if (search) {
      const matchText = `${s.id} ${s.bol} ${s.consignee} ${s.carrier} ${s.lane}`.toLowerCase();
      if (!matchText.includes(search.toLowerCase())) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-title-large text-title-large text-on-surface tracking-tight font-black">
              Fulfillment &amp; Carrier Dispatch
            </h1>
            <span className="px-2.5 py-0.5 bg-primary-container text-secondary font-label-small text-label-small rounded-full uppercase tracking-wider font-bold">
              Live Telemetry Active
            </span>
          </div>
          <p className="font-body-medium text-body-medium text-on-surface-variant">
            Monitor multi-modal freight execution, intermodal rail status, bills of lading (BOL), and carrier SLA telemetry.
          </p>
        </div>

        <div className="flex items-center gap-spacing-sm">
          <button
            onClick={() => addToast('Manifest Exported', 'Master EDI-214 manifest generated.', 'info')}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 bg-surface text-secondary font-label-large text-label-large rounded-lg shadow-sm hover:bg-primary-container border border-outline transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Manifest</span>
          </button>
          <button
            onClick={() => addToast('Dispatch Wizard', 'Opened autonomous carrier booking engine.', 'info')}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 bg-tertiary text-on-tertiary font-label-large text-label-large rounded-lg shadow-md hover:bg-tertiary-container transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_road</span>
            <span>+ Dispatch Shipment</span>
          </button>
        </div>
      </div>

      {/* Operational Flow Summary Pills */}
      <div className="flex flex-wrap items-center gap-spacing-xs p-spacing-xs bg-surface rounded-xl shadow-sm border border-outline">
        <button
          onClick={() => setFilter('all')}
          className={`px-spacing-md py-spacing-2xs rounded-lg text-label-small transition-colors flex items-center gap-spacing-xs ${
            filter === 'all' ? 'bg-primary-container text-secondary font-bold' : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span>All Dispatches</span>
          <span className="font-bold ml-1">{shipments.length}</span>
        </button>

        <button
          onClick={() => setFilter('transit')}
          className={`px-spacing-md py-spacing-2xs rounded-lg text-label-small transition-colors flex items-center gap-spacing-xs ${
            filter === 'transit' ? 'bg-primary-container text-secondary font-bold' : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span>In Transit / Rolling</span>
          <span className="font-bold ml-1">2</span>
        </button>

        <button
          onClick={() => setFilter('terminal')}
          className={`px-spacing-md py-spacing-2xs rounded-lg text-label-small transition-colors flex items-center gap-spacing-xs ${
            filter === 'terminal' ? 'bg-primary-container text-secondary font-bold' : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-surface-container-high"></span>
          <span>At Port / Terminal</span>
          <span className="font-bold ml-1">1</span>
        </button>

        <button
          onClick={() => setFilter('exception')}
          className={`px-spacing-md py-spacing-2xs rounded-lg text-label-small transition-colors flex items-center gap-spacing-xs ${
            filter === 'exception' ? 'bg-error-container text-on-error-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
          <span>Exceptions / Customs Delays</span>
          <span className="font-bold ml-1">1</span>
        </button>
      </div>

      {/* KPI Metric Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-spacing-md">
        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            On-Time Dispatch SLA
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">98.4%</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">Within ±15m window</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Freight in Motion Value
          </span>
          <div className="text-2xl font-black text-secondary mt-1">$24.8M</div>
          <span className="text-xs text-on-surface-variant mt-1">Across 91 active dispatches</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Active Bills of Lading
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">184 BOLs</div>
          <span className="text-xs text-on-surface-variant mt-1">100% EDI-214 synchronized</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Avg Rail Dwell Time
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">1.8h</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">-30% under benchmark</span>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden">
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between bg-surface">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by waybill, BOL, consignee, or carrier..."
            className="w-full max-w-sm h-9 pl-3 pr-3 bg-surface-variant border border-outline rounded-lg text-xs focus:outline-none focus:border-primary"
          />
          <span className="text-xs text-on-surface-variant">Showing {filtered.length} active orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-6">Order ID &amp; BOL</th>
                <th className="py-3 px-4">Consignee Account</th>
                <th className="py-3 px-4">Carrier &amp; Mode</th>
                <th className="py-3 px-4">Corridor Lane</th>
                <th className="py-3 px-4">Freight Value</th>
                <th className="py-3 px-4">Tracking Status</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-surface-variant/40 transition-colors cursor-pointer"
                  onClick={() => navigate('fulfillment-detail', { orderId: s.id })}
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-mono font-bold text-secondary text-sm">{s.id}</div>
                    <div className="text-[11px] text-on-surface-variant font-mono">{s.bol}</div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-on-surface">{s.consignee}</td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-on-surface">{s.carrier}</div>
                    <div className="text-[11px] text-on-surface-variant">{s.carrierMode}</div>
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant">{s.lane}</td>
                  <td className="py-4 px-4 font-mono font-bold text-on-secondary-container">
                    {s.value}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.statusColor}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-on-surface whitespace-nowrap">{s.eta}</td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate('fulfillment-detail', { orderId: s.id })}
                      className="px-3 py-1.5 rounded-lg bg-surface-variant hover:bg-primary-container text-secondary text-xs font-semibold transition-colors"
                    >
                      Track Order
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
