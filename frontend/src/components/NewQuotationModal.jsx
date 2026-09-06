import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function NewQuotationModal() {
  const { isNewQuoteOpen, setIsNewQuoteOpen, handleCreateQuotation } = useApp();

  const [form, setForm] = useState({
    customer: 'Apex Global Shipping LLC',
    origin: 'Rotterdam (NLRTM)',
    destination: 'New York (USNYC)',
    mode: 'Ocean FCL',
    volume: '24 TEU',
    amount: '125000',
    cost: '95000',
    assignedRep: 'Marcus Vance'
  });

  if (!isNewQuoteOpen) return null;

  const revenue = parseFloat(form.amount) || 0;
  const cost = parseFloat(form.cost) || 0;
  const calculatedMargin = revenue > 0 ? (((revenue - cost) / revenue) * 100).toFixed(1) : 0;
  const isFloorBreached = Number(calculatedMargin) < 18.0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create quote
      const quote = await api.post('/api/v1/quotes', {
        customer_id: 1, // Hardcoded for demo
        notes: `Origin: ${form.origin}, Dest: ${form.destination}, Mode: ${form.mode}`
      });

      // 2. Add a line to make it valid for submission/deal health
      await api.post(`/api/v1/quotes/${quote.id}/lines`, {
        product_id: 1,
        quantity: 1,
        discount_given: 0.0
      });

      // 3. Update UI
      window.location.reload(); // Refresh lists
    } catch (err) {
      console.error(err);
      alert('Failed to create quote: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div
        className="w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-outline overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-tertiary-container text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">add_circle</span>
            </div>
            <div>
              <h3 className="font-title-small text-title-small text-on-secondary-container">Generate New Quotation</h3>
              <p className="text-xs text-on-surface-variant">Configure multi-modal lanes and automated margin governance</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewQuoteOpen(false)}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
              Customer / Shipper Name
            </label>
            <input
              type="text"
              required
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-surface-variant border border-outline rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. Acme Global Logistics"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Origin Port / Terminal
              </label>
              <input
                type="text"
                required
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-variant border border-outline rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="Rotterdam (NLRTM)"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Destination Port / Gateway
              </label>
              <input
                type="text"
                required
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-variant border border-outline rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="New York (USNYC)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Freight Mode
              </label>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-variant border border-outline rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="Ocean FCL">Ocean FCL (Containerized)</option>
                <option value="Ocean LCL">Ocean LCL (Consolidation)</option>
                <option value="Air Expedited">Air Expedited Priority</option>
                <option value="Intermodal Rail">Intermodal Rail Mainline</option>
                <option value="Truckload Dry Van">Truckload Dry Van (FTL)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Volume / Capacity Units
              </label>
              <input
                type="text"
                value={form.volume}
                onChange={(e) => setForm({ ...form, volume: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-variant border border-outline rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
                placeholder="e.g. 24 TEU / 40HC Reefer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Quoted Sell Amount ($ USD)
              </label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-variant border border-outline rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary font-mono font-medium"
                placeholder="125000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Carrier Baseline Cost ($ USD)
              </label>
              <input
                type="number"
                required
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-surface-variant border border-outline rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary font-mono font-medium"
                placeholder="95000"
              />
            </div>
          </div>

          {/* Live Calculated Margin & Policy Check Strip */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isFloorBreached
                ? 'bg-error-container/60 border-error/30 text-on-tertiary-container'
                : 'bg-primary-container/60 border-secondary-container text-on-primary-container'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px]">
                {isFloorBreached ? 'report_problem' : 'verified'}
              </span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider">
                  {isFloorBreached ? 'Hard Floor Triggered (< 18%)' : 'Margin Policy Compliant'}
                </div>
                <div className="text-xs opacity-90">
                  {isFloorBreached
                    ? 'Will route automatically to VP Vance for multi-tier approval'
                    : 'Within auto-dispatch authorization limits'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">{calculatedMargin}%</div>
              <div className="text-[10px] uppercase font-bold tracking-wider">Margin</div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewQuoteOpen(false)}
              className="px-4 py-2.5 rounded-lg bg-surface-variant hover:bg-surface text-on-surface font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-tertiary hover:opacity-95 text-on-tertiary font-semibold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Generate Quotation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
