"use client";

import { useState, useEffect } from "react";
import { Product, InventoryLog } from "@/types";
import { getApiUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { 
    Search, Loader2, Package, ArrowUpRight, 
    ArrowDownLeft, History, AlertTriangle, CheckCircle 
} from "lucide-react";

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);

    // Fetch Products
    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            // Reusing product list for now, ideally specific inventory endpoint if scaling
            const res = await fetch(getApiUrl(`/admin/products?limit=100&search=${search}`), {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setProducts(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [search]); // Simple debounce could be added

    const openAdjust = (p: Product) => {
        setSelectedProduct(p);
        setShowAdjustModal(true);
    };

    const openHistory = (p: Product) => {
        setSelectedProduct(p);
        setShowHistoryModal(true);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-500 mt-1">Track stock levels and view audit trails.</p>
                </div>
                <div className="relative w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search SKU or Name..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
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
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="animate-spin w-6 h-6 mx-auto text-primary" /></td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-400">No products found.</td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">{product.sku}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-lg font-bold ${product.stock <= (product.lowStockThreshold || 5) ? 'text-red-600' : 'text-gray-700'}`}>
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
                                        <Button size="sm" variant="outline-white" onClick={() => openHistory(product)} title="View Logs">
                                            <History className="w-4 h-4 text-gray-500" />
                                        </Button>
                                        <Button size="sm" variant="primary" onClick={() => openAdjust(product)}>
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
                        fetchInventory();
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

// --- Sub Components ---

function AdjustStockModal({ product, onClose, onSuccess }: { product: Product, onClose: () => void, onSuccess: () => void }) {
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"add" | "deduct">("add");
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const finalAmount = type === "add" ? parseInt(amount) : -parseInt(amount);
            const token = localStorage.getItem("token");
            const res = await fetch(getApiUrl("/admin/inventory/adjust"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    changeAmount: finalAmount,
                    reason: reason || (type === "add" ? "Manual Restock" : "Manual Deduction")
                })
            });
            if (!res.ok) throw new Error("Failed");
            onSuccess();
        } catch (error) {
            alert("Failed to adjust stock");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
                <h2 className="text-lg font-bold mb-4">Adjust Stock: {product.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            type="button" 
                            onClick={() => setType("add")}
                            className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 ${type === "add" ? "bg-green-50 border-green-200 text-green-700" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                            <ArrowUpRight className="w-4 h-4" /> Add Stock
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setType("deduct")}
                            className={`p-3 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 ${type === "deduct" ? "bg-red-50 border-red-200 text-red-700" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                            <ArrowDownLeft className="w-4 h-4" /> Deduct Stock
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Quantity</label>
                        <input 
                            required
                            type="number" 
                            min="1"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary" 
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Reason</label>
                        <input 
                            type="text"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary" 
                            placeholder={type === "add" ? "Restock from Supplier" : "Correction / Damaged"}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting || !amount}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Adjustment"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function HistoryModal({ product, onClose }: { product: Product, onClose: () => void }) {
    const [logs, setLogs] = useState<InventoryLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(getApiUrl(`/admin/inventory/logs?productId=${product.id}&limit=20`), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setLogs(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [product.id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 h-[600px] flex flex-col animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Stock History: {product.name}</h2>
                    <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">No history found.</div>
                    ) : (
                        <div className="space-y-4">
                            {logs.map(log => (
                                <div key={log.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                                    <div className={`mt-1 p-2 rounded-full ${log.changeAmount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                        {log.changeAmount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-gray-900">
                                                {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount} Stock
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{log.reason}</p>
                                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Ref: {log.referenceId}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
}
