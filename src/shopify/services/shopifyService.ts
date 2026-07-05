/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { shopifyConfig } from '../config/shopifyConfig';
import { queryGraphQL } from '../lib/graphqlClient';
import { shopifyAdapter } from '../lib/shopifyClient';
import { Product, Collection, Customer, CustomerAddress, Order } from '../../types';

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  items: {
    id: string;
    variantId: string;
    quantity: number;
    title: string;
    price: string;
    image: string;
  }[];
  subtotalPrice: string;
  totalPrice: string;
}

// Import Shopify Storefront API queries
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  GET_CART_QUERY,
  GET_CUSTOMER_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
  GET_SHOP_INFO_QUERY,
} from '../graphql/queries';

// Import Shopify Storefront API mutations
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_RECOVER_MUTATION,
  CUSTOMER_ADDRESS_CREATE_MUTATION,
  CUSTOMER_ADDRESS_UPDATE_MUTATION,
  CUSTOMER_ADDRESS_DELETE_MUTATION,
} from '../graphql/mutations';

// Import existing mock data providers for seamless high-fidelity fallback
import { shopifyService as originalMockService } from '../../services/shopify';
import { customerService as originalCustomerMockService } from '../../services/customerService';

// Standard localstorage keys for mock cart when in Mock Mode
const MOCK_CART_KEY = 'apna_adda_shopify_mock_cart';

export const shopifyService = {
  /**
   * 1. GET PRODUCTS
   * Queries active products from Shopify catalog.
   */
  async getProducts(params: {
    collection?: string;
    query?: string;
    sortKey?: 'PRICE' | 'CREATED_AT' | 'BEST_SELLING' | 'RATING';
    reverse?: boolean;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  } = {}): Promise<Product[]> {
    if (shopifyConfig.isMockMode) {
      console.log('[Shopify Service] [Mock Mode] Fetching products...');
      return originalMockService.getProducts(params as any);
    }

    try {
      console.log('[Shopify Service] [Live Mode] Querying GraphQL products...', params);
      
      // Map sort key to Shopify enum names
      let storefrontSortKey = 'RELEVANCE';
      if (params.sortKey === 'PRICE') storefrontSortKey = 'PRICE';
      else if (params.sortKey === 'CREATED_AT') storefrontSortKey = 'CREATED_AT';
      else if (params.sortKey === 'BEST_SELLING') storefrontSortKey = 'BEST_SELLING';

      // Compile search queries for Shopify's query DSL if collection or search are specified
      let queryParts: string[] = [];
      if (params.query) {
        queryParts.push(`title:*${params.query}* OR tag:*${params.query}* OR vendor:*${params.query}*`);
      }
      if (params.brand && params.brand !== 'all') {
        queryParts.push(`vendor:"${params.brand}"`);
      }
      
      const query = queryParts.length > 0 ? queryParts.join(' AND ') : undefined;

      // Handle collection scoped queries
      if (params.collection) {
        const response = await queryGraphQL<{
          collection?: {
            products: {
              edges: { node: any }[];
            };
          };
        }>(GET_COLLECTION_PRODUCTS_QUERY, {
          handle: params.collection,
          first: params.limit || 50,
        });

        if (!response.collection) return [];
        return response.collection.products.edges.map(e => shopifyAdapter.product(e.node));
      }

      // Standard search and listing
      const response = await queryGraphQL<{
        products: {
          edges: { node: any }[];
        };
      }>(GET_PRODUCTS_QUERY, {
        first: params.limit || 50,
        query,
        sortKey: storefrontSortKey,
        reverse: params.reverse || false,
      });

      let items = response.products.edges.map(e => shopifyAdapter.product(e.node));

      // Post-filter logic for custom rating and price parameters not directly supported by basic query syntax
      if (params.minPrice !== undefined) {
        items = items.filter(p => parseFloat(p.priceRange.minVariantPrice) >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        items = items.filter(p => parseFloat(p.priceRange.minVariantPrice) <= params.maxPrice!);
      }

      return items;
    } catch (error) {
      console.error('[Shopify Service] Failed to retrieve live products. Falling back to Mock catalog.', error);
      return originalMockService.getProducts(params as any);
    }
  },

  /**
   * 2. GET PRODUCT BY HANDLE
   */
  async getProduct(handle: string): Promise<Product | undefined> {
    if (shopifyConfig.isMockMode) {
      return originalMockService.getProductByHandle(handle);
    }

    try {
      console.log(`[Shopify Service] [Live Mode] Querying single product: ${handle}`);
      const response = await queryGraphQL<{ product?: any }>(GET_PRODUCT_BY_HANDLE_QUERY, { handle });
      if (!response.product) return undefined;
      return shopifyAdapter.product(response.product);
    } catch (error) {
      console.error(`[Shopify Service] Failed to query product ${handle}. Falling back to mock.`, error);
      return originalMockService.getProductByHandle(handle);
    }
  },

  /**
   * 3. GET COLLECTIONS
   */
  async getCollections(): Promise<Collection[]> {
    if (shopifyConfig.isMockMode) {
      return originalMockService.getCollections();
    }

    try {
      console.log('[Shopify Service] [Live Mode] Querying collections...');
      const response = await queryGraphQL<{
        collections: {
          edges: { node: any }[];
        };
      }>(GET_COLLECTIONS_QUERY, { first: 20 });

      return response.collections.edges.map(e => shopifyAdapter.collection(e.node));
    } catch (error) {
      console.error('[Shopify Service] Failed to retrieve collections. Using fallback.', error);
      return originalMockService.getCollections();
    }
  },

  /**
   * 4. SEARCH PRODUCTS
   */
  async searchProducts(query: string): Promise<Product[]> {
    return this.getProducts({ query });
  },

  /**
   * 5. CREATE CART
   */
  async createCart(input: { lines?: { merchandiseId: string; quantity: number }[] } = {}): Promise<Cart> {
    if (shopifyConfig.isMockMode) {
      const mockCartId = `mock-cart-${Date.now()}`;
      const newCart: Cart = {
        id: mockCartId,
        checkoutUrl: 'https://checkout.shopify.com/mock-checkout',
        totalQuantity: input.lines?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        items: [],
        subtotalPrice: '0.00',
        totalPrice: '0.00',
      };
      localStorage.setItem(MOCK_CART_KEY, JSON.stringify(newCart));
      return newCart;
    }

    const response = await queryGraphQL<{
      cartCreate: {
        cart: any;
        userErrors: any[];
      };
    }>(CART_CREATE_MUTATION, { input });

    if (response.cartCreate.userErrors.length > 0) {
      throw new Error(response.cartCreate.userErrors[0].message);
    }

    return shopifyAdapter.order(response.cartCreate.cart) as any; // Convert layout to application standard
  },

  /**
   * 6. ADD TO CART
   */
  async addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
    if (shopifyConfig.isMockMode) {
      const stored = localStorage.getItem(MOCK_CART_KEY);
      const cart: Cart = stored ? JSON.parse(stored) : await this.createCart();
      lines.forEach((line) => {
        const existing = cart.items.find(item => item.variantId === line.merchandiseId);
        if (existing) {
          existing.quantity += line.quantity;
        } else {
          cart.items.push({
            id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            variantId: line.merchandiseId,
            quantity: line.quantity,
            title: 'Mock Product',
            price: '999.00',
            image: '',
          });
        }
      });
      cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      localStorage.setItem(MOCK_CART_KEY, JSON.stringify(cart));
      return cart;
    }

    const response = await queryGraphQL<{
      cartLinesAdd: {
        cart: any;
        userErrors: any[];
      };
    }>(CART_LINES_ADD_MUTATION, { cartId, lines });

    if (response.cartLinesAdd.userErrors.length > 0) {
      throw new Error(response.cartLinesAdd.userErrors[0].message);
    }

    return shopifyAdapter.order(response.cartLinesAdd.cart) as any;
  },

  /**
   * 7. REMOVE CART ITEM
   */
  async removeCartItem(cartId: string, lineIds: string[]): Promise<Cart> {
    if (shopifyConfig.isMockMode) {
      const stored = localStorage.getItem(MOCK_CART_KEY);
      if (!stored) throw new Error('Cart not found.');
      const cart: Cart = JSON.parse(stored);
      cart.items = cart.items.filter(item => !lineIds.includes(item.id));
      cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      localStorage.setItem(MOCK_CART_KEY, JSON.stringify(cart));
      return cart;
    }

    const response = await queryGraphQL<{
      cartLinesRemove: {
        cart: any;
        userErrors: any[];
      };
    }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds });

    if (response.cartLinesRemove.userErrors.length > 0) {
      throw new Error(response.cartLinesRemove.userErrors[0].message);
    }

    return shopifyAdapter.order(response.cartLinesRemove.cart) as any;
  },

  /**
   * 8. UPDATE QUANTITY
   */
  async updateQuantity(cartId: string, lines: { id: string; quantity: number }[]): Promise<Cart> {
    if (shopifyConfig.isMockMode) {
      const stored = localStorage.getItem(MOCK_CART_KEY);
      if (!stored) throw new Error('Cart not found.');
      const cart: Cart = JSON.parse(stored);
      lines.forEach((line) => {
        const item = cart.items.find(i => i.id === line.id);
        if (item) {
          item.quantity = line.quantity;
        }
      });
      cart.items = cart.items.filter(item => item.quantity > 0);
      cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      localStorage.setItem(MOCK_CART_KEY, JSON.stringify(cart));
      return cart;
    }

    const response = await queryGraphQL<{
      cartLinesUpdate: {
        cart: any;
        userErrors: any[];
      };
    }>(CART_LINES_UPDATE_MUTATION, { cartId, lines });

    if (response.cartLinesUpdate.userErrors.length > 0) {
      throw new Error(response.cartLinesUpdate.userErrors[0].message);
    }

    return shopifyAdapter.order(response.cartLinesUpdate.cart) as any;
  },

  /**
   * 9. GET CUSTOMER PROFILE
   */
  async getCustomer(customerAccessToken: string): Promise<Customer> {
    if (shopifyConfig.isMockMode) {
      console.log('[Shopify Service] [Mock Mode] Retrieving mock active customer...');
      const customer = await originalCustomerMockService.getCustomer();
      if (!customer) throw new Error('Customer authentication state is invalid.');
      return customer;
    }

    const response = await queryGraphQL<{ customer?: any }>(GET_CUSTOMER_QUERY, { customerAccessToken });
    if (!response.customer) throw new Error('Invalid customer access token provided.');

    // Map default address and generic address array
    const defaultAddress = response.customer.defaultAddress
      ? shopifyAdapter.address(response.customer.defaultAddress, true)
      : null;
    
    const addresses = response.customer.addresses?.edges?.map((e: any) =>
      shopifyAdapter.address(e.node, e.node.id === response.customer.defaultAddress?.id)
    ) || [];

    const orders = response.customer.orders?.edges?.map((e: any) => shopifyAdapter.order(e.node)) || [];

    return {
      id: response.customer.id,
      firstName: response.customer.firstName || '',
      lastName: response.customer.lastName || '',
      email: response.customer.email,
      phone: response.customer.phone || undefined,
      addresses,
      orders,
      reward: {
        points: 150,
        membershipLevel: 'SILVER',
        pointsToNextTier: 350,
        history: [],
      },
    };
  },

  /**
   * 10. CUSTOMER LOGIN (Token Creation)
   */
  async loginCustomer(email: string, password: string): Promise<{ accessToken: string; expiresAt: string }> {
    if (shopifyConfig.isMockMode) {
      console.log('[Shopify Service] [Mock Mode] Authorizing user...');
      if (email.includes('@')) {
        return {
          accessToken: `mock-session-token-${Date.now()}`,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        };
      }
      throw new Error('Incorrect credentials or username. Please check and try again.');
    }

    const response = await queryGraphQL<{
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: { message: string }[];
      };
    }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, { input: { email, password } });

    const errors = response.customerAccessTokenCreate.customerUserErrors;
    if (errors.length > 0 || !response.customerAccessTokenCreate.customerAccessToken) {
      throw new Error(errors[0]?.message || 'Failed to authenticate. Incorrect credentials.');
    }

    return response.customerAccessTokenCreate.customerAccessToken;
  },

  /**
   * 11. REGISTER CUSTOMER
   */
  async registerCustomer(input: any): Promise<any> {
    if (shopifyConfig.isMockMode) {
      console.log('[Shopify Service] [Mock Mode] Registering mock customer account...');
      return {
        id: `cust-${Date.now()}`,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
      };
    }

    const response = await queryGraphQL<{
      customerCreate: {
        customer: any;
        customerUserErrors: { message: string }[];
      };
    }>(CUSTOMER_CREATE_MUTATION, { input });

    const errors = response.customerCreate.customerUserErrors;
    if (errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return response.customerCreate.customer;
  },

  /**
   * 12. PASSWORD RECOVERY
   */
  async recoverPassword(email: string): Promise<boolean> {
    if (shopifyConfig.isMockMode) {
      console.log('[Shopify Service] [Mock Mode] Initiating password recovery for:', email);
      return true;
    }

    const response = await queryGraphQL<{
      customerRecover: {
        customerUserErrors: { message: string }[];
      };
    }>(CUSTOMER_RECOVER_MUTATION, { email });

    const errors = response.customerRecover.customerUserErrors;
    if (errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return true;
  },

  /**
   * 13. GET ORDERS
   */
  async getOrders(customerAccessToken: string): Promise<Order[]> {
    if (shopifyConfig.isMockMode) {
      const customer = await originalCustomerMockService.getCustomer();
      return customer.orders;
    }

    const customer = await this.getCustomer(customerAccessToken);
    return customer.orders;
  },

  /**
   * 14. GET RECOMMENDATIONS
   */
  async getRecommendations(productId: string): Promise<Product[]> {
    if (shopifyConfig.isMockMode) {
      // Find base product to pass related generator
      const p = originalMockService.getProducts();
      const current = (await p).find(item => item.id === productId) || (await p)[0];
      return originalMockService.getRelatedProducts(current, 4);
    }

    try {
      console.log(`[Shopify Service] [Live Mode] Querying recommendations for product: ${productId}`);
      const response = await queryGraphQL<{
        productRecommendations: any[];
      }>(GET_PRODUCT_RECOMMENDATIONS_QUERY, { productId });

      return response.productRecommendations.map(node => shopifyAdapter.product(node));
    } catch (error) {
      console.error('[Shopify Service] Recommendations API call failed. Using related fallbacks.', error);
      // Try resolving with handle
      return originalMockService.getProducts().then(list => list.slice(0, 4));
    }
  }
};
