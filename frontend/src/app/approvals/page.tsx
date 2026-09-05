'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

export default function ApprovalsPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [comment, setComment] = useState('');
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
    if ((action === 'REJECT' || action === 'RETURN') && !comment) {
      setMsg(`Please provide a comment for ${action.toLowerCase()}`);
      return;
    }
    setMsg('');
    const resp = await api.post(`/api/v1/approvals/${quoteId}/action`, { action, comment });
    if (resp.ok) {
      setComment('');
      loadData();
    } else {
      const err = await resp.json();
      setMsg(err.detail || 'Error processing action');
    }
  }

  const isApprover = user && ['ADMIN', 'SALES_MANAGER', 'FINANCE'].includes(user.role);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="text-blue-600 text-sm">← Dashboard</Link>
        <h1 className="text-lg font-bold text-gray-800">Approvals Queue</h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">
        {!isApprover && (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded mb-6 border border-yellow-200">
            You do not have approval authority (Current role: {user?.role}). This page is for Managers and Finance.
          </div>
        )}

        {msg && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm border border-red-100">{msg}</div>}

        <div className="space-y-6">
          {quotes.map(q => (
            <div key={q.id} className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">Quote #{q.id}</h2>
                  <p className="text-sm text-gray-500">Sales Rep ID: {q.sales_rep_id} · Customer ID: {q.customer_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-800">${q.total_amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Total Amount</p>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Blended Risk</p>
                  <p className={`text-xl font-bold ${q.blended_risk_score >= 50 ? 'text-red-600' : q.blended_risk_score >= 25 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {q.blended_risk_score.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Margin</p>
                  <p className="text-xl font-bold text-gray-700">{q.margin_pct.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Required Level</p>
                  <p className="font-semibold text-gray-800">{q.required_approval_level}</p>
                </div>
                <div className="flex flex-col justify-center">
                   <Link href={`/quotes/${q.id}`} className="text-blue-600 hover:underline text-sm font-medium">View Full Details →</Link>
                </div>
              </div>

              {isApprover && (
                <div className="bg-gray-50 border-t px-6 py-4 flex items-center gap-4">
                  <input 
                    type="text" 
                    placeholder="Add comment (required for reject/return)..." 
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button onClick={() => handleAction(q.id, 'APPROVE')} className="bg-green-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-700 transition">Approve</button>
                  <button onClick={() => handleAction(q.id, 'RETURN')} className="bg-yellow-500 text-white px-6 py-2 rounded text-sm font-medium hover:bg-yellow-600 transition">Return to Rep</button>
                  <button onClick={() => handleAction(q.id, 'REJECT')} className="bg-red-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-red-700 transition">Reject</button>
                </div>
              )}
            </div>
          ))}

          {quotes.length === 0 && (
            <div className="bg-white border rounded-lg p-12 text-center">
              <span className="text-4xl block mb-4">🎉</span>
              <h3 className="text-lg font-medium text-gray-800">Inbox Zero!</h3>
              <p className="text-gray-500 mt-1">There are no quotes pending approval right now.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
