'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const resp = await api.post('/api/v1/auth/login', { email, password });
    if (resp.ok) {
      const data = await resp.json();
      setToken(data.access_token);
      router.push('/dashboard');
    } else {
      const err = await resp.json();
      setError(err.detail || 'Login failed');
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">DealFlow360</h1>
        <p className="text-gray-500 mb-6 text-sm">Sales Operations Platform — Login</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              required className="w-full border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
              required className="w-full border rounded px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button id="login-btn" type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium">
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-500">
          <p className="font-semibold mb-1">Test Credentials:</p>
          <p>Admin: admin@dealflow360.com / Admin@123</p>
          <p>Sales Rep: sales@dealflow360.com / Sales@123</p>
          <p>Manager: manager@dealflow360.com / Manager@123</p>
          <p>Finance: finance@dealflow360.com / Finance@123</p>
        </div>
      </div>
    </main>
  );
}
