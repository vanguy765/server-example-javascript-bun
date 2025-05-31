/**
 * Product Services
 *
 * This module contains functions for working with products, including:
 * - Fetching product specials
 * - Fetching customer favorite products
 * - Calculating discounted prices
 */

import { buildDynamicQuery } from "./queryBuilder";

/**
 * Interface for product special offers
 */
export interface ProductSpecial {
  product_id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  discount: number;
  end_date: string;
  regular_price?: number; // Added during processing
}

/**
 * Interface for customer favorite product
 */
export interface FavoriteProduct {
  id: string;
  name: string;
  description: string;
  size: string;
  price: number;
}

/**
 * Fetches active product specials for a tenant
 *
 * @param tenantId - The ID of the tenant
 * @returns A promise with the product specials or null if none found
 */
export async function fetchProductSpecials(tenantId: string) {
  return await buildDynamicQuery<"product_specials_view", ProductSpecial[]>(
    "product_specials_view",
    {
      columns: [
        "id:product_id",
        "name:product_name",
        "description:product_description",
        "price:product_price",
        "size:product_size",
        "discount",
        "end_date",
      ],
      filters: [
        {
          column: "end_date",
          operator: "gte",
          value: new Date().toISOString(),
        },
        {
          column: "tenant_id",
          operator: "eq",
          value: tenantId,
        },
      ],
      sorting: [{ column: "discount", direction: "desc" }],
    }
  );
}

/**
 * Processes product specials to add regular prices and calculate discounted prices
 *
 * @param products - The product specials to process
 * @returns Products with calculated prices
 */
export function calculateDiscountedPrices(
  products: ProductSpecial[]
): ProductSpecial[] {
  return products.map((product) => {
    // Store the original price as regular_price
    const regular_price = product.price;

    // Calculate discounted price (apply discount percentage)
    const discountAmount = (product.discount / 100) * regular_price;
    const discounted_price = Number(
      (regular_price - discountAmount).toFixed(2)
    );

    // Return transformed product with both prices
    return {
      ...product,
      regular_price: regular_price,
      price: discounted_price, // Override original price with discounted price
    };
  });
}

/**
 * Formats product specials as an XML-like string
 *
 * @param products - The products to format
 * @returns XML-formatted string of product specials
 */
export function formatProductSpecials(products: ProductSpecial[]): string {
  const formattedProductSpecialsJson = JSON.stringify(products, null, 2);
  return `
<current_promotional_offers>
      ${formattedProductSpecialsJson}
</current_promotional_offers>`;
}

/**
 * Fetches customer preferences containing favorite products
 *
 * @param customerId - The ID of the customer
 * @returns A promise with the customer preferences
 */
export async function fetchCustomerPreferences(customerId: string) {
  return await buildDynamicQuery("customer_preferences", {
    columns: ["id", "customer_id", "favorites"],
    filters: [
      {
        column: "customer_id",
        operator: "eq",
        value: customerId,
      },
      {
        column: "favorites",
        operator: "not.is",
        value: null,
      },
    ],
    single: true,
  });
}

/**
 * Extracts favorite product IDs from customer preferences
 *
 * @param preferences - The customer preferences
 * @returns Array of favorite product IDs
 */
export function extractFavoriteProductIds(preferences: any): string[] {
  let favoriteProductIds: string[] = [];

  if (
    preferences &&
    preferences.favorites &&
    preferences.favorites.order_items
  ) {
    // Favorites is an object with order_items array
    favoriteProductIds = Array.isArray(preferences.favorites.order_items)
      ? preferences.favorites.order_items
      : [];
  }

  return favoriteProductIds;
}

/**
 * Fetches details for favorite products
 *
 * @param productIds - Array of product IDs to fetch
 * @returns A promise with the favorite product details
 */
export async function fetchFavoriteProducts(productIds: string[]) {
  if (productIds.length === 0) {
    return { data: null, error: null };
  }

  return await buildDynamicQuery("products", {
    columns: ["id", "name", "description", "size", "price"],
    filters: [
      {
        column: "id",
        operator: "in",
        value: productIds,
      },
    ],
  });
}

/**
 * Formats favorite products as an XML-like string
 *
 * @param products - The favorite products to format
 * @returns XML-formatted string of favorite products
 */
export function formatFavoriteProducts(products: any): string {
  const formattedFavoriteProductsJson = JSON.stringify(products, null, 2);
  return `
<customer_favorite_items>
      ${formattedFavoriteProductsJson}
</customer_favorite_items>`;
}
