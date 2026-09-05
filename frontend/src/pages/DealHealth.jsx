import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function DealHealth() {
  const { navigate, addToast } = useApp();
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [stressTesting, setStressTesting] = useState(false);

  const runStressTest = () => {
    setStressTesting(true);
    addToast('Stress Test Initiated', 'Simulating +15% fuel price surge & 30% port dwell spike...', 'info');
    setTimeout(() => {
      setStressTesting(false);
      addToast('Stress Test Complete', 'Vulnerability index: 2 deals at risk of falling below 12% margin floor.', 'warning');
    }, 1500);
  };

  const deals = [
    { id: 'AP-7731', name: 'Apex Logistics', val: '$94k', margin: '28%', cx: 120, cy: 55, r: 7, color: '#006196' },
    { id: 'CX-1044', name: 'Norvax Global', val: '$180k', margin: '31%', cx: 180, cy: 40, r: 9, color: '#006196' },
    { id: 'Q-9012', name: 'Pacific Rim FMCG', val: '$410k', margin: '24%', cx: 280, cy: 70, r: 14, color: '#006196' },
    { id: 'DL-5521', name: 'Orion Transatlantic', val: '$920k', margin: '26%', cx: 490, cy: 60, r: 18, color: '#006196' },
    { id: 'DL-8900', name: 'Zenith Automotive', val: '$1.4M', margin: '29%', cx: 610, cy: 48, r: 22, color: '#006196' },
    { id: 'Q-9904', name: 'Swift Freight', val: '$220k', margin: '18.2%', cx: 210, cy: 130, r: 8, color: '#116398' },
    { id: 'Q-7822', name: 'OmniCold Storage', val: '$640k', margin: '16.5%', cx: 370, cy: 145, r: 13, color: '#dc3207' },
    { id: 'Q-1025', name: 'Horizon Supply Corp', val: '$320k', margin: '14.2%', cx: 270, cy: 170, r: 11, color: '#dc3207' },
    { id: 'AP-8821', name: 'Falcon Aerospace', val: '$580k', margin: '11.8%', cx: 440, cy: 190, r: 16, color: '#dc3207' }
  ];

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Sub-header Breadcrumb & Actions Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-spacing-xs text-on-surface-variant font-label-small text-label-small uppercase tracking-wider mb-1">
            <span>Operations</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Analytics &amp; Governance</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-primary font-bold">Deal Health &amp; Risk</span>
          </div>
          <div className="flex items-center gap-spacing-sm">
            <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight font-black">
              Deal Health &amp; Risk Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-small text-label-small font-semibold">
              Live Telemetry
            </span>
          </div>
          <p className="font-body-medium text-body-medium text-on-surface-variant mt-1">
            Real-time telemetry on quote margin integrity, SLA breach risks, carrier capacity bottlenecks, and credit limits.
          </p>
        </div>

        <div className="flex items-center gap-spacing-sm shrink-0 flex-wrap">
          <button
            onClick={() => addToast('Audit Exported', 'Health audit report saved as PDF.', 'info')}
            className="px-spacing-md py-2.5 rounded-lg bg-surface hover:bg-surface-variant text-on-primary-container font-label-large text-label-large shadow-sm border border-outline transition-colors flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">sim_card_download</span>
            <span>Export Health Audit</span>
          </button>
          <button
            onClick={runStressTest}
            disabled={stressTesting}
            className="px-spacing-md py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-primary-container font-label-large text-label-large shadow-sm transition-colors flex items-center gap-1.5"
            type="button"
          >
            <span className={`material-symbols-outlined text-[18px] ${stressTesting ? 'animate-spin' : ''}`}>
              psychology
            </span>
            <span>{stressTesting ? 'Simulating Stress...' : 'Algorithmic Stress Test'}</span>
          </button>
          <button
            onClick={() => addToast('Threshold Rule Added', 'Hard floor breach threshold updated to 18.0%.', 'success')}
            className="px-spacing-md py-2.5 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-large text-label-large shadow-md transition-all flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>+ Set Risk Rule</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-spacing-md">
        {/* Metric 1 */}
        <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-small text-label-small text-on-surface-variant uppercase tracking-wider font-semibold">
                Aggregate Health Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-title-large text-title-large text-on-secondary-container font-black">94.2</span>
                <span className="font-body-small text-body-small text-on-surface-variant font-medium">/ 100</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-lg">
              94%
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-outline/50">
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-small text-label-small font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              Robust Stance
            </span>
            <span className="text-xs text-on-surface-variant">+1.4 pts MoM</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-small text-label-small text-on-surface-variant uppercase tracking-wider font-semibold">
                Margin Floor Breaches
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-title-large text-title-large text-tertiary font-black">3</span>
                <span className="font-body-small text-body-small text-tertiary font-medium">Active Deals</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-error-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-outline/50">
            <span className="text-xs text-on-surface-variant font-medium">$1.4M Exposure</span>
            <span className="text-xs font-bold text-tertiary">Requires VP Concession</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-small text-label-small text-on-surface-variant uppercase tracking-wider font-semibold">
                SLA Expiration Risk
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-title-large text-title-large text-on-secondary-container font-black">4</span>
                <span className="font-body-small text-body-small text-on-surface-variant font-medium">&lt; 1 hour</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-variant text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-outline/50">
            <span className="text-xs text-on-surface-variant font-medium">Oceanic &amp; Falcon air quotes</span>
            <button
              onClick={() => navigate('approvals')}
              className="text-xs font-bold text-primary hover:underline"
            >
              Open Queue
            </button>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-small text-label-small text-on-surface-variant uppercase tracking-wider font-semibold">
                Carrier Cost Volatility
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-title-large text-title-large text-on-secondary-container font-black">+4.2%</span>
                <span className="font-body-small text-body-small text-on-surface-variant font-medium">Bunker Surcharge</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-outline/50">
            <span className="text-xs text-on-surface-variant font-medium">Pass-through rule enabled</span>
            <span className="text-xs font-bold text-emerald-700">Protected</span>
          </div>
        </div>
      </div>

      {/* Interactive Scatter Plot / Risk Matrix */}
      <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline gap-2">
          <div>
            <h2 className="font-title-small text-title-small text-on-secondary-container">
              Deal Matrix: Gross Margin % vs Contract Size
            </h2>
            <p className="text-xs text-on-surface-variant">
              Click any bubble to view deal telemetry. Red line indicates the non-negotiable 18.0% margin floor.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#006196]"></span> Compliant (&gt; 20%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#116398]"></span> Warning (18-20%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#dc3207]"></span> Breached (&lt; 18%)
            </span>
          </div>
        </div>

        {/* SVG Scatter Chart */}
        <div className="py-6 overflow-x-auto">
          <div className="min-w-[680px] relative">
            <svg viewBox="0 0 700 240" className="w-full h-64 select-none">
              {/* Grid Lines */}
              <line x1="60" y1="20" x2="680" y2="20" stroke="#E7EEF3" strokeDasharray="3 3" />
              <line x1="60" y1="80" x2="680" y2="80" stroke="#E7EEF3" strokeDasharray="3 3" />
              <line x1="60" y1="140" x2="680" y2="140" stroke="#E7EEF3" strokeDasharray="3 3" />
              <line x1="60" y1="200" x2="680" y2="200" stroke="#E7EEF3" strokeDasharray="3 3" />

              {/* 18.0% Hard Margin Floor line */}
              <line x1="60" y1="130" x2="680" y2="130" stroke="#dc3207" strokeWidth="2" strokeDasharray="5 5" />
              <text x="685" y="134" fill="#dc3207" fontSize="10" fontWeight="bold">
                18% Floor
              </text>

              {/* Y Axis Labels */}
              <text x="45" y="25" fill="#849495" fontSize="10" textAnchor="end">35%</text>
              <text x="45" y="85" fill="#849495" fontSize="10" textAnchor="end">25%</text>
              <text x="45" y="145" fill="#849495" fontSize="10" textAnchor="end">15%</text>
              <text x="45" y="205" fill="#849495" fontSize="10" textAnchor="end">5%</text>

              {/* X Axis Labels */}
              <text x="120" y="225" fill="#849495" fontSize="10" textAnchor="middle">$100k</text>
              <text x="280" y="225" fill="#849495" fontSize="10" textAnchor="middle">$500k</text>
              <text x="490" y="225" fill="#849495" fontSize="10" textAnchor="middle">$1.0M</text>
              <text x="610" y="225" fill="#849495" fontSize="10" textAnchor="middle">$1.5M+</text>

              {/* Bubbles */}
              {deals.map((d) => (
                <circle
                  key={d.id}
                  cx={d.cx}
                  cy={d.cy}
                  r={d.r}
                  fill={d.color}
                  fillOpacity="0.85"
                  className="cursor-pointer transition-all hover:scale-125 duration-150 hover:stroke-2 hover:stroke-white"
                  onClick={() => setSelectedDeal(d)}
                >
                  <title>{`${d.id} - ${d.name} (${d.val}, ${d.margin} Margin)`}</title>
                </circle>
              ))}
            </svg>
          </div>
        </div>

        {/* Selected Deal Banner */}
        {selectedDeal ? (
          <div className="p-4 rounded-xl bg-surface-variant border border-outline flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                style={{ backgroundColor: selectedDeal.color }}
              >
                {selectedDeal.id.slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">
                  {selectedDeal.id}: {selectedDeal.name}
                </div>
                <div className="text-xs text-on-surface-variant">
                  Contract Value: <strong>{selectedDeal.val}</strong> · Realized Margin:{' '}
                  <strong>{selectedDeal.margin}</strong>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('approval-detail', { approvalId: selectedDeal.id })}
                className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold"
              >
                Inspect Concession
              </button>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-1 rounded text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-surface-variant/40 text-xs text-on-surface-variant text-center">
            Click any bubble above to inspect individual deal margin telemetry and exception logs.
          </div>
        )}
      </div>

      {/* Real-time Risk Alerts Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-md">
        <div className="p-4 rounded-xl bg-surface border border-outline shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">error</span>
              Critical Margin Erosion
            </span>
            <span className="text-[10px] text-on-surface-variant">4m ago</span>
          </div>
          <div className="font-bold text-sm text-on-surface">Q-1025 Horizon Supply Corp</div>
          <p className="text-xs text-on-surface-variant">
            Margin calculated at 14.2%, breaching the 18.0% standard floor. Route: Hamburg to Chicago.
          </p>
          <button
            onClick={() => navigate('approval-detail', { quoteId: 'Q-1025' })}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Review Concession →
          </button>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-outline shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">alarm</span>
              SLA Approaching Limit
            </span>
            <span className="text-[10px] text-on-surface-variant">12m ago</span>
          </div>
          <div className="font-bold text-sm text-on-surface">AP-8821 Falcon Aerospace</div>
          <p className="text-xs text-on-surface-variant">
            48 minutes remaining on IATA Jet-A air fuel tariff lock. Requires executive attestation.
          </p>
          <button
            onClick={() => navigate('approval-detail', { approvalId: 'AP-8821' })}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Sign Approval →
          </button>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-outline shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">sensors</span>
              Carrier Telematics Spike
            </span>
            <span className="text-[10px] text-on-surface-variant">25m ago</span>
          </div>
          <div className="font-bold text-sm text-on-surface">TX-4402 Gulf Freight Intermodal</div>
          <p className="text-xs text-on-surface-variant">
            Dwell surcharge at Houston terminal unabsorbed by shipper contract. Automated invoice adjustment queued.
          </p>
          <button
            onClick={() => navigate('invoices')}
            className="text-xs font-semibold text-secondary hover:underline"
          >
            Inspect Invoicing →
          </button>
        </div>
      </div>
    </div>
  );
}
