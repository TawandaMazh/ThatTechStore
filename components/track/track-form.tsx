"use client";

import { useState, useTransition } from "react";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/components/order/order-summary";
import { OrderTimeline } from "@/components/order/order-timeline";

export function TrackForm({
  initialOrderNumber = "",
  initialPhone = "",
}: {
  initialOrderNumber?: string;
  initialPhone?: string;
}) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOrder(null);
    startTransition(async () => {
      try {
        const params = new URLSearchParams({
          orderNumber: orderNumber.trim(),
          phone: phone.trim(),
        });
        const res = await fetch(`/api/orders/track?${params}`);
        const data = (await res.json()) as { error?: string; order?: Order };
        if (!res.ok || !data.order) {
          setError(data.error ?? "Order not found. Check number and phone.");
          return;
        }
        setOrder(data.order);
      } catch {
        setError("Network error — try again.");
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <form
        onSubmit={onSubmit}
        className="h-fit rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-6"
      >
        <h2 className="font-display text-lg font-semibold text-text">
          Find your order
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Enter the order number from your confirmation and the phone used at
          checkout.
        </p>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-text-muted">
              Order number
            </span>
            <input
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className={inputClass}
              placeholder="TTS-…"
              autoComplete="off"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-text-muted">
              Phone number
            </span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="097xxxxxxx"
              autoComplete="tel"
            />
          </label>
        </div>
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
          {pending ? "Looking up…" : "Track order"}
        </Button>
      </form>

      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-6">
        {order ? (
          <div className="space-y-8">
            <OrderTimeline order={order} />
            <div className="border-t border-border pt-6">
              <OrderSummary order={order} />
            </div>
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
            <p className="font-display text-lg font-semibold text-text">
              Status timeline
            </p>
            <p className="mt-2 max-w-xs text-sm text-text-muted">
              Pending → Paid → Out for delivery → Delivered. Paid only after the
              payment webhook confirms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2.5 text-sm text-text placeholder:text-text-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
