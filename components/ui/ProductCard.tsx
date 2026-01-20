"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { ShoppingBag, CreditCard, Plus } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "grid" | "list" | "compact";
  aspectRatio?: string; // Tailwind class, e.g., "aspect-[3/4]"
  showQuickAdd?: boolean;
  showBadges?: boolean;
  className?: string; // For layout overrides
  priority?: boolean; // For LCP optimization
}

export function ProductCard({
  product,
  index = 0,
  variant = "grid",
  aspectRatio = "aspect-[4/5]",
  showQuickAdd = true,
  showBadges = true,
  className,
  priority = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  // --- DATA DERIVATION ---

  // Discount Calculation
  const hasDiscount =
    product.salePrice && product.salePrice < product.basePrice;
  const discountPercentage =
    hasDiscount && product.basePrice
      ? Math.round(
          ((product.basePrice - product.salePrice!) / product.basePrice) * 100,
        )
      : 0;

  // Stock Logic
  const isOutOfStock = product.stock <= 0;
  // Low stock warning (e.g., < 5)
  const isLowStock =
    !isOutOfStock && product.stock <= (product.lowStockThreshold || 5);

  // Category Label Fallback
  const categoryLabel =
    product.categories && product.categories.length > 0
      ? product.categories[0].name
      : "Collection";

  // --- HANDLERS ---

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    router.push("/checkout");
  };

  // --- RENDER ---

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }} // Stagger based on index
      className={clsx("group relative block w-full", className)}
    >
      {/* Image Container */}
      <div
        className={clsx(
          "relative mb-4 overflow-hidden bg-[#f4f4f4] w-full",
          aspectRatio, // Dynamic Aspect Ratio
        )}
      >
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={clsx(
              "object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform",
              isOutOfStock && "opacity-60 grayscale",
            )}
          />

          {/* Secondary Image Reveal (Desktop Only) */}
          {!isOutOfStock && product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block" // Hide on mobile to save bandwidth/confusion
            />
          )}
        </Link>

        {/* --- BADGES --- */}
        {showBadges && (
          <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none z-10">
            {discountPercentage > 0 && !isOutOfStock && (
              <span className="bg-accent-gold text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
                -{discountPercentage}%
              </span>
            )}
            {product.isNew && !isOutOfStock && (
              <span className="bg-white/95 backdrop-blur-sm text-primary text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
                New
              </span>
            )}
          </div>
        )}

        {/* --- STOCK OVERLAY --- */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <span className="bg-black/80 text-white px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium backdrop-blur-sm border border-white/20">
              Sold Out
            </span>
          </div>
        )}

        {/* --- ACTIONS: ADD & BUY (Desktop Hover / Mobile Touch Friendly?) --- */}
        {/* We keep this hover-based for "grid" luxury feel. Mobile needs consideration, perhaps usually visible or visible on tap. */}

        {!isOutOfStock && showQuickAdd && (
          <div className="absolute bottom-0 inset-x-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 z-20">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-white text-black hover:bg-black hover:text-white py-2 md:py-3 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-colors shadow-lg border border-black/5 cursor-pointer flex items-center justify-center gap-1.5 md:gap-2"
              aria-label="Add to cart"
            >
              <ShoppingBag size={14} className="shrink-0" />{" "}
              <span className="hidden min-[370px]:inline">Add</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-accent-gold text-white hover:bg-black py-2 md:py-3 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5 md:gap-2"
              aria-label="Buy now"
            >
              <CreditCard size={14} className="shrink-0" />{" "}
              <span className="hidden min-[370px]:inline">Buy Now</span>
            </button>
          </div>
        )}
      </div>

      {/* --- PRODUCT INFO --- */}
      <div className="text-center px-1">
        {/* Category Label */}
        <div className="text-[10px] uppercase tracking-widest text-primary/40 mb-1.5 truncate">
          {categoryLabel}
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="group-hover:underline decoration-primary/30 underline-offset-4"
        >
          <h3 className="font-serif text-lg text-primary mb-1.5 line-clamp-1 group-hover:text-accent-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* SKU (Optional, maybe for Grid List view) - Omitted for Grid */}

        {/* Price */}
        <div className="text-sm font-medium text-primary mb-2 flex items-center justify-center gap-2">
          {hasDiscount ? (
            <>
              <span className="line-through text-primary/40 text-xs">
                {new Intl.NumberFormat("en-BD", {
                  style: "currency",
                  currency: "BDT",
                  minimumFractionDigits: 0,
                }).format(product.basePrice)}
              </span>
              <span className="text-accent-gold font-bold">
                {new Intl.NumberFormat("en-BD", {
                  style: "currency",
                  currency: "BDT",
                  minimumFractionDigits: 0,
                }).format(product.salePrice!)}
              </span>
            </>
          ) : (
            <span>
              {new Intl.NumberFormat("en-BD", {
                style: "currency",
                currency: "BDT",
                minimumFractionDigits: 0,
              }).format(product.basePrice)}
            </span>
          )}
        </div>

        {/* Low Stock Indicator */}
        {isLowStock && (
          <div className="text-[10px] text-red-500 font-medium uppercase tracking-wider animate-pulse">
            Only {product.stock} Left
          </div>
        )}
      </div>
    </motion.div>
  );
}
