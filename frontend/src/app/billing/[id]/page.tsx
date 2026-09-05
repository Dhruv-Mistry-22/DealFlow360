'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

export default function BillingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: quoteId } = use(params);
  const router = useRouter();
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelModal, setCancelModal] = useState<any>(null);
  const [cancelResult, setCancelResult] = useState<any>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    loadBilling();
  }, [quoteId]);

  async function loadBilling() {
    const resp = await api.get(`/api/v1/quotes/${quoteId}/billing`);
    if (resp.ok) {
      setBilling(await resp.json());
    } else {
      const err = await resp.json();
      setError(err.detail || 'Cannot load billing for this quote');
    }
    setLoading(false);
  }

  async function handleCancel(productId: number) {
    setCancelling(true);
    const resp = await api.post(`/api/v1/quotes/${quoteId}/billing/cancel/${productId}`, {});
    if (resp.ok) {
      const data = await resp.json();
      setCancelResult(data);
      setCancelModal(null);
      loadBilling();
    }
    setCancelling(false);
  }

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-400">Loading billing...</p></div>;
  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl border shadow-sm text-center max-w-md">
        <p className="text-3xl mb-3">💳</p>
        <p className="text-slate-600 text-sm">{error}</p>
        <Link href={`/quotes/${quoteId}`} className="text-blue-600 text-sm mt-4 block hover:underline">← Back to Quote</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4 shadow-sm">
        <Link href={`/quotes/${quoteId}`} className="text-blue-600 text-sm hover:underline">← Quote #{quoteId}</Link>
        <h1 className="text-lg font-bold text-slate-800">Billing & Subscriptions</h1>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {cancelResult && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
            ✅ {cancelResult.message}
          </div>
        )}

        {/* Section 1 — One-Time Charges */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">💳</span>
            <h2 className="text-lg font-bold text-slate-800">One-Time Charges</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">Single invoice</span>
          </div>
          {billing.one_time_lines.length === 0 ? (
            <p className="text-slate-400 italic text-sm">No one-time charges on this quote.</p>
          ) : (
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Unit Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {billing.one_time_lines.map((line: any, i: number) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium text-slate-800">{line.product_name}</td>
                      <td className="px-4 py-3 text-center">{line.quantity}</td>
                      <td className="px-4 py-3 text-right">${line.unit_price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold">${line.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Pending</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t bg-slate-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 font-bold text-slate-700">Total One-Time</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800 text-base">${billing.one_time_total.toFixed(2)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>

        {/* Section 2 — Recurring Charges */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">🔄</span>
            <h2 className="text-lg font-bold text-slate-800">Recurring Subscriptions</h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Monthly: ${billing.recurring_monthly_total.toFixed(2)}</span>
          </div>
          {billing.recurring_lines.length === 0 ? (
            <p className="text-slate-400 italic text-sm">No subscription lines on this quote.</p>
          ) : (
            <div className="space-y-4">
              {billing.recurring_lines.map((line: any) => (
                <div key={line.product_id} className={`bg-white border rounded-xl shadow-sm overflow-hidden ${line.status === 'CANCELLED' ? 'opacity-60' : ''}`}>
                  <div className="px-5 py-3 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-800">{line.product_name}</span>
                      <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-medium">{line.plan}</span>
                      {line.status === 'CANCELLED' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Cancelled</span>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">${line.monthly_amount.toFixed(2)}<span className="text-xs text-slate-400">/mo</span></p>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-4">
                    {/* First invoice */}
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-2">First Invoice</p>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xl font-bold text-slate-800">${line.first_invoice_amount.toFixed(2)}</p>
                        {line.is_prorated && (
                          <p className="text-xs text-amber-600 mt-1">⚡ Prorated ({(line.proration_factor * 100).toFixed(0)}% of cycle)</p>
                        )}
                      </div>
                    </div>
                    {/* Next billing dates */}
                    <div>
                      <p className="text-xs text-slate-500 font-medium mb-2">Upcoming Billing</p>
                      <div className="space-y-1">
                        {line.next_billing_dates.map((d: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs bg-slate-50 rounded px-2 py-1">
                            <span className="text-slate-600">{d.date}</span>
                            <span className="font-semibold text-slate-800">${d.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {line.status !== 'CANCELLED' && (
                    <div className="px-5 pb-4">
                      <button
                        onClick={() => setCancelModal(line)}
                        className="text-xs text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="font-bold text-lg text-slate-800 mb-2">Cancel Subscription?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to cancel <strong>{cancelModal.product_name}</strong>?
              You will receive a prorated credit for the remaining days in the current billing cycle.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleCancel(cancelModal.product_id)}
                disabled={cancelling}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
              <button onClick={() => setCancelModal(null)} className="flex-1 border py-2.5 rounded-lg text-slate-600 hover:bg-slate-50">
                Keep Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
