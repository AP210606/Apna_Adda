/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Collection } from '../types';
import { PRODUCTS, COLLECTIONS } from '../data/products';

// Abstraction representing typical Shopify GraphQL responses or custom server API endpoints

export interface ShopifyQueryParams {
  collection?: string;
  query?: string;
  sortKey?: 'PRICE' | 'CREATED_AT' | 'BEST_SELLING' | 'RATING';
  reverse?: boolean;
  brand?: string;
  onlyDiscounted?: boolean;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

/**
 * Reusable dynamic product enrichment helper.
 * Simulates Shopify API populating brand, videoUrl, features, inventory, Q&As, etc.
 */
export function enrichProduct(product: Product): Product {
  // 1. Determine Brand
  let brand = 'Apna Adda Design';
  if (product.tags.some(t => ['Audio', 'Speakers', 'Soundbar'].includes(t))) {
    brand = 'Aura Audio';
  } else if (product.tags.some(t => ['MagSafe', 'Charger', 'Power', 'Dock'].includes(t))) {
    brand = 'Orbit Mobile';
  } else if (product.tags.some(t => ['Vase', 'Ceramic', 'Stoneware'].includes(t))) {
    brand = 'Solitude Ceramics';
  } else if (product.tags.some(t => ['Workspace', 'Office', 'Desk'].includes(t))) {
    brand = 'Zen Desk';
  } else if (product.tags.some(t => ['Beauty', 'Care', 'Jade'].includes(t))) {
    brand = 'Verdant Senses';
  } else if (product.tags.some(t => ['Fashion', 'Apparel', 'Leather'].includes(t))) {
    brand = 'Heritage Wear';
  }

  // 2. Deterministic low-stock/inventory count based on character codes
  const codeSum = product.title.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const inventoryCount = (codeSum % 28) + 2; // Returns 2 to 29 units

  // 3. Sample Product Video URLs
  const videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-modern-black-smartphone-40541-large.mp4';

  // 4. Custom Key Features
  const features = [
    'Handcrafted premium materials selected for geometric beauty and longevity.',
    'Engineered specifically with modern Indian homes and workspaces in mind.',
    'Minimalist footprint with advanced multi-functional capabilities.',
    'Fully sustainable raw materials and double-walled recyclable packaging.'
  ];

  // 5. Standard Indian Ecommerce Customer Q&As
  const questions = [
    {
      id: `${product.id}-q1`,
      question: 'Is Cash on Delivery (COD) supported for my location?',
      answer: 'Yes! We support Cash on Delivery (COD) across 19,000+ Indian pin codes with free zero-cost handling. You can also pay digitally via UPI (GPAY, PhonePe) at delivery.',
      author: 'Rohit K. (Ahmedabad)',
      date: '2026-06-28'
    },
    {
      id: `${product.id}-q2`,
      question: 'What happens in case of shipping transit damages?',
      answer: 'We provide immediate 100% replacements! Since glass and ceramic items are fragile, we recommend recording a continuous unedited unboxing video to claim rapid transit insurance.',
      author: 'Priya M. (Mumbai)',
      date: '2026-07-02'
    },
    {
      id: `${product.id}-q3`,
      question: 'Is there a warranty included with this Apna Adda purchase?',
      answer: 'Yes, this product is protected under our 1-Year Apna Adda brand warranty program which includes comprehensive material defect replacement and free home pickups.',
      author: 'Arjun S. (Bangalore)',
      date: '2026-07-04'
    }
  ];

  return {
    ...product,
    brand,
    inventoryCount,
    videoUrl,
    features,
    questions,
    shippingInfo: product.shippingInfo || 'Free express shipping across India. Standard delivery takes 3-5 days for metropolitan areas and 5-7 days for tier-2 or tier-3 regions.',
    returnPolicy: product.returnPolicy || '7-day hassle-free return window for products in original, unboxing conditions. Unedited unboxing video proof is required for fragile items.'
  };
}

export const shopifyService = {
  /**
   * Get all active collections on the shopify store.
   */
  async getCollections(): Promise<Collection[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return COLLECTIONS;
  },

  /**
   * Get a list of all unique brands.
   */
  async getBrands(): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    // Derived dynamically from our static catalog using enrichment
    const brands = new Set<string>();
    PRODUCTS.forEach(p => {
      const enriched = enrichProduct(p);
      if (enriched.brand) brands.add(enriched.brand);
    });
    return Array.from(brands);
  },

  /**
   * Get a single collection by handle.
   */
  async getCollectionByHandle(handle: string): Promise<Collection | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return COLLECTIONS.find((col) => col.handle === handle);
  },

  /**
   * Get products with optional filter, search, collection-scoping, and sorting parameters.
   */
  async getProducts(params: ShopifyQueryParams = {}): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let items = PRODUCTS.map(enrichProduct);

    // 1. Filter by collection
    if (params.collection) {
      items = items.filter((item) => item.collections.includes(params.collection!));
    }

    // 2. Filter by search query
    if (params.query) {
      const q = params.query.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.brand && item.brand.toLowerCase().includes(q)) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // 3. Filter by brand
    if (params.brand && params.brand !== 'all') {
      items = items.filter((item) => item.brand === params.brand);
    }

    // 4. Filter by onlyDiscounted (has compare at price)
    if (params.onlyDiscounted) {
      items = items.filter((item) => {
        const hasVariantDiscount = item.variants.some(v => v.compareAtPrice && parseFloat(v.compareAtPrice) > parseFloat(v.price));
        const hasRangeDiscount = item.compareAtPriceRange && parseFloat(item.compareAtPriceRange.minVariantPrice) > parseFloat(item.priceRange.minVariantPrice);
        return hasVariantDiscount || hasRangeDiscount;
      });
    }

    // 5. Filter by rating
    if (params.minRating && params.minRating > 0) {
      items = items.filter((item) => item.rating >= params.minRating!);
    }

    // 6. Filter by price range
    if (params.minPrice !== undefined) {
      items = items.filter((item) => parseFloat(item.priceRange.minVariantPrice) >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      items = items.filter((item) => parseFloat(item.priceRange.minVariantPrice) <= params.maxPrice!);
    }

    // 7. Apply sorting
    if (params.sortKey) {
      items.sort((a, b) => {
        let valA = 0;
        let valB = 0;

        if (params.sortKey === 'PRICE') {
          valA = parseFloat(a.priceRange.minVariantPrice);
          valB = parseFloat(b.priceRange.minVariantPrice);
        } else if (params.sortKey === 'BEST_SELLING') {
          valA = a.isBestSeller ? 1 : 0;
          valB = b.isBestSeller ? 1 : 0;
        } else if (params.sortKey === 'RATING') {
          valA = a.rating;
          valB = b.rating;
        } else {
          // CREATED_AT (by id)
          return a.id.localeCompare(b.id);
        }

        return valA - valB;
      });

      if (params.reverse) {
        items.reverse();
      }
    }

    return items;
  },

  /**
   * Retrieve a specific product by its URL handle.
   */
  async getProductByHandle(handle: string): Promise<Product | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const found = PRODUCTS.find((item) => item.handle === handle);
    return found ? enrichProduct(found) : undefined;
  },

  /**
   * Retrieve products belonging to the same collection(s) excluding the active product.
   */
  async getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const collections = product.collections;
    
    const related = PRODUCTS.filter(
      (item) =>
        item.id !== product.id &&
        item.collections.some((col) => collections.includes(col))
    );

    // If we do not have enough related items, pad with best sellers or trending
    if (related.length < limit) {
      const rest = PRODUCTS.filter(
        (item) => item.id !== product.id && !related.some((r) => r.id === item.id)
      );
      related.push(...rest);
    }

    return related.slice(0, limit).map(enrichProduct);
  },

  /**
   * Quick live-search suggestions helper (autocompletion)
   */
  async getSearchSuggestions(query: string): Promise<{ title: string; handle: string; price: string; image: string }[]> {
    if (!query) return [];
    await new Promise((resolve) => setTimeout(resolve, 100));
    const q = query.toLowerCase();

    return PRODUCTS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    )
      .slice(0, 5)
      .map((item) => ({
        title: item.title,
        handle: item.handle,
        price: item.priceRange.minVariantPrice,
        image: item.images[0]?.url || ''
      }));
  }
};
