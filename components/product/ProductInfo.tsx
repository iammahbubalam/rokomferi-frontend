"use client";

import { Product, Variant } from "@/types";
import { AddToCartButton } from "./AddToCartButton";
import { VariantSelector } from "./VariantSelector";
import { ProductDetailsAccordion } from "./ProductDetailsAccordion";
import { ProductGallery } from "./ProductGallery";
import { Ruler, Info, ShieldCheck, Truck, Lock, CreditCard } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export function ProductInfo({ product }: { product: Product }) {
   const router = useRouter();
   const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>();

   // Derive active images: Variant images (if >0) OR Product default images
   // This creates the "Dynamic Gallery" effect
   const activeImages = useMemo(() => {
      if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
         return selectedVariant.images;
      }
      return product.images && product.images.length > 0 ? product.images : ["/placeholder.jpg"];
   }, [selectedVariant, product.images]);

   // Effective price: Variant Price > Sale Price > Base Price
   const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.basePrice;
   const originalPrice = (selectedVariant?.salePrice && selectedVariant.price) || (product.salePrice && product.basePrice) || undefined;

   // Stock Logic
   const totalStock = selectedVariant ? selectedVariant.stock : (product.variants?.reduce((sum, v) => sum + v.stock, 0) || product.stock || 0);
   // Allow purchase if in_stock OR pre_order, AND stock > 0 (for in_stock)
   const isPurchasable = (product.stockStatus === 'pre_order') || (totalStock > 0 && product.stockStatus !== 'out_of_stock');

   const handleBuyNow = () => {
      const variantParam = selectedVariant ? `&variantId=${selectedVariant.id}` : '';
      router.push(`/checkout?type=direct&productId=${product.id}&quantity=1${variantParam}`);
   };

   // Auto-select if only one variant exists (e.g. "One Size" / "Default")
   useEffect(() => {
      if (product.variants && product.variants.length === 1) {
         setSelectedVariant(product.variants[0]);
      }
   }, [product.variants]);

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 pb-20">
         {/* LEFT: Dynamic Gallery */}
         <div className="w-full">
            <ProductGallery images={activeImages} />
         </div>

         {/* RIGHT: Product Info & Actions */}
         <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="space-y-4 border-b border-primary/10 pb-8">
               <span className="text-secondary text-xs tracking-[0.2em] uppercase font-bold">{product.categories?.[0]?.name || "Collection"}</span>
               <h1 className="font-serif text-4xl md:text-5xl text-primary leading-[1.1]">
                  {product.name}
               </h1>

               {/* Price & Stock Status */}
               <div className="flex items-center justify-between pt-4">
                  <div className="flex flex-col">
                     <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-light text-primary">
                           ৳{currentPrice.toLocaleString()}
                        </span>
                        {originalPrice && (
                           <span className="text-sm line-through text-secondary/60">
                              ৳{originalPrice.toLocaleString()}
                           </span>
                        )}
                     </div>
                  </div>

                  {/* Stock Indicator */}
                  {isPurchasable ? (
                     <div className="flex flex-col items-end">
                        <span className="text-xs text-green-700 uppercase tracking-widest flex items-center gap-2 font-medium">
                           <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                           {product.stockStatus === 'pre_order' ? 'Pre-Order Available' : 'In Stock'}
                        </span>
                        {totalStock < 10 && totalStock > 0 && (
                           <span className="text-[10px] text-red-600 font-bold mt-1">
                              Only {totalStock} left
                           </span>
                        )}
                     </div>
                  ) : (
                     <span className="text-xs text-red-600 uppercase tracking-widest font-bold">
                        Sold Out
                     </span>
                  )}
               </div>
            </div>

            {/* Rich Text Short Desc (HTML from Backend) */}
            {product.description && (
               <div
                  className="prose prose-sm prose-neutral text-secondary/80 leading-relaxed font-light max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
               />
            )}

            {/* Variant Selector - Linked Options Logic */}
            {product.variants && product.variants.length > 0 && (
               <div className="pt-2">
                  <VariantSelector
                     variants={product.variants}
                     selectedVariantId={selectedVariant?.id}
                     onSelect={setSelectedVariant}
                  />
               </div>
            )}

            {/* Actions - Primary Call to Actions */}
            <div className="space-y-6 pt-6">
               <div className="grid grid-cols-2 gap-4 h-14">
                  <AddToCartButton
                     product={product}
                     disabled={!isPurchasable}
                     selectedVariantId={selectedVariant?.id}
                     onSuccess={() => router.back()} // Redirect logic as requested
                  />

                  <button
                     onClick={handleBuyNow}
                     disabled={!isPurchasable}
                     className={clsx(
                        "h-full w-full uppercase tracking-[0.2em] text-xs font-bold transition-all duration-300 flex items-center justify-center gap-3",
                        "bg-accent-gold text-white hover:bg-yellow-600 border border-transparent shadow-lg shadow-accent-gold/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                     )}
                  >
                     <CreditCard className="w-4 h-4" />
                     Buy Now
                  </button>
               </div>

               <div className="flex justify-center gap-8 text-xs uppercase tracking-widest text-secondary underline-offset-4 decoration-primary/30 pt-2">
                  <button className="hover:underline flex items-center gap-2 hover:text-primary transition-colors"><Ruler className="w-3 h-3" /> Size Guide</button>
                  <button className="hover:underline flex items-center gap-2 hover:text-primary transition-colors"><Info className="w-3 h-3" /> Delivery & Returns</button>
               </div>
            </div>

            {/* Trust Badges - Visual Reassurance */}
            <div className="grid grid-cols-3 gap-6 border-t border-primary/5 pt-8">
               <div className="flex flex-col items-center text-center gap-3 group">
                  <div className="p-3 bg-gray-50 rounded-full group-hover:bg-primary/5 transition-colors">
                     <ShieldCheck className="w-5 h-5 text-accent-gold" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">Authentic<br />Quality</span>
               </div>
               <div className="flex flex-col items-center text-center gap-3 group">
                  <div className="p-3 bg-gray-50 rounded-full group-hover:bg-primary/5 transition-colors">
                     <Truck className="w-5 h-5 text-accent-gold" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">Express<br />Shipping</span>
               </div>
               <div className="flex flex-col items-center text-center gap-3 group">
                  <div className="p-3 bg-gray-50 rounded-full group-hover:bg-primary/5 transition-colors">
                     <Lock className="w-5 h-5 text-accent-gold" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">Secure<br />Payment</span>
               </div>
            </div>

            {/* Extended Details Accordion */}
            <div className="pt-4">
               <ProductDetailsAccordion product={product} />
            </div>
         </div>
      </div>
   );
}
