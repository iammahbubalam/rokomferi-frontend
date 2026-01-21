"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/utils";
import { format } from "date-fns";
import {
  Plus,
  Pencil,
  Trash2,
  TicketPercent,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minSpend: number;
  usageLimit: number;
  usedCount: number;
  startAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

interface CouponFormData {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minSpend: number;
  usageLimit: number;
  startAt: string;
  expiresAt: string;
  isActive: boolean;
}

const defaultFormData: CouponFormData = {
  code: "",
  type: "percentage",
  value: 10,
  minSpend: 0,
  usageLimit: 0,
  startAt: "",
  expiresAt: "",
  isActive: true,
};

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(defaultFormData);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch coupons
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl("/admin/coupons?limit=100"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch coupons");
      return res.json();
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: CouponFormData) => {
      const token = localStorage.getItem("token");
      const url = editingId
        ? getApiUrl(`/admin/coupons/${editingId}`)
        : getApiUrl("/admin/coupons");
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      closeModal();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl(`/admin/coupons/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete coupon");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setDeleteId(null);
    },
  });

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setShowModal(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minSpend: coupon.minSpend,
      usageLimit: coupon.usageLimit,
      startAt: coupon.startAt ? coupon.startAt.split("T")[0] : "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const getCouponStatus = (
    coupon: Coupon,
  ): { label: string; className: string } => {
    if (!coupon.isActive)
      return { label: "Inactive", className: "bg-gray-100 text-gray-600" };

    const now = new Date();
    if (coupon.startAt && new Date(coupon.startAt) > now) {
      return { label: "Scheduled", className: "bg-yellow-100 text-yellow-700" };
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return { label: "Expired", className: "bg-red-100 text-red-600" };
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return { label: "Exhausted", className: "bg-orange-100 text-orange-600" };
    }
    return { label: "Active", className: "bg-green-100 text-green-700" };
  };

  const coupons: Coupon[] = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Coupons
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage discount codes and promotional coupons
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load coupons
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <TicketPercent className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No coupons yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first coupon to offer discounts
          </p>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon) => {
                const status = getCouponStatus(coupon);
                return (
                  <tr
                    key={coupon.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {coupon.type === "percentage"
                            ? `${coupon.value}%`
                            : `৳${coupon.value.toLocaleString()}`}
                        </span>
                        {coupon.minSpend > 0 && (
                          <span className="text-xs text-gray-500">
                            Min: ৳{coupon.minSpend.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">
                        {coupon.usedCount}
                        {coupon.usageLimit > 0
                          ? ` / ${coupon.usageLimit}`
                          : " used"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {coupon.startAt && (
                        <div>
                          From:{" "}
                          {format(new Date(coupon.startAt), "MMM d, yyyy")}
                        </div>
                      )}
                      {coupon.expiresAt && (
                        <div>
                          Until:{" "}
                          {format(new Date(coupon.expiresAt), "MMM d, yyyy")}
                        </div>
                      )}
                      {!coupon.startAt && !coupon.expiresAt && (
                        <span className="text-gray-400">No limit</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                      >
                        {status.label === "Active" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {status.label === "Inactive" && (
                          <XCircle className="w-3 h-3" />
                        )}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(coupon.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold">
                {editingId ? "Edit Coupon" : "Create Coupon"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="SUMMER20"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono uppercase"
                />
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Min Spend & Usage Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Minimum Spend (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minSpend}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minSpend: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0 = no minimum"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimit: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0 = unlimited"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startAt}
                    onChange={(e) =>
                      setFormData({ ...formData, startAt: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-sm font-medium text-gray-700">
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Error */}
              {saveMutation.isError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {saveMutation.error?.message || "Failed to save coupon"}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingId ? "Update" : "Create"} Coupon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Coupon?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. The coupon will be permanently
              deleted.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
