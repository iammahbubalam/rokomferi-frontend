import { Hero } from "@/components/home/Hero";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { Philosophy } from "@/components/home/Philosophy";
import { CategoryGrid } from "@/components/home/CategoryGrid";

import { getAllProducts, getFeaturedCategories, getHeroSlides, getPhilosophyContent, getEditorialContent } from "@/lib/data";
import { EditorialSpotlight } from "@/components/home/EditorialSpotlight";

// This is now a Server Component!
export default async function Home() {
  console.log("Rendering Home Page (Server)");

  // Parallel Data Fetching
  const heroData = getHeroSlides();
  const productsData = getAllProducts();
  const categoriesData = getFeaturedCategories();
  const philosophyData = getPhilosophyContent();
  const editorialData = getEditorialContent();

  // Wait for all data
  const [slides, products, categories, philosophyContent, editorialContent] = await Promise.all([
    heroData, 
    productsData, 
    categoriesData,
    philosophyData,
    editorialData
  ]);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Pass fetched data to Client Components */}
      <Hero slides={slides} />
      <FeaturedCollection products={products} />
      <CategoryGrid categories={categories} />
      <EditorialSpotlight content={editorialContent} />
      <Philosophy content={philosophyContent} />

    </div>
  );
}
