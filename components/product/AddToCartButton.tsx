"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
  selectedVariantId?: string;
  onSuccess?: () => void;
  className?: string;
}

export function AddToCartButton({ product, disabled, selectedVariantId, onSuccess, className }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showError, setShowError] = useState(false);

  const hasVariants = product.variants && product.variants.length > 0;
  const isSelectionRequired = hasVariants && !selectedVariantId;

  const handleAddToCart = async () => {
    if (isSelectionRequired) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsAdding(true);
    setShowError(false);
    try {
      await addToCart(product, selectedVariantId);
      if (onSuccess) onSuccess();
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-red-600 text-[10px] font-bold uppercase tracking-wider text-center"
          >
            ⚠️ Please select a variant first
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={handleAddToCart}
        disabled={disabled || isAdding}
        variant="primary"
        className={twMerge(
          "w-full py-6 uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300",
          "bg-primary text-white hover:bg-black hover:text-white border border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary",
          showError && "border-red-500 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
          className
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
            {disabled ? "Out of Stock" : showError ? "Select Variant" : "Add to Bag"}
          </span>
        )}
      </Button>
    </div>
  );
}
