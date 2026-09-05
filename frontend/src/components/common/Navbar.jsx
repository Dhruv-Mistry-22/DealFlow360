import React from 'react';
import { Layers, ShieldAlert, Truck, Repeat, Globe, UserCheck, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentRole, setCurrentRole }) {
  const navItems = [
    { id: 'workspace', label: 'Quote Workspace', icon: Layers },
    { id: 'dealhealth', label: 'Deal Health War Room', icon: ShieldAlert, badge: '3' },
    { id: 'fulfillment', label: 'Fulfillment Split', icon: Truck },
    { id: 'billing', label: 'Hybrid Billing', icon: Repeat },
    { id: 'portal', label: 'Customer Portal', icon: Globe, highlight: true }
  ];

  return (
    <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center font-black text-base tracking-tighter">
            DF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-950 text-sm tracking-tight">DealFlow360</span>
              <span className="text-[10px] font-mono uppercase bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200">
                Co-Pilot v1.0
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">Self-Governing Sales Operations</p>
          </div>
        </div>

        {/* Navigation Tabs (Minimal B&W) */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/60">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Persona Role Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1.5">
            <UserCheck className="w-3.5 h-3.5 text-neutral-700" />
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="bg-transparent text-xs font-semibold text-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="rep">Rep: J. Rao</option>
              <option value="manager">Manager: M. Shah</option>
              <option value="finance">Finance: R. Iyer</option>
              <option value="customer">Customer: Acme Corp</option>
            </select>
          </div>
        </div>

      </div>

      {/* Mobile Nav strip */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-100 px-2 py-1.5 bg-neutral-50 overflow-x-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1 text-xs font-semibold whitespace-nowrap rounded-md ${
              activeTab === item.id ? 'bg-black text-white' : 'text-neutral-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}