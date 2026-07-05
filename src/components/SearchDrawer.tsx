/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { shopifyService } from '../services/shopify';
import { X, Search as SearchIcon, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function SearchDrawer() {
  const { isSearchDrawerOpen, setSearchDrawerOpen, navigateTo, setSearchQuery } = useAppStore();
  const [localQuery, setLocalQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ title: string; handle: string; price: string; image: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchDrawerOpen) {
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSearchDrawerOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      setLocalQuery('');
      setSuggestions([]);
    }
  }, [isSearchDrawerOpen]);

  useEffect(() => {
    if (!localQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await shopifyService.getSearchSuggestions(localQuery);
        setSuggestions(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [localQuery]);

  if (!isSearchDrawerOpen) return null;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!localQuery.trim()) return;

    setSearchQuery(localQuery);
    setSearchDrawerOpen(false);
    navigateTo('search', { query: localQuery });
  };

  const handleSuggestionClick = (handle: string) => {
    setSearchDrawerOpen(false);
    navigateTo('product', { handle });
  };

  return (
    <div id="search-drawer-backdrop" className="fixed inset-0 z-50 flex flex-col justify-start bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div id="search-drawer-content" className="w-full bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 p-6 md:p-10 shadow-2xl animate-slide-down">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="font-display font-black tracking-widest text-xs uppercase text-stone-400">Search Catalog</span>
            <button
              id="btn-close-search"
              onClick={() => setSearchDrawerOpen(false)}
              className="p-2 -mr-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-stone-900 dark:border-stone-100 py-3 mb-6">
            <SearchIcon className="w-6 h-6 text-stone-400 mr-4" />
            <input
              ref={inputRef}
              id="input-search-query"
              type="text"
              className="w-full bg-transparent text-xl md:text-3xl font-display font-light placeholder:text-stone-300 dark:placeholder:text-stone-700 text-stone-900 dark:text-stone-100 outline-hidden"
              placeholder="What are you looking for?"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
            {localQuery && (
              <button
                type="submit"
                className="ml-2 p-2 bg-stone-900 text-white dark:bg-white dark:text-stone-950 hover:opacity-90 active:scale-95 transition-all"
                aria-label="Submit search"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </form>

          {/* Search Suggestions */}
          <div>
            {isLoading && (
              <p className="text-xs font-mono text-stone-400">Searching inventory...</p>
            )}

            {!isLoading && suggestions.length > 0 && (
              <div className="animate-fade-in">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-4">Suggested Products</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((item) => (
                    <div
                      key={item.handle}
                      onClick={() => handleSuggestionClick(item.handle)}
                      className="flex items-center gap-4 p-2 hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer border border-transparent hover:border-stone-100 dark:hover:border-stone-800 transition-all group"
                    >
                      <div className="w-14 h-14 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
                            <SearchIcon className="w-4 h-4 text-stone-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-display font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-luxury-gold transition-colors">{item.title}</h4>
                        <p className="text-xs font-mono text-stone-500 mt-0.5">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                      </div>
                      <CornerDownLeft className="w-4 h-4 text-stone-300 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && localQuery.trim() !== '' && suggestions.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-stone-500">No suggestions match "{localQuery}". Press enter to see full search page.</p>
              </div>
            )}

            {localQuery.trim() === '' && (
              <div className="animate-fade-in">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-4">Trending Collections</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSearchDrawerOpen(false);
                      navigateTo('shop', { collection: 'curated-living' });
                    }}
                    className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:border-stone-900 dark:hover:border-stone-100 text-xs uppercase tracking-wider font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-all cursor-pointer"
                  >
                    Curated Living
                  </button>
                  <button
                    onClick={() => {
                      setSearchDrawerOpen(false);
                      navigateTo('shop', { collection: 'personal-tech' });
                    }}
                    className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:border-stone-900 dark:hover:border-stone-100 text-xs uppercase tracking-wider font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-all cursor-pointer"
                  >
                    Personal Tech
                  </button>
                  <button
                    onClick={() => {
                      setSearchDrawerOpen(false);
                      navigateTo('shop', { collection: 'modern-apparel' });
                    }}
                    className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:border-stone-900 dark:hover:border-stone-100 text-xs uppercase tracking-wider font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-all cursor-pointer"
                  >
                    Modern Apparel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 cursor-pointer" onClick={() => setSearchDrawerOpen(false)}></div>
    </div>
  );
}
