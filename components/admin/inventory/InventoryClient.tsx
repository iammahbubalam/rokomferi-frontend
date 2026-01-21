"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";

import { History, Search } from "lucide-react";
import {
  AdjustStockModal,
  HistoryModal,
} from "@/components/admin/inventory/InventoryModals";

interface InventoryClientProps {
  initialProducts: Product[];
  initialSearch?: string;
}

export default function InventoryClient({
  initialProducts,
  initialSearch = "",
}: InventoryClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/admin/inventory?${params.toString()}`);
  };

  const openAdjust = (p: Product) => {
    setSelectedProduct(p);
    setShowAdjustModal(true);
  };

  const openHistory = (p: Product) => {
    setSelectedProduct(p);
    setShowHistoryModal(true);
  };

  const refreshData = () => {
    router.refresh();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-gray-500 mt-1">
            Track stock levels and view audit trails.
          </p>
        </div>
        <form onSubmit={handleSearch} className="relative w-64">
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 p-1 hover:bg-transparent"
          >
            <Search className="w-4 h-4" />
          </Button>
          <input
            type="text"
            placeholder="Search SKU or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none"
          />
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
            <tr>
              <th className="px-6 py-4">Product / SKU</th>
              <th className="px-6 py-4 text-center">Stock Level</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            ) : (
              initialProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {product.sku}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-lg font-bold ${product.stock <= (product.lowStockThreshold || 5) ? "text-red-600" : "text-gray-700"}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.stock <= 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    ) : product.stock <= (product.lowStockThreshold || 5) ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline-white"
                      onClick={() => openHistory(product)}
                      title="View Logs"
                    >
                      <History className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => openAdjust(product)}
                    >
                      Adjust
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAdjustModal && selectedProduct && (
        <AdjustStockModal
          product={selectedProduct}
          onClose={() => setShowAdjustModal(false)}
          onSuccess={() => {
            setShowAdjustModal(false);
            refreshData();
          }}
        />
      )}

      {showHistoryModal && selectedProduct && (
        <HistoryModal
          product={selectedProduct}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}
