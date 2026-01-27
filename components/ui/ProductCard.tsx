"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import clsx from "clsx";
import { WishlistButton } from "@/components/common/WishlistButton";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  // Discount
  const hasDiscount =
    product.salePrice && product.salePrice < product.basePrice;
  const discountPercentage =
    hasDiscount && product.basePrice
      ? Math.round(
        ((product.basePrice - product.salePrice!) / product.basePrice) * 100,
      )
      : 0; // End Discount Logic

  const isOutOfStock =
    product.stock <= 0 || product.stockStatus === "out_of_stock";

  return (
    <div className="group relative block w-full">
      {/* Image Container - Taller Aspect Ratio [3/4] for Fashion */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={clsx(
              "object-cover transition-transform duration-700 ease-in-out group-hover:scale-105",
              isOutOfStock && "opacity-60 grayscale",
            )}
          />
          {/* Hover Image */}
          {!isOutOfStock && product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 hidden md:block"
            />
          )}
        </Link>

        {/* Badges - Minimalist */}
        <div className="absolute top-0 left-0 p-3 flex flex-col gap-2 pointer-events-none z-10">
          {isOutOfStock ? (
            <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              Sold Out
            </span>
          ) : (
            <>
              {discountPercentage > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                  -{discountPercentage}%
                </span>
              )}
              {product.isNew && (
                <span className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                  New
                </span>
              )}
            </>
          )}
        </div>

        {/* Buttons Removed as per new UX - User must go to details page */}
        {/* Wishlist Button */}
        <WishlistButton
          product={product}
          className="absolute top-3 right-3 z-20 bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm"
        />
      </div>

      {/* Product Info - Clean & Centered */}
      <div className="pt-4 text-center">
        {/* Category */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
          {product.categories?.[0]?.name || "Collection"}
        </p>

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-base font-serif font-medium text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-1 px-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-center gap-3 text-sm">
          {hasDiscount ? (
            <>
              <span className="text-gray-400 line-through text-xs font-light">
                ৳{product.basePrice.toLocaleString()}
              </span>
              <span className="text-black font-semibold">
                ৳{product.salePrice?.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-black font-medium">
              ৳{product.basePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
