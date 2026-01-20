"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Plus } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-32 bg-white border-t border-primary/5">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Minimal Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-gold mb-4 block">
            New Season
          </span>
          <h2 className="font-serif text-5xl md:text-6xl text-primary leading-none">
            Latest Arrivals
          </h2>
        </div>

        {/* Product Grid - 4 Columns Desktop / Scrollable Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        {/* View All Footer */}
        <div className="text-center mt-20">
          <Link
            href="/shop"
            className="inline-block border-b border-primary pb-1 text-xs uppercase tracking-[0.2em] hover:text-accent-gold hover:border-accent-gold transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Container 4:5 Aspect Ratio */}
        <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-[#f8f8f8]">
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Secondary Image Reveal (Optional) */}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}

          {/* New Badge */}
          {product.isNew && (
            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest bg-white/90 px-2 py-1">
                New
              </span>
            </div>
          )}

          {/* Quick Add Button (Appears on Hover) */}
          <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-10 h-10 bg-white flex items-center justify-center rounded-full shadow-md hover:bg-primary hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="text-center">
          <h3 className="font-serif text-xl text-primary mb-2 line-clamp-1 group-hover:text-accent-gold transition-colors">
            {product.name}
          </h3>

          <div className="text-sm font-medium text-primary/80">
            {product.salePrice && product.salePrice < product.basePrice ? (
              <div className="flex items-center justify-center gap-2">
                <span className="line-through text-primary/40">
                  ৳{product.basePrice.toLocaleString()}
                </span>
                <span className="text-accent-gold">
                  ৳{product.salePrice.toLocaleString()}
                </span>
              </div>
            ) : (
              <span>৳{(product.basePrice || 0).toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
