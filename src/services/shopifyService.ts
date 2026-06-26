import { shopifyConfig } from "../config/shopify";

const SHOPIFY_DOMAIN = shopifyConfig.domain || "museo-61be0.myshopify.com";
const SHOPIFY_STOREFRONT_API_VERSION = "2024-04";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;
const SHOPIFY_STORE_URL = `https://${SHOPIFY_DOMAIN}`;

const SHOPIFY_STOREFRONT_ACCESS_TOKEN = shopifyConfig.storefrontAccessToken;

export const shopifyCollectionIds = {
  cuadrosPigmentos: "gid://shopify/Collection/504217960745",
  artesaniasMinerales: "gid://shopify/Collection/504217993513",
  piezasExclusivas: "gid://shopify/Collection/504218026281",
} as const;

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  imageAltText: string | null;
  price: string;
  currencyCode: string;
  productUrl: string;
  collectionId: string;
  collectionTitle: string;
  firstVariantId: string | null;
}

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  onlineStoreUrl: string | null;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
      };
    }>;
  };
}

interface ShopifyCollectionNode {
  id: string;
  title: string;
  products: {
    edges: Array<{
      node: ShopifyProductNode;
    }>;
  };
}

interface ShopifyGraphQlResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
  }>;
}

const collectionsProductsQuery = `
  query CollectionsProducts($collectionIds: [ID!]!, $productsFirst: Int!) {
    nodes(ids: $collectionIds) {
      ... on Collection {
        id
        title
        products(first: $productsFirst) {
          edges {
            node {
              id
              title
              description
              handle
              onlineStoreUrl
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
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

const cartCreateMutation = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error(
      "Falta configurar VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN para consultar Shopify desde React."
    );
  }

  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = (await response.json()) as ShopifyGraphQlResponse<T>;

  if (!response.ok) {
    throw new Error(`Shopify respondio con estado HTTP ${response.status}.`);
  }

  if (result.errors?.length) {
    throw new Error(result.errors.map((error) => error.message).join(" | "));
  }

  if (!result.data) {
    throw new Error("Shopify no devolvio datos para la consulta solicitada.");
  }

  return result.data;
}

function mapShopifyProduct(
  product: ShopifyProductNode,
  collection: ShopifyCollectionNode
): ShopifyProduct {
  const price = product.priceRange.minVariantPrice;

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    imageUrl: product.featuredImage?.url ?? null,
    imageAltText: product.featuredImage?.altText ?? product.title,
    price: price.amount,
    currencyCode: price.currencyCode,
    productUrl: product.onlineStoreUrl ?? `${SHOPIFY_STORE_URL}/products/${product.handle}`,
    collectionId: collection.id,
    collectionTitle: collection.title,
    firstVariantId: product.variants.edges[0]?.node.id ?? null,
  };
}

export async function obtenerProductosDeColeccionesShopify(
  productsFirst = 20,
  collectionIds = Object.values(shopifyCollectionIds)
): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    nodes: Array<ShopifyCollectionNode | null>;
  }>(collectionsProductsQuery, {
    collectionIds,
    productsFirst,
  });

  return data.nodes
    .filter((collection): collection is ShopifyCollectionNode => Boolean(collection))
    .flatMap((collection) =>
      collection.products.edges.map(({ node }) =>
        mapShopifyProduct(node, collection)
      )
    );
}

export async function crearCheckoutUrlShopify(
  variantId: string,
  quantity = 1
): Promise<string> {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: {
        checkoutUrl: string;
      } | null;
      userErrors: Array<{
        field: string[] | null;
        message: string;
      }>;
    };
  }>(cartCreateMutation, {
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(
      data.cartCreate.userErrors.map((error) => error.message).join(" | ")
    );
  }

  if (!data.cartCreate.cart?.checkoutUrl) {
    throw new Error("Shopify no devolvio una URL de checkout.");
  }

  return data.cartCreate.cart.checkoutUrl;
}

export async function redirigirACompraShopify(
  product: ShopifyProduct,
  quantity = 1
): Promise<void> {
  if (!product.firstVariantId) {
    window.location.assign(product.productUrl);
    return;
  }

  const checkoutUrl = await crearCheckoutUrlShopify(
    product.firstVariantId,
    quantity
  );
  window.location.assign(checkoutUrl);
}
