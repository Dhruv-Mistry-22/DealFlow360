import React from 'react';
import { useApp } from '../context/AppContext';

export default function AdminReport() {
  const { addToast } = useApp();

  const auditEvents = [
    {
      id: 'AUD-99120',
      time: 'Oct 28, 14:22:04 EST',
      user: 'Marcus Vance (VP Sales Ops)',
      action: 'Authorized Concession AP-8821',
      entity: 'Falcon Aerospace Supply (Q-1025)',
      rule: 'Delegated Authority Tier 3 ($500k)',
      verdict: 'Approved · SOX Compliant'
    },
    {
      id: 'AUD-99118',
      time: 'Oct 28, 12:45:11 EST',
      user: 'System Algorithmic CPQ Engine',
      action: 'Automated 3-Way Match Reconciled',
      entity: 'INV-2024-8891 (SH-9402)',
      rule: 'EDI-810 Clearing Gateway',
      verdict: 'Reconciled 100%'
    },
    {
      id: 'AUD-99104',
      time: 'Oct 28, 09:18:22 EST',
      user: 'Eleanor Vance (Senior Rep)',
      action: 'Converted Quotation to Fulfillment',
      entity: 'Quotation Q-1024 → Order SH-9402',
      rule: 'Commercial Workflow Policy 4.19',
      verdict: 'Executed · BNSF Dispatched'
    },
    {
      id: 'AUD-99092',
      time: 'Oct 27, 22:04:15 EST',
      user: 'Automated Cass Freight Index Sync',
      action: 'Updated 1,420 Baseline Lane Tariffs',
      entity: 'Product Catalog Price Book (EDI-832)',
      rule: 'IMO-2020 & DOE Weekly Fuel Rules',
      verdict: 'Synchronized Active'
    }
  ];

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="space-y-1">
          <div className="flex items-center gap-spacing-xs">
            <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight font-black">
              Admin Reporting &amp; Compliance Governance
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-small text-label-small uppercase tracking-widest font-bold">
              Confidential
            </span>
          </div>
          <p className="font-body-medium text-body-medium text-on-surface-variant max-w-4xl">
            Enterprise audit logging, executive throughput reports, SOX &amp; SOC-2 compliance verification, and delegated commercial authority rules.
          </p>
        </div>

        {/* Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-spacing-xs shrink-0">
          <button
            onClick={() => addToast('Security Matrix', 'Loaded commercial policy permission roles.', 'info')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface text-on-secondary-container font-label-large text-label-large hover:bg-surface-variant border border-outline shadow-sm transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">security</span>
            <span>Security Matrix</span>
          </button>
          <button
            onClick={() => addToast('Audit Log Exported', 'Full cryptographic SOX/SOC-2 audit ledger downloaded.', 'success')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-large text-label-large hover:bg-secondary shadow-sm transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export SOC-2 / SOX Audit Log</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-spacing-md">
        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Active Governance Rules
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">28 Rules</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">100% Active Enforcement</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Commercial Exceptions MTD
          </span>
          <div className="text-2xl font-black text-secondary mt-1">142 Cases</div>
          <span className="text-xs text-on-surface-variant mt-1">All dual-authorized by VP/CFO</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            SOX 404 Control Status
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">Passed (Zero Findings)</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">Internal controls verified</span>
        </div>

        <div className="bg-surface rounded-xl p-spacing-md shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Audit Trail Retention
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">7 Years WORM</div>
          <span className="text-xs text-on-surface-variant mt-1">Cryptographic tamper-evident storage</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden">
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between bg-surface">
          <div>
            <h2 className="font-title-small text-title-small text-on-secondary-container">
              Real-Time Immutable Audit Trail
            </h2>
            <p className="text-xs text-on-surface-variant">
              Every discount override, commercial signing, EDI dispatch, and rate book synchronization is cryptographically tracked.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-6">Event ID &amp; Time</th>
                <th className="py-3 px-4">Authorized User / System</th>
                <th className="py-3 px-4">Action Description</th>
                <th className="py-3 px-4">Entity Target</th>
                <th className="py-3 px-4">Policy Framework</th>
                <th className="py-3 px-6 text-right">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {auditEvents.map((e) => (
                <tr key={e.id} className="hover:bg-surface-variant/40 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="font-mono font-bold text-secondary text-sm">{e.id}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">{e.time}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-on-surface">{e.user}</td>
                  <td className="py-4 px-4 font-medium text-on-surface">{e.action}</td>
                  <td className="py-4 px-4 font-mono text-primary">{e.entity}</td>
                  <td className="py-4 px-4 text-on-surface-variant">{e.rule}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      {e.verdict}
                    </span>
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
