import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { getAllCategoriesFlat } from "@/lib/api/categories";
import { getShopProducts, ShopParams } from "@/lib/api/shop";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "Shop All | Rokomferi",
  description: "Explore the latest collection of premium ethnic wear.",
};

interface ShopPageProps {
  searchParams: Promise<ShopParams>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const [categories, { products, pagination }] = await Promise.all([
    getAllCategoriesFlat(),
    getShopProducts(params),
  ]);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero with Left-Aligned Content */}
      <section className="relative h-[35vh] min-h-[280px] max-h-[400px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-right bg-no-repeat"
          style={{
            backgroundImage: `url('/images/shop-hero.png')`,
          }}
        />
        {/* Strong Left Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />

        {/* Content - Left Aligned */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="max-w-md">
              <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3 font-semibold">
                Curated Collection
              </span>
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-[1.1]">
                Shop All
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Explore our complete heritage collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Container className="py-12 md:py-16">
        {/* Floating Filter Bar (replaces sidebar) */}
        <FilterSidebar categories={categories} />

        {/* Product Grid - Full Width Now */}
        <Suspense
          fallback={
            <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />
          }
        >
          <ProductGrid products={products} />
        </Suspense>

        {/* Pagination */}
        <div className="mt-12">
          <Pagination totalPages={pagination.totalPages} />
        </div>

        {/* Summary */}
        <div className="text-center text-xs text-secondary/40 font-medium uppercase tracking-widest mt-4">
          Showing {products.length} of {pagination.total} Products
        </div>
      </Container>
    </div>
  );
}
