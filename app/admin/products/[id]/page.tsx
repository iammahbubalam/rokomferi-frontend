"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Category, Product } from "@/types";
import { getApiUrl } from "@/lib/utils";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Parallel fetch
        const [prodRes, catsRes] = await Promise.all([
          fetch(getApiUrl(`/admin/products/${id}`), { headers }),
          fetch(getApiUrl("/categories/tree")),
        ]);

        if (!prodRes.ok) throw new Error("Product not found");

        const prodData = await prodRes.json();
        const catsData = await catsRes.json();

        setProduct(prodData);
        setCategories(catsData || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-96 items-center justify-center flex-col gap-4">
        <p className="text-red-500 font-medium">
          {error || "Product not found"}
        </p>
      </div>
    );
  }

  return (
    <ProductForm
      initialData={product}
      categories={categories}
      isEditing={true}
    />
  );
}
