"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NavMenu } from "./NavMenu";
import { CATEGORY_TREE } from "@/lib/data";
import clsx from "clsx";

import { SearchOverlay } from "./SearchOverlay";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out border-b border-transparent",
          isScrolled ? "bg-white/95 backdrop-blur-md py-2 shadow-sm border-primary/5" : "bg-transparent py-4 border-transparent"
        )}
      >
        <Container className="flex items-center justify-between gap-8">
          
          {/* 1. Logo Section */}
          <Link href="/" className="flex-shrink-0 relative z-50">
            <div className="relative h-10 w-32 md:h-12 md:w-40">
               <Image 
                 src="/assets/logo_rokomferi.png" 
                 alt="Rokomferi" 
                 fill
                 className="object-contain object-left"
                 priority
               />
            </div>
          </Link>

          {/* 2. Desktop Navigation (Center - Mega Menu) */}
          <div className="hidden lg:block">
            <NavMenu categories={CATEGORY_TREE} />
          </div>

          {/* 3. Actions (Right) */}
          <div className="flex items-center gap-6 justify-end">
            <div className="hidden md:flex items-center gap-4">
               {/* Search Icon */}
               <button 
                  className="text-primary hover:text-accent-gold transition-colors"
                  onClick={() => setIsSearchOpen(true)}
               >
                  <Search className="w-5 h-5" />
               </button>

               {/* New Arrivals CTA requesting attention */}
               <Link href="/new-arrivals">
                 <Button className="px-6 py-3 text-xs h-auto">
                    New Arrivals
                 </Button>
               </Link>
            </div>

            {/* Cart */}
            <button className="text-primary hover:text-accent-gold transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent-gold text-white text-[10px] flex items-center justify-center rounded-full font-medium">
                0
              </span>
            </button>

            {/* Mobile Menu Trigger */}
            <button 
                className="lg:hidden text-primary"
                onClick={() => setIsMobileOpen(true)}
             >
               <Menu className="w-6 h-6" />
             </button>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8 lg:hidden"
          >
            <div className="flex justify-between items-center mb-12 border-b border-primary/10 pb-6">
              <span className="text-xl font-serif uppercase tracking-widest">Menu</span>
              <button onClick={() => setIsMobileOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Simple Mobile List for now */}
            <nav className="flex flex-col gap-6 overflow-y-auto">
              <Link href="/new-arrivals" className="text-2xl font-serif text-accent-gold" onClick={() => setIsMobileOpen(false)}>
                New Arrivals
              </Link>
              {CATEGORY_TREE.map((cat) => (
                 <div key={cat.id} className="flex flex-col gap-3">
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-xl font-serif text-primary"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    {/* Basic nested showing for mobile */}
                    {cat.children && (
                      <div className="pl-4 flex flex-col gap-2 border-l border-primary/10">
                        {cat.children.map(child => (
                           <Link 
                             key={child.id}
                             href={`/category/${child.slug}`}
                             onClick={() => setIsMobileOpen(false)}
                             className="text-sm uppercase tracking-wider text-secondary"
                           >
                              {child.name}
                           </Link>
                        ))}
                      </div>
                    )}
                 </div>
              ))}
              <Link href="/shop" className="text-xl font-serif text-primary mt-4" onClick={() => setIsMobileOpen(false)}>
                Shop All
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
