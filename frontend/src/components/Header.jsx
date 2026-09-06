import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const {
    setIsSearchOpen,
    setIsNewQuoteOpen,
    setMobileMenuOpen,
    navigate,
    addToast
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface border-b border-outline z-30 flex items-center justify-between px-4 sm:px-6 lg:px-spacing-xl">
      {/* Left side: Mobile burger + Search */}
      <div className="flex items-center gap-3 lg:gap-spacing-md flex-1 max-w-xl">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Global Search trigger */}
        <div
          onClick={() => setIsSearchOpen(true)}
          className="relative flex items-center w-full max-w-md cursor-pointer group"
        >
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] group-hover:text-primary transition-colors">
            search
          </span>
          <input
            readOnly
            type="text"
            className="w-full h-10 pl-9 pr-14 bg-surface-variant hover:bg-surface border border-outline rounded-lg text-body-medium font-body-medium text-on-surface placeholder:text-on-surface-variant focus:outline-none cursor-pointer transition-colors"
            placeholder="Search deals, quotes, telemetry... [⌘K]"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 rounded bg-surface border border-outline font-label-small text-label-small text-on-surface-variant font-mono shadow-sm">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-spacing-md">
        {/* Engine status indicator */}
        <div className="hidden xl:flex items-center gap-spacing-xs px-spacing-sm py-spacing-xs rounded-full bg-primary-container border border-outline">
          <span className="material-symbols-outlined text-on-primary-container text-[16px]">
            cloud_done
          </span>
          <span className="font-label-small text-label-small text-on-primary-container font-semibold">
            Engine: v4.8 Active
          </span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors"
            type="button"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-tertiary-container animate-pulse"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-2xl border border-outline p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-outline mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-on-surface">
                  Notifications
                </span>
                <span className="text-[11px] text-tertiary font-semibold">3 Critical Alerts</span>
              </div>
              <div className="space-y-2 text-xs">
                <div
                  onClick={() => {
                    navigate('approvals');
                    setNotifOpen(false);
                  }}
                  className="p-2 rounded-lg bg-tertiary-container/20 border border-tertiary/20 cursor-pointer hover:bg-tertiary-container/30 transition-colors"
                >
                  <div className="font-semibold text-tertiary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    SLA Expiring in 48m
                  </div>
                  <div className="text-on-surface-variant mt-0.5">
                    Approval AP-8821 for Falcon Aerospace requires sign-off.
                  </div>
                </div>

                <div
                  onClick={() => {
                    navigate('fulfillment');
                    setNotifOpen(false);
                  }}
                  className="p-2 rounded-lg bg-surface-variant hover:bg-primary-container/40 cursor-pointer transition-colors"
                >
                  <div className="font-semibold text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    Mainline Dispatched
                  </div>
                  <div className="text-on-surface-variant mt-0.5">
                    Order SH-9402 departed Rotterdam Terminal.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New Quotation CTA Button */}
        <button
          onClick={() => setIsNewQuoteOpen(true)}
          className="flex items-center gap-spacing-xs px-3 sm:px-spacing-md py-spacing-xs bg-tertiary hover:opacity-95 text-on-tertiary rounded-lg font-label-large text-label-large shadow-sm transition-all transform active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">New Quotation</span>
        </button>

        {/* User Avatar */}
        <button
          onClick={() => navigate('customer-portal')}
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm"
          title="Marcus Vance - Profile"
        >
          <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </button>
      </div>
    </header>
  );
}
