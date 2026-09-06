import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function DashboardOverview() {
  const { navigate, setIsNewQuoteOpen, addToast } = useApp();
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [rules, setRules] = useState([
    {
      id: 'R-01',
      tier: 'Tier 1 - Rep Discretion',
      discountRange: '0.0% - 5.0%',
      minMargin: '25.0%',
      approver: 'Automated Instant Sign-off',
      sla: 'Instant (< 1s)',
      status: 'Active',
      scope: 'All standard truckload & LCL contracts'
    },
    {
      id: 'R-02',
      tier: 'Tier 2 - Regional Sales Mgr',
      discountRange: '5.1% - 12.0%',
      minMargin: '20.0%',
      approver: 'Regional Director',
      sla: '4 Hours',
      status: 'Active',
      scope: 'Contracts $50k - $250k'
    },
    {
      id: 'R-03',
      tier: 'Tier 3 - Commercial Pricing Desk',
      discountRange: '12.1% - 18.0%',
      minMargin: '18.0%',
      approver: 'Director of Pricing',
      sla: '8 Hours',
      status: 'Active',
      scope: 'High-volume intermodal & ocean contracts'
    },
    {
      id: 'R-04',
      tier: 'Tier 4 - VP Executive Review',
      discountRange: '> 18.0% (Floor Breach)',
      minMargin: '< 18.0%',
      approver: 'Marcus Vance (VP Ops) & CFO',
      sla: '24 Hours',
      status: 'Strict Lock',
      scope: 'Hard Margin Exception Protocol'
    }
  ]);

  const handleSimulate = () => {
    setSimulationRunning(true);
    addToast('Simulation Started', 'Executing algorithmic stress test across 500 active lane quotes...', 'info');
    setTimeout(() => {
      setSimulationRunning(false);
      addToast('Simulation Complete', 'Matrix validation passed: 0 illegal margin floor breaches detected.', 'success');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-spacing-lg pb-spacing-2xl">
      {/* Top Breadcrumb & Executive Action Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="flex flex-col gap-spacing-xs">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-small text-label-small">
            <span>Governance</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Commercial Policy</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-semibold">Discount Tiers & Approval Setup</span>
          </div>
          <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight">
            Discount Matrix &amp; Commercial Approval Governance
          </h1>
          <p className="font-body-medium text-body-medium text-on-surface-variant max-w-3xl">
            Configure delegated approval authority, margin floor rules, volume tier pricing, and automated algorithmic sign-off thresholds across corporate multi-modal logistics networks.
          </p>
        </div>

      </div>

      {/* Governance KPI Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-spacing-md">
        {/* KPI 1 */}
        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 w-10 h-10 rounded-lg bg-error-container text-on-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-small text-label-small uppercase tracking-wider text-on-surface-variant">
              Standard Safeguard
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-title-large text-title-large text-on-secondary-container font-extrabold">18.0%</span>
              <span className="font-label-small text-label-small font-bold px-2 py-0.5 rounded-full bg-error-container text-on-tertiary-container">
                Hard Floor
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline/60">
            <span className="font-body-small text-body-small text-on-surface-variant">Zero bypass permitted by CPQ</span>
            <span className="material-symbols-outlined text-tertiary-container text-[16px]">lock</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-3 top-3 w-10 h-10 rounded-lg bg-primary-container text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-small text-label-small uppercase tracking-wider text-on-surface-variant">
              Delegated Authority
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-title-large text-title-large text-on-secondary-container font-extrabold">$500k</span>
              <span className="font-label-small text-label-small font-bold px-2 py-0.5 rounded-full bg-primary-container text-primary">
                VP Vance Limit
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline/60">
            <span className="font-body-small text-body-small text-on-surface-variant">Above $500k routes to Board</span>
            <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-3 top-3 w-10 h-10 rounded-lg bg-surface-variant text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">timer</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-small text-label-small uppercase tracking-wider text-on-surface-variant">
              Avg Turnaround Time
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-title-large text-title-large text-on-secondary-container font-extrabold">4.2h</span>
              <span className="font-label-small text-label-small font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Target: &lt; 8h
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline/60">
            <span className="font-body-small text-body-small text-on-surface-variant">-1.8h faster vs last quarter</span>
            <span className="material-symbols-outlined text-secondary text-[16px]">trending_down</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-3 top-3 w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-label-small text-label-small uppercase tracking-wider text-on-surface-variant">
              Policy Compliance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-title-large text-title-large text-on-secondary-container font-extrabold">99.4%</span>
              <span className="font-label-small text-label-small font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                SOX Verified
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline/60">
            <span className="font-body-small text-body-small text-on-surface-variant">100% audit logging enabled</span>
            <span className="material-symbols-outlined text-emerald-700 text-[16px]">lock_clock</span>
          </div>
        </div>
      </div>

      {/* Discount Tiers Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden">
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between bg-surface">
          <div>
            <h2 className="font-title-small text-title-small text-on-secondary-container">
              Delegated Authority Discount Tiers
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Defines authorization boundaries based on requested customer concessions and target gross margin thresholds.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('approvals')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View Pending Approval Queue (4)</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-6">Tier Classification</th>
                <th className="py-3 px-4">Discount Band</th>
                <th className="py-3 px-4">Gross Margin Floor</th>
                <th className="py-3 px-6">Delegated Authority</th>
                <th className="py-3 px-4">Target SLA</th>
                <th className="py-3 px-4">Scope &amp; Conditions</th>
                <th className="py-3 px-6 text-right">Rule Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline text-sm">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-surface-variant/40 transition-colors">
                  <td className="py-4 px-6 font-semibold text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span>{rule.tier}</span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-on-secondary-container">
                    {rule.discountRange}
                  </td>
                  <td className="py-4 px-4 font-mono font-medium">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        rule.minMargin.includes('<')
                          ? 'bg-error-container text-on-tertiary-container'
                          : 'bg-primary-container text-primary'
                      }`}
                    >
                      {rule.minMargin}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant font-medium">{rule.approver}</td>
                  <td className="py-4 px-4 text-on-surface-variant font-medium">{rule.sla}</td>
                  <td className="py-4 px-4 text-xs text-on-surface-variant">{rule.scope}</td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        rule.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-tertiary-container text-tertiary'
                      }`}
                    >
                      {rule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-modal Freight Lane Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-spacing-md">
        {/* Card 1 */}
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-outline">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[24px]">directions_boat</span>
              <span className="font-bold text-on-surface">Ocean FCL / LCL Corridors</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-mono">
              IMO-2020 Compliant
            </span>
          </div>
          <div className="py-4 space-y-2 text-xs text-on-surface-variant">
            <div className="flex justify-between py-1 border-b border-outline/50">
              <span>Bunker Adjustment Factor (BAF):</span>
              <span className="font-mono font-bold text-on-surface">Auto-indexed Weekly</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline/50">
              <span>Port Congestion Surcharge:</span>
              <span className="font-mono font-bold text-on-surface">Pass-through 100%</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Default Margin Safeguard:</span>
              <span className="font-mono font-bold text-primary">22.0%</span>
            </div>
          </div>
          <button
            onClick={() => navigate('quotations')}
            className="w-full py-2 bg-surface-variant hover:bg-surface text-secondary font-semibold text-xs rounded-lg transition-colors border border-outline"
          >
            Review Active Ocean Quotes
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-outline">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[24px]">flight_takeoff</span>
              <span className="font-bold text-on-surface">Air Expedited Freight</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-primary-container text-primary font-mono">
              IATA Jet-A Index
            </span>
          </div>
          <div className="py-4 space-y-2 text-xs text-on-surface-variant">
            <div className="flex justify-between py-1 border-b border-outline/50">
              <span>Peak Season Surcharge (PSS):</span>
              <span className="font-mono font-bold text-on-surface">Mandatory Floor +5%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline/50">
              <span>Security Screening Fee:</span>
              <span className="font-mono font-bold text-on-surface">$0.18 / kg fixed</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Default Margin Safeguard:</span>
              <span className="font-mono font-bold text-primary">24.5%</span>
            </div>
          </div>
          <button
            onClick={() => navigate('deal-health')}
            className="w-full py-2 bg-surface-variant hover:bg-surface text-secondary font-semibold text-xs rounded-lg transition-colors border border-outline"
          >
            Inspect Air Freight Risk
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-outline">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-[24px]">train</span>
              <span className="font-bold text-on-surface">Intermodal Rail Mainline</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-mono">
              BNSF / UP Class 1
            </span>
          </div>
          <div className="py-4 space-y-2 text-xs text-on-surface-variant">
            <div className="flex justify-between py-1 border-b border-outline/50">
              <span>Drayage Origin / Destination:</span>
              <span className="font-mono font-bold text-on-surface">Bundled Tariff</span>
            </div>
            <div className="flex justify-between py-1 border-b border-outline/50">
              <span>Fuel Surcharge Program:</span>
              <span className="font-mono font-bold text-on-surface">DOE National Index</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Default Margin Safeguard:</span>
              <span className="font-mono font-bold text-primary">19.5%</span>
            </div>
          </div>
          <button
            onClick={() => navigate('fulfillment')}
            className="w-full py-2 bg-surface-variant hover:bg-surface text-secondary font-semibold text-xs rounded-lg transition-colors border border-outline"
          >
            View Rail Dispatches
          </button>
        </div>
      </div>
    </div>
  );
}
