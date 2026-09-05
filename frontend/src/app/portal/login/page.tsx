'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const PORTAL_API = 'http://localhost:8000/api/v1';

function PortalLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const resp = await fetch(`${PORTAL_API}/portal/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, portal_token: token }),
    });

    if (resp.ok) {
      const data = await resp.json();
      localStorage.setItem('portal_token', token);
      localStorage.setItem('portal_customer', data.customer_name);
      router.push(`/portal/quotes/${token}`);
    } else {
      const err = await resp.json();
      setError(err.detail || 'Invalid email or access link.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-2xl font-black mb-4 shadow-lg">
            DF
          </div>
          <h1 className="text-2xl font-bold text-slate-900">DealFlow360</h1>
          <p className="text-slate-500 text-sm mt-1">Customer Proposal Portal</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Access Your Proposal</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your email and the access code from the link you received.</p>

          {error && (
            <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@yourcompany.com"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Access Code</label>
              <input
                type="text"
                value={token}
                onChange={e => setToken(e.target.value)}
                required
                placeholder="Paste your access code here"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
              <p className="text-xs text-slate-400 mt-1">This was included in your proposal email from the sales team.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Verifying...' : 'Access My Proposal →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Having trouble? Contact your sales representative.
        </p>
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-400">Loading...</div>}>
      <PortalLoginForm />
    </Suspense>
  );
}
