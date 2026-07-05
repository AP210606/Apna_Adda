/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { AppView, CartItem, Product, ProductVariant, Customer, CustomerAddress, Order, ToastMessage } from '../types';

interface AppState {
  // Navigation & Routing
  currentView: AppView;
  viewParams: Record<string, any>;
  navigateTo: (view: AppView, params?: Record<string, any>) => void;

  // Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string | null;
  couponDiscount: number; // percentage (e.g. 10 for 10% off)
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Wishlist State
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth / Customer State
  customer: Customer | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string) => Promise<boolean>;
  logout: () => void;
  addAddress: (address: Omit<CustomerAddress, 'id'>) => void;
  setAddressDefault: (addressId: string) => void;
  deleteAddress: (addressId: string) => void;

  // UI State
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (isOpen: boolean) => void;
  isSearchDrawerOpen: boolean;
  setSearchDrawerOpen: (isOpen: boolean) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

// Pre-fill some mock order histories and addresses for testing the custom account section
const mockAddress1: CustomerAddress = {
  id: 'addr-1',
  address1: '102 Luxury Boulevard',
  address2: 'Penthouse A',
  city: 'Mumbai',
  province: 'Maharashtra',
  zip: '400001',
  country: 'India',
  phone: '+91 98765 43210',
  isDefault: true,
};

const mockOrder1: Order = {
  id: 'order-1001',
  orderNumber: 'AA-2026-1001',
  processedAt: '2026-07-01T14:30:00Z',
  totalPrice: '2499.00',
  subtotalPrice: '2350.00',
  totalTax: '149.00',
  fulfillmentStatus: 'FULFILLED',
  trackingCompany: 'Delhivery',
  trackingNumber: 'DEL9876543210',
  trackingUrl: 'https://www.delhivery.com/',
  shippingAddress: mockAddress1,
  lineItems: [
    {
      id: 'line-1',
      title: 'Solitude Minimal Ceramic Vase',
      quantity: 1,
      variant: {
        id: 'var-vase-white',
        title: 'Chalk White / Medium',
        price: '2499.00',
      }
    }
  ]
};

const mockOrder2: Order = {
  id: 'order-1002',
  orderNumber: 'AA-2026-1002',
  processedAt: '2026-07-04T09:15:00Z',
  totalPrice: '14999.00',
  subtotalPrice: '14999.00',
  totalTax: '0.00',
  fulfillmentStatus: 'UNFULFILLED',
  shippingAddress: mockAddress1,
  lineItems: [
    {
      id: 'line-2',
      title: 'Aura Soundbar Companion',
      quantity: 1,
      variant: {
        id: 'var-soundbar-charcoal',
        title: 'Obsidian Black',
        price: '14999.00',
      }
    }
  ]
};

// Helper for localStorage
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to local storage:', e);
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation & Routing with query sync (standard SPA mechanism)
  currentView: 'home',
  viewParams: {},
  navigateTo: (view, params = {}) => {
    set({ currentView: view, viewParams: params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Cart State (loaded from local storage)
  cart: getLocalStorage<CartItem[]>('apna_adda_cart', []),
  addToCart: (product, variant, quantity) => {
    const cart = get().cart;
    const existingIndex = cart.findIndex((item) => item.variant.id === variant.id);

    let newCart: CartItem[];
    if (existingIndex > -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      const newItem: CartItem = {
        id: `${variant.id}-${Date.now()}`,
        product,
        variant,
        quantity,
      };
      newCart = [...cart, newItem];
    }

    set({ cart: newCart });
    setLocalStorage('apna_adda_cart', newCart);
    get().addToast(`Added ${quantity}x ${product.title} (${variant.title}) to bag`, 'success');
  },
  removeFromCart: (cartItemId) => {
    const cart = get().cart;
    const removedItem = cart.find(item => item.id === cartItemId);
    const newCart = cart.filter((item) => item.id !== cartItemId);
    set({ cart: newCart });
    setLocalStorage('apna_adda_cart', newCart);
    if (removedItem) {
      get().addToast(`Removed ${removedItem.product.title} from bag`, 'info');
    }
  },
  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(cartItemId);
      return;
    }
    const cart = get().cart;
    const newCart = cart.map((item) =>
      item.id === cartItemId ? { ...item, quantity } : item
    );
    set({ cart: newCart });
    setLocalStorage('apna_adda_cart', newCart);
  },
  clearCart: () => {
    set({ cart: [], couponCode: null, couponDiscount: 0 });
    setLocalStorage('apna_adda_cart', []);
  },

  // Coupons
  couponCode: null,
  couponDiscount: 0,
  applyCoupon: (code) => {
    const uppercaseCode = code.toUpperCase();
    const validCoupons: Record<string, number> = {
      'WELCOME10': 10,
      'ADDA15': 15,
      'LUXURY20': 20,
    };

    if (uppercaseCode in validCoupons) {
      const discount = validCoupons[uppercaseCode];
      set({ couponCode: uppercaseCode, couponDiscount: discount });
      get().addToast(`Coupon "${uppercaseCode}" applied! Enjoy ${discount}% off.`, 'success');
      return true;
    }

    get().addToast('Invalid coupon code', 'error');
    return false;
  },
  removeCoupon: () => {
    set({ couponCode: null, couponDiscount: 0 });
    get().addToast('Coupon removed', 'info');
  },

  // Wishlist State (loaded from local storage)
  wishlist: getLocalStorage<string[]>('apna_adda_wishlist', []),
  toggleWishlist: (productId) => {
    const wishlist = get().wishlist;
    const isAlreadyIn = wishlist.includes(productId);
    let newWishlist: string[];

    if (isAlreadyIn) {
      newWishlist = wishlist.filter((id) => id !== productId);
      get().addToast('Removed from wishlist', 'info');
    } else {
      newWishlist = [...wishlist, productId];
      get().addToast('Added to wishlist', 'success');
    }

    set({ wishlist: newWishlist });
    setLocalStorage('apna_adda_wishlist', newWishlist);
  },
  isInWishlist: (productId) => {
    return get().wishlist.includes(productId);
  },

  // Auth / Customer State (Mock Client Auth)
  customer: getLocalStorage<Customer | null>('apna_adda_customer', null),
  isLoggedIn: getLocalStorage<boolean>('apna_adda_logged_in', false),

  login: async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple mock auth for frontend logic
    if (email.includes('@')) {
      const namePart = email.split('@')[0];
      const firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const lastName = 'Adda Member';

      const mockCustomer: Customer = {
        id: 'cust-2026',
        firstName,
        lastName,
        email,
        phone: '+91 99999 99999',
        addresses: [mockAddress1],
        orders: [mockOrder1, mockOrder2],
      };

      set({ customer: mockCustomer, isLoggedIn: true });
      setLocalStorage('apna_adda_customer', mockCustomer);
      setLocalStorage('apna_adda_logged_in', true);
      get().addToast(`Welcome back, ${firstName}!`, 'success');
      return true;
    }
    return false;
  },

  register: async (firstName, lastName, email) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email.includes('@')) {
      const mockCustomer: Customer = {
        id: 'cust-2026-new',
        firstName,
        lastName,
        email,
        addresses: [],
        orders: [],
      };

      set({ customer: mockCustomer, isLoggedIn: true });
      setLocalStorage('apna_adda_customer', mockCustomer);
      setLocalStorage('apna_adda_logged_in', true);
      get().addToast(`Account created! Welcome, ${firstName}!`, 'success');
      return true;
    }
    return false;
  },

  logout: () => {
    set({ customer: null, isLoggedIn: false, currentView: 'home' });
    localStorage.removeItem('apna_adda_customer');
    localStorage.removeItem('apna_adda_logged_in');
    get().addToast('Logged out successfully', 'info');
  },

  addAddress: (addressData) => {
    const customer = get().customer;
    if (!customer) return;

    const newAddress: CustomerAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };

    let updatedAddresses = [...customer.addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({ ...addr, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    const updatedCustomer: Customer = {
      ...customer,
      addresses: updatedAddresses,
    };

    set({ customer: updatedCustomer });
    setLocalStorage('apna_adda_customer', updatedCustomer);
    get().addToast('Address added successfully', 'success');
  },

  setAddressDefault: (addressId) => {
    const customer = get().customer;
    if (!customer) return;

    const updatedAddresses = customer.addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));

    const updatedCustomer: Customer = {
      ...customer,
      addresses: updatedAddresses,
    };

    set({ customer: updatedCustomer });
    setLocalStorage('apna_adda_customer', updatedCustomer);
    get().addToast('Default address updated', 'success');
  },

  deleteAddress: (addressId) => {
    const customer = get().customer;
    if (!customer) return;

    const updatedAddresses = customer.addresses.filter((addr) => addr.id !== addressId);

    // If we deleted the default, make the first one default (if any)
    if (customer.addresses.find((addr) => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    const updatedCustomer: Customer = {
      ...customer,
      addresses: updatedAddresses,
    };

    set({ customer: updatedCustomer });
    setLocalStorage('apna_adda_customer', updatedCustomer);
    get().addToast('Address deleted', 'info');
  },

  // UI States
  theme: getLocalStorage<'light' | 'dark'>('apna_adda_theme', 'light'),
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: nextTheme });
    setLocalStorage('apna_adda_theme', nextTheme);

    // Sync body class
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(nextTheme);
  },

  isCartDrawerOpen: false,
  setCartDrawerOpen: (isOpen) => set({ isCartDrawerOpen: isOpen }),

  isSearchDrawerOpen: false,
  setSearchDrawerOpen: (isOpen) => set({ isSearchDrawerOpen: isOpen }),

  toasts: [],
  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastMessage = { id, type, message };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
