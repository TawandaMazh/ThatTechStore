import { Container } from "@/components/ui/container";
import { MockPayClient } from "@/components/pay/mock-pay-client";
import type { PaymentMethod } from "@/types";

export const metadata = {
  title: "Mock payment | ThatTechStore",
  robots: { index: false, follow: false },
};

const METHODS: PaymentMethod[] = [
  "mtn_momo",
  "airtel",
  "zamtel",
  "card",
  "cod",
];

export default async function MockPayPage({
  params,
  searchParams,
}: {
  params: Promise<{ paymentRef: string }>;
  searchParams: Promise<{ method?: string; order?: string; amount?: string }>;
}) {
  const { paymentRef: rawRef } = await params;
  const sp = await searchParams;
  const paymentRef = decodeURIComponent(rawRef);
  const method = METHODS.includes(sp.method as PaymentMethod)
    ? (sp.method as PaymentMethod)
    : "mtn_momo";
  const orderNumber = sp.order ?? "—";
  const amountZmw = Number(sp.amount ?? 0) || 0;

  return (
    <Container className="py-10 sm:py-16">
      <MockPayClient
        paymentRef={paymentRef}
        orderNumber={orderNumber}
        method={method}
        amountZmw={amountZmw}
      />
    </Container>
  );
}
