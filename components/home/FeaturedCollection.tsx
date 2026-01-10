"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export function FeaturedCollection({ products }: { products: Product[] }) {
  const containerRef = useRef(null);
  
  // Create a "Split Layout" feel:
  // Left side: Sticky Title & Description (Desktop)
  // Right side: Horizontal Scroll of Products

  return (
    <Section className="bg-[#1a1a1a] text-white py-24 md:py-32 overflow-hidden relative"> 
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />

       <Container>
         <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            {/* Left Column: Sticky Header */}
            <div className="lg:w-1/3 lg:sticky lg:top-32 lg:h-fit flex flex-col gap-8 z-10">
               <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] mb-4 block">The Edit</span>
                  <h2 className="font-serif text-5xl md:text-7xl text-white leading-[0.9]">
                    Curated <br/> Essentials
                  </h2>
               </div>
               <p className="text-white/70 text-lg leading-relaxed max-w-sm font-light">
                 Each piece is chosen for its timeless character and uncompromising quality. 
                 Designed to transcend seasons.
               </p>
               <Button variant="outline-white" className="w-fit group">
                  View All Collection <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>

            {/* Right Column: Scrollable Content */}
            <div className="lg:w-2/3 w-full">
               <div 
                  className="flex overflow-x-auto pb-12 gap-8 snap-x snap-mandatory scrollbar-hide -mr-4 md:-mr-8 pr-4 md:pr-8"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
               >
                  {products.map((product, idx) => (
                    <motion.div 
                      key={product.id} 
                      className="min-w-[85vw] md:min-w-[22rem] snap-center flex-shrink-0"
                      initial={{ opacity: 0, x: 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                    >
                       {/* Passing 'inverted' context to ProductCard for dark background */}
                       <ProductCard product={product} variant="inverted" /> 
                    </motion.div>
                  ))}
                  
                  {/* End Card Link */}
                   <motion.div 
                      className="min-w-[20rem] snap-center flex-shrink-0 flex items-center justify-center border border-white/20 aspect-[3/4] hover:bg-white hover:text-black transition-colors cursor-pointer group"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                       <div className="flex flex-col items-center gap-4">
                          <span className="font-serif text-2xl italic">Explore More</span>
                          <div className="w-12 h-[1px] bg-current group-hover:w-24 transition-all" />
                       </div>
                   </motion.div>
               </div>
            </div>

         </div>
       </Container>
    </Section>
  );
}
