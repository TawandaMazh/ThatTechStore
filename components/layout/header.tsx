"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCart } from "@/components/cart/cart-provider";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const nav = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=power-cuts", label: "Power" },
  { href: "/products?category=phones", label: "Phones" },
];

export function Header() {
  const reduced = usePrefersReducedMotion();
  const { count, ready } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-blur-md">
      <Container className="flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex min-w-0 items-baseline gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <motion.span
            className="font-display text-xl font-bold tracking-tight text-text sm:text-2xl"
            whileHover={reduced ? undefined : { opacity: 0.85 }}
            transition={{ duration: 0.18 }}
          >
            ThatTechStore
          </motion.span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius-sm)] px-3 py-2 text-sm text-text-muted transition-colors hover:bg-accent-muted hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-md)] px-3 text-sm text-text-muted transition-colors hover:bg-accent-muted hover:text-text"
            aria-label={ready ? `Cart, ${count} items` : "Cart"}
          >
            <CartIcon />
            <span className="hidden sm:inline">Cart</span>
            {ready && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
          <Link
            href="/products"
            className="hidden rounded-[var(--radius-md)] bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            Shop now
          </Link>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}
