"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function AdminOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/orders`);
            if (statusFilter) url.searchParams.append("status", statusFilter);
            
            const res = await fetch(url.toString(), {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        if (!confirm(`Update order status to ${newStatus}?`)) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Optimistic update or refetch
                fetchOrders();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating status");
        }
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
                    onChange={(e) => setStatusFilter(e.target.value)}
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

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Order ID</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Customer</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Total</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Date</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Status</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary"/></td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-secondary">No orders found.</td></tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-mono text-xs text-secondary">#{order.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.user?.firstName || "Guest"} {order.user?.lastName || ""}</div>
                                        <div className="text-xs text-secondary">{order.user?.email || "No Email"}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">BDT {order.totalAmount}</td>
                                    <td className="px-6 py-4 text-xs text-secondary">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100'}`}>
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
