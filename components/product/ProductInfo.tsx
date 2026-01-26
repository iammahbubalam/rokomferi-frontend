"use client";

import { Product } from "@/types";
import { AddToCartButton } from "./AddToCartButton";
// import { VariantSelector } from "./VariantSelector"; // Variants removed for now
import { ProductDetailsAccordion } from "./ProductDetailsAccordion";
import { Ruler, Info, ShieldCheck, Truck, Lock } from "lucide-react";
import clsx from "clsx";

export function ProductInfo({ product }: { product: Product }) {
   // Determine effective price and stock
   const currentPrice = product.salePrice || product.basePrice;
   const originalPrice = product.salePrice ? product.basePrice : undefined;

   const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
   const isPurchasable = product.stockStatus === 'in_stock' && totalStock > 0;

   return (
      <div className="flex flex-col gap-8 md:gap-12">
         {/* Header */}
         <div className="space-y-4 border-b border-primary/10 pb-8">
            <span className="text-secondary text-sm tracking-[0.2em] uppercase">{product.categories?.[0]?.name || "Collection"}</span>
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
               {isPurchasable ? (
                  <div className="flex flex-col items-end">
                     <span className="text-xs text-green-600 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" /> In Stock
                     </span>
                     {/* Optional: Show stock count if low */}
                     {totalStock < 10 && (
                        <span className="text-[10px] text-red-500 font-bold mt-1">
                           Only {totalStock} left!
                        </span>
                     )}
                  </div>
               ) : (
                  <span className="text-xs text-red-500 uppercase tracking-widest">
                     {product.stockStatus === 'pre_order' ? 'Pre-Order' : 'Sold Out'}
                  </span>
               )}
            </div>
         </div>

         {/* Story/Hook (Keep simple text here, full details in accordion) */}
         {product.description && (
            <p className="text-lg font-light leading-relaxed text-secondary/90">
               {product.description}
            </p>
         )}


         {/* Actions */}
         <div className="space-y-6 pt-4">
            <AddToCartButton
               product={product}
               disabled={!isPurchasable}
            />

            <div className="flex justify-center gap-8 text-xs uppercase tracking-widest text-secondary underline-offset-4 decoration-primary/30">
               <button className="hover:underline flex items-center gap-2"><Ruler className="w-3 h-3" /> Size Guide</button>
               <button className="hover:underline flex items-center gap-2"><Info className="w-3 h-3" /> Delivery & Returns</button>
            </div>
         </div>

         {/* Trust & Service Badges */}
         <div className="grid grid-cols-3 gap-4 border-y border-primary/5 py-6">
            <div className="flex flex-col items-center text-center gap-2">
               <ShieldCheck className="w-5 h-5 text-accent-gold" />
               <span className="text-[10px] uppercase tracking-widest text-secondary">Authentic<br />Handloom</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
               <Truck className="w-5 h-5 text-accent-gold" />
               <span className="text-[10px] uppercase tracking-widest text-secondary">Express<br />Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
               <Lock className="w-5 h-5 text-accent-gold" />
               <span className="text-[10px] uppercase tracking-widest text-secondary">Secure<br />Checkout</span>
            </div>
         </div>

         {/* Rich Details Accordion */}
         <ProductDetailsAccordion product={product} />
      </div>
   );
}
