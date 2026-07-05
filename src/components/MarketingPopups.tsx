/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PRODUCTS } from '../data/products';
import { X, Copy, Check, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';

interface PurchaseAlert {
  name: string;
  city: string;
  productTitle: string;
  productImage: string;
  timeAgo: string;
}

export default function MarketingPopups() {
  const { navigateTo, addToast, applyCoupon, cart } = useAppStore();

  // 1. Welcome Coupon Popup State
  const [showWelcome, setShowWelcome] = useState(false);
  const [copiedWelcome, setCopiedWelcome] = useState(false);

  // 2. Exit Intent Popup State
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [copiedExit, setCopiedExit] = useState(false);
  const [exitTriggered, setExitTriggered] = useState(false);

  // 3. Live Recent Purchase Alerts State
  const [currentAlert, setCurrentAlert] = useState<PurchaseAlert | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  // Indian customer database for social proof
  const indianPurchases: PurchaseAlert[] = [
    { name: 'Rohan', city: 'Mumbai', productTitle: 'Aura Soundbar Companion', productImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=120&auto=format&fit=crop', timeAgo: '2 minutes ago' },
    { name: 'Priya', city: 'Delhi NCR', productTitle: 'Orbit MagSafe Wireless Charger', productImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=120&auto=format&fit=crop', timeAgo: '5 minutes ago' },
    { name: 'Aniket', city: 'Bengaluru', productTitle: 'Solitude Ceramic Vase', productImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=120&auto=format&fit=crop', timeAgo: '12 minutes ago' },
    { name: 'Meera', city: 'Pune', productTitle: 'Zen Desk organizer', productImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=120&auto=format&fit=crop', timeAgo: '9 minutes ago' },
    { name: 'Vikram', city: 'Hyderabad', productTitle: 'Aether ANC Studio Headphones', productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=120&auto=format&fit=crop', timeAgo: '15 minutes ago' },
    { name: 'Siddharth', city: 'Chennai', productTitle: 'Soma Stone Incense Burner', productImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=120&auto=format&fit=crop', timeAgo: '3 minutes ago' },
    { name: 'Kirti', city: 'Kolkata', productTitle: 'Minimalist Leather Desk Pad', productImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=120&auto=format&fit=crop', timeAgo: '1 minute ago' }
  ];

  // Initialize Welcome Coupon Popup
  useEffect(() => {
    // Check if user has already seen or closed it in this session
    const seenWelcome = sessionStorage.getItem('apna_adda_seen_welcome');
    if (!seenWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
        sessionStorage.setItem('apna_adda_seen_welcome', 'true');
      }, 5000); // 5 seconds delay
      return () => clearTimeout(timer);
    }
  }, []);

  // Initialize Exit Intent Detector
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // If mouse leaves the top boundary of the window, trigger exit intent
      if (e.clientY < 20 && !exitTriggered) {
        const seenExit = sessionStorage.getItem('apna_adda_seen_exit');
        const isCartEmpty = cart.length === 0;

        if (!seenExit && !showWelcome) {
          setShowExitIntent(true);
          setExitTriggered(true);
          sessionStorage.setItem('apna_adda_seen_exit', 'true');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [exitTriggered, showWelcome, cart]);

  // Social Proof Purchase Alerts rotation
  useEffect(() => {
    let alertIdx = 0;
    
    const triggerNextAlert = () => {
      const alert = indianPurchases[alertIdx];
      setCurrentAlert(alert);
      setShowAlert(true);

      // Hide after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      // Advance index
      alertIdx = (alertIdx + 1) % indianPurchases.length;
    };

    // Initial alert after 8 seconds
    const initialTimer = setTimeout(triggerNextAlert, 8000);

    // Rotate every 15 seconds
    const interval = setInterval(triggerNextAlert, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handleCopyCode = (code: string, isWelcome: boolean) => {
    navigator.clipboard.writeText(code).then(() => {
      applyCoupon(code);
      if (isWelcome) {
        setCopiedWelcome(true);
        setTimeout(() => setCopiedWelcome(false), 2000);
      } else {
        setCopiedExit(true);
        setTimeout(() => setCopiedExit(false), 2000);
      }
      addToast(`Discount Code ${code} Copied & Applied!`, 'success');
    });
  };

  return (
    <>
      {/* 1. WELCOME/COUPON POPUP */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 shadow-2xl animate-scale-up">
            {/* Close */}
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-5">
              <div className="w-12 h-12 bg-luxury-gold/10 text-luxury-gold rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">EXCLUSIVE SUBSCRIBER OFFER</span>
                <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-stone-950 dark:text-white">
                  Unlock 15% Off Your Adda
                </h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                Get an instant discount on our premium dropshipping favorites. Use the secret coupon at checkout.
              </p>

              {/* Coupon Copy Box */}
              <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4.5 flex items-center justify-between font-mono rounded-xs">
                <div className="text-left">
                  <span className="text-[8px] text-stone-400 uppercase tracking-widest block font-sans">COUPON CODE</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">ADDA15</span>
                </div>
                <button
                  onClick={() => handleCopyCode('ADDA15', true)}
                  className="px-4 py-2 bg-stone-950 text-white dark:bg-white dark:text-stone-950 hover:bg-stone-900 text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  {copiedWelcome ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-[9px] text-stone-400">
                ⭐ Applicable on all items. Free COD & Express Shipping included today.
              </div>

              <button
                onClick={() => setShowWelcome(false)}
                className="w-full py-3.5 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs uppercase tracking-widest font-bold text-stone-600 dark:text-stone-300 transition-colors"
              >
                No thanks, I will browse first
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXIT INTENT POPUP */}
      {showExitIntent && !showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-rose-500/20 dark:border-rose-500/30 p-8 shadow-2xl animate-scale-up">
            {/* Close */}
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-5">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 block">WAIT! DON'T MISS THIS</span>
                <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-stone-950 dark:text-white">
                  Limited Cart Deal
                </h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                Leaving so soon? Add any trending item to your cart now and get an extra **20% OFF** right now. This is a one-time exit offer!
              </p>

              {/* Coupon Copy Box */}
              <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200/50 dark:border-rose-800/50 p-4.5 flex items-center justify-between font-mono rounded-xs">
                <div className="text-left">
                  <span className="text-[8px] text-rose-500 uppercase tracking-widest block font-sans font-bold">LIMITED TIME</span>
                  <span className="text-sm font-bold text-stone-900 dark:text-white">CRO50</span>
                </div>
                <button
                  onClick={() => handleCopyCode('CRO50', false)}
                  className="px-4 py-2 bg-rose-500 text-white hover:bg-rose-600 text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  {copiedExit ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Applied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Apply 20%
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowExitIntent(false);
                    navigateTo('shop');
                  }}
                  className="flex-1 py-3 bg-stone-950 text-white dark:bg-white dark:text-stone-950 hover:opacity-90 text-[10px] font-bold uppercase tracking-widest transition-opacity"
                >
                  Shop Best Sellers
                </button>
                <button
                  onClick={() => setShowExitIntent(false)}
                  className="flex-1 py-3 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-[10px] uppercase tracking-widest font-bold text-stone-500 dark:text-stone-400 transition-colors"
                >
                  Close Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RECENTLY PURCHASED SOCIAL PROOF ALERT */}
      {showAlert && currentAlert && (
        <div
          id="recent-purchase-popup"
          className="fixed bottom-6 left-6 z-[90] max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-3 shadow-xl flex items-center gap-3.5 animate-slide-up-alert cursor-pointer hover:border-luxury-gold transition-colors"
          onClick={() => {
            const matchedProd = PRODUCTS.find(p => p.title.toLowerCase().includes(currentAlert.productTitle.toLowerCase().split(' ')[0]));
            if (matchedProd) {
              navigateTo('product', { handle: matchedProd.handle });
              setShowAlert(false);
            }
          }}
        >
          {/* Thumb */}
          <div className="w-12 h-14 bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 overflow-hidden shrink-0">
            <img
              src={currentAlert.productImage}
              alt={currentAlert.productTitle}
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Alert Body */}
          <div className="space-y-0.5 text-left min-w-0 flex-1 pr-4">
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-[10px] text-stone-400 font-medium">
                Verified Order
              </p>
            </div>
            <p className="text-xs text-stone-800 dark:text-stone-100 font-bold leading-tight">
              {currentAlert.name} from {currentAlert.city}
            </p>
            <p className="text-[10px] text-stone-500 leading-snug truncate">
              Bought: <span className="font-semibold text-stone-700 dark:text-stone-300">{currentAlert.productTitle}</span>
            </p>
            <span className="text-[9px] font-mono text-stone-400 block">{currentAlert.timeAgo}</span>
          </div>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAlert(false);
            }}
            className="absolute top-2 right-2 text-stone-400 hover:text-stone-700 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </>
  );
}
