import { Category, Product } from "@/types";
import { getApiUrl } from "@/lib/utils";

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(getApiUrl(`/categories/slug/${slug}`), { 
      cache: 'no-store' 
    });
    
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return null;
  }
}

/**
 * Fetch products for a specific category with filters
 */
export async function getCategoryProducts(
  slug: string,
  filters?: ProductFilters
): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    params.set('category', slug);
    
    if (filters?.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters?.inStock !== undefined) params.set('inStock', filters.inStock.toString());
    if (filters?.sort) params.set('sort', filters.sort);
    
    const res = await fetch(getApiUrl(`/products?${params.toString()}`), {
      cache: 'no-store'
    });
    
    if (res.ok) {
      const data = await res.json();
      return data.products || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch category products:', error);
    return [];
  }
}

/**
 * Fetch all categories in a flat structure (including hidden ones)
 */
export async function getAllCategoriesFlat(): Promise<Category[]> {
  try {
    const res = await fetch(getApiUrl('/categories/tree'), {
      cache: 'no-store'
    });
    
    if (res.ok) {
      const tree: Category[] = await res.json();
      // Flatten the tree
      const flatten = (nodes: Category[]): Category[] => {
        return nodes.reduce((acc, node) => {
          acc.push(node);
          if (node.children?.length) {
            acc.push(...flatten(node.children));
          }
          return acc;
        }, [] as Category[]);
      };
      return flatten(tree);
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}
