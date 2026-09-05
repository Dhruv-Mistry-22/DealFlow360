'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', tier: 'STANDARD', currency: 'USD' });
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    load();
  }, []);

  async function load() {
    const resp = await api.get('/api/v1/customers');
    if (resp.ok) setCustomers(await resp.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const resp = await api.post('/api/v1/customers', form);
    if (resp.ok) { setMsg('Customer created!'); setShowForm(false); load(); }
    else { const err = await resp.json(); setMsg(err.detail || 'Error'); }
  }

  const tierColor: Record<string, string> = {
    STANDARD: 'bg-gray-100 text-gray-700',
    GOLD: 'bg-yellow-100 text-yellow-700',
    PLATINUM: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="text-blue-600 text-sm">← Dashboard</Link>
        <h1 className="text-lg font-bold text-gray-800">Customers</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
          + New Customer
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6">
        {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded text-sm">{msg}</div>}

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
            <h2 className="col-span-2 font-semibold text-gray-700">New Customer</h2>
            {['name', 'email', 'phone', 'company'].map(field => (
              <div key={field}>
                <label className="text-xs font-medium text-gray-600 capitalize">{field}</label>
                <input value={(form as any)[field]} onChange={e => setForm({...form, [field]: e.target.value})}
                  required={field === 'name' || field === 'email'}
                  className="w-full border rounded px-2 py-1 text-sm mt-0.5" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-gray-600">Tier</label>
              <select value={form.tier} onChange={e => setForm({...form, tier: e.target.value})}
                className="w-full border rounded px-2 py-1 text-sm mt-0.5">
                <option>STANDARD</option><option>GOLD</option><option>PLATINUM</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Currency</label>
              <input value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}
                className="w-full border rounded px-2 py-1 text-sm mt-0.5" />
            </div>
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-1.5 rounded text-sm">Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>{['ID', 'Name', 'Email', 'Company', 'Tier', 'Currency'].map(h => <th key={h} className="px-4 py-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-400">{c.id}</td>
                  <td className="px-4 py-2 font-medium">{c.name}</td>
                  <td className="px-4 py-2 text-gray-500">{c.email}</td>
                  <td className="px-4 py-2 text-gray-500">{c.company || '—'}</td>
                  <td className="px-4 py-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${tierColor[c.tier]}`}>{c.tier}</span></td>
                  <td className="px-4 py-2 text-gray-500">{c.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && <p className="p-6 text-gray-400 text-center text-sm">No customers yet.</p>}
        </div>
      </main>
    </div>
  );
}
