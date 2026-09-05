import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function FulfillmentDetails() {
  const { navigate, pageParams, addToast } = useApp();
  const orderId = pageParams.orderId || 'SH-9402';
  const [telemetryPing, setTelemetryPing] = useState(Date.now());

  const handleUpdateTelemetry = () => {
    setTelemetryPing(Date.now());
    addToast('Telemetry Refreshed', 'BNSF locomotive GPS & reefer temperature sync successful.', 'success');
  };

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Top Breadcrumbs */}
      <nav className="flex items-center gap-spacing-2xs font-body-small text-body-small">
        <button onClick={() => navigate('overview')} className="text-on-surface-variant hover:text-secondary">
          Operations
        </button>
        <span className="text-outline-variant">/</span>
        <button onClick={() => navigate('fulfillment')} className="text-on-surface-variant hover:text-secondary">
          Fulfillment
        </button>
        <span className="text-outline-variant">/</span>
        <span className="text-secondary font-semibold">{orderId}</span>
      </nav>

      {/* Header Card */}
      <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md">
          <div className="flex flex-col">
            <div className="flex items-center flex-wrap gap-spacing-sm mb-1">
              <h1 className="font-title-large text-title-large text-on-secondary-container font-black">
                Fulfillment Order: {orderId}
              </h1>
              <span className="font-title-small text-title-small text-secondary font-mono font-bold">
                $24,850.00
              </span>
              <span className="px-2.5 py-1 rounded-full bg-primary-container text-primary font-label-small text-label-small flex items-center gap-1.5 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                Rail Mainline Rolling
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-small text-label-small font-medium">
                ETA: Today 18:30 (On-Time)
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-small text-label-small flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">train</span>
                Carrier: BNSF Logistics
              </span>
            </div>
            <p className="font-body-medium text-body-medium text-on-surface-variant">
              Waybill &amp; Bill of Lading (BOL-BNSF-88190) · Multi-modal Rail Intermodal · Consignee:{' '}
              <span
                onClick={() => navigate('customer-portal')}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Acme Global Logistics
              </span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center flex-wrap gap-spacing-xs">
            <button
              onClick={() => addToast('BOL Downloaded', 'BOL-BNSF-88190 downloaded.', 'info')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-variant hover:bg-surface text-on-surface rounded-lg font-semibold text-xs border border-outline transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Master BOL / EDI-214</span>
            </button>
            <button
              onClick={() => addToast('Reroute Requested', 'Dispatch reroute signal queued to BNSF dispatch desk.', 'warning')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-variant hover:bg-surface text-on-surface rounded-lg font-semibold text-xs border border-outline transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              <span>Reroute Order</span>
            </button>
            <button
              onClick={handleUpdateTelemetry}
              className="flex items-center gap-1.5 px-4 py-2 bg-tertiary hover:opacity-95 text-on-tertiary rounded-lg font-semibold text-xs shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">sensors</span>
              <span>Update Waybill Telemetry</span>
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-spacing-lg pt-spacing-md border-t border-outline/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-spacing-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-variant/80">
              <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <div>
                <div className="text-xs font-bold text-on-surface">1. Quotation</div>
                <div className="text-[10px] text-on-surface-variant">Done · Q-1024</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-variant/80">
              <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <div>
                <div className="text-xs font-bold text-on-surface">2. Approval</div>
                <div className="text-[10px] text-on-surface-variant">Done · Signed</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-primary-container border border-secondary">
              <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold animate-pulse">
                3
              </span>
              <div>
                <div className="text-xs font-bold text-secondary">3. Rolling Dispatch</div>
                <div className="text-[10px] text-on-primary-container">Milepost 314 Active</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-variant/40 opacity-75">
              <span className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs font-bold">
                4
              </span>
              <div>
                <div className="text-xs font-bold text-on-surface">4. Chicago Ramp</div>
                <div className="text-[10px] text-on-surface-variant">ETA: Today 18:30</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-variant/40 opacity-75">
              <span className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs font-bold">
                5
              </span>
              <div>
                <div className="text-xs font-bold text-on-surface">5. Final Delivery</div>
                <div className="text-[10px] text-on-surface-variant">Consignee Dock</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry, Waypoints, and Consignment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-lg">
        {/* Left Column (8 cols): Waypoints & Live Journey */}
        <div className="lg:col-span-8 flex flex-col gap-spacing-lg">
          {/* Waypoint Milestones */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <div className="flex items-center justify-between pb-3 border-b border-outline mb-4">
              <h2 className="font-title-small text-title-small text-on-secondary-container">
                Route Waypoints &amp; Sensor Telemetry
              </h2>
              <span className="text-xs text-on-surface-variant font-mono">
                Updated: {new Date(telemetryPing).toLocaleTimeString()}
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline">
              {/* Waypoint 1 */}
              <div className="relative flex items-start gap-4">
                <span className="absolute -left-6 w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                  ✓
                </span>
                <div>
                  <div className="text-sm font-bold text-on-surface">
                    Port Newark Container Terminal (USNWK) - Vessel Discharge
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Oct 28, 04:15 EST · Discharged from vessel MV Atlantic Star · Customs Cleared
                  </div>
                </div>
              </div>

              {/* Waypoint 2 */}
              <div className="relative flex items-start gap-4">
                <span className="absolute -left-6 w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                  ✓
                </span>
                <div>
                  <div className="text-sm font-bold text-on-surface">
                    Bethlehem Intermodal Terminal - Rail Loading
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Oct 28, 11:30 EST · Transferred to double-stack wellcar BNSF-20891
                  </div>
                </div>
              </div>

              {/* Waypoint 3 (Current) */}
              <div className="relative flex items-start gap-4">
                <span className="absolute -left-6 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center animate-ping">
                  ●
                </span>
                <div className="p-3 bg-primary-container rounded-xl border border-secondary w-full">
                  <div className="text-sm font-bold text-secondary flex items-center gap-2">
                    <span>En Route Mainline: Pittsburgh Sub-division (Milepost 314.8)</span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-white text-[10px] font-bold">
                      Current Position
                    </span>
                  </div>
                  <div className="text-xs text-on-primary-container mt-1">
                    Speed: <strong>54 mph</strong> · Locomotive: <strong>BNSF 8412 Westbound</strong> · Next Crew Change: Fort Wayne
                  </div>
                </div>
              </div>

              {/* Waypoint 4 */}
              <div className="relative flex items-start gap-4">
                <span className="absolute -left-6 w-5 h-5 rounded-full bg-surface-variant border-2 border-outline text-transparent text-[10px] flex items-center justify-center">
                  ○
                </span>
                <div>
                  <div className="text-sm font-bold text-on-surface">
                    BNSF Corwith Intermodal Facility (Chicago, IL)
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Scheduled Ingate ETA: Today 18:30 EST · Reserved Hostler Slot: 42-B
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reefer IoT Diagnostics */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <h3 className="font-title-small text-title-small text-on-secondary-container mb-3 pb-2 border-b border-outline">
              Container IoT Telematics (Asset: 40HC-REF-9921)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-surface-variant">
                <div className="text-on-surface-variant">Internal Temperature:</div>
                <div className="text-xl font-bold font-mono text-emerald-700 mt-1">-18.2°C</div>
                <div className="text-[10px] text-emerald-700">Set-point -18°C (Optimal)</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-variant">
                <div className="text-on-surface-variant">Genset Fuel Level:</div>
                <div className="text-xl font-bold font-mono text-on-surface mt-1">84% Diesel</div>
                <div className="text-[10px] text-on-surface-variant">Autonomy: 78 hours</div>
              </div>
              <div className="p-3 rounded-lg bg-surface-variant">
                <div className="text-on-surface-variant">Vibration &amp; Shock:</div>
                <div className="text-xl font-bold font-mono text-on-surface mt-1">0.12 G</div>
                <div className="text-[10px] text-emerald-700">Smooth Track Verified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Billing & Related Quotation */}
        <div className="lg:col-span-4 flex flex-col gap-spacing-lg">
          {/* Related Invoice Card */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <div className="flex items-center justify-between pb-3 border-b border-outline mb-3">
              <span className="font-bold text-on-surface text-sm">Settlement &amp; Billing</span>
              <span className="px-2 py-0.5 rounded bg-surface-variant text-secondary font-mono text-[10px] font-bold">
                INV-88291
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Automated milestone billing triggers upon Corwith terminal ingate confirmation.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Waybill Amount:</span>
                <span className="font-mono font-bold text-on-surface">$24,850.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Payment Terms:</span>
                <span className="font-medium text-on-surface">Net 60 Corporate ACH</span>
              </div>
            </div>
            <button
              onClick={() => navigate('billing-detail')}
              className="w-full mt-4 py-2 bg-surface-variant hover:bg-surface text-secondary text-xs font-bold rounded-lg border border-outline transition-colors"
            >
              View Billing &amp; Settlement Details →
            </button>
          </div>

          {/* Carrier Spec */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <span className="font-bold text-on-surface text-sm block mb-3">Carrier Contract Details</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Rail Carrier:</span>
                <span className="font-semibold text-on-surface">BNSF Logistics LLC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Master Agreement:</span>
                <span className="font-mono text-primary font-bold">CTR-BNSF-2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">On-Time Performance:</span>
                <span className="font-bold text-emerald-700">99.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
