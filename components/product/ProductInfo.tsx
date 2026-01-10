"use client";

import { Product, ProductVariant } from "@/lib/data";
import { useState } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { VariantSelector } from "./VariantSelector";
import { ProductDetailsAccordion } from "./ProductDetailsAccordion";
import { Ruler, Info } from "lucide-react";
import clsx from "clsx";

export function ProductInfo({ product }: { product: Product }) {
  // Default to first variant if exists, or null
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );

  // Determine effective price and stock
  const currentPrice = selectedVariant?.price || product.pricing.salePrice || product.pricing.basePrice;
  const originalPrice = product.pricing.salePrice ? product.pricing.basePrice : undefined; // Only show if on sale
  
  const currentStockStatus = selectedVariant 
    ? (selectedVariant.stock > 0 ? "in_stock" : "out_of_stock")
    : product.inventory.status;

  return (
    <div className="flex flex-col gap-8 md:gap-12">
       {/* Header */}
       <div className="space-y-4 border-b border-primary/10 pb-8">
          <span className="text-secondary text-sm tracking-[0.2em] uppercase">{product.category}</span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-[0.9]">
            {product.name}
          </h1>
          <div className="flex items-center justify-between pt-2">
             <div className="flex flex-col">
                 <span className="text-2xl font-light text-primary">
                     ৳{currentPrice.toLocaleString()}
                 </span>
                 {originalPrice && (
                     <span className="text-sm line-through text-secondary opacity-60">
                        ৳{originalPrice.toLocaleString()}
                     </span>
                 )}
             </div>
             {currentStockStatus === 'in_stock' ? (
               <span className="text-xs text-green-600 uppercase tracking-widest flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"/> In Stock
               </span>
             ) : (
               <span className="text-xs text-red-500 uppercase tracking-widest">Sold Out</span>
             )}
          </div>
       </div>

       {/* Story/Hook (Keep simple text here, full details in accordion) */}
       {product.description && (
         <p className="text-lg font-light leading-relaxed text-secondary/90">
            {product.description}
         </p>
       )}

       {/* Variant Selector */}
       {product.variants && product.variants.length > 0 && (
         <VariantSelector 
            variants={product.variants} 
            selectedVariantId={selectedVariant?.id}
            onSelect={setSelectedVariant}
         />
       )}

       {/* Actions */}
       <div className="space-y-6 pt-4">
          <AddToCartButton 
            product={product} 
            variant={selectedVariant}
            disabled={currentStockStatus !== 'in_stock'}
          />
          
          <div className="flex justify-center gap-8 text-xs uppercase tracking-widest text-secondary underline-offset-4 decoration-primary/30">
             <button className="hover:underline flex items-center gap-2"><Ruler className="w-3 h-3"/> Size Guide</button>
             <button className="hover:underline flex items-center gap-2"><Info className="w-3 h-3"/> Delivery & Returns</button>
          </div>
       </div>

       {/* Rich Details Accordion */}
       <ProductDetailsAccordion product={product} />
    </div>
  );
}
