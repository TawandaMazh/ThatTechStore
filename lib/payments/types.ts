import type { PaymentMethod } from "@/types";

export type { PaymentMethod };

export interface InitiatePaymentInput {
  orderNumber: string;
  paymentRef: string;
  amountZmw: number;
  method: PaymentMethod;
  customerName: string;
  customerPhone: string;
  /** Absolute site origin, e.g. http://localhost:3000 */
  siteUrl: string;
}

export interface InitiatePaymentResult {
  provider: string;
  paymentRef: string;
  /** Where the customer should go to complete payment (mock checkout URL). */
  checkoutUrl: string | null;
  /** COD and similar: no redirect. */
  immediate: boolean;
  message: string;
}

export interface WebhookEvent {
  provider: string;
  paymentRef: string;
  status: "succeeded" | "failed";
  raw: Record<string, unknown>;
}

/**
 * Clean payment provider interface.
 * Mock now; Flutterwave (or another gateway) later without rewriting checkout.
 */
export interface PaymentProvider {
  readonly id: string;
  initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult>;
  /**
   * Parse an inbound webhook body into a normalised event.
   * Confirmation of “paid” must go through the webhook route — never trust the client UI alone.
   */
  parseWebhook(
    body: unknown,
    headers: Headers,
  ): Promise<WebhookEvent | null>;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mtn_momo: "MTN MoMo",
  airtel: "Airtel Money",
  zamtel: "Zamtel Kwacha",
  card: "Card",
  cod: "Pay on delivery",
};

export const ONLINE_PAYMENT_METHODS: PaymentMethod[] = [
  "mtn_momo",
  "airtel",
  "zamtel",
  "card",
];
