'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

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
    if (resp.ok) {
      loadData();
    } else {
      const err = await resp.json(); setMsg(err.detail || 'Submit error');
    }
  }

  async function handleAddRecommendation(recProductId: number) {
     const resp = await api.post(`/api/v1/quotes/${quoteId}/lines`, {
      product_id: recProductId,
      quantity: 1,
      discount_given: 0,
    });
    if (resp.ok) loadData();
  }

  if (!quote) return <div className="p-8">Loading...</div>;

  const isDraft = quote.status === 'DRAFT';
  const riskColor = quote.blended_risk_score >= 50 ? 'text-red-600 bg-red-50' : quote.blended_risk_score >= 25 ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <Link href="/quotes" className="text-blue-600 text-sm">← Back to Quotes</Link>
        <h1 className="text-lg font-bold text-gray-800">Quote #{quote.id}</h1>
        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium uppercase">{quote.status}</span>
        {isDraft && quote.lines.length > 0 && (
           <button onClick={handleSubmitApproval} className="ml-auto bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-700">
             Submit for Approval
           </button>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* MAIN EDITOR */}
        <div className="flex-1 overflow-y-auto p-6">
           {msg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm border border-red-100">{msg}</div>}
           
           {/* Financials & Risk Summary */}
           <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                 <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                 <p className="text-2xl font-bold text-gray-800">${quote.total_amount.toFixed(2)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                 <p className="text-xs text-gray-500 uppercase tracking-wide">Margin</p>
                 <p className="text-2xl font-bold text-gray-800">{quote.margin_pct.toFixed(1)}%</p>
              </div>
              <div className={`p-4 rounded-lg border shadow-sm text-center ${riskColor}`}>
                 <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Blended Risk</p>
                 <p className="text-3xl font-black">{quote.blended_risk_score.toFixed(1)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center flex flex-col justify-center">
                 <p className="text-xs text-gray-500 uppercase tracking-wide">Approval Required</p>
                 <p className="font-bold text-gray-700">{quote.required_approval_level}</p>
              </div>
           </div>

           {/* Line Items */}
           <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700">Line Items</h2>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-center">Qty</th>
                    <th className="px-4 py-2 text-right">Unit Price</th>
                    <th className="px-4 py-2 text-right">Discount</th>
                    <th className="px-4 py-2 text-right">Total</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {quote.lines.map((l: any) => {
                    const p = products.find(prod => prod.id === l.product_id);
                    const overage = l.overage > 0;
                    return (
                      <tr key={l.id} className={overage ? "bg-red-50/30" : ""}>
                        <td className="px-4 py-3 font-medium text-gray-800">{p?.name || `Product #${l.product_id}`}</td>
                        <td className="px-4 py-3 text-center">{l.quantity}</td>
                        <td className="px-4 py-3 text-right">${l.unit_price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-red-600 font-medium">
                          {l.discount_given}%
                          {overage && <span className="block text-[10px] text-red-500">+{l.overage}% overage</span>}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">${l.line_total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                           {isDraft && (
                             <button onClick={() => handleRemoveLine(l.id)} className="text-red-500 hover:text-red-700 text-xs">Remove</button>
                           )}
                        </td>
                      </tr>
                    );
                  })}
                  {quote.lines.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No items added yet.</td></tr>}
                </tbody>
              </table>
           </div>

           {/* Add Line Form */}
           {isDraft && (
             <form onSubmit={handleAddLine} className="bg-white p-4 border rounded-lg shadow-sm flex items-end gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Product</label>
                  <select value={productId} onChange={e => setProductId(e.target.value)} required className="w-full border rounded px-3 py-2 text-sm bg-gray-50">
                    <option value="">— Select Product —</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.base_price})</option>)}
                  </select>
                </div>
                <div className="w-24">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Qty</label>
                  <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} required className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div className="w-32">
                  <label className="text-xs font-medium text-gray-600 block mb-1">Discount (%)</label>
                  <input type="number" min="0" max="100" step="0.1" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700">Add Item</button>
             </form>
           )}

        </div>

        {/* SIDEBAR: Copilot & Upsell */}
        <div className="w-80 bg-white border-l flex flex-col overflow-hidden">
           
           {/* UPSELL RECOMMENDATIONS */}
           {isDraft && recommendations.length > 0 && (
             <div className="border-b">
                <div className="px-4 py-3 bg-purple-50 flex items-center gap-2 border-b border-purple-100">
                   <span className="text-purple-600 text-xl">💡</span>
                   <h3 className="font-semibold text-purple-900 text-sm">Deal Intelligence</h3>
                </div>
                <div className="p-4 max-h-60 overflow-y-auto space-y-3 bg-purple-50/30">
                  {recommendations.map(r => (
                    <div key={r.product_id} className="bg-white p-3 rounded border border-purple-100 shadow-sm relative">
                       {r.is_promoted && <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">PROMOTED</span>}
                       <p className="font-semibold text-gray-800 text-sm">{r.product_name}</p>
                       <p className="text-xs text-gray-500 mt-1">{r.reason}</p>
                       <div className="mt-3 flex justify-between items-center">
                         <span className="text-xs font-medium text-green-600">+${r.margin_delta_estimate} est. margin</span>
                         <button onClick={() => handleAddRecommendation(r.product_id)} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 font-medium">Add</button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* COPILOT FEED */}
           <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50">
             <div className="px-4 py-3 border-b bg-gray-100 text-gray-700 font-semibold text-sm flex items-center gap-2">
               <span>🤖</span> Copilot Event Feed
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {feed.map(evt => (
                  <div key={evt.id} className="flex gap-3">
                     <div className="flex-shrink-0 mt-0.5">
                       {evt.event_type === 'QUOTE_CREATED' ? '✨' : 
                        evt.event_type.includes('APPROVAL') ? '✅' :
                        evt.event_type === 'DISCOUNT_THRESHOLD_CROSSED' ? '⚠️' : '📝'}
                     </div>
                     <div>
                       <p className="text-sm text-gray-700">{evt.narration}</p>
                       <p className="text-[10px] text-gray-400 mt-1">{new Date(evt.created_at).toLocaleString()}</p>
                     </div>
                  </div>
                ))}
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
