# Shopify Headless Frontend Integration Guide
## Apna Adda E-commerce Platform

This guide outlines the production-ready Shopify Headless integration architecture designed and built for the Apna Adda store. The system supports full GraphQL Storefront API integrations with a unified, high-fidelity **Mock Mode** toggle for reliable development and seamless preview staging.

---

## 1. Folder Tree & Architecture

The integration layer is fully modularized and housed under `/src/shopify` to maintain separation of concerns, strict type-safety, and robust scalability.

```text
/src/shopify/
├── config/
│   └── shopifyConfig.ts       # Global settings, environment variable loaders & master Mock Toggle
├── graphql/
│   ├── fragments.ts           # Reusable GraphQL query/mutation fragments (Image, Variant, Product, Cart, Order)
│   ├── queries.ts             # Standardized queries (GetProducts, GetProductByHandle, Collections, ShopInfo, Recommendations)
│   ├── mutations.ts           # Storefront mutations (CartCreate, LinesAdd, LinesRemove, CustomerAccess, Register)
│   └── types.ts               # TypeScript interfaces matching Shopify's official Storefront GraphQL schema
├── lib/
│   ├── graphqlClient.ts       # Low-level fetch queries with exponential backoff retry logic & offline detection
│   └── shopifyClient.ts       # Deep schema adapter utilities translating Shopify GQL types to App Types
└── services/
    └── shopifyService.ts      # Unified high-level service layer with automated Mock / Live Mode routing
```

---

## 2. Environment Variables Configuration

The integration layer supports standard storefront configuration. Define these keys in your `.env` (refer to `.env.example`):

```env
# ==================================================
# SHOPIFY HEADLESS FRONTEND CONFIGURATION
# ==================================================
# The domain of your Shopify store (e.g. quickstart-1234.myshopify.com)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=apna-adda-lounge.myshopify.com

# The Storefront API access token (configured in Shopify Admin under App Developments)
<!-- NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token_here -->

# The Storefront API version to query (e.g. 2024-04 or 2026-04)
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-04

# Mode Toggle: Set to 'true' for high-fidelity offline mock data or 'false' for live Shopify queries
VITE_SHOPIFY_MOCK_MODE=true
```

> **Security Note:** Never expose the Shopify Admin API token (`shppa_...`) to the client. This architecture strictly queries the Shopify **Storefront API** (`shpat_...`), which is read-only and designed to be public-facing, keeping credentials completely secure.

---

## 3. Data & API Routing Flow Diagram

The application uses an automatic routing mechanism that redirects all service calls through the `shopifyConfig.isMockMode` gate:

```text
               +---------------------------------------------------+
               |               React Views / Component             |
               |       (e.g. ProductDetails.tsx, ShopGrid.tsx)     |
               +-------------------------+-------------------------+
                                         |
                                         v
               +---------------------------------------------------+
               |        Unified shopifyService Method Call         |
               |        (e.g., getProducts() or getProduct())      |
               +-------------------------+-------------------------+
                                         |
                                         |  Checks Config Flag
                                         v
                              /-------------------\
                             /     isMockMode?     \
                            /-----------------------\
                                /              \
                       YES     /                \    NO
                              /                  \
                             v                    v
              +-----------------------+  +-----------------------+
              |   Local High-Fidelity |  |  Query Shopify GraphQL|
              |     Mock Catalog      |  |     (GraphQLClient)   |
              | (PRODUCTS/COLLECTIONS)|  |  With Retry & Backoff |
              +-----------+-----------+  +-----------+-----------+
                          |                          |
                          |                          |  Returns nested Storefront
                          |                          |  API GQL Schema Edges
                          |                          v
                          |              +-----------------------+
                          |              |  shopifyAdapter       |
                          |              |  (Maps GQL -> flat    |
                          |              |   App Types + Brand)  |
                          |              +-----------+-----------+
                          |                          |
                          v                          v
              +--------------------------------------------------+
              |         Returns Clean, Uniform App Types         |
              |        (e.g., Product[], Collection[])           |
              +-------------------------+------------------------+
                                        |
                                        v
              +--------------------------------------------------+
              |           Renders Beautifully in React           |
              +--------------------------------------------------+
```

---

## 4. Folder and File Explanations

### ⚙️ `/config/shopifyConfig.ts`
Loads parameters using unified fallback logic to inspect both Vite's modern client metadata (`import.meta.env`) and Node/server environments (`process.env`). Hosts the master `isMockMode` switch.

### 🌐 `/graphql/types.ts`
Matches Shopify Storefront GraphQL objects precisely. Provides full type-safety for queries/mutations to prevent regression bugs when changing endpoints.

### 🧩 `/graphql/fragments.ts`
Defines critical reusable fragments (like `ProductFields` and `CartFields`) so that mutations and queries return identical fields, optimizing API cache hits.

### 📊 `/graphql/queries.ts` & `/graphql/mutations.ts`
Contains the primary standard operations. Product search queries translate parameters dynamically into Shopify's Query Syntax (e.g. `title:*search* OR tag:*search*`).

### 🔌 `/lib/graphqlClient.ts`
Executes standard HTTP POST requests. Implements:
1. **Network Liveness Check:** Prevents browser freezes by raising instant offline exceptions if `navigator.onLine` is false.
2. **Automatic Retry Mechanics:** Retries standard 5xx failures using progressive exponential backoff (e.g., `delayMs * attempt`).

### 🔄 `/lib/shopifyClient.ts`
Bridges the gap between Shopify's deeply nested Node/Edge GraphQL format and the flat, clean types expected by the front-end UI. Integrates our brand and description enrichment to ensure stunning visual fidelity.

### 🛠️ `/services/shopifyService.ts`
The application's single source of truth for Shopify methods. Adapts the parameters, routes mock/live operations, and maps returned values smoothly.

---

## 5. Pre-Connection Integration Checklist

Follow this simple checklists when you are ready to transition your Apna Adda frontend to a live Shopify store:

### ⬜ Step 1: Storefront API Token Creation
1. Go to your **Shopify Admin Dashboard**.
2. Navigate to **Settings** > **Apps and sales channels** > **Develop apps**.
3. Click **Create an app** and name it "Apna Adda Headless".
4. Under **Configuration**, select **Configure Storefront API scopes**.
5. Enable all read permissions: `unauthenticated_read_product_listings`, `unauthenticated_read_product_tags`, `unauthenticated_read_customer_listings`, `unauthenticated_write_checkouts`, `unauthenticated_write_customers`.
6. Click **Install App** and copy the **Storefront API access token** (starts with `shpat_...`).

### ⬜ Step 2: Collection Handle Synchronization
- Ensure collection handles inside Shopify correspond to your front-end layout handles (e.g., `featured-highlights`, `workspace-accessories`, `ceramic-stoneware`, `audio-soundbars`).

### ⬜ Step 3: Product Tag and Vendor Setup
- The adapter dynamically assigns beautiful branding using product vendor names (e.g. `Zen Desk`, `Aura Audio`). Make sure your Shopify product **Vendor** fields match these to preserve our typographic design patterns.
- Mark your main best-sellers with the tag `"Best Seller"` and new arrivals with `"New"`.

### ⬜ Step 4: Toggle Live Mode
- In your environment file, flip `VITE_SHOPIFY_MOCK_MODE=false`.
- Restart the development server. The frontend will immediately begin fetching live products from your real Shopify inventory!

---

## 6. Offline Staging, Error Recovery & Caching

1. **Offline Staging:** The system is completely resilient to network outages. If connection is lost, it falls back to caching/mock buffers and logs readable errors without crashing the browser.
2. **React Query Strategy:** The services are fully prepared to be integrated with React Query (`@tanstack/react-query`). Simply bind `shopifyService` calls directly inside standard query hook functions:
   ```ts
   const { data: products } = useQuery({
     queryKey: ['shopify', 'products', filters],
     queryFn: () => shopifyService.getProducts(filters)
   });
   ```
3. **Revalidation:** Caching headers can be managed at server endpoints or via standard `staleTime` and `cacheTime` configurations to optimize performance.
