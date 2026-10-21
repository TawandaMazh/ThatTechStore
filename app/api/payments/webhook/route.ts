import { NextResponse } from "next/server";
import { confirmPaymentFromWebhook } from "@/lib/orders/repository";
import { getPaymentProvider } from "@/lib/payments";

/**
 * Trust source for payment confirmation.
 * Client UI must never mark an order paid on its own — only this route does.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const provider = getPaymentProvider();
  const event = await provider.parseWebhook(body, request.headers);

  if (!event) {
    return NextResponse.json(
      { error: "Unauthorized or invalid webhook payload" },
      { status: 401 },
    );
  }

  const result = await confirmPaymentFromWebhook(
    event.paymentRef,
    event.status,
    event.raw,
  );

  if (!result) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    orderNumber: result.order.orderNumber,
    status: result.order.status,
    paymentStatus: result.order.payment?.status,
    source: result.source,
  });
}
