"use client";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { LenisProvider } from "@/components/motion/lenis-provider";
import { CartProvider } from "@/components/cart/cart-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <LenisProvider>{children}</LenisProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
