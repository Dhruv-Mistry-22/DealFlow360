import React, { useState } from 'react';
import { useDealContext, ScreenId, UserPersona } from '../../store/DealContext';
import { ShieldCheck, UserCheck, ChevronDown, Phone, ExternalLink } from 'lucide-react';

export const TopHeaderNav: React.FC = () => {
  const { activeScreen, setActiveScreen, activePersona, setActivePersona } = useDealContext();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const navItems: { id: ScreenId; label: string; tag?: string }[] = [
    { id: 's02_dashboard', label: 'Dashboard' },
    { id: 's03_quotations', label: 'Quotations' },
    { id: 's05_approvals', label: 'Approvals', tag: '3' },
    { id: 's07_fulfillment', label: 'Fulfillment' },
    { id: 's09_subscriptions', label: 'Subscriptions' },
    { id: 's12_invoices', label: 'Invoices' },
    { id: 's14_deal_health', label: 'Deal Health', tag: 'Alert' },
    { id: 's15_reports', label: 'Reports' },
    { id: 's16_products', label: 'Products' },
    { id: 's18_discount_setup', label: 'Discount Setup' }
  ];

  const personas: { role: UserPersona; name: string; targetScreen: ScreenId }[] = [
    { role: 'Sales Rep', name: 'J. Rao (Sales Rep)', targetScreen: 's04_builder' },
    { role: 'Sales Manager', name: 'M. Shah (Sales Manager)', targetScreen: 's05_approvals' },
    { role: 'Finance Approver', name: 'R. Iyer (Finance)', targetScreen: 's06_approval_detail' },
    { role: 'Customer', name: 'Sarah Jenkins (Acme Corp)', targetScreen: 's11_customer_portal' },
    { role: 'Admin', name: 'Administrator (Operations)', targetScreen: 's18_discount_setup' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D1322]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-2.5">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo matching harsh_code.html */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('landing')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="relative w-8 h-7 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg className="w-full h-full drop-shadow-md" fill="none" viewBox="0 0 44 38" xmlns="http://www.w3.org/2000/svg">
                <polygon fill="#ea580c" points="0,38 24,0 44,22" />
                <polygon fill="#f97316" points="12,38 24,18 36,38" />
                <polygon fill="#fb923c" opacity="0.9" points="24,0 44,22 18,34" />
                <polygon fill="#c2410c" points="0,38 18,34 6,18" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight flex items-baseline">
              <span className="text-white">DealFlow</span>
              <span className="text-brand-orange">360</span>
            </span>
          </button>

          <span className="hidden sm:inline-block h-4 w-[1px] bg-white/20 ml-2" />

          <button
            onClick={() => setActiveScreen('landing')}
            className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
              activeScreen === 'landing' ? 'text-brand-orange bg-brand-orange/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </button>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2 text-[13px] font-medium text-slate-300 overflow-x-auto">
          {navItems.map((item) => {
            const isActive =
              activeScreen === item.id ||
              (item.id === 's03_quotations' && activeScreen === 's04_builder') ||
              (item.id === 's05_approvals' && activeScreen === 's06_approval_detail') ||
              (item.id === 's07_fulfillment' && activeScreen === 's08_fulfillment_detail') ||
              (item.id === 's09_subscriptions' && activeScreen === 's10_billing_detail') ||
              (item.id === 's12_invoices' && activeScreen === 's13_invoice_detail') ||
              (item.id === 's16_products' && activeScreen === 's17_product_detail');

            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`relative px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/10 font-semibold shadow-sm border border-white/15'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {item.tag && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      item.tag === 'Alert'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30'
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Customer Portal & Persona Switcher */}
        <div className="flex items-center gap-3">
          {/* Customer Portal External Route */}
          <button
            onClick={() => setActiveScreen('s11_customer_portal')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              activeScreen === 's11_customer_portal'
                ? 'bg-telemetry-blue/20 text-telemetry-blue border-telemetry-blue/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-300 hover:text-white border-white/10 hover:border-white/20'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-telemetry-blue" />
            <span>Customer Portal</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-xs font-medium text-slate-200 transition-all shadow-inner"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-orange" />
              <span className="hidden sm:inline text-slate-400">Role:</span>
              <span className="font-semibold text-white">{activePersona}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0D1322] border border-white/15 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                <div className="px-3 py-1.5 border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>
                {personas.map((p) => (
                  <button
                    key={p.role}
                    onClick={() => {
                      setActivePersona(p.role);
                      setActiveScreen(p.targetScreen);
                      setShowPersonaMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                      activePersona === p.role ? 'text-brand-orange font-bold bg-brand-orange/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{p.name}</span>
                    {activePersona === p.role && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone pill from harsh_code.html */}
          <a
            href="tel:+911800123360"
            className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 border border-white/10 text-slate-300 text-xs font-medium"
          >
            <Phone className="w-3 h-3 text-brand-orange" />
            <span>+91 1800 123 360</span>
          </a>
        </div>
      </div>
    </header>
  );
};
