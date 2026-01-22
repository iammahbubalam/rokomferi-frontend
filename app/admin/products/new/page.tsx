"use client";

import { useEffect, useState } from "react";
import { Category, Collection } from "@/types";
import { getApiUrl } from "@/lib/utils";
import { ProductForm } from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    // Parallel fetch
    Promise.all([
      fetch(getApiUrl("/categories/tree")),
      fetch(getApiUrl("/admin/collections")),
    ])
      .then(async ([catRes, colRes]) => {
        const cats = await catRes.json();
        const cols = await colRes.json();
        setCategories(cats || []);
        setCollections(cols || []);
      })
      .catch((err) => console.error(err));
  }, []);

  return <ProductForm categories={categories} collections={collections} />;
}
