/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  id?: string;
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  sku?: string | null;
  quantityAvailable?: number;
  image?: ShopifyImage | null;
}

export interface ShopifyProductPriceRange {
  minVariantPrice: ShopifyMoneyV2;
  maxVariantPrice: ShopifyMoneyV2;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  vendor: string;
  productType?: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: ShopifyProductPriceRange;
  compareAtPriceRange?: ShopifyProductPriceRange;
  images: {
    edges: { node: ShopifyImage }[];
  };
  variants: {
    edges: { node: ShopifyProductVariant }[];
  };
  collections?: {
    edges: { node: { id: string; title: string; handle: string } }[];
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ShopifyImage | null;
  products: {
    edges: { node: ShopifyProduct }[];
    pageInfo?: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: ShopifyProductVariant & {
    product: Pick<ShopifyProduct, 'id' | 'title' | 'handle' | 'images'>;
  };
  cost: {
    totalAmount: ShopifyMoneyV2;
    subtotalAmount: ShopifyMoneyV2;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: { node: ShopifyCartLine }[];
  };
  cost: {
    subtotalAmount: ShopifyMoneyV2;
    totalAmount: ShopifyMoneyV2;
    totalTaxAmount?: ShopifyMoneyV2 | null;
  };
  discountCodes?: {
    code: string;
    applicable: boolean;
  }[];
}

export interface ShopifyAddress {
  id: string;
  firstName?: string;
  lastName?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface ShopifyOrderLineItem {
  customAttributes: { key: string; value: string }[];
  discountedTotalPrice: ShopifyMoneyV2;
  originalTotalPrice: ShopifyMoneyV2;
  quantity: number;
  title: string;
  variant?: {
    id: string;
    title: string;
    image?: ShopifyImage | null;
    price: ShopifyMoneyV2;
    product: {
      handle: string;
    };
  } | null;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: ShopifyMoneyV2;
  subtotalPrice?: ShopifyMoneyV2;
  totalTax?: ShopifyMoneyV2;
  shippingAddress?: ShopifyAddress;
  successfulFulfillments?: {
    trackingCompany?: string | null;
    trackingInfo?: {
      number?: string | null;
      url?: string | null;
    }[];
  }[];
  lineItems: {
    edges: { node: ShopifyOrderLineItem }[];
  };
}

export interface ShopifyCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  defaultAddress?: ShopifyAddress | null;
  addresses: {
    edges: { node: ShopifyAddress }[];
  };
  orders: {
    edges: { node: ShopifyOrder }[];
  };
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: {
    message: string;
    locations?: { line: number; column: number }[];
    path?: string[];
  }[];
}
