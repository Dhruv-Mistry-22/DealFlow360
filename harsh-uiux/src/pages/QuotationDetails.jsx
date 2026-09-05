import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function QuotationDetails() {
  const { navigate, pageParams, addToast } = useApp();
  const quoteId = pageParams.quoteId || 'Q-1024';

  const [discountSlider, setDiscountSlider] = useState(4.5);

  const basePrice = 130000;
  const calculatedConcession = (basePrice * (discountSlider / 100));
  const finalPrice = basePrice - calculatedConcession;
  const directCost = 96612;
  const marginDollar = finalPrice - directCost;
  const marginPercent = ((marginDollar / finalPrice) * 100).toFixed(1);

  const handleConvertToOrder = () => {
    addToast('Conversion Initiated', `Quotation ${quoteId} converted to Fulfillment Order SH-9402.`, 'success');
    navigate('fulfillment-detail', { orderId: 'SH-9402' });
  };

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Top Breadcrumb & Status Navigation Meta */}
      <div className="flex flex-col gap-spacing-xs">
        <nav className="flex items-center gap-spacing-2xs font-body-small text-body-small">
          <button onClick={() => navigate('overview')} className="text-on-surface-variant hover:text-secondary transition-colors">
            Dashboard
          </button>
          <span className="text-outline-variant">/</span>
          <button onClick={() => navigate('quotations')} className="text-on-surface-variant hover:text-secondary transition-colors">
            Quotations
          </button>
          <span className="text-outline-variant">/</span>
          <span className="text-secondary font-label-medium text-label-medium">{quoteId}</span>
        </nav>

        {/* Header Actions Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md mt-2">
          <div className="flex flex-col gap-spacing-2xs">
            <div className="flex flex-wrap items-center gap-spacing-sm">
              <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight">
                Quotation {quoteId}
              </h1>
              <span className="inline-flex items-center px-spacing-sm py-spacing-2xs rounded-full bg-primary-container text-secondary font-label-small text-label-small font-semibold tracking-wide uppercase">
                Approved
              </span>
              <span className="inline-flex items-center gap-1.5 px-spacing-sm py-spacing-2xs rounded-md bg-surface-variant text-on-surface-variant font-label-small text-label-small border border-outline">
                <span className="material-symbols-outlined text-[14px]">history</span>
                Version 2.1 (Current)
              </span>
            </div>
            <p className="font-body-medium text-body-medium text-on-surface-variant">
              Created on <span className="text-on-secondary-container font-medium">Oct 28, 2024</span> · Prepared by{' '}
              <span className="text-on-secondary-container font-medium">Eleanor Vance</span> · Account:{' '}
              <span
                onClick={() => navigate('customer-portal')}
                className="text-secondary font-medium hover:underline cursor-pointer"
              >
                Acme Global Logistics Inc.
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-spacing-xs sm:gap-spacing-sm">
            <button
              onClick={() => addToast('Download Triggered', 'Downloading Quotation PDF & EDI-840 spec.', 'info')}
              className="inline-flex items-center gap-spacing-xs px-spacing-md py-2.5 rounded-lg bg-surface hover:bg-surface-variant text-secondary font-label-large text-label-large shadow-sm border border-outline transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download PDF / EDI</span>
            </button>
            <button
              onClick={() => navigate('approval-detail', { quoteId })}
              className="inline-flex items-center gap-spacing-xs px-spacing-md py-2.5 rounded-lg bg-primary-container hover:bg-surface-container text-secondary font-label-large text-label-large transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Governance Trail</span>
            </button>
            <button
              onClick={handleConvertToOrder}
              className="inline-flex items-center gap-spacing-xs px-spacing-lg py-2.5 rounded-lg bg-tertiary hover:opacity-95 text-on-tertiary font-label-large text-label-large shadow-md transition-all active:scale-95 group"
            >
              <span>Convert to Fulfillment Order</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 5-Stage Deal Lifecycle Stepper */}
      <section className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
        <div className="flex items-center justify-between mb-spacing-md">
          <div className="flex items-center gap-spacing-xs">
            <span className="material-symbols-outlined text-secondary text-[20px]">linear_scale</span>
            <h2 className="font-title-small text-title-small text-on-secondary-container">
              Deal Pipeline &amp; Fulfillment Trajectory
            </h2>
          </div>
          <span className="font-label-small text-label-small text-on-surface-variant uppercase tracking-wider">
            Current Stage: 3 of 5
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-spacing-md">
          {/* Stage 1 */}
          <div className="flex flex-col gap-spacing-xs p-spacing-sm rounded-lg bg-surface-variant/80 border border-outline/50">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span className="text-[11px] text-on-surface-variant">Oct 28</span>
            </div>
            <span className="font-label-medium text-label-medium text-on-surface">1. Draft & Tariff</span>
            <span className="text-xs text-on-surface-variant">Baseline quotes locked</span>
          </div>

          {/* Stage 2 */}
          <div className="flex flex-col gap-spacing-xs p-spacing-sm rounded-lg bg-surface-variant/80 border border-outline/50">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span className="text-[11px] text-on-surface-variant">Oct 28</span>
            </div>
            <span className="font-label-medium text-label-medium text-on-surface">2. Margin Guard</span>
            <span className="text-xs text-on-surface-variant">22.4% &gt; 18% Floor</span>
          </div>

          {/* Stage 3 (Active) */}
          <div className="flex flex-col gap-spacing-xs p-spacing-sm rounded-lg bg-primary-container border-2 border-secondary">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold animate-pulse">
                3
              </span>
              <span className="text-[11px] font-bold text-secondary">Active</span>
            </div>
            <span className="font-label-medium text-label-medium text-secondary font-bold">
              3. Commercial Approval
            </span>
            <span className="text-xs text-on-secondary-container">Signed by Marcus Vance</span>
          </div>

          {/* Stage 4 */}
          <div className="flex flex-col gap-spacing-xs p-spacing-sm rounded-lg bg-surface-variant/40 border border-outline/40 opacity-70">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span className="text-[11px] text-on-surface-variant">Pending</span>
            </div>
            <span className="font-label-medium text-label-medium text-on-surface">4. EDI Contract Lock</span>
            <span className="text-xs text-on-surface-variant">Awaiting Shipper EDI 850</span>
          </div>

          {/* Stage 5 */}
          <div className="flex flex-col gap-spacing-xs p-spacing-sm rounded-lg bg-surface-variant/40 border border-outline/40 opacity-70">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs font-bold">
                5
              </span>
              <span className="text-[11px] text-on-surface-variant">Pending</span>
            </div>
            <span className="font-label-medium text-label-medium text-on-surface">5. Order Dispatch</span>
            <span className="text-xs text-on-surface-variant">Ready for SH-9402 execution</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-lg">
        {/* Left Column (8 cols): Cargo Breakdown & Itemized Pricing */}
        <div className="lg:col-span-8 flex flex-col gap-spacing-lg">
          {/* Lane Specs */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">route</span>
                <h3 className="font-title-small text-title-small text-on-secondary-container">
                  Multi-Modal Corridor &amp; Cargo Specifications
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-variant text-secondary text-xs font-mono font-bold">
                Ocean FCL + Intermodal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-surface-variant/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Origin Port:</span>
                  <span className="font-semibold text-on-surface">Rotterdam (NLRTM) Terminal 4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Destination Port:</span>
                  <span className="font-semibold text-on-surface">New York (USNYC) Gateway</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Inland Rail Hub:</span>
                  <span className="font-semibold text-on-surface">BNSF Chicago Intermodal Ramp</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-variant/60 space-y-2">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Container Equipment:</span>
                  <span className="font-semibold text-on-surface">24 × 40ft High-Cube Reefer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Gross Weight:</span>
                  <span className="font-semibold text-on-surface">432,000 kg (18,000 kg / TEU)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Temperature Setting:</span>
                  <span className="font-semibold text-emerald-700 font-mono">-18°C Controlled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Pricing Matrix */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline">
              <div>
                <h3 className="font-title-small text-title-small text-on-secondary-container">
                  Itemized Tariff Breakdown
                </h3>
                <p className="text-xs text-on-surface-variant">Standard contract rate schedule with dynamic index pass-throughs</p>
              </div>
              <span className="text-xs text-on-surface-variant">Currency: USD ($)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    <th className="py-2.5 px-3">Tariff Code</th>
                    <th className="py-2.5 px-3">Line Description</th>
                    <th className="py-2.5 px-3 text-center">Unit / Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Cost Basis</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  <tr>
                    <td className="py-3 px-3 font-mono text-primary font-bold">TRF-OCN-01</td>
                    <td className="py-3 px-3 font-medium">Base Ocean Freight (Rotterdam → NY)</td>
                    <td className="py-3 px-3 text-center font-mono">24 Units</td>
                    <td className="py-3 px-3 text-right font-mono">$3,850.00</td>
                    <td className="py-3 px-3 text-right font-mono text-on-surface-variant">$2,980.00</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">$92,400.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono text-primary font-bold">TRF-BAF-22</td>
                    <td className="py-3 px-3 font-medium">Bunker Adjustment Factor (BAF Indexed)</td>
                    <td className="py-3 px-3 text-center font-mono">24 Units</td>
                    <td className="py-3 px-3 text-right font-mono">$620.00</td>
                    <td className="py-3 px-3 text-right font-mono text-on-surface-variant">$510.00</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">$14,880.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono text-primary font-bold">TRF-THC-09</td>
                    <td className="py-3 px-3 font-medium">Terminal Handling Charges (Origin &amp; Port)</td>
                    <td className="py-3 px-3 text-center font-mono">24 Units</td>
                    <td className="py-3 px-3 text-right font-mono">$410.00</td>
                    <td className="py-3 px-3 text-right font-mono text-on-surface-variant">$340.00</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">$9,840.00</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono text-primary font-bold">TRF-REEF-12</td>
                    <td className="py-3 px-3 font-medium">Cold-Chain Reefer Genset &amp; Monitoring</td>
                    <td className="py-3 px-3 text-center font-mono">24 Units</td>
                    <td className="py-3 px-3 text-right font-mono">$310.00</td>
                    <td className="py-3 px-3 text-right font-mono text-on-surface-variant">$215.00</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">$7,440.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-surface-variant/70 font-bold border-t-2 border-outline">
                    <td colSpan="4" className="py-3 px-3 text-right uppercase tracking-wider text-on-surface-variant">
                      Total Contract Commitment:
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-on-surface-variant">
                      ${directCost.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-base text-secondary">
                      ${finalPrice.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Profitability Simulator & Audit */}
        <div className="lg:col-span-4 flex flex-col gap-spacing-lg">
          {/* Interactive Profitability & Safeguard Gauge */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <span className="font-bold text-on-surface text-sm">Profitability Guard</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                Compliant
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-on-surface-variant">Net Quoted Value:</span>
                <span className="text-xl font-black font-mono text-on-secondary-container">
                  ${finalPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-on-surface-variant">Direct Carrier Cost:</span>
                <span className="font-mono font-medium text-on-surface">${directCost.toLocaleString()}</span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-on-surface-variant">Gross Profit:</span>
                <span className="font-mono font-bold text-emerald-600">+${marginDollar.toLocaleString()}</span>
              </div>

              {/* Margin meter */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Gross Margin:</span>
                  <span className="text-secondary">{marginPercent}%</span>
                </div>
                <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Number(marginPercent) * 3)}%` }}
                  ></div>
                  {/* Hard Floor Mark at 18% */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-red-500"
                    style={{ left: '54%' }}
                    title="18.0% Hard Floor"
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant mt-1">
                  <span>0%</span>
                  <span className="text-red-500 font-bold">18% Floor</span>
                  <span>35% Max</span>
                </div>
              </div>

              {/* Interactive Concession Slider */}
              <div className="p-3 bg-surface-variant/50 rounded-lg border border-outline mt-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-on-surface-variant">Commercial Concession:</span>
                  <span className="font-mono text-primary">{discountSlider}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={discountSlider}
                  onChange={(e) => setDiscountSlider(parseFloat(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <span className="text-[10px] text-on-surface-variant block mt-1">
                  Concession discount: -${calculatedConcession.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleConvertToOrder}
              className="w-full py-2.5 bg-tertiary hover:opacity-90 text-on-tertiary font-bold text-xs rounded-lg shadow-sm transition-all"
            >
              Convert to Fulfillment Order →
            </button>
          </div>

          {/* Customer Master Profile */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <span className="font-bold text-on-surface text-sm">Customer Master Profile</span>
              <button
                onClick={() => navigate('customer-portal')}
                className="text-xs text-primary hover:underline font-semibold"
              >
                View 360°
              </button>
            </div>
            <div className="pt-3 space-y-2 text-xs">
              <div className="font-bold text-on-surface text-sm">Acme Global Logistics Inc.</div>
              <div className="text-on-surface-variant">Account: ACC-88910 · Shippers Guild Member</div>
              <div className="p-2.5 bg-surface-variant rounded-lg space-y-1.5 mt-2">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Credit Facility:</span>
                  <span className="font-mono font-bold">$2,500,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Utilized:</span>
                  <span className="font-mono">$480,000 (19.2%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Payment Score:</span>
                  <span className="font-bold text-emerald-700">AAA Prime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
