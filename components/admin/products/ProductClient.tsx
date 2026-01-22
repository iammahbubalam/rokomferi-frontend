"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Product, Category } from "@/types";
import { getApiUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDialog } from "@/context/DialogContext";
import { useQueryClient } from "@tanstack/react-query";
import { ProductStats as ProductStatsType } from "@/types";
import { ProductStats } from "@/components/admin/products/ProductStats";

interface ProductClientProps {
  initialProducts: Product[];
  initialTotal: number;
  categories: Category[];
}

export function ProductClient({
  initialProducts,
  initialTotal,
  categories,
}: ProductClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialog = useDialog();
  // We can use useQueryClient to invalidate cache if we were using useQuery,
  // currently we rely on router.refresh() for Server Components data.

  // Local state for selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // We don't need isLoading state for initial load anymore!
  // But we might want it for transition.
  const [isPending, setIsPending] = useState(false);
  const [stats, setStats] = useState<ProductStatsType | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl("/admin/products/stats"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch product stats:", error);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Sync selection reset when data changes?
  useEffect(() => {
    // Optional: Reset selection when page changes
    // setSelectedIds([]);
  }, [searchParams]);

  // URL Helper
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  // Handlers adapted to URL state
  const handlePageChange = (newPageOffset: number) => {
    const currentPage = Number(searchParams.get("page")) || 1;
    const nextPage = currentPage + newPageOffset;
    if (nextPage < 1) return;

    router.push(
      pathname + "?" + createQueryString("page", nextPage.toString()),
    );
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
      params.set("page", "1"); // Reset page
    } else {
      params.delete("search");
    }
    router.push(pathname + "?" + params.toString());
  };

  const handleSort = (field: string) => {
    // Logic from previous: toggle asc/desc
    const currentSort = searchParams.get("sort") || "created_at desc";
    let direction = "asc";
    if (currentSort.startsWith(field) && currentSort.endsWith("asc")) {
      direction = "desc";
    }
    const newSort = `${field}_${direction}`;
    router.push(pathname + "?" + createQueryString("sort", newSort));
  };

  const handleFilterCategory = (catId: string) => {
    // Find the slug from the ID since backend filters by slug usually
    // But wait, the original code looked up slug.
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
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
      params.set("page", "1");
    } else {
      params.delete("category");
    }
    router.push(pathname + "?" + params.toString());
  };

  const handleFilterStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status && status !== "all") {
      params.set("isActive", status); // "true" or "false"
      params.set("page", "1");
    } else {
      params.delete("isActive");
    }
    router.push(pathname + "?" + params.toString());
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    // Optimistic UI could be handled by local state override if complex,
    // but here we just wait for server refresh or use router.refresh

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

      if (!res.ok) throw new Error("Failed to update status");

      // Optimistic Update for KPIs
      if (stats) {
        setStats({
          ...stats,
          activeProducts: newStatus
            ? stats.activeProducts + 1
            : stats.activeProducts - 1,
          inactiveProducts: newStatus
            ? stats.inactiveProducts - 1
            : stats.inactiveProducts + 1,
        });
      }

      dialog.toast({ message: "Status updated", variant: "success" });
      fetchStats();
      router.refresh();
    } catch (error) {
      console.error(error);
      dialog.toast({ message: "Failed to update status", variant: "danger" });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await dialog.confirm({
      title: "Delete Product",
      message: "Are you sure? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl(`/admin/products/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      // Optimistic Update for KPIs (we don't know the status/stock easily here, so we refresh)
      // Actually, for single delete, we can decrement total at least.
      if (stats) {
        setStats({
          ...stats,
          totalProducts: stats.totalProducts - 1,
        });
      }

      dialog.toast({ message: "Product deleted", variant: "success" });
      fetchStats();
      router.refresh();
    } catch (error) {
      console.error(error);
      dialog.toast({ message: "Failed to delete product", variant: "danger" });
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = await dialog.confirm({
      title: `Delete ${selectedIds.length} Products`,
      message: "Are you sure? This action cannot be undone.",
      confirmText: "Delete All",
      variant: "danger",
    });
    if (!confirmed) return;

    setIsPending(true);
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedIds.map((id) =>
          fetch(getApiUrl(`/admin/products/${id}`), {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );

      // Optimistic Update for KPIs
      if (stats) {
        setStats({
          ...stats,
          totalProducts: stats.totalProducts - selectedIds.length,
        });
      }

      dialog.toast({ message: "Bulk delete successful", variant: "success" });
      setSelectedIds([]);
      fetchStats();
      router.refresh();
    } catch (error) {
      dialog.toast({
        message: "Some items failed to delete",
        variant: "danger",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleBulkDeactivate = async () => {
    setIsPending(true);
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedIds.map((id) =>
          fetch(getApiUrl(`/admin/products/${id}/status`), {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive: false }),
          }),
        ),
      );
      dialog.toast({ message: "Bulk update successful", variant: "success" });
      setSelectedIds([]);
      router.refresh();
    } catch (error) {
      dialog.toast({ message: "Bulk update failed", variant: "danger" });
    } finally {
      setIsPending(false);
    }
  };

  // Selection handlers
  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(initialProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
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

      <ProductStats stats={stats} isLoading={isStatsLoading} />

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-2 bg-primary/5 border border-primary/20 rounded-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium text-primary ml-2">
            {selectedIds.length} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline-white"
              size="sm"
              onClick={handleBulkDeactivate}
              disabled={isPending}
            >
              Set Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white border-transparent"
              onClick={handleBulkDelete}
              disabled={isPending}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <ProductTable
        products={initialProducts}
        total={initialTotal}
        isLoading={isPending} // Only shows loading if bulk action is pending. Navigation loading is handled by Next.js loading.js usually, or strictly we can use useTransition
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onSort={handleSort}
        onFilterCategory={handleFilterCategory}
        onFilterStatus={handleFilterStatus}
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
