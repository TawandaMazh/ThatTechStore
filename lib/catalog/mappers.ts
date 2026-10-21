import type {
  Category,
  CategoryKey,
  Product,
  ProductSpecs,
  ProductUnit,
  Review,
} from "@/types";

type CategoryRow = {
  id: string;
  key: string;
  title: string;
  description: string;
  sort_order: number;
};

type ProductRow = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price_zmw: number | string;
  description: string | null;
  problem_solved: string | null;
  stock_qty: number;
  is_preorder: boolean;
  preorder_deposit?: number | string | null;
  images: string[] | null;
  specs: ProductSpecs | null;
  badge: string | null;
  featured: boolean;
  active: boolean;
  categories?: { key: string; title: string } | { key: string; title: string }[] | null;
};

type UnitRow = {
  id: string;
  product_id: string;
  serial_or_imei: string | null;
  battery_health: number | null;
  imei_checked: boolean;
  warranty_months: number;
  status: ProductUnit["status"];
};

type ReviewRow = {
  id: string;
  product_id: string | null;
  author: string;
  rating: number;
  body: string;
  location: string;
};

function categoryKeyFromRow(row: ProductRow): CategoryKey {
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return (cat?.key ?? "too-hot") as CategoryKey;
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    key: row.key as CategoryKey,
    title: row.title,
    description: row.description,
    href: `/products?category=${row.key}`,
    sortOrder: row.sort_order,
  };
}

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    priceZmw: Number(row.price_zmw),
    problemSolved: row.problem_solved ?? "",
    category: categoryKeyFromRow(row),
    description: row.description ?? "",
    stockQty: row.stock_qty,
    isPreorder: row.is_preorder,
    preorderDepositZmw:
      row.preorder_deposit == null ? null : Number(row.preorder_deposit),
    images: row.images ?? [],
    specs: row.specs ?? {},
    badge: row.badge ?? undefined,
    featured: row.featured,
    active: row.active,
  };
}

export function mapUnit(row: UnitRow): ProductUnit {
  return {
    id: row.id,
    productId: row.product_id,
    serialOrImei: row.serial_or_imei,
    batteryHealth: row.battery_health,
    imeiChecked: row.imei_checked,
    warrantyMonths: row.warranty_months,
    status: row.status,
  };
}

export function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.product_id ?? undefined,
    author: row.author,
    rating: row.rating,
    body: row.body,
    location: row.location,
  };
}
