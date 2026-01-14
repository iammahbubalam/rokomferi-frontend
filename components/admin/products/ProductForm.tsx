"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  Upload,
  X,
  Plus,
  Save,
  LayoutGrid,
  DollarSign,
  Package,
  Layers,
  Image as ImageIcon,
  Settings,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/utils";

interface ProductFormProps {
  initialData?: Product | null;
  categories: Category[];
  isEditing?: boolean;
}

export function ProductForm({
  initialData,
  categories,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Initial State Setup
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    sku: initialData?.sku || "",
    description: initialData?.description || "",
    basePrice: initialData?.basePrice || 0,
    salePrice: initialData?.salePrice || 0,
    stock: initialData?.stock || 0,
    stockStatus: initialData?.stockStatus || "in_stock",
    lowStockThreshold: initialData?.lowStockThreshold || 5,
    isActive: initialData?.isActive ?? true, // Default true for new
    isFeatured: initialData?.isFeatured || false,
    categoryIds: initialData?.categories?.map((c) => c.id) || ([] as string[]),
    images: initialData?.images || ([] as string[]),
    // Variants - We need to cast or manage them. initialData might have variants from backend
    // But our frontend Product type MIGHT NOT have variants property fully Typed in `types/index.ts`?
    // Step 3881 interface Product does NOT have variants.
    // Backend HAS variants.
    // I need to add variants to Frontend Type if I want to use it here safe.
    // For now I will cast as any or local interface.
    variants: (initialData as any)?.variants || ([] as any[]),
  });

  const tabs = [
    { id: "general", label: "General", icon: LayoutGrid },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "variants", label: "Variants", icon: Layers },
  ];

  // --- Media Handlers ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    const files = Array.from(e.target.files);
    const token = localStorage.getItem("token");

    try {
      const uploadPromises = files.map(async (file) => {
        const uploadData = new FormData();
        uploadData.append("file", file);

        const res = await fetch(getApiUrl("/upload"), {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });

        if (!res.ok) throw new Error("Upload failed for " + file.name);
        const data = await res.json();
        return data.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls],
      }));
    } catch (err) {
      console.error(err);
      alert("One or more uploads failed");
    } finally {
      setIsUploading(false);
      // Reset input value to allow re-uploading same files if needed
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // --- Variant Handlers ---
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { id: "", name: "", stock: 0, sku: "" }, // New variant
      ],
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_: any, i: number) => i !== index),
    }));
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const url = isEditing
        ? getApiUrl(`/admin/products/${initialData?.id}`)
        : getApiUrl("/admin/products");
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        ...formData,
        // Ensure number types
        basePrice: Number(formData.basePrice),
        salePrice: Number(formData.salePrice),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Flatten Categories Helper
  const flattenCategories = (
    cats: Category[],
    prefix = ""
  ): { id: string; name: string }[] => {
    let result: { id: string; name: string }[] = [];
    for (const cat of cats) {
      result.push({ id: cat.id, name: prefix + cat.name });
      if (cat.children && cat.children.length > 0) {
        result = result.concat(
          flattenCategories(cat.children, prefix + cat.name + " > ")
        );
      }
    }
    return result;
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold text-gray-900">
              {isEditing ? "Edit Product" : "New Product"}
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {isEditing ? initialData?.name : "Create a new item"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Tab */}
          {activeTab === "general" && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-all text-lg font-serif"
                  placeholder="e.g. Royal Blue Katan Silk"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm leading-relaxed"
                  placeholder="Describe the product..."
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  Markdown supported
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                  Categories
                </label>
                <div className="border border-gray-200 rounded-md p-4 max-h-60 overflow-y-auto space-y-2 bg-gray-50/50">
                  {flattenCategories(categories).map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-3 text-sm cursor-pointer hover:bg-white p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked)
                            setFormData((prev) => ({
                              ...prev,
                              categoryIds: [...prev.categoryIds, cat.id],
                            }));
                          else
                            setFormData((prev) => ({
                              ...prev,
                              categoryIds: prev.categoryIds.filter(
                                (id) => id !== cat.id
                              ),
                            }));
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                      />
                      <span
                        className={
                          formData.categoryIds.includes(cat.id)
                            ? "font-medium text-gray-900"
                            : "text-gray-600"
                        }
                      >
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 py-4 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-sm font-medium">
                    Active (Visible to customers)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-sm font-medium">Featured Product</span>
                </label>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Product Images</h3>
                <label className="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-all flex items-center gap-2">
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.images.map((url, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <Image
                      src={url}
                      alt="Product"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removeImage(idx)}
                        type="button"
                        className="bg-white p-2 rounded-full text-red-600 hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        MAIN
                      </div>
                    )}
                  </div>
                ))}
                {formData.images.length === 0 && (
                  <div className="col-span-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs">No images uploaded</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === "pricing" && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Base Price (BDT)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-serif">
                      ৳
                    </span>
                    <input
                      required
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basePrice: e.target.value as any,
                        })
                      }
                      className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary text-lg font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Sale Price (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-serif">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salePrice: e.target.value as any,
                        })
                      }
                      className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary text-lg font-medium text-red-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    SKU (Stock Keeping Unit)
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Global Stock Quantity
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value as any })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary font-medium"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Total stock if not using variants. If variants used, this
                    usually sums them up.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lowStockThreshold: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                    Stock Status
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockStatus: e.target.value as
                          | "in_stock"
                          | "out_of_stock"
                          | "pre_order",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="pre_order">Pre Order</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === "variants" && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900">Product Variants</h3>
                  <p className="text-xs text-gray-500">
                    Manage size, color, or material options.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={addVariant}
                  type="button"
                  variant="outline-white"
                  className="border-gray-300 text-gray-700"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Variant
                </Button>
              </div>

              <div className="space-y-3">
                {formData.variants.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                    No variants added. This product uses global settings.
                  </div>
                )}
                {formData.variants.map((variant: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg bg-gray-50/30"
                  >
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-gray-400 font-bold">
                          Variant Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Size M, Red"
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(idx, "name", e.target.value)
                          }
                          className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-gray-400 font-bold">
                          SKU
                        </label>
                        <input
                          type="text"
                          placeholder="SKU-VAR-01"
                          value={variant.sku}
                          onChange={(e) =>
                            updateVariant(idx, "sku", e.target.value)
                          }
                          className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-gray-400 font-bold">
                          Stock
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariant(
                              idx,
                              "stock",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="mt-5 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
