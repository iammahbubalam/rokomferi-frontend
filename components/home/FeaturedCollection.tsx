"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Container, Section } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { Product } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import clsx from "clsx";

export function FeaturedCollection({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Custom Scroll Progress Logic
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const totalScroll = el.scrollWidth - el.clientWidth;
      const currentScroll = el.scrollLeft;
      setScrollProgress(currentScroll / totalScroll);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Section className="bg-[#121212] text-white py-32 overflow-hidden relative"> 
       {/* Subtle Grain or Texture could go here */}
       
       <Container>
         <div className="flex flex-col gap-16">
            
            {/* Editorial Header - Full Width Split */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8 border-b border-white/10 pb-8">
               <div className="max-w-2xl">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] mb-6 block font-medium">
                     The Collection
                  </span>
                  <h2 className="font-serif text-5xl md:text-8xl text-white leading-[0.9]">
                    Curated <span className="italic text-white/50">Essentials</span>
                  </h2>
               </div>

               <div className="flex flex-col items-start lg:items-end gap-6">
                  <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-xs font-light text-left lg:text-right">
                    Timeless pieces chosen for their character. <br className="hidden lg:block"/>
                    Designed to transcend seasons.
                  </p>
                  
                  <Link href="/shop" className="group flex items-center gap-2 text-sm uppercase tracking-widest pb-1 border-b border-white/30 hover:border-white transition-colors">
                    View All Products
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>

            {/* Scrollable Gallery */}
            <div className="relative">
               <div 
                  ref={scrollRef}
                  className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:-mx-8 md:px-8"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
               >
                  {/* Intro/Spacer for layout offset */}
                  <div className="w-0 md:w-16 flex-shrink-0" />

                  {products.map((product, idx) => (
                    <motion.div 
                      key={product.id} 
                      className="min-w-[85vw] md:min-w-[24rem] snap-center flex-shrink-0"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                    >
                       <ProductCard product={product} variant="inverted" /> 
                    </motion.div>
                  ))}
                  
                  {/* End Card Link (Minimalist) */}
                  <Link href="/shop" className="contents">
                    <motion.div 
                        className="min-w-[20rem] snap-center flex-shrink-0 flex items-center justify-center border-l border-white/10 aspect-[3/4] hover:bg-white/5 transition-colors cursor-pointer group"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                       <div className="flex flex-col items-center gap-4">
                          <span className="font-serif text-3xl italic text-white/50 group-hover:text-white transition-colors">Explore</span>
                       </div>
                    </motion.div>
                  </Link>
                  
                  <div className="w-4 md:w-16 flex-shrink-0" />
               </div>

               {/* Custom Progress Bar Control */}
               <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 mt-8">
                  <motion.div 
                    className="h-[2px] bg-[#d4af37] relative -top-[0.5px]"
                    style={{ width: `${Math.max(scrollProgress * 100, 10)}%` }} // Minimum width for visibility
                    layoutId="scrollProgress"
                  />
               </div>
            </div>
         </div>
       </Container>
    </Section>
  );
}
