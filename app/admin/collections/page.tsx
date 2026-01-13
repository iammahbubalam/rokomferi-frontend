"use client";

import { useEffect, useState } from "react";
import { getApiUrl, cn } from "@/lib/utils";
import { Collection, Product } from "@/types";
import { Loader2, Plus, Trash2, Edit2, Image as ImageIcon, Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function AdminCollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCollection, setCurrentCollection] = useState<Partial<Collection>>({});
    
    // For Product Assignment
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [showProductModal, setShowProductModal] = useState(false);

    useEffect(() => {
        fetchCollections();
        fetchProducts();
    }, []);

    const fetchCollections = async () => {
        try {
            const res = await fetch(getApiUrl("/collections"));
            const data = await res.json();
            setCollections(data || []);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        const res = await fetch(getApiUrl("/products?limit=100"));
        const data = await res.json();
        setAllProducts(data.data || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = currentCollection.id 
            ? getApiUrl(`/admin/collections/${currentCollection.id}`)
            : getApiUrl("/admin/collections");
        const method = currentCollection.id ? "PUT" : "POST";

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(url, {
                method,
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(currentCollection)
            });
            if (res.ok) {
                fetchCollections();
                setIsEditing(false);
                setCurrentCollection({});
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem("token");
            await fetch(getApiUrl(`/admin/collections/${id}`), {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCollections();
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append("file", file);
        
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(getApiUrl("/upload"), {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setCurrentCollection(prev => ({ ...prev, image: data.url }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-light">Collections</h1>
                <Button onClick={() => { setCurrentCollection({}); setIsEditing(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> New Collection
                </Button>
            </div>

            {isEditing && (
                <div className="bg-white p-6 border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-medium">{currentCollection.id ? "Edit Collection" : "New Collection"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                placeholder="Title" 
                                className="w-full p-2 border" 
                                value={currentCollection.title || ""}
                                onChange={e => setCurrentCollection({...currentCollection, title: e.target.value})}
                                required
                            />
                            <input 
                                placeholder="Slug (optional)" 
                                className="w-full p-2 border" 
                                value={currentCollection.slug || ""}
                                onChange={e => setCurrentCollection({...currentCollection, slug: e.target.value})}
                            />
                        </div>
                        <textarea 
                            placeholder="Description" 
                            className="w-full p-2 border h-20"
                            value={currentCollection.description || ""}
                            onChange={e => setCurrentCollection({...currentCollection, description: e.target.value})}
                        />
                         <textarea 
                            placeholder="Story (Rich Text Narrative)" 
                            className="w-full p-2 border h-32 font-serif"
                            value={currentCollection.story || ""}
                            onChange={e => setCurrentCollection({...currentCollection, story: e.target.value})}
                        />
                        
                        <div className="flex items-center gap-4">
                             {currentCollection.image && (
                                <div className="relative w-20 h-20 border">
                                    <Image src={currentCollection.image} alt="Preview" fill className="object-cover" />
                                </div>
                            )}
                            <label className="cursor-pointer bg-gray-50 px-4 py-2 border hover:bg-gray-100 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Upload Hero Image
                                <input type="file" hidden onChange={handleImageUpload} />
                            </label>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="secondary" className="px-6 py-2" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit"><Save className="w-4 h-4 mr-2" /> Save</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map(collection => (
                    <div key={collection.id} className="group bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-50">
                            {collection.image ? (
                                <Image src={collection.image} alt={collection.title} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setCurrentCollection(collection); setIsEditing(true); }} className="p-2 bg-white rounded-full shadow hover:text-blue-600">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(collection.id)} className="p-2 bg-white rounded-full shadow hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-medium">{collection.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{collection.description}</p>
                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <span className="text-xs uppercase tracking-wider text-gray-400">
                                    {collection.products?.length || 0} Products
                                </span>
                                <Button variant="secondary" className="px-4 py-2" onClick={() => {
                                    // Open Product Manager for this collection
                                    // For simplicity, just alert for now, strictly CRUD first.
                                    alert("Product assignment UI coming next");
                                }}>
                                    Manage Products
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
