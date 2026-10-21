"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/lib/payments";
import { formatZmw } from "@/lib/utils";

/**
 * Mock wallet / card screen.
 * “Pay” asks the server to simulate the provider calling the webhook —
 * the client never sets order status to paid itself.
 */
export function MockPayClient({
  paymentRef,
  orderNumber,
  method,
  amountZmw,
}: {
  paymentRef: string;
  orderNumber: string;
  method: PaymentMethod;
  amountZmw: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function complete(status: "succeeded" | "failed") {
    setError(null);
    startTransition(async () => {
      try {
        // Provider-side simulation: this endpoint forwards to the webhook
        // with the server-held secret. UI does not mark paid directly.
        const res = await fetch("/api/payments/mock-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentRef, status }),
        });
        const data = (await res.json()) as {
          error?: string;
          orderNumber?: string;
        };
        if (!res.ok) {
          setError(data.error ?? "Payment simulation failed.");
          return;
        }
        router.push(
          `/order/${encodeURIComponent(data.orderNumber ?? orderNumber)}`,
        );
      } catch {
        setError("Network error — try again.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <p className="text-xs font-medium uppercase tracking-wider text-accent">
        Mock payment
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-text">
        {PAYMENT_METHOD_LABELS[method]}
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Simulates MoMo / card checkout. Confirming payment hits the{" "}
        <span className="font-mono text-text">/api/payments/webhook</span>{" "}
        route — not this button alone.
      </p>

      <dl className="mt-6 space-y-3 rounded-[var(--radius-md)] border border-border bg-bg p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Order</dt>
          <dd className="font-mono text-text">{orderNumber}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Amount</dt>
          <dd className="font-display text-lg font-semibold text-text">
            {formatZmw(amountZmw)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Ref</dt>
          <dd className="truncate font-mono text-xs text-text-subtle">
            {paymentRef}
          </dd>
        </div>
      </dl>

      {error ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          variant="primary"
          className="w-full"
          disabled={pending}
          onClick={() => complete("succeeded")}
        >
          {pending ? "Confirming…" : `Pay ${formatZmw(amountZmw)}`}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={pending}
          onClick={() => complete("failed")}
        >
          Simulate failure
        </Button>
        <Button
          href={`/order/${encodeURIComponent(orderNumber)}`}
          variant="ghost"
          className="w-full"
        >
          Skip to confirmation
        </Button>
      </div>
    </div>
  );
}
