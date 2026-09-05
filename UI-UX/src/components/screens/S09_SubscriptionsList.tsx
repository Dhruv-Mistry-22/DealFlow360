import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { Receipt, Plus, ChevronRight, Calendar, CheckCircle2 } from 'lucide-react';

export const S09_SubscriptionsList: React.FC = () => {
  const { subscriptions, setActiveScreen } = useDealContext();
  const [tabFilter, setTabFilter] = useState<'Active' | 'Paused' | 'Cancelled'>('Active');

  const filteredSubs = subscriptions.filter((s) => s.status === tabFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Recurring Revenue & SLAs</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Subscriptions Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every recurring plan across every customer, regardless of which order it originated from.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-[#0D1322] border border-white/10 p-1">
            {(['Active', 'Paused', 'Cancelled'] as const).map((tab) => {
              const count = subscriptions.filter((s) => s.status === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setTabFilter(tab)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors ${
                    tabFilter === tab ? 'bg-brand-orange text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{tab}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">{count}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setActiveScreen('s10_billing_detail')}
            className="px-4 py-2 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-md shadow-brand-orange/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Plan (Admin)</span>
          </button>
        </div>
      </div>

      {/* Subscriptions Table matching Excalidraw Screen 9 */}
      <div className="bg-[#0D1322] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#131B2E] text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Subscription Plan</th>
              <th className="py-3 px-4">Billing Cycle</th>
              <th className="py-3 px-4">Recurring Rate</th>
              <th className="py-3 px-4">Next Bill Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredSubs.map((sub) => (
              <tr
                key={sub.id}
                onClick={() => setActiveScreen('s10_billing_detail')}
                className="hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-semibold text-white">{sub.customerName}</td>
                <td className="py-3.5 px-4 font-bold text-white">{sub.planName}</td>
                <td className="py-3.5 px-4 text-slate-300">{sub.billingCycle}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">${sub.amount}.00</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{sub.nextBillDate}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : sub.status === 'Paused'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
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
