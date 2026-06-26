/**
 * Shopify API client utility for the React frontend.
 * Interacts with our secure local Express proxy server to avoid exposing API tokens in the browser.
 */

// Types for responses (simplified)
export interface ShopifyProduct {
  id: number | string;
  title: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  created_at: string;
  handle: string;
  tags?: string;
  variants?: Array<{
    id: number | string;
    price: string;
    sku?: string;
  }>;
  images?: Array<{
    src: string;
    alt?: string;
  }>;
}

export interface ShopifyProductListResponse {
  products: ShopifyProduct[];
}

export const SHOPIFY_PROXY_API_BASE = import.meta.env.PROD
  ? "https://casa-museo-backend.onrender.com/api"
  : "/api";

/**
 * Fetch products from the secure local Express proxy server.
 */
export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  const response = await fetch(`${SHOPIFY_PROXY_API_BASE}/products`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify Proxy API error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as ShopifyProductListResponse;
  return data.products;
}
