"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover shadow-[var(--shadow-soft)]",
  secondary:
    "bg-surface text-text border border-border-strong hover:bg-surface-hover",
  ghost: "bg-transparent text-text-muted hover:text-text hover:bg-accent-muted",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  disabled,
  ...props
}: ButtonProps) {
  const reduced = usePrefersReducedMotion();

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium",
    "transition-[background-color,color,opacity] duration-[var(--dur-fast)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  const motionProps = reduced
    ? {}
    : {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
      };

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        {...motionProps}
        {...(props as Omit<HTMLMotionProps<"a">, "href" | "children">)}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      className={classes}
      disabled={disabled}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}
