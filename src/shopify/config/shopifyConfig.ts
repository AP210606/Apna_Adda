/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Shopify Headless Frontend Configuration
 */

// Helper to look up env variables across both Vite's import.meta.env and Node's process.env
const getEnv = (key: string, defaultValue = ''): string => {
  if (typeof window !== 'undefined' && (window as any).__env__) {
    return (window as any).__env__[key] || defaultValue;
  }
  
  // Try Vite meta env
  const viteMeta = (import.meta as any).env;
  if (viteMeta && viteMeta[key] !== undefined) {
    return viteMeta[key];
  }
  
  // Try node process.env if available (server-side context)
  if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
    return process.env[key] || defaultValue;
  }

  return defaultValue;
};

export const shopifyConfig = {
  storeDomain: getEnv('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN') || getEnv('VITE_SHOPIFY_STORE_DOMAIN') || 'apna-adda-lounge.myshopify.com',
  storefrontToken: getEnv('NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN') || getEnv('VITE_SHOPIFY_STOREFRONT_TOKEN') || 'shpat_mock_token_for_headless_frontends',
  apiVersion: getEnv('NEXT_PUBLIC_SHOPIFY_API_VERSION') || getEnv('VITE_SHOPIFY_API_VERSION') || '2024-04',
  
  // Master configuration flag: Switch between high-fidelity local Mock Mode and live Shopify Storefront queries
  isMockMode: getEnv('VITE_SHOPIFY_MOCK_MODE', 'true') === 'true',
};

console.log('[Shopify Config Loaded]', {
  storeDomain: shopifyConfig.storeDomain,
  apiVersion: shopifyConfig.apiVersion,
  isMockMode: shopifyConfig.isMockMode,
  hasToken: !!shopifyConfig.storefrontToken,
});
