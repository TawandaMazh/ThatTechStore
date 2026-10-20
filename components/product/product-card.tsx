"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { Reveal } from "@/components/motion/reveal";
import { ProductImage } from "@/components/product/product-image";
import { formatZmw, cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const reduced = usePrefersReducedMotion();
  const image = product.images?.[0];
  const inStock = (product.stockQty ?? 0) > 0;

  return (
    <Reveal as="article">
      <motion.div
        whileHover={reduced ? undefined : { y: -4 }}
        transition={{ duration: 0.22 }}
        className="h-full"
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
          <div className="relative aspect-[4/3] bg-gradient-to-br from-accent-muted to-bg-elevated">
            {image ? (
              <ProductImage
                src={image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-6"
                priority={priority}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-4xl font-semibold text-accent/40">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
            {product.badge ? (
              <span className="absolute left-3 top-3 rounded-[var(--radius-sm)] bg-bg/80 px-2.5 py-1 text-xs font-medium text-text backdrop-blur-sm">
                {product.badge}
              </span>
            ) : null}
            {!inStock ? (
              <span className="absolute right-3 top-3 rounded-[var(--radius-sm)] bg-danger/90 px-2.5 py-1 text-xs font-medium text-white">
                Out of stock
              </span>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <p className="text-xs uppercase tracking-wide text-text-subtle">
              {product.category.replace("-", " ")}
            </p>
            <p className="mt-1 font-medium text-text group-hover:text-accent">
              {product.name}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-text-muted">
              {product.problemSolved}
            </p>
            <p className="mt-auto pt-3 font-display text-lg font-semibold text-text">
              {formatZmw(product.priceZmw)}
            </p>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}
