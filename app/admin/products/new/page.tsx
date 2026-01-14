"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types";
import { getApiUrl } from "@/lib/utils";
import { ProductForm } from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch(getApiUrl("/categories/tree"))
            .then(res => res.json())
            .then(data => setCategories(data || []))
            .catch(err => console.error(err));
    }, []);

    return <ProductForm categories={categories} />;
}
