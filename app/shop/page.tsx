import { getAllProducts } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Container } from "@/components/ui/Container";
import { CollectionHero } from "@/components/shop/CollectionHero";
import { FilterSidebar } from "@/components/shop/FilterSidebar";

export const metadata = {
  title: "Shop All | Rokomferi",
  description: "Browse our complete collection of heritage wear."
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-bg-primary text-primary">
      {/* 1. Editoral Hero */}
      <CollectionHero 
        title="Shop All" 
        description="Explore our complete collection of heritage and craftsmanship."
        image="/assets/eid-hero.png"
      />

      <Container className="py-20">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
           
           {/* 2. Sidebar Navigation */}
           <FilterSidebar />

           {/* 3. Product Grid */}
           <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
              
              {/* Pagination / Load More (Visual only for now) */}
              <div className="mt-20 flex justify-center">
                 <span className="text-xs text-secondary/40 uppercase tracking-widest">End of Collection</span>
              </div>
           </div>
        </div>
      </Container>
    </div>
  );
}
