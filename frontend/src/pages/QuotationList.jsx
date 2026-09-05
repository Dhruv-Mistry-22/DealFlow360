import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function QuotationList() {
  const { quotes, navigate, setIsNewQuoteOpen, addToast } = useApp();
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter quotes
  const filteredQuotes = quotes.filter((q) => {
    if (filterTab === 'awaiting' && q.status !== 'Awaiting Approval') return false;
    if (filterTab === 'drafts' && q.status !== 'Draft') return false;
    if (filterTab === 'converted' && q.status !== 'Converted') return false;

    if (modeFilter && !q.mode.toLowerCase().includes(modeFilter.toLowerCase())) return false;
    if (statusFilter && q.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

    if (searchQuery) {
      const matchText = `${q.id} ${q.customer} ${q.origin} ${q.destination} ${q.rep}`.toLowerCase();
      if (!matchText.includes(searchQuery.toLowerCase())) return false;
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredQuotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuotes.map((q) => q.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    addToast('Export Successful', `Exported ${filteredQuotes.length} quotations to CSV format.`, 'success');
  };

  return (
    <div className="flex flex-col gap-spacing-lg pb-spacing-2xl">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="flex flex-col">
          <div className="flex items-center gap-spacing-xs">
            <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight">Quotations</h1>
            <span className="inline-flex items-center px-spacing-xs py-spacing-2xs rounded-full bg-primary-container text-secondary font-label-small text-label-small font-semibold">
              Live CPQ Sync
            </span>
          </div>
          <p className="font-body-medium text-body-medium text-on-surface-variant mt-spacing-2xs">
            Manage, price, govern, and convert multi-modal customer freight and sales quotations.
          </p>
        </div>

        {/* Quick Preset Filters & Direct Action */}
        <div className="flex flex-wrap items-center gap-spacing-xs">
          <div className="flex items-center bg-surface-variant p-spacing-2xs rounded-lg border border-outline">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-spacing-sm py-spacing-2xs rounded-md font-label-medium text-label-medium transition-all ${
                filterTab === 'all'
                  ? 'bg-surface text-secondary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Quotations <span className="text-on-surface-variant text-label-small font-normal">({quotes.length})</span>
            </button>
            <button
              onClick={() => setFilterTab('awaiting')}
              className={`px-spacing-sm py-spacing-2xs rounded-md font-label-medium text-label-medium transition-all ${
                filterTab === 'awaiting'
                  ? 'bg-surface text-secondary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Awaiting Approval{' '}
              <span className="px-spacing-2xs py-0.5 rounded-full bg-tertiary-container text-tertiary font-label-small font-bold">
                {quotes.filter((q) => q.status === 'Awaiting Approval').length}
              </span>
            </button>
            <button
              onClick={() => setFilterTab('drafts')}
              className={`px-spacing-sm py-spacing-2xs rounded-md font-label-medium text-label-medium transition-all ${
                filterTab === 'drafts'
                  ? 'bg-surface text-secondary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Drafts{' '}
              <span className="text-on-surface-variant text-label-small font-normal">
                ({quotes.filter((q) => q.status === 'Draft').length})
              </span>
            </button>
            <button
              onClick={() => setFilterTab('converted')}
              className={`px-spacing-sm py-spacing-2xs rounded-md font-label-medium text-label-medium transition-all ${
                filterTab === 'converted'
                  ? 'bg-surface text-secondary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Converted{' '}
              <span className="text-on-surface-variant text-label-small font-normal">
                ({quotes.filter((q) => q.status === 'Converted').length})
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsNewQuoteOpen(true)}
            className="flex items-center gap-spacing-2xs px-spacing-md py-spacing-xs bg-tertiary text-on-tertiary rounded-lg font-label-large text-label-large shadow-sm hover:opacity-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ New Quotation</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-spacing-md">
        {/* Card 1 */}
        <div className="bg-surface p-spacing-md rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-medium text-label-medium text-on-surface-variant uppercase tracking-wider">
              Total Quoted MTD
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="flex items-baseline gap-spacing-xs mt-spacing-sm">
            <span className="font-title-large text-title-large text-on-secondary-container">$18.4M</span>
            <span className="font-label-small text-label-small text-secondary font-semibold">84 quotes</span>
          </div>
          <div className="w-full bg-surface-variant h-1.5 rounded-full mt-spacing-sm overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
          <span className="font-body-small text-body-small text-on-surface-variant mt-spacing-2xs">
            +14.2% pacing vs. prior cycle
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-surface p-spacing-md rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-medium text-label-medium text-on-surface-variant uppercase tracking-wider">
              Pending Review
            </span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
          </div>
          <div className="flex items-baseline gap-spacing-xs mt-spacing-sm">
            <span className="font-title-large text-title-large text-tertiary">$3.2M</span>
            <span className="font-label-small text-label-small text-tertiary font-semibold">14 high-value deals</span>
          </div>
          <div className="w-full bg-surface-variant h-1.5 rounded-full mt-spacing-sm overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: '45%' }}></div>
          </div>
          <span className="font-body-small text-body-small text-on-surface-variant mt-spacing-2xs">
            Requires Director of Pricing sign-off
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-surface p-spacing-md rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-medium text-label-medium text-on-surface-variant uppercase tracking-wider">
              Avg Win Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
          </div>
          <div className="flex items-baseline gap-spacing-xs mt-spacing-sm">
            <span className="font-title-large text-title-large text-on-secondary-container">68.4%</span>
            <span className="font-label-small text-label-small text-secondary font-semibold">+3.1% MoM</span>
          </div>
          <div className="w-full bg-surface-variant h-1.5 rounded-full mt-spacing-sm overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
          <span className="font-body-small text-body-small text-on-surface-variant mt-spacing-2xs">
            Based on competitive lane benchmarks
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-surface p-spacing-md rounded-xl shadow-sm border border-outline flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-medium text-label-medium text-on-surface-variant uppercase tracking-wider">
              Avg Turnaround
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
            </div>
          </div>
          <div className="flex items-baseline gap-spacing-xs mt-spacing-sm">
            <span className="font-title-large text-title-large text-on-secondary-container">3.4 Days</span>
            <span className="font-label-small text-label-small text-secondary font-semibold">Quote to Cash</span>
          </div>
          <div className="w-full bg-surface-variant h-1.5 rounded-full mt-spacing-sm overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '85%' }}></div>
          </div>
          <span className="font-body-small text-body-small text-on-surface-variant mt-spacing-2xs">
            Fastest turnaround in FMCG lanes
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-spacing-sm bg-surface p-4 rounded-xl border border-outline shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by quote ref, customer, lane or rep..."
              className="w-full h-10 pl-9 pr-3 bg-surface-variant border border-outline rounded-lg text-xs font-body-medium text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="h-10 px-3 bg-surface-variant border border-outline rounded-lg text-xs text-on-secondary-container font-medium focus:outline-none"
          >
            <option value="">Route Type: All</option>
            <option value="Ocean">Ocean FCL/LCL</option>
            <option value="Air">Air Expedited</option>
            <option value="Intermodal">Intermodal Rail</option>
            <option value="Truckload">Truckload Dry Van</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-surface-variant border border-outline rounded-lg text-xs text-on-secondary-container font-medium focus:outline-none"
          >
            <option value="">Status: All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Awaiting Approval">Awaiting Approval</option>
            <option value="Converted">Converted</option>
            <option value="Draft">Draft</option>
          </select>

          {(searchQuery || modeFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setModeFilter('');
                setStatusFilter('');
              }}
              className="h-10 px-3 text-on-surface-variant hover:text-on-surface text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={handleExportCSV}
            className="h-10 px-4 bg-surface-variant hover:bg-surface text-secondary text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-outline shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                addToast('Selection Needed', 'Please check at least one quotation from the table.', 'warning');
              } else {
                addToast('Batch Approval', `Requested multi-approval for ${selectedIds.length} quotes.`, 'info');
              }
            }}
            className="h-10 px-4 bg-primary-container hover:bg-surface-container-highest text-primary text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">rule</span>
            <span>Batch Approval ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredQuotes.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Quote Ref #</th>
                <th className="py-3 px-4">Customer / Account</th>
                <th className="py-3 px-4">Route &amp; Cargo Specs</th>
                <th className="py-3 px-4 text-right">Contract Volume</th>
                <th className="py-3 px-4">Margin Guard</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-3">Created</th>
                <th className="py-3 px-4">Assigned Rep</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline text-sm">
              {filteredQuotes.map((q) => (
                <tr
                  key={q.id}
                  className="hover:bg-surface-variant/40 transition-colors group cursor-pointer"
                  onClick={() => navigate('quotation-detail', { quoteId: q.id })}
                >
                  <td
                    className="py-4 px-4 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(q.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(q.id)}
                      onChange={() => toggleSelect(q.id)}
                      className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-large text-label-large text-secondary font-bold">
                        {q.id}
                      </span>
                      <span className="text-[10px] px-1 rounded bg-surface-variant text-on-surface-variant font-mono">
                        {q.version}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-on-surface">{q.customer}</div>
                    <div className="text-xs text-on-surface-variant">{q.accountTier}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-on-surface">
                      {q.origin} → {q.destination}
                    </div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                      <span>{q.mode}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-on-secondary-container">
                    {q.volume}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                          q.marginStatus.includes('Breached')
                            ? 'bg-error-container text-on-tertiary-container'
                            : q.marginStatus === 'Warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {q.margin}
                      </span>
                      <span className="text-[11px] text-on-surface-variant hidden sm:inline">
                        {q.marginStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        q.status === 'Approved'
                          ? 'bg-primary-container text-secondary'
                          : q.status === 'Awaiting Approval'
                          ? 'bg-tertiary-container text-tertiary'
                          : q.status === 'Converted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-surface-variant text-on-surface-variant'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-xs text-on-surface-variant whitespace-nowrap">
                    {q.date}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-container text-primary font-bold text-[10px] flex items-center justify-center">
                        {q.repAvatar}
                      </div>
                      <span className="text-xs text-on-surface font-medium">{q.rep}</span>
                    </div>
                  </td>
                  <td
                    className="py-4 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate('quotation-detail', { quoteId: q.id })}
                        className="p-1.5 rounded hover:bg-surface-variant text-secondary transition-colors"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      {q.status === 'Awaiting Approval' ? (
                        <button
                          onClick={() => navigate('approval-detail', { quoteId: q.id })}
                          className="px-2 py-1 rounded bg-tertiary text-on-tertiary text-xs font-semibold hover:opacity-90"
                        >
                          Review
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            addToast('Converted to Order', `Quote ${q.id} converted to Fulfillment Order SH-9402.`, 'success');
                            navigate('fulfillment-detail', { orderId: 'SH-9402' });
                          }}
                          className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant hover:text-emerald-600 transition-colors"
                          title="Convert to Order"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Counter */}
        <div className="px-6 py-3 bg-surface-variant/40 border-t border-outline flex items-center justify-between text-xs text-on-surface-variant">
          <span>
            Showing <strong className="text-on-surface">{filteredQuotes.length}</strong> of {quotes.length} total active quotations
          </span>
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> CPQ Algorithmic Engine Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
