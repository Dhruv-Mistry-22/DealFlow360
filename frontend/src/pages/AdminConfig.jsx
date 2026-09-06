import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function AdminConfig() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState('discounts');

  // Discount Tiers
  const [tiers, setTiers] = useState([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  const [newTier, setNewTier] = useState({ customer_tier: 'STANDARD', product_category: 'HARDWARE', ceiling_pct: 10.0 });
  const [tiersError, setTiersError] = useState(null);

  // Warehouses
  const [warehouses, setWarehouses] = useState([]);
  const [whLoading, setWhLoading] = useState(true);
  const [newWh, setNewWh] = useState({ name: '', location: '' });

  // Subscription Plans (products with billing_cycle != ONE_TIME)
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({ name: '', base_price: '', billing_cycle: 'MONTHLY', category: 'SUBSCRIPTION', description: '' });

  useEffect(() => {
    fetchTiers();
    fetchWarehouses();
    fetchPlans();
  }, []);

  const fetchTiers = async () => {
    try {
      const data = await api.get('/api/v1/discounts/tiers');
      setTiers(data || []);
    } catch (e) { setTiersError(e.message); }
    finally { setTiersLoading(false); }
  };

  const fetchWarehouses = async () => {
    try {
      const data = await api.get('/api/v1/catalog/warehouses').catch(() => []);
      setWarehouses(data || []);
    } catch { setWarehouses([]); }
    finally { setWhLoading(false); }
  };

  const fetchPlans = async () => {
    try {
      const data = await api.get('/api/v1/products');
      setPlans((data || []).filter(p => p.billing_cycle !== 'ONE_TIME'));
    } catch { setPlans([]); }
    finally { setPlansLoading(false); }
  };

  const handleAddTier = async () => {
    if (!newTier.ceiling_pct) return addToast('Validation', 'Please fill all fields.', 'error');
    try {
      await api.post('/api/v1/discounts/tiers', newTier);
      addToast('Tier Added', 'Discount tier saved.', 'success');
      setNewTier({ customer_tier: 'STANDARD', product_category: 'HARDWARE', ceiling_pct: 10.0 });
      fetchTiers();
    } catch (e) { addToast('Error', e.message, 'error'); }
  };

  const handleAddWarehouse = async () => {
    if (!newWh.name) return addToast('Validation', 'Warehouse name is required.', 'error');
    try {
      await api.post('/api/v1/catalog/warehouses', newWh);
      addToast('Warehouse Added', 'Warehouse created successfully.', 'success');
      setNewWh({ name: '', location: '' });
      fetchWarehouses();
    } catch (e) { addToast('Error', e.message, 'error'); }
  };

  const handleAddPlan = async () => {
    if (!newPlan.name || !newPlan.base_price) return addToast('Validation', 'Name and price required.', 'error');
    try {
      await api.post('/api/v1/products', { ...newPlan, base_price: parseFloat(newPlan.base_price) });
      addToast('Plan Added', 'Subscription plan created.', 'success');
      setNewPlan({ name: '', base_price: '', billing_cycle: 'MONTHLY', category: 'SUBSCRIPTION', description: '' });
      fetchPlans();
    } catch (e) { addToast('Error', e.message, 'error'); }
  };

  const tabs = [
    { id: 'discounts', label: 'Discount Tiers', icon: 'percent' },
    { id: 'warehouses', label: 'Warehouses', icon: 'warehouse' },
    { id: 'plans', label: 'Subscription Plans', icon: 'subscriptions' },
  ];

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Header */}
      <div className="bg-surface rounded-xl p-spacing-lg shadow-sm border border-outline">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px]">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="font-title-large text-title-large text-on-secondary-container font-black">
              Backend Configuration
            </h1>
            <p className="text-xs text-on-surface-variant">
              Manage discount tiers, warehouses, and subscription plans
            </p>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-surface-variant/50 p-1 rounded-xl border border-outline w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-surface text-primary shadow-sm border border-outline'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── DISCOUNT TIERS TAB ── */}
      {activeTab === 'discounts' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Add Form */}
          <div className="bg-surface rounded-xl p-6 border border-outline shadow-sm">
            <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">add_circle</span>
              Add Discount Tier
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Customer Tier</label>
                <select
                  value={newTier.customer_tier}
                  onChange={e => setNewTier({ ...newTier, customer_tier: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-variant text-sm text-on-surface"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="GOLD">Gold</option>
                  <option value="PLATINUM">Platinum</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Product Category</label>
                <select
                  value={newTier.product_category}
                  onChange={e => setNewTier({ ...newTier, product_category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-variant text-sm text-on-surface"
                >
                  <option value="HARDWARE">Hardware</option>
                  <option value="SERVICES">Services</option>
                  <option value="SUBSCRIPTION">Subscription</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Ceiling % (max discount)</label>
                <input
                  type="number"
                  min="0" max="100" step="0.5"
                  value={newTier.ceiling_pct}
                  onChange={e => setNewTier({ ...newTier, ceiling_pct: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-variant text-sm text-on-surface"
                />
              </div>
              <button
                onClick={handleAddTier}
                className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm hover:bg-secondary transition-colors"
              >
                Save Tier
              </button>
            </div>
          </div>

          {/* Tiers List */}
          <div className="xl:col-span-2 bg-surface rounded-xl border border-outline shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-surface-variant border-b border-outline">
              <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Configured Tiers</h2>
            </div>
            {tiersLoading ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">Loading...</div>
            ) : tiersError ? (
              <div className="p-8 text-center text-sm text-tertiary">{tiersError}</div>
            ) : tiers.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">No tiers configured yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-variant/50">
                    <th className="py-3 px-4 text-left">Customer Tier</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-right">Max Discount</th>
                    <th className="py-3 px-4 text-left">Approval Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {tiers.map((t, i) => (
                    <tr key={i} className="hover:bg-surface-variant/30">
                      <td className="py-3 px-4 font-semibold text-on-surface">{t.customer_tier}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{t.product_category}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-primary">{t.ceiling_pct}%</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold">
                          {t.required_approval_level || 'NONE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── WAREHOUSES TAB ── */}
      {activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-surface rounded-xl p-6 border border-outline shadow-sm">
            <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">add_circle</span>
              Add Warehouse
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Warehouse Name</label>
                <input
                  type="text"
                  placeholder="e.g. Main Warehouse"
                  value={newWh.name}
                  onChange={e => setNewWh({ ...newWh, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-variant text-sm text-on-surface"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Chicago, IL"
                  value={newWh.location}
                  onChange={e => setNewWh({ ...newWh, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-variant text-sm text-on-surface"
                />
              </div>
              <button
                onClick={handleAddWarehouse}
                className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm hover:bg-secondary transition-colors"
              >
                Create Warehouse
              </button>
            </div>
          </div>

          <div className="xl:col-span-2 bg-surface rounded-xl border border-outline shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-surface-variant border-b border-outline">
              <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Registered Warehouses</h2>
            </div>
            {whLoading ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">Loading...</div>
            ) : warehouses.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">No warehouses registered. Add one using the form.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-variant/50">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {warehouses.map(w => (
                    <tr key={w.id} className="hover:bg-surface-variant/30">
                      <td className="py-3 px-4 font-mono text-xs text-on-surface-variant">WH-{w.id}</td>
                      <td className="py-3 px-4 font-semibold text-on-surface">{w.name}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{w.location || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── SUBSCRIPTION PLANS TAB ── */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-surface rounded-xl p-6 border border-outline shadow-sm">
            <h2 className="font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">add_circle</span>
              Add Subscription Plan
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Plan Name</label>
                <input
                  type="text" placeholder="e.g. Basic SaaS Monthly"
                  value={newPlan.name}
                  onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-variant text-sm text-on-surface"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Price per Cycle ($)</label>
                <input
                  type="number" min="0" placeholder="499.00"
                  value={newPlan.base_price}
                  onChange={e => setNewPlan({ ...newPlan, base_price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-variant text-sm text-on-surface"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Billing Cycle</label>
                <select
                  value={newPlan.billing_cycle}
                  onChange={e => setNewPlan({ ...newPlan, billing_cycle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-variant text-sm text-on-surface"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1 block">Description (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Plan details..."
                  value={newPlan.description}
                  onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-variant text-sm text-on-surface resize-none"
                />
              </div>
              <button
                onClick={handleAddPlan}
                className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm hover:bg-secondary transition-colors"
              >
                Create Plan
              </button>
            </div>
          </div>

          <div className="xl:col-span-2 bg-surface rounded-xl border border-outline shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-surface-variant border-b border-outline">
              <h2 className="font-bold text-on-surface text-sm uppercase tracking-wider">Active Subscription Plans</h2>
            </div>
            {plansLoading ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">Loading...</div>
            ) : plans.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant text-sm">No subscription plans found.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-variant/50">
                    <th className="py-3 px-4 text-left">Plan Name</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-left">Cycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {plans.map(p => (
                    <tr key={p.id} className="hover:bg-surface-variant/30">
                      <td className="py-3 px-4 font-semibold text-on-surface">{p.name}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{p.category}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-on-secondary-container">
                        ${Number(p.base_price).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold">
                          {p.billing_cycle}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
