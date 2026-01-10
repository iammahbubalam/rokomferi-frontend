"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";

const categories = [
  { name: "View All", slug: "/shop" },
  { name: "Saree", slug: "/category/saree" },
  { name: "Three Piece", slug: "/category/three-piece" },
  { name: "Kurti", slug: "/category/kurti" },
  { name: "Panjabi", slug: "/category/panjabi" },
  { name: "Accessories", slug: "/category/accessories" },
];

export function FilterSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-full md:w-64 flex-shrink-0 md:sticky md:top-32 self-start space-y-8">
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-6 pb-2 border-b border-primary/10">
          Categories
        </h3>
        <ul className="space-y-4">
          {categories.map((cat) => {
            const isActive = pathname === cat.slug;
            return (
              <li key={cat.slug}>
                <Link 
                  href={cat.slug} 
                  className={clsx(
                    "block text-sm transition-colors duration-300 relative group",
                    isActive ? "text-primary font-medium" : "text-secondary hover:text-primary"
                  )}
                >
                  <span className="relative z-10">{cat.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute -left-3 top-1.5 w-1.5 h-1.5 bg-accent-gold rounded-full" 
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Additional Filters could go here */}
      <div>
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-secondary mb-6 pb-2 border-b border-primary/10">
          Refine
        </h3>
        <p className="text-xs text-secondary/60 italic">Filters coming soon</p>
      </div>
    </nav>
  );
}
