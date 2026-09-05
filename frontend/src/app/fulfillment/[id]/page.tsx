'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

export default function FulfillmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: quoteId } = use(params);
  const router = useRouter();
  const [split, setSplit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    api.get(`/api/v1/quotes/${quoteId}/fulfillment-split`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => { setSplit(data); setLoading(false); })
      .catch(async (r) => {
        const err = r?.json ? await r.json() : { detail: 'Failed to load split' };
        setError(err.detail || 'Error loading fulfillment data');
        setLoading(false);
      });
  }, [quoteId]);

  async function handleAccept() {
    setAccepting(true);
    const resp = await api.post(`/api/v1/quotes/${quoteId}/accept-split`, {});
    if (resp.ok) {
      setAccepted(true);
      // Activate subscriptions
      await api.post(`/api/v1/quotes/${quoteId}/billing/activate-subscriptions`, {});
    } else {
      const err = await resp.json();
      setError(err.detail || 'Error accepting split');
    }
    setAccepting(false);
  }

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-400">Loading fulfillment data...</p></div>;

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl border shadow-sm text-center max-w-md">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-bold text-slate-800 mb-2">Cannot Load Fulfillment</p>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <Link href={`/quotes/${quoteId}`} className="text-blue-600 text-sm hover:underline">← Back to Quote</Link>
      </div>
    </div>
  );

  if (accepted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl border shadow-lg text-center max-w-md">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Fulfillment Confirmed!</h1>
        <p className="text-slate-500 mb-6">The warehouse split has been accepted and the order is now in fulfillment.</p>
        <div className="flex gap-3 justify-center">
          <Link href={`/billing/${quoteId}`} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700">
            View Billing →
          </Link>
          <Link href="/quotes" className="border px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50">
            Back to Quotes
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4 shadow-sm">
        <Link href={`/quotes/${quoteId}`} className="text-blue-600 text-sm hover:underline">← Back to Quote</Link>
        <h1 className="text-lg font-bold text-slate-800">Warehouse Fulfillment Split</h1>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">Quote #{quoteId}</span>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Summary Bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Shipments</p>
            <p className="text-3xl font-bold text-slate-800">{split.total_shipments}</p>
          </div>
          <div className={`border rounded-xl p-4 text-center shadow-sm ${split.total_backorder_items > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Backorder Items</p>
            <p className={`text-3xl font-bold ${split.total_backorder_items > 0 ? 'text-amber-700' : 'text-green-700'}`}>
              {split.total_backorder_items}
            </p>
          </div>
          <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Lines</p>
            <p className="text-3xl font-bold text-slate-800">{split.lines.length}</p>
          </div>
        </div>

        {/* Split Reasoning */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Split Reasoning</p>
          <p className="text-sm text-blue-900">{split.split_reasoning}</p>
        </div>

        {/* Per-line allocations */}
        <div className="space-y-4">
          {split.lines.map((line: any) => (
            <div key={line.line_id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">{line.product_name}</h3>
                <span className="text-sm text-slate-500">Qty Required: <strong className="text-slate-800">{line.qty_required}</strong></span>
              </div>
              <div className="p-5">
                {/* Warehouse chips */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {line.allocations.length > 0 ? line.allocations.map((alloc: any) => (
                    <div key={alloc.warehouse_id} className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
                      <span className="text-indigo-600">🏭</span>
                      <div>
                        <p className="text-sm font-semibold text-indigo-900">{alloc.warehouse_name}</p>
                        <p className="text-xs text-indigo-600">{alloc.qty_allocated} units · {alloc.stock_available} in stock</p>
                      </div>
                    </div>
                  )) : (
                    <span className="text-sm text-slate-400 italic">No warehouse stock available</span>
                  )}
                </div>

                {/* Backorder warning */}
                {line.backorder_qty > 0 && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800">
                    <span>⚠️</span>
                    <span><strong>{line.backorder_qty} units</strong> on backorder — estimated <strong>{line.backorder_eta_days} days</strong> delivery</span>
                  </div>
                )}

                {line.allocations.length === 0 && line.backorder_qty === line.qty_required && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-800 mt-2">
                    <span>❌</span>
                    <span>All {line.qty_required} units are on backorder (no stock available).</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {accepting ? 'Confirming...' : '✅ Accept Suggested Split'}
          </button>
          <Link href={`/quotes/${quoteId}`} className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold text-base text-center hover:bg-slate-50 transition">
            ← Back to Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
