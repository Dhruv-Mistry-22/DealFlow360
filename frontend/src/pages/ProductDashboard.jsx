import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

export default function ProductDashboard() {
  const { navigate, setIsNewQuoteOpen, addToast } = useApp();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/api/v1/products');
        const mapped = data.map(p => ({
          sku: `SKU-${p.id.toString().padStart(4, '0')}`,
          name: p.name,
          category: p.category || 'General',
          specs: p.description || 'Standard Specs',
          baseRate: `$${Number(p.base_price).toLocaleString()} / Unit`,
        }));
        setProducts(mapped);
      } catch (err) {
        addToast('Error', 'Failed to fetch products', 'error');
      }
    };
    fetchProducts();
  }, [addToast]);

  return (
    <div className="flex flex-col w-full gap-spacing-lg pb-spacing-2xl">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-spacing-md bg-surface p-spacing-lg rounded-xl shadow-sm border border-outline">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-title-large text-title-large text-on-secondary-container tracking-tight font-black">
              Product Catalog &amp; Multi-Modal Freight Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-mono text-xs">
              Cass Index sync: 12m ago
            </span>
          </div>
          <p className="font-body-large text-body-large text-on-surface-variant mt-1">
            Standardized freight SKUs, equipment specifications, contracted baseline tariffs, and dynamic fuel index rules.
          </p>
        </div>

      </div>



      {/* Products Table */}
      <div className="bg-surface rounded-xl shadow-sm border border-outline overflow-hidden">
        <div className="px-6 py-4 border-b border-outline flex items-center justify-between bg-surface">
          <div>
            <h2 className="font-title-small text-title-small text-on-secondary-container">
              Multi-Modal Freight Asset Inventory
            </h2>
            <p className="text-xs text-on-surface-variant">Click any SKU to inspect tariff formula and technical equipment specs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="py-3 px-6">SKU Identifier</th>
                <th className="py-3 px-4">Freight Asset Name</th>
                <th className="py-3 px-4">Category &amp; Specs</th>
                <th className="py-3 px-4 text-right">Baseline Tariff</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {products.map((p) => (
                <tr
                  key={p.sku}
                  className="hover:bg-surface-variant/40 transition-colors cursor-pointer"
                  onClick={() => navigate('product-detail', { sku: p.sku })}
                >
                  <td className="py-4 px-6 font-mono font-bold text-secondary text-sm">
                    {p.sku}
                  </td>
                  <td className="py-4 px-4 font-bold text-on-surface text-sm">{p.name}</td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-on-surface">{p.category}</div>
                    <div className="text-[11px] text-on-surface-variant">{p.specs}</div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-on-secondary-container text-sm">
                    {p.baseRate}
                  </td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate('product-detail', { sku: p.sku })}
                        className="px-3 py-1.5 rounded-lg bg-surface-variant hover:bg-surface text-secondary text-xs font-semibold border border-outline transition-colors"
                      >
                        Inspect SKU
                      </button>
                      <button
                        onClick={() => setIsNewQuoteOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-tertiary hover:opacity-90 text-on-tertiary text-xs font-semibold shadow-sm"
                      >
                        Quote
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
