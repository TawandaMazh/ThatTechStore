import type { Category, Product, ProductDetail, ProductUnit, Review } from "@/types";
import { categories as baseCategories } from "@/lib/mock/categories";

/** Full Phase 2 mock catalog — used when Supabase is empty or unreachable. */
export const mockCategories: Category[] = baseCategories.map((c, i) => ({
  ...c,
  id: `mock-cat-${c.key}`,
  sortOrder: i + 1,
}));

export const mockProducts: Product[] = [
  {
    id: "b2000000-0000-4000-8000-000000000001",
    name: 'Standing Fan Pro 18"',
    slug: "standing-fan-pro-18",
    priceZmw: 890,
    problemSolved: "Keeps sitting rooms and bedrooms moveable-air cool without needing AC.",
    category: "too-hot",
    description:
      "Quiet oscillating pedestal fan with three speeds and a wide sweep — built for Lusaka afternoons when the room will not cool down.",
    stockQty: 14,
    images: ["/products/standing-fan.svg"],
    specs: {
      type: "Pedestal fan",
      blade_size: "18 inch",
      speeds: 3,
      oscillation: true,
      power: "55W",
      voltage: "220–240V",
    },
    badge: "Best seller",
    featured: true,
  },
  {
    id: "b2000000-0000-4000-8000-000000000002",
    name: 'Solar Desk Fan 12"',
    slug: "solar-desk-fan-12",
    priceZmw: 650,
    problemSolved: "Desk cooling that still works during daytime load shedding.",
    category: "too-hot",
    description:
      "USB/solar hybrid desk fan with a fold-out panel option. Run it off a power bank when the grid is down.",
    stockQty: 22,
    images: ["/products/solar-desk-fan.svg"],
    specs: {
      type: "Desk fan",
      blade_size: "12 inch",
      power_options: ["USB", "Solar panel"],
      battery: "optional power bank",
      noise: "low",
    },
    badge: "Solar ready",
    featured: true,
  },
  {
    id: "b2000000-0000-4000-8000-000000000003",
    name: "Portable AC 9000 BTU",
    slug: "portable-ac-9000",
    priceZmw: 7900,
    problemSolved: "Real cooling for bedrooms and small offices when fans are not enough.",
    category: "too-hot",
    description:
      "Self-contained portable air conditioner with window kit. Moves cool air into one room without permanent install. Arriving on the next Dubai shipment — reserve with a deposit.",
    stockQty: 0,
    isPreorder: true,
    preorderDepositZmw: 2000,
    images: ["/products/portable-ac.svg"],
    specs: {
      cooling: "9000 BTU",
      rooms: "up to ~20 m²",
      modes: ["cool", "fan", "dehumidify"],
      exhaust: "window kit included",
    },
    badge: "Next shipment",
    featured: false,
  },
  {
    id: "b2000000-0000-4000-8000-000000000004",
    name: "Surge Guard 6-Way",
    slug: "surge-guard-6-way",
    priceZmw: 320,
    problemSolved: "Stops cheap spikes from frying TVs, routers, and chargers.",
    category: "storms",
    description:
      "Six-outlet surge protector with indicator lights. First line of defence when rainy-season voltage spikes hit.",
    stockQty: 40,
    images: ["/products/surge-guard.svg"],
    specs: {
      outlets: 6,
      protection: "surge + overload",
      max_load: "2500W",
      indicator: true,
    },
    badge: "Must-have",
    featured: true,
  },
  {
    id: "b2000000-0000-4000-8000-000000000005",
    name: "Voltage Regulator 2000VA",
    slug: "voltage-regulator-2000va",
    priceZmw: 980,
    problemSolved: "Stabilises brownouts and high voltage so appliances last longer.",
    category: "storms",
    description:
      "Automatic voltage regulator for fridges, TVs, and small appliances when the line sags or climbs.",
    stockQty: 11,
    images: ["/products/voltage-regulator.svg"],
    specs: {
      capacity: "2000VA",
      input: "140–260V",
      output: "220V ±5%",
      delay: "3 min fridge protect",
    },
    featured: false,
  },
  {
    id: "b2000000-0000-4000-8000-000000000006",
    name: "Rechargeable LED Lamp Kit",
    slug: "rechargeable-led-lamp-kit",
    priceZmw: 450,
    problemSolved: "Light for homework and cooking when the lights go out mid-storm.",
    category: "storms",
    description:
      "Bright rechargeable LED lantern plus two desk lamps. Charge when power is on; light when storms cut the grid.",
    stockQty: 28,
    images: ["/products/led-lamp-kit.svg"],
    specs: {
      pieces: 3,
      runtime: "6–12 hours",
      charge: "USB-C",
      lumens: "up to 800",
    },
    badge: "Storm kit",
    featured: true,
  },
  {
    id: "b2000000-0000-4000-8000-000000000007",
    name: "1.5kVA Hybrid Inverter",
    slug: "hybrid-inverter-1-5kva",
    priceZmw: 4850,
    problemSolved: "Home backup power when ZESCO drops — without a generator racket.",
    category: "power-cuts",
    description:
      "Hybrid inverter ready for battery + optional solar input. Keeps lights, Wi-Fi, and a fridge running through load shedding.",
    stockQty: 6,
    images: ["/products/hybrid-inverter.svg"],
    specs: {
      capacity: "1.5kVA",
      type: "hybrid",
      input: ["grid", "battery", "solar optional"],
      waveform: "pure sine",
    },
    badge: "In stock",
    featured: true,
  },
  {
    id: "b2000000-0000-4000-8000-000000000008",
    name: "100Ah Lithium Battery",
    slug: "lithium-battery-100ah",
    priceZmw: 5400,
    problemSolved: "Stores enough energy for lights, phone charging, and a fridge overnight.",
    category: "power-cuts",
    description:
      "LiFePO4 battery pack sized for evening backup with a matching inverter. Longer cycle life than lead-acid. Next shipment from Dubai — pay a deposit to secure one.",
    stockQty: 0,
    isPreorder: true,
    preorderDepositZmw: 1500,
    images: ["/products/lithium-battery.svg"],
    specs: {
      chemistry: "LiFePO4",
      capacity: "100Ah",
      voltage: "12.8V",
      cycles: ">3000",
    },
    badge: "Next shipment",
    featured: true,
  },
  {
    id: "b2000000-0000-4000-8000-000000000009",
    name: "Solar Power Station 500Wh",
    slug: "solar-power-station-500wh",
    priceZmw: 3200,
    problemSolved: "Plug-and-play backup for laptops, routers, and small appliances on the go.",
    category: "power-cuts",
    description:
      "Portable power station with AC outlets and USB-C PD. Pair with a foldable panel for daytime top-ups.",
    stockQty: 9,
    images: ["/products/power-station.svg"],
    specs: {
      capacity: "500Wh",
      ac_outlets: 2,
      usb_c_pd: "100W",
      solar_input: "up to 120W",
    },
    badge: "Portable",
    featured: false,
  },
  {
    id: "b2000000-0000-4000-8000-000000000010",
    name: "iPhone 13 128GB",
    slug: "iphone-13-128gb",
    priceZmw: 6200,
    problemSolved: "A reliable daily phone with Face ID, great camera, and parts we can support.",
    category: "phones",
    description:
      "Refurbished iPhone 13, IMEI checked, battery health verified, and sold with store warranty. Midnight finish.",
    stockQty: 3,
    images: ["/products/iphone-13.svg"],
    specs: {
      storage: "128GB",
      condition: "refurbished Grade A",
      colour: "Midnight",
      network: "unlocked",
      includes: ["box", "cable"],
    },
    badge: "IMEI checked",
    featured: true,
  },
  {
    id: "b2000000-0000-4000-8000-000000000011",
    name: "Samsung Galaxy A54 128GB",
    slug: "samsung-a54-128gb",
    priceZmw: 3800,
    problemSolved: "Android phone that lasts a full Lusaka day without drama.",
    category: "phones",
    description:
      "Refurbished Galaxy A54 with checked IMEI and healthy battery. Strong mid-range for WhatsApp, maps, and work apps.",
    stockQty: 5,
    images: ["/products/samsung-a54.svg"],
    specs: {
      storage: "128GB",
      condition: "refurbished Grade A",
      colour: "Awesome Graphite",
      network: "dual SIM",
      includes: ["box", "charger"],
    },
    badge: "IMEI checked",
    featured: true,
  },
  {
    id: "b2000000-0000-4000-8000-000000000012",
    name: "25W USB-C Fast Charger",
    slug: "usb-c-fast-charger-25w",
    priceZmw: 180,
    problemSolved: "Fast top-ups between meetings when power comes back.",
    category: "phones",
    description:
      "Official-spec 25W USB-C wall charger. Works with Samsung and most USB-C phones.",
    stockQty: 35,
    images: ["/products/fast-charger.svg"],
    specs: {
      output: "25W",
      port: "USB-C",
      cable: "1m USB-C included",
      compat: "USB-C phones",
    },
    featured: false,
  },
];

const mockUnitsByProduct: Record<string, ProductUnit[]> = {
  "b2000000-0000-4000-8000-000000000010": [
    {
      id: "u1",
      productId: "b2000000-0000-4000-8000-000000000010",
      serialOrImei: "356938101234567",
      batteryHealth: 92,
      imeiChecked: true,
      warrantyMonths: 3,
      status: "available",
    },
    {
      id: "u2",
      productId: "b2000000-0000-4000-8000-000000000010",
      serialOrImei: "356938101234568",
      batteryHealth: 88,
      imeiChecked: true,
      warrantyMonths: 3,
      status: "available",
    },
  ],
  "b2000000-0000-4000-8000-000000000011": [
    {
      id: "u3",
      productId: "b2000000-0000-4000-8000-000000000011",
      serialOrImei: "359872061112233",
      batteryHealth: 90,
      imeiChecked: true,
      warrantyMonths: 3,
      status: "available",
    },
  ],
};

const mockProductReviews: Review[] = [
  {
    id: "r1",
    productId: "b2000000-0000-4000-8000-000000000001",
    author: "Chipo M.",
    rating: 5,
    body: "Fan is quiet enough for the bedroom. Arrived same day to Woodlands.",
    location: "Woodlands",
  },
  {
    id: "r2",
    productId: "b2000000-0000-4000-8000-000000000007",
    author: "Joseph K.",
    rating: 5,
    body: "Inverter kept the fridge and Wi-Fi through a 6-hour cut. Setup help was clear.",
    location: "Kabwata",
  },
  {
    id: "r3",
    productId: "b2000000-0000-4000-8000-000000000010",
    author: "Mutale S.",
    rating: 4,
    body: "Battery at 92%, IMEI checked in front of me. Fair price for Lusaka.",
    location: "Roma",
  },
];

export function getMockProductBySlug(slug: string): ProductDetail | null {
  const product = mockProducts.find((p) => p.slug === slug);
  if (!product) return null;

  const related = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return {
    ...product,
    description: product.description ?? "",
    stockQty: product.stockQty ?? 0,
    images: product.images ?? [],
    specs: product.specs ?? {},
    units: mockUnitsByProduct[product.id] ?? [],
    reviews: mockProductReviews.filter((r) => r.productId === product.id),
    related,
  };
}

export function filterMockProducts(filters: {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}): Product[] {
  return mockProducts.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.inStock && (p.stockQty ?? 0) <= 0) return false;
    if (filters.minPrice != null && p.priceZmw < filters.minPrice) return false;
    if (filters.maxPrice != null && p.priceZmw > filters.maxPrice) return false;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hay = `${p.name} ${p.description ?? ""} ${p.problemSolved}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function getMockFeatured(limit = 6): Product[] {
  const featured = mockProducts.filter((p) => p.featured);
  return (featured.length ? featured : mockProducts).slice(0, limit);
}
