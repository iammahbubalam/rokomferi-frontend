"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block cursor-pointer">
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-secondary w-full">
        {product.isNew && (
          <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-widest bg-white/90 backdrop-blur-sm px-2 py-1 text-primary">
            New Arrival
          </span>
        )}
        
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Using Next.js Image for optimization, creating a "glitchy" premium lazy load effect if needed, but keeping standard for now */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="mt-6 flex flex-col gap-1">
        <h3 className="font-serif text-lg text-primary group-hover:underline decoration-1 underline-offset-4 decoration-accent-gold transition-all">
          {product.name}
        </h3>
        <p className="text-sm text-secondary tracking-wide">
          ${product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
