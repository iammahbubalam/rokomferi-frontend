import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/utils";
import { Order } from "./useAdminOrders";

async function fetchOrder(id: string): Promise<Order> {
    const token = localStorage.getItem("token");
    const res = await fetch(getApiUrl(`admin/orders/${id}`), {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch order");
    return res.json();
}

export function useOrderDetail(id: string) {
    return useQuery({
        queryKey: ["admin-order", id],
        queryFn: () => fetchOrder(id),
        enabled: !!id,
    });
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status, note }: { id: string; status: string; note?: string }) => {
            const token = localStorage.getItem("token");
            const res = await fetch(getApiUrl(`admin/orders/${id}/status`), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status, note }),
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin-order-history", id] });
        }
    });
}

export function useUpdatePaymentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const token = localStorage.getItem("token");
            const res = await fetch(getApiUrl(`admin/orders/${id}/payment-status`), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update payment status");
            return res.json();
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin-order-history", id] });
        }
    });
}

export function useVerifyPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const token = localStorage.getItem("token");
            const res = await fetch(getApiUrl(`admin/orders/${id}/verify-payment`), {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to verify payment");
            return res.json();
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin-order-history", id] });
        }
    });
}

export interface RefundReq {
    id: string;
    amount: number;
    reason: string;
    restock: boolean;
}

export function useRefundOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: RefundReq) => {
            const token = localStorage.getItem("token");
            const res = await fetch(getApiUrl(`admin/orders/${data.id}/refund`), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: data.amount,
                    reason: data.reason,
                    restock: data.restock
                }),
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || "Failed to process refund");
            }
            return res.json();
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["admin-order", id] });
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin-order-history", id] });
        }
    });
}

export interface OrderHistory {
    id: string;
    orderId: string;
    previousStatus?: string;
    newStatus: string;
    reason?: string;
    createdBy?: string;
    createdName?: string;
    createdAt: string;
}

async function fetchOrderHistory(id: string): Promise<OrderHistory[]> {
    const token = localStorage.getItem("token");
    const res = await fetch(getApiUrl(`admin/orders/${id}/history`), {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch order history");
    return res.json();
}

export function useOrderHistory(id: string) {
    return useQuery({
        queryKey: ["admin-order-history", id],
        queryFn: () => fetchOrderHistory(id),
        enabled: !!id,
    });
}
