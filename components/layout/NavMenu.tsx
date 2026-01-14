"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Collection } from "@/types";
import { clsx } from "clsx";

export function NavMenu({ categories, collections }: { categories: Category[], collections: Collection[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const navCategories = categories.filter(c => c.showInNav !== false).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <nav className="hidden lg:flex items-center gap-8" onMouseLeave={() => setActiveId(null)}>
      {navCategories.map((category) => (
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
                      {child.image && (
                        <div className="relative w-full h-32 mb-2 rounded-md overflow-hidden bg-gray-50 border border-primary/5">
                            <img src={child.image} alt={child.name} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <Link 
                        href={child.path || `/category/${child.slug}`}
                        className="font-serif text-lg text-primary hover:underline decoration-accent-gold underline-offset-4 flex items-center gap-2"
                      >
                        {child.icon && <span>{child.icon}</span>} {/* Simple text icon or render specific component if dynamic */}
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

      {/* Collections - Fixed Menu Item */}
      <div className="relative">
        <Link
          href="/collections"
          className="text-sm uppercase tracking-[0.1em] text-primary hover:text-accent-gold transition-colors py-4 inline-block font-medium"
          onMouseEnter={() => setActiveId("collections")}
        >
          Collections
        </Link>
        <AnimatePresence>
           {activeId === "collections" && collections && collections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 w-[800px] bg-white border border-primary/5 shadow-2xl p-8 z-50 grid grid-cols-3 gap-8"
                style={{ right: '-200px' }} // Center align somewhat relative to parent if needed, or stick to left/right
              >
                  {collections.map(collection => (
                     <div key={collection.id} className="group flex flex-col gap-3">
                         <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm bg-gray-100">
                             {collection.image ? (
                               <img 
                                 src={collection.image} 
                                 alt={collection.title} 
                                 className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                               />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                             )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                         </div>
                         <div>
                            <Link href={`/collection/${collection.slug}`} className="block">
                                <h4 className="font-serif text-xl text-primary group-hover:text-accent-gold transition-colors">{collection.title}</h4>
                            </Link>
                            <p className="text-xs text-secondary mt-1 line-clamp-2">{collection.description}</p>
                         </div>
                     </div>
                  ))}
              </motion.div>
           )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
