'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';

const PORTAL_API = 'http://localhost:8000/api/v1';

const STATUS_PILL: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-600',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  SENT: 'bg-blue-100 text-blue-700',
  UNDER_NEGOTIATION: 'bg-purple-100 text-purple-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
};

const STATUS_LABEL: Record<string, string> = {
  SENT: 'Sent',
  APPROVED: 'Sent',
  UNDER_NEGOTIATION: 'Under Negotiation',
  CONFIRMED: 'Confirmed',
  PENDING_APPROVAL: 'Under Review',
};

export default function PortalQuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();

  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [lineDiscounts, setLineDiscounts] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const customerName = typeof window !== 'undefined' ? localStorage.getItem('portal_customer') || 'Customer' : 'Customer';

  useEffect(() => {
    const portalToken = typeof window !== 'undefined' ? localStorage.getItem('portal_token') : null;
    if (!portalToken) { router.push('/portal/login'); return; }
    loadQuote();
  }, [token]);

  async function loadQuote() {
    const resp = await fetch(`${PORTAL_API}/portal/quotes/${token}`);
    if (resp.ok) {
      const data = await resp.json();
      setQuote(data);
      // Initialize discounts to current discount
      const init: Record<number, number> = {};
      data.lines.forEach((l: any) => { init[l.line_id] = l.discount_pct; });
      setLineDiscounts(init);
    } else {
      setError('This proposal link is invalid or has expired.');
    }
    setLoading(false);
  }

  async function handleSubmitCounter() {
    setSubmitting(true);
    const line_counters = Object.entries(lineDiscounts).map(([line_id, requested_discount]) => ({
      line_id: parseInt(line_id),
      requested_discount: Number(requested_discount),
    }));

    const resp = await fetch(`${PORTAL_API}/portal/quotes/${token}/counter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portal_token: token, message, line_counters }),
    });

    if (resp.ok) {
      setSubmitted(true);
      loadQuote();
    } else {
      const err = await resp.json();
      setError(err.detail || 'Submission failed');
    }
    setSubmitting(false);
  }

  async function handleConfirm() {
    setConfirming(true);
    const resp = await fetch(`${PORTAL_API}/portal/quotes/${token}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (resp.ok) {
      setConfirmed(true);
      loadQuote();
    }
    setConfirming(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-400">Loading your proposal...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-4xl mb-4">🔗</p>
        <h1 className="text-xl font-bold text-slate-800 mb-2">Link Invalid</h1>
        <p className="text-slate-500 text-sm">{error}</p>
        <button onClick={() => router.push('/portal/login')} className="mt-6 text-blue-600 text-sm hover:underline">Try another link →</button>
      </div>
    </div>
  );

  const statusLabel = STATUS_LABEL[quote.status] || quote.status;
  const statusClass = STATUS_PILL[quote.status] || 'bg-slate-100 text-slate-600';
  const isActionable = ['SENT', 'APPROVED', 'UNDER_NEGOTIATION'].includes(quote.status);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Portal Header — no sidebar, no internal nav */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">DF</div>
            <span className="font-bold text-slate-800 text-lg">DealFlow360</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusClass}`}>{statusLabel}</span>
            <span className="text-sm text-slate-600 font-medium">{customerName}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Proposal header */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Commercial Proposal</p>
          <h1 className="text-3xl font-bold text-slate-900">Proposal for {quote.customer_name}</h1>
          <p className="text-slate-500 mt-1">Reference: DF-{String(quote.quote_id).padStart(5, '0')}</p>
        </div>

        {/* Success Messages */}
        {submitted && !confirmed && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <p className="text-2xl mb-2">📨</p>
            <p className="font-bold text-blue-800 text-lg mb-1">Counter Offer Received</p>
            <p className="text-blue-700 text-sm">Your request has been received. The sales team will respond shortly.</p>
          </div>
        )}
        {confirmed && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-bold text-emerald-800 text-lg mb-1">Order Confirmed!</p>
            <p className="text-emerald-700 text-sm">Thank you for your business. Our team will be in touch shortly.</p>
          </div>
        )}

        {/* Quote Lines Table */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Proposal Details</h2>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 text-left">Product / Service</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-right">Unit Price</th>
                  <th className="px-6 py-4 text-right">Line Total</th>
                  <th className="px-6 py-4 text-center">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quote.lines.map((l: any) => (
                  <tr key={l.line_id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-800">{l.product_name}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{l.quantity}</td>
                    <td className="px-6 py-4 text-right text-slate-700">${l.unit_price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">${l.line_total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.billing_cycle === 'ONE_TIME' ? 'bg-slate-100 text-slate-600' : 'bg-purple-100 text-purple-700'}`}>
                        {l.billing_cycle === 'ONE_TIME' ? 'One-time' : l.billing_cycle.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Totals */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">One-Time Total</p>
            <p className="text-3xl font-bold text-slate-900">${quote.one_time_total.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-1">Billed once upon order confirmation</p>
          </div>
          {quote.recurring_monthly_total > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-purple-600 mb-1">Monthly Recurring</p>
              <p className="text-3xl font-bold text-purple-900">${quote.recurring_monthly_total.toFixed(2)}<span className="text-sm font-normal">/mo</span></p>
              <p className="text-xs text-purple-400 mt-1">Billed on a recurring schedule</p>
            </div>
          )}
        </section>

        {/* Negotiation Section */}
        {isActionable && !submitted && !confirmed && (
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50">
              <h2 className="font-bold text-slate-800">Negotiate Terms</h2>
              <p className="text-xs text-slate-500 mt-0.5">Request adjusted pricing per line, or accept these terms as-is.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message to Sales Team</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Explain your request or ask questions..."
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Requested Discounts (%)</label>
                <div className="space-y-2">
                  {quote.lines.map((l: any) => (
                    <div key={l.line_id} className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-3">
                      <span className="flex-1 text-sm font-medium text-slate-800">{l.product_name}</span>
                      <span className="text-sm text-slate-500 w-24 text-right">Current: {l.discount_pct}%</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={lineDiscounts[l.line_id] ?? l.discount_pct}
                        onChange={e => setLineDiscounts(prev => ({ ...prev, [l.line_id]: parseFloat(e.target.value) }))}
                        className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmitCounter}
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : '📤 Submit Counter Offer'}
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {confirming ? 'Confirming...' : '✅ Accept These Terms'}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-10 py-6 text-center">
        <p className="text-xs text-slate-400">DealFlow360 · Customer Proposal Portal · Confidential</p>
      </footer>
    </div>
  );
}
