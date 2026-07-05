/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { PRODUCTS } from '../data/products';
import { Heart, Trash2, ShoppingBag, Eye } from 'lucide-react';

export default function WishlistView() {
  const { wishlist, toggleWishlist, addToCart, navigateTo } = useAppStore();

  // Find all products in wishlist
  const wishlistedItems = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Personal Curation</span>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 uppercase font-display">YOUR WISHLIST</h1>
        <p className="text-xs text-stone-500 mt-2">Your saved premium daily objects in a secure local sandbox.</p>
      </div>

      {wishlistedItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-stone-400" />
          </div>
          <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-2">Wishlist is empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Explore the Apna Adda collection to save objects of physical integrity and geometric beauty.
          </p>
          <button onClick={() => navigateTo('shop')} className="btn-premium-primary py-3 px-8 text-[10px]">
            Discover Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedItems.map((product) => {
            const hasDiscount = product.compareAtPriceRange?.minVariantPrice;
            return (
              <div
                key={product.id}
                id={`wishlist-card-${product.id}`}
                className="group border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col"
              >
                {/* Image panel */}
                <div
                  className="aspect-[4/5] bg-stone-50 dark:bg-stone-950 overflow-hidden relative cursor-pointer border-b border-stone-100 dark:border-stone-900"
                  onClick={() => navigateTo('product', { handle: product.handle })}
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-750"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Delete button float */}
                  <button
                    id={`btn-wishlist-delete-${product.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-full text-stone-400 hover:text-rose-500 shadow-xs active:scale-95 transition-all"
                    aria-label="Delete saved item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info and quick checkout */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3
                      onClick={() => navigateTo('product', { handle: product.handle })}
                      className="font-display font-bold text-sm uppercase tracking-wide cursor-pointer text-stone-900 dark:text-stone-100 hover:text-luxury-gold transition-colors truncate"
                    >
                      {product.title}
                    </h3>
                    <p className="text-[9px] font-mono text-stone-400 uppercase tracking-widest mt-0.5">
                      {product.collections[0]?.replace('-', ' ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-900">
                    <span className="text-xs font-mono font-bold">
                      ₹{parseFloat(product.priceRange.minVariantPrice).toLocaleString('en-IN')}
                    </span>

                    <button
                      id={`btn-wishlist-add-bag-${product.id}`}
                      onClick={() => {
                        addToCart(product, product.variants[0], 1);
                      }}
                      disabled={!product.availableForSale}
                      className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest bg-stone-900 text-stone-100 dark:bg-stone-50 dark:text-stone-900 py-1.5 px-3 hover:opacity-90 active:scale-95 transition-all"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>{product.availableForSale ? 'Add Bag' : 'Sold Out'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
