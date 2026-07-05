/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PRODUCTS } from '../data/products';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ShieldCheck, Tag, HelpCircle } from 'lucide-react';

export default function CartView() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    navigateTo,
    addToCart,
    addToast,
  } = useAppStore();

  const [promoInput, setPromoInput] = useState('');

  // Calculate prices
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.variant.price) * item.quantity, 0);
  const discountAmount = subtotal * (couponDiscount / 100);
  const total = subtotal - discountAmount;

  // Shipping
  const freeShippingThreshold = 5000;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const grandTotal = total + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyCoupon(promoInput);
    setPromoInput('');
  };

  const handleCheckoutRedirect = () => {
    const checkoutLink = `https://apna-adda-store.myshopify.com/cart/${cart.map(i => `${i.variant.id}:${i.quantity}`).join(',')}`;
    alert(`Redirecting to Secure Shopify Checkout...\n\nPayment details and UPI options will open on:\n${checkoutLink}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6 text-stone-400" />
        </div>
        <h2 className="font-display font-bold text-2xl uppercase">Your bag is empty</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          You haven't added any design objects yet. Let's browse our architectural catalogs.
        </p>
        <button onClick={() => navigateTo('shop')} className="btn-premium-primary text-[10px] px-8">
          Shop Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 mb-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Shopping Cart</span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase mt-1 font-display">YOUR SHOPPING BAG</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Cart items table (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-stone-200 dark:border-stone-800 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            <span className="col-span-6">Product details</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Price</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                id={`cart-row-${item.id}`}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-6 border-b border-stone-100 dark:border-stone-900"
              >
                {/* Image and titles */}
                <div className="col-span-12 md:col-span-6 flex gap-4">
                  <div className="w-20 h-24 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 overflow-hidden shrink-0">
                    <img
                      src={item.variant.image?.url || item.product.images[0]?.url}
                      alt={item.product.title}
                      className="w-full h-full object-cover grayscale"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1 justify-center flex flex-col min-w-0">
                    <h3
                      onClick={() => navigateTo('product', { handle: item.product.handle })}
                      className="text-sm font-display font-bold text-stone-900 dark:text-stone-100 uppercase hover:text-luxury-gold cursor-pointer truncate"
                    >
                      {item.product.title}
                    </h3>
                    <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Variant: {item.variant.title}</p>
                    <button
                      id={`btn-cart-page-remove-${item.id}`}
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] font-mono text-rose-500 hover:underline flex items-center gap-1 mt-1.5 self-start"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>

                {/* Quantity column */}
                <div className="col-span-6 md:col-span-2 flex justify-start md:justify-center">
                  <div className="flex items-center border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                    <button
                      id={`btn-cart-page-minus-${item.id}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 font-mono text-xs font-bold">{item.quantity}</span>
                    <button
                      id={`btn-cart-page-plus-${item.id}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Single price column */}
                <div className="col-span-3 md:col-span-2 text-left md:text-right">
                  <span className="md:hidden text-[9px] font-bold uppercase text-stone-400 block mb-0.5">Unit price</span>
                  <span className="text-xs font-mono text-stone-500">₹{parseFloat(item.variant.price).toLocaleString('en-IN')}</span>
                </div>

                {/* Combined total column */}
                <div className="col-span-3 md:col-span-2 text-right">
                  <span className="md:hidden text-[9px] font-bold uppercase text-stone-400 block mb-0.5">Total cost</span>
                  <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                    ₹{(parseFloat(item.variant.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

              </div>
            ))}

            {/* CRO Cross-Sell Recommendation Card */}
            {cart.length > 0 && (() => {
              const inCartIds = cart.map(i => i.product.id);
              const crossSellProd = PRODUCTS.find(p => !inCartIds.includes(p.id));
              if (!crossSellProd) return null;
              return (
                <div className="mt-8 pt-8 border-t border-stone-200/60 dark:border-stone-800/60 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold dark:text-luxury-gold-dark font-mono block">Curated Accent Suggestions</span>
                    <h4 className="text-sm font-bold uppercase font-display mt-0.5">COMPLETE YOUR ENSEMBLE</h4>
                  </div>
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-850 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-16 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 overflow-hidden shrink-0">
                        <img src={crossSellProd.images[0]?.url} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold uppercase font-display text-stone-900 dark:text-stone-100 truncate max-w-[150px] sm:max-w-xs">{crossSellProd.title}</h5>
                        <p className="text-[11px] font-mono text-stone-500 mt-0.5">₹{parseFloat(crossSellProd.priceRange.minVariantPrice).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(crossSellProd, crossSellProd.variants[0], 1);
                        addToast(`${crossSellProd.title} added to your selection!`, 'success');
                      }}
                      className="px-4 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-950 font-bold text-[10px] tracking-wider uppercase shrink-0 hover:bg-luxury-gold hover:text-white transition-colors"
                    >
                      + ADD TO BAG
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>

        {/* Right Column: Checkout Summary Panel (4 Columns) */}
        <div className="lg:col-span-4">
          <div className="border border-stone-200 dark:border-stone-800 p-6 md:p-8 bg-stone-50 dark:bg-stone-900/40 space-y-6">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider pb-3 border-b border-stone-200/50 dark:border-stone-800/50">
              Bag Summary
            </h3>

            {/* Promo coupon input */}
            {!couponCode ? (
              <div className="space-y-2">
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Have a promotional coupon?</label>
                  <div className="flex gap-2">
                    <input
                      id="cart-promo-input"
                      type="text"
                      placeholder="WELCOM10 / ADDA15"
                      className="flex-1 px-3 py-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-mono uppercase focus:outline-hidden text-stone-900 dark:text-white"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <button type="submit" className="px-4 py-2 bg-stone-900 text-white dark:bg-white dark:text-stone-950 font-bold text-[10px] tracking-wider uppercase">
                      Apply
                    </button>
                  </div>
                </form>
                {/* Coupon suggestions */}
                <div className="space-y-1 pt-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 font-mono">Suggested Active Offers:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        applyCoupon('WELCOME10');
                        addToast('WELCOME10 applied successfully!', 'success');
                      }}
                      className="flex-1 text-left p-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-luxury-gold text-[9px] font-mono group transition-colors"
                    >
                      <span className="font-bold text-stone-800 dark:text-stone-200 group-hover:text-luxury-gold block">WELCOME10</span>
                      <span className="text-[8px] text-stone-400 font-sans block mt-0.5">10% Off welcome order</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        applyCoupon('ADDA20');
                        addToast('ADDA20 applied successfully!', 'success');
                      }}
                      className="flex-1 text-left p-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 hover:border-luxury-gold text-[9px] font-mono group transition-colors"
                    >
                      <span className="font-bold text-stone-800 dark:text-stone-200 group-hover:text-luxury-gold block">ADDA20</span>
                      <span className="text-[8px] text-stone-400 font-sans block mt-0.5">20% Off heavy discount</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs flex justify-between items-center font-mono">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{couponCode} ({couponDiscount}% OFF)</span>
                </div>
                <button onClick={removeCoupon} className="font-bold underline text-stone-500 hover:text-stone-900">Remove</button>
              </div>
            )}

            {/* Calculations breakdown */}
            <div className="space-y-2.5 pt-2 border-t border-stone-200/50 dark:border-stone-800/50">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Items Subtotal</span>
                <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Promo Discount</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-stone-500">
                <span>Shipping Fee</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-stone-900 dark:text-white">
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>

              {/* Shipping helper */}
              {subtotal < freeShippingThreshold && (
                <p className="text-[10px] font-mono text-stone-400 leading-snug">
                  Add <span className="font-bold text-stone-600 dark:text-stone-300">₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</span> more to qualify for Free Express Shipping.
                </p>
              )}

              <div className="flex justify-between text-sm font-bold pt-4 border-t border-stone-200 dark:border-stone-800">
                <span>Estimated Total</span>
                <span className="font-mono text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* CTA checkout redirects */}
            <div className="space-y-3 pt-2">
              <button
                id="btn-cart-page-checkout"
                onClick={handleCheckoutRedirect}
                className="btn-premium-primary w-full py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('shop')}
                className="w-full text-center py-3 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                Continue Browsing
              </button>
            </div>

            {/* Trust assurances */}
            <div className="p-4 border border-stone-200/60 dark:border-stone-800/60 bg-white dark:bg-stone-950 flex gap-3.5 items-start">
              <ShieldCheck className="w-5 h-5 text-stone-900 dark:text-stone-100 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-900 dark:text-white">Authentic Escrow Shopify SSL</h4>
                <p className="text-[9px] text-stone-400 leading-relaxed">Transactions are tokenized end-to-end directly in Shopify networks to shield card credentials and UPI accounts.</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
