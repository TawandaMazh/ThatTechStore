"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { formatZmw, cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface BestSellersProps {
  products: Product[];
}

export function BestSellers({ products }: BestSellersProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="py-16 sm:py-20" aria-labelledby="best-sellers">
      <Container>
        <Reveal>
          <SectionHeading
            id="best-sellers"
            title="Best sellers"
            description="What Lusaka is picking up right now — mock catalog for Phase 1."
          />
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <motion.div
                whileHover={reduced ? undefined : { y: -4 }}
                transition={{ duration: 0.22 }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)]",
                    "border border-border bg-surface transition-colors",
                    "hover:border-border-strong hover:bg-surface-hover",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  )}
                >
                  <div
                    className="relative aspect-[4/3] bg-gradient-to-br from-accent-muted to-bg-elevated"
                    aria-hidden
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-4xl font-semibold text-accent/40 transition-opacity group-hover:opacity-70">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    {product.badge ? (
                      <span className="absolute left-3 top-3 rounded-[var(--radius-sm)] bg-bg/80 px-2.5 py-1 text-xs font-medium text-text backdrop-blur-sm">
                        {product.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs uppercase tracking-wide text-text-subtle">
                      {product.problemSolved}
                    </p>
                    <p className="mt-1 font-medium text-text group-hover:text-accent">
                      {product.name}
                    </p>
                    <p className="mt-auto pt-3 font-display text-lg font-semibold text-text">
                      {formatZmw(product.priceZmw)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
