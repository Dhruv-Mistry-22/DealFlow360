import React from 'react';
import { DealProvider, useDealContext } from './store/DealContext';
import { TopHeaderNav } from './components/layout/TopHeaderNav';
import { GlassBoxDrawer } from './components/layout/GlassBoxDrawer';

import { S00_LandingPage } from './components/screens/S00_LandingPage';
import { S01_AuthGate } from './components/screens/S01_AuthGate';
import { S02_SalesDashboard } from './components/screens/S02_SalesDashboard';
import { S03_QuotationsList } from './components/screens/S03_QuotationsList';
import { S04_QuoteWorkspace } from './components/screens/S04_QuoteWorkspace';
import { S05_ApprovalsList } from './components/screens/S05_ApprovalsList';
import { S06_ApprovalDetail } from './components/screens/S06_ApprovalDetail';
import { S07_FulfillmentList } from './components/screens/S07_FulfillmentList';
import { S08_FulfillmentDetail } from './components/screens/S08_FulfillmentDetail';
import { S09_SubscriptionsList } from './components/screens/S09_SubscriptionsList';
import { S10_BillingDetail } from './components/screens/S10_BillingDetail';
import { S11_CustomerPortal } from './components/screens/S11_CustomerPortal';
import { S12_InvoicesList } from './components/screens/S12_InvoicesList';
import { S13_InvoiceDetail } from './components/screens/S13_InvoiceDetail';
import { S14_DealHealthWarRoom } from './components/screens/S14_DealHealthWarRoom';
import { S15_AdminReporting } from './components/screens/S15_AdminReporting';
import { S16_ProductCatalog } from './components/screens/S16_ProductCatalog';
import { S17_ProductDetail } from './components/screens/S17_ProductDetail';
import { S18_DiscountSetup } from './components/screens/S18_DiscountSetup';

const ScreenOrchestrator: React.FC = () => {
  const { activeScreen } = useDealContext();

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'landing':
        return <S00_LandingPage />;
      case 's01_auth':
        return <S01_AuthGate />;
      case 's02_dashboard':
        return <S02_SalesDashboard />;
      case 's03_quotations':
        return <S03_QuotationsList />;
      case 's04_builder':
        return <S04_QuoteWorkspace />;
      case 's05_approvals':
        return <S05_ApprovalsList />;
      case 's06_approval_detail':
        return <S06_ApprovalDetail />;
      case 's07_fulfillment':
        return <S07_FulfillmentList />;
      case 's08_fulfillment_detail':
        return <S08_FulfillmentDetail />;
      case 's09_subscriptions':
        return <S09_SubscriptionsList />;
      case 's10_billing_detail':
        return <S10_BillingDetail />;
      case 's11_customer_portal':
        return <S11_CustomerPortal />;
      case 's12_invoices':
        return <S12_InvoicesList />;
      case 's13_invoice_detail':
        return <S13_InvoiceDetail />;
      case 's14_deal_health':
        return <S14_DealHealthWarRoom />;
      case 's15_reports':
        return <S15_AdminReporting />;
      case 's16_products':
        return <S16_ProductCatalog />;
      case 's17_product_detail':
        return <S17_ProductDetail />;
      case 's18_discount_setup':
        return <S18_DiscountSetup />;
      default:
        return <S00_LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 font-sans selection:bg-brand-orange selection:text-white">
      {/* Persistent Navigation Header */}
      <TopHeaderNav />

      {/* Screen View */}
      <main className="flex-1 w-full">{renderActiveScreen()}</main>

      {/* Glass Box Drawer Diagnostic Overlay */}
      <GlassBoxDrawer />

      {/* Global Footer */}
      <footer className="w-full bg-[#0D1322] border-t border-white/10 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">DealFlow360</span>
            <span>•</span>
            <span>Intelligent, Self-Governing Sales Operations Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-brand-orange font-semibold">Glass Box Logic + Stateful AI Co-Pilot + SaaS-Grade UX</span>
            <span>•</span>
            <span className="text-slate-400">Odoo 19 Hackathon</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DealProvider>
      <ScreenOrchestrator />
    </DealProvider>
  );
};

export default App;
