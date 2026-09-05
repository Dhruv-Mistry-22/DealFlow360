'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, isLoggedIn } from '@/lib/api';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', category: 'HARDWARE', base_price: '', unit: 'each', tax_rate: '18', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    loadProducts();
  }, []);

  async function loadProducts() {
    const resp = await api.get('/api/v1/products');
    if (resp.ok) setProducts(await resp.json());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const resp = await api.post('/api/v1/products', {
      ...form, base_price: parseFloat(form.base_price), tax_rate: parseFloat(form.tax_rate)
    });
    if (resp.ok) {
      setMsg('Product created!'); setShowForm(false);
      loadProducts();
      setForm({ name: '', category: 'HARDWARE', base_price: '', unit: 'each', tax_rate: '18', description: '' });
    } else {
      const err = await resp.json(); setMsg(err.detail || 'Error creating product');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="text-blue-600 text-sm">← Dashboard</Link>
        <h1 className="text-lg font-bold text-gray-800">Products Catalog</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
          + New Product
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6">
        {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded text-sm">{msg}</div>}

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white border rounded-lg p-5 mb-6 grid grid-cols-2 gap-4">
            <h2 className="col-span-2 font-semibold text-gray-700">New Product</h2>
            {[
              { label: 'Name', key: 'name', type: 'text' },
              { label: 'Base Price ($)', key: 'base_price', type: 'number' },
              { label: 'Unit', key: 'unit', type: 'text' },
              { label: 'Tax Rate (%)', key: 'tax_rate', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-medium text-gray-600">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  required className="w-full border rounded px-2 py-1 text-sm mt-0.5" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-gray-600">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full border rounded px-2 py-1 text-sm mt-0.5">
                <option>HARDWARE</option><option>SERVICES</option><option>SUBSCRIPTION</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Description</label>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full border rounded px-2 py-1 text-sm mt-0.5" />
            </div>
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-1.5 rounded text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        )}

        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['ID', 'Name', 'Category', 'Base Price', 'Unit', 'Tax%', 'Active'].map(h => (
                  <th key={h} className="px-4 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-400">{p.id}</td>
                  <td className="px-4 py-2 font-medium">{p.name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      p.category === 'HARDWARE' ? 'bg-blue-100 text-blue-700' :
                      p.category === 'SERVICES' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'}`}>{p.category}</span>
                  </td>
                  <td className="px-4 py-2">${p.base_price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-500">{p.unit}</td>
                  <td className="px-4 py-2 text-gray-500">{p.tax_rate}%</td>
                  <td className="px-4 py-2">{p.is_active ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="p-6 text-gray-400 text-center text-sm">No products yet.</p>}
        </div>
      </main>
    </div>
  );
}
