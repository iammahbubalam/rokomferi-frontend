"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "inverted";
}

export function ProductCard({ product, index = 0, variant = "default" }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // Pricing Strategy
  const price = product.pricing.salePrice || product.pricing.basePrice;
  const originalPrice = product.pricing.salePrice ? product.pricing.basePrice : null;
  
  // Status Logic
  const isNew = product.tags?.includes('new') || product.tags?.includes('eid');
  const isSoldOut = product.inventory.status === 'out_of_stock';
  const lowStock = product.inventory.stockLevel < 5 && !isSoldOut;

  return (
    <div className="group relative flex flex-col gap-4">
      {/* Image Container with Hover Effects */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden aspect-[3/4] bg-bg-secondary w-full">
        <motion.div
           whileHover={{ scale: 1.05 }}
           transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }} // smooth luxurious ease
           className="w-full h-full relative"
        >
          <Image
            src={product.media[0].url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay Gradient (subtle darkening on bottom for text readability if needed, or visual depth) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </motion.div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
           {isNew && (
             <span className="bg-white/90 backdrop-blur text-black text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 font-medium">
               New Arrival
             </span>
           )}
           {product.pricing.salePrice && (
             <span className="bg-accent-gold/90 text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 font-medium">
               Sale
             </span>
           )}
           {isSoldOut && (
             <span className="bg-black/80 text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 font-medium">
               Sold Out
             </span>
           )}
        </div>

        {/* Quick Actions (Slide up on hover) */}
        {!isSoldOut && (
           <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 flex gap-2">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="flex-1 bg-white text-primary h-10 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag className="w-3 h-3" /> Quick Add
              </button>
           </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-col gap-1 items-start">
        {/* Category / Subtitle */}
        <span className="text-[10px] uppercase tracking-[0.2em] text-secondary/60">
          {product.category}
        </span>

        {/* Title */}
        <Link href={`/product/${product.slug}`} className="group-hover:opacity-70 transition-opacity">
          <h3 className={clsx(
            "font-serif text-lg leading-tight text-primary",
            variant === "inverted" ? "text-white" : "text-primary"
          )}>
            {product.name}
          </h3>
        </Link>
        
        {/* Price Row */}
        <div className="flex items-center gap-3 mt-1 text-sm font-medium tracking-wide">
           <span className={variant === "inverted" ? "text-white" : "text-primary"}>
             ৳{price.toLocaleString()}
           </span>
           {originalPrice && (
             <span className="text-secondary/50 line-through text-xs decoration-secondary/30">
               ৳{originalPrice.toLocaleString()}
             </span>
           )}
        </div>

        {/* Variant Indicators (Static for now, but implies depth) */}
        {product.variants && (
           <div className="h-4 flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {product.variants.slice(0, 3).map(v => (
                 <span key={v.id} className="text-[10px] text-secondary border border-primary/20 px-1 rounded-sm uppercase">
                    {v.name}
                 </span>
              ))}
              {product.variants.length > 3 && <span className="text-[10px] text-secondary">+</span>}
           </div>
        )}
      </div>
    </div>
  );
}
