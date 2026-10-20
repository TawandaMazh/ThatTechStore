import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductSpecsList } from "@/components/product/product-specs";
import { PhoneUnitInfo } from "@/components/product/phone-unit-info";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { AskQuestionButton } from "@/components/product/ask-question";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/motion/reveal";
import { getProductBySlug } from "@/lib/catalog/queries";
import { formatZmw } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);
  if (!product) return { title: "Product | ThatTechStore" };
  return {
    title: `${product.name} | ThatTechStore`,
    description: product.problemSolved || product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);
  if (!product) notFound();

  const inStock = product.stockQty > 0;
  const isPhone = product.category === "phones";

  return (
    <Container className="py-10 sm:py-14">
      <nav className="mb-6 text-sm text-text-muted">
        <Link href="/products" className="hover:text-text">
          Shop
        </Link>
        <span className="mx-2 text-text-subtle">/</span>
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-text"
        >
          {product.category.replace("-", " ")}
        </Link>
        <span className="mx-2 text-text-subtle">/</span>
        <span className="text-text">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <ProductGallery name={product.name} images={product.images} />
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-subtle">
              {product.category.replace("-", " ")}
              {product.badge ? ` · ${product.badge}` : ""}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 font-display text-2xl font-semibold text-accent">
              {formatZmw(product.priceZmw)}
            </p>
            <p className="mt-2 text-sm text-text-muted">
              {inStock
                ? `${product.stockQty} in stock · Delivery across all Lusaka areas`
                : "Currently out of stock"}
            </p>

            <div className="mt-6 rounded-[var(--radius-lg)] border border-accent/30 bg-accent-muted/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-accent">
                What problem it solves
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-text">
                {product.problemSolved}
              </p>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-text-muted">
              {product.description}
            </p>

            <div className="mt-6">
              <PhoneUnitInfo units={product.units} isPhone={isPhone} />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AddToCartButton product={product} disabled={!inStock} />
              <AskQuestionButton />
            </div>
          </div>
        </Reveal>
      </div>

      <section className="mt-14" aria-labelledby="specs-heading">
        <h2
          id="specs-heading"
          className="font-display text-xl font-semibold text-text"
        >
          Specs
        </h2>
        <div className="mt-4">
          <ProductSpecsList specs={product.specs} />
        </div>
      </section>

      {product.reviews.length ? (
        <section className="mt-14" aria-labelledby="reviews-heading">
          <h2
            id="reviews-heading"
            className="font-display text-xl font-semibold text-text"
          >
            Customer notes
          </h2>
          <ul className="mt-4 space-y-4">
            {product.reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-[var(--radius-lg)] border border-border bg-surface p-4"
              >
                <p className="text-sm font-medium text-text">
                  {review.author}{" "}
                  <span className="text-text-subtle">
                    · {review.location} · {"★".repeat(review.rating)}
                  </span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {review.body}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {product.related.length ? (
        <section className="mt-14" aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="font-display text-xl font-semibold text-text"
          >
            Related products
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {product.related.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
