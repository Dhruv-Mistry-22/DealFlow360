import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function CommandPalette() {
  const { isSearchOpen, setIsSearchOpen, navigate, quotes, approvals } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const quickNav = [
    { title: 'Dashboard / Overview', page: 'overview', icon: 'space_dashboard', desc: 'Executive overview & policy rules' },
    { title: 'Quotations List', page: 'quotations', icon: 'request_quote', desc: 'All quotes & CPQ pricing' },
    { title: 'Approvals & Governance', page: 'approvals', icon: 'verified_user', desc: 'Deal governance & pending approvals' },
    { title: 'Fulfillment & Dispatches', page: 'fulfillment', icon: 'local_shipping', desc: 'Active dispatches & waybills' },
    { title: 'Invoices & Billing', page: 'invoices', icon: 'receipt_long', desc: 'Accounts receivable & billing' },
    { title: 'Customer Portal', page: 'customer-portal', icon: 'group', desc: 'Client account 360 & credit line' },
    { title: 'Product Catalog', page: 'products', icon: 'inventory_2', desc: 'Multi-modal freight catalog & SKUs' },
    { title: 'Deal Health & Risk', page: 'deal-health', icon: 'monitoring', desc: 'Margin telemetry & risk matrix' },
    { title: 'Subscriptions', page: 'subscriptions', icon: 'credit_card', desc: 'Recurring tiers & contracts' },
    { title: 'Admin & Compliance', page: 'admin-report', icon: 'admin_panel_settings', desc: 'SOX/SOC2 audit reports' },
    { title: 'Public Landing Page', page: 'landing', icon: 'public', desc: 'External customer portal & tracking' }
  ];

  const filteredQuotes = quotes.filter(
    (q) =>
      q.id.toLowerCase().includes(query.toLowerCase()) ||
      q.customer.toLowerCase().includes(query.toLowerCase()) ||
      q.origin.toLowerCase().includes(query.toLowerCase()) ||
      q.destination.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNav = quickNav.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (page, params = {}) => {
    navigate(page, params);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl bg-surface rounded-2xl shadow-2xl border border-outline overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-outline gap-3 bg-surface">
          <span className="material-symbols-outlined text-secondary text-[22px]">search</span>
          <input
            autoFocus
            type="text"
            className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant font-body-medium focus:outline-none text-base"
            placeholder="Search quotations, approvals, waybills, customers, or navigation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-surface-variant rounded border border-outline text-on-surface-variant">
            ESC
          </kbd>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Quick Quotations */}
          {filteredQuotes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-3 py-1">
                Quotations & Deals
              </div>
              <div className="space-y-1 mt-1">
                {filteredQuotes.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSelect('quotation-detail', { quoteId: q.id })}
                    className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-variant transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-container text-secondary flex items-center justify-center font-bold text-xs">
                        {q.id.replace('Q-', '')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-on-surface flex items-center gap-2">
                          <span>{q.id}</span>
                          <span className="text-xs text-on-surface-variant font-normal">· {q.customer}</span>
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          {q.origin} → {q.destination} ({q.mode})
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-on-secondary-container">{q.volume}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-container text-secondary font-medium">
                        {q.margin} Margin
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation */}
          {filteredNav.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-3 py-1">
                Navigation Modules
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                {filteredNav.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => handleSelect(item.page)}
                    className="text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-container/40 transition-colors group border border-transparent hover:border-secondary-container"
                  >
                    <span className="material-symbols-outlined text-secondary text-[22px] group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-on-surface truncate">{item.title}</div>
                      <div className="text-[11px] text-on-surface-variant truncate">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-surface-variant/60 border-t border-outline flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>Tip: Press <kbd className="font-mono bg-surface px-1.5 py-0.5 rounded border border-outline">⌘K</kbd> anywhere to open</span>
          <span>DealFlow360 Enterprise CPQ</span>
        </div>
      </div>
    </div>
  );
}
