import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { BestSellers } from "@/components/home/best-sellers";
import { Trust } from "@/components/home/trust";
import { Reviews } from "@/components/home/reviews";
import { getSeasonHero } from "@/lib/seasons";
import { siteSettings } from "@/lib/mock/site-settings";
import { categories } from "@/lib/mock/categories";
import { bestSellers } from "@/lib/mock/products";
import { reviews } from "@/lib/mock/reviews";

export default function HomePage() {
  const hero = getSeasonHero(siteSettings, new Date());

  return (
    <>
      <Hero hero={hero} />
      <Categories categories={categories} />
      <BestSellers products={bestSellers} />
      <Trust />
      <Reviews reviews={reviews} />
    </>
  );
}
