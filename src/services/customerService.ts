/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Customer, CustomerAddress, Order, Coupon, Notification, Reward, Product } from '../types';
import { PRODUCTS } from '../data/products';

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

// Seed Mock Data
const SEED_ADDRESSES: CustomerAddress[] = [
  {
    id: 'addr-1',
    address1: '402, Elite Heights',
    address2: 'Opposite Prahlad Nagar Garden',
    city: 'Ahmedabad',
    province: 'Gujarat',
    zip: '380015',
    country: 'India',
    phone: '+91 93228 72930',
    isDefault: true,
  },
  {
    id: 'addr-2',
    address1: '7B, Maker Chambers',
    address2: 'Nariman Point',
    city: 'Mumbai',
    province: 'Maharashtra',
    zip: '400021',
    country: 'India',
    phone: '+91 98765 43210',
    isDefault: false,
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'order-1001',
    orderNumber: 'AA-2026-1001',
    processedAt: '2026-06-25T14:30:00Z',
    totalPrice: '5499.00',
    subtotalPrice: '5350.00',
    totalTax: '149.00',
    fulfillmentStatus: 'FULFILLED',
    trackingCompany: 'Delhivery',
    trackingNumber: 'DEL9322872930',
    trackingUrl: 'https://www.delhivery.com/',
    shippingAddress: SEED_ADDRESSES[0],
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
      },
      {
        id: 'line-2',
        title: 'Nomad Leather Carry Keychain',
        quantity: 1,
        variant: {
          id: 'var-keychain-tan',
          title: 'Saddle Tan / Minimalist',
          price: '3000.00',
        }
      }
    ]
  },
  {
    id: 'order-1002',
    orderNumber: 'AA-2026-1002',
    processedAt: '2026-07-04T09:15:00Z',
    totalPrice: '14999.00',
    subtotalPrice: '14999.00',
    totalTax: '0.00',
    fulfillmentStatus: 'UNFULFILLED',
    shippingAddress: SEED_ADDRESSES[0],
    lineItems: [
      {
        id: 'line-3',
        title: 'Aura Soundbar Companion',
        quantity: 1,
        variant: {
          id: 'var-soundbar-charcoal',
          title: 'Obsidian Black',
          price: '14999.00',
        }
      }
    ]
  }
];

const SEED_COUPONS: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME10',
    discountPercent: 10,
    status: 'ACTIVE',
    description: 'Welcome to the inner circle. Get 10% off your first luxury order.',
    expiryDate: '2026-12-31',
  },
  {
    id: 'coupon-2',
    code: 'ADDA15',
    discountPercent: 15,
    status: 'ACTIVE',
    description: 'Exclusive loyalty coupon. Get 15% off across all designer collections.',
    expiryDate: '2026-08-31',
  },
  {
    id: 'coupon-3',
    code: 'FESTIVE25',
    discountPercent: 25,
    status: 'EXPIRED',
    description: 'Limited-time celebration pass.',
    expiryDate: '2026-01-01',
  }
];

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Order AA-2026-1001 Dispatched',
    message: 'Your order has been handed over to Delhivery. Track your shipment live using DelNo DEL9322872930.',
    type: 'order',
    createdAt: '2026-06-26T10:00:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Unlock Diamond Tier Benefits',
    message: 'You are only 150 points away from Diamond tier! Upgrade to unlock complimentary gift wraps and direct customer care hotlines.',
    type: 'offer',
    createdAt: '2026-07-01T15:45:00Z',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Weekly Security Integrity Check Passed',
    message: 'Your account was accessed from Ahmedabad, India. If this was you, no action is needed.',
    type: 'security',
    createdAt: '2026-07-03T11:20:00Z',
    read: true,
  }
];

const SEED_REWARD: Reward = {
  points: 1250,
  membershipLevel: 'GOLD',
  pointsToNextTier: 250,
  history: [
    {
      id: 'rew-h1',
      description: 'Acquired via Order AA-2026-1001',
      points: 250,
      date: '2026-06-25',
    },
    {
      id: 'rew-h2',
      description: 'Welcome Account Activation Bonus',
      points: 1000,
      date: '2026-06-24',
    }
  ]
};

// Initialize or Retrieve Client Account State
const getOrInitializeCustomer = (): Customer => {
  let customer = getLocalStorage<Customer | null>('apna_adda_customer', null);
  if (!customer) {
    customer = {
      id: 'cust-2026',
      firstName: 'Arjun',
      lastName: 'Sharma',
      email: 'arjun@apnaadda.store',
      phone: '+91 93228 72930',
      birthday: '1995-10-15',
      gender: 'Male',
      language: 'English',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      addresses: SEED_ADDRESSES,
      orders: SEED_ORDERS,
      coupons: SEED_COUPONS,
      notifications: SEED_NOTIFICATIONS,
      reward: SEED_REWARD,
    };
    setLocalStorage('apna_adda_customer', customer);
    setLocalStorage('apna_adda_logged_in', true);
  } else {
    // Ensure all custom attributes exist
    if (!customer.coupons) customer.coupons = SEED_COUPONS;
    if (!customer.notifications) customer.notifications = SEED_NOTIFICATIONS;
    if (!customer.reward) customer.reward = SEED_REWARD;
    if (!customer.birthday) customer.birthday = '1995-10-15';
    if (!customer.gender) customer.gender = 'Male';
    if (!customer.language) customer.language = 'English';
    if (!customer.avatarUrl) customer.avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
  }
  return customer;
};

export const customerService = {
  /**
   * Fetch current authenticated customer
   */
  async getCustomer(): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Network simulation
    return getOrInitializeCustomer();
  },

  /**
   * Update profile attributes
   */
  async updateProfile(updates: Partial<Customer>): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const customer = getOrInitializeCustomer();
    const updated = { ...customer, ...updates };
    setLocalStorage('apna_adda_customer', updated);
    return updated;
  },

  /**
   * Add new delivery address
   */
  async addAddress(address: Omit<CustomerAddress, 'id'>): Promise<CustomerAddress> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const customer = getOrInitializeCustomer();
    const newAddress: CustomerAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };

    let updatedAddresses = [...customer.addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    const updatedCustomer = { ...customer, addresses: updatedAddresses };
    setLocalStorage('apna_adda_customer', updatedCustomer);
    return newAddress;
  },

  /**
   * Update existing address
   */
  async updateAddress(addressId: string, updates: Partial<CustomerAddress>): Promise<CustomerAddress> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const customer = getOrInitializeCustomer();
    let updatedAddresses = customer.addresses.map((addr) => {
      if (addr.id === addressId) {
        return { ...addr, ...updates };
      }
      return addr;
    });

    if (updates.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
    }

    const updatedCustomer = { ...customer, addresses: updatedAddresses };
    setLocalStorage('apna_adda_customer', updatedCustomer);
    return updatedAddresses.find((a) => a.id === addressId)!;
  },

  /**
   * Delete address from directory
   */
  async deleteAddress(addressId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const customer = getOrInitializeCustomer();
    const addressToDelete = customer.addresses.find((a) => a.id === addressId);
    let updatedAddresses = customer.addresses.filter((addr) => addr.id !== addressId);

    if (addressToDelete?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    const updatedCustomer = { ...customer, addresses: updatedAddresses };
    setLocalStorage('apna_adda_customer', updatedCustomer);
    return true;
  },

  /**
   * Set specific address as default
   */
  async setAddressDefault(addressId: string): Promise<CustomerAddress[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const customer = getOrInitializeCustomer();
    const updatedAddresses = customer.addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));

    const updatedCustomer = { ...customer, addresses: updatedAddresses };
    setLocalStorage('apna_adda_customer', updatedCustomer);
    return updatedAddresses;
  },

  /**
   * Fetch customer notifications
   */
  async getNotifications(): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const customer = getOrInitializeCustomer();
    return customer.notifications || [];
  },

  /**
   * Mark all or single notification as read
   */
  async markNotificationRead(id?: string): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const customer = getOrInitializeCustomer();
    const notifs = (customer.notifications || []).map((n) => {
      if (!id || n.id === id) {
        return { ...n, read: true };
      }
      return n;
    });
    const updatedCustomer = { ...customer, notifications: notifs };
    setLocalStorage('apna_adda_customer', updatedCustomer);
    return notifs;
  },

  /**
   * Fetch customer rewards profile
   */
  async getRewards(): Promise<Reward> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const customer = getOrInitializeCustomer();
    return customer.reward || SEED_REWARD;
  },

  /**
   * Fetch customer-applicable coupons
   */
  async getCoupons(): Promise<Coupon[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const customer = getOrInitializeCustomer();
    return customer.coupons || SEED_COUPONS;
  },

  /**
   * Apply manual coupon during mock checkout/bag view
   */
  async applyCoupon(code: string): Promise<Coupon | null> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const customer = getOrInitializeCustomer();
    const target = (customer.coupons || SEED_COUPONS).find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.status === 'ACTIVE'
    );
    return target || null;
  },

  /**
   * Fetch detailed live tracking data for a specific package code
   */
  async getTrackingDetails(orderId: string): Promise<{
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    status: string;
    history: { status: string; location: string; time: string; done: boolean }[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return {
      carrier: 'Delhivery Express Logistics',
      trackingNumber: 'DEL9322872930',
      estimatedDelivery: 'Wednesday, July 8, 2026',
      status: 'In Transit',
      history: [
        { status: 'Order Verified & Packed', location: 'Ahmedabad Warehouse', time: 'July 4, 11:30 AM', done: true },
        { status: 'Inbound Dispatched', location: 'Ahmedabad Fulfillment Hub', time: 'July 4, 05:15 PM', done: true },
        { status: 'In Transit between Hubs', location: 'Mumbai Sorting Facility', time: 'July 5, 08:30 AM', done: true },
        { status: 'Out for Local Delivery', location: 'Mumbai West Delivery Station', time: 'Pending', done: false },
        { status: 'Delivered Securely with OTP', location: 'Nariman Point Residence', time: 'Pending', done: false },
      ],
    };
  }
};
