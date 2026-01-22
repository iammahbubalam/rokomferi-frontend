import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryDetails, getCategoryProducts } from "@/lib/api/categories";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryHero } from "@/components/category/CategoryHero";
import { ChevronDown, Filter, LayoutGrid, LayoutList } from "lucide-react";
import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

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
    title: category.metaTitle || category.name,
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

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: category.name, url: `/category/${category.slug}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbSchema items={breadcrumbs} />
      <CategoryHero category={category} productCount={products.length} />

      {/* Toolbar - Sticky */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/5 py-4 transition-all duration-300">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-secondary">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-black/20">/</span>
            <span className="text-primary font-medium">{category.name}</span>
          </div>

          <div className="flex items-center gap-8 text-xs uppercase tracking-widest text-primary">
            <span className="hidden md:inline-block text-secondary">
              {products.length} Products
            </span>

            <div className="flex items-center gap-6">
              {/* Visual Only Sort/Filter for now */}
              <button className="flex items-center gap-2 hover:text-accent-gold transition-colors">
                Sort
                <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-2 hover:text-accent-gold transition-colors">
                Filter
                <Filter className="w-3 h-3" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Products Section */}
      <section className="py-12 md:py-20 lg:py-24">
        <Container>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-[1px] bg-black/10 mb-8" />
              <p className="text-secondary text-sm tracking-[0.2em] uppercase mb-4">
                Collection Coming Soon
              </p>
              <p className="text-secondary/60 text-sm max-w-md font-light leading-relaxed">
                We are curating specific pieces for this collection. Please
                check back later.
              </p>
              <Link
                href="/shop"
                className="mt-8 text-xs uppercase tracking-widest border-b border-primary pb-1 hover:border-accent-gold hover:text-accent-gold transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
