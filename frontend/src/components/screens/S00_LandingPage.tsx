import React, { useState } from 'react';
import { useDealContext } from '../../store/DealContext';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Boxes,
  Receipt,
  MessageSquareCode,
  Users,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Search,
  ExternalLink,
  Cpu
} from 'lucide-react';

export const S00_LandingPage: React.FC = () => {
  const { setActiveScreen, setActivePersona, setSelectedQuoteId, setIsGlassBoxOpen, quotations } = useDealContext();
  const [trackerTab, setTrackerTab] = useState<'quotation' | 'personas'>('quotation');
  const [trackedId, setTrackedId] = useState('Q-1042');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quotations.find((item) => item.quoteNumber.toLowerCase() === trackedId.trim().toLowerCase());
    if (q) {
      setTrackingResult(q);
    } else {
      setTrackingResult(quotations[0]);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* BEGIN: Hero Section matching harsh_code.html */}
      <section
        className="relative min-h-[92vh] flex flex-col justify-between px-6 lg:px-14 py-8 overflow-hidden"
        style={{
          backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_Jo9UK3jojRTpdK4i4orEwKR2UclkRFMFZ0V_vDOfNm1x5hkAWOATy8LYzj0DlwdrGDGFS26wYoPjHXeyxwk4e-IBhcFLeX3cc3Z0hwQMbpfD5ZaYPojmzw1Vn-tj45c4d8h9Zf2rKaK4dWaNb4RA_ic5er52VVjmaeNakMjoA66QQjtjYlytrDnzKaibT-WQqsGTCtyM2SyKhbXvtKAzn6s9LCHavgxC40f43uz4xTZv6inlHx4Dq7X-fgKJuiHxG2U")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/75 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto pt-6">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5" />
              <span>Odoo 19 Hackathon Winner Edition</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black uppercase tracking-tight text-white leading-[1.08] drop-shadow-lg font-display">
              TURN EVERY<br />
              DEAL INTO<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-brand-orange">
                MOMENTUM
              </span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-slate-100 max-w-xl font-normal leading-relaxed drop-shadow-md opacity-95">
              DealFlow360 is an intelligent, self-governing sales operations platform that enforces pricing discipline, routes
              approvals with deterministic math, splits multi-warehouse fulfillment, reconciles hybrid subscriptions, and co-pilots
              every deal from quotation to cash.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveScreen('s04_builder')}
                className="group flex items-center bg-brand-orange hover:bg-brand-deepOrange text-white rounded-lg shadow-xl shadow-orange-950/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 pl-1 pr-5 py-1"
              >
                <span className="w-9 h-9 bg-white rounded flex items-center justify-center text-slate-900 mr-3 shadow-sm transition-transform duration-200 group-hover:translate-x-0.5">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </span>
                <span className="font-bold text-sm tracking-wide">Explore DealFlow360</span>
              </button>

              <button
                onClick={() => setIsGlassBoxOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition-all hover:scale-105"
              >
                <Cpu className="w-4 h-4 text-brand-orange" />
                <span>View Glass Box Math</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Deal Sandbox & Persona Gateways */}
          <div className="lg:col-span-5 flex justify-end items-center z-20">
            <div className="w-full max-w-[340px] bg-[#0D1322]/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 text-slate-100 border border-white/15">
              {/* Tab Switcher */}
              <div className="flex border-b border-white/10 text-xs font-semibold mb-4">
                <button
                  onClick={() => setTrackerTab('quotation')}
                  className={`pb-2 px-1 mr-4 transition-colors ${
                    trackerTab === 'quotation' ? 'text-white tab-active-indicator' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Track Quotation
                </button>
                <button
                  onClick={() => setTrackerTab('personas')}
                  className={`pb-2 px-1 transition-colors ${
                    trackerTab === 'personas' ? 'text-white tab-active-indicator' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Role Gateways
                </button>
              </div>

              {trackerTab === 'quotation' ? (
                <div>
                  <form onSubmit={handleTrack} className="space-y-3">
                    <div className="flex gap-2 mb-1">
                      {['Q-1042', 'Q-1039', 'Q-1035'].map((id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setTrackedId(id);
                            const q = quotations.find((item) => item.quoteNumber === id);
                            setTrackingResult(q || quotations[0]);
                          }}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-brand-orange"
                        >
                          {id}
                        </button>
                      ))}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={trackedId}
                        onChange={(e) => setTrackedId(e.target.value)}
                        placeholder="Enter quotation ID (e.g. Q-1042)"
                        className="w-full bg-[#131B2E] border border-white/10 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange rounded-lg py-2 px-3 text-xs text-slate-100 placeholder-slate-400 outline-none font-mono"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-orange hover:bg-brand-deepOrange text-white font-bold py-2 px-3 rounded-lg text-xs shadow-md shadow-brand-orange/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Inspect Live Deal State</span>
                    </button>
                  </form>

                  {/* Deal Passport Card */}
                  <div className="mt-4 p-3.5 rounded-xl bg-[#131B2E]/90 border border-white/10 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Q-1042 — Acme Corp</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        Gold Tier
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/5 font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Blended Risk</span>
                        <span className="font-bold text-rose-400">32 / 100 (HIGH)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Protected Margin</span>
                        <span className="font-bold text-emerald-400">32.4% ($804)</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      Approval: <span className="text-rose-300 font-semibold">Sales Manager + Finance</span>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedQuoteId('quote-1042');
                          setActiveScreen('s04_builder');
                        }}
                        className="flex-1 py-1.5 rounded bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-white transition-colors text-center"
                      >
                        Open Builder
                      </button>
                      <button
                        onClick={() => setIsGlassBoxOpen(true)}
                        className="py-1.5 px-2.5 rounded bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Math</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Role Gateways */
                <div className="space-y-2.5">
                  <p className="text-[11px] text-slate-400">Jump directly into any persona perspective:</p>
                  {[
                    { role: 'Sales Rep', name: 'J. Rao (Sales Rep)', screen: 's04_builder', desc: 'Quote builder with live margin' },
                    { role: 'Sales Manager', name: 'M. Shah (Manager)', screen: 's05_approvals', desc: 'Approvals queue & deal health' },
                    { role: 'Finance Approver', name: 'R. Iyer (Finance)', screen: 's06_approval_detail', desc: 'Level-2 high risk & billing' },
                    { role: 'Customer', name: 'Sarah (Acme Corp)', screen: 's11_customer_portal', desc: 'Client portal & counter-offers' }
                  ].map((p) => (
                    <button
                      key={p.role}
                      onClick={() => {
                        setActivePersona(p.role as any);
                        setActiveScreen(p.screen as any);
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#131B2E] hover:bg-white/10 border border-white/10 text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{p.desc}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Odoo 19 Policy Engine</span>
                </span>
                <span className="text-[10px] text-brand-orange font-bold">24h Hackathon Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* BEGIN: Bottom Statistics Bar matching harsh_code.html */}
        <div className="relative z-20 max-w-7xl mx-auto w-full pt-8">
          <div className="glass-metric-bar rounded-2xl px-6 sm:px-10 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="flex flex-col pt-2 md:pt-0 md:pr-4">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">0 sec</span>
                <span className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5">Automated Approval Routing</span>
              </div>

              <div className="flex flex-col pt-2 md:pt-0 md:px-6">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">100%</span>
                <span className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5">Deterministic Glass Box Math</span>
              </div>

              <div className="flex flex-col pt-2 md:pt-0 md:px-6">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">32.4%</span>
                <span className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5">Protected Deal Margin</span>
              </div>

              <div className="flex flex-col pt-2 md:pt-0 md:pl-6">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">3-Way</span>
                <span className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5">Warehouse Split Optimizer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: The 5 Core Engines from DealFlow360.pdf */}
      <section className="py-20 px-6 lg:px-14 bg-[#090D16] border-t border-white/10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">Core System Architecture</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
              The 5 Engines Powering DealFlow360
            </h3>
            <p className="mt-4 text-sm sm:text-base text-slate-400">
              Unlike traditional CRM form fillers, DealFlow360 solves real operational problems: discount governance, inventory
              splitting, hybrid billing, and in-portal customer negotiations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Blended Risk & Approval Routing',
                desc: 'Calculates per-line ceiling overage weighted by deal volume. Auto-routes between Sales Manager and Finance with zero manual effort.',
                action: 's05_approvals',
                label: 'View Approvals Queue'
              },
              {
                icon: Sparkles,
                title: 'State-Triggered Deal Co-Pilot',
                desc: 'Not a chatbot. A state-triggered reasoning engine that watches deal changes, narrates risk, and prepares counter drafts automatically.',
                action: 's04_builder',
                label: 'Open Workspace'
              },
              {
                icon: Boxes,
                title: 'Greedy Multi-Warehouse Splitter',
                desc: 'Minimizes shipment count and freight cost across Main Warehouse and East Depot, with automated backorder consolidation prompts.',
                action: 's07_fulfillment',
                label: 'Inspect Inventory'
              },
              {
                icon: Receipt,
                title: 'Hybrid Billing & Proration Engine',
                desc: 'Reconciles one-time hardware CapEx and recurring SaaS OpEx on a single order with exact mid-cycle day-ratio proration math.',
                action: 's10_billing_detail',
                label: 'View Billing Engine'
              },
              {
                icon: MessageSquareCode,
                title: 'Customer Negotiation Portal',
                desc: 'A dedicated client-facing proposal view (/portal) allowing line discussions and counter-offers that re-trigger approval workflows automatically.',
                action: 's11_customer_portal',
                label: 'Open Portal'
              },
              {
                icon: Zap,
                title: 'Deal Health War Room',
                desc: 'Proactive operational snapshot detecting stalled deals (>24h), delivery promise slippages, and rep 90-day discount anomalies.',
                action: 's14_deal_health',
                label: 'Open War Room'
              }
            ].map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 hover:border-brand-orange/40 transition-all hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#131B2E] border border-white/10 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform mb-5">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white tracking-tight mb-2">{card.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>

                <button
                  onClick={() => setActiveScreen(card.action as any)}
                  className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:text-white transition-colors"
                >
                  <span>{card.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: 8-Step Judge Checklist from Spec Section 9 */}
      <section className="py-16 px-6 lg:px-14 bg-[#0D1322] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">Spec Section 09</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display mt-1">
                The 8-Step Quick Test Flow (Login to Payment)
              </h3>
            </div>
            <span className="text-xs text-slate-400">100% Deterministic Verification Protocol</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Admin Setup', desc: 'Configure discount tiers, warehouses, and subscription plans.' },
              { step: '2', title: 'Quote Builder', desc: 'Add Laptop Pro & Setup Service with 18% discount.' },
              { step: '3', title: 'Auto-Routing', desc: 'Blended risk flags Finance approval without rep manual action.' },
              { step: '4', title: 'Live Upsell', desc: 'Add Care Plan 2yr; margin immediately lifts to 32.4%.' },
              { step: '5', title: 'Warehouse Split', desc: 'Greedy allocation across Main Warehouse & East Depot.' },
              { step: '6', title: 'Hybrid Billing', desc: 'CapEx hardware and OpEx recurring plans billed accurately.' },
              { step: '7', title: 'Client Counter', desc: 'Customer counters 22% in portal; triggers re-approval.' },
              { step: '8', title: 'Payment & Audit', desc: 'Order confirmed, payment recorded, invoice marked Paid.' }
            ].map((s) => (
              <div key={s.step} className="p-4 rounded-xl bg-[#131B2E] border border-white/10">
                <div className="w-7 h-7 rounded-full bg-brand-orange/20 text-brand-orange border border-brand-orange/30 font-bold font-mono text-xs flex items-center justify-center mb-2">
                  {s.step}
                </div>
                <div className="text-sm font-bold text-white mb-1">{s.title}</div>
                <div className="text-xs text-slate-400 leading-normal">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
