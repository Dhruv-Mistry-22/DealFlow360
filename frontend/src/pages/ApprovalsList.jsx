import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function ApprovalsList() {
  const { navigate, addToast } = useApp();
  const [approvals, setApprovals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const quotes = await api.get('/api/v1/quotes');
        const pending = quotes.filter(q => q.status === 'PENDING_APPROVAL').map(q => ({
          id: `Q-${q.id.toString().padStart(4, '0')}`,
          rawId: q.id,
          status: 'Awaiting Action'
        }));
        setApprovals(pending);
      } catch (err) {
        addToast('Error', 'Failed to fetch approvals: ' + err.message, 'error');
      }
    };
    fetchApprovals();
  }, [addToast]);

  const handleApproveDeal = async (id) => {
    try {
      await api.post(`/api/v1/quotes/${id}/approve`);
      addToast('Approved', 'Deal approved successfully.', 'success');
      setApprovals(approvals.filter(a => a.rawId !== id));
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleRejectDeal = async (id) => {
    try {
      await api.post(`/api/v1/quotes/${id}/reject`, { reason: 'Rejected by management' });
      addToast('Rejected', 'Deal has been rejected.', 'info');
      setApprovals(approvals.filter(a => a.rawId !== id));
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const filtered = approvals.filter((a) => {
    if (filter === 'urgent') return a.slaMinutes <= 60;
    if (filter === 'approved') return a.status.includes('Approved');
    if (filter === 'rejected') return a.status === 'Rejected';
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">


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
              approvals.forEach((a) => handleApproveDeal(a.rawId));
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
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Sales Owner</th>
                <th className="py-3 px-4 text-right">Volume</th>
                <th className="py-3 px-4">Created</th>
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
                  <td className="py-4 px-4 font-bold text-on-surface">
                    {deal.customer}
                  </td>
                  <td className="py-4 px-4 font-medium text-on-surface">
                    {deal.requestor}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-on-secondary-container">
                    {deal.volume}
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-on-surface-variant">
                    {deal.date}
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
                        onClick={() => handleRejectDeal(deal.rawId)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-variant hover:bg-error-container text-on-surface-variant hover:text-error text-xs font-semibold transition-colors"
                        title="Reject Concession"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveDeal(deal.rawId)}
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
