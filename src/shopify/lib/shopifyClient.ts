/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, ProductVariant, Collection, CustomerAddress, Order, OrderLineItem } from '../../types';
import { ShopifyProduct, ShopifyProductVariant, ShopifyCollection, ShopifyAddress, ShopifyOrder, ShopifyOrderLineItem } from '../graphql/types';
import { enrichProduct } from '../../services/shopify';

/**
 * Adapter utility converting Storefront API models into our application's design contracts
 */
export const shopifyAdapter = {
  /**
   * Adapts Shopify product variant to application's ProductVariant type
   */
  variant(sv: ShopifyProductVariant): ProductVariant {
    return {
      id: sv.id,
      title: sv.title,
      price: sv.price.amount,
      compareAtPrice: sv.compareAtPrice?.amount || undefined,
      availableForSale: sv.availableForSale,
      selectedOptions: sv.selectedOptions.map(opt => ({
        name: opt.name,
        value: opt.value
      })),
    };
  },

  /**
   * Adapts Shopify product to application's Product type
   */
  product(sp: ShopifyProduct): Product {
    const images = sp.images?.edges?.map(e => ({
      id: e.node.id || `img-${Date.now()}`,
      url: e.node.url,
      altText: e.node.altText || sp.title,
      width: e.node.width || 800,
      height: e.node.height || 800,
    })) || [];

    const variants = sp.variants?.edges?.map(e => this.variant(e.node)) || [];

    const priceRange = {
      minVariantPrice: sp.priceRange.minVariantPrice.amount,
      maxVariantPrice: sp.priceRange.maxVariantPrice.amount,
    };

    const compareAtPriceRange = sp.compareAtPriceRange ? {
      minVariantPrice: sp.compareAtPriceRange.minVariantPrice.amount,
      maxVariantPrice: sp.compareAtPriceRange.maxVariantPrice.amount,
    } : undefined;

    const baseProduct: Product = {
      id: sp.id,
      title: sp.title,
      handle: sp.handle,
      description: sp.description,
      images,
      variants,
      options: [],
      priceRange,
      compareAtPriceRange,
      availableForSale: sp.availableForSale !== undefined ? sp.availableForSale : true,
      tags: sp.tags || [],
      collections: sp.collections?.edges?.map(e => e.node.handle) || [],
      rating: 4.8, // Fallback default
      reviewsCount: 12,
      reviews: [],
      specifications: {},
      isBestSeller: sp.tags?.includes('Best Seller') || false,
      isTrending: sp.tags?.includes('New') || false,
    };

    // Enrich with local high-fidelity brand metadata to preserve UI excellence
    return enrichProduct(baseProduct);
  },

  /**
   * Adapts Shopify collection to application's Collection type
   */
  collection(sc: ShopifyCollection): Collection {
    return {
      id: sc.id,
      title: sc.title,
      handle: sc.handle,
      description: sc.description || '',
      image: sc.image ? { url: sc.image.url, altText: sc.image.altText || sc.title } : undefined,
    };
  },

  /**
   * Adapts Shopify address to application's CustomerAddress type
   */
  address(sa: ShopifyAddress, isDefault = false): CustomerAddress {
    return {
      id: sa.id,
      address1: sa.address1,
      address2: sa.address2 || '',
      city: sa.city,
      province: sa.province || '',
      zip: sa.zip,
      country: sa.country,
      phone: sa.phone || '',
      isDefault,
    };
  },

  /**
   * Adapts Shopify order line item
   */
  orderLineItem(sol: ShopifyOrderLineItem, index: number): OrderLineItem {
    return {
      id: sol.variant?.id || `oli-${index}`,
      title: sol.title,
      quantity: sol.quantity,
      variant: {
        id: sol.variant?.id || `var-${index}`,
        title: sol.variant?.title || 'Default Variant',
        price: sol.variant?.price?.amount || sol.originalTotalPrice.amount,
      },
    };
  },

  /**
   * Adapts Shopify order to application's Order type
   */
  order(so: ShopifyOrder): Order {
    const lineItems = so.lineItems?.edges?.map((e, idx) => this.orderLineItem(e.node, idx)) || [];
    const shippingAddress = so.shippingAddress ? this.address(so.shippingAddress, false) : undefined;
    
    // Extract tracking info if available
    const fulfillment = so.successfulFulfillments?.[0];
    const trackingCompany = fulfillment?.trackingCompany || undefined;
    const trackingNumber = fulfillment?.trackingInfo?.[0]?.number || undefined;
    const trackingUrl = fulfillment?.trackingInfo?.[0]?.url || undefined;

    return {
      id: so.id,
      orderNumber: `SO-${so.orderNumber}`,
      processedAt: so.processedAt,
      totalPrice: so.totalPrice.amount,
      subtotalPrice: so.subtotalPrice?.amount || so.totalPrice.amount,
      totalTax: so.totalTax?.amount || '0.00',
      fulfillmentStatus: (so.fulfillmentStatus || 'UNFULFILLED') as 'FULFILLED' | 'UNFULFILLED' | 'PARTIALLY_FULFILLED' | 'RESTOCKED',
      shippingAddress,
      lineItems,
      trackingCompany,
      trackingNumber,
      trackingUrl,
    };
  }
};
