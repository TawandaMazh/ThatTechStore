"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  name: string;
  images: string[];
}

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const list = images.length ? images : [];
  const [active, setActive] = useState(0);
  const current = list[active];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border border-border bg-gradient-to-br from-accent-muted to-bg-elevated">
        {current ? (
          <ProductImage
            src={current}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl font-semibold text-accent/35">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      {list.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border bg-surface",
                i === active ? "border-accent" : "border-border",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <ProductImage src={src} alt="" fill className="object-contain p-2" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
