"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { ShoppingBag, CreditCard } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import { WishlistButton } from "@/components/common/WishlistButton";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Direct Checkout: Don't add to cart, just redirect with params
    router.push(`/checkout?type=direct&productId=${product.id}&quantity=1`);
  };

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

        {/* Wishlist Button */}
        <WishlistButton
          product={product}
          className="absolute top-3 right-3 z-20 bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm"
        />

        {/* Buttons - Block Style with tactile feedback */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 flex h-11 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
            {/* Add to Cart - White with click feedback */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-white text-black border-t border-r border-gray-200 hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-150"
            >
              <ShoppingBag size={14} />
              <span>Add</span>
            </button>
            {/* Buy Now - Gold with click feedback */}
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#D4AF37] text-white hover:bg-[#c9a432] active:bg-[#b8942d] active:scale-[0.98] border-t border-[#D4AF37] hover:border-[#c9a432] flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-150"
            >
              <CreditCard size={14} />
              <span>Buy Now</span>
            </button>
          </div>
        )}
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
