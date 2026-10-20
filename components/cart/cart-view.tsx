"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/components/product/product-image";
import { formatZmw } from "@/lib/utils";

export function CartView() {
  const { items, subtotalZmw, ready, setQuantity, removeItem } = useCart();

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 text-center">
        <p className="font-display text-xl font-semibold text-text">
          Your cart is empty
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Browse cooling, power backup, storm gear, and checked phones.
        </p>
        <div className="mt-6">
          <Button href="/products" variant="primary">
            Shop products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-4"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-gradient-to-br from-accent-muted to-bg-elevated">
              {item.image ? (
                <ProductImage
                  src={item.image}
                  alt=""
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="font-medium text-text hover:text-accent"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-text-muted">
                {formatZmw(item.priceZmw)} each
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-text-muted">
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setQuantity(item.productId, Number(e.target.value) || 1)
                    }
                    className="w-16 rounded-[var(--radius-sm)] border border-border bg-bg px-2 py-1.5 text-text"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-danger hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="shrink-0 font-display font-semibold text-text">
              {formatZmw(item.priceZmw * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-[var(--radius-lg)] border border-border bg-surface p-5">
        <p className="font-display text-lg font-semibold text-text">Summary</p>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-semibold text-text">
            {formatZmw(subtotalZmw)}
          </span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-subtle">
          Delivery across all Lusaka areas. Checkout and payments arrive in
          Phase 3 — for now you can keep shopping.
        </p>
        <Button
          href="/products"
          variant="secondary"
          className="mt-5 w-full"
        >
          Continue shopping
        </Button>
        <Button
          variant="primary"
          className="mt-3 w-full"
          disabled
          title="Checkout ships in Phase 3"
        >
          Checkout soon
        </Button>
      </aside>
    </div>
  );
}
