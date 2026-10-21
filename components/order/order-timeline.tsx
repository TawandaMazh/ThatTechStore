"use client";

import { motion } from "framer-motion";
import type { Order } from "@/types";
import { buildOrderTimeline } from "@/lib/orders/timeline";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export function OrderTimeline({ order }: { order: Order }) {
  const steps = buildOrderTimeline(order);
  const reduced = usePrefersReducedMotion();

  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
          {i < steps.length - 1 ? (
            <span
              className={cn(
                "absolute left-[11px] top-7 h-[calc(100%-1.25rem)] w-px",
                step.state === "done" ? "bg-accent" : "bg-border",
              )}
              aria-hidden
            />
          ) : null}
          <motion.span
            className={cn(
              "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
              step.state === "done" && "border-accent bg-accent text-white",
              step.state === "current" &&
                "border-accent bg-accent-muted text-accent",
              step.state === "upcoming" &&
                "border-border bg-surface text-text-subtle",
            )}
            initial={reduced ? false : { scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {step.state === "done" ? (
              <CheckIcon />
            ) : (
              <span className="size-2 rounded-full bg-current" />
            )}
          </motion.span>
          <div className="min-w-0 pt-0.5">
            <p
              className={cn(
                "font-medium",
                step.state === "upcoming" ? "text-text-subtle" : "text-text",
              )}
            >
              {step.label}
            </p>
            <p className="mt-0.5 text-sm text-text-muted">{step.description}</p>
            {step.at ? (
              <p className="mt-1 text-xs text-text-subtle">
                {new Date(step.at).toLocaleString("en-ZM")}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6.5 4.5 8.5 9.5 3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
