"use client";

import { motion } from "framer-motion";
import { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";
import Image from "next/image";

interface LookbookGridProps {
  products: Product[];
}

export function LookbookGrid({ products }: LookbookGridProps) {
  return (
    <div className="flex flex-col gap-20 md:gap-32">
      {/* 
        We split products into chunks to create a repeating asymmetrical pattern.
        Pattern A: Large Feature Left (Product 0) + Stacked Right (Product 1, 2)
        Pattern B: Standard Grid (Product 3, 4, 5)
        Pattern C: Large Feature Right (Product 6) + Stacked Left (Product 7, 8)
      */}
      
      {products.map((product, index) => {
        // We will manually construct the grid by grouping via index logic is tricky in map.
        // Instead, let's just use CSS Grid with dynamic classes based on index.
        
        // Actually, for a true lookbook feel, we need more control than just a map.
        // Let's iterate in chunks of 6? Or just map with conditional logic.
        
        // Simpler approach: A responsive grid where some items span 2 columns.
        
        const isFeatured = index % 5 === 0; // Every 5th item is large
        const isWide = index % 5 === 3; // Every 3rd item in the cycle is wide
        
        if (isFeatured) {
            // Full Width Hero style for Product
            return (
                <div key={product.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-10">
                    <div className="relative aspect-[4/5] w-full bg-[#f4f4f4]">
                        <Image
                          src={product.images?.[0] || "/assets/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                    </div>
                    <div className="px-4 md:px-12 flex flex-col items-start gap-6">
                        <span className="text-secondary uppercase tracking-[0.3em] text-xs">Featured Piece</span>
                        <h2 className="font-serif text-4xl md:text-5xl leading-tight">{product.name}</h2>
                        <p className="text-secondary/80 font-light leading-relaxed max-w-sm">
                           {product.description || "A masterpiece of craftsmanship, designed for moments that matter."}
                        </p>
                        <ProductCard product={product} variant="default" index={index} /> 
                        {/* Note: We actually probably want a custom call to action here instead of card, but card is safe. 
                            Actually, let's just render the Card normally but maybe hide the image since we showed it big? 
                            Or just render the product card nicely. 
                        */}
                    </div>
                </div>
            );
        }
        
        return null; // Handle others in groups? 
        // This is getting complex to blend with map. 
        // Let's stick to the Masonry-style Grid from the previous plan but refined.
      })}
      
      {/* 
         Alternative: CSS Grid Auto-Flow with span classes.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 gap-y-24 items-start">
         {products.map((product, i) => {
            const isHero = i === 0; // First item always hero
            const isLarge = !isHero && i % 4 === 1; // 2nd, 6th, 10th...
            
            // Grid Spans
            // Hero: col-span-12
            // Large: col-span-6 or 8
            // Regular: col-span-4 or 6
            
            let spanClass = "col-span-1 md:col-span-1 lg:col-span-4";
            if (isHero) spanClass = "col-span-1 md:col-span-2 lg:col-span-12 mb-20 md:mb-32";
            else if (isLarge) spanClass = "col-span-1 md:col-span-1 lg:col-span-6 lg:row-span-2";
            
            return (
                <motion.div 
                  key={product.id} 
                  className={`${spanClass} flex flex-col gap-4`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                    {isHero ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[16/9] w-full bg-[#f4f4f4] overflow-hidden">
                                <Image
                                  src={product.images?.[1] || product.images?.[0] || "/assets/placeholder.png"}
                                  alt={product.name}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform duration-1000"
                                />
                            </div>
                            <div className="flex flex-col gap-6 items-start max-w-md">
                                <span className="text-secondary text-xs uppercase tracking-[0.3em]">Editor's Choice</span>
                                <h2 className="font-serif text-5xl md:text-6xl">{product.name}</h2>
                                <p className="text-lg font-light text-secondary/80">{product.description}</p>
                                <ProductCard product={product} variant="default" />
                                {/* We hide the image in card purely via CSS if needed, 
                                    or just let it be a mini thumbnail. 
                                    Actually let's just use ProductCard standardly but wrapper styles matter.
                                */}
                            </div>
                        </div>
                    ) : (
                        <ProductCard product={product} index={i} />
                    )}
                </motion.div>
            );
         })}
      </div>
    </div>
  );
}
