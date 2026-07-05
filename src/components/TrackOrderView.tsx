/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Search, MapPin, Truck, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TrackOrderView() {
  const { customer, addToast } = useAppStore();
  const [orderNum, setOrderNum] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNum.trim()) {
      addToast('Please enter an order number', 'error');
      return;
    }

    setHasSearched(true);
    const upperOrder = orderNum.toUpperCase().trim();

    // Check preloaded orders from store or check mock database
    const localOrders = customer?.orders || [];
    const found = localOrders.find(o => o.orderNumber === upperOrder);

    if (found) {
      setSearchedOrder(found);
      addToast('Order found', 'success');
    } else {
      // Simulate checking a global mock database for dropshipping orders
      if (upperOrder === 'AA-2026-1001') {
        setSearchedOrder({
          orderNumber: 'AA-2026-1001',
          processedAt: '2026-07-01T14:30:00Z',
          totalPrice: '2499.00',
          fulfillmentStatus: 'FULFILLED',
          trackingCompany: 'Delhivery',
          trackingNumber: 'DEL9876543210',
          trackingUrl: 'https://www.delhivery.com/',
          lineItems: [{ title: 'Solitude Minimal Ceramic Vase', quantity: 1, variant: { price: '2499.00' } }]
        });
        addToast('Order found', 'success');
      } else if (upperOrder === 'AA-2026-1002') {
        setSearchedOrder({
          orderNumber: 'AA-2026-1002',
          processedAt: '2026-07-04T09:15:00Z',
          totalPrice: '14999.00',
          fulfillmentStatus: 'UNFULFILLED',
          lineItems: [{ title: 'Aura Soundbar Companion', quantity: 1, variant: { price: '14999.00' } }]
        });
        addToast('Order found', 'success');
      } else {
        setSearchedOrder(null);
        addToast('Order not found. Please try AA-2026-1001 for testing.', 'error');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Logistics Hub</span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 uppercase font-display">Track Your Shipment</h1>
        <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto">
          Enter your unique order sequence starting with 'AA' (e.g., AA-2026-1001) to trace real-time dropshipping fulfillment.
        </p>
      </div>

      {/* Tracker Search Form */}
      <div className="border border-stone-200 dark:border-stone-800 p-6 md:p-8 bg-white dark:bg-stone-900 mb-8">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Order Number (e.g., AA-2026-1001)"
              className="w-full pl-12 pr-4 py-3.5 rounded-none border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white uppercase font-mono tracking-wider focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
              value={orderNum}
              onChange={(e) => setOrderNum(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-premium-primary sm:w-auto px-10">
            Trace Order
          </button>
        </form>
      </div>

      {/* Search Result */}
      {hasSearched && (
        <div className="animate-slide-up">
          {searchedOrder ? (
            <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 md:p-10 space-y-8">
              
              {/* Order Info Row */}
              <div className="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-stone-100 dark:border-stone-900">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Order Number</span>
                  <h3 className="text-lg font-display font-black uppercase text-stone-900 dark:text-stone-100">{searchedOrder.orderNumber}</h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Fulfillment Status</span>
                  <p className={`text-xs font-mono font-bold mt-1 uppercase ${
                    searchedOrder.fulfillmentStatus === 'FULFILLED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
                  }`}>
                    {searchedOrder.fulfillmentStatus}
                  </p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-6">Delivery Milestones</span>
                <div className="relative">
                  {/* Step Line */}
                  <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-stone-200 dark:bg-stone-800"></div>

                  <div className="space-y-8">
                    {/* Milestone 3: Delivered (if FULFILLED) */}
                    <div className="relative flex gap-6 items-start">
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                        searchedOrder.fulfillmentStatus === 'FULFILLED'
                          ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-600'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400'
                      }`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-display font-bold text-stone-900 dark:text-stone-100 uppercase">Delivered</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                          {searchedOrder.fulfillmentStatus === 'FULFILLED'
                            ? 'Delivered securely to your residence address.'
                            : 'Package is still traveling to hub.'}
                        </p>
                      </div>
                    </div>

                    {/* Milestone 2: Shipped */}
                    <div className="relative flex gap-6 items-start">
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 z-10 ${
                        searchedOrder.fulfillmentStatus === 'FULFILLED'
                          ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 border-stone-900'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400'
                      }`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-display font-bold text-stone-900 dark:text-stone-100 uppercase">Shipped Out</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                          {searchedOrder.fulfillmentStatus === 'FULFILLED' ? (
                            <>
                              Dispatched with <span className="font-bold">{searchedOrder.trackingCompany}</span>.<br />
                              Tracking Reference: <span className="font-mono font-bold text-stone-900 dark:text-stone-100">{searchedOrder.trackingNumber}</span>
                            </>
                          ) : (
                            'Waiting for carrier allocation.'
                          )}
                        </p>
                        {searchedOrder.trackingUrl && (
                          <a
                            href={searchedOrder.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-luxury-gold hover:underline mt-2 font-mono"
                          >
                            Live Tracking Gateway <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Milestone 1: Confirmed */}
                    <div className="relative flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-950 border border-stone-900 flex items-center justify-center shrink-0 z-10">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-display font-bold text-stone-900 dark:text-stone-100 uppercase">Order Confirmed</h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                          System processed payment. Order dispatched to premium supply chain on{' '}
                          <span className="font-mono font-bold text-stone-950 dark:text-stone-50">
                            {new Date(searchedOrder.processedAt).toLocaleDateString()}
                          </span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="pt-6 border-t border-stone-100 dark:border-stone-900">
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block mb-3">Fulfillment Summary</span>
                <div className="space-y-1">
                  {searchedOrder.lineItems.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-xs font-mono text-stone-600 dark:text-stone-400">
                      <span>{item.title} (x{item.quantity})</span>
                      <span>₹{parseFloat(item.variant.price).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
              <p className="text-sm text-stone-500">No active tracking record found for order sequence "{orderNum}". Please check spelling and retry.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
