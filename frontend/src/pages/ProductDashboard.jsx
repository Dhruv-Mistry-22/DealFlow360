import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProductDashboard() {
  const { navigate, setIsNewQuoteOpen, addToast } = useApp();
  const [filterMode, setFilterMode] = useState('all');

  const products = [
    {
      sku: 'SKU-OCN-40HC',
      name: '40ft High-Cube Cold-Chain Reefer',
      category: 'Ocean Containerized Asset',
      specs: 'ISO 6346 SOC/COC · Cold-Chain Active (-25°C to +25°C)',
      baseRate: '$3,850.00 / Unit',
      marginFloor: '22.0%',
      utilization: '92% Booked',
      telematics: 'IoT Active'
    },
    {
      sku: 'SKU-AIR-EXP',
      name: 'Air Expedited Priority Palette Cargo',
      category: 'Air Freight Priority',
      specs: 'IATA Master AWB · 24h Global Transit Guarantee',
      baseRate: '$4.20 / kg',
      marginFloor: '24.5%',
      utilization: '86% Capacity',
      telematics: 'ULD Sensors'
    },
    {
      sku: 'SKU-RAIL-53',
      name: '53ft Domestic Intermodal Wellcar',
      category: 'Class 1 Rail Mainline',
      specs: 'AAR Certified · Double-Stack Intermodal Container',
      baseRate: '$1,820.00 / Container',
      marginFloor: '19.5%',
      utilization: '94% Allocated',
      telematics: 'RFID Milepost'
    },
    {
      sku: 'SKU-TRK-FTL',
      name: '53ft Dry Van Over-The-Road FTL',
      category: 'Dedicated Truckload',
      specs: 'Air-Ride Suspension · 45,000 lbs Max Payload',
      baseRate: '$2.45 / Mile',
      marginFloor: '18.0%',
      utilization: '88% Assigned',
      telematics: 'ELD Verified'
    }
  ];

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight font-black">
              Product Catalog &amp; Multi-Modal Freight Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-mono text-xs">
              Cass Index sync: 12m ago
            </span>
          </div>
          <p className="font-body-large text-body-large text-on-surface-variant mt-1">
            Standardized freight SKUs, equipment specifications, contracted baseline tariffs, and dynamic fuel index rules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-spacing-sm shrink-0">
          <button
            onClick={() => addToast('Price Books Synced', 'Successfully updated 1,420 carrier baseline tariffs.', 'success')}
            className="flex items-center gap-spacing-xs px-4 py-2.5 rounded-lg bg-surface hover:bg-surface-variant text-on-secondary-container font-label-large text-label-large shadow-sm border border-outline transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
            <span>Sync Price Books</span>
          </button>
          <button
            onClick={() => setIsNewQuoteOpen(true)}
            className="flex items-center gap-spacing-xs px-4 py-2.5 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary font-label-large text-label-large shadow-md transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">add_box</span>
            <span>+ Add SKU / Asset</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-spacing-md">
        <div className="bg-surface p-spacing-md rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Active Products / SKUs
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">86 Assets</div>
          <span className="text-xs text-secondary font-semibold mt-1">100% tariff formula verified</span>
        </div>

        <div className="bg-surface p-spacing-md rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Freight Modes Supported
          </span>
          <div className="text-2xl font-black text-secondary mt-1">5 Modal Types</div>
          <span className="text-xs text-on-surface-variant mt-1">Ocean, Air, Rail, Road, Drayage</span>
        </div>

        <div className="bg-surface p-spacing-md rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Contracted Baseline Tariffs
          </span>
          <div className="text-2xl font-black text-on-surface mt-1">1,420 Corridors</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">EDI-832 auto-synced</span>
        </div>

        <div className="bg-surface p-spacing-md rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
            Dynamic Fuel Index Rules
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">100% Auto</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1">Zero manual calculation error</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden">
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between bg-surface">
          <div>
            <h2 className="font-title-small text-title-small text-on-secondary-container">
              Multi-Modal Freight Asset Inventory
            </h2>
            <p className="text-xs text-on-surface-variant">Click any SKU to inspect tariff formula and technical equipment specs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-6">SKU Identifier</th>
                <th className="py-3 px-4">Freight Asset Name</th>
                <th className="py-3 px-4">Category &amp; Specs</th>
                <th className="py-3 px-4 text-right">Baseline Tariff</th>
                <th className="py-3 px-4">Margin Safeguard</th>
                <th className="py-3 px-4">Asset Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {products.map((p) => (
                <tr
                  key={p.sku}
                  className="hover:bg-surface-variant/40 transition-colors cursor-pointer"
                  onClick={() => navigate('product-detail', { sku: p.sku })}
                >
                  <td className="py-4 px-6 font-mono font-bold text-secondary text-sm">
                    {p.sku}
                  </td>
                  <td className="py-4 px-4 font-bold text-on-surface text-sm">{p.name}</td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-on-surface">{p.category}</div>
                    <div className="text-[11px] text-on-surface-variant">{p.specs}</div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-on-secondary-container text-sm">
                    {p.baseRate}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-700">
                    Floor: {p.marginFloor}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-primary-container text-primary font-semibold text-xs">
                      {p.telematics} · {p.utilization}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate('product-detail', { sku: p.sku })}
                        className="px-3 py-1.5 rounded-lg bg-surface-variant hover:bg-surface text-secondary text-xs font-semibold border border-outline transition-colors"
                      >
                        Inspect SKU
                      </button>
                      <button
                        onClick={() => setIsNewQuoteOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-tertiary hover:opacity-90 text-on-tertiary text-xs font-semibold shadow-sm"
                      >
                        Quote
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
