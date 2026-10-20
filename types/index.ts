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
  key: CategoryKey;
  title: string;
  description: string;
  href: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  priceZmw: number;
  problemSolved: string;
  category: CategoryKey;
  badge?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  body: string;
  location: string;
}
