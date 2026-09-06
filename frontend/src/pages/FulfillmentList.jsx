import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function FulfillmentList() {
  const { navigate, addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchFulfillment = async () => {
      try {
        const quotes = await api.get('/api/v1/quotes');
        const fulfillmentQuotes = quotes.filter(q => q.status === 'FULFILLMENT').map((q, idx) => ({
          id: `SH-94${idx.toString().padStart(2, '0')}`,
          quoteRef: `Q-${q.id.toString().padStart(4, '0')}`,
          consignee: q.customer?.name || 'Unknown',
          value: `$${Number(q.total_amount || 0).toLocaleString()}`,
          status: 'Fulfilled',
          statusColor: 'bg-primary-container text-primary',
          exception: false
        }));
        setShipments(fulfillmentQuotes);
      } catch (err) {
        addToast('Error', 'Failed to fetch fulfillment data', 'error');
      }
    };
    fetchFulfillment();
  }, [addToast]);

  const filtered = shipments.filter((s) => {
    if (filter === 'transit' && !s.status.includes('Transit') && !s.status.includes('Rolling')) return false;
    if (filter === 'terminal' && !s.status.includes('Terminal')) return false;
    if (filter === 'exception' && !s.exception) return false;

    if (search) {
      const matchText = `${s.id} ${s.consignee}`.toLowerCase();
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
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-4">Consignee Account</th>
                <th className="py-3 px-4">Freight Value</th>
                <th className="py-3 px-4">Status</th>
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
                  </td>
                  <td className="py-4 px-4 font-semibold text-on-surface">{s.consignee}</td>
                  <td className="py-4 px-4 font-mono font-bold text-on-secondary-container">
                    {s.value}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.statusColor}`}>
                      {s.status}
                    </span>
                  </td>
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
