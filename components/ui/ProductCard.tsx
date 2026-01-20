"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { ShoppingBag, CreditCard } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";

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
      : 0;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    router.push("/checkout");
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
        </div>

        {/* Buttons - Block Style (Reveal on hover desktop, visible on touch if desired or kept hidden until interaction) */}
        {/* Design Choice: Reveal on hover for luxury feel. */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 flex h-11 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
            {/* Add to Cart - White */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-white text-black border-t border-r border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              <ShoppingBag size={14} />
              <span>Add</span>
            </button>
            {/* Buy Now - Accent (Gold/Primary) */}
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#D4AF37] text-white hover:bg-black border-t border-[#D4AF37] hover:border-black flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              <CreditCard size={14} />
              <span>Buy Now</span>
            </button>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] z-20">
            <span className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest font-bold">
              Sold Out
            </span>
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
