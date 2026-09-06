import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('df360_currentPage') || 'signin');
  const [pageParams, setPageParams] = useState({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    localStorage.setItem('df360_currentPage', currentPage);
  }, [currentPage]);
  
  const [token, setToken] = useState(localStorage.getItem('df360_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('df360_user') || 'null'));
  const isAuthenticated = !!token;

  const [quotes, setQuotes] = useState([]);

  // Mock Approvals Data
  const [approvals, setApprovals] = useState([]);

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

  // Authentication Helpers
  const login = (newToken, newUser) => {
    localStorage.setItem('df360_token', newToken);
    localStorage.setItem('df360_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    navigate('overview');
    addToast('Welcome back', `Signed in as ${newUser.email}`, 'success');
  };

  const logout = () => {
    localStorage.removeItem('df360_token');
    localStorage.removeItem('df360_user');
    setToken(null);
    setUser(null);
    navigate('landing');
    addToast('Signed Out', 'You have successfully signed out.', 'info');
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

  useEffect(() => {
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
      navigate('signin');
      addToast('Session Expired', 'Please sign in again.', 'warning');
    };
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        pageParams,
        navigate,
        token,
        user,
        isAuthenticated,
        login,
        logout,
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
