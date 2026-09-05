'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

// ─── Audit Trail Timeline ──────────────────────────────────────────────────────
function AuditTimeline({ quoteId }: { quoteId: number }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/v1/audit-log?entity_type=Quote&entity_id=${quoteId}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setLogs(data); setLoading(false); });
  }, [quoteId]);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  }

  function eventMeta(action: string): { icon: string; color: string; label: string } {
    if (action === 'QUOTE_CREATED') return { icon: '✨', color: 'bg-slate-100 border-slate-300', label: 'Quote Created' };
    if (action.includes('APPROVED') || action.includes('APPROVE')) return { icon: '✅', color: 'bg-green-100 border-green-300', label: 'Approved' };
    if (action.includes('REJECT')) return { icon: '❌', color: 'bg-red-100 border-red-300', label: 'Rejected' };
    if (action.includes('SUBMIT')) return { icon: '📤', color: 'bg-blue-100 border-blue-300', label: 'Submitted' };
    if (action.includes('RETURN')) return { icon: '↩️', color: 'bg-amber-100 border-amber-300', label: 'Returned' };
    if (action.includes('LINE')) return { icon: '📝', color: 'bg-slate-100 border-slate-200', label: 'Line Changed' };
    if (action.includes('CUSTOMER')) return { icon: '👤', color: 'bg-purple-100 border-purple-300', label: 'Customer Action' };
    if (action.includes('FULFILLMENT')) return { icon: '📦', color: 'bg-indigo-100 border-indigo-300', label: 'Fulfillment' };
    return { icon: '•', color: 'bg-slate-100 border-slate-200', label: action };
  }

  if (loading) return <p className="text-xs text-slate-400 p-4">Loading audit trail...</p>;
  if (!logs.length) return <p className="text-xs text-slate-400 italic p-4">No audit entries yet.</p>;

  return (
    <div className="relative pl-6 space-y-4 py-2">
      {/* Vertical line */}
      <div className="absolute left-2.5 top-4 bottom-4 w-0.5 bg-slate-200" />
      {logs.map((log) => {
        const meta = eventMeta(log.action);
        return (
          <div key={log.id} className="relative flex gap-3">
            <div className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${meta.color}`}>
              {meta.icon}
            </div>
            <div className="flex-1 bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-slate-800">{meta.label}</span>
                <span className="text-xs text-slate-400 shrink-0 ml-2">{timeAgo(log.created_at)}</span>
              </div>
              {log.reason && <p className="text-xs text-slate-600 mt-1 italic">"{log.reason}"</p>}
              <p className="text-[10px] text-slate-400 mt-1">
                {new Date(log.created_at).toLocaleString()}
                {log.actor_id ? ` · User #${log.actor_id}` : ' · System'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── AI Risk Summary (Gemini with fallback) ───────────────────────────────────
function AiRiskSummary({ quote }: { quote: any }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try Gemini via backend endpoint — 5s timeout
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);

    api.get(`/api/v1/quotes/${quote.id}/ai-risk-summary`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        clearTimeout(timeout);
        if (data?.summary) {
          setSummary(data.summary);
        } else {
          setSummary(buildFallback(quote));
        }
      })
      .catch(() => setSummary(buildFallback(quote)))
      .finally(() => setLoading(false));
  }, [quote.id]);

  function buildFallback(q: any): string {
    const flagged = q.lines.filter((l: any) => l.overage > 0);
    if (!flagged.length) {
      return `This quote has a blended risk score of ${q.blended_risk_score.toFixed(1)} with no lines exceeding their discount ceilings. All terms are within policy — this quote is recommended for approval.`;
    }
    const details = flagged.map((l: any) => `line #${l.id} (${l.overage.toFixed(1)}pp over ceiling)`).join(', ');
    return `This quote has a blended risk score of ${q.blended_risk_score.toFixed(1)}, triggered by flagged discount overages on ${details}. The required approval level is ${q.required_approval_level}. Review carefully before approving.`;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-600 text-lg">✦</span>
        <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">AI Risk Summary</span>
        <span className="text-xs text-blue-400">· Gemini</span>
      </div>
      {loading ? (
        <div className="h-4 bg-blue-100 rounded animate-pulse w-3/4" />
      ) : (
        <p className="text-sm text-blue-900 leading-relaxed">{summary}</p>
      )}
    </div>
  );
}

// ─── Main Approvals Page ──────────────────────────────────────────────────────
export default function ApprovalsPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [comment, setComment] = useState<{ [id: number]: string }>({});
  const [expandedAudit, setExpandedAudit] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    loadData();
  }, []);

  async function loadData() {
    const [qResp, uResp] = await Promise.all([
      api.get('/api/v1/approvals'),
      api.get('/api/v1/auth/me'),
    ]);
    if (qResp.ok) setQuotes(await qResp.json());
    if (uResp.ok) setUser(await uResp.json());
  }

  async function handleAction(quoteId: number, action: string) {
    const c = comment[quoteId] || '';
    if ((action === 'REJECT' || action === 'RETURN') && !c) {
      setMsg(`Please provide a comment for ${action.toLowerCase()}`);
      return;
    }
    setMsg('');
    const resp = await api.post(`/api/v1/approvals/${quoteId}/action`, { action, comment: c });
    if (resp.ok) {
      setComment(prev => { const n = {...prev}; delete n[quoteId]; return n; });
      loadData();
    } else {
      const err = await resp.json();
      setMsg(err.detail || 'Error processing action');
    }
  }

  const isApprover = user && ['ADMIN', 'SALES_MANAGER', 'FINANCE'].includes(user.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4 shadow-sm">
        <Link href="/dashboard" className="text-blue-600 text-sm hover:underline">← Dashboard</Link>
        <h1 className="text-lg font-bold text-slate-800">Approvals Queue</h1>
        {user && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">{user.role}</span>}
        <span className="ml-auto text-xs text-slate-400">{quotes.length} pending</span>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {msg && <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">{msg}</div>}

        {quotes.length === 0 && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-slate-600 font-medium">No pending approvals</p>
            <p className="text-slate-400 text-sm mt-1">All caught up!</p>
          </div>
        )}

        {quotes.map((q: any) => {
          const riskScore = q.blended_risk_score;
          const riskBadge = riskScore >= 50 ? 'bg-red-100 text-red-700 border-red-200' :
                            riskScore >= 25 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                             'bg-green-100 text-green-700 border-green-200';
          return (
            <div key={q.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              {/* Quote header */}
              <div className="px-6 py-4 border-b bg-slate-50 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-bold text-slate-800">Quote #{q.id}</h2>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{q.status}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${riskBadge}`}>
                      Risk: {riskScore.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Customer #{q.customer_id} · ${q.total_amount.toFixed(2)} · Margin: {q.margin_pct.toFixed(1)}%</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/quotes/${q.id}`} className="text-xs text-blue-600 hover:underline">View Quote →</Link>
                  <button
                    onClick={() => setExpandedAudit(expandedAudit === q.id ? null : q.id)}
                    className="text-xs text-slate-500 border px-2 py-1 rounded-lg hover:bg-slate-50"
                  >
                    {expandedAudit === q.id ? 'Hide' : 'Show'} Audit Trail
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* AI Risk Summary */}
                <AiRiskSummary quote={q} />

                {/* Line items summary */}
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-slate-500 uppercase border-b">
                      <tr>
                        <th className="text-left py-2">Product</th>
                        <th className="text-right py-2">Qty</th>
                        <th className="text-right py-2">Discount</th>
                        <th className="text-right py-2">Ceiling</th>
                        <th className="text-right py-2">Overage</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {q.lines.map((l: any) => (
                        <tr key={l.id} className={l.overage > 0 ? 'bg-red-50/50' : ''}>
                          <td className="py-2 font-medium text-slate-800">Product #{l.product_id}</td>
                          <td className="py-2 text-right">{l.quantity}</td>
                          <td className="py-2 text-right">{l.discount_given}%</td>
                          <td className="py-2 text-right text-slate-500">{l.category_ceiling}%</td>
                          <td className={`py-2 text-right font-semibold ${l.overage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {l.overage > 0 ? `+${l.overage.toFixed(1)}pp` : '✓'}
                          </td>
                          <td className="py-2 text-right">${l.line_total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Approval Actions */}
                {isApprover && (
                  <div className="border-t pt-4">
                    <div className="mb-3">
                      <label className="text-xs font-medium text-slate-600 block mb-1">
                        Comment / Reason (required for Reject/Return)
                      </label>
                      <textarea
                        value={comment[q.id] || ''}
                        onChange={e => setComment(prev => ({ ...prev, [q.id]: e.target.value }))}
                        rows={2}
                        className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a comment..."
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(q.id, 'APPROVE')}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleAction(q.id, 'RETURN')}
                        className="flex-1 bg-amber-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition"
                      >
                        ↩️ Return for Revision
                      </button>
                      <button
                        onClick={() => handleAction(q.id, 'REJECT')}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                )}

                {/* Audit Trail (expandable) */}
                {expandedAudit === q.id && (
                  <div className="border-t mt-4 pt-4">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Full Audit Trail</h3>
                    <AuditTimeline quoteId={q.id} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
