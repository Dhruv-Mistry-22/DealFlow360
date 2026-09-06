import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function QuotationList() {
  const { navigate, setIsNewQuoteOpen, addToast } = useApp();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const data = await api.get('/api/v1/quotes');
        const mapped = data.map(q => ({
          id: `Q-${q.id.toString().padStart(4, '0')}`,
          rawId: q.id,
          customer: q.customer ? q.customer.name : 'Unknown Customer',
          volume: `$${Number(q.total_amount || 0).toLocaleString()}`,
          numericVolume: Number(q.total_amount || 0),
          status: q.status === 'PENDING_APPROVAL' ? 'Awaiting Approval' : q.status.charAt(0).toUpperCase() + q.status.slice(1).toLowerCase(),
          version: 'v1.0',
          date: new Date(q.created_at || Date.now()).toLocaleDateString(),
          rep: q.sales_rep ? q.sales_rep.full_name : 'System',
          repAvatar: q.sales_rep && q.sales_rep.full_name ? q.sales_rep.full_name.substring(0, 2).toUpperCase() : 'SY'
        }));
        setQuotes(mapped);
      } catch (err) {
        addToast('Error', err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, [addToast]);

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
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-surface-variant p-1 rounded-lg border border-outline">
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            title="Kanban View"
            className={`p-1.5 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[18px]">view_kanban</span>
          </button>
        </div>
      </div>

      {/* Kanban Pipeline View */}
      {viewMode === 'kanban' && (() => {
        const stages = [
          { key: 'Draft', label: 'Draft', color: 'bg-surface-variant text-on-surface-variant' },
          { key: 'Awaiting Approval', label: 'Awaiting Approval', color: 'bg-tertiary-container text-tertiary' },
          { key: 'Approved', label: 'Approved', color: 'bg-primary-container text-primary' },
          { key: 'Fulfillment', label: 'Fulfillment', color: 'bg-secondary-container text-secondary' },
          { key: 'Completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
        ];
        return (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map(stage => {
              const stageQuotes = filteredQuotes.filter(q => q.status === stage.key);
              return (
                <div key={stage.key} className="flex-shrink-0 w-72">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${stage.color}`}>{stage.label}</span>
                    <span className="text-xs text-on-surface-variant font-semibold">{stageQuotes.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageQuotes.length === 0 ? (
                      <div className="bg-surface border border-outline border-dashed rounded-xl p-4 text-center text-xs text-on-surface-variant">No quotes</div>
                    ) : stageQuotes.map(q => (
                      <div
                        key={q.id}
                        onClick={() => navigate('quotation-detail', { quoteId: q.rawId })}
                        className="bg-surface border border-outline rounded-xl p-4 cursor-pointer hover:border-primary hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-xs text-primary">{q.id}</span>
                          <span className="text-xs font-bold text-on-secondary-container">{q.volume}</span>
                        </div>
                        <div className="font-semibold text-sm text-on-surface truncate">{q.customer}</div>
                        <div className="text-xs text-on-surface-variant mt-1">{q.date}</div>
                        <div className="flex items-center gap-1 mt-2">
                          <div className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[9px] font-bold">{q.repAvatar}</div>
                          <span className="text-xs text-on-surface-variant truncate">{q.rep}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Data Table Container */}
      {viewMode === 'list' && <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden flex flex-col">
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
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-right">Volume</th>
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
                    <span className="font-label-large text-label-large text-secondary font-bold">
                      {q.id}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-on-surface">{q.customer}</div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-on-secondary-container">
                    {q.volume}
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
          </div>
        </div>
      </div>}
    </div>
  );
}
