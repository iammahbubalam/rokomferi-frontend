import { getAllProducts, getCategoryTree } from "@/lib/data";
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
  
  // Filter logic: Match exact category OR tags (for loose matching like 'new-arrivals')
  const products = allProducts.filter(p => {
    // 1. Direct Category Match (e.g. Sarees)
    if (p.category.toLowerCase().includes(slug.replace('-', ' '))) return true;
    
    // 2. Tag match (e.g. 'new-arrivals' might match 'new' tag?)
    // Actually, let's map 'new-arrivals' to 'new' or 'eid' tag for demo
    if (slug === 'new-arrivals' && p.tags?.some(t => ['eid', 'new'].includes(t))) return true;
    
    // 3. Subcategory match (naive check for now)
    // If slug is 'sarees-katan', we check if product category covers it or tags
    if (slug === 'sarees-katan' && p.name.toLowerCase().includes('katan')) return true;
    if (slug === 'sarees-jamdani' && p.name.toLowerCase().includes('jamdani')) return true;
    if (slug === 'kurtis' && p.category === 'Kurtis') return true;
    if (slug === 'salwar-kameez' && p.category === 'Salwar Kameez') return true;

    return false;
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
           <FilterSidebar />
           
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
