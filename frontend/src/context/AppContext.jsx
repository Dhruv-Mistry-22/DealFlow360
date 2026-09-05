import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('overview'); // default to dashboard
  const [pageParams, setPageParams] = useState({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Mock Quotes Data
  const [quotes, setQuotes] = useState([
    {
      id: 'Q-1024',
      customer: 'Acme Global Logistics Inc.',
      accountTier: 'Tier 1 Enterprise',
      origin: 'Rotterdam (NLRTM)',
      destination: 'New York (USNYC)',
      mode: 'Ocean FCL',
      volume: '$124,500',
      numericVolume: 124500,
      margin: '22.4%',
      marginStatus: 'Compliant',
      status: 'Approved',
      version: 'v2.1',
      date: 'Oct 28, 2024',
      rep: 'Eleanor Vance',
      repAvatar: 'EV'
    },
    {
      id: 'Q-1025',
      customer: 'Falcon Aerospace Supply',
      accountTier: 'Strategic Partner',
      origin: 'Hamburg (DEHAM)',
      destination: 'Chicago (USCHI)',
      mode: 'Air Expedited',
      volume: '$112,400',
      numericVolume: 112400,
      margin: '11.8%',
      marginStatus: 'Breached Hard Floor',
      status: 'Awaiting Approval',
      version: 'v1.0',
      date: 'Oct 28, 2024',
      rep: 'Marcus Vance',
      repAvatar: 'MV'
    },
    {
      id: 'Q-9012',
      customer: 'Pacific Rim FMCG',
      accountTier: 'Mid-Market',
      origin: 'Singapore (SGSIN)',
      destination: 'Los Angeles (USLAX)',
      mode: 'Ocean FCL',
      volume: '$410,000',
      numericVolume: 410000,
      margin: '24.0%',
      marginStatus: 'Compliant',
      status: 'Converted',
      version: 'v3.0',
      date: 'Oct 26, 2024',
      rep: 'Sarah Jenkins',
      repAvatar: 'SJ'
    },
    {
      id: 'Q-9904',
      customer: 'Swift Freight Systems',
      accountTier: 'Direct Shipper',
      origin: 'Shenzhen (CNSZX)',
      destination: 'Long Beach (USLGB)',
      mode: 'Truckload Intermodal',
      volume: '$220,000',
      numericVolume: 220000,
      margin: '18.2%',
      marginStatus: 'Warning',
      status: 'Approved',
      version: 'v1.2',
      date: 'Oct 25, 2024',
      rep: 'David Chen',
      repAvatar: 'DC'
    },
    {
      id: 'Q-7822',
      customer: 'OmniCold Storage',
      accountTier: 'Cold-Chain Specialized',
      origin: 'Antwerp (BEANR)',
      destination: 'Savannah (USSAV)',
      mode: 'Ocean Reefer',
      volume: '$640,000',
      numericVolume: 640000,
      margin: '16.5%',
      marginStatus: 'Warning',
      status: 'Draft',
      version: 'v1.0',
      date: 'Oct 24, 2024',
      rep: 'Elena Rostov',
      repAvatar: 'ER'
    }
  ]);

  // Mock Approvals Data
  const [approvals, setApprovals] = useState([
    {
      id: 'AP-8821',
      quoteRef: 'Q-1025',
      customer: 'Falcon Aerospace Supply',
      route: 'Rotterdam (NLRTM) → New York (USNYC)',
      amount: '$112,400.00',
      margin: '11.8%',
      floor: '18.0%',
      variance: '-6.2%',
      slaMinutes: 48,
      status: 'Pending VP Review',
      reason: 'Volume incentive concession requested for quarterly contract lock'
    },
    {
      id: 'AP-7731',
      quoteRef: 'Q-1028',
      customer: 'Apex Logistics Corp',
      route: 'Shanghai (CNSHA) → Felixstowe (GBFXT)',
      amount: '$94,000.00',
      margin: '14.5%',
      floor: '18.0%',
      variance: '-3.5%',
      slaMinutes: 110,
      status: 'Pending Director Review',
      reason: 'Carrier capacity surge surcharge absorption'
    },
    {
      id: 'AP-6509',
      quoteRef: 'Q-1033',
      customer: 'Nordic Pharma Reefer',
      route: 'Copenhagen (DKCPH) → Boston (USBOS)',
      amount: '$180,000.00',
      margin: '19.1%',
      floor: '18.0%',
      variance: '+1.1%',
      slaMinutes: 15,
      status: 'Expedited Review',
      reason: 'Dedicated temperature-controlled air telemetry endorsement'
    }
  ]);

  // Navigation Helper
  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Notification
  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Approve a Deal
  const handleApproveDeal = (id) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Approved & Signed' } : a))
    );
    addToast('Deal Approved', `Approval ${id} has been signed and transmitted to ERP.`, 'success');
  };

  // Reject a Deal
  const handleRejectDeal = (id) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Rejected' } : a))
    );
    addToast('Deal Rejected', `Approval ${id} was returned to sales rep with feedback.`, 'warning');
  };

  // Create new quotation
  const handleCreateQuotation = (newQuote) => {
    const quoteObj = {
      id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: newQuote.customer || 'Global Express Corp',
      accountTier: 'Enterprise Tier',
      origin: newQuote.origin || 'Shanghai (CNSHA)',
      destination: newQuote.destination || 'Los Angeles (USLAX)',
      mode: newQuote.mode || 'Ocean FCL',
      volume: `$${Number(newQuote.amount || 85000).toLocaleString()}`,
      numericVolume: Number(newQuote.amount || 85000),
      margin: `${newQuote.margin || 21.5}%`,
      marginStatus: Number(newQuote.margin || 21.5) < 18 ? 'Breached Hard Floor' : 'Compliant',
      status: Number(newQuote.margin || 21.5) < 18 ? 'Awaiting Approval' : 'Approved',
      version: 'v1.0',
      date: 'Just now',
      rep: 'Marcus Vance',
      repAvatar: 'MV'
    };
    setQuotes((prev) => [quoteObj, ...prev]);
    addToast('Quotation Created', `Quote ${quoteObj.id} for ${quoteObj.customer} was generated.`, 'success');
    setIsNewQuoteOpen(false);
    navigate('quotations');
  };

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        pageParams,
        navigate,
        quotes,
        approvals,
        isSearchOpen,
        setIsSearchOpen,
        isNewQuoteOpen,
        setIsNewQuoteOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        toasts,
        addToast,
        removeToast,
        handleApproveDeal,
        handleRejectDeal,
        handleCreateQuotation
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
