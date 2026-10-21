import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/components/order/order-summary";
import { OrderTimeline } from "@/components/order/order-timeline";
import { getOrderConfirmation } from "@/lib/orders/repository";
import { PAYMENT_METHOD_LABELS } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return {
    title: `Order ${decodeURIComponent(orderNumber)} | ThatTechStore`,
  };
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber: raw } = await params;
  const orderNumber = decodeURIComponent(raw);
  const order = await getOrderConfirmation(orderNumber);
  if (!order) notFound();

  const needsPay =
    order.paymentMethod !== "cod" &&
    order.status === "pending" &&
    order.payment?.status !== "succeeded";

  return (
    <Container className="py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-accent">Order confirmed</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Thanks, {order.customerName.split(" ")[0]}
        </h1>
        <p className="mt-3 text-text-muted">
          We saved your order.{" "}
          {order.paymentMethod === "cod"
            ? "Pay the rider on delivery."
            : order.status === "paid"
              ? "Payment was confirmed by webhook."
              : `Complete ${PAYMENT_METHOD_LABELS[order.paymentMethod]} to move past pending.`}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-6">
          <OrderSummary order={order} />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              href={`/track?order=${encodeURIComponent(order.orderNumber)}&phone=${encodeURIComponent(order.customerPhone)}`}
              variant="primary"
            >
              Track order
            </Button>
            {needsPay && order.payment ? (
              <Button
                href={`/pay/mock/${encodeURIComponent(order.payment.providerRef)}?method=${order.paymentMethod}&order=${encodeURIComponent(order.orderNumber)}&amount=${order.amountDueZmw}`}
                variant="secondary"
              >
                Complete payment
              </Button>
            ) : null}
            <Button href="/products" variant="ghost">
              Continue shopping
            </Button>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-text">
            Status
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Timeline updates when payment webhook fires and when delivery
            advances (Phase 5).
          </p>
          <div className="mt-6">
            <OrderTimeline order={order} />
          </div>
          <p className="mt-4 text-xs text-text-subtle">
            Save your order number{" "}
            <span className="font-mono text-text">{order.orderNumber}</span>{" "}
            and phone to track later at{" "}
            <Link href="/track" className="text-accent hover:underline">
              /track
            </Link>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
