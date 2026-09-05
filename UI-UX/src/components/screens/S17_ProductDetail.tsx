import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { Package, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';

export const S17_ProductDetail: React.FC = () => {
  const { setActiveScreen } = useDealContext();
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('s16_products')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Product & Pricelist Details: Laptop Pro 14
            </h1>
            <p className="text-xs text-slate-400">SKU: PROD-1042-WORKSTATION • Category: Hardware Workstations</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Product and pricing attributes saved to Odoo 19 database!</span>
        </div>
      )}

      {/* Form matching Excalidraw Screen 17 */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* General Info Card */}
        <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">General Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Product Name</label>
              <input
                type="text"
                defaultValue="Laptop Pro 14"
                className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2.5 text-white outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Category</label>
              <select defaultValue="Hardware" className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2.5 text-white outline-none">
                <option>Hardware</option>
                <option>Services</option>
                <option>Subscriptions</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Base Price ($)</label>
              <input
                type="number"
                defaultValue="1200"
                className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2.5 text-white outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Category Discount Ceiling (%)</label>
              <input
                type="number"
                defaultValue="15"
                className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2.5 text-brand-orange outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                defaultValue="18"
                className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2.5 text-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Subscription / Recurring Plan</label>
              <select defaultValue="No" className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2.5 text-white outline-none">
                <option>No (One-Time CapEx)</option>
                <option>Yes (Recurring OpEx)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Variants & Attributes Card */}
        <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Attributes & Extra Pricing</h2>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-4">Attribute</th>
                  <th className="py-2.5 px-4">Allowed Values</th>
                  <th className="py-2.5 px-4">Extra Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                <tr>
                  <td className="py-3 px-4 font-sans font-semibold text-white">Color</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">Space Gray, Silver, Black</td>
                  <td className="py-3 px-4 font-bold text-white">$0.00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-semibold text-white">RAM Expansion</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">16GB Standard, 32GB Pro</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">+$240.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Tier Pricing Rules */}
        <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Customer Tier Price Rules</h2>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-4">Tier</th>
                  <th className="py-2.5 px-4">Currency</th>
                  <th className="py-2.5 px-4">Automatic Price Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                <tr>
                  <td className="py-3 px-4 font-sans font-bold text-amber-400">Gold Tier</td>
                  <td className="py-3 px-4">USD ($)</td>
                  <td className="py-3 px-4 font-sans text-emerald-400 font-semibold">Price minus 10% base contract</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-bold text-slate-300">Silver Tier</td>
                  <td className="py-3 px-4">USD ($)</td>
                  <td className="py-3 px-4 font-sans text-emerald-400 font-semibold">Price minus 5% base contract</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans font-bold text-amber-700">Bronze Tier</td>
                  <td className="py-3 px-4">USD ($)</td>
                  <td className="py-3 px-4 font-sans text-slate-400">Standard List Price</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};
