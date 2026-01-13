'use client';

import { use } from 'react';
import { useCategory } from '@/hooks/useCategory';
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { CategorySidebar } from '@/components/category/CategorySidebar';
import { CategoryGrid } from '@/components/category/CategoryGrid';
import { Container } from '@/components/ui/Container';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  // Unwrap async params using React.use()
  const { slug } = use(params);

  // Use the category hook for all data management
  const {
    category,
    products,
    allCategories,
    breadcrumbs,
    isLoading,
    error,
    filters,
    setFilters
  } = useCategory(slug);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !category) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <CategoryHeader 
        category={category}
        breadcrumbs={breadcrumbs}
        productCount={products.length}
      />

      {/* Main Content */}
      <Container className="py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <CategorySidebar
            categories={allCategories}
            activeCategory={category}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Product Grid */}
          <div className="flex-1">
            <CategoryGrid 
              products={products}
              isLoading={isLoading}
            />
          </div>

        </div>
      </Container>
    </div>
  );
}

