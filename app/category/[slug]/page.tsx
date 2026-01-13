import { Suspense } from "react";
import { getAllProducts, getCategoryTree, getFilterMetadata } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Container } from "@/components/ui/Container";
import { CollectionHero } from "@/components/shop/CollectionHero";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Helper to find category name in tree
function findCategoryName(slug: string, nodes: any[]): string | null {
  for (const node of nodes) {
    if (node.slug === slug) return node.name;
    if (node.children) {
      const found = findCategoryName(slug, node.children);
      if (found) return found;
    }
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tree = await getCategoryTree();
  const name = findCategoryName(slug, tree) || slug.replace('-', ' ');
  
  return {
    title: `${name} | Rokomferi`,
    description: `Shop our exclusive ${name} collection.`
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // In a real app, we'd have a specific API for this. 
  // For now, filtering the mock data manually.
  const allProducts = await getAllProducts();
  const tree = await getCategoryTree();
  const categoryName = findCategoryName(slug, tree) || "Collection";
  const filterMetadata = await getFilterMetadata(slug);
  
  // Filter logic: Match category slug or name
  const products = allProducts.filter(p => {
    return p.categories?.some(c => 
      c.slug === slug || 
      c.name.toLowerCase() === slug.replace(/-/g, ' ') ||
      c.name.toLowerCase().includes(slug.replace(/-/g, ' '))
    );
  });

  return (
    <div className="min-h-screen bg-bg-primary text-primary">
       
       <CollectionHero 
         title={categoryName}
         description={`Explore our curated selection of ${categoryName}, defined by tradition and craftsmanship.`}
         image="/assets/eid-hero.png" // Fallback or dynamic based on category if available
       />

      <Container className="py-20">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
           {/* Sidebar */}
           <Suspense fallback={<div className="w-full md:w-64 h-96 animate-pulse bg-gray-100/50 rounded-lg"/>}>
             <FilterSidebar metadata={filterMetadata} />
           </Suspense>
           
           {/* Grid */}
           <div className="flex-1">
             {products.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                 {products.map((product, i) => (
                   <ProductCard key={product.id} product={product} index={i} />
                 ))}
               </div>
             ) : (
               <div className="py-20 text-center text-secondary font-light">
                 <p>We are currently restocking this collection. Please check back soon.</p>
               </div>
             )}
           </div>
        </div>
      </Container>
    </div>
  );
}
