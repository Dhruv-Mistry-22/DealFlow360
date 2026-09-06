import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function SignIn() {
  const { navigate, login, addToast } = useApp();
  const [email, setEmail] = useState('admin@dealflow360.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);

  const handleDemoClick = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post('/api/v1/auth/login', {
        email: email,
        password: password
      });

      // Backend returns { access_token, user }
      login(data.access_token, data.user);
    } catch (error) {
      addToast('Sign In Failed', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center font-sans antialiased text-slate-100 selection:bg-brand-orange selection:text-white relative bg-slate-950 pb-10"
      style={{
        backgroundImage: `linear-gradient(rgba(13, 19, 34, 0.8), rgba(13, 19, 34, 0.95)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_Jo9UK3jojRTpdK4i4orEwKR2UclkRFMFZ0V_vDOfNm1x5hkAWOATy8LYzj0DlwdrGDGFS26wYoPjHXeyxwk4e-IBhcFLeX3cc3Z0hwQMbpfD5ZaYPojmzw1Vn-tj45c4d8h9Zf2rKaK4dWaNb4RA_ic5er52VVjmaeNakMjoA66QQjtjYlytrDnzKaibT-WQqsGTCtyM2SyKhbXvtKAzn6s9LCHavgxC40f43uz4xTZv6inlHx4Dq7X-fgKJuiHxG2U")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-6 left-6 cursor-pointer" onClick={() => navigate('landing')}>
        <div className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-7 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <svg className="w-full h-full drop-shadow-md" fill="none" viewBox="0 0 44 38">
              <polygon fill="#ea580c" points="0,38 24,0 44,22"></polygon>
              <polygon fill="#f97316" points="12,38 24,18 36,38"></polygon>
              <polygon fill="#fb923c" opacity="0.9" points="24,0 44,22 18,34"></polygon>
              <polygon fill="#c2410c" points="0,38 18,34 6,18"></polygon>
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight flex items-baseline">
            <span className="text-white">DealFlow</span>
            <span className="text-brand-orange">360</span>
          </span>
        </div>
      </div>

      <div className="w-full max-w-md px-8 py-10 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-slate-400">Sign in to access your CPQ dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-brand-orange hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-brand-orange/20 transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-lg">autorenew</span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        {/* Helper Section for Judges */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider text-center">Quick Login (For Demo)</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleDemoClick('admin@dealflow360.com', 'Admin@123')} type="button" className="py-1.5 px-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300 transition-colors">
              Admin
            </button>
            <button onClick={() => handleDemoClick('sales@dealflow360.com', 'Sales@123')} type="button" className="py-1.5 px-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300 transition-colors">
              Sales Rep
            </button>
            <button onClick={() => handleDemoClick('manager@dealflow360.com', 'Manager@123')} type="button" className="py-1.5 px-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300 transition-colors">
              Manager
            </button>
            <button onClick={() => handleDemoClick('finance@dealflow360.com', 'Finance@123')} type="button" className="py-1.5 px-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300 transition-colors">
              Finance
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button onClick={() => navigate('signup')} className="text-brand-orange font-medium hover:underline">
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
}
