export type SeasonKey = "heat" | "storms" | "outages";

export type CategoryKey = "too-hot" | "power-cuts" | "storms" | "phones";

export interface SeasonHero {
  key: SeasonKey;
  headline: string;
  subline: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  visualLabel: string;
}

export interface SiteSettings {
  /** When set, overrides date-based season detection (mock admin). */
  activeSeason: SeasonKey | null;
}

export interface Category {
  id?: string;
  key: CategoryKey;
  title: string;
  description: string;
  href: string;
  sortOrder?: number;
}

export interface ProductSpecs {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  priceZmw: number;
  problemSolved: string;
  category: CategoryKey;
  categoryId?: string;
  description?: string;
  stockQty?: number;
  isPreorder?: boolean;
  images?: string[];
  specs?: ProductSpecs;
  badge?: string;
  featured?: boolean;
  active?: boolean;
}

export interface ProductUnit {
  id: string;
  productId: string;
  serialOrImei: string | null;
  batteryHealth: number | null;
  imeiChecked: boolean;
  warrantyMonths: number;
  status: "available" | "reserved" | "sold" | "returned";
}

export interface ProductDetail extends Product {
  description: string;
  stockQty: number;
  images: string[];
  specs: ProductSpecs;
  units: ProductUnit[];
  reviews: Review[];
  related: Product[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  body: string;
  location: string;
  productId?: string;
}

export interface ProductFilters {
  category?: CategoryKey | string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceZmw: number;
  image?: string;
  quantity: number;
}
