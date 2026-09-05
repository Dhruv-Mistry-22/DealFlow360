import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { Boxes, Truck, AlertTriangle, CheckCircle2, ArrowRight, Sliders, RefreshCw } from 'lucide-react';

export const S08_FulfillmentDetail: React.FC = () => {
  const { fulfillmentOrders, consolidateFulfillment, setActiveScreen } = useDealContext();
  const order = fulfillmentOrders[0];

  const [mainQty, setMainQty] = useState(order.hasConsolidated ? 16 : 10);
  const [eastQty, setEastQty] = useState(order.hasConsolidated ? 0 : 6);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
              {order.quoteNumber}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Fulfillment Detail: {order.customerName}
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                order.hasConsolidated
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {order.hasConsolidated ? 'Consolidated (1 Depot)' : 'Multi-Warehouse Split'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Order Reference: {order.orderNumber} • Target Item: Laptop Pro 14 (16 total units)
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('s10_billing_detail')}
          className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
        >
          <span>Proceed to Billing Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Split Shipment Alert or Consolidated Banner */}
      {!order.hasConsolidated ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Split Shipment Detected (Greedy Minimization Fallback)
              </h3>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                Order requires 16 units of Laptop Pro 14. Stock at Main Warehouse is limited to 10 units. Algorithm split 6
                units to East Depot, incurring an additional <strong>$28.00</strong> in secondary freight cost.
              </p>
            </div>
          </div>
          <button
            onClick={() => consolidateFulfillment(order.id)}
            className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold whitespace-nowrap shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Consolidate Remaining Backorder</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Consolidated Shipment Complete
            </h3>
            <p className="text-xs text-slate-200 mt-0.5">
              Internal stock transfer scheduled from East Depot. Full order will dispatch in 1 single package from Main
              Warehouse, saving <strong>$28.00</strong> in freight fees!
            </p>
          </div>
        </div>
      )}

      {/* Warehouse Allocation Cards from Excalidraw Screen 8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Depot 1: Main Warehouse */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white">Main Warehouse (Primary Hub)</h3>
              <span className="text-[11px] text-slate-400">Priority: 1.0 • Ground Dispatch</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono">
              $42.00 Freight
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Item Assigned:</span>
              <span className="font-bold text-white">Laptop Pro 14</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Quantity Allocated:</span>
              <span className="font-mono font-bold text-brand-orange text-sm">{order.hasConsolidated ? '16 units' : `${mainQty} units`}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Est. Dispatched Packages:</span>
              <span className="font-mono text-white">1 Shipment</span>
            </div>
          </div>

          {/* Manual override slider */}
          <div className="pt-3 border-t border-white/5 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Manual Quantity Slider:</span>
              <span className="font-mono">{mainQty} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              value={mainQty}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMainQty(val);
                setEastQty(16 - val);
              }}
              className="w-full accent-brand-orange bg-slate-800"
            />
          </div>
        </div>

        {/* Depot 2: East Depot */}
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white">East Depot (Regional Hub)</h3>
              <span className="text-[11px] text-slate-400">Priority: 2.0 • Secondary Dispatch</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold font-mono">
              {order.hasConsolidated ? '$0.00' : '$28.00 Freight'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Item Assigned:</span>
              <span className="font-bold text-white">Laptop Pro 14 (Overflow)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Quantity Allocated:</span>
              <span className="font-mono font-bold text-slate-200 text-sm">{order.hasConsolidated ? '0 units (Transferred)' : `${eastQty} units`}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Est. Dispatched Packages:</span>
              <span className="font-mono text-white">{order.hasConsolidated ? '0 Packages' : '1 Shipment'}</span>
            </div>
          </div>

          {/* Manual override slider */}
          <div className="pt-3 border-t border-white/5 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Manual Quantity Slider:</span>
              <span className="font-mono">{eastQty} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="16"
              value={eastQty}
              onChange={(e) => {
                const val = Number(e.target.value);
                setEastQty(val);
                setMainQty(16 - val);
              }}
              className="w-full accent-brand-orange bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-center justify-between">
        <div className="text-xs">
          <span className="text-slate-400">Total Calculated Freight:</span>{' '}
          <span className="font-mono font-bold text-white text-sm">
            ${order.hasConsolidated ? '42.00' : '70.00'}
          </span>
        </div>

        <button
          onClick={() => setActiveScreen('s10_billing_detail')}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Accept Allocation & Lock Dispatch</span>
        </button>
      </div>
    </div>
  );
};
