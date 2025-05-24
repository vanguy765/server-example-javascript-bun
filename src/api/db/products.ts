import { createRepository } from "../../supabase/generated-repo";
import { ProductRow } from "./types";
import { productsRowSchema } from "../../supabase/generated.schemas";

/**
 * Retrieves product details by product ID
 * @param productId - The ID of the product to retrieve
 * @returns Promise resolving to the product details or null if not found
 */
export async function getProductDetailsById(
  productId: string
): Promise<ProductRow | null> {
  if (!productId) {
    console.warn(
      "getProductDetailsById: Received null or undefined productId."
    );
    return null;
  }
  const repo = createRepository("products");
  try {
    const product = await repo.getById(productId);
    if (product) {
      return productsRowSchema.parse(product);
    }
    console.warn(
      `getProductDetailsById: Product not found for ID ${productId}`
    );
    return null;
  } catch (e: any) {
    console.error(
      `getProductDetailsById Error for ID ${productId}: ${e.message}`
    );
    return null;
  }
}
