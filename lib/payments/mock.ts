import type {
  InitiatePaymentInput,
  InitiatePaymentResult,
  PaymentProvider,
  WebhookEvent,
} from "@/lib/payments/types";
import { PAYMENT_METHOD_LABELS } from "@/lib/payments/types";

/**
 * Mock provider shaped for later Flutterwave swap.
 * Online methods redirect to `/pay/mock/[ref]`; COD stays immediate.
 * Completing mock pay posts to `/api/payments/webhook` (server trust source).
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly id = "mock";

  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    if (input.method === "cod") {
      return {
        provider: this.id,
        paymentRef: input.paymentRef,
        checkoutUrl: null,
        immediate: true,
        message:
          "Pay cash to the rider on delivery. Your order is confirmed as pending payment.",
      };
    }

    const label = PAYMENT_METHOD_LABELS[input.method];
    const url = new URL(`/pay/mock/${encodeURIComponent(input.paymentRef)}`, input.siteUrl);
    url.searchParams.set("method", input.method);
    url.searchParams.set("order", input.orderNumber);
    url.searchParams.set("amount", String(input.amountZmw));

    return {
      provider: this.id,
      paymentRef: input.paymentRef,
      checkoutUrl: url.toString(),
      immediate: false,
      message: `Complete ${label} payment on the next screen (mock).`,
    };
  }

  async parseWebhook(
    body: unknown,
    headers: Headers,
  ): Promise<WebhookEvent | null> {
    const secret = process.env.MOCK_WEBHOOK_SECRET;
    const headerSecret =
      headers.get("x-mock-webhook-secret") ??
      headers.get("x-webhook-secret");

    if (!secret || headerSecret !== secret) {
      return null;
    }

    if (!body || typeof body !== "object") return null;
    const data = body as Record<string, unknown>;
    const paymentRef =
      typeof data.payment_ref === "string"
        ? data.payment_ref
        : typeof data.provider_ref === "string"
          ? data.provider_ref
          : null;
    if (!paymentRef) return null;

    const statusRaw = typeof data.status === "string" ? data.status : "";
    const status =
      statusRaw === "succeeded" || statusRaw === "successful"
        ? "succeeded"
        : statusRaw === "failed"
          ? "failed"
          : null;
    if (!status) return null;

    return {
      provider: this.id,
      paymentRef,
      status,
      raw: data,
    };
  }
}
