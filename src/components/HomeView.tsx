/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PRODUCTS, COLLECTIONS } from '../data/products';
import { ArrowRight, Flame, Clock, Award, Shield, Truck, Sparkles, Star } from 'lucide-react';

export default function HomeView() {
  const { navigateTo, toggleWishlist, isInWishlist, addToCart } = useAppStore();

  // Simple Countdown Timer for the Flash Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 34, seconds: 12 }; // reset
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // Filter products for sections
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);
  const trending = PRODUCTS.filter((p) => p.isTrending || p.tags.includes('Trending') || p.collections.includes('trending-products'));
  const flashDeals = PRODUCTS.filter((p) => p.isFlashDeal || p.compareAtPriceRange?.minVariantPrice);
  const newArrivals = PRODUCTS.filter((p) => p.tags.includes('New') || p.tags.includes('ANC') || p.tags.includes('Vase')).slice(0, 3);
  const recommended = PRODUCTS.filter((p) => p.rating >= 4.8 && !p.isBestSeller).slice(0, 3);

  const [recentlyViewedProds, setRecentlyViewedProds] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('apna_adda_recently_viewed');
    if (stored) {
      try {
        const handles: string[] = JSON.parse(stored);
        // Map handles back to products while maintaining visual chronological order
        const loaded = handles
          .map(h => PRODUCTS.find(p => p.handle === h))
          .filter((p): p is typeof PRODUCTS[0] => !!p);
        setRecentlyViewedProds(loaded.slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Newsletter Submit State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useAppStore();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    addToast('Welcome to the Adda Circle. Discount code sent!', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION - GEOMETRIC BALANCE CANVAS */}
      <section className="relative min-h-[calc(100vh-4rem)] border-b border-stone-200 dark:border-stone-800 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white dark:bg-stone-950">
        
        {/* Geometric wireframe backgrounds */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-30 flex items-center justify-center">
          <div className="w-[80%] aspect-square border border-stone-300 dark:border-stone-800 rounded-full rotate-12 absolute animate-rotate-slow"></div>
          <div className="w-[60%] aspect-square border border-stone-200 dark:border-stone-900 rounded-full -rotate-6 absolute animate-rotate-slow-reverse"></div>
          <div className="text-[20vw] font-black text-stone-100 dark:text-stone-900/40 select-none absolute -left-10 bottom-0 leading-none">
            ADDA
          </div>
        </div>

        {/* Hero Copy (Left 7 Columns on desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 py-16 z-10 relative">
          <div className="max-w-xl space-y-8 animate-slide-up">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold dark:text-luxury-gold-dark block">
              Curated Architectural Objects
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black leading-[0.9] text-stone-900 dark:text-stone-100">
              CURATED<br />ESSENTIALS
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
              Redefining everyday living with physical precision, high-performance materials, and modern Japanese-Scandinavian minimalism.
            </p>
            <div>
              <button
                id="btn-hero-explore"
                onClick={() => navigateTo('shop')}
                className="btn-premium-primary inline-flex items-center gap-4 py-4 px-10 text-xs font-bold"
              >
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Imagery Frame (Right 5 Columns on desktop) */}
        <div className="lg:col-span-5 bg-stone-50 dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 flex items-center justify-center p-10 z-10 relative min-h-[400px] lg:min-h-0">
          <div className="relative w-full max-w-sm aspect-[4/5] bg-stone-300 dark:bg-stone-800 shadow-2xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
              alt="Artisanal objects in organic setting"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-102 group-hover:scale-105"
              referrerPolicy="no-referrer"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-stone-950/10 group-hover:bg-transparent transition-all duration-500"></div>
            
            {/* Visual floating badge */}
            <div className="absolute bottom-6 left-6 bg-white dark:bg-stone-950 px-4 py-3 border border-stone-200 dark:border-stone-800">
              <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 block">Collection</span>
              <span className="text-xs font-display font-bold uppercase text-stone-900 dark:text-white">Volume 01 / Horizon</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE US (VALUES STRIP) */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-6 border-b border-stone-200/50 dark:border-stone-800/50">
        <div className="flex gap-4 items-start">
          <Truck className="w-6 h-6 text-stone-900 dark:text-stone-100 shrink-0 mt-1" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">Express Delivery</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">Free secure courier dispatch across metropolitan India on orders over ₹5,000.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <Award className="w-6 h-6 text-stone-900 dark:text-stone-100 shrink-0 mt-1" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">Artisanal Sourcing</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">Meticulously selected and double-inspected design items crafted globally for perfection.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <Shield className="w-6 h-6 text-stone-900 dark:text-stone-100 shrink-0 mt-1" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">Secure Shopify Checkout</h4>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">Fully responsive and end-to-end encrypted Shopify processing for flawless transactional safety.</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS (CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Shop by Scene</span>
            <h2 className="text-2xl md:text-3xl font-bold uppercase font-display mt-1">CURATED COLLECTIONS</h2>
          </div>
          <button
            id="btn-collections-all"
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white hover:text-luxury-gold inline-flex items-center gap-1 hover:underline"
          >
            All Products <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.handle}
              onClick={() => navigateTo('shop', { collection: col.handle })}
              className="relative aspect-video md:aspect-[4/5] overflow-hidden group cursor-pointer border border-stone-200 dark:border-stone-800"
            >
              <img
                src={col.image?.url}
                alt={col.image?.altText || col.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <h3 className="text-lg font-display font-bold uppercase tracking-wide group-hover:text-luxury-gold transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs font-light text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                  {col.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FLASH DEAL SECTION (REAL COUNTDOWN) */}
      {flashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-6">
          <div className="border border-stone-900/10 dark:border-stone-100/10 bg-white dark:bg-stone-900 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            
            {/* Clock Overlay indicator */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest">
                <Flame className="w-4.5 h-4.5" />
                <span>LIMITED TIME FLASH DISCOUNT</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-black uppercase text-stone-900 dark:text-stone-100">
                MONOLITH SERIES
              </h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-lg">
                Save an extra 20% on the structural aluminum Monolith Desk Organizer block. High-strength magnetic panels milled from custom aerospace grade slabs.
              </p>

              {/* Countdown Digits */}
              <div className="flex items-center gap-4 py-4 border-y border-stone-100 dark:border-stone-800 max-w-md">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Offer Expires In</span>
                </div>
                <div className="flex gap-2 text-sm font-mono font-bold text-stone-900 dark:text-stone-100">
                  <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800">{formatNumber(timeLeft.hours)}h</span>
                  <span>:</span>
                  <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800">{formatNumber(timeLeft.minutes)}m</span>
                  <span>:</span>
                  <span className="px-2 py-1 bg-stone-100 dark:bg-stone-800 text-rose-500">{formatNumber(timeLeft.seconds)}s</span>
                </div>
              </div>

              <div>
                <button
                  id="btn-flash-deal-buy"
                  onClick={() => navigateTo('product', { handle: flashDeals[0].handle })}
                  className="btn-premium-primary text-[10px]"
                >
                  Buy Now — Save 20%
                </button>
              </div>
            </div>

            {/* Product Image Panel */}
            <div className="lg:col-span-5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 flex flex-col items-center justify-center">
              <div className="relative aspect-square w-full max-w-[280px] overflow-hidden group mb-4">
                <img
                  src={flashDeals[0].images[0]?.url}
                  alt={flashDeals[0].title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-750"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-rose-500 text-white font-mono text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider">
                  {flashDeals[0].flashDealDiscount}% OFF
                </span>
              </div>
              <h3 className="text-sm font-display font-bold uppercase">{flashDeals[0].title}</h3>
              <div className="flex gap-2 items-center mt-1">
                <span className="text-xs font-mono font-bold text-rose-500">
                  ₹{parseFloat(flashDeals[0].priceRange.minVariantPrice).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-mono text-stone-400 line-through">
                  ₹{(parseFloat(flashDeals[0].priceRange.minVariantPrice) * 1.25).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 5. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Highly Desired</span>
          <h2 className="text-2xl md:text-3xl font-bold uppercase font-display mt-1">THE BEST SELLERS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestSellers.map((product) => {
            const hasDiscount = product.compareAtPriceRange?.minVariantPrice;
            const isInBag = false;

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col"
              >
                {/* Photo frame */}
                <div
                  className="aspect-[4/5] bg-stone-50 dark:bg-stone-950 overflow-hidden relative cursor-pointer border-b border-stone-100 dark:border-stone-900"
                  onClick={() => navigateTo('product', { handle: product.handle })}
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.images[0]?.altText || product.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Floating labels */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1">
                    <span className="bg-stone-900 text-stone-50 dark:bg-stone-50 dark:text-stone-900 text-[8px] font-mono uppercase tracking-wider px-2 py-1 font-bold">
                      Best Seller
                    </span>
                    {hasDiscount && (
                      <span className="bg-rose-500 text-white text-[8px] font-mono uppercase tracking-wider px-2 py-1 font-bold">
                        Sale Offer
                      </span>
                    )}
                  </div>

                  {/* Quick view button overlay */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      id={`btn-quick-add-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, product.variants[0], 1);
                      }}
                      className="w-full bg-stone-950 text-white dark:bg-white dark:text-stone-950 py-3 text-[10px] uppercase tracking-wider font-bold hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1.5 gap-2">
                      <h3
                        onClick={() => navigateTo('product', { handle: product.handle })}
                        className="font-display font-bold text-sm uppercase tracking-wide cursor-pointer text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors truncate"
                      >
                        {product.title}
                      </h3>
                      <button
                        id={`btn-wishlist-toggle-${product.id}`}
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-1 -mr-1 transition-colors ${
                          isInWishlist(product.id) ? 'text-rose-500' : 'text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
                        }`}
                        aria-label="Toggle wishlist"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">{product.description}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-stone-100 dark:border-stone-900">
                    <span className="text-[10px] font-mono text-stone-400">Volume 01</span>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100">
                        ₹{parseFloat(product.priceRange.minVariantPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5B. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Going Viral</span>
            <h2 className="text-2xl md:text-3xl font-bold uppercase font-display mt-1">TRENDING IN METROPOLIS</h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 border border-emerald-100 dark:border-emerald-900/50 self-start">
            🔥 4,912 orders placed today
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trending.slice(0, 4).map((product) => {
            return (
              <div
                key={`trending-${product.id}`}
                className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col"
              >
                <div
                  className="aspect-[4/5] bg-stone-50 dark:bg-stone-950 overflow-hidden relative cursor-pointer border-b border-stone-100 dark:border-stone-900"
                  onClick={() => navigateTo('product', { handle: product.handle })}
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-rose-500 text-white text-[8px] font-mono uppercase tracking-wider px-2 py-1 font-bold">
                      Trending
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => navigateTo('product', { handle: product.handle })}
                      className="font-display font-bold text-xs uppercase tracking-wide cursor-pointer text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors truncate"
                    >
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-luxury-gold">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-[10px] font-mono text-stone-500 font-bold">{product.rating} ({product.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2.5 border-t border-stone-100 dark:border-stone-900">
                    <span className="text-[10px] font-mono text-rose-500 font-semibold">Low Stock</span>
                    <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                      ₹{parseFloat(product.priceRange.minVariantPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5C. NEW ARRIVALS & SPECIAL DEALS */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Buy More Save More Promo */}
        <div className="lg:col-span-4 border border-luxury-gold/30 dark:border-luxury-gold-dark/30 bg-stone-50 dark:bg-stone-900/30 p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-luxury-gold dark:text-luxury-gold-dark block">VOLUME OFFERS</span>
            <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-stone-900 dark:text-white leading-tight">
              BUY MORE, SAVE MORE
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Mix and match any designer workspace essentials to unlock compounding dropshipping discounts. Verified on checkout automatically.
            </p>

            <ul className="space-y-2.5 pt-2">
              <li className="flex items-center justify-between text-xs font-mono p-2 bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-800">
                <span className="font-bold">Buy any 2 Objects</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Save 10% Extra</span>
              </li>
              <li className="flex items-center justify-between text-xs font-mono p-2 bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-800">
                <span className="font-bold">Buy any 3 Objects</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Save 15% Extra</span>
              </li>
              <li className="flex items-center justify-between text-xs font-mono p-2 bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-800">
                <span className="font-bold">Buy 4+ Objects</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Save 20% Extra</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-400">
            <span>⚡ Automatic at billing</span>
            <span className="font-bold text-stone-900 dark:text-white">Active India Wide</span>
          </div>
        </div>

        {/* Right: New Arrivals (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Just Dropped</span>
              <h3 className="text-xl md:text-2xl font-bold uppercase font-display mt-0.5">NEW ARRIVALS</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
              <div
                key={`new-${product.id}`}
                className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col"
              >
                <div
                  className="aspect-square bg-stone-50 dark:bg-stone-950 overflow-hidden relative cursor-pointer border-b border-stone-100 dark:border-stone-900"
                  onClick={() => navigateTo('product', { handle: product.handle })}
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-3 left-3 bg-stone-950 text-white text-[8px] font-mono uppercase tracking-wider px-2 py-1 font-bold">
                    New Drop
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4
                    onClick={() => navigateTo('product', { handle: product.handle })}
                    className="font-display font-bold text-xs uppercase tracking-wide cursor-pointer text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors truncate"
                  >
                    {product.title}
                  </h4>
                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-900">
                    <span className="text-[9px] font-mono text-stone-400">Limited Stock</span>
                    <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                      ₹{parseFloat(product.priceRange.minVariantPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 5D. RECOMMENDED FOR YOU */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Curator Pick</span>
          <h2 className="text-2xl md:text-3xl font-bold uppercase font-display mt-1">RECOMMENDED FOR YOU</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {recommended.map((product) => (
            <div
              key={`rec-${product.id}`}
              className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col"
            >
              <div
                className="aspect-[4/5] bg-stone-50 dark:bg-stone-950 overflow-hidden relative cursor-pointer border-b border-stone-100 dark:border-stone-900"
                onClick={() => navigateTo('product', { handle: product.handle })}
              >
                <img
                  src={product.images[0]?.url}
                  alt={product.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3
                    onClick={() => navigateTo('product', { handle: product.handle })}
                    className="font-display font-bold text-sm uppercase tracking-wide cursor-pointer text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors truncate"
                  >
                    {product.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-1 leading-relaxed">{product.description}</p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-100 dark:border-stone-900">
                  <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                    <span>★ 4.8 Rating</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-stone-900 dark:text-stone-100">
                    ₹{parseFloat(product.priceRange.minVariantPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5E. RECENTLY VIEWED PRODUCTS */}
      {recentlyViewedProds.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 space-y-8 animate-fade-in">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Your History</span>
            <h2 className="text-2xl md:text-3xl font-bold uppercase font-display mt-1">RECENTLY VIEWED</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyViewedProds.map((product) => (
              <div
                key={`recent-home-${product.id}`}
                className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col"
              >
                <div
                  className="aspect-square bg-stone-50 dark:bg-stone-950 overflow-hidden relative cursor-pointer border-b border-stone-100 dark:border-stone-900"
                  onClick={() => navigateTo('product', { handle: product.handle })}
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h4
                    onClick={() => navigateTo('product', { handle: product.handle })}
                    className="font-display font-bold text-xs uppercase tracking-wide cursor-pointer text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors truncate"
                  >
                    {product.title}
                  </h4>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-stone-100 dark:border-stone-900">
                    <span className="text-[9px] font-mono text-stone-400">Viewed</span>
                    <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
                      ₹{parseFloat(product.priceRange.minVariantPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5F. LIVE STORES DELIVERED STATS */}
      <section className="max-w-7xl mx-auto px-6 py-6 border-y border-stone-200/50 dark:border-stone-800/50 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-mono font-black text-stone-950 dark:text-white block">14,824+</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Orders Delivered Across India</span>
        </div>
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-mono font-black text-stone-950 dark:text-white block">99.4% CSAT</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Happy Customers Rating</span>
        </div>
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-mono font-black text-stone-950 dark:text-white block">2-4 Days</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Express BlueDart Dispatch</span>
        </div>
        <div className="space-y-1">
          <span className="text-2xl md:text-3xl font-mono font-black text-stone-950 dark:text-white block">FREE COD</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Cash On Delivery Badge</span>
        </div>
      </section>

      {/* 6. EDITORIAL TESTIMONIALS */}
      <section className="bg-stone-100 dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Editorial Endorsements</span>
          
          <div className="space-y-4">
            <h3 className="font-display text-lg md:text-2xl italic font-light leading-relaxed text-stone-800 dark:text-stone-200 max-w-2xl mx-auto">
              "Apna Adda is a masterclass in quiet luxury. The stoneware volcanic ceramic vase is heavier and more structured than any high-end retail boutique model we evaluated."
            </h3>
            <div className="flex items-center justify-center gap-1 text-luxury-gold">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <p className="text-xs font-mono uppercase tracking-widest text-stone-400">— Architectural Living Digest</p>
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM GALLERY */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Visual Dialogue</span>
          <h2 className="text-2xl md:text-3xl font-bold uppercase font-display mt-1">#ApnaAddaCircle</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400',
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400',
            'https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=400',
            'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=400'
          ].map((url, i) => (
            <div key={i} className="aspect-square bg-stone-200 dark:bg-stone-800 overflow-hidden relative group border border-stone-200/40 dark:border-stone-800/40">
              <img
                src={url}
                alt="Minimal lifestyle detail"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] font-mono text-white tracking-widest uppercase">View Object</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER SIGNUP MODULE */}
      <section className="max-w-3xl mx-auto px-6">
        <div className="border border-stone-900/10 dark:border-stone-100/10 bg-white dark:bg-stone-900 p-8 md:p-12 text-center space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">The Adda Circle</span>
          <h2 className="text-2xl md:text-3xl font-bold uppercase font-display">RECEIVE RADIAL NEWS & FIRST ACCESS</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Join our periodic bulletin circle. Members receive private invitations, preview catalogs, and 10% off their inaugural transaction.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-4">
            <input
              id="input-newsletter-email"
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-stone-200 dark:border-stone-800 text-xs font-mono bg-stone-50 dark:bg-stone-950 focus:outline-hidden text-stone-900 dark:text-white"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button
              type="submit"
              className="btn-premium-primary text-[10px] tracking-widest uppercase py-3.5 px-6 shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
