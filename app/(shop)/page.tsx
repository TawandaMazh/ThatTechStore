import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { BestSellers } from "@/components/home/best-sellers";
import { Trust } from "@/components/home/trust";
import { Reviews } from "@/components/home/reviews";
import { getSeasonHero } from "@/lib/seasons";
import { siteSettings } from "@/lib/mock/site-settings";
import { reviews } from "@/lib/mock/reviews";
import { getFeaturedProducts, listCategories } from "@/lib/catalog/queries";

export default async function HomePage() {
  const hero = getSeasonHero(siteSettings, new Date());
  const [{ categories }, { products }] = await Promise.all([
    listCategories(),
    getFeaturedProducts(6),
  ]);

  return (
    <>
      <Hero hero={hero} />
      <Categories categories={categories} />
      <BestSellers products={products} />
      <Trust />
      <Reviews reviews={reviews} />
    </>
  );
}
