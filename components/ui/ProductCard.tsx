"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/lib/data";
import { Plus } from "lucide-react";
import clsx from "clsx";

export function ProductCard({ product, variant = "default" }: { product: Product; variant?: "default" | "inverted" }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block cursor-pointer">
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-[3/5] overflow-hidden bg-bg-secondary w-full">
        {product.tags?.includes('new') && (
          <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-widest bg-white text-black px-3 py-1 font-medium">
            New Arrival
          </span>
        )}
        
        {/* Image Animation */}
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={product.media[0].url}
            alt={product.media[0].alt || product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
           <button className="w-full bg-white text-black text-xs uppercase tracking-widest py-4 hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Quick Add
           </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex justify-between items-start">
           <h3 className={clsx(
             "font-serif text-lg leading-tight max-w-[80%] transition-colors",
             variant === "inverted" ? "text-white group-hover:text-white/80" : "text-primary group-hover:text-primary/80"
           )}>
             {product.name}
           </h3>
           <div className="flex flex-col items-end">
             {product.pricing.salePrice ? (
               <>
                  <span className={clsx("text-sm line-through opacity-60", variant === "inverted" ? "text-white" : "text-secondary")}>
                    ৳{product.pricing.basePrice.toLocaleString()}
                  </span>
                  <span className={clsx("text-sm font-medium text-status-error", variant === "inverted" ? "text-red-300" : "")}>
                    ৳{product.pricing.salePrice.toLocaleString()}
                  </span>
               </>
             ) : (
                <span className={clsx(
                  "text-sm font-medium",
                  variant === "inverted" ? "text-white/90" : "text-primary"
                )}>
                  ৳{product.pricing.basePrice.toLocaleString()}
                </span>
             )}
           </div>
        </div>
        <span className={clsx(
          "text-xs uppercase tracking-wider",
          variant === "inverted" ? "text-white/50" : "text-secondary"
        )}>{product.category}</span>
      </div>
    </Link>
  );
}
