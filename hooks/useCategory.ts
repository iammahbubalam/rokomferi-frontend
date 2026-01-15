import { useState, useEffect } from "react";
import { Category, Product } from "@/types";
import { getCategoryProducts, ProductFilters } from "@/lib/api/categories";
import { getAllActiveCategories } from "@/lib/data";
import {
  findCategoryBySlug,
  buildBreadcrumbs,
  Breadcrumb,
} from "@/lib/category-utils";

export interface UseCategoryResult {
  category: Category | null;
  products: Product[];
  allCategories: Category[];
  breadcrumbs: Breadcrumb[];
  isLoading: boolean;
  error: Error | null;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
}

/**
 * Hook for managing category page data and state
 */
export function useCategory(slug: string): UseCategoryResult {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all active categories (not just showInNav)
        const tree = await getAllActiveCategories();
        setAllCategories(tree);

        // Find the target category
        const foundCategory = findCategoryBySlug(slug, tree);

        if (!foundCategory) {
          throw new Error(`Category with slug "${slug}" not found`);
        }

        setCategory(foundCategory);

        // Build breadcrumbs
        const crumbs = buildBreadcrumbs(foundCategory.id, tree);
        setBreadcrumbs(crumbs);

        // Fetch products for this category
        const categoryProducts = await getCategoryProducts(slug, filters);
        setProducts(categoryProducts);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load category")
        );
        console.error("Category fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slug, filters]);

  return {
    category,
    products,
    allCategories,
    breadcrumbs,
    isLoading,
    error,
    filters,
    setFilters,
  };
}
