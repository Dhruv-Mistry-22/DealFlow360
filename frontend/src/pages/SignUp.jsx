import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function SignUp() {
  const { navigate, login, addToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SALES_REP'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await api.post('/api/v1/auth/register', {
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        role: formData.role
      });
      
      // Auto-login after registration
      const loginData = await api.post('/api/v1/auth/login', {
        email: formData.email,
        password: formData.password
      });

      login(loginData.access_token, loginData.user);
    } catch (error) {
      addToast('Sign Up Failed', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center font-sans antialiased text-slate-100 selection:bg-brand-orange selection:text-white relative bg-slate-950"
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
          <h2 className="text-2xl font-bold text-white mb-2">Request Access</h2>
          <p className="text-sm text-slate-400">Create an account to access the CPQ platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Full Name</label>
            <input
              type="text" name="name"
              value={formData.name} onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
              placeholder="John Doe" required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email" name="email"
              value={formData.email} onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
              placeholder="name@company.com" required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Role Request</label>
            <select
              name="role" value={formData.role} onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all appearance-none"
            >
              <option value="SALES_REP">Sales Representative</option>
              <option value="SALES_MANAGER">Sales Manager</option>
              <option value="FINANCE">Finance</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password" name="password"
              value={formData.password} onChange={handleChange}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
              placeholder="••••••••" required
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full mt-4 bg-brand-orange hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-brand-orange/20 transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-lg">autorenew</span> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button onClick={() => navigate('signin')} className="text-brand-orange font-medium hover:underline">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
