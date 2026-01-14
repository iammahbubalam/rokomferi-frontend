"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllProducts, getCategoryTree } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Container } from "@/components/ui/Container";
import { Loader2, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, Category } from "@/types";

interface Filters {
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  sortBy: "newest" | "price_asc" | "price_desc" | "name";
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [0, 100000],
    inStock: false,
    sortBy: "newest",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoryTree] = await Promise.all([
          getAllProducts(),
          getCategoryTree(),
        ]);
        setProducts(productsData);
        // Flatten category tree for filter list
        const flatCategories = flattenCategories(categoryTree);
        setCategories(flatCategories);
      } catch (err) {
        console.error("Failed to fetch shop data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Flatten nested categories into flat list
  function flattenCategories(cats: Category[]): Category[] {
    let result: Category[] = [];
    for (const cat of cats) {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children));
      }
    }
    return result;
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        p.categories?.some((c) => filters.categories.includes(c.slug))
      );
    }

    // Price filter
    result = result.filter((p) => {
      const price = p.salePrice || p.basePrice;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // In stock filter
    if (filters.inStock) {
      result = result.filter((p) => p.stockStatus !== "out_of_stock");
    }

    // Sort
    switch (filters.sortBy) {
      case "price_asc":
        result.sort(
          (a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice)
        );
        break;
      case "price_desc":
        result.sort(
          (a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice)
        );
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        // Keep original order (backend returns newest first)
        break;
    }

    return result;
  }, [products, filters]);

  const toggleCategory = (slug: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(slug)
        ? prev.categories.filter((c) => c !== slug)
        : [...prev.categories, slug],
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 100000],
      inStock: false,
      sortBy: "newest",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.inStock ||
    filters.sortBy !== "newest";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Minimal Hero */}
      <section className="pt-32 pb-12 text-center">
        <Container>
          <span className="text-[10px] uppercase tracking-[0.3em] text-secondary/50 mb-4 block">
            Explore
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">
            Shop All
          </h1>
          <p className="text-secondary/60 max-w-md mx-auto">
            Discover our complete collection of heritage craftsmanship
          </p>
        </Container>
      </section>

      <Container className="pb-32">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-primary mb-4 font-medium">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        inStock: !prev.inStock,
                      }))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                    In Stock Only
                  </span>
                </label>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-primary mb-4 font-medium">
                  Sort By
                </h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-secondary focus:border-primary focus:ring-0"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs uppercase tracking-widest text-secondary/60 hover:text-primary transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <span className="text-sm text-secondary">
              {filteredProducts.length} products
            </span>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 text-sm text-primary"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-8">
              <span className="text-sm text-secondary/60">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-secondary/50 text-lg mb-4">
                  No products found
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-xl">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-primary mb-4 font-medium">
                    Categories
                  </h3>
                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(cat.slug)}
                          onChange={() => toggleCategory(cat.slug)}
                          className="w-4 h-4 rounded border-gray-300 text-primary"
                        />
                        <span className="text-sm text-secondary">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* In Stock */}
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        inStock: !prev.inStock,
                      }))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-primary"
                  />
                  <span className="text-sm text-secondary">In Stock Only</span>
                </label>

                {/* Sort */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-primary mb-4 font-medium">
                    Sort By
                  </h3>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-8 py-3 bg-primary text-white text-sm uppercase tracking-widest"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
