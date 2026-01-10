"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container, Section } from "@/components/ui/Container";
import { FeaturedCategory } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";

export function CategoryGrid({ categories }: { categories: FeaturedCategory[] }) {
  // We assume the first category is "large" and the next two are "small" for the split layout
  // In a real generic grid we would map dynamically, but for this specific "Editorial Masonry" design:
  const largeCategory = categories.find(c => c.size === "large") || categories[0];
  const smallCategories = categories.filter(c => c.id !== largeCategory?.id).slice(0, 2);

  return (
    <Section className="bg-main border-b border-primary/5">
      <Container>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 h-auto md:h-[600px]">
           
           {/* Large Left Item */}
           <motion.div 
             className="relative w-full md:w-2/3 h-[400px] md:h-full group overflow-hidden"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
           >
              <Link href={`/category/${largeCategory.slug}`} className="block w-full h-full relative">
                 <Image
                   src={largeCategory.image}
                   alt={largeCategory.name}
                   fill
                   className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                 
                 <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                    <span className="text-xs uppercase tracking-widest mb-2 block opacity-80">Collection</span>
                    <h3 className="font-serif text-4xl md:text-6xl mb-4">{largeCategory.name}</h3>
                    {largeCategory.description && (
                      <p className="opacity-0 group-hover:opacity-90 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 max-w-sm font-light text-lg">
                        {largeCategory.description}
                      </p>
                    )}
                 </div>
              </Link>
           </motion.div>

           {/* Stacked Right Items */}
           <div className="w-full md:w-1/3 flex flex-col gap-6 md:gap-8">
              {smallCategories.map((category, idx) => (
                <motion.div 
                   key={category.id}
                   className="relative flex-1 min-h-[250px] group overflow-hidden"
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, delay: idx * 0.2 }}
                >
                   <Link href={`/category/${category.slug}`} className="block w-full h-full relative">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                         <h3 className="font-serif text-3xl mb-2">{category.name}</h3>
                         <span className="text-xs uppercase tracking-widest border-b border-transparent group-hover:border-white transition-all pb-1 flex items-center gap-1">
                           Explore <ArrowUpRight className="w-3 h-3" />
                         </span>
                      </div>
                   </Link>
                </motion.div>
              ))}
           </div>

        </div>
      </Container>
    </Section>
  );
}
