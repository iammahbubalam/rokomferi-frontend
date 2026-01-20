import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryDetails, getCategoryProducts } from "@/lib/api/categories";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryHero } from "@/components/category/CategoryHero";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryDetails(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: category.name,
    description:
      category.metaDescription ||
      `Shop the latest ${category.name} collection.`,
    openGraph: {
      images: category.image ? [category.image] : [],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Parallel Fetching
  const [category, products] = await Promise.all([
    getCategoryDetails(slug),
    getCategoryProducts(slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <CategoryHero category={category} productCount={products.length} />

      {/* Products Section */}
      <section className="py-24 md:py-32 bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                // Optional: Pass priority to first few items for LCP
                priority={index < 4}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-32">
              <p className="text-secondary/40 text-sm tracking-widest uppercase">
                Coming Soon
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
