import { Hero } from "@/components/home/Hero";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { Philosophy } from "@/components/home/Philosophy";
import { getAllProducts, getHeroSlides } from "@/lib/data";

// This is now a Server Component!
export default async function Home() {
  console.log("Rendering Home Page (Server)");

  // Parallel Data Fetching
  const heroData = getHeroSlides();
  const productsData = getAllProducts();

  // Wait for all data
  const [slides, products] = await Promise.all([heroData, productsData]);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Pass fetched data to Client Components */}
      <Hero slides={slides} />
      <FeaturedCollection products={products} />
      <Philosophy />
    </div>
  );
}
