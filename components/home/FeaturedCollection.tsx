"use client";

import { motion } from "framer-motion";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/lib/data";

export function FeaturedCollection({ products }: { products: Product[] }) {
  // Switched to native horizontal scroll for better UX ("Don't pause vertical scroll")
  // Using snap-scroll for "Professional Flow"
  return (
    <Section className="bg-main overflow-hidden"> 
       <Container className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent-gold mb-2 block">The Edit</span>
            <h2 className="font-serif text-4xl md:text-5xl text-primary">Essentials</h2>
          </div>
          <p className="text-secondary max-w-xs text-sm md:text-right">
            Curated pieces for the uncompromising individual. Designed to endure.
          </p>
       </Container>

        {/* Horizontal Scroll Container */}
        <div 
          className="flex overflow-x-auto pb-12 gap-8 px-4 md:px-8 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              className="min-w-[85vw] md:min-w-[25vw] snap-center flex-shrink-0"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6 }}
            >
               <ProductCard product={product} />
            </motion.div>
          ))}
          {/* Decorative End Card */}
          <div className="min-w-[50vw] md:min-w-[20vw] snap-center flex-shrink-0 flex items-center justify-center bg-transparent aspect-[3/4]">
             <Button variant="secondary">View All Items</Button>
          </div>
        </div>
    </Section>
  );
}
