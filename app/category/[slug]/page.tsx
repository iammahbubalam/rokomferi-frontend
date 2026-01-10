import { getAllProducts, getCategoryTree } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Container } from "@/components/ui/Container";
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
    <div className="min-h-screen pt-24 pb-20 bg-bg-primary text-primary">
      <Container>
        {/* Header */}
        <div className="py-12 md:py-20 border-b border-primary/10 mb-12">
           <span className="text-sm uppercase tracking-[0.2em] text-secondary">Shop Category</span>
           <h1 className="font-serif text-4xl md:text-6xl text-primary mt-4 capitalize">{categoryName}</h1>
           <p className="mt-4 text-secondary/80 max-w-md font-light">
             Explore our curated selection of {categoryName}, defined by tradition and craftsmanship.
           </p>
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-secondary font-light">
            <p>We are currently restocking this collection. Please check back soon.</p>
          </div>
        )}
      </Container>
    </div>
  );
}
