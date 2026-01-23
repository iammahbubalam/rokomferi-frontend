"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Variant, Product } from "@/types";
import { Button } from "@/components/ui/Button";

import { History, Search, Package } from "lucide-react";
import {
  AdjustStockModal,
  HistoryModal,
} from "@/components/admin/inventory/InventoryModals";

interface InventoryClientProps {
  initialProducts: Product[];
  initialSearch?: string;
}

interface InventoryRow {
  productId: string;
  productName: string;
  variant: Variant;
}

export default function InventoryClient({
  initialProducts,
  initialSearch = "",
}: InventoryClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [selectedRow, setSelectedRow] = useState<InventoryRow | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Flatten products into variants for the unified list
  const rows: InventoryRow[] = initialProducts.flatMap((p) =>
    (p.variants || []).map((v) => ({
      productId: p.id,
      productName: p.name,
      variant: v,
    })),
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/admin/inventory?${params.toString()}`);
  };

  const openAdjust = (row: InventoryRow) => {
    setSelectedRow(row);
    setShowAdjustModal(true);
  };

  const openHistory = (row: InventoryRow) => {
    setSelectedRow(row);
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
          <div className="flex items-center gap-2 text-primary bg-primary/5 px-2 py-1 rounded w-fit mt-2">
            <Package className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              SKU-Centric (L9 Standard)
            </span>
          </div>
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
              <th className="px-6 py-4">Product / Variant</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4 text-center">Stock Level</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  No inventory items found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.variant.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {row.productName}
                    </div>
                    {row.variant.name !== "Default" && (
                      <div className="text-[10px] text-primary font-bold uppercase mt-0.5">
                        {row.variant.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-gray-500 font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                      {row.variant.sku}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`text-lg font-bold ${row.variant.stock <= row.variant.lowStockThreshold ? "text-red-600" : "text-gray-700"}`}
                    >
                      {row.variant.stock}
                    </span>
                    <div className="text-[10px] text-gray-400">
                      Threshold: {row.variant.lowStockThreshold}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.variant.stock <= 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    ) : row.variant.stock <= row.variant.lowStockThreshold ? (
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
                      onClick={() => openHistory(row)}
                      title="View Logs"
                    >
                      <History className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => openAdjust(row)}
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
      {showAdjustModal && selectedRow && (
        <AdjustStockModal
          productName={selectedRow.productName}
          variant={selectedRow.variant}
          onClose={() => setShowAdjustModal(false)}
          onSuccess={() => {
            setShowAdjustModal(false);
            refreshData();
          }}
        />
      )}

      {showHistoryModal && selectedRow && (
        <HistoryModal
          productName={selectedRow.productName}
          variant={selectedRow.variant}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}
