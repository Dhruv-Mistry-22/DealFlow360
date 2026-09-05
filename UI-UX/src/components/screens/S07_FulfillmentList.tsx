import React from 'react';
import { useDealContext } from '../../store/DealContext';
import { Boxes, Truck, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

export const S07_FulfillmentList: React.FC = () => {
  const { warehouses, fulfillmentOrders, setActiveScreen } = useDealContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Inventory & Multi-Depot Operations</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Fulfillment & Stock Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live stock per warehouse, plus every order that still needs multi-depot fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('s08_fulfillment_detail')}
            className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Open Q-1042 Split Detail</span>
          </button>
        </div>
      </div>

      {/* Warehouse Live Stock Table matching Excalidraw Screen 7 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Boxes className="w-4 h-4 text-brand-orange" />
          <span>Live Stock Per Warehouse</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-2.5 px-4">Warehouse Depot</th>
                <th className="py-2.5 px-4">Product</th>
                <th className="py-2.5 px-4">Total In Stock</th>
                <th className="py-2.5 px-4">Reserved</th>
                <th className="py-2.5 px-4">Available To Promise</th>
                <th className="py-2.5 px-4">Base Freight Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <tr>
                <td className="py-3 px-4 font-sans font-bold text-white">Main Warehouse</td>
                <td className="py-3 px-4 font-sans text-slate-200">Laptop Pro 14</td>
                <td className="py-3 px-4 font-bold">40</td>
                <td className="py-3 px-4 text-amber-400">18</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">22</td>
                <td className="py-3 px-4 text-slate-400">$42.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-bold text-white">East Depot</td>
                <td className="py-3 px-4 font-sans text-slate-200">Laptop Pro 14</td>
                <td className="py-3 px-4 font-bold">10</td>
                <td className="py-3 px-4 text-amber-400">6</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">4</td>
                <td className="py-3 px-4 text-slate-400">$28.00</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-bold text-white">Main Warehouse</td>
                <td className="py-3 px-4 font-sans text-slate-200">Wireless Docking Station</td>
                <td className="py-3 px-4 font-bold">65</td>
                <td className="py-3 px-4 text-amber-400">12</td>
                <td className="py-3 px-4 text-emerald-400 font-bold">53</td>
                <td className="py-3 px-4 text-slate-400">$42.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Awaiting Fulfillment Table matching Excalidraw Screen 7 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Truck className="w-4 h-4 text-brand-orange" />
          <span>Orders Awaiting Multi-Depot Fulfillment</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-2.5 px-4">Order #</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Warehouse Split Plan</th>
                <th className="py-2.5 px-4">Shipments</th>
                <th className="py-2.5 px-4">Avoidable Split Loss</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fulfillmentOrders.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => setActiveScreen('s08_fulfillment_detail')}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-white">{ord.quoteNumber}</td>
                  <td className="py-3 px-4 font-semibold text-white">{ord.customerName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.status === 'Split Pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : ord.status === 'Backorder'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {ord.hasConsolidated ? 'Main Warehouse (Consolidated)' : 'Main Warehouse + East Depot'}
                  </td>
                  <td className="py-3 px-4 font-mono">{ord.totalShipments} Packages</td>
                  <td className="py-3 px-4 font-mono text-rose-400 font-bold">
                    {ord.avoidableSplitLoss > 0 ? `-$${ord.avoidableSplitLoss}.00` : '$0.00 (Optimized)'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1 rounded bg-brand-orange/20 text-brand-orange hover:bg-brand-orange hover:text-white font-bold text-[11px] transition-colors">
                      Inspect Split
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
};
