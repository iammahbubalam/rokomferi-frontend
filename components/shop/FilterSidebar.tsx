"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import { FilterMetadata } from "@/lib/data";

interface FilterSidebarProps {
  metadata: FilterMetadata;
}

export function FilterSidebar({ metadata }: FilterSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav className="w-full md:w-64 flex-shrink-0 md:sticky md:top-32 self-start space-y-12">
      {/* Dynamic Categories */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-6 pb-2 border-b border-primary/10">
          Categories ({metadata.categories.length})
        </h3>
        <ul className="space-y-4">
          <li key="all">
             <Link 
               href="/shop" 
               className={clsx(
                 "block text-sm transition-colors duration-300 relative group",
                 pathname === "/shop" ? "text-primary font-medium" : "text-secondary hover:text-primary"
               )}
             >
               <span className="relative z-10">View All</span>
               {pathname === "/shop" && (
                 <motion.div layoutId="sidebar-active" className="absolute -left-3 top-1.5 w-1.5 h-1.5 bg-accent-gold rounded-full" />
               )}
             </Link>
          </li>
          {metadata.categories.map((cat) => {
            const isActive = pathname.includes(cat.slug); // Simple check for now
            return (
              <li key={cat.slug}>
                <Link 
                  href={`/shop?category=${cat.slug}`} 
                  className={clsx(
                    "flex justify-between items-center text-sm transition-colors duration-300 relative group",
                    isActive ? "text-primary font-medium" : "text-secondary hover:text-primary"
                  )}
                >
                  <span className="relative z-10">{cat.name}</span>
                  <span className="text-[10px] opacity-50">{cat.count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Dynamic Colors Filter */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-6 pb-2 border-b border-primary/10">
          Color
        </h3>
        <div className="flex flex-wrap gap-2">
            {metadata.colors.map(color => (
                <button 
                  key={color} 
                  className="px-3 py-1 text-xs border border-primary/10 hover:border-primary/40 rounded-sm transition-all"
                >
                    {color}
                </button>
            ))}
        </div>
      </div>

      {/* Dynamic Price Range */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-6 pb-2 border-b border-primary/10">
          Price Range
        </h3>
        <div className="text-xs text-secondary/70">
           From ৳{metadata.priceRange.min.toLocaleString()} to ৳{metadata.priceRange.max.toLocaleString()}
        </div>
      </div>
    </nav>
  );
}
