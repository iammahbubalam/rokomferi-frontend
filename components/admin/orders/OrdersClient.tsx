"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Order } from "@/types";
import { useDialog } from "@/context/DialogContext";
import { Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface OrdersClientProps {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const router = useRouter();
  const dialog = useDialog();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");

  // L9: Client-Side Cache - Single Source of Truth
  const { data: orders = initialOrders, isFetching } = useQuery({
    queryKey: ["admin_orders", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);

      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl(`/admin/orders?${params.toString()}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      return json.data || json; // Handle varied backend response structures
    },
    initialData: initialOrders
  });

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    const params = new URLSearchParams();
    if (newStatus) params.set("status", newStatus);
    router.push(`/admin/orders?${params.toString()}`);
  };

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl(`/admin/orders/${id}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      return { id, status };
    },
    onSuccess: ({ id, status }) => {
      // Surgical Cache Update
      queryClient.setQueryData(["admin_orders", statusFilter], (old: Order[] | undefined) => {
        if (!old) return [];
        return old.map(o => o.id === id ? { ...o, status } : o);
      });
      dialog.toast({ message: "Order status updated", variant: "success" });
    },
    onError: () => {
      dialog.toast({ message: "Failed to update status", variant: "danger" });
    }
  });

  const updateStatus = (orderId: string, newStatus: string) => {
    statusMutation.mutate({ id: orderId, status: newStatus });
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    returned: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
        {(statusMutation.isPending || isFetching) && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">
                Order ID
              </th>
              <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">
                Customer
              </th>
              <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">
                Total
              </th>
              <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">
                Date
              </th>
              <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">
                Status
              </th>
              <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-secondary"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono text-xs text-secondary">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {order.user?.firstName || "Guest"}{" "}
                      {order.user?.lastName || ""}
                    </div>
                    <div className="text-xs text-secondary">
                      {order.user?.email || "No Email"}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    BDT {order.totalAmount}
                  </td>
                  <td className="px-6 py-4 text-xs text-secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors] || "bg-gray-100"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
