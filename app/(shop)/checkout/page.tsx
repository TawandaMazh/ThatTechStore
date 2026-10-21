import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout | ThatTechStore",
  description:
    "Checkout with Lusaka delivery, MoMo / Airtel / Zamtel / card, or pay on delivery.",
};

export default function CheckoutPage() {
  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        title="Checkout"
        description="Delivery across all Lusaka areas. Choose MoMo, Airtel Money, Zamtel Kwacha, card, or pay on delivery."
      />
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </Container>
  );
}
