import { HeroCinematic } from "@/components/home/HeroCinematic";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { MasonryCategories } from "@/components/home/MasonryCategories";

import {
  getFeaturedProducts,
  getFeaturedCategories,
  getHeroSlides,
} from "@/lib/data";

// This is now a Server Component!
export default async function Home() {
  console.log("Rendering Home Page (Server)");

  // Parallel Data Fetching
  // Parallel Data Fetching
  const heroData = getHeroSlides();
  const productsData = getFeaturedProducts();
  const categoriesData = getFeaturedCategories();

  // Wait for all data
  const [slides, products, categories] = await Promise.all([
    heroData,
    productsData,
    categoriesData,
  ]);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Cinematic Hero split screen with Marquee */}
      <HeroCinematic slides={slides} />

      {/* Asymmetrical Editorial Grid */}
      <MasonryCategories categories={categories} />

      {/* Dark Mode Horizontal Scroll Collection */}
      <FeaturedCollection products={products} />
    </div>
  );
}
