"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";

import { getApiUrl } from "@/lib/utils";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(getApiUrl("/products?limit=100"));
            const data = await res.json();
            setProducts(data.data || []);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading products...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-serif font-bold">Products</h1>
                <Link 
                    href="/admin/products/new" 
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Image</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Name</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">SKU</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Price</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Stock</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs">Status</th>
                            <th className="px-6 py-4 font-medium text-secondary uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="w-10 h-10 relative bg-gray-100 rounded-md overflow-hidden">
                                        {product.images?.[0] && (
                                            <Image 
                                                src={product.images[0]} 
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-secondary">{product.sku}</td>
                                <td className="px-6 py-4">BDT {product.basePrice}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        product.stockStatus === 'in_stock' ? 'bg-green-100 text-green-800' :
                                        product.stockStatus === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {product.stockStatus.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-secondary hover:text-primary transition-colors p-1">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-8 text-center text-secondary">No products found. Add your first one!</div>
                )}
            </div>
        </div>
    );
}
