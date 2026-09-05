import React from 'react';
import { useDealContext } from '../../store/DealContext';
import { Package, Plus, ChevronRight, Tag, Layers } from 'lucide-react';

export const S16_ProductCatalog: React.FC = () => {
  const { products, setActiveScreen } = useDealContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Master Data & Price Books</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Product & SKU Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every product, attribute variant, and category discount limit configured in one master repository.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('s17_product_detail')}
            className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Product</span>
          </button>
        </div>
      </div>

      {/* Summary Badges matching Excalidraw Screen 16 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="text-lg font-black text-white font-mono">125 Active</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-telemetry-blue/10 flex items-center justify-center text-telemetry-blue">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Price Lists</span>
            <div className="text-lg font-black text-white font-mono">3 Tiers (Gold/Silver/Bronze)</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1322] border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Active Variants</span>
            <div className="text-lg font-black text-white font-mono">140 SKUs</div>
          </div>
        </div>
      </div>

      {/* Catalog Table matching Excalidraw Screen 16 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Base Price</th>
              <th className="py-3 px-4">Standard Cost</th>
              <th className="py-3 px-4">Category Ceiling</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Stock (Main / East)</th>
              <th className="py-3 px-4 text-right">Configure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {products.map((p) => (
              <tr
                key={p.id}
                onClick={() => setActiveScreen('s17_product_detail')}
                className="hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-sans font-bold text-white">{p.name}</td>
                <td className="py-3.5 px-4 font-sans text-slate-300">{p.category}</td>
                <td className="py-3.5 px-4 font-bold text-white">${p.price.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-slate-400">${p.cost.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-brand-orange font-bold">{p.categoryCeiling}%</td>
                <td className="py-3.5 px-4 font-sans">
                  {p.isSubscription ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                      Subscription
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 text-[10px]">
                      One-Time
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {p.stockMain} / {p.stockEast}
                </td>
                <td className="py-3.5 px-4 text-right font-sans">
                  <ChevronRight className="w-4 h-4 text-slate-400 inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
