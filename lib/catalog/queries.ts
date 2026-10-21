import type { Category, Product, ProductDetail, ProductFilters } from "@/types";
import {
  filterMockProducts,
  getMockFeatured,
  getMockProductBySlug,
  mockCategories,
} from "@/lib/mock/catalog";
import { mapCategory, mapProduct, mapReview, mapUnit } from "@/lib/catalog/mappers";

export type CatalogSource = "supabase" | "mock";

async function getServerSupabase() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    return await createClient();
  } catch {
    return null;
  }
}

export async function listCategories(): Promise<{
  categories: Category[];
  source: CatalogSource;
}> {
  const supabase = await getServerSupabase();
  if (!supabase) {
    return { categories: mockCategories, source: "mock" };
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, key, title, description, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return { categories: mockCategories, source: "mock" };
  }

  return { categories: data.map(mapCategory), source: "supabase" };
}

export async function listProducts(filters: ProductFilters = {}): Promise<{
  products: Product[];
  source: CatalogSource;
}> {
  const supabase = await getServerSupabase();
  if (!supabase) {
    return { products: filterMockProducts(filters), source: "mock" };
  }

  let query = supabase
    .from("products")
    .select(
      "id, category_id, name, slug, price_zmw, description, problem_solved, stock_qty, is_preorder, preorder_deposit, images, specs, badge, featured, active, categories(key, title)",
    )
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (filters.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("key", filters.category)
      .maybeSingle();
    if (cat?.id) {
      query = query.eq("category_id", cat.id);
    } else {
      return { products: [], source: "supabase" };
    }
  }

  if (filters.inStock) {
    query = query.gt("stock_qty", 0);
  }
  if (filters.minPrice != null) {
    query = query.gte("price_zmw", filters.minPrice);
  }
  if (filters.maxPrice != null) {
    query = query.lte("price_zmw", filters.maxPrice);
  }
  if (filters.q) {
    const q = filters.q.replace(/%/g, "").trim();
    if (q) {
      query = query.or(
        `name.ilike.%${q}%,description.ilike.%${q}%,problem_solved.ilike.%${q}%`,
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    return { products: filterMockProducts(filters), source: "mock" };
  }

  if (!data?.length) {
    // Empty DB after migration but before seed → fall back so the UI is demoable
    const hasAny = await supabase.from("products").select("id").limit(1);
    if (hasAny.error || !hasAny.data?.length) {
      return { products: filterMockProducts(filters), source: "mock" };
    }
    return { products: [], source: "supabase" };
  }

  return { products: data.map(mapProduct), source: "supabase" };
}

export async function getFeaturedProducts(limit = 6): Promise<{
  products: Product[];
  source: CatalogSource;
}> {
  const supabase = await getServerSupabase();
  if (!supabase) {
    return { products: getMockFeatured(limit), source: "mock" };
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, category_id, name, slug, price_zmw, description, problem_solved, stock_qty, is_preorder, preorder_deposit, images, specs, badge, featured, active, categories(key, title)",
    )
    .eq("active", true)
    .eq("featured", true)
    .order("name", { ascending: true })
    .limit(limit);

  if (error || !data?.length) {
    return { products: getMockFeatured(limit), source: "mock" };
  }

  return { products: data.map(mapProduct), source: "supabase" };
}

export async function getProductBySlug(
  slug: string,
): Promise<{ product: ProductDetail | null; source: CatalogSource }> {
  const supabase = await getServerSupabase();
  if (!supabase) {
    return { product: getMockProductBySlug(slug), source: "mock" };
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, category_id, name, slug, price_zmw, description, problem_solved, stock_qty, is_preorder, preorder_deposit, images, specs, badge, featured, active, categories(key, title)",
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) {
    const mock = getMockProductBySlug(slug);
    return { product: mock, source: mock ? "mock" : "supabase" };
  }

  const product = mapProduct(data);

  const [unitsRes, reviewsRes, relatedRes] = await Promise.all([
    supabase
      .from("product_units")
      .select(
        "id, product_id, serial_or_imei, battery_health, imei_checked, warranty_months, status",
      )
      .eq("product_id", product.id)
      .eq("status", "available"),
    supabase
      .from("reviews")
      .select("id, product_id, author, rating, body, location")
      .eq("product_id", product.id)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("products")
      .select(
        "id, category_id, name, slug, price_zmw, description, problem_solved, stock_qty, is_preorder, preorder_deposit, images, specs, badge, featured, active, categories(key, title)",
      )
      .eq("active", true)
      .eq("category_id", product.categoryId!)
      .neq("id", product.id)
      .limit(4),
  ]);

  return {
    product: {
      ...product,
      description: product.description ?? "",
      stockQty: product.stockQty ?? 0,
      images: product.images ?? [],
      specs: product.specs ?? {},
      units: (unitsRes.data ?? []).map(mapUnit),
      reviews: (reviewsRes.data ?? []).map(mapReview),
      related: (relatedRes.data ?? []).map(mapProduct),
    },
    source: "supabase",
  };
}

export async function listPreorderProducts(): Promise<Product[]> {
  const supabase = await getServerSupabase();
  if (!supabase) {
    return filterMockProducts({}).filter((p) => p.isPreorder);
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, category_id, name, slug, price_zmw, description, problem_solved, stock_qty, is_preorder, preorder_deposit, images, specs, badge, featured, active, categories(key, title)",
    )
    .eq("active", true)
    .eq("is_preorder", true)
    .order("name", { ascending: true });

  if (error || !data?.length) {
    return filterMockProducts({}).filter((p) => p.isPreorder);
  }

  return data.map(mapProduct);
}
