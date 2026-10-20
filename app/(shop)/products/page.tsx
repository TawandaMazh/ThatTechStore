import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { listCategories, listProducts } from "@/lib/catalog/queries";
import type { CategoryKey } from "@/types";

export const metadata = {
  title: "Shop | ThatTechStore",
  description:
    "Browse cooling, power backup, storm gear, and IMEI-checked phones — delivery across all Lusaka areas.",
};

async function ProductResults({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}) {
  const params = await searchParams;
  const filters = {
    category: params.category as CategoryKey | undefined,
    q: params.q,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStock: params.inStock === "1",
  };

  const [{ categories }, { products, source }] = await Promise.all([
    listCategories(),
    listProducts(filters),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <ProductFilters categories={categories} />
      <div>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-text-muted">
            {products.length} product{products.length === 1 ? "" : "s"}
            {source === "mock" ? (
              <span className="ml-2 text-text-subtle">
                · demo catalog (run seed for live Supabase data)
              </span>
            ) : null}
          </p>
        </div>
        {products.length ? (
          <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={i < 3}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 text-center">
            <p className="font-medium text-text">No products match</p>
            <p className="mt-2 text-sm text-text-muted">
              Try clearing filters or searching another term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ListingSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Skeleton className="h-80 w-full" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full" />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}) {
  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        title="Shop by problem"
        description="Filter by category, price, and stock. Delivery across all Lusaka areas."
      />
      <div className="mt-8">
        <Suspense fallback={<ListingSkeleton />}>
          <ProductResults searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}
