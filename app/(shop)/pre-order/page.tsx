import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PreorderList } from "@/components/preorder/preorder-list";
import { listPreorderProducts } from "@/lib/catalog/queries";

export const metadata = {
  title: "Pre-order | ThatTechStore",
  description:
    "Reserve items arriving on the next Dubai shipment with a deposit.",
};

export default async function PreorderPage() {
  const products = await listPreorderProducts();

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        title="Pre-order"
        description="Items arriving on the next shipment. Pay a deposit now; settle the balance when they land in Lusaka."
      />
      <div className="mt-8">
        <PreorderList products={products} />
      </div>
    </Container>
  );
}
