import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrackForm } from "@/components/track/track-form";

export const metadata = {
  title: "Track order | ThatTechStore",
  description:
    "Track your ThatTechStore order with order number and phone — Pending → Paid → Out for delivery → Delivered.",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; phone?: string }>;
}) {
  const sp = await searchParams;

  return (
    <Container className="py-10 sm:py-14">
      <SectionHeading
        title="Track order"
        description="Enter your order number and the phone you used at checkout."
      />
      <div className="mt-8">
        <TrackForm
          initialOrderNumber={sp.order ?? ""}
          initialPhone={sp.phone ?? ""}
        />
      </div>
    </Container>
  );
}
