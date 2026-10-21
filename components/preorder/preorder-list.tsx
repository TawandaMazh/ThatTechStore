import Link from "next/link";
import type { Product } from "@/types";
import { ProductImage } from "@/components/product/product-image";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { formatZmw } from "@/lib/utils";

export function PreorderList({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 text-center">
        <p className="font-display text-xl font-semibold text-text">
          No pre-orders right now
        </p>
        <p className="mt-2 text-sm text-text-muted">
          When the next Dubai shipment is booked, deposit items will show here.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          Browse in-stock products
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const deposit =
          product.preorderDepositZmw != null && product.preorderDepositZmw > 0
            ? product.preorderDepositZmw
            : Math.round(product.priceZmw * 0.3);
        return (
          <li
            key={product.id}
            className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-4"
          >
            <Link href={`/products/${product.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-gradient-to-br from-accent-muted to-bg-elevated">
                {product.images?.[0] ? (
                  <ProductImage
                    src={product.images[0]}
                    alt=""
                    fill
                    className="object-contain p-4 transition-transform duration-[var(--dur-med)] group-hover:scale-[1.03]"
                    sizes="(max-width:640px) 100vw, 33vw"
                  />
                ) : null}
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-text group-hover:text-accent">
                {product.name}
              </h2>
            </Link>
            <p className="mt-1 text-sm text-text-muted line-clamp-2">
              {product.problemSolved}
            </p>
            <p className="mt-3 text-sm text-text">
              Full price {formatZmw(product.priceZmw)} · Deposit{" "}
              <span className="font-semibold text-accent">
                {formatZmw(deposit)}
              </span>
            </p>
            <div className="mt-auto pt-4">
              <AddToCartButton product={product} className="w-full" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
