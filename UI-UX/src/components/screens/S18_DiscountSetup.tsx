import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { Shield, CheckCircle2, Save, Sparkles, AlertCircle } from 'lucide-react';

export const S18_DiscountSetup: React.FC = () => {
  const [saved, setSaved] = useState(false);

  // Ceilings state
  const [goldCeiling, setGoldCeiling] = useState(15);
  const [silverCeiling, setSilverCeiling] = useState(10);
  const [bronzeCeiling, setBronzeCeiling] = useState(5);

  const [hwCeiling, setHwCeiling] = useState(15);
  const [servCeiling, setServCeiling] = useState(10);
  const [subCeiling, setSubCeiling] = useState(20);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Policy Daemon Configuration</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Discount Tiers & Approval Chains
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure multi-tier discount ceilings per customer tier, category thresholds, and automated routing rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Policy Configuration</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Approval policy rules committed to active deal governor engine!</span>
        </div>
      )}

      {/* Forms matching Excalidraw Screen 18 */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Tier Discount Ceilings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Customer Tier Ceilings</h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2E] border border-white/5">
                <span className="font-bold text-amber-700">Bronze Tier</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={bronzeCeiling}
                    onChange={(e) => setBronzeCeiling(Number(e.target.value))}
                    className="w-12 bg-slate-900 text-center font-mono font-bold text-white rounded p-1 outline-none"
                  />
                  <span className="text-slate-400">% max discount</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2E] border border-white/5">
                <span className="font-bold text-slate-300">Silver Tier</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={silverCeiling}
                    onChange={(e) => setSilverCeiling(Number(e.target.value))}
                    className="w-12 bg-slate-900 text-center font-mono font-bold text-white rounded p-1 outline-none"
                  />
                  <span className="text-slate-400">% max discount</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2E] border border-white/5">
                <span className="font-bold text-amber-400">Gold Tier (Acme Corp)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={goldCeiling}
                    onChange={(e) => setGoldCeiling(Number(e.target.value))}
                    className="w-12 bg-slate-900 text-center font-mono font-bold text-white rounded p-1 outline-none"
                  />
                  <span className="text-slate-400">% max discount</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Ceilings */}
          <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Product Category Ceilings</h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2E] border border-white/5">
                <span className="font-bold text-white">Hardware Workstations</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={hwCeiling}
                    onChange={(e) => setHwCeiling(Number(e.target.value))}
                    className="w-12 bg-slate-900 text-center font-mono font-bold text-white rounded p-1 outline-none"
                  />
                  <span className="text-slate-400">% ceiling</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2E] border border-white/5">
                <span className="font-bold text-white">Professional Services</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={servCeiling}
                    onChange={(e) => setServCeiling(Number(e.target.value))}
                    className="w-12 bg-slate-900 text-center font-mono font-bold text-white rounded p-1 outline-none"
                  />
                  <span className="text-slate-400">% ceiling</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2E] border border-white/5">
                <span className="font-bold text-white">Care Plan Subscriptions</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={subCeiling}
                    onChange={(e) => setSubCeiling(Number(e.target.value))}
                    className="w-12 bg-slate-900 text-center font-mono font-bold text-white rounded p-1 outline-none"
                  />
                  <span className="text-slate-400">% ceiling</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Chain Routing Matrix */}
        <div className="bg-[#0D1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Approval Routing Thresholds</h2>
            <span className="text-xs text-brand-orange font-semibold font-mono">Pure Math Routing</span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-4">Discount Risk Range</th>
                  <th className="py-2.5 px-4">Blended Score Threshold</th>
                  <th className="py-2.5 px-4">Required Approval Chain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 px-4 font-semibold text-emerald-400">Within Tier / Category Ceilings</td>
                  <td className="py-3 px-4 font-mono">Score 0 – 24</td>
                  <td className="py-3 px-4 font-bold text-white">Auto-Approved (Zero Delay)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-amber-400">Over Limit (Medium Risk)</td>
                  <td className="py-3 px-4 font-mono">Score 25 – 49</td>
                  <td className="py-3 px-4 font-bold text-slate-200">Sales Manager Only</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-rose-400">High Risk or Single Line &gt;15pt</td>
                  <td className="py-3 px-4 font-mono">Score 50+ or worst line breach</td>
                  <td className="py-3 px-4 font-bold text-rose-300">Sales Manager followed by Finance</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Blended Risk Governance Rule (Section 10):</strong> When a quotation mixes items with different
              ceilings, the system computes the blended weighted risk score and routes to the highest required level. All
              approvals, rejections, and edits are logged with actor, timestamp, and rationale.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
