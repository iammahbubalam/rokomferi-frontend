"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FeaturedCategory } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

interface MasonryCategoriesProps {
  categories: FeaturedCategory[];
}

export function MasonryCategories({ categories }: MasonryCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  // Filter to ensure we have content
  const displayDocs = categories;

  return (
    <section className="py-24 bg-main border-b border-primary/5">
      <div className="max-w-[1800px] mx-auto px-4">
        {/* Header - More Editorial */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-gold mb-4 block">
            Browse
          </span>
          <h2 className="font-serif text-5xl md:text-7xl text-primary leading-none">
            Shop Categories
          </h2>
        </div>

        {/* Seamless Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {displayDocs.map((category, idx) => {
            // Smart Span Logic
            const isLast = idx === displayDocs.length - 1;
            const isOddTotal = displayDocs.length % 2 !== 0;
            const patternIndex = idx % 4;

            // 0: Wide (2), 1: Narrow (1) -> Row 1
            // 2: Narrow (1), 3: Wide (2) -> Row 2

            let colSpan = "md:col-span-1";
            if (isOddTotal && isLast) {
              colSpan = "md:col-span-3"; // Full Width Ender
            } else {
              colSpan =
                patternIndex === 0 || patternIndex === 3
                  ? "md:col-span-2"
                  : "md:col-span-1";
            }

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={clsx(
                  "relative group overflow-hidden cursor-pointer bg-gray-200", // bg-gray for loading state
                  colSpan,
                  "h-[400px] md:h-[600px]", // Fixed height for perfect alignment
                )}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="block w-full h-full relative"
                >
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      sizes="60vw"
                    />
                  ) : (
                    // Fallback Gradient if no image
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/60" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />

                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        Collection
                      </p>
                      <div className="flex items-end justify-between w-full">
                        <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-none">
                          {category.name}
                        </h3>
                        <ArrowRight className="w-6 h-6 text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Categories Link */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/category"
            className="group flex items-center gap-3 text-sm uppercase tracking-[0.3em] font-medium text-primary hover:text-accent-gold transition-colors duration-300"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
