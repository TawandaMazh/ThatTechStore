"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface CategoriesProps {
  categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="py-16 sm:py-20" aria-labelledby="shop-by-problem">
      <Container>
        <Reveal>
          <SectionHeading
            id="shop-by-problem"
            title="Shop by problem"
            description="Pick what you’re dealing with — we’ll point you to the right gear."
          />
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <StaggerItem key={cat.key}>
              <motion.div
                whileHover={reduced ? undefined : { y: -3 }}
                whileTap={reduced ? undefined : { scale: 0.99 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={cat.href}
                  className="group block rounded-[var(--radius-lg)] border border-border bg-surface/60 p-5 transition-colors hover:border-border-strong hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <p className="font-display text-lg font-semibold text-text transition-colors group-hover:text-accent">
                    {cat.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                    {cat.description}
                  </p>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
