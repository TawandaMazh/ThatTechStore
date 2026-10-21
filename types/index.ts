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
  /** Deposit due now when isPreorder; balance on arrival. */
  preorderDepositZmw?: number | null;
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
  isPreorder?: boolean;
  /** Per-unit deposit when pre-ordering. */
  preorderDepositZmw?: number | null;
}

export type PaymentMethod =
  | "mtn_momo"
  | "airtel"
  | "zamtel"
  | "card"
  | "cod";

export type OrderStatus =
  | "pending"
  | "paid"
  | "out_for_delivery"
  | "delivered"
  | "returned";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed";

export interface OrderItem {
  id: string;
  productId?: string | null;
  productName: string;
  productSlug: string;
  unitPriceZmw: number;
  quantity: number;
  isPreorder: boolean;
  depositZmw?: number | null;
}

export interface PaymentRecord {
  id?: string;
  provider: string;
  method: PaymentMethod;
  amountZmw: number;
  status: PaymentStatus;
  providerRef: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryArea: string;
  address: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotalZmw: number;
  depositZmw: number;
  amountDueZmw: number;
  notes?: string | null;
  paidAt?: string | null;
  outForDeliveryAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  items: OrderItem[];
  payment?: PaymentRecord | null;
}
