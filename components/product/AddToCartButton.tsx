"use client";

import { useCart } from "@/context/CartContext";
import { Product, ProductVariant } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant;
  disabled?: boolean;
}

export function AddToCartButton({ product, variant, disabled }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Construct the cart item. We must ensure the 'pricing' object reflects the variant's price if it differs.
    // The variant.price is flat, but our schema expects nested pricing.
    const effectivePrice = variant?.price;
    const basePricing = product.pricing;
    
    // If variant has a price, we assume it invalidates the sale price logic of the parent unless specific logic exists.
    // For simplicity, we set basePrice to the variant price and clear salePrice if variant overrides it.
    
    const cartItem = variant 
      ? { 
          ...product, 
          id: variant.id, 
          name: `${product.name} - ${variant.name}`,
          pricing: effectivePrice ? { basePrice: effectivePrice, currency: basePricing.currency } : basePricing
        }
      : product;
      
    addToCart(cartItem as Product);
  };

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={disabled}
      className="w-full bg-primary text-white hover:bg-primary/90 rounded-none h-14 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingBag className="w-4 h-4 mr-2" /> 
      {disabled ? "Out of Stock" : "Add to Bag"}
    </Button>
  );
}
