/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { shopifyService } from '../services/shopify';
import { Product, ProductVariant } from '../types';
import {
  Star,
  ShieldCheck,
  Heart,
  Truck,
  Undo2,
  Award,
  Sparkles,
  Plus,
  Minus,
  ShoppingBag,
  Eye,
  Check,
  Share2,
  HelpCircle,
  Clock,
  CreditCard,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export default function ProductDetailView() {
  const { viewParams, navigateTo, toggleWishlist, isInWishlist, addToCart, addToast, setCartDrawerOpen } = useAppStore();
  const handle = viewParams.handle;

  const [product, setProduct] = useState<Product | null>(null);
  const [activeMediaIdx, setActiveMediaIdx] = useState<number>(0); // 0+ for images, -1 for video
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // Interactive accordions
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'warranty'>('desc');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // User Mock Review Submit
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  // User Mock Q&A Submit
  const [newQuestion, setNewQuestion] = useState('');
  const [activeQAs, setActiveQAs] = useState<{ id: string; question: string; answer: string; author: string; date: string }[]>([]);

  // Hover Zoom effect reference
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  // 1. Load product data, related products & recently viewed
  useEffect(() => {
    if (!handle) return;

    const loadProduct = async () => {
      try {
        const found = await shopifyService.getProductByHandle(handle);
        if (found) {
          setProduct(found);
          setActiveMediaIdx(0);
          setQuantity(1);
          setActiveQAs(found.questions || []);

          // Default options selection
          const defaults: Record<string, string> = {};
          found.options.forEach((opt) => {
            defaults[opt.name] = opt.values[0];
          });
          setSelectedOptions(defaults);

          // Related products
          const related = await shopifyService.getRelatedProducts(found, 3);
          setRelatedProducts(related);

          // Frequently bought together (find 1 other item)
          const relatedAll = await shopifyService.getRelatedProducts(found, 5);
          const bundleItem = relatedAll.filter(item => item.id !== found.id).slice(0, 1);
          setFrequentlyBoughtTogether(bundleItem);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product from Shopify Service:', err);
      }
    };

    loadProduct();
  }, [handle]);

  // 2. Recently viewed tracker
  useEffect(() => {
    if (!handle) return;
    
    // Save current handle to recently viewed in localStorage
    const stored = localStorage.getItem('apna_adda_recently_viewed');
    let list: string[] = stored ? JSON.parse(stored) : [];
    
    // Filter out current handle and prepend to top
    list = list.filter(h => h !== handle);
    list.unshift(handle);
    list = list.slice(0, 5); // Limit list to 5 items
    localStorage.setItem('apna_adda_recently_viewed', JSON.stringify(list));
    
    // Load details for recently viewed items (excluding current)
    const loadRecentlyViewed = async () => {
      const handlesToLoad = list.filter(h => h !== handle).slice(0, 4);
      const loaded: Product[] = [];
      for (const h of handlesToLoad) {
        const prod = await shopifyService.getProductByHandle(h);
        if (prod) loaded.push(prod);
      }
      setRecentlyViewed(loaded);
    };
    
    loadRecentlyViewed();
  }, [handle]);

  // Sticky bar and dispatch countdown state
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [countdownStr, setCountdownStr] = useState('3h 12m 45s');

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 650);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(17, 0, 0, 0); // 5 PM dispatch cutoff

      if (now.getHours() >= 17) {
        cutoff.setDate(cutoff.getDate() + 1);
      }

      const diff = cutoff.getTime() - now.getTime();
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdownStr(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3. Sync selected variant with options state
  useEffect(() => {
    if (!product) return;

    const matched = product.variants.find((variant) => {
      return variant.selectedOptions.every((opt) => {
        return selectedOptions[opt.name] === opt.value;
      });
    });

    setSelectedVariant(matched || null);
  }, [selectedOptions, product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <h2 className="font-display font-bold text-2xl uppercase">Product Not Found</h2>
        <p className="text-xs text-stone-500">The requested object cannot be retrieved from our Shopify instance.</p>
        <button onClick={() => navigateTo('shop')} className="btn-premium-primary text-[10px]">
          Return to Shop Catalog
        </button>
      </div>
    );
  }

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToBag = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    // Add to cart and immediately open cart slide drawer
    addToCart(product, selectedVariant, quantity);
    setCartDrawerOpen(true);
  };

  const handleAddBundleToBag = (bundleItem: Product) => {
    const defaultVariant = bundleItem.variants[0];
    addToCart(bundleItem, defaultVariant, 1);
  };

  const handleShare = () => {
    const dummyUrl = `${window.location.origin}/product/${product.handle}`;
    navigator.clipboard.writeText(dummyUrl).then(() => {
      addToast('Product link copied to clipboard!', 'success');
    }).catch(() => {
      addToast('Could not copy link', 'error');
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    const submittedReview = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      title: newReviewTitle || 'Authentic verification',
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0],
    };

    setProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        reviews: [submittedReview, ...prev.reviews],
        reviewsCount: prev.reviewsCount + 1,
      };
    });

    addToast('Validation diary transmitted successfully!', 'success');

    // Reset Form
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    setNewReviewRating(5);
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const submittedQA = {
      id: `q-${Date.now()}`,
      question: newQuestion,
      answer: "Thank you for asking! Our support curator will review this and respond within 2-4 hours. In the meantime, rest assured that all objects are protected under Apna Adda's design-safety standards.",
      author: 'You (Submitted)',
      date: new Date().toISOString().split('T')[0]
    };

    setActiveQAs((prev) => [submittedQA, ...prev]);
    setNewQuestion('');
    addToast('Your question was logged in our active system.', 'success');
  };

  // Zoom on hover handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.5)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center center'
    });
  };

  // Pricing calculations
  const currentPrice = selectedVariant ? parseFloat(selectedVariant.price) : parseFloat(product.priceRange.minVariantPrice);
  const compareAtPrice = selectedVariant?.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice) : (product.compareAtPriceRange ? parseFloat(product.compareAtPriceRange.minVariantPrice) : null);
  const savedPercent = compareAtPrice ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100) : 0;

  // Delivery estimation calculations (e.g. today + 4 days)
  const today = new Date();
  const deliveryMin = new Date(today.setDate(today.getDate() + 3));
  const deliveryMinStr = deliveryMin.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  const deliveryMax = new Date(today.setDate(today.getDate() + 2)); // Adds 2 more days
  const deliveryMaxStr = deliveryMax.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  // Map color names to dynamic css hex styles for gorgeous round color badges
  const getColorHex = (name: string) => {
    const colorMap: Record<string, string> = {
      'American Walnut': '#8B5A2B',
      'Siberian Birch': '#E3DAC9',
      'Cosmic Charcoal': '#36454F',
      'Alabaster White': '#F2F0EA',
      'Nordic Slate': '#708090',
      'Obsidian Black': '#1A1A1A',
      'Sienna Clay': '#A0522D',
      'Charcoal Smoke': '#2F4F4F',
      'Chalk White': '#F8F8FF',
      'Sage Green': '#8FBC8F',
      'Oatmeal Beige': '#F5F5DC',
      'Warm Terrazzo': '#D2B48C',
      'Carbon Fiber': '#0F0F0F',
      'Forged Steel': '#4682B4',
      'Merino Grey': '#D3D3D3',
      'Desert Tan': '#C2B280',
      'Satin Steel': '#B0C4DE',
      'Deep Sea': '#000080',
      'Forest Pine': '#2E8B57'
    };
    return colorMap[name] || '#CCCCCC';
  };

  // Ratings Breakdown Calculations
  const ratingsCounts = product.reviews.reduce<Record<number, number>>((acc, rev) => {
    acc[rev.rating] = (acc[rev.rating] || 0) + 1;
    return acc;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  const totalReviews = product.reviews.length || 1;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10 space-y-16">
      
      {/* 1. MAIN SPLIT PRESENTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Multi-Image Showcase & Video (6 Columns) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Media Showcase (Zoom on Hover) */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="aspect-[4/5] bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden relative cursor-zoom-in"
          >
            {activeMediaIdx === -1 ? (
              /* Inline Video Playback */
              <video
                src={product.videoUrl}
                autoPlay
                muted
                loop
                controls
                playsInline
                className="w-full h-full object-cover scale-101"
              ></video>
            ) : (
              /* Static Image zoom */
              <img
                src={product.images[activeMediaIdx]?.url}
                alt={product.images[activeMediaIdx]?.altText || product.title}
                style={zoomStyle}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-transform duration-75 ease-out scale-101"
                referrerPolicy="no-referrer"
                loading="eager"
                fetchPriority="high"
              />
            )}

            {/* Save Badging overlay */}
            {savedPercent > 0 && (
              <span className="absolute top-6 left-6 bg-rose-500 text-white font-mono text-[9px] font-bold px-3 py-1 uppercase tracking-wider z-10">
                SAVE {savedPercent}%
              </span>
            )}

            {activeMediaIdx === -1 && (
              <span className="absolute bottom-6 left-6 bg-stone-950/80 text-white font-mono text-[8px] tracking-widest px-2.5 py-1 uppercase z-10">
                Playing Media Tape
              </span>
            )}
          </div>

          {/* Thumbnail & Video Tape Strip */}
          <div className="flex flex-wrap gap-3">
            {/* Standard Image Thumbnails */}
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMediaIdx(idx)}
                className={`w-20 h-24 bg-stone-50 dark:bg-stone-900 border overflow-hidden shrink-0 transition-all cursor-pointer ${
                  activeMediaIdx === idx ? 'border-stone-900 dark:border-white ring-1 ring-stone-950 dark:ring-white' : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0" referrerPolicy="no-referrer" />
              </button>
            ))}

            {/* Dynamic Product Video Thumbnail support */}
            {product.videoUrl && (
              <button
                onClick={() => setActiveMediaIdx(-1)}
                className={`w-20 h-24 bg-stone-950 text-white border flex flex-col items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  activeMediaIdx === -1 ? 'border-luxury-gold ring-1 ring-luxury-gold' : 'border-stone-800 hover:border-stone-400'
                }`}
              >
                <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center">
                  <span className="text-[8px] pl-0.5">▶</span>
                </div>
                <span className="text-[8px] font-mono tracking-widest uppercase font-bold text-stone-400">VIDEO</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Checkout Configuration (6 Columns) */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 block font-mono">
                {product.brand} | {product.collections[0]?.replace('-', ' ')}
              </span>
              <span className="text-[10px] bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 font-mono px-2 py-0.5">
                Authentic Curation
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-stone-900 dark:text-stone-100 mt-2 tracking-tight">
              {product.title}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-0.5 text-luxury-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-stone-200'}`} />
                ))}
              </div>
              <span className="text-xs font-mono text-stone-500">
                {product.rating} / 5.0 ({product.reviewsCount} diaries validations)
              </span>
            </div>
          </div>

          {/* Pricing & Deals */}
          <div className="py-4 border-y border-stone-100 dark:border-stone-900 flex items-baseline gap-4">
            <span className="text-2xl md:text-3xl font-mono font-bold text-stone-900 dark:text-stone-100">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {compareAtPrice && (
              <>
                <span className="text-sm font-mono text-stone-400 line-through">
                  ₹{compareAtPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-mono font-bold text-rose-500 uppercase">
                  Save ₹{(compareAtPrice - currentPrice).toLocaleString('en-IN')} ({savedPercent}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Low Stock Urgency / Inventory Warning */}
          {product.inventoryCount && product.inventoryCount < 15 && (
            <div className="bg-amber-500/5 border border-amber-500/15 p-4 flex gap-3 items-start animate-pulse">
              <span className="text-base text-amber-500 pt-0.5">⚠️</span>
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider font-mono">
                  CRITICAL STOCK WARNING
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
                  Only <span className="font-bold text-stone-800 dark:text-amber-500">{product.inventoryCount} units</span> remain in our Mumbai design vaults. Expected checkout lock-out within 4 hours.
                </p>
              </div>
            </div>
          )}

          {/* Variants Options Selection */}
          <div className="space-y-6">
            {product.options.map((opt) => {
              const isColorOption = opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'finish';
              
              return (
                <div key={opt.name} className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block font-mono">
                    Select {opt.name}: <span className="text-stone-950 dark:text-stone-100 font-mono font-bold">{selectedOptions[opt.name]}</span>
                  </span>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {opt.values.map((val) => {
                      const isSelected = selectedOptions[opt.name] === val;
                      
                      return (
                        <button
                          key={val}
                          id={`btn-variant-opt-${opt.name}-${val}`}
                          onClick={() => handleOptionChange(opt.name, val)}
                          className={`flex items-center gap-2 px-5 py-2.5 border text-xs font-mono transition-all cursor-pointer ${
                            isSelected
                              ? 'border-stone-900 dark:border-white bg-stone-900 text-stone-50 dark:bg-white dark:text-stone-950 font-bold shadow-xs'
                              : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                          }`}
                        >
                          {/* Round color chip if it is color option */}
                          {isColorOption && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                              style={{ backgroundColor: getColorHex(val) }}
                            ></span>
                          )}
                          <span>{val}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logistics Estimates & Badging */}
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-5 space-y-4.5 font-mono text-[11px] text-stone-500">
            {/* Countdown timer */}
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/5 p-3.5 border border-amber-500/10">
              <Clock className="w-5 h-5 animate-pulse shrink-0" />
              <div>
                <span>Order within <span className="font-bold font-mono text-amber-700 dark:text-amber-300">{countdownStr}</span> for next-morning BlueDart dispatch!</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Truck className="w-4.5 h-4.5 text-stone-400 dark:text-stone-500 shrink-0" />
              <span>
                Guaranteed express delivery to major metro areas by <span className="text-stone-950 dark:text-white font-bold">{deliveryMinStr} - {deliveryMaxStr}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4.5 h-4.5 text-stone-400 dark:text-stone-500 shrink-0" />
              <span>
                Cash on Delivery (COD) & UPI pay-at-door available nationwide.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Undo2 className="w-4.5 h-4.5 text-stone-400 dark:text-stone-500 shrink-0" />
              <span>
                Free 7-Day transit returns. 100% replacement guarantee for fragile objects.
              </span>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 px-2 py-1 bg-white dark:bg-stone-950">🇮🇳 Artisanal India</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 px-2 py-1">🚚 Free Shipping</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-gold bg-luxury-gold/5 border border-luxury-gold/20 px-2 py-1">🛡️ 100% Quality Assured</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 px-2 py-1 bg-white dark:bg-stone-950">🤝 Easy COD</span>
            </div>

            {/* Secure checkout gateways */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
              <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold block">100% SECURE GATEWAYS:</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[9px] bg-white dark:bg-stone-950 px-2 py-0.5 border border-stone-200 dark:border-stone-800 font-bold text-stone-600 dark:text-stone-300">UPI / GPAY</span>
                <span className="text-[9px] bg-white dark:bg-stone-950 px-2 py-0.5 border border-stone-200 dark:border-stone-800 font-bold text-stone-600 dark:text-stone-300">PHONEPE</span>
                <span className="text-[9px] bg-white dark:bg-stone-950 px-2 py-0.5 border border-stone-200 dark:border-stone-800 font-bold text-stone-600 dark:text-stone-300">RUPAY</span>
                <span className="text-[9px] bg-white dark:bg-stone-950 px-2 py-0.5 border border-stone-200 dark:border-stone-800 font-bold text-stone-600 dark:text-stone-300">CASH ON DELIVERY</span>
              </div>
            </div>
          </div>

          {/* Quantity & Actions Panel */}
          <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-900">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              
              {/* Quantity selector */}
              <div className="flex items-center border border-stone-200 dark:border-stone-800 self-start sm:self-auto h-13">
                <button
                  id="btn-product-qty-minus"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 font-mono font-bold text-sm select-none">{quantity}</span>
                <button
                  id="btn-product-qty-plus"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                id="btn-product-add-to-bag"
                onClick={handleAddToBag}
                disabled={!selectedVariant || !selectedVariant.availableForSale}
                className="btn-premium-secondary flex-1 h-13 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-4 h-4" />
                {!selectedVariant
                  ? 'SELECT OPTIONS'
                  : selectedVariant.availableForSale
                  ? 'ADD TO BAG'
                  : 'SOLD OUT'}
              </button>

              {/* Buy Now CTA */}
              <button
                id="btn-product-buy-now"
                onClick={handleBuyNow}
                disabled={!selectedVariant || !selectedVariant.availableForSale}
                className="btn-premium-primary flex-1 h-13 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <span>BUY IT NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Wishlist button */}
              <button
                id="btn-product-toggle-wish"
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 active:scale-95 transition-all cursor-pointer h-13 flex items-center justify-center ${
                  isInWishlist(product.id) ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : ''
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Share and Trust Row */}
            <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono pt-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-stone-950 dark:hover:text-white cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>SHARE DESIGN OBJECT</span>
              </button>

              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-stone-500" />
                <span>100% SECURE GATEWAY CHECKOUT</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. DESCRIPTION / SPECS / SHIPPING TABS */}
      <section className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        
        {/* Tab triggers */}
        <div className="flex border-b border-stone-100 dark:border-stone-800 overflow-x-auto">
          {[
            { label: 'Details', id: 'desc' },
            { label: 'Specifications', id: 'specs' },
            { label: 'Shipping & Logistics', id: 'shipping' },
            { label: 'Warranty Policy', id: 'warranty' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-display font-bold text-[10px] sm:text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="p-6 md:p-10 text-xs md:text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans max-w-4xl">
          
          {activeTab === 'desc' && (
            <div className="space-y-6 animate-fade-in">
              <p>{product.description}</p>
              
              {/* Core Features list requested by user */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-2.5 pt-4">
                  <h4 className="font-bold text-stone-900 dark:text-white uppercase tracking-wider font-display text-[11px]">
                    DESIGN FEATURES & PROTOCOLS:
                  </h4>
                  <ul className="space-y-1.5 pl-4 list-disc text-stone-500">
                    {product.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.descriptionHtml && (
                <div
                  className="space-y-3 prose prose-stone dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                ></div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="animate-fade-in border border-stone-100 dark:border-stone-800">
              {Object.entries(product.specifications).map(([key, val], idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-3 p-4 border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-950 transition-colors"
                >
                  <span className="font-bold text-stone-900 dark:text-white uppercase tracking-wider text-[11px] font-display">{key}</span>
                  <span className="md:col-span-2 text-xs font-mono text-stone-500 mt-1 md:mt-0">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 animate-fade-in">
              <p className="font-bold text-stone-900 dark:text-white uppercase tracking-wider font-display text-[11px]">FULFILLMENT PROTOCOLS:</p>
              <p>{product.shippingInfo}</p>
              <p className="font-bold text-stone-900 dark:text-white uppercase tracking-wider font-display text-[11px] pt-2">RETURN COORDINATES:</p>
              <p>{product.returnPolicy}</p>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-4 animate-fade-in">
              <p className="font-bold text-stone-900 dark:text-white uppercase tracking-wider font-display text-[11px]">1-YEAR BRAND WARRANTY:</p>
              <p>We provide a comprehensive 1-Year design warranty that protects your object from any material, structural, or electronic defect. If you experience an issue, we coordinate a direct home-pickup across major Indian metro zones and process your replacement or repairs within 48 hours of intake.</p>
              <p>Our warranties reflect our pride in geometric engineering and architectural quality. Your purchase receipt acts as active verification.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. FREQUENTLY BOUGHT TOGETHER (BUNDLE) */}
      {frequentlyBoughtTogether.length > 0 && (
        <section className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 md:p-8 space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block font-mono">Frequently Bought Together</span>
          
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              
              {/* Product 1 */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 border border-stone-100 dark:border-stone-800 bg-stone-50 overflow-hidden shrink-0">
                  <img src={product.images[0]?.url} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase font-display max-w-[120px] truncate">{product.title}</h4>
                  <p className="text-xs font-mono text-stone-500">₹{currentPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <span className="text-lg font-bold text-stone-400">+</span>

              {/* Product 2 */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 border border-stone-100 dark:border-stone-800 bg-stone-50 overflow-hidden shrink-0">
                  <img src={frequentlyBoughtTogether[0].images[0]?.url} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase font-display max-w-[120px] truncate">{frequentlyBoughtTogether[0].title}</h4>
                  <p className="text-xs font-mono text-stone-500">₹{parseFloat(frequentlyBoughtTogether[0].priceRange.minVariantPrice).toLocaleString('en-IN')}</p>
                </div>
              </div>

            </div>

            <div className="border-t md:border-t-0 md:border-l border-stone-100 dark:border-stone-800 pt-4 md:pt-0 md:pl-8 text-center md:text-left space-y-3 w-full md:w-auto">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase font-mono">Exclusive Bundle Deal</span>
                <span className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                  ₹{(currentPrice + parseFloat(frequentlyBoughtTogether[0].priceRange.minVariantPrice)).toLocaleString('en-IN')}
                </span>
              </div>
              <button
                id="btn-add-bundle-bag"
                onClick={() => {
                  handleAddToBag();
                  handleAddBundleToBag(frequentlyBoughtTogether[0]);
                  addToast('Added bundle items to your shopping bag!', 'success');
                }}
                className="btn-premium-primary text-[9px] py-2.5 px-6 w-full md:w-auto"
              >
                Add Both to Bag
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. REVIEWS SECTION with RATINGS BREAKDOWN */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Col: Customer Diaries Reviews & Rating Breakdown */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="border-b border-stone-100 dark:border-stone-900 pb-3 flex justify-between items-baseline">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider">Customer Diaries ({product.reviews.length})</h3>
            <span className="text-xs font-mono text-stone-400">Verified buyers validated</span>
          </div>

          {/* Rating breakdown visual bar chart */}
          <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="text-center">
              <span className="text-4xl md:text-5xl font-mono font-black text-stone-950 dark:text-white block">{product.rating}</span>
              <div className="flex gap-0.5 text-luxury-gold justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-stone-200'}`} />
                ))}
              </div>
              <span className="text-[10px] font-mono text-stone-400 block mt-1.5 uppercase">Average validation</span>
            </div>

            {/* Stars Progress bars */}
            <div className="flex-1 space-y-2 w-full max-w-xs sm:max-w-none">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingsCounts[rating] || 0;
                const pct = Math.round((count / totalReviews) * 100);

                return (
                  <div key={rating} className="flex items-center gap-3 text-xs font-mono text-stone-500">
                    <span className="w-4 shrink-0 text-right">{rating}★</span>
                    <div className="flex-1 h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="bg-luxury-gold h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="w-8 shrink-0 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="border border-stone-200 dark:border-stone-800 p-5 bg-white dark:bg-stone-900 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-sm font-display font-bold text-stone-900 dark:text-stone-100 uppercase">{rev.title}</h4>
                    <div className="flex gap-0.5 text-luxury-gold mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-stone-200'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-stone-900 dark:text-stone-100 block">{rev.author}</span>
                    <span className="text-[9px] font-mono text-stone-400 mt-0.5 block">{rev.date}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Review Submission Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleReviewSubmit} className="border border-stone-200 dark:border-stone-800 p-6 md:p-8 bg-white dark:bg-stone-900 space-y-4">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider pb-3 border-b border-stone-100 dark:border-stone-800 mb-2">Write Validation Review</h3>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 font-mono">Your Name *</label>
              <input
                id="rev-author"
                type="text"
                required
                placeholder="Rohan Patel"
                className="input-premium py-2 text-xs font-mono"
                value={newReviewAuthor}
                onChange={(e) => setNewReviewAuthor(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 font-mono">Diaries Rating *</label>
              <select
                id="rev-rating"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs font-mono rounded-none focus:outline-hidden"
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
              >
                <option value="5">5 Stars (Flawless)</option>
                <option value="4">4 Stars (Great)</option>
                <option value="3">3 Stars (Average)</option>
                <option value="2">2 Stars (Poor)</option>
                <option value="1">1 Star (Disaster)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 font-mono">Diary Title</label>
              <input
                id="rev-title"
                type="text"
                placeholder="Exceptional tactile finish"
                className="input-premium py-2 text-xs font-mono"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1 font-mono">Commentary Diaries *</label>
              <textarea
                id="rev-comment"
                required
                rows={4}
                placeholder="Write your experience..."
                className="input-premium py-2 text-xs font-sans resize-none"
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn-premium-primary w-full py-3 text-[10px] uppercase font-mono tracking-widest font-bold">
              Transmit Diaries Validation
            </button>
          </form>
        </div>
      </section>

      {/* 5. CUSTOMER Q&A SECTION */}
      <section className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 md:p-10 space-y-8">
        <div className="border-b border-stone-100 dark:border-stone-850 pb-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider">Customer Inquiries Q&A ({activeQAs.length})</h3>
          <p className="text-xs text-stone-400 mt-1">Get immediate, certified answers regarding shipping, warranty, and material specs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Ask a question form */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-stone-100 dark:border-stone-850 pb-6 lg:pb-0 lg:pr-10">
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 font-mono block">Submit Question Tape</span>
              <div>
                <textarea
                  required
                  rows={3}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Is the wooden paneling genuine timber or walnut-veneer?"
                  className="input-premium py-2 text-xs font-sans"
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-premium-primary py-2.5 px-6 text-[10px] uppercase font-mono font-bold"
              >
                Log Inquiry Question
              </button>
            </form>
          </div>

          {/* Q&A List */}
          <div className="lg:col-span-7 space-y-6">
            {activeQAs.length > 0 ? (
              activeQAs.map((qa) => (
                <div key={qa.id} className="space-y-2 text-xs">
                  <div className="flex gap-2.5 items-start">
                    <span className="bg-stone-950 text-white dark:bg-stone-800 text-[9px] font-bold font-mono px-1.5 py-0.5 shrink-0 uppercase">Q</span>
                    <p className="font-bold text-stone-900 dark:text-stone-100">{qa.question}</p>
                  </div>
                  <div className="flex gap-2.5 items-start pl-6">
                    <span className="text-luxury-gold text-[9px] font-bold font-mono px-1.5 py-0.5 shrink-0 border border-luxury-gold/30 uppercase">A</span>
                    <div className="space-y-1 text-stone-500">
                      <p className="leading-relaxed">{qa.answer}</p>
                      <p className="text-[9px] font-mono text-stone-400">Answered by curator Desk ({qa.date})</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-mono text-stone-400">No active inquiry records found. Ask yours first.</p>
            )}
          </div>
        </div>
      </section>

      {/* 6. RELATED PRODUCTS (COMPLEMENTARY OBJECTS) */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-6 border-t border-stone-200/50 dark:border-stone-800/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 font-mono">Complementary Objects</span>
            <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1">RELATED DESIGN CURATIONS</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo('product', { handle: item.handle })}
                className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/5] bg-stone-50 dark:bg-stone-950 overflow-hidden border-b border-stone-100 dark:border-stone-850">
                  <img
                    src={item.images[0]?.url}
                    alt=""
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-display font-bold uppercase tracking-wide truncate group-hover:text-luxury-gold transition-colors">{item.title}</h4>
                    <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">{item.brand}</span>
                  </div>
                  <span className="text-xs font-mono font-bold shrink-0">₹{parseFloat(item.priceRange.minVariantPrice).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. RECENTLY VIEWED PRODUCTS SECTION */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-8 pt-6 border-t border-stone-200/50 dark:border-stone-800/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 font-mono font-bold">Your Travel Diaries</span>
            <h2 className="text-xl md:text-2xl font-bold uppercase font-display mt-1">RECENTLY VIEWED ITEMS</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {recentlyViewed.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo('product', { handle: item.handle })}
                className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/5] bg-stone-50 dark:bg-stone-950 overflow-hidden border-b border-stone-100 dark:border-stone-850">
                  <img
                    src={item.images[0]?.url}
                    alt=""
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-[11px] font-display font-bold uppercase tracking-wide truncate group-hover:text-luxury-gold transition-colors">{item.title}</h4>
                    <span className="text-[8px] font-mono text-stone-400 uppercase tracking-widest">{item.brand}</span>
                  </div>
                  <span className="text-xs font-mono font-bold mt-2">₹{parseFloat(item.priceRange.minVariantPrice).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Add To Cart Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-950 border-t border-stone-250 dark:border-stone-850 shadow-2xl py-3 px-6 z-40 transition-all duration-350 ease-in-out transform ${
          showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-12 bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800 overflow-hidden shrink-0 sm:block hidden">
              <img src={product.images[0]?.url} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase font-display text-stone-900 dark:text-stone-100 truncate max-w-[140px] sm:max-w-xs">{product.title}</h4>
              <span className="text-xs font-mono font-bold text-stone-900 dark:text-white">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-stone-400 mr-2">
              {Object.entries(selectedOptions).map(([key, val]) => (
                <span key={key} className="bg-stone-50 dark:bg-stone-900 px-2 py-1 border border-stone-150 dark:border-stone-800 font-bold text-stone-600 dark:text-stone-300">
                  {key}: {val}
                </span>
              ))}
            </div>

            <button
              id="btn-sticky-add-to-bag"
              onClick={handleAddToBag}
              disabled={!selectedVariant || !selectedVariant.availableForSale}
              className="btn-premium-primary text-[10px] font-bold uppercase tracking-widest px-6 py-3 h-11 flex items-center justify-center gap-2 shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ADD TO BAG</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
