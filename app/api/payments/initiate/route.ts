import { NextResponse } from "next/server";
import { getOrderConfirmation } from "@/lib/orders/repository";
import { getPaymentProvider } from "@/lib/payments";
import type { PaymentMethod } from "@/types";

/**
 * Re-initiate payment for an existing pending order (e.g. retry from confirmation).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const orderNumber = String(data.orderNumber ?? "").trim();
  if (!orderNumber) {
    return NextResponse.json(
      { error: "orderNumber required" },
      { status: 400 },
    );
  }

  const order = await getOrderConfirmation(orderNumber);
  if (!order || !order.payment) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "paid" || order.payment.status === "succeeded") {
    return NextResponse.json({
      ok: true,
      alreadyPaid: true,
      orderNumber: order.orderNumber,
      payment: {
        provider: order.payment.provider,
        paymentRef: order.payment.providerRef,
        checkoutUrl: null,
        immediate: true,
        message: "Payment already confirmed.",
      },
    });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const provider = getPaymentProvider();
  const initiation = await provider.initiate({
    orderNumber: order.orderNumber,
    paymentRef: order.payment.providerRef,
    amountZmw: order.amountDueZmw,
    method: order.paymentMethod as PaymentMethod,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    siteUrl,
  });

  return NextResponse.json({
    ok: true,
    orderNumber: order.orderNumber,
    paymentRef: order.payment.providerRef,
    payment: initiation,
  });
}
