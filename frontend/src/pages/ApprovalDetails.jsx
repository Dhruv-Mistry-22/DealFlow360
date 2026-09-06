import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function ApprovalDetails() {
  const { navigate, pageParams, addToast } = useApp();
  const approvalId = pageParams.approvalId; // numeric quote ID
  const [comment, setComment] = useState('');
  const [signed, setSigned] = useState(false);

  const onApprove = async () => {
    try {
      await api.post(`/api/v1/approvals/${approvalId}/action`, {
        action: 'APPROVE',
        comment: comment || 'Approved by management'
      });
      setSigned(true);
      addToast('Approved', 'Deal has been approved successfully.', 'success');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const onReject = async () => {
    try {
      await api.post(`/api/v1/approvals/${approvalId}/action`, {
        action: 'REJECT',
        comment: comment || 'Rejected by management'
      });
      addToast('Rejected', 'Deal has been rejected.', 'info');
      navigate('approvals');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const onReturn = async () => {
    try {
      await api.post(`/api/v1/approvals/${approvalId}/action`, {
        action: 'RETURN',
        comment: comment || 'Returned for revision'
      });
      addToast('Returned', 'Quote sent back to rep for revision.', 'info');
      navigate('approvals');
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Dynamic Meta Header / Urgency Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="flex flex-col gap-spacing-2xs">
          <div className="flex flex-wrap items-center gap-spacing-xs">
            <span className="font-label-medium text-label-medium text-secondary">Quote Ref #Q-1025</span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            <span className="font-body-small text-body-small text-on-surface-variant">
              Rotterdam (NLRTM) → New York (USNYC) Gateway
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            <span className="font-body-small text-body-small text-on-surface-variant">
              Created Oct 28, 2024 · 09:42 EST
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-spacing-sm mt-1">
            <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight font-extrabold">
              Approval Request: {approvalId}
            </h1>
            <span className="font-title-medium text-title-medium text-on-surface tracking-tight font-extrabold">
              $112,400.00
            </span>
            <span className="font-label-small text-label-small text-on-surface-variant">
              USD / 24 TEU FCL
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-spacing-xs pt-spacing-2xs">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-small text-label-small bg-error-container text-on-tertiary-container font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1.5 animate-pulse"></span>
              High Margin Exception
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-small text-label-small bg-primary-container text-primary font-semibold">
              <span className="material-symbols-outlined text-[14px] mr-1">timer</span>
              SLA: 48m Remaining
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-small text-label-small bg-surface-variant text-on-surface-variant font-medium">
              Stage: VP Commercial Review
            </span>
          </div>
        </div>

        {/* Executive Action Bar */}
        <div className="flex flex-wrap items-center gap-spacing-sm">
          <button
            onClick={onReject}
            className="px-spacing-md py-2.5 bg-surface-variant hover:bg-error-container text-on-surface-variant hover:text-error rounded-lg font-label-large text-label-large transition-colors shadow-sm flex items-center gap-spacing-2xs border border-outline"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>Reject Deal</span>
          </button>
          <button
            onClick={onReturn}
            className="px-spacing-md py-2.5 bg-primary-container hover:bg-surface-container text-primary rounded-lg font-label-large text-label-large transition-colors shadow-sm flex items-center gap-spacing-2xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">cached</span>
            <span>Request Margin Rework</span>
          </button>
          <button
            onClick={onApprove}
            className={`px-spacing-lg py-2.5 rounded-lg font-label-large text-label-large shadow-md transition-all flex items-center gap-spacing-2xs transform active:scale-95 text-on-tertiary ${
              signed ? 'bg-emerald-600' : 'bg-tertiary hover:opacity-90'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {signed ? 'check_circle' : 'verified_user'}
            </span>
            <span>{signed ? 'Approved & Transmitted' : 'Approve & Sign Deal →'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Economics & Justification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-lg">
        {/* Left Column (8 cols): Deal Economics & Breakdown */}
        <div className="lg:col-span-8 flex flex-col gap-spacing-lg">
          {/* Economics Card */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <h2 className="font-title-small text-title-small text-on-secondary-container mb-4 pb-3 border-b border-outline">
              Commercial Deal Economics &amp; Margin Floor Variance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-surface-variant/70 border border-outline">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Quoted Contract
                </span>
                <div className="text-2xl font-black font-mono text-on-surface mt-1">$112,400.00</div>
                <span className="text-[11px] text-on-surface-variant">Concession: -$12,100 (9.7%)</span>
              </div>

              <div className="p-4 rounded-xl bg-surface-variant/70 border border-outline">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Carrier Direct Cost
                </span>
                <div className="text-2xl font-black font-mono text-on-surface mt-1">$99,136.80</div>
                <span className="text-[11px] text-on-surface-variant">Ocean vessel + port drayage</span>
              </div>

              <div className="p-4 rounded-xl bg-error-container/40 border border-error/30">
                <span className="text-xs text-on-tertiary-container uppercase tracking-wider font-semibold">
                  Net Margin Realization
                </span>
                <div className="text-2xl font-black font-mono text-tertiary mt-1">11.8%</div>
                <span className="text-[11px] text-on-tertiary-container font-bold">
                  Variance: -6.2% vs 18% Floor
                </span>
              </div>
            </div>

            {/* Rep Concession Justification */}
            <div className="p-4 rounded-xl bg-surface-variant/50 border border-outline space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-primary">description</span>
                <span>Account Executive Concession Justification</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                "Falcon Aerospace is migrating their transatlantic semiconductor supply chain from Hamburg to Rotterdam. This pricing concession is tied to a binding 12-month volume commitment of 250 TEU, generating $1.4M ARR with standard terms beginning Q1 2025. Approval recommended by Regional Sales Ops."
              </p>
              <div className="flex items-center gap-2 pt-2 text-[11px] text-on-surface-variant border-t border-outline/50">
                <span>Submitted by: <strong>Eleanor Vance</strong> (Senior Account Executive)</span>
                <span>•</span>
                <span>Risk Level: <strong>Medium (Low Churn Probability)</strong></span>
              </div>
            </div>
          </div>

          {/* Electronic Signature Box */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <h3 className="font-title-small text-title-small text-on-secondary-container mb-2">
              Executive Commercial Attestation &amp; Sign-off
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              By authorizing, Marcus Vance certifies that this concession complies with Delegated Authority Tier 3 policy rules.
            </p>

            <div className="space-y-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional executive override rationale for SOX compliance audit logging..."
                className="w-full h-24 p-3 bg-surface-variant border border-outline rounded-lg text-xs font-body-medium focus:outline-none focus:border-primary text-on-surface"
              ></textarea>

              <div className="flex items-center justify-between">
                <div className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  <span>PKI Smart Card Signature: <strong>MVANCE-OP-4418</strong></span>
                </div>
                <button
                  onClick={onApprove}
                  className="px-6 py-2.5 bg-tertiary hover:opacity-90 text-on-tertiary text-xs font-bold rounded-lg shadow-sm"
                >
                  Sign &amp; Authorize Concession
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Risk Telemetry & Account History */}
        <div className="lg:col-span-4 flex flex-col gap-spacing-lg">
          {/* Account Profile Card */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <div className="flex items-center justify-between pb-3 border-b border-outline mb-3">
              <span className="font-bold text-on-surface text-sm">Falcon Aerospace Corp</span>
              <span className="px-2 py-0.5 rounded bg-primary-container text-primary font-bold text-[10px]">
                Tier 1 Shipper
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Lifetime Billed:</span>
                <span className="font-mono font-bold text-on-surface">$4,850,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Active Lane Quotes:</span>
                <span className="font-mono text-on-surface">6 Lanes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Payment Default Risk:</span>
                <span className="font-bold text-emerald-700">0.02% (Prime)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">DSO (Days Sales Out):</span>
                <span className="font-mono text-on-surface">32 Days</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation to Related Assets */}
          <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
            <span className="font-bold text-on-surface text-sm block mb-3">Related Artifacts</span>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => navigate('quotation-detail', { quoteId: 'Q-1025' })}
                className="w-full p-2.5 rounded-lg bg-surface-variant hover:bg-primary-container/40 text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">request_quote</span>
                  <span className="font-semibold text-on-surface">Quotation Q-1025</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">chevron_right</span>
              </button>

              <button
                onClick={() => navigate('deal-health')}
                className="w-full p-2.5 rounded-lg bg-surface-variant hover:bg-primary-container/40 text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">monitoring</span>
                  <span className="font-semibold text-on-surface">Deal Health Telemetry</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
