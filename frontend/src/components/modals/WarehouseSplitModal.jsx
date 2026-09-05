import React, { useState } from 'react';
import { Truck, Check, Package, RotateCw, AlertCircle } from 'lucide-react';
import { INITIAL_WAREHOUSES, computeWarehouseSplit } from '../../state/dealStore';

export default function WarehouseSplitModal({ lines, onClose }) {
  const [isBackorderRestocked, setIsBackorderRestocked] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const splitResult = computeWarehouseSplit(lines, INITIAL_WAREHOUSES);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-neutral-950" />
            <h2 className="text-lg font-bold text-neutral-950">Multi-Warehouse Fulfillment Split (Q-1042)</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Greedy shipment minimization algorithm allocates live stock across depots to minimize split packages.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-lg border border-neutral-200">
            Est. Shipments: <strong>{splitResult.totalShipments}</strong>
          </span>
          <span className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-lg border border-neutral-200">
            Est. Cost: <strong>${splitResult.estimatedCost}</strong>
          </span>
        </div>
      </div>

      {/* Split Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
        
        {/* Main Warehouse Depot Card */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-neutral-950 flex items-center gap-2">
              <Package className="w-4 h-4 text-neutral-700" />
              <span>Main Warehouse (Central Hub)</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded">
              Priority 1.0
            </span>
          </div>

          <div className="space-y-2">
            {splitResult.plan['Main Warehouse'].map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-neutral-200 text-xs font-mono">
                <span className="text-neutral-900 font-semibold">{item.name}</span>
                <span className="bg-neutral-100 px-2 py-0.5 rounded font-bold text-neutral-800">{item.qty} units</span>
              </div>
            ))}
            {splitResult.plan['Main Warehouse'].length === 0 && (
              <div className="text-xs text-neutral-400 py-3 text-center">No lines assigned to Main Warehouse</div>
            )}
          </div>

          <div className="text-[11px] text-neutral-500 flex justify-between pt-2 border-t border-neutral-200">
            <span>Shipment Route: Standard Ground</span>
            <span>Package Cost: $42</span>
          </div>
        </div>

        {/* East Coast Depot Card */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-neutral-950 flex items-center gap-2">
              <Package className="w-4 h-4 text-neutral-700" />
              <span>East Coast Depot</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded">
              Weight 1.2
            </span>
          </div>

          <div className="space-y-2">
            {splitResult.plan['East Depot'].map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-neutral-200 text-xs font-mono">
                <span className="text-neutral-900 font-semibold">{item.name}</span>
                <span className="bg-neutral-100 px-2 py-0.5 rounded font-bold text-neutral-800">{item.qty} units</span>
              </div>
            ))}
            {splitResult.plan['East Depot'].length === 0 && (
              <div className="text-xs text-neutral-400 py-3 text-center">No lines assigned to East Depot</div>
            )}
          </div>

          <div className="text-[11px] text-neutral-500 flex justify-between pt-2 border-t border-neutral-200">
            <span>Shipment Route: Regional Courier</span>
            <span>Package Cost: $29</span>
          </div>
        </div>

      </div>

      {/* Backorder & Consolidation Event Prompt */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-neutral-700" />
          <div className="text-xs text-neutral-800">
            {isBackorderRestocked 
              ? '✓ Stock arrived at East Depot. Remaining backorder consolidated into a single shipment.' 
              : 'Mid-fulfillment restocking event simulator: Trigger when stock arrives.'}
          </div>
        </div>

        <button
          onClick={() => {
            setIsBackorderRestocked(true);
            showToast('✓ Remaining Backorder Consolidated into East Depot shipment');
          }}
          className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 rounded-lg transition-all cursor-pointer shadow-2xs"
        >
          {isBackorderRestocked ? 'Consolidated' : 'Consolidate Remaining Backorder'}
        </button>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-lg text-neutral-600 hover:text-neutral-900 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            showToast('✓ Split Fulfillment Plan Confirmed. Packing slips generated.');
            setTimeout(onClose, 800);
          }}
          className="px-5 py-2 text-xs font-bold rounded-lg bg-black text-white hover:bg-neutral-800 cursor-pointer"
        >
          Accept Suggested Split
        </button>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl z-50 animate-in fade-in duration-150">
          {toastMessage}
        </div>
      )}

    </div>
  );
}