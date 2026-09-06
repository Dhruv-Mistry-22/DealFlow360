import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function AdminReport() {
  const { addToast } = useApp();
  const [auditLogs, setAuditLogs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [period, setPeriod] = useState('all');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [searchRep, setSearchRep] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [logs, qs] = await Promise.all([
          api.get('/api/v1/audit-log').catch(() => []),
          api.get('/api/v1/quotes').catch(() => [])
        ]);
        setAuditLogs(logs || []);
        setQuotes(qs || []);
      } catch (e) {
        addToast('Error', e.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [addToast]);

  // Filter quotes by period
  const now = new Date();
  const filteredQuotes = quotes.filter(q => {
    if (approvalStatus && q.status !== approvalStatus) return false;
    if (period === 'today') {
      const d = new Date(q.created_at);
      return d.toDateString() === now.toDateString();
    }
    if (period === 'week') {
      const d = new Date(q.created_at);
      return (now - d) < 7 * 24 * 60 * 60 * 1000;
    }
    return true;
  });

  // KPIs
  const totalVolume = filteredQuotes.reduce((s, q) => s + (q.total_amount || 0), 0);
  const pendingCount = filteredQuotes.filter(q => q.status === 'PENDING_APPROVAL').length;
  const approvedCount = filteredQuotes.filter(q => q.status === 'APPROVED' || q.status === 'CONFIRMED' || q.status === 'FULFILLMENT' || q.status === 'COMPLETED').length;
  const rejectedCount = filteredQuotes.filter(q => q.status === 'REJECTED').length;
  const avgMargin = filteredQuotes.length > 0
    ? (filteredQuotes.reduce((s, q) => s + (q.margin_pct || 0), 0) / filteredQuotes.length).toFixed(1)
    : 0;

  const handlePDFExport = () => {
    const win = window.open('', '_blank');
    const rows = filteredQuotes.slice(0, 50).map(q => `
      <tr>
        <td>Q-${String(q.id).padStart(4,'0')}</td>
        <td>${q.customer?.name || '—'}</td>
        <td>$${Number(q.total_amount || 0).toLocaleString()}</td>
        <td>${q.margin_pct?.toFixed(1) || 0}%</td>
        <td>${q.status}</td>
        <td>${q.created_at ? new Date(q.created_at).toLocaleDateString() : '—'}</td>
      </tr>`).join('');

    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>DealFlow360 Admin Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
        h1 { color: #ea580c; margin-bottom: 4px; }
        .sub { color: #666; font-size: 12px; margin-bottom: 24px; }
        .kpis { display: flex; gap: 16px; margin-bottom: 24px; }
        .kpi { background: #f4f4f5; padding: 12px 20px; border-radius: 8px; }
        .kpi .val { font-size: 22px; font-weight: bold; }
        .kpi .lbl { font-size: 11px; color: #555; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #f4f4f5; padding: 8px; text-align: left; border-bottom: 1px solid #e4e4e7; }
        td { padding: 8px; border-bottom: 1px solid #e4e4e7; }
        tr:hover td { background: #f9f9fb; }
      </style></head><body>
      <h1>DealFlow360 — Admin Sales Report</h1>
      <div class="sub">Generated: ${new Date().toLocaleString()} · Period: ${period} · Showing ${filteredQuotes.length} quotations</div>
      <div class="kpis">
        <div class="kpi"><div class="val">${filteredQuotes.length}</div><div class="lbl">Total Quotes</div></div>
        <div class="kpi"><div class="val">$${Number(totalVolume).toLocaleString()}</div><div class="lbl">Pipeline Volume</div></div>
        <div class="kpi"><div class="val">${avgMargin}%</div><div class="lbl">Avg Margin</div></div>
        <div class="kpi"><div class="val">${approvedCount}</div><div class="lbl">Approved</div></div>
        <div class="kpi"><div class="val">${pendingCount}</div><div class="lbl">Pending</div></div>
        <div class="kpi"><div class="val">${rejectedCount}</div><div class="lbl">Rejected</div></div>
      </div>
      <table>
        <thead><tr><th>Quote Ref</th><th>Customer</th><th>Volume</th><th>Margin</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <script>window.print();</script>
      </body></html>`);
    win.document.close();
  };

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="space-y-1">
          <div className="flex items-center gap-spacing-xs">
            <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight font-black">
              Admin Reporting &amp; Governance
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-small text-label-small uppercase tracking-widest font-bold">
              Live
            </span>
          </div>
          <p className="font-body-medium text-body-medium text-on-surface-variant max-w-4xl">
            Sales performance reports, approval analytics, and live audit trail. All data fetched directly from the backend.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-spacing-xs shrink-0">
          <button
            onClick={handlePDFExport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-large text-label-large hover:bg-secondary shadow-sm transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-surface rounded-xl p-4 border border-outline shadow-sm flex flex-wrap gap-3 items-center">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Filters:</span>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="h-9 px-3 bg-surface-variant border border-outline rounded-lg text-xs text-on-surface font-medium focus:outline-none"
        >
          <option value="all">Period: All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
        </select>
        <select
          value={approvalStatus}
          onChange={e => setApprovalStatus(e.target.value)}
          className="h-9 px-3 bg-surface-variant border border-outline rounded-lg text-xs text-on-surface font-medium focus:outline-none"
        >
          <option value="">Approval Status: All</option>
          <option value="PENDING_APPROVAL">Pending Approval</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="FULFILLMENT">Fulfillment</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <button
          onClick={() => { setPeriod('all'); setApprovalStatus(''); setSearchRep(''); }}
          className="h-9 px-3 text-xs font-semibold text-on-surface-variant hover:text-on-surface border border-outline rounded-lg"
        >
          Reset
        </button>
        <span className="ml-auto text-xs text-on-surface-variant">{filteredQuotes.length} results</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Quotes', value: filteredQuotes.length, icon: 'request_quote', color: 'text-primary' },
          { label: 'Pipeline Volume', value: `$${Number(totalVolume).toLocaleString()}`, icon: 'attach_money', color: 'text-on-secondary-container' },
          { label: 'Avg Margin', value: `${avgMargin}%`, icon: 'percent', color: 'text-emerald-700' },
          { label: 'Approved', value: approvedCount, icon: 'check_circle', color: 'text-emerald-700' },
          { label: 'Pending', value: pendingCount, icon: 'pending', color: 'text-tertiary' },
          { label: 'Rejected', value: rejectedCount, icon: 'cancel', color: 'text-error' },
        ].map((kpi, i) => (
          <div key={i} className="bg-surface rounded-xl p-4 border border-outline shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{kpi.label}</span>
              <span className={`material-symbols-outlined text-[18px] ${kpi.color}`}>{kpi.icon}</span>
            </div>
            <div className={`text-2xl font-black font-mono truncate ${kpi.color}`} title={kpi.value}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quotations Report Table */}
      <div className="bg-surface rounded-xl border border-outline shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-surface-variant border-b border-outline flex items-center justify-between">
          <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Quotation Report</h2>
          <span className="text-xs text-on-surface-variant">{filteredQuotes.length} records</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant text-sm">Loading data from backend...</div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant text-sm">No quotations match the selected filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-variant/50">
                  <th className="py-3 px-4 text-left">Quote Ref</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4 text-right">Margin</th>
                  <th className="py-3 px-4 text-right">Risk Score</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {filteredQuotes.slice(0, 100).map(q => (
                  <tr key={q.id} className="hover:bg-surface-variant/30">
                    <td className="py-3 px-4 font-mono font-bold text-primary text-xs">Q-{String(q.id).padStart(4,'0')}</td>
                    <td className="py-3 px-4 font-semibold text-on-surface">{q.customer?.name || '—'}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-on-secondary-container">
                      ${Number(q.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold ${q.margin_pct < 15 ? 'text-tertiary' : 'text-emerald-700'}`}>
                        {q.margin_pct?.toFixed(1) || 0}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-on-surface-variant">
                      {q.blended_risk_score?.toFixed(0) || 0}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        q.status === 'PENDING_APPROVAL' ? 'bg-tertiary-container text-tertiary' :
                        q.status === 'REJECTED' ? 'bg-error-container text-on-tertiary-container' :
                        q.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-primary-container text-on-primary-container'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-on-surface-variant">
                      {q.created_at ? new Date(q.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Log */}
      <div className="bg-surface rounded-xl border border-outline shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-surface-variant border-b border-outline">
          <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Live Audit Log</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant text-sm">Loading audit log...</div>
        ) : auditLogs.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant text-sm">No audit events recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-variant/50">
                  <th className="py-3 px-4 text-left">Event ID</th>
                  <th className="py-3 px-4 text-left">Action</th>
                  <th className="py-3 px-4 text-left">Entity</th>
                  <th className="py-3 px-4 text-left">Detail</th>
                  <th className="py-3 px-4 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline">
                {auditLogs.slice(0, 50).map(log => (
                  <tr key={log.id} className="hover:bg-surface-variant/30">
                    <td className="py-3 px-4 font-mono text-xs text-on-surface-variant">AUD-{log.id}</td>
                    <td className="py-3 px-4 font-semibold text-on-surface">{log.action}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{log.entity_type} #{log.entity_id}</td>
                    <td className="py-3 px-4 text-xs text-on-surface-variant max-w-xs truncate">{log.detail || log.reason || '—'}</td>
                    <td className="py-3 px-4 text-xs text-on-surface-variant">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
