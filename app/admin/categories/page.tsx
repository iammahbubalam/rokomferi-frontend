"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { 
    ChevronRight, ChevronDown, Plus, Trash2, Edit2, 
    Save, X, FolderTree, Image as ImageIcon, Loader2, Upload,
    ArrowRight, ArrowLeft, ArrowUp, ArrowDown, LayoutList,
    MoreHorizontal, CheckCircle, AlertCircle
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// --- Types & Helper ---

type FlatCategory = Category & { depth: number; parentId?: string; index: number };

const INDENT_WIDTH = 36; // px per depth level

// --- Component: Category Row ---

interface CategoryRowProps {
    category: FlatCategory;
    expanded: Record<string, boolean>;
    toggleExpand: (id: string) => void;
    onEdit: (cat: Category) => void;
    onDelete: (id: string) => void;
    onIndent: (id: string) => void;
    onOutdent: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
    isFirst: boolean;
    isLast: boolean;
}

function CategoryRow({ 
    category, expanded, toggleExpand, onEdit, onDelete, 
    onIndent, onOutdent, onMoveUp, onMoveDown, isFirst, isLast 
}: CategoryRowProps) {
  
  const hasChildren = (category.children && category.children.length > 0);

  return (
    <div className="group relative transition-colors duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-0">
        <div className="flex items-center py-3 pr-4" style={{ paddingLeft: `${category.depth * INDENT_WIDTH + 16}px` }}>
            
            {/* Visual Hierarchy Line (L-shape) */}
            {category.depth > 0 && (
                 <div className="absolute left-0 top-0 bottom-0 border-l border-gray-200" 
                      style={{ left: `${(category.depth * INDENT_WIDTH) - (INDENT_WIDTH/2) + 16}px` }} 
                 />
            )}
            {category.depth > 0 && (
                 <div className="absolute w-3 border-t border-gray-200"
                      style={{ 
                          left: `${(category.depth * INDENT_WIDTH) - (INDENT_WIDTH/2) + 16}px`,
                          top: '50%'   
                      }} 
                 />
            )}

            {/* Expand / Icon */}
            <div className="flex items-center gap-3 flex-shrink-0 relative z-10">
                <button 
                    onClick={(e) => { e.stopPropagation(); toggleExpand(category.id); }} 
                    className={`p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all 
                        ${!hasChildren ? "opacity-20 pointer-events-none" : ""}`}
                >
                    {expanded[category.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                <div className="w-9 h-9 rounded bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                    {category.image ? (
                        <Image src={category.image} alt="" width={36} height={36} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[10px] font-bold text-gray-300">{category.name.substring(0,2).toUpperCase()}</span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="ml-3 flex-grow min-w-0 flex items-center gap-4">
                <div onClick={() => onEdit(category)} className="cursor-pointer group-hover:text-primary transition-colors">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{category.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        <span className="font-mono">{category.slug}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!category.isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded textxs font-medium bg-gray-100 text-gray-600">
                            Inactive
                        </span>
                    )}
                    {!category.showInNav && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded textxs font-medium bg-amber-50 text-amber-600">
                            No Nav
                        </span>
                    )}
                </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                
                {/* Reorder & Indent */}
                <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-full border border-gray-100">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onMoveUp(category.id); }} 
                        disabled={isFirst} 
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:shadow-none" 
                        title="Move Up"
                    >
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onMoveDown(category.id); }} 
                        disabled={isLast} 
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:shadow-none" 
                        title="Move Down"
                    >
                        <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-3 bg-gray-300 mx-0.5" />
                    <button 
                        onClick={(e) => { e.stopPropagation(); onOutdent(category.id); }} 
                        disabled={category.depth === 0} 
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:shadow-none" 
                        title="Outdent (Level Up)"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onIndent(category.id); }} 
                        className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:shadow-none" 
                        title="Indent (Make Child)"
                    >
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Edit/Delete */}
                <div className="flex items-center gap-1 pl-2 border-l border-gray-100">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(category); }} 
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
                        title="Edit Category"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(category.id); }} 
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Delete Category"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

// --- Main Page Component ---

export default function AdminCategoriesPage() {
    const [isMounted, setIsMounted] = useState(false);
    
    // Data
    const [categories, setCategories] = useState<Category[]>([]);
    const [items, setItems] = useState<FlatCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [isDirty, setIsDirty] = useState(false); 

    // UI State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Form
    const [formData, setFormData] = useState<Partial<Category>>({
        name: "", parentId: undefined, orderIndex: 0, isActive: true, 
        showInNav: true, image: "", 
        metaTitle: "", metaDescription: "", keywords: "" 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // API Helper
    const getApiUrl = (endpoint: string) => {
        const base = process.env.NEXT_PUBLIC_API_URL || "";
        const cleanBase = base.endsWith("/api/v1") ? base : `${base}/api/v1`;
        return `${cleanBase}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    };

    // Flattening Logic
    const flatten = (nodes: Category[], parentId?: string, depth = 0): FlatCategory[] => {
      let result: FlatCategory[] = [];
      nodes.forEach((node, index) => {
         const { children, ...rest } = node;
         result.push({ ...rest, depth, parentId, index: result.length } as FlatCategory);
         // Recursively add children immediately after parent
         if (children && children.length > 0) {
             result = result.concat(flatten(children, node.id, depth + 1));
         }
      });
      return result;
    }

    // Fetch
    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(getApiUrl("/categories/tree"));
            const data = await res.json();
            setCategories(data || []);
            setIsDirty(false); 
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        fetchCategories();
    }, []);

    // Sync categories to items (only if not dirty)
    useEffect(() => {
        if (categories.length > 0 && !isDirty) {
            setItems(flatten(categories));
        }
    }, [categories]); 

    // --- Core Logic: Manual Updates ---

    const updateLocalState = (newItems: FlatCategory[]) => {
        setItems(newItems);
        setIsDirty(true);
    };

    const handleIndent = (id: string) => {
        const index = items.findIndex(i => i.id === id);
        if (index <= 0) return;
        
        const item = items[index];
        const prevItem = items[index - 1];
        
        // Validation: Cannot be deeper than prevItem + 1
        if (item.depth > prevItem.depth) return; 
        
        const newItems = [...items];
        newItems[index] = { ...item, depth: item.depth + 1 };
        updateLocalState(newItems);
    };

    const handleOutdent = (id: string) => {
        const index = items.findIndex(i => i.id === id);
        if (index < 0) return;
        const item = items[index];
        
        if (item.depth <= 0) return;

        const newItems = [...items];
        newItems[index] = { ...item, depth: item.depth - 1 };
        updateLocalState(newItems);
    };

    const handleMoveUp = (id: string) => {
        const index = items.findIndex(i => i.id === id);
        if (index <= 0) return;
        
        const newItems = [...items];
        // Simple Swap
        [newItems[index], newItems[index-1]] = [newItems[index-1], newItems[index]];
        
        updateLocalState(newItems);
    };

    const handleMoveDown = (id: string) => {
        const index = items.findIndex(i => i.id === id);
        if (index < 0 || index >= items.length - 1) return;

        const newItems = [...items];
        // Simple Swap
        [newItems[index], newItems[index+1]] = [newItems[index+1], newItems[index]];
        
        updateLocalState(newItems);
    };

    // --- Save Logic (Batch) ---
    // Recalculates ParentIDs and OrderIndices based on the visual list order & depth
    const resolveHierarchyAndSave = async () => {
         const stack: {id: string, depth: number}[] = [{ id: "ROOT", depth: -1 }];
         const finalUpdates: any[] = [];
         const parentCounts: Record<string, number> = {};

         // 1. Resolve Hierarchy
         for (let i = 0; i < items.length; i++) {
             const item = items[i];
             
             // Find parent in stack (must have depth < item.depth)
             while (stack.length > 0 && stack[stack.length - 1].depth >= item.depth) {
                 stack.pop();
             }
             
             const parent = stack[stack.length - 1];
             const pId = parent.id === "ROOT" ? undefined : parent.id;
             
             // Calculate Order Index
             const countKey = pId || "ROOT";
             const order = (parentCounts[countKey] || 0) + 1;
             parentCounts[countKey] = order;

             // Add self to stack for potential children
             stack.push({ id: item.id, depth: item.depth });
             
             finalUpdates.push({
                 id: item.id,
                 parentId: pId,
                 orderIndex: order
             });
         }

         // 2. Send API Request
         const token = localStorage.getItem("token");
         try {
             setIsLoading(true);
             const res = await fetch(getApiUrl("/admin/categories/reorder"), {
                 method: "POST",
                 headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                 body: JSON.stringify({ updates: finalUpdates })
             });

             if (!res.ok) throw new Error("Batch update failed");

             // 3. Refresh
             await fetchCategories();
             
         } catch(e) { 
             console.error(e);
             alert("Failed to save changes. Please try again.");
             setIsLoading(false);
         }
    };


    // --- CRUD Actions ---

    const openCreate = () => {
        setSelectedCategory(null);
        setFormData({ name: "", parentId: undefined, orderIndex: 0, isActive: true, showInNav: true });
        setIsCreating(true);
        setIsDrawerOpen(true);
    };

    const openEdit = (cat: Category) => {
        setSelectedCategory(cat);
        setFormData({...cat}); 
        setIsCreating(false);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setTimeout(() => setIsCreating(false), 200);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;
        const token = localStorage.getItem("token");
        try {
            await fetch(getApiUrl(`/admin/categories/${id}`), {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (e) {
            console.error(e);
            alert("Failed to delete category");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setIsUploading(true);
        try {
            const token = localStorage.getItem("token");
            const fd = new FormData();
            fd.append("file", e.target.files[0]);
            const res = await fetch(getApiUrl("/upload"), {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd
            });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, image: data.url }));
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        const url = isCreating ? getApiUrl("/admin/categories") : getApiUrl(`/admin/categories/${selectedCategory?.id}`);
        const method = isCreating ? "POST" : "PUT";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...formData, orderIndex: Number(formData.orderIndex) })
            });

            if (res.ok) {
                fetchCategories();
                closeDrawer();
            } else {
                alert("Failed to save category.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-32">
            
            {/* --- Stick Header --- */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 transition-shadow duration-300 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                            <FolderTree className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Product Categories</h1>
                            <p className="text-xs text-gray-500 font-medium">Manage hierarchy and navigation structure</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                         {/* Save Button with Animation */}
                         <div className={`transition-all duration-300 transform origin-right ${isDirty ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none w-0 overflow-hidden"}`}>
                            <Button 
                                onClick={resolveHierarchyAndSave} 
                                className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 px-6"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                         </div>

                         {/* Status Indicator */}
                         {!isDirty && !isLoading && (
                             <div className="flex items-center gap-2 text-xs text-gray-400 font-medium px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                                 <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                 Synced
                             </div>
                         )}

                        <div className="h-8 w-px bg-gray-200 mx-2"></div>

                        <Button onClick={openCreate} className="shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
                            <Plus className="w-5 h-5 mr-2" /> 
                            Add Category
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                
                {isLoading && categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-gray-300" />
                        <p>Loading catalog...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LayoutList className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No Categories Found</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get started by creating your first root category.</p>
                        <Button onClick={openCreate} variant="secondary">Create Root Category</Button>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-8 md:col-span-9 pl-2">Category Structure</div>
                            <div className="col-span-4 md:col-span-3 text-right pr-6">Actions</div>
                        </div>

                        {/* List */}
                        <div className="divide-y divide-gray-100">
                            {items.map((item, index) => (
                                <CategoryRow
                                    key={item.id}
                                    category={item}
                                    expanded={expanded}
                                    toggleExpand={(id) => setExpanded(prev => ({...prev, [id]: !prev[id]}))}
                                    onEdit={() => openEdit(item)}
                                    onDelete={() => handleDelete(item.id)}
                                    onIndent={handleIndent}
                                    onOutdent={handleOutdent}
                                    onMoveUp={handleMoveUp}
                                    onMoveDown={handleMoveDown}
                                    isFirst={index === 0}
                                    isLast={index === items.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

             {/* --- Drawer Form --- */}
             <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={closeDrawer}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                        />
                        <motion.div 
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto"
                        >
                            <div className="flex flex-col h-full">
                                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {isCreating ? "New Category" : "Edit Category"}
                                        </h2>
                                        <p className="text-sm text-gray-500 font-medium mt-0.5">
                                            {isCreating ? "Add a new item to catalog" : `ID: ${selectedCategory?.id}`}
                                        </p>
                                    </div>
                                    <button onClick={closeDrawer} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="flex-1 p-8 space-y-10">
                                    {/* Basic Info */}
                                    <section className="space-y-6">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1.5 h-4 bg-primary rounded-full"></span> 
                                            General Information
                                        </h3>
                                        
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name</label>
                                                <input 
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                                                    value={formData.name}
                                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                                    placeholder="e.g. Winter Collection"
                                                />
                                            </div>

                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Parent Category</label>
                                                <div className="relative">
                                                    <select 
                                                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 appearance-none outline-none font-medium text-gray-700"
                                                        value={formData.parentId || ""}
                                                        onChange={e => setFormData({...formData, parentId: e.target.value || undefined})}
                                                    >
                                                        <option value="">(Root Category)</option>
                                                        {items.filter(i => i.id !== selectedCategory?.id).map(i => (
                                                            <option key={i.id} value={i.id}>
                                                                {"— ".repeat(i.depth) + i.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <ChevronDown className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Settings */}
                                    <section className="space-y-6">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1.5 h-4 bg-gray-400 rounded-full"></span> 
                                            Visibility & Status
                                        </h3>
                                        <div className="space-y-4">
                                            {/* Active Switch */}
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:border-gray-200">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-gray-900 text-sm">Active Status</span>
                                                    <span className="text-xs text-gray-500">Visible to customers in the store</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>

                                            {/* Nav Switch */}
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 transition-colors hover:border-gray-200">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-gray-900 text-sm">Include in Menu</span>
                                                    <span className="text-xs text-gray-500">Display in main navigation headers</span>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" checked={formData.showInNav} onChange={e => setFormData({...formData, showInNav: e.target.checked})} className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Media */}
                                    <section className="space-y-6">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1.5 h-4 bg-amber-400 rounded-full"></span> 
                                            Visuals
                                        </h3>
                                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-white hover:border-primary transition-all relative group">
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageUpload} disabled={isUploading} />
                                            
                                            {formData.image ? (
                                                <div className="relative w-40 h-40 mx-auto rounded-lg overflow-hidden shadow-md bg-white">
                                                    <Image src={formData.image} alt="" fill className="object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold px-3 py-1.5 border border-white/50 rounded-full backdrop-blur-sm">Change Image</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all">
                                                        <Upload className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">Click to upload image</p>
                                                    <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto">SVG, PNG, JPG supported. Recommended size 400x400px.</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                    
                                     {/* SEO */}
                                     <section className="space-y-6">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                            <span className="w-1.5 h-4 bg-purple-400 rounded-full"></span> 
                                            SEO Metadata
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Meta Title</label>
                                                <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all" placeholder="SEO Title" value={formData.metaTitle} onChange={e => setFormData({...formData, metaTitle: e.target.value})} />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Meta Description</label>
                                                <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all resize-none" rows={3} placeholder="Brief description for search engines..." value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} />
                                            </div>
                                        </div>
                                    </section>
                                </form>

                                <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center gap-4 sticky bottom-0 z-10">
                                    <Button type="button" variant="secondary" className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 border-none relative top-0 hover:-top-0.5 transition-all" onClick={closeDrawer}>
                                        Cancel
                                    </Button>
                                    <Button type="button" className="flex-[2] py-3 shadow-xl shadow-primary/25 hover:shadow-primary/40 relative top-0 hover:-top-0.5 transition-all" onClick={handleSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : "Save Category"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
             </AnimatePresence>
        </div>
    );
}
