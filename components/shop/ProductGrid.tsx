import { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 rounded-lg">
        <p className="text-lg font-serif text-primary mb-2">
          No products found
        </p>
        <p className="text-sm text-secondary/60">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          priority={index < 4} // LCP Boost for first row
        />
      ))}
    </div>
  );
}
