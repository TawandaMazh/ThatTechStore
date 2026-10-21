import { FlutterwavePaymentProvider } from "@/lib/payments/flutterwave";
import { MockPaymentProvider } from "@/lib/payments/mock";
import type { PaymentProvider } from "@/lib/payments/types";

export type {
  InitiatePaymentInput,
  InitiatePaymentResult,
  PaymentMethod,
  PaymentProvider,
  WebhookEvent,
} from "@/lib/payments/types";

export {
  ONLINE_PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProvider {
  const id = (process.env.PAYMENT_PROVIDER ?? "mock").toLowerCase();
  if (id === "flutterwave") {
    return new FlutterwavePaymentProvider();
  }
  return new MockPaymentProvider();
}
