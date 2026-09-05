import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import QuoteWorkspace from './components/workspace/QuoteWorkspace';
import WarehouseSplitModal from './components/modals/WarehouseSplitModal';
import HybridBillingView from './components/billing/HybridBillingView';
import CustomerPortalView from './components/portal/CustomerPortalView';
import DealHealthWarRoom from './components/dashboard/DealHealthWarRoom';
import TugaLoginScreen from './components/TugaLoginScreen';
import PhoneOtpScreen from './components/PhoneOtpScreen';
import { Monitor, Smartphone, LayoutGrid } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace', 'dealhealth', 'fulfillment', 'billing', 'portal', 'auth_tuga', 'auth_phone'
  const [currentRole, setCurrentRole] = useState('rep'); // 'rep', 'manager', 'finance', 'customer'
  const [isFulfillmentModalOpen, setIsFulfillmentModalOpen] = useState(false);

  // Sample quote lines shared across views
  const sampleLines = [
    { id: 'p1', sku: 'HW-LP14', name: 'Laptop Pro 14', category: 'Hardware', price: 1200, cost: 820, ceiling: 15, quantity: 2, discount: 12, isSubscription: false },
    { id: 'p2', sku: 'SRV-SETUP', name: 'Setup Service', category: 'Services', price: 450, cost: 180, ceiling: 10, quantity: 1, discount: 18, isSubscription: false },
    { id: 'p3', sku: 'SUB-SAAS', name: 'Enterprise SaaS Platform', category: 'Subscriptions', price: 300, cost: 45, ceiling: 20, quantity: 1, discount: 10, isSubscription: true, interval: 'monthly' }
  ];

  // Handle persona change
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    if (role === 'customer') {
      setActiveTab('portal');
    } else if (activeTab === 'portal') {
      setActiveTab('workspace');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 flex flex-col text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased">
      
      {/* DealFlow360 Main Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentRole={currentRole} 
        setCurrentRole={handleRoleChange} 
      />

      {/* Auxiliary reference switcher bar (top right quick access) */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-3 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-mono text-[11px] text-neutral-600">
            Active Quote: <strong className="text-neutral-950">Q-1042</strong> (Acme Corp · Gold Tier)
          </span>
        </div>

        {/* Reference Screen switchers */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-semibold text-neutral-400 px-1.5 hidden sm:inline">Reference UI:</span>
          <button
            onClick={() => setActiveTab('auth_tuga')}
            className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === 'auth_tuga' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Tuga 2-Col</span>
          </button>
          <button
            onClick={() => setActiveTab('auth_phone')}
            className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer transition-all flex items-center gap-1 ${
              activeTab === 'auth_phone' ? 'bg-black text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Phone OTP</span>
          </button>
        </div>
      </div>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-5">
        
        {/* VIEW 1: QUOTE WORKSPACE */}
        {activeTab === 'workspace' && (
          <QuoteWorkspace 
            onOpenFulfillment={() => setIsFulfillmentModalOpen(true)}
            onOpenPortal={() => setActiveTab('portal')}
            onOpenBilling={() => setActiveTab('billing')}
          />
        )}

        {/* VIEW 2: DEAL HEALTH WAR ROOM */}
        {activeTab === 'dealhealth' && (
          <DealHealthWarRoom 
            onOpenDeal={(dealId) => setActiveTab('workspace')}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* VIEW 3: FULFILLMENT SPLIT VIEW */}
        {activeTab === 'fulfillment' && (
          <WarehouseSplitModal 
            lines={sampleLines}
            onClose={() => setActiveTab('workspace')}
          />
        )}

        {/* VIEW 4: HYBRID BILLING ENGINE */}
        {activeTab === 'billing' && (
          <HybridBillingView 
            quoteLines={sampleLines}
          />
        )}

        {/* VIEW 5: CUSTOMER PORTAL */}
        {activeTab === 'portal' && (
          <CustomerPortalView 
            onBackToWorkspace={() => setActiveTab('workspace')}
          />
        )}

        {/* REFERENCE SCREENS */}
        {activeTab === 'auth_tuga' && (
          <div className="flex justify-center pt-4">
            <TugaLoginScreen onSwitchToPhone={() => setActiveTab('auth_phone')} />
          </div>
        )}

        {activeTab === 'auth_phone' && (
          <div className="flex justify-center pt-4">
            <PhoneOtpScreen />
          </div>
        )}

      </main>

      {/* Multi-Warehouse Fulfillment Modal (when triggered from Workspace) */}
      {isFulfillmentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <WarehouseSplitModal 
              lines={sampleLines}
              onClose={() => setIsFulfillmentModalOpen(false)}
            />
            <button
              onClick={() => setIsFulfillmentModalOpen(false)}
              className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="w-full border-t border-neutral-200 bg-white/70 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
          <span>DealFlow360 · Person 2 (Frontend Lead) Hackathon Build</span>
          <span className="font-mono text-[11px]">Clean B&W Design System · React 18 · Tailwind v4 · Lucide</span>
        </div>
      </footer>

    </div>
  );
}