/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { shopifyConfig } from '../config/shopifyConfig';
import { GraphQLResponse } from '../graphql/types';

export class ShopifyAPIError extends Error {
  public errors: any[];
  public status?: number;

  constructor(message: string, errors: any[] = [], status?: number) {
    super(message);
    this.name = 'ShopifyAPIError';
    this.errors = errors;
    this.status = status;
  }
}

/**
 * Execute GraphQL queries and mutations on the Shopify Storefront API endpoint
 */
export async function queryGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  retries = 3,
  delayMs = 1000
): Promise<T> {
  const { storeDomain, storefrontToken, apiVersion } = shopifyConfig;
  const endpoint = `https://${storeDomain}/api/${apiVersion}/graphql.json`;

  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': storefrontToken,
    'Accept': 'application/json',
  };

  let attempt = 0;

  while (attempt < retries) {
    attempt++;
    try {
      // Check offline capability
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        throw new Error('Local environment is currently offline. Queueing request.');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        if (response.status >= 500 && attempt < retries) {
          console.warn(`[Shopify Client] Server error ${response.status}. Retrying in ${delayMs * attempt}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
          continue;
        }
        throw new ShopifyAPIError(
          `HTTP Error response received from storefront API. Status: ${response.status}`,
          [],
          response.status
        );
      }

      const resJson: GraphQLResponse<T> = await response.json();

      if (resJson.errors && resJson.errors.length > 0) {
        console.error('[Shopify Client GraphQL UserErrors]', resJson.errors);
        throw new ShopifyAPIError(
          resJson.errors[0]?.message || 'GraphQL operations contained errors.',
          resJson.errors
        );
      }

      if (!resJson.data) {
        throw new ShopifyAPIError('Response contained empty data payload.');
      }

      return resJson.data;
    } catch (error: any) {
      if (attempt >= retries) {
        console.error('[Shopify Client Fetch critical failure]', error);
        throw error;
      }
      
      const wait = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
      console.warn(`[Shopify Client] Fetch failed: ${error.message}. Retrying (${attempt}/${retries}) in ${wait}ms...`);
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }

  throw new ShopifyAPIError('Maximum API query retries exceeded without resolve.');
}
