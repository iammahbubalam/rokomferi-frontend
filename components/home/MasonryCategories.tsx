"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container, Section } from "@/components/ui/Container";
import { FeaturedCategory } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";

interface MasonryCategoriesProps {
  categories: FeaturedCategory[];
}

export function MasonryCategories({ categories }: MasonryCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  // Split categories for asymmetrical layout
  // We'll take the first one as "Main Feature" and others as "Editorial Chips"
  const [mainFeature, ...others] = categories;

  return (
    <Section className="py-24 bg-main relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-light/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <span className="font-script text-3xl text-accent-gold block mb-2">
              Curated Edits
            </span>
            <h2 className="font-serif text-5xl md:text-6xl text-primary leading-tight">
              Woven for the <br />
              <span className="italic">Modern Muse</span>
            </h2>
          </div>
          <div className="mb-4 hidden md:block">
            <Link
              href="/shop"
              className="group flex items-center gap-2 text-xs uppercase tracking-widest border-b border-primary/20 pb-1 hover:border-primary transition-colors"
            >
              View All Collections
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          {/* 1. Main Feature (Takes 7 cols on Desktop) */}
          <div className="col-span-1 md:col-span-7 relative h-[500px] md:h-full group cursor-pointer overflow-hidden rounded-sm">
            <Link
              href={`/category/${mainFeature.slug}`}
              className="block w-full h-full"
            >
              <div className="absolute inset-0 bg-gray-200">
                {mainFeature.image && (
                  <Image
                    src={mainFeature.image}
                    alt={mainFeature.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <div className="bg-white/90 backdrop-blur-sm p-6 max-w-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-secondary mb-2 block">
                    Featured Collection
                  </span>
                  <h3 className="font-serif text-3xl text-primary mb-2">
                    {mainFeature.name}
                  </h3>
                  <p className="text-secondary text-sm line-clamp-2">
                    {mainFeature.description}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* 2. Secondary Stack (Takes 5 cols on Desktop) */}
          <div className="col-span-1 md:col-span-5 flex flex-col gap-6 h-full">
            {others.slice(0, 2).map((cat, idx) => (
              <div
                key={cat.id}
                className="relative flex-1 group cursor-pointer overflow-hidden rounded-sm bg-white border border-primary/5 p-2"
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex h-full w-full relative"
                >
                  {/* Image Half */}
                  <div className="w-1/2 relative h-full overflow-hidden">
                    {cat.image && (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>

                  {/* Text Half */}
                  <div className="w-1/2 p-6 flex flex-col justify-center bg-card">
                    <span className="text-accent-gold font-serif italic text-xl mb-1">
                      0{idx + 2}
                    </span>
                    <h4 className="font-serif text-2xl text-primary mb-3 group-hover:text-accent-gold transition-colors">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-widest text-secondary/70 border-b border-transparent group-hover:border-secondary/30 self-start pb-1 transition-colors">
                      Explore
                    </span>
                  </div>
                </Link>
              </div>
            ))}

            {/* "More" Block if needed */}
            <div className="flex-shrink-0 py-6 px-8 bg-primary text-white flex justify-between items-center rounded-sm">
              <span className="font-serif text-xl">Discover More</span>
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
