'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

export default function DealHealthPage() {
  const router = useRouter();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    Promise.all([
      api.get('/api/v1/dashboard/deal-health').then(r => r.ok ? r.json() : null),
      api.get('/api/v1/auth/me').then(r => r.ok ? r.json() : null),
    ]).then(([h, u]) => {
      setHealth(h);
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-400">Loading deal health...</p>
    </div>
  );

  if (!health) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-red-500">Failed to load deal health data.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4 shadow-sm">
        <Link href="/dashboard" className="text-blue-600 text-sm hover:underline">← Dashboard</Link>
        <h1 className="text-lg font-bold text-slate-800">Deal Health Dashboard</h1>
        {user && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{user.role}</span>}
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`bg-white border rounded-2xl p-6 shadow-sm text-center ${health.summary.total_stalled > 0 ? 'border-red-200' : ''}`}>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Stalled Deals</p>
            <div className="flex items-center justify-center gap-2">
              <p className={`text-4xl font-black ${health.summary.total_stalled > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                {health.summary.total_stalled}
              </p>
              {health.summary.total_stalled > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">!</span>}
            </div>
          </div>
          <div className={`bg-white border rounded-2xl p-6 shadow-sm text-center ${health.summary.total_anomalies > 0 ? 'border-amber-200' : ''}`}>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Discount Anomalies</p>
            <div className="flex items-center justify-center gap-2">
              <p className={`text-4xl font-black ${health.summary.total_anomalies > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                {health.summary.total_anomalies}
              </p>
              {health.summary.total_anomalies > 0 && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">!</span>}
            </div>
          </div>
          <div className="bg-white border rounded-2xl p-6 shadow-sm text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Pending Approvals</p>
            <p className="text-4xl font-black text-slate-800">{health.summary.total_pending}</p>
          </div>
        </div>

        {/* Stalled Deals */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-red-500">🔴</span> Stalled Deals
          </h2>
          {health.stalled_deals.length === 0 ? (
            <div className="bg-white border border-green-200 rounded-xl p-5 text-center">
              <span className="text-green-500 text-lg">✅</span>
              <p className="text-slate-500 text-sm mt-1">No stalled deals — great work!</p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-right">Deal Value</th>
                    <th className="px-4 py-3 text-center">Days Stalled</th>
                    <th className="px-4 py-3 text-center">Stuck At</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {health.stalled_deals.map((deal: any) => (
                    <tr key={deal.quote_id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{deal.customer_name}</td>
                      <td className="px-4 py-3 text-right">${deal.deal_value.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-red-600 font-bold">{deal.days_stalled.toFixed(1)}d</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{deal.stuck_at_role}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/quotes/${deal.quote_id}`} className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-medium">
                          Open Deal →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Discount Anomalies */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-amber-500">⚠️</span> Discount Anomalies
          </h2>
          {health.discount_anomalies.length === 0 ? (
            <div className="bg-white border border-green-200 rounded-xl p-5 text-center">
              <span className="text-green-500 text-lg">✅</span>
              <p className="text-slate-500 text-sm mt-1">No discount anomalies detected.</p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Rep</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-right">Rep Avg</th>
                    <th className="px-4 py-3 text-right">This Quote</th>
                    <th className="px-4 py-3 text-right">Delta</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {health.discount_anomalies.map((anomaly: any) => (
                    <tr key={anomaly.quote_id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{anomaly.rep_name}</td>
                      <td className="px-4 py-3 text-slate-600">{anomaly.customer_name}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{anomaly.rep_90day_avg_discount}%</td>
                      <td className="px-4 py-3 text-right font-semibold text-amber-700">{anomaly.this_quote_discount}%</td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">+{anomaly.delta}pp</td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/quotes/${anomaly.quote_id}`} className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-medium">
                          Review →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Pending Approvals */}
        <section>
          <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-blue-500">⏳</span> Pending Approvals
          </h2>
          {health.pending_approvals.length === 0 ? (
            <div className="bg-white border border-green-200 rounded-xl p-5 text-center">
              <span className="text-green-500 text-lg">✅</span>
              <p className="text-slate-500 text-sm mt-1">No pending approvals.</p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-right">Deal Value</th>
                    <th className="px-4 py-3 text-center">Waiting</th>
                    <th className="px-4 py-3 text-center">Role Needed</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {health.pending_approvals.map((pending: any) => (
                    <tr key={pending.quote_id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{pending.customer_name}</td>
                      <td className="px-4 py-3 text-right">${pending.deal_value.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-semibold ${pending.waiting_since_hours > 4 ? 'text-red-600' : 'text-amber-600'}`}>
                          {pending.waiting_since_hours.toFixed(1)}h
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{pending.required_role}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link href="/approvals" className="text-xs text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-medium">
                          Go to Approval →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
