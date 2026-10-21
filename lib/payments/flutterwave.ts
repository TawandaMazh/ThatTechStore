import type {
  InitiatePaymentInput,
  InitiatePaymentResult,
  PaymentProvider,
  WebhookEvent,
} from "@/lib/payments/types";

/**
 * Placeholder for Phase 6. Same interface as MockPaymentProvider.
 * Do not put real Flutterwave keys in the repo yet.
 */
export class FlutterwavePaymentProvider implements PaymentProvider {
  readonly id = "flutterwave";

  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    void input;
    throw new Error(
      "Flutterwave provider is not configured yet. Use PAYMENT_PROVIDER=mock.",
    );
  }

  async parseWebhook(
    body: unknown,
    headers: Headers,
  ): Promise<WebhookEvent | null> {
    void body;
    void headers;
    throw new Error(
      "Flutterwave provider is not configured yet. Use PAYMENT_PROVIDER=mock.",
    );
  }
}
