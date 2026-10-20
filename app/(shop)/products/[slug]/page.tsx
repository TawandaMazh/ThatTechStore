import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { bestSellers } from "@/lib/mock/products";

export default async function ProductPlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = bestSellers.find((p) => p.slug === slug);

  return (
    <Container className="py-16 sm:py-24">
      <SectionHeading
        title={product?.name ?? "Product"}
        description={
          product
            ? `${product.name} detail page ships in Phase 2. Price shown on home: mock catalog only.`
            : `Slug “${slug}” — full product detail pages arrive in Phase 2.`
        }
      />
      <div className="mt-8">
        <Button href="/" variant="primary">
          Back home
        </Button>
      </div>
    </Container>
  );
}
