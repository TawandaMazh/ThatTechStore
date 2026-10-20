import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phase 1: keep the storefront simple. Cache Components can return in later phases.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
