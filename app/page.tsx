"use client";

import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Container";
import { ProductCard } from "@/components/ui/ProductCard";
import { getAllProducts, Product } from "@/lib/data";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// --- Components for the Page ---

import { Hero } from "@/components/home/Hero";

function Marquee() {
  return (
    <div className="w-full bg-primary text-white py-6 overflow-hidden flex whitespace-nowrap">
      <motion.div 
        className="flex gap-16 text-xs uppercase tracking-widest font-medium"
        animate={{ x: "-50%" }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      >
        {Array(10).fill("Quiet Luxury • Timeless Form • Organic Texture • Sustainable Design •").map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </motion.div>
    </div>
  );
}

function FeaturedCollection({ products }: { products: Product[] }) {
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

function Philosophy() {
  return (
    <Section className="bg-main-secondary relative overflow-hidden">
       <Container className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
         <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image 
              src="/assets/silk-tunic.png"
              alt="Philosophy"
              fill
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
         </div>
         <div className="flex flex-col gap-8">
            <span className="text-xs uppercase tracking-[0.2em] text-accent-gold">Our Philosophy</span>
            <h3 className="font-serif text-4xl md:text-6xl leading-tight">
              We believe in the 
              <span className="italic block pl-12 text-primary/60">power of restraint.</span>
            </h3>
            <p className="text-secondary leading-loose max-w-md">
              In a world of noise, Rokomferi offers silence. Our garments are designed to be lived in, not just looked at. 
              We prioritize fabric over frills, and silhouette over trends.
            </p>
            <Button variant="primary" className="self-start">Read the Journal</Button>
         </div>
       </Container>
    </Section>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <FeaturedCollection products={products} />
      <Philosophy />
    </div>
  );
}
