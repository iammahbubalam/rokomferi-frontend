"use client";

import { Product } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";

interface MasonryGridProps {
  products: Product[];
}

export function MasonryGrid({ products }: MasonryGridProps) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
      {products.map((product, i) => {
        // Create a pseudo-random pattern for aspect ratios to get that "zigzag" feel
        // Pattern: Tall, Regular, Regular, Tall, Regular, Tall...
        const isTall = i % 3 === 0 || i % 7 === 0;
        const isExtraTall = i % 5 === 0 && !isTall;
        
        // CSS Columns flows top-to-bottom, then left-to-right. 
        // We just need to ensure the items have different heights.
        
        let aspectRatio = "aspect-[3/4.5]"; // Standard
        if (isTall) aspectRatio = "aspect-[3/5]";
        if (isExtraTall) aspectRatio = "aspect-[3/6]";

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
            className="break-inside-avoid mb-8 md:mb-12"
          >
            <ProductCard 
                product={product} 
                index={i} 
                aspectRatio={aspectRatio}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
