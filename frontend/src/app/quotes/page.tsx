'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  SENT: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-purple-100 text-purple-700',
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    load();
  }, []);

  async function load() {
    const [qr, cr] = await Promise.all([api.get('/api/v1/quotes'), api.get('/api/v1/customers')]);
    if (qr.ok) setQuotes(await qr.json());
    if (cr.ok) setCustomers(await cr.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const resp = await api.post('/api/v1/quotes', { customer_id: parseInt(customerId), notes });
    if (resp.ok) {
      const q = await resp.json();
      router.push(`/quotes/${q.id}`);
    } else {
      const err = await resp.json(); setMsg(err.detail || 'Error');
    }
  }

  const riskColor = (score: number) => score >= 50 ? 'text-red-600' : score >= 25 ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="text-blue-600 text-sm">← Dashboard</Link>
        <h1 className="text-lg font-bold text-gray-800">Quotes</h1>
        <button onClick={() => setCreating(!creating)}
          className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
          + New Quote
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        {msg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{msg}</div>}

        {creating && (
          <form onSubmit={handleCreate} className="bg-white border rounded-lg p-5 mb-6 flex flex-col gap-3">
            <h2 className="font-semibold text-gray-700">New Quote</h2>
            <div>
              <label className="text-xs font-medium text-gray-600">Customer</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} required
                className="w-full border rounded px-2 py-1.5 text-sm mt-0.5">
                <option value="">— Select —</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.tier})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Notes (optional)</label>
              <input value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm mt-0.5" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm">Create</button>
              <button type="button" onClick={() => setCreating(false)} className="border px-4 py-1.5 rounded text-sm">Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>{['ID', 'Customer', 'Status', 'Total', 'Risk Score', 'Approval', 'Action'].map(h => <th key={h} className="px-4 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {quotes.map(q => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-400">{q.id}</td>
                  <td className="px-4 py-2 font-medium">{q.customer_id}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[q.status] || 'bg-gray-100'}`}>{q.status}</span>
                  </td>
                  <td className="px-4 py-2 font-mono">${(q.total_amount || 0).toFixed(2)}</td>
                  <td className={`px-4 py-2 font-bold ${riskColor(q.blended_risk_score)}`}>{q.blended_risk_score?.toFixed(1)}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{q.required_approval_level}</td>
                  <td className="px-4 py-2">
                    <Link href={`/quotes/${q.id}`} className="text-blue-600 hover:underline text-xs">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {quotes.length === 0 && <p className="p-6 text-gray-400 text-center text-sm">No quotes yet. Create your first one!</p>}
        </div>
      </main>
    </div>
  );
}
