import { getAllProducts } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Shop All | Rokomferi",
  description: "Browse our complete collection of heritage wear."
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-primary text-primary">
      <Container>
        <div className="py-12 md:py-20 border-b border-primary/10 mb-12">
           <span className="text-sm uppercase tracking-[0.2em] text-secondary">Catalog</span>
           <h1 className="font-serif text-4xl md:text-6xl text-primary mt-4">All Collections</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}
