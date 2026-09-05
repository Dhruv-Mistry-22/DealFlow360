import React from 'react';
import { useApp } from '../context/AppContext';

export default function ProductDetails() {
  const { navigate, setIsNewQuoteOpen, addToast } = useApp();

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-spacing-2xs font-body-small text-body-small">
        <button onClick={() => navigate('overview')} className="text-on-surface-variant hover:text-secondary">
          Catalog
        </button>
        <span className="text-outline-variant">/</span>
        <button onClick={() => navigate('products')} className="text-on-surface-variant hover:text-secondary">
          Products
        </button>
        <span className="text-outline-variant">/</span>
        <span className="text-secondary font-semibold">SKU-OCN-40HC</span>
      </nav>

      {/* Header Area */}
      <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">inventory_2</span>
              ISO 6346 SOC/COC Certified
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-secondary text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">thermostat</span>
              Cold-Chain Active
            </span>
          </div>

          <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight font-black">
            40ft High-Cube Cold-Chain Reefer
          </h1>

          <div className="flex items-center gap-spacing-sm text-on-surface-variant text-xs mt-1">
            <span className="font-mono font-bold text-primary">SKU-OCN-40HC</span>
            <span>•</span>
            <span>Ocean Carrier Global Intermodal Freight Asset</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="material-symbols-outlined text-[16px]">sensors</span>
              Continuous IoT Telematics
            </span>
          </div>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-spacing-sm shrink-0">
          <button
            onClick={() => addToast('Tariff Spec Exported', 'EDI-832 Price Book Spec downloaded.', 'info')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface text-on-secondary-container text-xs font-bold shadow-sm border border-outline hover:bg-surface-variant transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">receipt</span>
            <span>Export Tariff Spec (EDI 832)</span>
          </button>
          <button
            onClick={() => setIsNewQuoteOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary text-xs font-bold shadow-sm transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span>+ Generate Instant Quote for SKU</span>
          </button>
        </div>
      </div>

      {/* Vital Stats Rail */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-spacing-md">
        <div className="p-spacing-md bg-surface rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Base Contract Tariff
          </span>
          <div className="text-2xl font-black text-on-surface font-mono mt-1">$3,850.00</div>
          <span className="text-xs text-on-surface-variant">Per 40HC Reefer / Lane</span>
        </div>

        <div className="p-spacing-md bg-surface rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Policy Margin Safeguard
          </span>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">22.0%</div>
          <span className="text-xs text-emerald-700 font-bold">Hard Floor: 18.0%</span>
        </div>

        <div className="p-spacing-md bg-surface rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Global Fleet Capacity
          </span>
          <div className="text-2xl font-black text-secondary font-mono mt-1">420 Units</div>
          <span className="text-xs text-secondary font-semibold">92% Operational</span>
        </div>

        <div className="p-spacing-md bg-surface rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Avg Turnaround Cycle
          </span>
          <div className="text-2xl font-black text-on-surface font-mono mt-1">14.2 Days</div>
          <span className="text-xs text-on-surface-variant">Port-to-Port Corridor</span>
        </div>
      </div>

      {/* Engineering Specs & Tariff Formula */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-lg">
        <div className="lg:col-span-7 bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
          <h2 className="font-title-small text-title-small text-on-secondary-container mb-4 pb-3 border-b border-outline">
            Container Technical Engineering &amp; Machinery
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-outline">
              <span className="text-on-surface-variant font-medium">Reefer Machinery Unit:</span>
              <span className="font-bold text-on-surface">Carrier Transicold PrimeLINE / Daikin LXE</span>
            </div>
            <div className="flex justify-between py-2 border-b border-outline">
              <span className="text-on-surface-variant font-medium">Temperature Operating Range:</span>
              <span className="font-mono font-bold text-emerald-700">-30.0°C to +30.0°C (±0.25°C precision)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-outline">
              <span className="text-on-surface-variant font-medium">Maximum Gross Cargo Mass:</span>
              <span className="font-mono text-on-surface">32,500 kg (71,650 lbs)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-outline">
              <span className="text-on-surface-variant font-medium">Internal Cubic Volume:</span>
              <span className="font-mono text-on-surface">67.8 m³ (2,394 cu ft)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-on-surface-variant font-medium">Controlled Atmosphere (CA):</span>
              <span className="font-bold text-primary">Nitrogen Purge &amp; CO2 Scrubbing Enabled</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
          <h3 className="font-title-small text-title-small text-on-secondary-container mb-3 pb-2 border-b border-outline">
            Dynamic Tariff Pricing Formula
          </h3>
          <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
            All customer quotations utilizing SKU-OCN-40HC are automatically evaluated against this algorithmic tariff index before quotation generation.
          </p>
          <div className="p-4 rounded-xl bg-surface-variant/80 border border-outline font-mono text-xs space-y-2 text-on-surface">
            <div><strong>Rate</strong> = Base ($3,850)</div>
            <div>&nbsp;&nbsp;+ BAF Index (Dynamic)</div>
            <div>&nbsp;&nbsp;+ Genset Power Surcharge ($310)</div>
            <div>&nbsp;&nbsp;+ Terminal Handling ($410)</div>
            <div className="pt-2 border-t border-outline text-secondary font-bold">
              Min Margin Floor: ≥ 18.0%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
