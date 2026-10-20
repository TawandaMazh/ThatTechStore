import type { SeasonHero, SeasonKey } from "@/types";

export const seasonHeroes: Record<SeasonKey, SeasonHero> = {
  heat: {
    key: "heat",
    headline: "Stay cool when Lusaka runs hot.",
    subline: "Fans, AC, and cooling gear ready before the heat peaks.",
    ctaLabel: "Shop cooling",
    ctaHref: "/products?category=too-hot",
    secondaryCtaLabel: "Browse all",
    secondaryCtaHref: "/products",
    visualLabel: "Heat season",
  },
  storms: {
    key: "storms",
    headline: "Power through the storm season.",
    subline: "Surge protection and backups for rainy-season outages.",
    ctaLabel: "Shop storm gear",
    ctaHref: "/products?category=storms",
    secondaryCtaLabel: "Browse all",
    secondaryCtaHref: "/products",
    visualLabel: "Storm season",
  },
  outages: {
    key: "outages",
    headline: "Lights on when the grid isn’t.",
    subline: "Inverters, batteries, and solar for load-shedding months.",
    ctaLabel: "Shop power",
    ctaHref: "/products?category=power-cuts",
    secondaryCtaLabel: "Browse all",
    secondaryCtaHref: "/products",
    visualLabel: "Outage season",
  },
};
