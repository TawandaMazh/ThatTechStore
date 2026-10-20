"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const category = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const inStock = searchParams.get("inStock") === "1";

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (value == null || value === "") params.delete(key);
        else params.set(key, value);
      });
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  return (
    <form
      className={cn(
        "flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-4",
        pending && "opacity-80",
      )}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        update({
          q: String(fd.get("q") ?? "").trim() || null,
          minPrice: String(fd.get("minPrice") ?? "").trim() || null,
          maxPrice: String(fd.get("maxPrice") ?? "").trim() || null,
          inStock: fd.get("inStock") ? "1" : null,
        });
      }}
    >
      <div>
        <label htmlFor="q" className="text-xs font-medium uppercase tracking-wide text-text-subtle">
          Search
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Fan, inverter, iPhone…"
          className="mt-1.5 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">
          Category
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ category: null })}
            className={cn(
              "rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors",
              !category
                ? "bg-accent text-white"
                : "bg-bg text-text-muted hover:bg-surface-hover hover:text-text",
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => update({ category: c.key })}
              className={cn(
                "rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors",
                    category === c.key
                      ? "bg-accent text-white"
                      : "bg-bg text-text-muted hover:bg-surface-hover hover:text-text",
              )}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="minPrice"
            className="text-xs font-medium uppercase tracking-wide text-text-subtle"
          >
            Min (K)
          </label>
          <input
            id="minPrice"
            name="minPrice"
            type="number"
            min={0}
            inputMode="numeric"
            defaultValue={minPrice}
            placeholder="0"
            className="mt-1.5 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="maxPrice"
            className="text-xs font-medium uppercase tracking-wide text-text-subtle"
          >
            Max (K)
          </label>
          <input
            id="maxPrice"
            name="maxPrice"
            type="number"
            min={0}
            inputMode="numeric"
            defaultValue={maxPrice}
            placeholder="10000"
            className="mt-1.5 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2.5 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={inStock}
          className="size-4 rounded border-border accent-[var(--accent)]"
        />
        In stock only
      </label>

      <button
        type="submit"
        className="h-11 rounded-[var(--radius-md)] bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Apply filters
      </button>
    </form>
  );
}
