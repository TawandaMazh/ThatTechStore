import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

/** Placeholder listing — full catalog lands in Phase 2. */
export default async function ProductsPlaceholderPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;

  return (
    <Container className="py-16 sm:py-24">
      <SectionHeading
        title="Products coming in Phase 2"
        description={
          category
            ? `Category filter “${category}” is wired — catalog + Supabase land next.`
            : "The shop grid, filters, and product detail pages ship in Phase 2."
        }
      />
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/" variant="primary">
          Back home
        </Button>
        <Link
          href="/"
          className="inline-flex h-11 items-center text-sm text-text-muted hover:text-text"
        >
          Or keep browsing the home page
        </Link>
      </div>
    </Container>
  );
}
