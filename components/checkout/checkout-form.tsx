"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/components/product/product-image";
import { computeCartTotals } from "@/lib/orders/totals";
import {
  ONLINE_PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/payments";
import type { PaymentMethod } from "@/types";
import { formatZmw } from "@/lib/utils";

const METHODS: PaymentMethod[] = [...ONLINE_PAYMENT_METHODS, "cod"];

export function CheckoutForm() {
  const router = useRouter();
  const { items, ready, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mtn_momo");

  const totals = computeCartTotals(items);

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 text-center">
        <p className="font-display text-xl font-semibold text-text">
          Nothing to check out
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Add products from the shop, then come back here.
        </p>
        <div className="mt-6">
          <Button href="/products" variant="primary">
            Shop products
          </Button>
        </div>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName,
            customerPhone,
            deliveryArea,
            address,
            notes,
            paymentMethod,
            items,
          }),
        });
        const data = (await res.json()) as {
          error?: string;
          orderNumber?: string;
          payment?: { checkoutUrl?: string | null; immediate?: boolean };
        };
        if (!res.ok) {
          setError(data.error ?? "Could not place order.");
          return;
        }

        clear();

        if (data.payment?.checkoutUrl) {
          window.location.href = data.payment.checkoutUrl;
          return;
        }

        router.push(`/order/${encodeURIComponent(data.orderNumber!)}`);
      } catch {
        setError("Network error — try again.");
      }
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_340px]"
    >
      <div className="space-y-6">
        <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-text">
            Delivery — all Lusaka areas
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Free-text area and address — not limited to a suburb list.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
                autoComplete="name"
              />
            </Field>
            <Field label="Phone number" required>
              <input
                required
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={inputClass}
                placeholder="097xxxxxxx"
                autoComplete="tel"
              />
            </Field>
            <Field label="Area / neighbourhood" required className="sm:col-span-2">
              <input
                required
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className={inputClass}
                placeholder="e.g. Woodlands, Kabulonga, Mtendere…"
                autoComplete="address-level2"
              />
            </Field>
            <Field label="Street address / landmark" required className="sm:col-span-2">
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`${inputClass} min-h-[88px] resize-y`}
                placeholder="House number, street, nearby landmark"
                autoComplete="street-address"
              />
            </Field>
            <Field label="Notes (optional)" className="sm:col-span-2">
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={inputClass}
                placeholder="Gate code, call on arrival…"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-text">
            Payment method
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Mock provider for now — real Flutterwave later. Paid status only
            updates from the webhook.
          </p>
          <fieldset className="mt-4 space-y-2">
            <legend className="sr-only">Payment method</legend>
            {METHODS.map((method) => (
              <label
                key={method}
                className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border bg-bg px-4 py-3 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent-muted"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="size-4 accent-[var(--accent)]"
                />
                <span className="text-sm font-medium text-text">
                  {PAYMENT_METHOD_LABELS[method]}
                </span>
              </label>
            ))}
          </fieldset>
        </section>
      </div>

      <aside className="h-fit space-y-4 lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
          <p className="font-display text-lg font-semibold text-text">
            Order summary
          </p>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-3 text-sm">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-gradient-to-br from-accent-muted to-bg-elevated">
                  {item.image ? (
                    <ProductImage
                      src={item.image}
                      alt=""
                      fill
                      className="object-contain p-1"
                      sizes="48px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text">{item.name}</p>
                  <p className="text-text-muted">
                    ×{item.quantity}
                    {item.isPreorder ? " · Pre-order deposit" : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatZmw(totals.subtotalZmw)} />
            {totals.hasPreorder ? (
              <Row
                label="Deposit due now"
                value={formatZmw(totals.depositZmw)}
              />
            ) : null}
            {totals.balanceLaterZmw > 0 ? (
              <Row
                label="Balance on arrival"
                value={formatZmw(totals.balanceLaterZmw)}
                muted
              />
            ) : null}
            <Row
              label="Pay now"
              value={formatZmw(totals.amountDueZmw)}
              strong
            />
          </dl>

          {error ? (
            <p className="mt-4 text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            className="mt-5 w-full"
            disabled={pending}
          >
            {pending ? "Placing order…" : "Place order"}
          </Button>
        </div>
      </aside>
    </form>
  );
}

const inputClass =
  "w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Field({
  label,
  children,
  required,
  className,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-sm text-text-muted">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={muted ? "text-text-subtle" : "text-text-muted"}>{label}</dt>
      <dd
        className={
          strong
            ? "font-display font-semibold text-text"
            : muted
              ? "text-text-subtle"
              : "font-medium text-text"
        }
      >
        {value}
      </dd>
    </div>
  );
}
