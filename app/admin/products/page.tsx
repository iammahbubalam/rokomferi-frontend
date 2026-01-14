"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Product, Category } from "@/types";
import { getApiUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filter State
  const [filters, setFilters] = useState({
    limit: 20,
    page: 1,
    sort: "created_at desc",
    search: "",
    category: "",
    isActive: "", // "true", "false", ""
  });

  // Fetch Categories for Filter Dropdown
  useEffect(() => {
    fetch(getApiUrl("/categories/tree"))
      .then((res) => res.json())
      .then((data) => setCategories(data || []))
      .catch((err) => console.error(err));
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", filters.limit.toString());
      params.append("page", filters.page.toString());
      params.append("sort", filters.sort);
      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category); // Slug expected
      if (filters.isActive) params.append("isActive", filters.isActive);

      // Use the NEW Admin List Endpoint
      const token = localStorage.getItem("token");
      const res = await fetch(
        getApiUrl(`/admin/products?${params.toString()}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data.data || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Reset selection on filter change
  useEffect(() => {
    setSelectedIds([]);
  }, [filters, products]);

  // Handlers
  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all on current page
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedIds.length} products?`
      )
    )
      return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Execute in parallel
      await Promise.all(
        selectedIds.map((id) =>
          fetch(getApiUrl(`/admin/products/${id}`), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      fetchProducts(); // Refresh
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk delete failed", error);
      alert("Some delete operations failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDeactivate = async () => {
    setIsLoading(true);
    // Optimistic Bulk Update
    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.includes(p.id) ? { ...p, isActive: false } : p
      )
    );

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedIds.map(async (id) => {
          await fetch(getApiUrl(`/admin/products/${id}/status`), {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive: false }),
          });
        })
      );

      setSelectedIds([]);
      // No fetchProducts needed for success path
    } catch (error) {
      console.error("Bulk deactivate failed", error);
      alert("Bulk update failed");
      fetchProducts(); // Revert/Refresh on error
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handlePageChange = (newPage: number) => {
    // Simple next/prev logic
    const current = filters.page;
    const next = current + newPage;
    if (next < 1) return;
    setFilters((prev) => ({ ...prev, page: next }));
  };

  const handleSearch = (term: string) => {
    setFilters((prev) => ({ ...prev, search: term, page: 1 }));
  };

  const handleSort = (field: string) => {
    // Toggle logic
    let direction = "asc";
    if (filters.sort.startsWith(field) && filters.sort.endsWith("asc")) {
      direction = "desc";
    }
    setFilters((prev) => ({ ...prev, sort: `${field}_${direction}` }));
  };

  const handleFilterCategory = (catId: string) => {
    // We have ID, backend expects Slug?
    // Wait, ProductTable passes ID.
    // We need to find slug from categories tree.
    // Or updated backend logic. Our Backend Repo expects SLUG.
    // Function to find slug by ID in tree
    const findSlug = (cats: Category[], id: string): string => {
      for (const c of cats) {
        if (c.id === id) return c.slug;
        if (c.children) {
          const found = findSlug(c.children, id);
          if (found) return found;
        }
      }
      return "";
    };

    const slug = catId ? findSlug(categories, catId) : "";
    setFilters((prev) => ({ ...prev, category: slug, page: 1 }));
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    // Optimistic Update
    const newStatus = !currentStatus;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p))
    );

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl(`/admin/products/${id}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      // No refetch needed
    } catch (error) {
      console.error("Failed to toggle status", error);
      alert("Failed to update status");
      // Revert on failure
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: currentStatus } : p))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl(`/admin/products/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-2 bg-primary/5 border border-primary/20 rounded-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-primary ml-2">
            {selectedIds.length} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline-white"
              size="sm"
              className="text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400 bg-white"
              onClick={handleBulkDeactivate}
            >
              Set Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white border-transparent"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <ProductTable
        products={products}
        total={total}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onSort={handleSort}
        onFilterCategory={handleFilterCategory}
        categories={categories}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        selectedIds={selectedIds}
        onSelectOne={handleSelectOne}
        onSelectAll={handleSelectAll}
      />
    </div>
  );
}
