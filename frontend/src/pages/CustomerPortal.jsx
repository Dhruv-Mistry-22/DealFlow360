import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function CustomerPortal() {
  const { navigate, setIsNewQuoteOpen, addToast } = useApp();
  const [selectedAccount, setSelectedAccount] = useState('acme');

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await api.get('/api/v1/customers');
        const mapped = data.map(c => ({
          id: c.id.toString(),
          name: c.name,
          email: c.email || c.contact_email || 'N/A',
          phone: c.phone || 'N/A'
        }));
        setClients(mapped);
        if (mapped.length > 0 && selectedAccount === 'acme') {
          setSelectedAccount(mapped[0].id);
        }
      } catch (err) {
        addToast('Error', 'Failed to fetch customers', 'error');
      }
    };
    fetchCustomers();
  }, [addToast, selectedAccount]);

  const currentClient = clients.find((c) => c.id === selectedAccount) || clients[0];

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div>
          <h1 className="font-title-large text-title-large text-on-surface tracking-tight font-black">
            Customer Portal &amp; Account 360
          </h1>
          <p className="font-body-medium text-body-medium text-on-surface-variant max-w-3xl">
            Manage institutional accounts, shipper master credit lines, active contract commitments, and dedicated logistics contacts.
          </p>
        </div>

        <div className="flex items-center gap-spacing-sm shrink-0">
          <button
            onClick={() => addToast('CRM Exported', 'Downloaded client directory & ledger balances.', 'info')}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 rounded-lg bg-surface text-on-surface hover:bg-surface-variant border border-outline transition-colors shadow-sm font-label-large text-label-large"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export CRM Data</span>
          </button>
          <button
            onClick={() => setIsNewQuoteOpen(true)}
            className="flex items-center gap-spacing-xs px-spacing-md py-2.5 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary transition-colors shadow-md font-label-large text-label-large"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Request Instant Quote</span>
          </button>
        </div>
      </div>


      {/* Client Selector & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-spacing-lg">
        {/* Client List (4 cols) */}
        <div className="lg:col-span-4 bg-surface rounded-xl p-spacing-md shadow-sm border border-outline">
          <h2 className="font-bold text-sm text-on-surface mb-3 px-2">Institutional Shippers</h2>
          <div className="space-y-2">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedAccount(client.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedAccount === client.id
                    ? 'bg-primary-container border-secondary-container shadow-sm'
                    : 'bg-surface hover:bg-surface-variant border-outline'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface">{client.name}</span>
                </div>
                <div className="text-xs text-on-surface-variant mt-1">
                  Email: <strong>{client.email}</strong>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Client 360 View (8 cols) */}
        <div className="lg:col-span-8 bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-title-small text-title-small text-on-surface font-extrabold">
                  {currentClient?.name}
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Contact: <strong>{currentClient?.email}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('quotations')}
                className="px-3 py-1.5 bg-surface-variant hover:bg-surface text-secondary text-xs font-bold rounded-lg border border-outline transition-colors"
              >
                View Lane Quotes
              </button>
              <button
                onClick={() => navigate('fulfillment')}
                className="px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-secondary transition-colors"
              >
                Track Dispatches
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
