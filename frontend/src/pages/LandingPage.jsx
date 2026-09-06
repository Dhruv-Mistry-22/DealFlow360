import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { navigate, addToast } = useApp();
  const [activeTrackerTab, setActiveTrackerTab] = useState('quotation');
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingFeedback, setTrackingFeedback] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackingSubmit = (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const query = trackingInput.trim().toUpperCase();
      if (query.startsWith('Q-') || activeTrackerTab === 'quotation') {
        setTrackingFeedback(`Quotation "${query}" found. Routing to CPQ deal page...`);
        setTimeout(() => {
          navigate('quotation-detail', { quoteId: query });
        }, 800);
      } else {
        setTrackingFeedback(`Shipment "${query}" found. Routing to fulfillment tracking...`);
        setTimeout(() => {
          navigate('fulfillment-detail', { orderId: query });
        }, 800);
      }
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between font-sans antialiased text-slate-100 selection:bg-brand-orange selection:text-white relative overflow-x-hidden bg-slate-950"
      style={{
        backgroundImage: `linear-gradient(rgba(13, 19, 34, 0.75), rgba(13, 19, 34, 0.85)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_Jo9UK3jojRTpdK4i4orEwKR2UclkRFMFZ0V_vDOfNm1x5hkAWOATy8LYzj0DlwdrGDGFS26wYoPjHXeyxwk4e-IBhcFLeX3cc3Z0hwQMbpfD5ZaYPojmzw1Vn-tj45c4d8h9Zf2rKaK4dWaNb4RA_ic5er52VVjmaeNakMjoA66QQjtjYlytrDnzKaibT-WQqsGTCtyM2SyKhbXvtKAzn6s9LCHavgxC40f43uz4xTZv6inlHx4Dq7X-fgKJuiHxG2U")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Navigation Header */}
      <header className="w-full px-6 lg:px-14 pt-6 pb-4 flex items-center justify-between z-30">
        {/* Brand Logo */}
        <div
          onClick={() => navigate('landing')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative w-9 h-8 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <svg className="w-full h-full drop-shadow-md" fill="none" viewBox="0 0 44 38">
              <polygon fill="#ea580c" points="0,38 24,0 44,22"></polygon>
              <polygon fill="#f97316" points="12,38 24,18 36,38"></polygon>
              <polygon fill="#fb923c" opacity="0.9" points="24,0 44,22 18,34"></polygon>
              <polygon fill="#c2410c" points="0,38 18,34 6,18"></polygon>
            </svg>
          </div>
          <span className="text-2xl lg:text-3xl font-black tracking-tight flex items-baseline">
            <span className="text-white">DealFlow</span>
            <span className="text-brand-orange">360</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 text-[13px] font-semibold tracking-wider text-slate-200">
          <button onClick={() => navigate('overview')} className="text-white hover:text-brand-orange transition-colors">
            OVERVIEW
          </button>
          <button onClick={() => navigate('quotations')} className="hover:text-brand-orange transition-colors">
            QUOTATIONS
          </button>
          <button onClick={() => navigate('fulfillment')} className="hover:text-brand-orange transition-colors">
            TRACKING
          </button>
          <button onClick={() => navigate('customer-portal')} className="hover:text-brand-orange transition-colors">
            PORTAL
          </button>
          <button onClick={() => navigate('deal-health')} className="hover:text-brand-orange transition-colors">
            RISK AI
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => navigate('signin')}
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full hover:bg-white/10 text-slate-100 text-[13px] font-bold transition-all"
          >
            Sign In
          </button>
          
          <button
            onClick={() => navigate('signup')}
            className="flex items-center bg-brand-orange hover:bg-brand-deepOrange text-white rounded-full px-5 py-2 shadow-md font-bold text-xs sm:text-[13px] tracking-tight transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="w-full flex-grow flex flex-col justify-center px-6 lg:px-14 py-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full">
          {/* Left Column: Big Tagline and CTA */}
          <div className="lg:col-span-7 flex flex-col items-start pt-6 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-brand-accent mb-4">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></span>
              Enterprise Logistics & CPQ Engine v4.8
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black uppercase tracking-tight text-white leading-[1.08] drop-shadow-md">
              TURN EVERY<br />
              DEAL INTO<br />
              <span className="text-brand-orange">MOMENTUM</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-slate-100 max-w-xl font-normal leading-relaxed drop-shadow-sm opacity-95">
              DealFlow360 intelligently governs pricing, delegated multi-tier approvals, freight fulfillment, automated EDI billing, and customer negotiation — from quotation to cash.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('overview')}
                className="group flex items-center bg-brand-orange hover:bg-brand-deepOrange text-white rounded-lg shadow-lg shadow-orange-950/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 pl-1.5 pr-6 py-1.5"
              >
                <span className="w-9 h-9 bg-white rounded-md flex items-center justify-center text-slate-900 mr-3 shadow-sm transition-transform duration-200 group-hover:translate-x-0.5">
                  <span className="material-symbols-outlined text-[20px] text-brand-orange">dashboard</span>
                </span>
                <span className="font-bold text-sm tracking-wide">Enter Live Dashboard</span>
              </button>

              <button
                onClick={() => navigate('deal-health')}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">monitoring</span>
                <span>Explore Deal Health Risk AI</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tracking & Quick CPQ Card */}
          <div className="lg:col-span-5 flex justify-end items-center pr-0 lg:pr-2 z-20">
            <div className="w-full max-w-[340px] bg-white rounded-2xl shadow-2xl p-5 text-slate-800 border border-slate-100">
              <div className="flex border-b border-slate-200 text-xs font-semibold mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTrackerTab('quotation');
                    setTrackingFeedback(null);
                  }}
                  className={`pb-2.5 px-2 mr-3 font-semibold transition-colors ${
                    activeTrackerTab === 'quotation'
                      ? 'text-slate-900 border-b-2 border-brand-orange'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Track Quotation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTrackerTab('order');
                    setTrackingFeedback(null);
                  }}
                  className={`pb-2.5 px-2 font-semibold transition-colors ${
                    activeTrackerTab === 'order'
                      ? 'text-slate-900 border-b-2 border-brand-orange'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  View Order
                </button>
              </div>

              <form onSubmit={handleTrackingSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {activeTrackerTab === 'quotation' ? 'Quotation Identifier' : 'Order / Waybill Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder={
                      activeTrackerTab === 'quotation' ? 'Enter quote ID (e.g. Q-1024)' : 'Enter waybill (e.g. SH-9402)'
                    }
                    className="w-full bg-[#f1f4f9] border border-transparent focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 rounded-lg py-2.5 px-3.5 text-xs text-slate-800 placeholder-slate-400 transition-all outline-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-brand-orange hover:bg-brand-deepOrange text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow-md shadow-brand-orange/30 transition-all flex items-center justify-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                      <span>Searching CPQ Engine...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">search</span>
                      <span>Track Now</span>
                    </>
                  )}
                </button>
              </form>

              {trackingFeedback && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check_circle</span>
                  <span>{trackingFeedback}</span>
                </div>
              )}

              {/* Sample Shortcuts */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-[11px]">
                <span className="text-slate-400 font-medium">Quick Jump Examples:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      setTrackingInput('Q-1024');
                      navigate('quotation-detail', { quoteId: 'Q-1024' });
                    }}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-orange-50 hover:text-brand-orange text-slate-700 rounded text-[10px] font-mono font-semibold"
                  >
                    Q-1024
                  </button>
                  <button
                    onClick={() => {
                      setTrackingInput('SH-9402');
                      navigate('fulfillment-detail', { orderId: 'SH-9402' });
                    }}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-orange-50 hover:text-brand-orange text-slate-700 rounded text-[10px] font-mono font-semibold"
                  >
                    SH-9402
                  </button>
                  <button
                    onClick={() => navigate('approval-detail', { approvalId: 'AP-8821' })}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-orange-50 hover:text-brand-orange text-slate-700 rounded text-[10px] font-mono font-semibold"
                  >
                    AP-8821
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Statistics Glass Bar */}
      <footer className="w-full px-6 lg:px-14 pb-8 z-20">
        <div className="max-w-7xl mx-auto glass-metric-bar rounded-2xl px-6 sm:px-10 py-5 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex flex-col pt-2 md:pt-0 md:pr-4">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">2000+</span>
              <span className="text-xs text-slate-300 font-normal mt-0.5">Satisfied Enterprise Shippers</span>
            </div>
            <div className="flex flex-col pt-2 md:pt-0 md:px-6">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">99.98%</span>
              <span className="text-xs text-slate-300 font-normal mt-0.5">SLA Platform Availability</span>
            </div>
            <div className="flex flex-col pt-2 md:pt-0 md:px-6">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">150+</span>
              <span className="text-xs text-slate-300 font-normal mt-0.5">Global Freight Corridors</span>
            </div>
            <div className="flex flex-col pt-2 md:pt-0 md:pl-6">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">24/7</span>
              <span className="text-xs text-slate-300 font-normal mt-0.5">Autonomous CPQ Guard</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
