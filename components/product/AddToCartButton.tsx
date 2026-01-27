"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  selectedVariantId?: string;
  onSuccess?: () => void;
}

export function AddToCartButton({ product, disabled, selectedVariantId, onSuccess }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  // ... (hasVariants check)
  const hasVariants = product.variants && product.variants.length > 0;
  const isSelectionRequired = hasVariants && !selectedVariantId;

  const handleAddToCart = async () => {
    if (isSelectionRequired) {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 600);
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product, selectedVariantId);
      if (onSuccess) onSuccess();
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      variant="primary"
      className={clsx(
        "w-full py-6 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300",
        "bg-primary text-white hover:bg-accent-gold hover:text-white border border-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary",
      )}
    >
      {isAdding ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
          Adding...
        </span>
      ) : (
        <span className="flex items-center gap-3">
          <ShoppingBag className="w-4 h-4" />
          {disabled ? "Out of Stock" : "Add to Bag"}
        </span>
      )}
    </Button>
  );
}
