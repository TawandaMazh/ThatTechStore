"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const nav = [
  { href: "/products", label: "Shop" },
  { href: "/products?category=power-cuts", label: "Power" },
  { href: "/products?category=phones", label: "Phones" },
];

export function Header() {
  const reduced = usePrefersReducedMotion();

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
