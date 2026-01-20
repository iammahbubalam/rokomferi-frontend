"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import clsx from "clsx";
import { ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "inverted"; // default = light bg, inverted = dark bg
  aspectRatio?: "portrait" | "square";
}

export function ProductCard({
  product,
  variant = "default",
  aspectRatio = "portrait",
}: ProductCardProps) {
  const textColor = variant === "inverted" ? "text-white" : "text-primary";
  const secondaryColor =
    variant === "inverted" ? "text-white/60" : "text-secondary";

  // Format Price
  const formattedPrice = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(product.salePrice || product.basePrice);

  return (
    <div className="group relative flex flex-col gap-4">
      {/* Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative overflow-hidden bg-gray-100"
      >
        <div
          className={clsx(
            "relative w-full transition-transform duration-700 ease-out group-hover:scale-105",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
          )}
        >
          {/* Main Image */}
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
              No Image
            </div>
          )}

          {/* Hover Image (if available) - Simple Fade */}
          {product.images && product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.salePrice && (
            <span className="bg-accent-gold text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1">
              Sale
            </span>
          )}
          {product.stockStatus === "out_of_stock" && (
            <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-2 py-1">
              Sold Out
            </span>
          )}
        </div>

        {/* Hover Actions - Minimalist Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-3">
          <button
            className="bg-white text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors shadow-lg"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="bg-white text-primary p-3 rounded-full hover:bg-primary hover:text-white transition-colors shadow-lg"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </Link>

      {/* Details - Minimalist */}
      <div className="flex flex-col items-start gap-1">
        {product.categories && product.categories[0] && (
          <span
            className={clsx(
              "text-[10px] uppercase tracking-widest opacity-70",
              secondaryColor,
            )}
          >
            {product.categories[0].name}
          </span>
        )}

        <Link
          href={`/product/${product.slug}`}
          className="group-hover:text-accent-gold transition-colors"
        >
          <h3 className={clsx("font-serif text-lg leading-tight", textColor)}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <span
            className={clsx("font-medium text-sm tracking-wide", textColor)}
          >
            {formattedPrice}
          </span>
          {product.salePrice && (
            <span className="text-xs text-red-500/70 line-through">
              {new Intl.NumberFormat("en-BD", {
                style: "currency",
                currency: "BDT",
                minimumFractionDigits: 0,
              }).format(product.basePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
