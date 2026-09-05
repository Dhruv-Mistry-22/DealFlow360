import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CommandPalette from './components/CommandPalette';
import NewQuotationModal from './components/NewQuotationModal';
import Toast from './components/Toast';

import LandingPage from './pages/LandingPage';
import DashboardOverview from './pages/DashboardOverview';
import QuotationList from './pages/QuotationList';
import QuotationDetails from './pages/QuotationDetails';
import ApprovalsList from './pages/ApprovalsList';
import ApprovalDetails from './pages/ApprovalDetails';
import DealHealth from './pages/DealHealth';
import FulfillmentList from './pages/FulfillmentList';
import FulfillmentDetails from './pages/FulfillmentDetails';
import InvoicesList from './pages/InvoicesList';
import InvoiceDetails from './pages/InvoiceDetails';
import BillingDetails from './pages/BillingDetails';
import CustomerPortal from './pages/CustomerPortal';
import ProductDashboard from './pages/ProductDashboard';
import ProductDetails from './pages/ProductDetails';
import SubscriptionList from './pages/SubscriptionList';
import AdminReport from './pages/AdminReport';

function AppContent() {
  const { currentPage } = useApp();

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-orange selection:text-white">
        <LandingPage />
        <CommandPalette />
        <NewQuotationModal />
        <Toast />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <DashboardOverview />;
      case 'quotations':
        return <QuotationList />;
      case 'quotation-detail':
        return <QuotationDetails />;
      case 'approvals':
        return <ApprovalsList />;
      case 'approval-detail':
        return <ApprovalDetails />;
      case 'deal-health':
        return <DealHealth />;
      case 'fulfillment':
        return <FulfillmentList />;
      case 'fulfillment-detail':
        return <FulfillmentDetails />;
      case 'invoices':
        return <InvoicesList />;
      case 'invoice-detail':
        return <InvoiceDetails />;
      case 'billing-detail':
        return <BillingDetails />;
      case 'customer-portal':
        return <CustomerPortal />;
      case 'products':
        return <ProductDashboard />;
      case 'product-detail':
        return <ProductDetails />;
      case 'subscriptions':
        return <SubscriptionList />;
      case 'admin-report':
        return <AdminReport />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-body-medium text-body-medium text-on-surface antialiased flex flex-col">
      <Sidebar />
      <Header />
      <main className="w-full lg:pl-72 pt-16 min-h-screen bg-background px-4 sm:px-6 lg:px-spacing-xl py-spacing-lg">
        {renderPage()}
      </main>
      <CommandPalette />
      <NewQuotationModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
