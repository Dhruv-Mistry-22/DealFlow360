import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import { BarChart3, Download, Filter, Calendar, Users, CheckCircle, Package } from 'lucide-react';

export const S15_AdminReporting: React.FC = () => {
  const [period, setPeriod] = useState('This Month');
  const [repFilter, setRepFilter] = useState('All Reps');
  const [exportMessage, setExportMessage] = useState('');

  const handleExport = (type: string) => {
    setExportMessage(`Generated and downloaded ${type} operational audit report.`);
    setTimeout(() => setExportMessage(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Executive Insights</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-0.5">
            Admin & Reporting Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sales trends, approval bottlenecks, platform margin protection, and fulfillment velocity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 rounded-lg bg-[#131B2E] hover:bg-[#1B253D] border border-white/10 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-brand-orange" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('XLS')}
            className="px-3.5 py-2 rounded-lg bg-[#131B2E] hover:bg-[#1B253D] border border-white/10 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export XLS</span>
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* Filter Bar matching Excalidraw Screen 15 */}
      <div className="p-4 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Period</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Custom Range</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Sales Rep / Team</label>
          <select
            value={repFilter}
            onChange={(e) => setRepFilter(e.target.value)}
            className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
          >
            <option>All Reps</option>
            <option>J. Rao (Mid-Market)</option>
            <option>M. Mehta (Enterprise)</option>
            <option>A. Patel (SMB)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Approval Status</label>
          <select className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2 text-xs text-white outline-none">
            <option>All Statuses</option>
            <option>Pending Manager</option>
            <option>Pending Finance</option>
            <option>Approved</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Product Category</label>
          <select className="w-full bg-[#131B2E] border border-white/10 rounded-lg p-2 text-xs text-white outline-none">
            <option>All Categories</option>
            <option>Hardware Workstations</option>
            <option>Onsite Services</option>
            <option>Care Plan Subscriptions</option>
          </select>
        </div>
      </div>

      {/* Metric Cards matching Excalidraw Screen 15 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quotes Created</span>
          <div className="text-3xl font-black text-white font-mono">144</div>
          <p className="text-xs text-slate-400">Total proposals generated this billing cycle (+18% MoM).</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Approval Time</span>
          <div className="text-3xl font-black text-brand-orange font-mono">4.4 hours</div>
          <p className="text-xs text-slate-400">Reduced from 2.5 days via automated Blended Risk Routing.</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Upsell Product</span>
          <div className="text-3xl font-black text-emerald-400 font-mono">Care Plan 2yr</div>
          <p className="text-xs text-slate-400">Attached to 68% of workstation hardware orders.</p>
        </div>
      </div>
    </div>
  );
};
