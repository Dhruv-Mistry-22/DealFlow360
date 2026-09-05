'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, clearToken, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

interface Stats {
  quotes: number;
  pending_approvals: number;
  products: number;
  customers: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [feed, setFeed] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    loadData();
  }, []);

  async function loadData() {
    const [meResp, quotesResp, productsResp, customersResp] = await Promise.all([
      api.get('/api/v1/auth/me'),
      api.get('/api/v1/quotes'),
      api.get('/api/v1/products'),
      api.get('/api/v1/customers'),
    ]);
    if (meResp.ok) setUser(await meResp.json());
    const quotes = quotesResp.ok ? await quotesResp.json() : [];
    const products = productsResp.ok ? await productsResp.json() : [];
    const customers = customersResp.ok ? await customersResp.json() : [];
    const pending = quotes.filter((q: any) => q.status === 'PENDING_APPROVAL').length;
    setStats({ quotes: quotes.length, pending_approvals: pending, products: products.length, customers: customers.length });
  }

  const navItems = [
    { href: '/quotes', label: 'Quotes', emoji: '📄' },
    { href: '/products', label: 'Products', emoji: '📦' },
    { href: '/customers', label: 'Customers', emoji: '👥' },
    { href: '/approvals', label: 'Approvals', emoji: '✅' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-blue-700">DealFlow360</h1>
          <p className="text-xs text-gray-500">Intelligent Sales Operations</p>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-gray-600">{user.full_name || user.email} · <span className="text-blue-600 font-medium">{user.role}</span></span>}
          <button onClick={() => { clearToken(); router.push('/login'); }}
            className="text-sm text-gray-500 hover:text-red-500">Logout</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Quotes', value: stats.quotes, color: 'bg-blue-50 border-blue-200' },
              { label: 'Pending Approvals', value: stats.pending_approvals, color: 'bg-yellow-50 border-yellow-200' },
              { label: 'Products', value: stats.products, color: 'bg-green-50 border-green-200' },
              { label: 'Customers', value: stats.customers, color: 'bg-purple-50 border-purple-200' },
            ].map(s => (
              <div key={s.label} className={`border rounded-lg p-4 ${s.color}`}>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className="bg-white border rounded-lg p-6 flex flex-col items-center hover:shadow-md transition text-center">
              <span className="text-4xl mb-2">{item.emoji}</span>
              <span className="font-medium text-gray-700">{item.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
