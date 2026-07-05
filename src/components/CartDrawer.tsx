/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PRODUCTS } from '../data/products';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartDrawerOpen,
    setCartDrawerOpen,
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

  React.useEffect(() => {
    if (!isCartDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, setCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  // Calculate financials
  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.variant.price) * item.quantity, 0);
  const discountAmount = subtotal * (couponDiscount / 100);
  const total = subtotal - discountAmount;

  // Free shipping threshold
  const freeShippingThreshold = 5000; // 5000 Rupees
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const progressPercentage = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyCoupon(promoInput);
    if (success) {
      setPromoInput('');
    }
  };

  const handleCheckoutRedirect = () => {
    setCartDrawerOpen(false);
    // In a production Shopify store, we serialize the cart lines into a Shopify Checkout permutation link:
    // e.g. https://apna-adda-store.myshopify.com/cart/31241512415:1,12451251214:2
    // Let's create a simulated clean alert/modal or let the user experience the production architecture redirecting.
    const checkoutLink = `https://apna-adda-store.myshopify.com/cart/${cart.map(i => `${i.variant.id}:${i.quantity}`).join(',')}`;
    
    // Alert the user with a stylized alert or simulation
    alert(`Redirecting to Shopify Secure Checkout...\n\nDestination:\n${checkoutLink}\n\nShopify handles secure credit cards, UPI, EMI, and logistics fulfillment seamlessly.`);
  };

  const handleGoToCartPage = () => {
    setCartDrawerOpen(false);
    navigateTo('cart');
  };

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div id="cart-drawer-content" className="w-full max-w-md bg-white dark:bg-stone-950 border-l border-stone-200 dark:border-stone-800 h-full flex flex-col shadow-2xl animate-drawer-in">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900 dark:text-stone-100" />
            <h2 className="font-display font-bold text-base uppercase tracking-wider">Your Bag ({cart.length})</h2>
          </div>
          <button
            id="btn-close-cart"
            onClick={() => setCartDrawerOpen(false)}
            className="p-2 -mr-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Gauge */}
        {cart.length > 0 && (
          <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900 border-b border-stone-100 dark:border-stone-900">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span>
                {remainingForFreeShipping > 0 ? (
                  <>Add <span className="font-bold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more for free express shipping</>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">You unlocked free shipping!</span>
                )}
              </span>
              <span className="font-bold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-950 dark:bg-stone-50 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-stone-400" />
              </div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-2">Bag is empty</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[240px] mb-6">
                Discover curated minimalist daily objects and find something that resonates.
              </p>
              <button
                id="btn-cart-shop-now"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigateTo('shop');
                }}
                className="btn-premium-primary py-3 px-6 text-[10px]"
              >
                Shop Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex gap-4 pb-4 border-b border-stone-100 dark:border-stone-900 last:border-0 last:pb-0 group"
              >
                <div
                  className="w-20 h-24 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shrink-0 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigateTo('product', { handle: item.product.handle });
                  }}
                >
                  <img
                    src={item.variant.image?.url || item.product.images[0]?.url}
                    alt={item.product.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4
                        className="text-xs font-display font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-luxury-gold transition-colors cursor-pointer"
                        onClick={() => {
                          setCartDrawerOpen(false);
                          navigateTo('product', { handle: item.product.handle });
                        }}
                      >
                        {item.product.title}
                      </h4>
                      <button
                        id={`btn-remove-item-${item.id}`}
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 p-1 -mr-1 transition-colors"
                        aria-label="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-stone-500 mt-1">{item.variant.title}</p>
                  </div>

                  <div className="flex justify-between items-end">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-none overflow-hidden">
                      <button
                        id={`btn-qty-minus-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-mono">{item.quantity}</span>
                      <button
                        id={`btn-qty-plus-${item.id}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-mono font-bold">
                      ₹{(parseFloat(item.variant.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* CRO Upsell / Cross-Sell Block */}
          {cart.length > 0 && (() => {
            const inCartIds = cart.map(i => i.product.id);
            const crossSellProd = PRODUCTS.find(p => !inCartIds.includes(p.id));
            if (!crossSellProd) return null;
            return (
              <div className="mt-8 pt-6 border-t border-stone-150 dark:border-stone-850 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold dark:text-luxury-gold-dark font-mono block">Complete Your Selection</span>
                <div className="p-3.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center gap-3">
                  <div className="w-12 h-14 bg-white dark:bg-stone-950 border border-stone-150 dark:border-stone-800 overflow-hidden shrink-0">
                    <img src={crossSellProd.images[0]?.url} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[10px] font-bold uppercase font-display truncate text-stone-900 dark:text-stone-100">{crossSellProd.title}</h5>
                    <p className="text-[10px] font-mono text-stone-500">₹{parseFloat(crossSellProd.priceRange.minVariantPrice).toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(crossSellProd, crossSellProd.variants[0], 1);
                      addToast(`${crossSellProd.title} added to your bag!`, 'success');
                    }}
                    className="px-3 py-1.5 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-bold text-[9px] font-mono tracking-wider uppercase shrink-0 transition-colors hover:bg-luxury-gold hover:text-white"
                  >
                    + ADD
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer Pricing Checkout Block */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-100 dark:border-stone-900 space-y-4">
            
            {/* Coupon Code Entry */}
            {!couponCode ? (
              <div className="space-y-2">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    id="input-coupon-code"
                    type="text"
                    placeholder="Promo Code (e.g. WELCOME10)"
                    className="flex-1 px-3 py-2 border border-stone-200 dark:border-stone-800 text-xs font-mono uppercase bg-stone-50 dark:bg-stone-900 focus:outline-hidden text-stone-900 dark:text-stone-100"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-bold text-[10px] tracking-wider uppercase transition-all"
                  >
                    Apply
                  </button>
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
                      className="flex-1 text-left p-2 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-850 hover:border-luxury-gold text-[9px] font-mono group transition-colors"
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
                      className="flex-1 text-left p-2 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-850 hover:border-luxury-gold text-[9px] font-mono group transition-colors"
                    >
                      <span className="font-bold text-stone-800 dark:text-stone-200 group-hover:text-luxury-gold block">ADDA20</span>
                      <span className="text-[8px] text-stone-400 font-sans block mt-0.5">20% Off heavy discount</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/40 text-emerald-800 dark:text-emerald-300 rounded-none text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-mono font-bold tracking-wider">{couponCode} ({couponDiscount}% Off)</span>
                </div>
                <button
                  id="btn-remove-coupon"
                  onClick={removeCoupon}
                  className="text-stone-500 hover:text-stone-900 dark:text-emerald-400 dark:hover:text-emerald-200 font-bold"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Subtotal</span>
                <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Promo Discount ({couponDiscount}%)</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-stone-500">
                <span>Shipping</span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  {subtotal >= freeShippingThreshold ? 'FREE' : '₹150.00'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-stone-100 dark:border-stone-900">
                <span>Total Est.</span>
                <span className="font-mono">
                  ₹{(total + (subtotal >= freeShippingThreshold ? 0 : 150)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                id="btn-cart-view-bag"
                onClick={handleGoToCartPage}
                className="btn-premium-secondary py-3 text-[10px]"
              >
                View Full Bag
              </button>
              <button
                id="btn-cart-checkout"
                onClick={handleCheckoutRedirect}
                className="btn-premium-primary py-3 text-[10px]"
              >
                Checkout
              </button>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-stone-400 font-mono mt-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Security verified checkout via Shopify</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
