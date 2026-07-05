/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { shopifyService } from '../services/shopify';
import { Product } from '../types';
import { Grid, List, SlidersHorizontal, Search, Star, X, Check, Heart, ChevronDown, Sliders } from 'lucide-react';

export default function ShopView() {
  const { viewParams, navigateTo, toggleWishlist, isInWishlist } = useAppStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<{ name: string; id: string }[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [activeCollection, setActiveCollection] = useState<string>(viewParams.collection || 'all');
  const [searchFilter, setSearchFilter] = useState<string>(viewParams.query || '');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(25000); // Max Price Slider
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);

  // Layout, Sorting & Pagination
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('CREATED_AT_DESC');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState<number>(6); // Show 6 initially, "Load More" increases by 6

  // 1. Load collections & brands
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const cols = await shopifyService.getCollections();
        setCollections([
          { name: 'All Objects', id: 'all' },
          ...cols.map((c) => ({ name: c.title, id: c.handle }))
        ]);

        const uniqueBrands = await shopifyService.getBrands();
        setBrands(uniqueBrands);
      } catch (e) {
        console.error('Error loading catalog metadata:', e);
      }
    };
    loadMetadata();
  }, []);

  // 2. Sync state with router view parameters
  useEffect(() => {
    if (viewParams.collection) {
      setActiveCollection(viewParams.collection);
    }
    if (viewParams.query !== undefined) {
      setSearchFilter(viewParams.query);
    }
  }, [viewParams]);

  // Reset pagination when filter criteria changes
  useEffect(() => {
    setVisibleCount(6);
  }, [activeCollection, searchFilter, selectedBrand, priceRange, minRating, onlyInStock, onlyDiscounted, sortBy]);

  // 3. Load & Filter Products through service proxy
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Map sort criteria to Shopify API sortKey + reverse
        let sortKey: 'PRICE' | 'CREATED_AT' | 'BEST_SELLING' | 'RATING' = 'CREATED_AT';
        let reverse = false;

        switch (sortBy) {
          case 'CREATED_AT_DESC':
            sortKey = 'CREATED_AT';
            reverse = true;
            break;
          case 'CREATED_AT_ASC':
            sortKey = 'CREATED_AT';
            reverse = false;
            break;
          case 'PRICE_ASC':
            sortKey = 'PRICE';
            reverse = false;
            break;
          case 'PRICE_DESC':
            sortKey = 'PRICE';
            reverse = true;
            break;
          case 'BEST_SELLING':
            sortKey = 'BEST_SELLING';
            reverse = true;
            break;
          case 'RATING':
            sortKey = 'RATING';
            reverse = true;
            break;
          default:
            sortKey = 'CREATED_AT';
            reverse = true;
        }

        const res = await shopifyService.getProducts({
          collection: activeCollection === 'all' ? undefined : activeCollection,
          query: searchFilter || undefined,
          brand: selectedBrand === 'all' ? undefined : selectedBrand,
          onlyDiscounted: onlyDiscounted || undefined,
          sortKey,
          reverse,
        });

        // Apply secondary client filters (e.g. inventory status, rating threshold, fine price slide)
        let filtered = [...res];

        if (onlyInStock) {
          filtered = filtered.filter((p) => p.availableForSale);
        }

        if (minRating > 0) {
          filtered = filtered.filter((p) => p.rating >= minRating);
        }

        // Apply price range slider filter (minVariantPrice <= priceRange slider value)
        filtered = filtered.filter((p) => parseFloat(p.priceRange.minVariantPrice) <= priceRange);

        setProducts(filtered);
      } catch (err) {
        console.error('Error fetching catalog through Shopify Service:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [activeCollection, searchFilter, selectedBrand, priceRange, minRating, onlyInStock, onlyDiscounted, sortBy]);

  // 4. Reset helper
  const clearFilters = () => {
    setActiveCollection('all');
    setSearchFilter('');
    setSelectedBrand('all');
    setPriceRange(25000);
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setSortBy('CREATED_AT_DESC');
    navigateTo('shop', {});
  };

  // Determine active filters for chips
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onClear: () => void }[] = [];
    
    if (activeCollection !== 'all') {
      chips.push({
        id: 'collection',
        label: `Category: ${collections.find(c => c.id === activeCollection)?.name || activeCollection}`,
        onClear: () => setActiveCollection('all')
      });
    }
    if (searchFilter) {
      chips.push({
        id: 'search',
        label: `Search: "${searchFilter}"`,
        onClear: () => setSearchFilter('')
      });
    }
    if (selectedBrand !== 'all') {
      chips.push({
        id: 'brand',
        label: `Brand: ${selectedBrand}`,
        onClear: () => setSelectedBrand('all')
      });
    }
    if (priceRange < 25000) {
      chips.push({
        id: 'price',
        label: `Max Price: ₹${priceRange.toLocaleString('en-IN')}`,
        onClear: () => setPriceRange(25000)
      });
    }
    if (minRating > 0) {
      chips.push({
        id: 'rating',
        label: `Rating: ${minRating}★ & Above`,
        onClear: () => setMinRating(0)
      });
    }
    if (onlyInStock) {
      chips.push({
        id: 'stock',
        label: 'In Stock Only',
        onClear: () => setOnlyInStock(false)
      });
    }
    if (onlyDiscounted) {
      chips.push({
        id: 'discount',
        label: 'On Sale Only',
        onClear: () => setOnlyDiscounted(false)
      });
    }

    return chips;
  }, [activeCollection, searchFilter, selectedBrand, priceRange, minRating, onlyInStock, onlyDiscounted, collections]);

  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = products.length > visibleCount;

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
      
      {/* 1. Header Catalog Panel */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Shop Catalog</span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase mt-1 font-display">
            {activeCollection === 'all' ? 'SHOP ALL OBJECTS' : activeCollection.replace('-', ' ')}
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            Discovered {products.length} architectural objects matched under current criteria.
          </p>
        </div>

        {/* Layout & Sort controls */}
        <div className="flex items-center gap-3 self-start md:self-end w-full md:w-auto">
          
          {/* Sorting */}
          <select
            id="select-sort-by"
            className="flex-1 md:flex-initial px-3 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-700 dark:text-stone-300 focus:outline-hidden rounded-none cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="CREATED_AT_DESC">Newest Release</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
            <option value="BEST_SELLING">Best Selling</option>
            <option value="RATING">Highest Rated</option>
          </select>

          {/* Grid/List layout toggle */}
          <div className="flex border border-stone-200 dark:border-stone-800 rounded-none overflow-hidden shrink-0">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-2.5 cursor-pointer transition-colors ${
                viewLayout === 'grid'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950'
                  : 'bg-white text-stone-400 dark:bg-stone-900'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-2.5 cursor-pointer transition-colors ${
                viewLayout === 'list'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950'
                  : 'bg-white text-stone-400 dark:bg-stone-900'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filter toggle button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden p-2.5 bg-stone-900 text-white dark:bg-white dark:text-stone-950 flex items-center gap-2 text-xs uppercase font-bold tracking-wider rounded-none shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 2. Active Chips & Reset Row */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-stone-100 dark:border-stone-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-2 font-mono">Active:</span>
          {activeChips.map((chip) => (
            <div
              key={chip.id}
              className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-1 text-[10px] font-mono text-stone-700 dark:text-stone-300 rounded-none"
            >
              <span>{chip.label}</span>
              <button onClick={chip.onClear} className="hover:text-rose-500 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={clearFilters}
            className="text-[10px] font-mono font-bold uppercase tracking-wider text-luxury-gold hover:underline cursor-pointer ml-auto"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 3. SIDEBAR FILTER OPTIONS (DESKTOP) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4">
          
          {/* Active search filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Refine Search</h4>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="shop-search"
                type="text"
                placeholder="Type keywords..."
                className="input-premium py-2.5 pl-9 pr-4 text-xs font-mono"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              {searchFilter && (
                <button onClick={() => setSearchFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-950">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Category Collections</h4>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {collections.length > 0 ? (
                collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setActiveCollection(col.id)}
                    className={`text-left text-[11px] uppercase tracking-wider font-mono py-1 cursor-pointer hover:text-luxury-gold transition-colors flex items-center justify-between ${
                      activeCollection === col.id ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500'
                    }`}
                  >
                    <span>{col.name}</span>
                    {activeCollection === col.id && <Check className="w-3.5 h-3.5 text-luxury-gold" />}
                  </button>
                ))
              ) : (
                <span className="text-xs font-mono text-stone-400">Loading categories...</span>
              )}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Brand Scene</h4>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`text-left text-[11px] uppercase tracking-wider font-mono py-1 cursor-pointer hover:text-luxury-gold transition-colors flex items-center justify-between ${
                  selectedBrand === 'all' ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500'
                }`}
              >
                <span>All Brands</span>
                {selectedBrand === 'all' && <Check className="w-3.5 h-3.5 text-luxury-gold" />}
              </button>
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`text-left text-[11px] uppercase tracking-wider font-mono py-1 cursor-pointer hover:text-luxury-gold transition-colors flex items-center justify-between ${
                    selectedBrand === brand ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500'
                  }`}
                >
                  <span>{brand}</span>
                  {selectedBrand === brand && <Check className="w-3.5 h-3.5 text-luxury-gold" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Price Ceiling</h4>
              <span className="text-xs font-mono font-bold text-stone-900 dark:text-white">Under ₹{priceRange.toLocaleString('en-IN')}</span>
            </div>
            <div className="space-y-2">
              <input
                id="price-range-slider"
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-stone-950 dark:accent-white bg-stone-200 dark:bg-stone-800 h-1 cursor-pointer rounded-lg"
              />
              <div className="flex justify-between text-[9px] font-mono text-stone-400">
                <span>Min: ₹1,000</span>
                <span>Max: ₹25,000</span>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Rating Threshold</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'All Verified Ratings', value: 0 },
                { label: '4.5 Stars & Above', value: 4.5 },
                { label: '4.0 Stars & Above', value: 4.0 },
                { label: '3.0 Stars & Above', value: 3.0 },
              ].map((rate) => (
                <button
                  key={rate.value}
                  onClick={() => setMinRating(rate.value)}
                  className={`text-left text-xs font-mono py-1 cursor-pointer hover:text-luxury-gold transition-colors flex items-center justify-between ${
                    minRating === rate.value ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {rate.value > 0 ? (
                      <span className="flex items-center gap-1 text-luxury-gold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rate.value}+</span>
                      </span>
                    ) : (
                      rate.label
                    )}
                  </span>
                  {minRating === rate.value && <Check className="w-3.5 h-3.5 text-luxury-gold" />}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Status */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Stock Availability</h4>
            <div className="flex items-center gap-2.5">
              <input
                id="chk-availability"
                type="checkbox"
                className="w-4 h-4 accent-stone-950 dark:accent-stone-100 cursor-pointer"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <label htmlFor="chk-availability" className="text-xs text-stone-600 dark:text-stone-400 cursor-pointer select-none">
                In Stock Only
              </label>
            </div>
          </div>

          {/* Discount/Sale Filter */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Offers & Deals</h4>
            <div className="flex items-center gap-2.5">
              <input
                id="chk-discount"
                type="checkbox"
                className="w-4 h-4 accent-stone-950 dark:accent-stone-100 cursor-pointer"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
              />
              <label htmlFor="chk-discount" className="text-xs text-stone-600 dark:text-stone-400 cursor-pointer select-none">
                On Sale (Compare-at pricing)
              </label>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={clearFilters}
            className="w-full text-center py-2.5 border border-dashed border-stone-300 dark:border-stone-800 text-[10px] uppercase tracking-widest font-mono text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Clear Active Filters
          </button>
        </aside>

        {/* 4. PRODUCT CATALOG GRID/LIST CANVAS */}
        <main className="lg:col-span-9 space-y-10">
          
          {isLoading ? (
            /* Loading Skeleton Boxes */
            <div className={viewLayout === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" : "space-y-4"}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[4/5] bg-stone-100 dark:bg-stone-800"></div>
                  <div className="h-4 bg-stone-100 dark:bg-stone-800 w-3/4"></div>
                  <div className="h-3 bg-stone-100 dark:bg-stone-800 w-1/2"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-stone-100 dark:bg-stone-800 w-1/4"></div>
                    <div className="h-4 bg-stone-100 dark:bg-stone-800 w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty Search/Filter State */
            <div className="text-center py-24 border border-dashed border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-6">
              <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-stone-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base uppercase tracking-wider mb-2 text-stone-900 dark:text-stone-100">No curation matched criteria</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing active filter chips, lowering rating limits, or broadening keywords to discover Apna Adda's objects.
                </p>
              </div>
              <button onClick={clearFilters} className="btn-premium-primary py-3 px-8 text-[10px]">
                Reset Inventory Catalog
              </button>
            </div>
          ) : viewLayout === 'grid' ? (
            
            /* GRID VIEW LAYOUT */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
              {displayedProducts.map((product) => {
                // Calculate discount percent
                const currentMinPrice = parseFloat(product.priceRange.minVariantPrice);
                const compareMinPrice = product.compareAtPriceRange ? parseFloat(product.compareAtPriceRange.minVariantPrice) : null;
                const hasDiscount = compareMinPrice && compareMinPrice > currentMinPrice;
                const discountPct = hasDiscount ? Math.round(((compareMinPrice! - currentMinPrice) / compareMinPrice!) * 100) : 0;

                return (
                  <div
                    key={product.id}
                    id={`product-card-${product.id}`}
                    className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col hover:border-stone-400 dark:hover:border-stone-600 transition-all duration-300"
                  >
                    <div
                      className="aspect-[4/5] bg-stone-50 dark:bg-stone-950 overflow-hidden relative cursor-pointer border-b border-stone-100 dark:border-stone-900"
                      onClick={() => navigateTo('product', { handle: product.handle })}
                    >
                      <img
                        src={product.images[0]?.url}
                        alt={product.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-750 scale-101"
                        referrerPolicy="no-referrer"
                      />

                      {/* Stock Alert Label */}
                      {!product.availableForSale ? (
                        <span className="absolute top-4 left-4 bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-[8px] font-mono uppercase tracking-widest px-2.5 py-1 font-bold">
                          Sold Out
                        </span>
                      ) : product.inventoryCount && product.inventoryCount < 10 ? (
                        <span className="absolute top-4 left-4 bg-amber-500 text-stone-950 text-[8px] font-mono uppercase tracking-widest px-2.5 py-1 font-bold">
                          Low Stock ({product.inventoryCount})
                        </span>
                      ) : null}

                      {/* Sale Tag */}
                      {hasDiscount && (
                        <span className="absolute bottom-4 left-4 bg-rose-500 text-white text-[8px] font-mono uppercase tracking-widest px-2.5 py-1 font-bold">
                          Save {discountPct}%
                        </span>
                      )}

                      {/* Wishlist toggle */}
                      <button
                        id={`btn-shop-wish-${product.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-full text-stone-400 hover:text-stone-900 shadow-xs active:scale-95 transition-all"
                        aria-label="Add to wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-baseline gap-2">
                          <h3
                            onClick={() => navigateTo('product', { handle: product.handle })}
                            className="font-display font-bold text-sm uppercase tracking-wide cursor-pointer text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors truncate"
                          >
                            {product.title}
                          </h3>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                            {product.brand || product.collections[0]?.replace('-', ' ')}
                          </p>
                          {hasDiscount && (
                            <span className="text-[9px] font-mono text-stone-400 line-through">
                              ₹{compareMinPrice!.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-stone-100 dark:border-stone-900 mt-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-luxury-gold fill-current" />
                          <span className="text-[10px] font-mono text-stone-500">{product.rating}</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-stone-900 dark:text-white">
                          ₹{currentMinPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            
            /* LIST VIEW LAYOUT */
            <div className="space-y-4 animate-fade-in">
              {displayedProducts.map((product) => {
                const currentMinPrice = parseFloat(product.priceRange.minVariantPrice);
                const compareMinPrice = product.compareAtPriceRange ? parseFloat(product.compareAtPriceRange.minVariantPrice) : null;
                const hasDiscount = compareMinPrice && compareMinPrice > currentMinPrice;
                const discountPct = hasDiscount ? Math.round(((compareMinPrice! - currentMinPrice) / compareMinPrice!) * 100) : 0;

                return (
                  <div
                    key={product.id}
                    id={`product-card-list-${product.id}`}
                    className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 flex flex-col sm:flex-row gap-6 hover:border-stone-400 dark:hover:border-stone-600 transition-all"
                  >
                    <div
                      className="w-full sm:w-40 aspect-square bg-stone-50 dark:bg-stone-950 overflow-hidden shrink-0 cursor-pointer border border-stone-100 dark:border-stone-800 relative"
                      onClick={() => navigateTo('product', { handle: product.handle })}
                    >
                      <img
                        src={product.images[0]?.url}
                        alt={product.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {hasDiscount && (
                        <span className="absolute bottom-2 left-2 bg-rose-500 text-white text-[7px] font-mono uppercase tracking-wider px-1.5 py-0.5 font-bold">
                          -{discountPct}%
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3
                              onClick={() => navigateTo('product', { handle: product.handle })}
                              className="font-display font-bold text-base uppercase tracking-wide cursor-pointer text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors"
                            >
                              {product.title}
                            </h3>
                            <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest mt-0.5 block">
                              {product.brand} | {product.collections[0]?.replace('-', ' ')}
                            </span>
                          </div>
                          
                          <button
                            id={`btn-shop-wish-list-${product.id}`}
                            onClick={() => toggleWishlist(product.id)}
                            className="text-stone-300 hover:text-stone-900 p-1"
                            aria-label="Add to wishlist"
                          >
                            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
                          </button>
                        </div>

                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-end pt-4 border-t border-stone-100 dark:border-stone-900 mt-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-[11px] font-mono text-stone-500">
                            <Star className="w-3.5 h-3.5 text-luxury-gold fill-current" />
                            <span>{product.rating}</span>
                          </div>
                          {!product.availableForSale ? (
                            <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-rose-500">
                              Sold Out
                            </span>
                          ) : product.inventoryCount && product.inventoryCount < 10 ? (
                            <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-amber-500">
                              Low Stock ({product.inventoryCount})
                            </span>
                          ) : null}
                        </div>

                        <div className="text-right flex items-baseline gap-2">
                          {hasDiscount && (
                            <span className="text-xs text-stone-400 line-through font-mono">
                              ₹{compareMinPrice!.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-base font-mono font-bold text-stone-900 dark:text-white">
                            ₹{currentMinPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 5. PROGRESS BAR & LOAD MORE PAGINATION */}
          {products.length > 0 && (
            <div className="pt-8 border-t border-stone-100 dark:border-stone-900 text-center space-y-4">
              <span className="text-xs font-mono text-stone-500 block">
                Showing {Math.min(visibleCount, products.length)} of {products.length} architectural objects
              </span>
              
              {/* Premium Progress Bar */}
              <div className="w-48 h-0.5 bg-stone-200 dark:bg-stone-800 mx-auto overflow-hidden relative">
                <div
                  className="bg-stone-950 dark:bg-white h-full transition-all duration-300"
                  style={{ width: `${(Math.min(visibleCount, products.length) / products.length) * 100}%` }}
                ></div>
              </div>

              {hasMore ? (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="btn-premium-secondary py-3 px-10 text-[10px] uppercase tracking-widest font-mono font-bold hover:bg-stone-950 hover:text-white dark:hover:bg-white dark:hover:text-stone-950"
                >
                  Load More Objects
                </button>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block pt-1">
                  Reached the absolute boundaries of our active collection.
                </span>
              )}
            </div>
          )}

        </main>
      </div>

      {/* 6. MOBILE SLIDEOUT FILTERS (SLIDEOVER OVERLAY) */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xs bg-white dark:bg-stone-950 h-full p-6 flex flex-col justify-between shadow-2xl animate-drawer-in">
            <div className="space-y-6 overflow-y-auto pr-1">
              <div className="flex justify-between items-center pb-4 border-b border-stone-100 dark:border-stone-900">
                <span className="font-display font-bold text-sm uppercase tracking-wider">Refine Options</span>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 -mr-1 cursor-pointer hover:text-rose-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Keyword Search</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Refine keyword..."
                    className="input-premium py-2 text-xs font-mono"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  {searchFilter && (
                    <button onClick={() => setSearchFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Collection */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Category Collections</h4>
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setActiveCollection(col.id)}
                      className={`text-left text-xs uppercase py-1 font-mono flex items-center justify-between ${
                        activeCollection === col.id ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500'
                      }`}
                    >
                      <span>{col.name}</span>
                      {activeCollection === col.id && <Check className="w-3.5 h-3.5 text-luxury-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brand */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Brand</h4>
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedBrand('all')}
                    className={`text-left text-xs uppercase py-1 font-mono flex items-center justify-between ${
                      selectedBrand === 'all' ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500'
                    }`}
                  >
                    <span>All Brands</span>
                    {selectedBrand === 'all' && <Check className="w-3.5 h-3.5 text-luxury-gold" />}
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`text-left text-xs uppercase py-1 font-mono flex items-center justify-between ${
                        selectedBrand === b ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500'
                      }`}
                    >
                      <span>{b}</span>
                      {selectedBrand === b && <Check className="w-3.5 h-3.5 text-luxury-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Max Price</h4>
                  <span className="text-xs font-mono font-bold">Under ₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-stone-950 dark:accent-white bg-stone-200 dark:bg-stone-800 h-1 cursor-pointer"
                />
              </div>

              {/* Mobile Rating */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Rating</h4>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: 'All Verified Ratings', value: 0 },
                    { label: '4.5+ Stars', value: 4.5 },
                    { label: '4.0+ Stars', value: 4.0 },
                    { label: '3.0+ Stars', value: 3.0 },
                  ].map((rate) => (
                    <button
                      key={rate.value}
                      onClick={() => setMinRating(rate.value)}
                      className={`text-left text-xs py-1 font-mono flex items-center justify-between ${
                        minRating === rate.value ? 'font-bold text-stone-900 dark:text-white' : 'text-stone-500'
                      }`}
                    >
                      <span>{rate.label}</span>
                      {minRating === rate.value && <Check className="w-3.5 h-3.5 text-luxury-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Stock & Discounts */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Offerings</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      id="chk-mob-avail"
                      type="checkbox"
                      className="w-4 h-4 accent-stone-950 dark:accent-stone-100"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                    />
                    <label htmlFor="chk-mob-avail" className="text-xs text-stone-600 dark:text-stone-400">In Stock Only</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="chk-mob-sale"
                      type="checkbox"
                      className="w-4 h-4 accent-stone-950 dark:accent-stone-100"
                      checked={onlyDiscounted}
                      onChange={(e) => setOnlyDiscounted(e.target.checked)}
                    />
                    <label htmlFor="chk-mob-sale" className="text-xs text-stone-600 dark:text-stone-400">On Sale Only</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-900 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  clearFilters();
                  setShowMobileFilters(false);
                }}
                className="btn-premium-secondary py-3 text-[10px]"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="btn-premium-primary py-3 text-[10px]"
              >
                Apply ({products.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
