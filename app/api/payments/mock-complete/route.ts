import { NextResponse } from "next/server";

/**
 * Simulates the payment provider notifying us.
 * Forwards to the webhook with the server-held secret — client never marks paid.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const paymentRef = String(data.paymentRef ?? "").trim();
  const status =
    data.status === "failed"
      ? "failed"
      : data.status === "succeeded"
        ? "succeeded"
        : null;

  if (!paymentRef || !status) {
    return NextResponse.json(
      { error: "paymentRef and status required" },
      { status: 400 },
    );
  }

  const secret = process.env.MOCK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "MOCK_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }

  const origin = new URL(request.url).origin;
  const webhookRes = await fetch(`${origin}/api/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-mock-webhook-secret": secret,
    },
    body: JSON.stringify({
      payment_ref: paymentRef,
      status,
      provider: "mock",
      simulated_at: new Date().toISOString(),
    }),
  });

  const webhookBody = (await webhookRes.json()) as Record<string, unknown>;
  if (!webhookRes.ok) {
    return NextResponse.json(
      { error: webhookBody.error ?? "Webhook rejected payment" },
      { status: webhookRes.status },
    );
  }

  return NextResponse.json({
    ok: true,
    orderNumber: webhookBody.orderNumber,
    status: webhookBody.status,
    via: "webhook",
  });
}
