"use client";

import { Product, Variant } from "@/types";
import { AddToCartButton } from "./AddToCartButton";
import { VariantSelector } from "./VariantSelector";
import { ProductDetailsAccordion } from "./ProductDetailsAccordion";
import { Heart, Truck, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { WishlistButton } from "../common/WishlistButton";
import clsx from "clsx";

export function ProductInfo({ product }: { product: Product }) {
   const router = useRouter();
   const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>();

   const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.basePrice;
   const originalPrice = (selectedVariant?.salePrice && selectedVariant.price) || (product.salePrice && product.basePrice) || undefined;

   // SKU display
   const activeSku = selectedVariant?.sku || product.id.substring(0, 8).toUpperCase();

   const totalStock = selectedVariant ? selectedVariant.stock : (product.variants?.reduce((sum, v) => sum + v.stock, 0) || product.stock || 0);
   const isPurchasable = (product.stockStatus === 'pre_order') || (totalStock > 0 && product.stockStatus !== 'out_of_stock');

   const { addToCart } = useCart();

   useEffect(() => {
      if (product.variants && product.variants.length === 1) {
         setSelectedVariant(product.variants[0]);
      }
   }, [product.variants]);

   return (
      <div className="relative h-full flex flex-col">
         <div className="lg:sticky lg:top-24 space-y-8">

            {/* 1. Header & SKU */}
            <div className="space-y-2">
               <h1 className="font-sans text-3xl font-medium text-gray-900 leading-tight">
                  {product.name}
               </h1>
               <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
                  <span>SKU: {activeSku}</span>
                  <span>{product.categories?.[0]?.name}</span>
               </div>
            </div>

            {/* 2. Price */}
            <div className="flex items-baseline gap-4 border-b border-gray-100 pb-6">
               <span className="text-xl font-bold text-gray-900">
                  Tk {currentPrice.toLocaleString()}
               </span>
               {originalPrice && (
                  <span className="text-sm line-through text-gray-400">
                     Tk {originalPrice.toLocaleString()}
                  </span>
               )}
            </div>

            {/* 2.5 Stock Status & Notices */}
            <div className="space-y-3">
               {/* Status Badge */}
               <div className="flex items-center justify-between text-sm font-medium">
                  <div className="flex items-center gap-2">
                     {product.stockStatus === 'out_of_stock' || (!isPurchasable && product.stockStatus !== 'pre_order') ? (
                        <span className="text-red-600 flex items-center gap-2">
                           <span className="w-2 h-2 bg-red-600 rounded-full" /> Out of Stock
                        </span>
                     ) : product.stockStatus === 'pre_order' ? (
                        <span className="text-amber-600 flex items-center gap-2">
                           <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" /> Pre-Order Available
                        </span>
                     ) : (
                        <span className="text-green-700 flex items-center gap-2">
                           <span className="w-2 h-2 bg-green-600 rounded-full" /> In Stock
                        </span>
                     )}
                  </div>

                  {/* Stock Quantity Display */}
                  {totalStock > 0 && product.stockStatus !== 'out_of_stock' && (
                     <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        Available: <span className="text-gray-900 font-bold">{totalStock}</span>
                     </span>
                  )}
               </div>

               {/* Pre-Order Notice */}
               {product.stockStatus === 'pre_order' && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-md flex gap-2 items-start">
                     <span className="mt-0.5">⚠️</span>
                     <span>You need to pay 50% advance for pre-orders. Delivery may take slightly longer than usual.</span>
                  </div>
               )}
            </div>

            {/* 3. Variants */}
            {product.variants && product.variants.length > 0 && (
               <div className="pb-2">
                  <VariantSelector
                     variants={product.variants}
                     selectedVariantId={selectedVariant?.id}
                     onSelect={setSelectedVariant}
                  />
               </div>
            )}

            {/* 4. Actions (Desktop) - Reference Style */}
            <div className="hidden lg:flex flex-col gap-3">
               <div className="flex gap-2">
                  {/* Reuse customized AddToCartButton logic but apply class via prop if supported, or wrapper */}
                  <div className="flex-1">
                     <AddToCartButton
                        product={product}
                        disabled={!isPurchasable}
                        selectedVariantId={selectedVariant?.id}
                        onSuccess={() => { }}
                        className="w-full h-12 bg-gray-900 text-white hover:bg-black uppercase tracking-[0.2em] text-xs font-bold transition-all disabled:opacity-50"
                     />
                  </div>
                  <div className="h-12 w-12 border border-gray-200 flex items-center justify-center">
                     <WishlistButton product={product} className="w-full h-full rounded-none hover:bg-transparent" />
                  </div>
               </div>
            </div>

            {/* 5. Benefits / Meta */}
            <div className="flex flex-col gap-3 py-4 text-xs text-gray-600">

               <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  <span>Authentic products guaranteed</span>
               </div>
            </div>

            {/* 6. Accordions (Size Guide, Description, etc) */}
            <div className="border-t border-gray-100 pt-2">

            </div>
         </div>

         {/* Mobile Sticky Actions */}
         <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex gap-3">
            <div className="flex-1">
               <AddToCartButton
                  product={product}
                  disabled={!isPurchasable}
                  selectedVariantId={selectedVariant?.id}
                  onSuccess={() => { }}
               />
            </div>
         </div>
      </div>
   );
}
