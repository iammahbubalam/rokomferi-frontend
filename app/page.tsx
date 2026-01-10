import { Hero } from "@/components/home/Hero";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { Philosophy } from "@/components/home/Philosophy";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { getAllProducts, getFeaturedCategories, getHeroSlides } from "@/lib/data";

// This is now a Server Component!
export default async function Home() {
  console.log("Rendering Home Page (Server)");

  // Parallel Data Fetching
  const heroData = getHeroSlides();
  const productsData = getAllProducts();
  const categoriesData = getFeaturedCategories();

  // Wait for all data
  const [slides, products, categories] = await Promise.all([heroData, productsData, categoriesData]);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Pass fetched data to Client Components */}
      <Hero slides={slides} />
      <FeaturedCollection products={products} />
      <CategoryGrid categories={categories} />
      <Philosophy />
      <Newsletter />
    </div>
  );
}
