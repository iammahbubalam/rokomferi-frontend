"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryNode } from "@/lib/data";
import { clsx } from "clsx";

export function NavMenu({ categories }: { categories: CategoryNode[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-8" onMouseLeave={() => setActiveId(null)}>
      {categories.map((category) => (
        <div key={category.id} className="relative">
          {/* Top Level Item */}
          <Link
            href={category.path || `/category/${category.slug}`}
            className="text-sm uppercase tracking-[0.1em] text-primary hover:text-accent-gold transition-colors py-4 inline-block font-medium"
            onMouseEnter={() => setActiveId(category.id)}
          >
            {category.name}
          </Link>

          {/* Mega Dropdown */}
          <AnimatePresence>
            {activeId === category.id && category.children && category.children.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-[600px] bg-white border border-primary/5 shadow-2xl p-8 z-50 grid grid-cols-3 gap-8"
              >
                 {category.children.map((child) => (
                   <div key={child.id} className="flex flex-col gap-4">
                      <Link 
                        href={child.path || `/category/${child.slug}`}
                        className="font-serif text-lg text-primary hover:underline decoration-accent-gold underline-offset-4"
                      >
                        {child.name}
                      </Link>
                      
                      {/* Sub Children (Level 3) */}
                      {child.children && (
                        <div className="flex flex-col gap-2">
                          {child.children.map((sub) => (
                            <Link 
                              key={sub.id} 
                              href={sub.path || `/category/${sub.slug}`}
                              className="text-xs text-secondary hover:text-primary transition-colors uppercase tracking-wider"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                   </div>
                 ))}
                 
                 {/* Decorative Image Placeholders or Promo can go here if grid allows */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
}
