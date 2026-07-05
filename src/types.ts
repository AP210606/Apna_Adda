/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Core Shopify-aligned Ecommerce Types for Apna Adda

export interface Image {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  image?: Image;
  sku?: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  images: Image[];
  variants: ProductVariant[];
  options: ProductOption[];
  priceRange: {
    minVariantPrice: string;
    maxVariantPrice: string;
  };
  compareAtPriceRange?: {
    minVariantPrice: string;
    maxVariantPrice: string;
  };
  availableForSale: boolean;
  tags: string[];
  collections: string[]; // collection handles
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  specifications: Record<string, string>;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isFlashDeal?: boolean;
  flashDealDiscount?: number; // percentage
  shippingInfo?: string;
  returnPolicy?: string;
  brand?: string;
  features?: string[];
  videoUrl?: string;
  inventoryCount?: number;
  questions?: { id: string; question: string; answer: string; author: string; date: string }[];
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: Image;
}

export interface CartItem {
  id: string; // Typically variant ID or customized cart line ID
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface CustomerAddress {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface OrderLineItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: string;
    image?: Image;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  processedAt: string;
  totalPrice: string;
  subtotalPrice: string;
  totalTax: string;
  lineItems: OrderLineItem[];
  shippingAddress: CustomerAddress;
  fulfillmentStatus: 'UNFULFILLED' | 'FULFILLED' | 'PARTIALLY_FULFILLED' | 'RESTOCKED';
  trackingUrl?: string;
  trackingCompany?: string;
  trackingNumber?: string;
}

export type Address = CustomerAddress;
export type OrderItem = OrderLineItem;

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  description: string;
  expiryDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'promotion' | 'security';
  createdAt: string;
  read: boolean;
}

export interface Reward {
  points: number;
  membershipLevel: 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
  pointsToNextTier: number;
  history: {
    id: string;
    description: string;
    points: number;
    date: string;
  }[];
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  language?: string;
  avatarUrl?: string;
  addresses: CustomerAddress[];
  orders: Order[];
  coupons?: Coupon[];
  notifications?: Notification[];
  reward?: Reward;
}

// UI and Navigation Types

export type AppView =
  | 'home'
  | 'shop'
  | 'collections'
  | 'product' // Requires activeProductHandle or activeProductId
  | 'search'
  | 'wishlist'
  | 'cart'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'reset-password'
  | 'verify-email'
  | 'account'
  | 'orders'
  | 'order-detail' // Requires activeOrderId
  | 'track-order'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'refund'
  | 'shipping'
  | 'terms';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}
