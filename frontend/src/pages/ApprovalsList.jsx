import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ApprovalsList() {
  const { approvals, navigate, handleApproveDeal, handleRejectDeal, addToast } = useApp();
  const [filter, setFilter] = useState('all');
  const [showWarning, setShowWarning] = useState(true);

  const filtered = approvals.filter((a) => {
    if (filter === 'urgent') return a.slaMinutes <= 60;
    if (filter === 'approved') return a.status.includes('Approved');
    if (filter === 'rejected') return a.status === 'Rejected';
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Dynamic Notification Bar / SLA Warning Banner */}
      {showWarning && (
        <div className="p-spacing-sm bg-tertiary-container/10 border border-tertiary/20 rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-spacing-sm">
          <div className="flex items-center gap-spacing-sm">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div>
              <div className="flex items-center gap-spacing-xs">
                <span className="font-label-large text-label-large text-tertiary font-bold">
                  4 High-Severity SLA Expirations Imminent
                </span>
                <span className="inline-flex items-center px-spacing-xs py-[2px] rounded-full bg-tertiary text-on-tertiary font-label-small text-label-small uppercase tracking-wide animate-pulse">
                  Critical
                </span>
              </div>
              <p className="font-body-small text-body-small text-on-surface-variant">
                Global air freight rate locks for Falcon Aerospace and Oceanic Cargo expire in under 45 minutes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-spacing-xs self-end md:self-auto">
            <button
              onClick={() => {
                setFilter('urgent');
                addToast('Filter Applied', 'Viewing only high-priority SLA approvals.', 'info');
              }}
              className="px-spacing-sm py-[6px] bg-tertiary text-on-tertiary rounded-lg font-label-small text-label-small hover:bg-tertiary/90 transition-all flex items-center gap-spacing-2xs shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Fast-Track Queue</span>
            </button>
            <button
              onClick={() => setShowWarning(false)}
              className="p-spacing-2xs text-on-surface-variant hover:text-on-surface rounded transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Page Header & Global Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-spacing-lg bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div>
          <div className="flex items-center gap-spacing-xs mb-spacing-2xs">
            <span className="font-label-small text-label-small text-secondary uppercase tracking-widest font-bold">
              CPQ · Risk Audit Framework
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-small text-label-small text-on-surface-variant font-medium">
              Policy Ver. 4.19
            </span>
          </div>
          <h1 className="font-title-large text-title-large text-on-background tracking-tight font-extrabold">
            Approvals &amp; Deal Governance
          </h1>
          <p className="font-body-large text-body-large text-on-surface-variant max-w-3xl mt-spacing-2xs">
            Review, simulate, and authorize enterprise quotations, margin exceptions, and credit line overrides across multi-modal logistic agreements.
          </p>
        </div>

        {/* Quick Status Toggles / Metric Badges */}
        <div className="flex flex-wrap items-center gap-spacing-xs">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs rounded-xl shadow-sm transition-all border ${
              filter === 'all'
                ? 'bg-primary-container text-primary border-secondary-container font-bold'
                : 'bg-surface text-on-surface border-outline'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="font-label-medium text-label-medium">Pending Review</span>
            <span className="px-spacing-xs py-[2px] bg-surface text-primary rounded-full font-label-small text-label-small font-bold">
              {approvals.length}
            </span>
          </button>

          <button
            onClick={() => setFilter('urgent')}
            className={`flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs rounded-xl shadow-sm transition-all border ${
              filter === 'urgent'
                ? 'bg-tertiary-container text-tertiary border-tertiary font-bold'
                : 'bg-surface text-on-surface border-outline'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">alarm</span>
            <span className="font-label-medium text-label-medium">Urgent Breaches</span>
            <span className="px-spacing-xs py-[2px] bg-tertiary text-on-tertiary rounded-full font-label-small text-label-small font-bold">
              1
            </span>
          </button>

          <button
            onClick={() => setFilter('approved')}
            className={`flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs rounded-xl shadow-sm transition-all border ${
              filter === 'approved'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                : 'bg-surface text-on-surface border-outline'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            <span className="font-label-medium text-label-medium">Approved Today</span>
            <span className="px-spacing-xs py-[2px] bg-surface text-on-surface-variant rounded-full font-label-small text-label-small">
              38
            </span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid with visual analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-spacing-md">
        {/* KPI 1 */}
        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-tertiary"></div>
          <div className="flex items-center justify-between mb-spacing-xs">
            <span className="font-label-medium text-label-medium text-on-surface-variant uppercase tracking-wider">
              Margin Exception Exposure
            </span>
            <span className="p-spacing-2xs bg-tertiary/10 text-tertiary rounded-lg">
              <span className="material-symbols-outlined text-[20px]">trending_down</span>
            </span>
          </div>
          <div className="flex items-baseline gap-spacing-xs my-spacing-xs">
            <span className="font-title-large text-title-large text-on-surface font-black">$4.85M</span>
            <span className="font-label-small text-label-small text-tertiary font-bold flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +8.4%
            </span>
          </div>
          <div className="flex items-center justify-between font-body-small text-body-small text-on-surface-variant">
            <span>12 non-standard deals</span>
            <span className="text-xs font-mono text-tertiary font-bold">Requires VP Vance</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
          <div className="flex items-center justify-between mb-spacing-xs">
            <span className="font-label-medium text-label-medium text-on-surface-variant uppercase tracking-wider">
              Avg Approval Turnaround
            </span>
            <span className="p-spacing-2xs bg-primary-container text-primary rounded-lg">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </span>
          </div>
          <div className="flex items-baseline gap-spacing-xs my-spacing-xs">
            <span className="font-title-large text-title-large text-on-surface font-black">1h 42m</span>
            <span className="font-label-small text-label-small text-emerald-700 font-bold flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span> -22%
            </span>
          </div>
          <div className="flex items-center justify-between font-body-small text-body-small text-on-surface-variant">
            <span>SLA breach rate: 0.8%</span>
            <span className="text-xs font-mono text-emerald-700 font-bold">Fastest MTD</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary"></div>
          <div className="flex items-center justify-between mb-spacing-xs">
            <span className="font-label-medium text-label-medium text-on-surface-variant uppercase tracking-wider">
              Auto-Approved Volume
            </span>
            <span className="p-spacing-2xs bg-surface-variant text-secondary rounded-lg">
              <span className="material-symbols-outlined text-[20px]">auto_mode</span>
            </span>
          </div>
          <div className="flex items-baseline gap-spacing-xs my-spacing-xs">
            <span className="font-title-large text-title-large text-on-surface font-black">$12.6M</span>
            <span className="font-label-small text-label-small text-secondary font-bold">78% Auto</span>
          </div>
          <div className="flex items-center justify-between font-body-small text-body-small text-on-surface-variant">
            <span>Algorithmic pass &gt; 20% margin</span>
            <span className="text-xs font-mono text-secondary font-bold">Safe Corridors</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="flex items-center justify-between mb-spacing-xs">
            <span className="font-label-medium text-label-medium text-on-surface-variant uppercase tracking-wider">
              Overdue Escalations
            </span>
            <span className="p-spacing-2xs bg-amber-100 text-amber-800 rounded-lg">
              <span className="material-symbols-outlined text-[20px]">notification_important</span>
            </span>
          </div>
          <div className="flex items-baseline gap-spacing-xs my-spacing-xs">
            <span className="font-title-large text-title-large text-on-surface font-black">2</span>
            <span className="font-label-small text-label-small text-amber-700 font-bold">Action Needed</span>
          </div>
          <div className="flex items-center justify-between font-body-small text-body-small text-on-surface-variant">
            <span>Escalated to VP Vance</span>
            <span className="text-xs font-mono text-amber-700 font-bold">&gt; 12h elapsed</span>
          </div>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden">
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between bg-surface">
          <div>
            <h2 className="font-title-small text-title-small text-on-secondary-container">
              Pending Authorization Queue
            </h2>
            <p className="text-xs text-on-surface-variant">
              Commercial proposals exceeding floor discount thresholds or requesting credit term concessions
            </p>
          </div>
          <button
            onClick={() => {
              approvals.forEach((a) => handleApproveDeal(a.id));
            }}
            className="px-4 py-2 bg-primary-container text-primary font-bold text-xs rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span>Approve All Qualified Deals</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-6">Approval ID &amp; Ref</th>
                <th className="py-3 px-4">Shipper / Account</th>
                <th className="py-3 px-4">Freight Lane &amp; Volume</th>
                <th className="py-3 px-4">Value ($ USD)</th>
                <th className="py-3 px-4">Margin vs Floor</th>
                <th className="py-3 px-4">SLA Countdown</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Decision Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filtered.map((deal) => (
                <tr
                  key={deal.id}
                  className="hover:bg-surface-variant/40 transition-colors cursor-pointer"
                  onClick={() => navigate('approval-detail', { approvalId: deal.id })}
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-secondary text-sm">{deal.id}</span>
                      <span className="px-1.5 py-0.5 rounded bg-surface-variant text-on-surface-variant font-mono">
                        {deal.quoteRef}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-on-surface">{deal.customer}</td>
                  <td className="py-4 px-4 text-on-surface-variant">{deal.route}</td>
                  <td className="py-4 px-4 font-mono font-bold text-on-secondary-container text-sm">
                    {deal.amount}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold ${
                          deal.variance.startsWith('-')
                            ? 'bg-error-container text-on-tertiary-container'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {deal.margin}
                      </span>
                      <span className="text-[11px] font-mono text-on-surface-variant">
                        (Floor: {deal.floor})
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-semibold ${
                        deal.slaMinutes <= 60 ? 'text-tertiary animate-pulse' : 'text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      <span>{deal.slaMinutes}m remaining</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        deal.status.includes('Approved')
                          ? 'bg-emerald-100 text-emerald-800'
                          : deal.status === 'Rejected'
                          ? 'bg-error-container text-on-tertiary-container'
                          : 'bg-primary-container text-secondary'
                      }`}
                    >
                      {deal.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRejectDeal(deal.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-variant hover:bg-error-container text-on-surface-variant hover:text-error text-xs font-semibold transition-colors"
                        title="Reject Concession"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveDeal(deal.id)}
                        className="px-3 py-1.5 rounded-lg bg-tertiary hover:opacity-90 text-on-tertiary text-xs font-semibold shadow-sm transition-all"
                      >
                        Approve Deal
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
