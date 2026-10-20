"use client";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { LenisProvider } from "@/components/motion/lenis-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LenisProvider>{children}</LenisProvider>
    </ThemeProvider>
  );
}
