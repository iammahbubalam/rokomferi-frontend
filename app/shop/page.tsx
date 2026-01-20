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
      {/* Elegant Hero with Background */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/shop-hero.png')`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <span className="inline-block text-[11px] uppercase tracking-[0.4em] text-white/70 mb-6 border border-white/30 px-4 py-2">
            Curated Collection
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            Shop All
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-base md:text-lg leading-relaxed font-light">
            Discover our complete collection of heritage craftsmanship — where
            tradition meets contemporary elegance.
          </p>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#faf9f7] to-transparent" />
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
