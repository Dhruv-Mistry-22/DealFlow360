import React, { useState } from 'react';
import { useDealContext, UserPersona } from '../../store/DealContext';
import { Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const S01_AuthGate: React.FC = () => {
  const { setActiveScreen, setActivePersona } = useDealContext();
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('j.rao@dealflow360.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveScreen('s02_dashboard');
  };

  const quickRoles: { role: UserPersona; name: string; email: string; target: any; desc: string }[] = [
    { role: 'Sales Rep', name: 'J. Rao', email: 'j.rao@dealflow360.com', target: 's04_builder', desc: 'Quotation Builder & Margin Engine' },
    { role: 'Sales Manager', name: 'M. Shah', email: 'm.shah@dealflow360.com', target: 's05_approvals', desc: 'Approvals & Deal Health War Room' },
    { role: 'Finance Approver', name: 'R. Iyer', email: 'r.iyer@dealflow360.com', target: 's06_approval_detail', desc: 'Level-2 Approvals & Billing' },
    { role: 'Customer', name: 'Sarah Jenkins', email: 'sarah@acmecorp.com', target: 's11_customer_portal', desc: 'Acme Corp Customer Portal' },
    { role: 'Admin', name: 'System Admin', email: 'admin@dealflow360.com', target: 's18_discount_setup', desc: 'Policy & Warehouse Config' }
  ];

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Card: Form */}
        <div className="md:col-span-7 bg-[#0D1322] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex border-b border-white/10 text-xs font-semibold mb-6">
            <button
              onClick={() => setAuthTab('login')}
              className={`pb-3 px-2 mr-6 ${authTab === 'login' ? 'text-white tab-active-indicator' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthTab('signup')}
              className={`pb-3 px-2 ${authTab === 'signup' ? 'text-white tab-active-indicator' : 'text-slate-400'}`}
            >
              Create Account
            </button>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mb-1">
            {authTab === 'login' ? 'Workstation Sign-In' : 'Join DealFlow360'}
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Access intelligent deal co-piloting, discount governance, and fulfillment operations.
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131B2E] border border-white/10 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-lg py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131B2E] border border-white/10 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-lg py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-[#131B2E] border-white/10 text-brand-orange focus:ring-brand-orange" />
                <span>Remember this terminal</span>
              </label>
              <a href="#" className="hover:text-brand-orange transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-lg bg-brand-orange hover:bg-brand-deepOrange text-white text-xs font-bold shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch DealFlow360</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Card: Quick Persona Access */}
        <div className="md:col-span-5 bg-[#0D1322]/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Judge Demo Personas</span>
          </div>

          <p className="text-xs text-slate-300">
            Click any role below to immediately log in with that profile's permissions:
          </p>

          <div className="space-y-2">
            {quickRoles.map((r) => (
              <button
                key={r.role}
                onClick={() => {
                  setActivePersona(r.role);
                  setEmail(r.email);
                  setActiveScreen(r.target);
                }}
                className="w-full p-3 rounded-xl bg-[#131B2E] hover:bg-[#1B253D] border border-white/10 hover:border-brand-orange/30 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
                    {r.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                    {r.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
