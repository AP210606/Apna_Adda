/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PRODUCT_FRAGMENT, COLLECTION_FRAGMENT, CART_FRAGMENT, ORDER_FRAGMENT, ADDRESS_FRAGMENT } from './fragments';

export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts(
    $first: Int = 20
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const GET_COLLECTIONS_QUERY = `
  ${COLLECTION_FRAGMENT}
  query GetCollections($first: Int = 10) {
    collections(first: $first) {
      edges {
        node {
          ...CollectionFields
        }
      }
    }
  }
`;

export const GET_COLLECTION_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  ${COLLECTION_FRAGMENT}
  query GetCollectionProducts($handle: String!, $first: Int = 20) {
    collection(handle: $handle) {
      ...CollectionFields
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
`;

export const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

export const GET_CUSTOMER_QUERY = `
  ${ADDRESS_FRAGMENT}
  ${ORDER_FRAGMENT}
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        ...AddressFields
      }
      addresses(first: 10) {
        edges {
          node {
            ...AddressFields
          }
        }
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            ...OrderFields
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_RECOMMENDATIONS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFields
    }
  }
`;

export const GET_SHOP_INFO_QUERY = `
  query GetShopInfo {
    shop {
      name
      description
      primaryDomain {
        url
        host
      }
      paymentSettings {
        currencyCode
        acceptedCardBrands
      }
    }
  }
`;

export const GET_MENU_QUERY = `
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      id
      title
      items {
        id
        title
        url
        items {
          id
          title
          url
        }
      }
    }
  }
`;
