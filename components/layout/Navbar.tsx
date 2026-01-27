"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  User,
  Shield,
  Heart,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NavMenu } from "./NavMenu";
import { UserMenu } from "./UserMenu";
import { CategoryNode, SiteConfig } from "@/lib/data";
import { SearchOverlay } from "./SearchOverlay";
import { useIntro } from "@/context/IntroContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import clsx from "clsx";
import { Collection } from "@/types";

interface NavbarProps {
  categories: CategoryNode[];
  collections: Collection[];
  siteConfig: SiteConfig;
}

export function Navbar({ categories, collections, siteConfig }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { items, toggleCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user } = useAuth();
  const { isIntroComplete, isLoading } = useIntro();
  const pathname = usePathname();


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
          isScrolled
            ? "bg-white/95 backdrop-blur-md py-2 shadow-sm border-primary/5"
            : "bg-transparent py-4 border-transparent",
        )}
      >
        <Container className="flex items-center justify-between gap-8">
          {/* 1. Logo Section */}
          <Link href="/" className="flex-shrink-0 relative z-50 cursor-pointer">
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
            <NavMenu categories={categories} collections={collections} />
          </div>

          {/* 3. Actions (Right) - PROPERLY STRUCTURED */}
          <div className="flex items-center justify-end">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6">
              {/* Shop CTA - Elegant Pill Button */}
              <Link
                href="/shop"
                className="px-6 py-2 border border-primary/20 rounded-full text-xs uppercase tracking-[0.2em] font-medium text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer"
              >
                Shop
              </Link>

              {/* Vertical Divider */}
              <div className="h-5 w-px bg-primary/15" />

              {/* Icons Group - Properly Spaced */}
              <div className="flex items-center gap-5">
                {/* Search */}
                <button
                  className="text-primary/80 hover:text-accent-gold transition-all duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => setIsSearchOpen(true)}
                  title="Search"
                >
                  <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>

                {/* Admin Badge */}
                {user?.isAdmin && (
                  <Link
                    href="/admin"
                    className="text-primary/80 hover:text-accent-gold transition-all duration-200 hover:scale-105 cursor-pointer"
                    title="Admin Panel"
                  >
                    <Shield className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </Link>
                )}

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="text-primary/80 hover:text-accent-gold transition-all duration-200 hover:scale-105 cursor-pointer flex items-center relative"
                  title="Wishlist"
                >
                  <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full font-semibold">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <button
                  onClick={toggleCart}
                  className="text-primary/80 hover:text-accent-gold transition-all duration-200 relative hover:scale-105 cursor-pointer"
                  title="Cart"
                >
                  <ShoppingBag
                    className="w-[18px] h-[18px]"
                    strokeWidth={1.5}
                  />
                  {items.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent-gold text-white text-[9px] flex items-center justify-center rounded-full font-semibold">
                      {items.length}
                    </span>
                  )}
                </button>

                {/* Account - VERY RIGHT */}
                <UserMenu />
              </div>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              className="lg:hidden text-primary ml-4 cursor-pointer"
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
              <span className="text-xl font-serif uppercase tracking-widest">
                Menu
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Simple Mobile List for now */}
            <nav className="flex flex-col gap-6 overflow-y-auto">
              <Link
                href="/new-arrivals"
                className="text-2xl font-serif text-accent-gold cursor-pointer"
                onClick={() => setIsMobileOpen(false)}
              >
                New Arrivals
              </Link>
              {categories.map((cat) => (
                <div key={cat.id} className="flex flex-col gap-3">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-xl font-serif text-primary cursor-pointer"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                  {/* Basic nested showing for mobile */}
                  {cat.children && (
                    <div className="pl-4 flex flex-col gap-2 border-l border-primary/10">
                      {cat.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/category/${child.slug}`}
                          onClick={() => setIsMobileOpen(false)}
                          className="text-sm uppercase tracking-wider text-secondary cursor-pointer"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/shop"
                className="text-xl font-serif text-primary mt-4 cursor-pointer"
                onClick={() => setIsMobileOpen(false)}
              >
                Shop All
              </Link>

              <div className="pt-8 border-t border-primary/10 mt-4">
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm uppercase tracking-widest text-secondary hover:text-primary transition-colors cursor-pointer"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Sign In / Join
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
