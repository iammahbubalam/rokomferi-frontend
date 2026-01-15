"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Section } from "@/components/ui/Container";
import { FeaturedCategory } from "@/lib/data";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import clsx from "clsx";

export function CategoryGrid({
  categories,
}: {
  categories: FeaturedCategory[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!categories || categories.length === 0) return null;

  // Enhance the list if fewer than 3 to fill space nicely, or just work with what we have.
  // For the accordion to look best, we usually want at least 3 items.

  return (
    <Section className="bg-main border-b border-primary/5 py-16 md:py-24 overflow-hidden">
      <Container className="mb-12 md:mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl text-primary mb-4 font-light tracking-tight">
            The Collections
          </h2>
          <div className="flex items-center justify-center gap-4">
            <span className="h-[1px] w-12 bg-primary/20" />
            <span className="font-sans text-xs uppercase tracking-[0.3em] opacity-60">
              Est. 2026
            </span>
            <span className="h-[1px] w-12 bg-primary/20" />
          </div>
        </motion.div>
      </Container>

      {/* Full width container for immersive feel or kept in Container for alignment? 
          "Lifestyle" often implies edge-to-edge. Let's try edge-to-edge with max-width. */}

      <div className="w-full h-[600px] md:h-[800px] flex flex-col md:flex-row bg-black">
        {categories.map((category, idx) => {
          const isActive = activeId === category.id;
          // Default active: none, or maybe the middle one?
          // Let's rely on hover. If none hover, all equal.

          return (
            <motion.div
              key={category.id}
              className="relative h-full border-b md:border-b-0 md:border-r border-white/10 last:border-0 overflow-hidden cursor-pointer"
              // Flex logic handled by motion 'layout' or width var
              initial={false}
              animate={{
                flex: isActive ? 2.5 : 1,
                filter:
                  activeId && !isActive ? "brightness(0.5)" : "brightness(1)",
              }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              onMouseEnter={() => setActiveId(category.id)}
              onMouseLeave={() => setActiveId(null)}
            >
              <Link
                href={`/category/${category.slug}`}
                className="block w-full h-full relative group"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-[1.5s] ease-out scale-100 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div
                  className={clsx(
                    "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500",
                    isActive ? "opacity-90" : "opacity-60"
                  )}
                />

                {/* Content Container */}
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                  {/* Number/Index - Top Right */}
                  <div className="absolute top-8 right-8 md:top-12 md:right-12 overflow-hidden">
                    <motion.span
                      className="font-serif text-4xl text-white/20 block"
                      animate={{
                        y: isActive ? 0 : -50,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      0{idx + 1}
                    </motion.span>
                  </div>

                  {/* Title & Description */}
                  <div className="relative z-10 transform translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    {/* Large Title */}
                    <h3
                      className={clsx(
                        "font-serif text-3xl md:text-5xl text-white mb-2 leading-tight transition-all duration-500"
                        // If not active, maybe rotate text on desktop? Or just keep simple.
                        // Let's keep it simple but elegant.
                      )}
                    >
                      {category.name}
                    </h3>

                    {/* Revealed Content */}
                    <motion.div
                      className="overflow-hidden"
                      initial={false}
                      animate={{
                        height: isActive ? "auto" : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="font-sans text-white/80 text-sm md:text-base max-w-md font-light mb-6 tracking-wide leading-relaxed">
                        {category.description ||
                          "Defining quiet luxury through texture, form, and timeless restraint."}
                      </p>

                      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white border-b border-white pb-1">
                        Discover <ArrowRight className="w-3 h-3" />
                      </span>
                    </motion.div>

                    {/* Preview Label (when collapsed) */}
                    <motion.div
                      className="absolute top-full left-0 mt-2"
                      animate={{ opacity: !isActive ? 1 : 0 }}
                    >
                      <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/60">
                        View Collection
                      </span>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
