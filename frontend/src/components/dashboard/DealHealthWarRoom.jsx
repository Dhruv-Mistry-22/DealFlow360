import React, { useState } from 'react';
import { 
  ShieldAlert, Clock, AlertTriangle, CheckCircle2, 
  Truck, ArrowUpRight, Bell, Sparkles, Filter, ChevronRight, User, RefreshCw
} from 'lucide-react';
import { INITIAL_DEALS } from '../../state/dealStore';

export default function DealHealthWarRoom({ onOpenDeal, onNavigateToTab }) {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'stalled', 'breaches', 'split'
  const [toastMessage, setToastMessage] = useState('');
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: '10 min ago', action: 'Auto-detected 31h inactivity on Q-1042 (Acme Corp).' },
    { id: 2, time: '35 min ago', action: 'Setup Service 18% discount flagged: exceeds 10% ceiling.' },
    { id: 3, time: '1 hr ago', action: 'Warehouse split generated for Laptop Pro 14 (Main: 1, East: 1).' }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Nudge Approver Action
  const handleNudge = (dealId, approver) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        return { ...d, idleHours: Math.max(0, d.idleHours - 12), status: 'Nudge Sent to ' + approver };
      }
      return d;
    }));
    setAuditLogs(prev => [
      { id: Date.now(), time: 'Just now', action: `High-priority nudge dispatched to ${approver} for ${dealId}.` },
      ...prev
    ]);
    showToast(`✓ Priority nudge sent to ${approver} via Slack/Email!`);
  };

  // Auto-Heal / Fix Action
  const handleAutoHeal = (dealId) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        return { 
          ...d, 
          riskFlag: 'Fixed: Setup disc set to 13% (Downgraded to Manager)', 
          healthScore: 78,
          status: 'Pending Manager Approval' 
        };
      }
      return d;
    }));
    setAuditLogs(prev => [
      { id: Date.now(), time: 'Just now', action: `Policy overage auto-healed on ${dealId}: downgraded approval level.` },
      ...prev
    ]);
    showToast(`✓ Deal ${dealId} discount adjusted to 13%! Approval downgraded.`);
  };

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    if (activeFilter === 'stalled') return deal.idleHours >= 24;
    if (activeFilter === 'breaches') return deal.riskFlag.includes('>');
    if (activeFilter === 'split') return deal.isSplitFulfillment;
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-neutral-950">Deal Health War Room</h1>
            <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200">
              REAL-TIME GOVERNANCE
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Proactive deal triage: automatically scans pipeline for stalled sign-offs, discount ceiling breaches, and split shipping penalties.
          </p>
        </div>

        <button
          onClick={() => {
            showToast('✓ Pipeline re-synced with Odoo ERP: all health scores fresh.');
          }}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-800 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
          <span>Sync Pipeline</span>
        </button>
      </div>

      {/* 4 HIGH-LEVEL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Stalled Deals */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stalled Deals</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-neutral-950">
            2 <span className="text-xs font-normal text-neutral-400">deals (&gt;24h)</span>
          </div>
          <p className="text-[11px] text-rose-600 font-medium">$27,342 total pipeline idle</p>
        </div>

        {/* KPI 2: Policy Breaches */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Discount Breaches</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-neutral-950">
            2 <span className="text-xs font-normal text-neutral-400">quotes</span>
          </div>
          <p className="text-[11px] text-amber-600 font-medium">Exceeds automated tier ceilings</p>
        </div>

        {/* KPI 3: Fulfillment Split Penalty */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Split Freight Loss</span>
            <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-800">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-neutral-950">
            $156 <span className="text-xs font-normal text-neutral-400">avoidable</span>
          </div>
          <p className="text-[11px] text-neutral-500">2 multi-depot split packages</p>
        </div>

        {/* KPI 4: Clean Auto-Approve Rate */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Auto-Approval Rate</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-neutral-950">
            74% <span className="text-xs font-normal text-neutral-400">pipeline</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Zero-touch rapid dispatch</p>
        </div>

      </div>

      {/* FILTER TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-neutral-200">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Active Quotes' },
            { id: 'stalled', label: 'Stalled Deals (>24h)' },
            { id: 'breaches', label: 'Policy Breaches' },
            { id: 'split', label: 'Multi-Warehouse Splits' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-neutral-400 px-2">
          Showing {filteredDeals.length} of {deals.length} deals
        </span>
      </div>

      {/* DEALS TRIAGE TABLE */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Deal & Customer</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3 text-center">Health</th>
                <th className="py-3 px-3">Idle Time</th>
                <th className="py-3 px-3">Risk & Policy Flag</th>
                <th className="py-3 px-3">Status / Approver</th>
                <th className="py-3 px-4 text-right">Quick Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredDeals.map(deal => {
                const isHighRisk = deal.healthScore < 50;
                const isStalled = deal.idleHours >= 24;

                return (
                  <tr key={deal.id} className="hover:bg-neutral-50/60 transition-colors">
                    
                    {/* Deal Name & ID */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-neutral-950 text-xs flex items-center gap-1.5">
                        <span>{deal.dealName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-400 font-mono">
                        <span className="font-bold text-neutral-700">{deal.id}</span>
                        <span>·</span>
                        <span>Tier: {deal.tier}</span>
                        <span>·</span>
                        <span>Rep: {deal.rep}</span>
                      </div>
                    </td>

                    {/* Value */}
                    <td className="py-4 px-3 font-mono font-bold text-neutral-900">
                      ${deal.value.toLocaleString()}
                    </td>

                    {/* Health Score Pill */}
                    <td className="py-4 px-3 text-center font-mono">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        deal.healthScore >= 75
                          ? 'bg-emerald-100 text-emerald-800'
                          : deal.healthScore >= 45
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {deal.healthScore}
                      </span>
                    </td>

                    {/* Idle Time */}
                    <td className="py-4 px-3 font-mono">
                      <span className={`flex items-center gap-1 text-xs ${
                        isStalled ? 'text-rose-600 font-bold' : 'text-neutral-500'
                      }`}>
                        {isStalled && <Clock className="w-3 h-3 text-rose-500" />}
                        <span>{deal.idleHours}h idle</span>
                      </span>
                    </td>

                    {/* Risk & Policy Flag */}
                    <td className="py-4 px-3 max-w-xs">
                      <div className="text-[11px] text-neutral-800 font-medium truncate">
                        {deal.riskFlag}
                      </div>
                      {deal.isSplitFulfillment && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-neutral-500 font-mono mt-0.5">
                          <Truck className="w-3 h-3" /> Multi-Warehouse Split
                        </span>
                      )}
                    </td>

                    {/* Status / Approver */}
                    <td className="py-4 px-3">
                      <div className="text-xs font-semibold text-neutral-900">{deal.status}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{deal.approver}</span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isStalled && (
                          <button
                            onClick={() => handleNudge(deal.id, deal.approver)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-md transition-all cursor-pointer flex items-center gap-1"
                            title="Dispatches an automated high-priority Slack/Email nudge"
                          >
                            <Bell className="w-3 h-3" />
                            <span>Nudge</span>
                          </button>
                        )}

                        {deal.riskFlag.includes('18%') && (
                          <button
                            onClick={() => handleAutoHeal(deal.id)}
                            className="px-2.5 py-1 text-[11px] font-bold bg-neutral-900 hover:bg-black text-white rounded-md transition-all cursor-pointer flex items-center gap-1"
                            title="Auto-apply the 13% discount ceiling fix"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Auto-Fix</span>
                          </button>
                        )}

                        {deal.id === 'Q-1042' && onOpenDeal && (
                          <button
                            onClick={() => onOpenDeal(deal.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-md transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUDIT LOG / ACTIVITY STREAM */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-900" />
            <h3 className="text-sm font-bold text-neutral-950">Governance Activity & Intervention Stream</h3>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">Live Audit Trail</span>
        </div>

        <div className="divide-y divide-neutral-100">
          {auditLogs.map(log => (
            <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-neutral-700">{log.action}</span>
              <span className="text-[10px] text-neutral-400 font-mono shrink-0 ml-4">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
