import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { CartView } from "@/components/cart/cart-view";

export const metadata = {
  title: "Cart | ThatTechStore",
  description: "Your ThatTechStore cart — delivery across all Lusaka areas.",
};

export default function CartPage() {
  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        title="Cart"
        description="Saved on this device. Delivery across all Lusaka areas."
      />
      <div className="mt-8">
        <CartView />
      </div>
    </Container>
  );
}
