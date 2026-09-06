import React from 'react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { currentPage, navigate, mobileMenuOpen, setMobileMenuOpen, user, logout } = useApp();

  const navItems = [
    { id: 'overview', label: 'Dashboard / Overview', icon: 'space_dashboard' },
    { id: 'quotations', label: 'Quotations', icon: 'request_quote', badge: '384' },
    { id: 'approvals', label: 'Approvals', icon: 'verified_user', badge: '4', badgeColor: 'bg-tertiary text-on-tertiary' },
    { id: 'fulfillment', label: 'Fulfillment', icon: 'local_shipping', badge: '91' },
    { id: 'invoices', label: 'Invoices & Billing', icon: 'receipt_long' },
    { id: 'customer-portal', label: 'Customer Portal', icon: 'group' },
    { id: 'products', label: 'Products & Catalog', icon: 'inventory_2' },
    { id: 'deal-health', label: 'Deal Health & Risk', icon: 'monitoring', badge: 'Live' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'credit_card' },
    { id: 'admin-config', label: 'Backend Config', icon: 'settings' },
    { id: 'admin-report', label: 'Admin & Governance', icon: 'admin_panel_settings' }
  ];

  const handleNav = (id) => {
    navigate(id);
    setMobileMenuOpen(false);
  };

  const content = (
    <div className="flex flex-col h-full justify-between select-none">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div
          onClick={() => handleNav('overview')}
          className="h-16 px-spacing-lg flex items-center gap-spacing-sm border-b border-outline shrink-0 cursor-pointer hover:bg-surface-variant/50 transition-colors"
        >
          {/* Brand Logo Icon */}
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <svg className="w-full h-full drop-shadow-sm" fill="none" viewBox="0 0 44 38" xmlns="http://www.w3.org/2000/svg">
              <polygon fill="#ea580c" points="0,38 24,0 44,22"></polygon>
              <polygon fill="#f97316" points="12,38 24,18 36,38"></polygon>
              <polygon fill="#fb923c" opacity="0.9" points="24,0 44,22 18,34"></polygon>
              <polygon fill="#c2410c" points="0,38 18,34 6,18"></polygon>
            </svg>
          </div>
          <div className="flex items-baseline tracking-tight font-title-small text-title-small">
            <span className="text-on-secondary-container font-extrabold">DealFlow</span>
            <span className="text-tertiary font-black ml-0.5">360</span>
          </div>
        </div>

        {/* Telemetry Status Strip */}
        <div className="px-spacing-md pt-spacing-sm pb-spacing-xs shrink-0">
          <div className="flex items-center justify-between px-spacing-sm py-spacing-xs rounded-lg bg-surface-variant border border-outline">
            <div className="flex items-center gap-spacing-xs">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-small text-label-small text-on-surface-variant uppercase tracking-wider font-semibold">
                Telemetry
              </span>
            </div>
            <span className="font-label-small text-label-small text-on-primary-container font-semibold">
              SLA 99.98% Operational
            </span>
          </div>
        </div>

        {/* Main Navigation List */}
        <nav className="flex-1 overflow-y-auto px-spacing-sm py-spacing-xs space-y-1">
          {navItems.map((item) => {
            const isActive =
              currentPage === item.id ||
              (item.id === 'quotations' && currentPage === 'quotation-detail') ||
              (item.id === 'approvals' && currentPage === 'approval-detail') ||
              (item.id === 'fulfillment' && currentPage === 'fulfillment-detail') ||
              (item.id === 'invoices' && (currentPage === 'invoice-detail' || currentPage === 'billing-detail')) ||
              (item.id === 'products' && currentPage === 'product-detail');

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-spacing-sm py-spacing-xs rounded-lg font-label-large text-label-large transition-colors text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold border border-secondary-container'
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-spacing-sm min-w-0">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.badgeColor || 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 pb-1 px-spacing-sm">
            <div className="border-t border-outline my-2"></div>
            <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">
              External Portals
            </div>
            <button
              onClick={() => handleNav('landing')}
              className="w-full flex items-center gap-spacing-sm px-spacing-sm py-spacing-xs rounded-lg font-label-large text-label-large text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] text-brand-orange">public</span>
              <span className="truncate">Public Landing Page</span>
            </button>
          </div>
        </nav>
      </div>

      {/* User Profile Card */}
      {user ? (
        <div className="p-spacing-md border-t border-outline bg-surface shrink-0">
          <div className="flex items-center gap-spacing-sm p-spacing-xs rounded-lg mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-large text-label-large shrink-0 shadow-sm font-bold">
              {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : user.email.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="font-label-large text-label-large text-on-surface truncate font-bold">
                {user.full_name || 'System User'}
              </div>
              <div className="font-body-small text-body-small text-on-surface-variant truncate">
                {user.role}
              </div>
              <div className="font-label-small text-label-small text-primary truncate font-medium">
                DealFlow360 {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Sign Out
          </button>
        </div>
      ) : (
        <div className="p-spacing-md border-t border-outline bg-surface shrink-0">
          <button
            onClick={() => handleNav('signin')}
            className="w-full flex items-center justify-center gap-2 py-2 bg-brand-orange text-white hover:bg-orange-600 rounded-lg text-sm font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-surface border-r border-outline z-40 flex-col justify-between select-none">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <aside className="relative w-72 max-w-[80vw] bg-surface h-full shadow-2xl z-10 flex flex-col">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
