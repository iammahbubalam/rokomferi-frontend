"use client";

import { useCart } from "@/context/CartContext";
import { Product, ProductVariant } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant;
  disabled?: boolean;
}

export function AddToCartButton({ product, variant, disabled }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Construct the cart item
      const effectivePrice = variant?.price;
      const basePricing = product.pricing;
      
      const cartItem = variant 
        ? { 
            ...product, 
            id: variant.id, 
            name: `${product.name} - ${variant.name}`,
            pricing: effectivePrice ? { basePrice: effectivePrice, currency: basePricing.currency } : basePricing
          }
        : product;
        
      await addToCart(cartItem as Product);
    } finally {
      // Small delay to show the "Adding" state for better UX feedback
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
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
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
