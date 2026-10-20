"use client";

import { motion } from "framer-motion";
import type { SeasonHero } from "@/types";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

interface HeroProps {
  hero: SeasonHero;
}

const seasonPlanes: Record<
  SeasonHero["key"],
  { from: string; mid: string; to: string; accent: string }
> = {
  heat: {
    from: "#1a0f08",
    mid: "#2a1810",
    to: "#0a1628",
    accent: "rgba(255, 140, 60, 0.35)",
  },
  storms: {
    from: "#061018",
    mid: "#0a1c2e",
    to: "#0c1424",
    accent: "rgba(61, 139, 255, 0.4)",
  },
  outages: {
    from: "#05080e",
    mid: "#0c1220",
    to: "#101828",
    accent: "rgba(62, 207, 142, 0.28)",
  },
};

export function Hero({ hero }: HeroProps) {
  const reduced = usePrefersReducedMotion();
  const plane = seasonPlanes[hero.key];

  return (
    <section
      className="relative isolate min-h-[min(100svh,920px)] w-full overflow-hidden"
      aria-label={`${hero.visualLabel} hero`}
    >
      {/* Full-bleed visual plane */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 40%, ${plane.accent}, transparent 55%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(61,139,255,0.12), transparent 50%),
            linear-gradient(145deg, ${plane.from} 0%, ${plane.mid} 45%, ${plane.to} 100%)
          `,
        }}
        aria-hidden
      />

      {/* Abstract device / atmosphere silhouette — edge-to-edge, not a card */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <HeroVisual season={hero.key} reduced={reduced} />
      </div>

      <div className="relative mx-auto flex min-h-[min(100svh,920px)] w-full max-w-6xl flex-col justify-end px-4 pb-16 pt-[calc(var(--header-h)+2rem)] sm:px-6 sm:pb-20 lg:justify-center lg:px-8 lg:pb-24">
        <div className="max-w-xl lg:max-w-2xl">
          <motion.p
            className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl md:text-4xl"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            ThatTechStore
          </motion.p>

          <motion.h1
            className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-text sm:text-4xl md:text-5xl lg:text-[3.25rem]"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: reduced ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            className="mt-4 max-w-md text-base leading-relaxed text-text-muted sm:text-lg"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: reduced ? 0 : 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {hero.subline}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: reduced ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Button href={hero.ctaHref} size="lg">
              {hero.ctaLabel}
            </Button>
            {hero.secondaryCtaLabel && hero.secondaryCtaHref ? (
              <Button href={hero.secondaryCtaHref} variant="secondary" size="lg">
                {hero.secondaryCtaLabel}
              </Button>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual({
  season,
  reduced,
}: {
  season: SeasonHero["key"];
  reduced: boolean;
}) {
  return (
    <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
      <motion.div
        className={cn(
          "absolute right-[-8%] top-[18%] h-[55%] w-[70%] max-w-xl rounded-[40%] opacity-40 blur-3xl",
          season === "heat" && "bg-orange-500/30",
          season === "storms" && "bg-accent/40",
          season === "outages" && "bg-emerald-400/25",
        )}
        animate={
          reduced
            ? undefined
            : { opacity: [0.28, 0.45, 0.28], scale: [1, 1.04, 1] }
        }
        transition={
          reduced
            ? undefined
            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Soft product-plane silhouette */}
      <svg
        className="absolute bottom-[12%] right-[4%] h-[58%] w-[85%] max-w-2xl text-white/10"
        viewBox="0 0 640 480"
        fill="none"
        aria-hidden
      >
        <rect
          x="120"
          y="80"
          width="400"
          height="280"
          rx="28"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/20"
        />
        <rect
          x="160"
          y="120"
          width="320"
          height="180"
          rx="12"
          fill="url(#heroGrad)"
          opacity="0.55"
        />
        <circle cx="320" cy="340" r="8" fill="currentColor" opacity="0.35" />
        <defs>
          <linearGradient id="heroGrad" x1="160" y1="120" x2="480" y2="300">
            <stop stopColor="#3D8BFF" stopOpacity="0.5" />
            <stop offset="1" stopColor="#0E1420" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
