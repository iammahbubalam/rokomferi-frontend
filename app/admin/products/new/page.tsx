"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeft, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types";

export default function NewProductPage() {
    const router = useRouter();
    const { token } = useAuth(); // Need token for protected Upload API
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        description: "",
        basePrice: "",
        salePrice: "",
        stock: "",
        stockStatus: "in_stock",
        categoryId: "",
        images: [] as string[]
    });

    useEffect(() => {
        // Fetch categories for the dropdown
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/tree`)
            .then(res => res.json())
            .then(data => setCategories(data || []))
            .catch(err => console.error(err));
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: uploadData
            });

            if (!res.ok) throw new Error("Upload failed");
            
            const data = await res.json();
            // Append new image URL
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, data.url]
            }));
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                salePrice: formData.salePrice ? parseFloat(formData.salePrice) : 0,
                stock: parseInt(formData.stock),
                categoryId: formData.categoryId || null // Handle empty
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to create product");

            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error creating product");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="text-secondary hover:text-primary transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-serif font-bold">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-bold text-lg">Basic Information</h2>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Product Name</label>
                            <input 
                                required
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-bold text-lg">Images</h2>
                        
                        <div className="grid grid-cols-3 gap-4">
                            {formData.images.map((url, idx) => (
                                <div key={idx} className="relative aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                                    <Image src={url} alt="Product" fill className="object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 hover:bg-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            
                            {/* Upload Button */}
                            <label className="border-2 border-dashed border-gray-300 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                                {isUploading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                ) : (
                                    <>
                                        <Upload className="w-6 h-6 text-secondary mb-2" />
                                        <span className="text-xs text-secondary font-medium">Upload Image</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Org */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-bold text-lg">Pricing</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Base Price (BDT)</label>
                            <input 
                                required
                                type="number" 
                                value={formData.basePrice}
                                onChange={e => setFormData({...formData, basePrice: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Sale Price (Optional)</label>
                            <input 
                                type="number" 
                                value={formData.salePrice}
                                onChange={e => setFormData({...formData, salePrice: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
                        <h2 className="font-bold text-lg">Inventory</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">SKU</label>
                            <input 
                                required
                                type="text" 
                                value={formData.sku}
                                onChange={e => setFormData({...formData, sku: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                            <input 
                                required
                                type="number" 
                                value={formData.stock}
                                onChange={e => setFormData({...formData, stock: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Stock Status</label>
                            <select 
                                value={formData.stockStatus}
                                onChange={e => setFormData({...formData, stockStatus: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">Out of Stock</option>
                                <option value="pre_order">Pre Order</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
                         <h2 className="font-bold text-lg">Organization</h2>
                         <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select 
                                value={formData.categoryId}
                                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-md font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
}
