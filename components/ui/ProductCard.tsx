"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/lib/data";
import { Plus } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block cursor-pointer">
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-secondary w-full">
        {product.isNew && (
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
            src={product.images[0]}
            alt={product.name}
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
           <h3 className="font-serif text-lg text-primary leading-tight max-w-[80%]">
             {product.name}
           </h3>
           <span className="text-sm font-medium text-primary">
             ${product.price}
           </span>
        </div>
        <span className="text-xs text-secondary uppercase tracking-wider">{product.category}</span>
      </div>
    </Link>
  );
}
