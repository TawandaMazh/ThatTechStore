import { getMockFeatured, mockProducts } from "@/lib/mock/catalog";
import type { Product } from "@/types";

/** @deprecated Prefer lib/catalog/queries — kept for Phase 1 compatibility. */
export const bestSellers: Product[] = getMockFeatured(6);

export { mockProducts };
