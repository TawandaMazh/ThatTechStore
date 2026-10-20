import type { Category } from "@/types";

export const categories: Category[] = [
  {
    key: "too-hot",
    title: "Too hot",
    description: "Cooling that keeps rooms livable.",
    href: "/products?category=too-hot",
  },
  {
    key: "power-cuts",
    title: "Power cuts",
    description: "Backup power when ZESCO drops.",
    href: "/products?category=power-cuts",
  },
  {
    key: "storms",
    title: "Storms",
    description: "Surge gear for rainy-season spikes.",
    href: "/products?category=storms",
  },
  {
    key: "phones",
    title: "Phones",
    description: "Checked handsets with warranty.",
    href: "/products?category=phones",
  },
];
