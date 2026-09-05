'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

// ─── Risk Breakdown Drawer ────────────────────────────────────────────────────
function RiskDrawer({ quoteId, quote, products, onClose, onFixed }: {
  quoteId: string;
  quote: any;
  products: any[];
  onClose: () => void;
  onFixed: () => void;
}) {
  const [risk, setRisk] = useState<any>(null);
  const [applying, setApplying] = useState<number | null>(null);

  useEffect(() => {
    api.get(`/api/v1/quotes/${quoteId}/risk`).then(r => r.ok ? r.json() : null).then(setRisk);
  }, [quoteId]);

  async function applyFix(lineId: number) {
    setApplying(lineId);
    const resp = await api.patch(`/api/v1/quotes/${quoteId}/lines/${lineId}/fix-discount`, {});
    if (resp.ok) {
      onFixed();
      const refreshed = await api.get(`/api/v1/quotes/${quoteId}/risk`);
      if (refreshed.ok) setRisk(await refreshed.json());
    }
    setApplying(null);
  }

  const scoreColor = (s: number) =>
    s < 25 ? 'text-green-700 bg-green-50 border-green-200' :
    s < 50 ? 'text-amber-700 bg-amber-50 border-amber-200' :
             'text-red-700 bg-red-50 border-red-200';

  const statusBadge = (l: any) => l.status === 'OK'
    ? <span className="text-green-600 font-bold text-lg">✓</span>
    : <span className="text-red-600 font-semibold text-sm">+{l.overage.toFixed(1)}pts</span>;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative w-[460px] bg-white shadow-2xl h-full flex flex-col overflow-hidden border-l">
        {/* Header */}
        <div className="px-5 py-4 border-b bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
            🔍 Glass Box Risk Breakdown
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {!risk ? (
            <div className="text-center text-slate-400 py-10">Loading risk data...</div>
          ) : (
            <>
              {/* Blended Score */}
              <div className={`p-5 rounded-xl border text-center ${scoreColor(risk.blended_score)}`}>
                <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">Blended Risk Score</p>
                <p className="text-6xl font-black">{risk.blended_score.toFixed(1)}</p>
                <p className="text-sm mt-2 opacity-80">{risk.path_description}</p>
              </div>

              {/* Approval Path */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Approval Path</p>
                <div className="flex items-center gap-2">
                  {risk.approval_path.map((step: string, i: number) => (
                    <div key={step} className="flex items-center gap-2">
                      {i > 0 && <span className="text-slate-300">→</span>}
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                        {step === 'AUTO_APPROVED' ? '✅ Auto-Approved' : step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Breakdown Table */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Line-by-Line Breakdown</p>
                <div className="space-y-3">
                  {risk.line_risks.map((line: any) => {
                    const fillPct = Math.min(100, (line.discount_given / Math.max(line.category_ceiling, 1)) * 100);
                    const isOver = line.status === 'OVER';
                    return (
                      <div key={line.line_id} className={`rounded-lg border p-3 ${isOver ? 'border-red-200 bg-red-50/50' : 'border-green-200 bg-green-50/40'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-slate-800 text-sm">{line.product_name}</span>
                          <span className="ml-2 shrink-0">{statusBadge(line)}</span>
                        </div>
                        {/* Progress bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Discount: {line.discount_given}%</span>
                            <span>Ceiling: {line.category_ceiling}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isOver ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(fillPct, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 text-xs text-slate-600 gap-2">
                          <div><p className="text-slate-400">Category</p><p className="font-medium">{line.category}</p></div>
                          <div><p className="text-slate-400">Discount</p><p className="font-medium">{line.discount_given}%</p></div>
                          <div><p className="text-slate-400">Ceiling</p><p className="font-medium">{line.category_ceiling}%</p></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Fix Suggestions */}
              {risk.fix_suggestions.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-2">💡 Suggested Fix</p>
                  {risk.fix_suggestions.map((fix: any) => (
                    <div key={fix.line_id}>
                      <p className="text-sm text-amber-900 mb-3">{fix.message}</p>
                      <button
                        onClick={() => applyFix(fix.line_id)}
                        disabled={applying === fix.line_id}
                        className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 transition"
                      >
                        {applying === fix.line_id ? 'Applying...' : `Apply Fix — Set to ${fix.suggested_discount}%`}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Quote Builder Page ──────────────────────────────────────────────────
export default function QuoteBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const quoteId = unwrappedParams.id;
  const router = useRouter();

  const [quote, setQuote] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [isRiskDrawerOpen, setIsRiskDrawerOpen] = useState(false);
  const [portalLink, setPortalLink] = useState('');

  // Line item form
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('1');
  const [discount, setDiscount] = useState('0');

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    loadData();
  }, [quoteId]);

  async function loadData() {
    const [qResp, pResp, rResp, fResp, uResp] = await Promise.all([
      api.get(`/api/v1/quotes/${quoteId}`),
      api.get('/api/v1/products'),
      api.get(`/api/v1/quotes/${quoteId}/recommendations`),
      api.get(`/api/v1/copilot/feed/${quoteId}`),
      api.get('/api/v1/auth/me'),
    ]);
    if (qResp.ok) setQuote(await qResp.json());
    if (pResp.ok) setProducts(await pResp.json());
    if (rResp.ok) setRecommendations(await rResp.json());
    if (fResp.ok) setFeed(await fResp.json());
    if (uResp.ok) setUser(await uResp.json());
  }

  async function handleAddLine(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;
    const resp = await api.post(`/api/v1/quotes/${quoteId}/lines`, {
      product_id: parseInt(productId),
      quantity: parseInt(qty),
      discount_given: parseFloat(discount),
    });
    if (resp.ok) {
      setProductId(''); setQty('1'); setDiscount('0');
      loadData();
    } else {
      const err = await resp.json(); setMsg(err.detail || 'Error adding line');
    }
  }

  async function handleRemoveLine(lineId: number) {
    await api.delete(`/api/v1/quotes/${quoteId}/lines/${lineId}`);
    loadData();
  }

  async function handleSubmitApproval() {
    const resp = await api.post(`/api/v1/quotes/${quoteId}/submit`, {});
    if (resp.ok) { loadData(); }
    else { const err = await resp.json(); setMsg(err.detail || 'Submit error'); }
  }

  async function handleAddRecommendation(recProductId: number) {
    const resp = await api.post(`/api/v1/quotes/${quoteId}/lines`, {
      product_id: recProductId, quantity: 1, discount_given: 0,
    });
    if (resp.ok) loadData();
  }

  async function handleGeneratePortalLink() {
    const resp = await api.post(`/api/v1/quotes/${quoteId}/generate-portal-link`, {});
    if (resp.ok) {
      const data = await resp.json();
      setPortalLink(data.portal_url);
    }
  }

  if (!quote) return <div className="p-8 text-slate-500">Loading...</div>;

  const isDraft = quote.status === 'DRAFT';
  const isApproved = quote.status === 'APPROVED';
  const riskScore = quote.blended_risk_score;
  const riskColorClass = riskScore >= 50 ? 'text-red-700 bg-red-50 border-red-200 cursor-pointer hover:bg-red-100'
    : riskScore >= 25 ? 'text-amber-700 bg-amber-50 border-amber-200 cursor-pointer hover:bg-amber-100'
    : 'text-green-700 bg-green-50 border-green-200 cursor-pointer hover:bg-green-100';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4 shadow-sm">
        <Link href="/quotes" className="text-blue-600 text-sm hover:underline">← Quotes</Link>
        <h1 className="text-lg font-bold text-slate-800">Quote #{quote.id}</h1>
        <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold uppercase text-slate-600">{quote.status}</span>
        <div className="ml-auto flex items-center gap-3">
          {(isApproved || isDraft) && (
            <button onClick={handleGeneratePortalLink} className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50">
              🔗 Portal Link
            </button>
          )}
          {isApproved && (
            <Link href={`/fulfillment/${quoteId}`} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700">
              Warehouse Split →
            </Link>
          )}
          {isDraft && quote.lines.length > 0 && (
            <button onClick={handleSubmitApproval} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700">
              Submit for Approval
            </button>
          )}
        </div>
      </header>

      {portalLink && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2 flex items-center gap-3">
          <span className="text-sm text-blue-800 font-medium">Portal Link:</span>
          <code className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-700 flex-1 truncate">{portalLink}</code>
          <button onClick={() => navigator.clipboard.writeText(portalLink)} className="text-xs text-blue-600 hover:underline">Copy</button>
          <button onClick={() => setPortalLink('')} className="text-blue-400 hover:text-blue-800">✕</button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Main */}
        <div className="flex-1 overflow-y-auto p-6">
          {msg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{msg}</div>}

          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-slate-800">${quote.total_amount.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Margin</p>
              <p className="text-2xl font-bold text-slate-800">{quote.margin_pct.toFixed(1)}%</p>
            </div>
            {/* Clickable Risk Score → opens drawer */}
            <div
              onClick={() => setIsRiskDrawerOpen(true)}
              title="Click to view risk breakdown"
              className={`p-4 rounded-xl border shadow-sm text-center transition ${riskColorClass}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">Blended Risk 🔍</p>
              <p className="text-3xl font-black">{riskScore.toFixed(1)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Approval Level</p>
              <p className="font-bold text-slate-700 text-sm mt-1">{quote.required_approval_level}</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-6">
            <div className="bg-slate-50 px-4 py-3 border-b">
              <h2 className="font-semibold text-slate-700">Line Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-center">Qty</th>
                  <th className="px-4 py-2 text-right">Unit Price</th>
                  <th className="px-4 py-2 text-right">Discount</th>
                  <th className="px-4 py-2 text-right">Total</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quote.lines.map((l: any) => {
                  const p = products.find((prod: any) => prod.id === l.product_id);
                  const isOver = l.overage > 0;
                  const cycle = p?.billing_cycle || 'ONE_TIME';
                  return (
                    <tr key={l.id} className={isOver ? 'bg-red-50/40' : ''}>
                      <td className="px-4 py-3 font-medium text-slate-800">{p?.name || `Product #${l.product_id}`}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cycle === 'ONE_TIME' ? 'bg-slate-100 text-slate-600' : 'bg-purple-100 text-purple-700'}`}>
                          {cycle === 'ONE_TIME' ? 'One-time' : cycle.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{l.quantity}</td>
                      <td className="px-4 py-3 text-right">${l.unit_price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={isOver ? 'text-red-600 font-bold' : 'text-slate-600'}>{l.discount_given}%</span>
                        {isOver && <span className="block text-[10px] text-red-400">+{l.overage.toFixed(1)}pp over</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">${l.line_total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        {isDraft && <button onClick={() => handleRemoveLine(l.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>}
                      </td>
                    </tr>
                  );
                })}
                {quote.lines.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-400 italic">No items added yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Line Form */}
          {isDraft && (
            <form onSubmit={handleAddLine} className="bg-white p-4 border rounded-xl shadow-sm flex items-end gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-slate-600 block mb-1">Product</label>
                <select value={productId} onChange={e => setProductId(e.target.value)} required
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">— Select Product —</option>
                  {products.map((p: any) => <option key={p.id} value={p.id}>{p.name} (${p.base_price})</option>)}
                </select>
              </div>
              <div className="w-24">
                <label className="text-xs font-medium text-slate-600 block mb-1">Qty</label>
                <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="w-32">
                <label className="text-xs font-medium text-slate-600 block mb-1">Discount (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={discount} onChange={e => setDiscount(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Add Item</button>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l flex flex-col overflow-hidden">
          {/* Upsell */}
          {isDraft && recommendations.length > 0 && (
            <div className="border-b">
              <div className="px-4 py-3 bg-purple-50 flex items-center gap-2 border-b border-purple-100">
                <span className="text-purple-600">💡</span>
                <h3 className="font-semibold text-purple-900 text-sm">Deal Intelligence</h3>
              </div>
              <div className="p-4 max-h-60 overflow-y-auto space-y-3">
                {recommendations.map((r: any) => (
                  <div key={r.product_id} className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm relative">
                    {r.is_promoted && <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">PROMOTED</span>}
                    <p className="font-semibold text-slate-800 text-sm">{r.product_name}</p>
                    <p className="text-xs text-slate-500 mt-1">{r.reason}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs font-medium text-green-600">+${r.margin_delta_estimate} margin</span>
                      <button onClick={() => handleAddRecommendation(r.product_id)}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-200 font-medium">Add</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Copilot Feed */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-3 border-b bg-slate-50 text-slate-700 font-semibold text-sm flex items-center gap-2">
              <span>🤖</span> Event Feed
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {feed.map((evt: any) => (
                <div key={evt.id} className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    {evt.event_type === 'QUOTE_CREATED' ? '✨' :
                     evt.event_type.includes('APPROVAL') ? '✅' :
                     evt.event_type === 'DISCOUNT_THRESHOLD_CROSSED' ? '⚠️' : '📝'}
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">{evt.narration}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(evt.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {feed.length === 0 && <p className="text-xs text-slate-400 italic">No events yet.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Breakdown Drawer */}
      {isRiskDrawerOpen && (
        <RiskDrawer
          quoteId={quoteId}
          quote={quote}
          products={products}
          onClose={() => setIsRiskDrawerOpen(false)}
          onFixed={() => { loadData(); }}
        />
      )}
    </div>
  );
}
