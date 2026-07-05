/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const IMAGE_FRAGMENT = `
  fragment ImageFields on Image {
    id
    url
    altText
    width
    height
  }
`;

export const VARIANT_FRAGMENT = `
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    selectedOptions {
      name
      value
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    quantityAvailable
    image {
      id
      url
      altText
    }
  }
`;

export const PRODUCT_FRAGMENT = `
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
  fragment ProductFields on Product {
    id
    title
    handle
    description
    vendor
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 5) {
      edges {
        node {
          ...ImageFields
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          ...VariantFields
        }
      }
    }
  }
`;

export const COLLECTION_FRAGMENT = `
  ${IMAGE_FRAGMENT}
  fragment CollectionFields on Collection {
    id
    title
    handle
    description
    image {
      ...ImageFields
    }
  }
`;

export const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              product {
                id
                title
                handle
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const ADDRESS_FRAGMENT = `
  fragment AddressFields on MailingAddress {
    id
    firstName
    lastName
    address1
    address2
    city
    province
    zip
    country
    phone
  }
`;

export const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    totalPrice {
      amount
      currencyCode
    }
    shippingAddress {
      address1
      address2
      city
      province
      zip
      country
    }
    successfulFulfillments(first: 1) {
      trackingCompany
      trackingInfo {
        number
        url
      }
    }
    lineItems(first: 50) {
      edges {
        node {
          title
          quantity
          originalTotalPrice {
            amount
            currencyCode
          }
          variant {
            id
            title
            price {
              amount
              currencyCode
            }
            product {
              handle
            }
          }
        }
      }
    }
  }
`;
