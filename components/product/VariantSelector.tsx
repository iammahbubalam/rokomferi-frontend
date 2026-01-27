"use client";

import { ProductVariant } from "@/lib/data";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({ variants, selectedVariantId, onSelect }: VariantSelectorProps) {
  // If only one variant exists and it's default/dummy, we might hide this, 
  // but for now we assume valid variants if the array is present.

  if (!variants || variants.length === 0) return null;

  // Group by option type if needed, but for now we'll assume a flat Size list for simplicity
  // strictly tailored to the current data structure (which focuses on Size).

  return (
    <div className="space-y-3">
      <span className="text-xs uppercase tracking-widest text-secondary font-medium">Select Size</span>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isOutOfStock = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onSelect(variant)}
              disabled={isOutOfStock}
              className={clsx(
                "min-w-[3rem] h-12 px-4 border text-sm font-medium transition-all duration-200 uppercase",
                isSelected
                  ? "border-primary bg-primary text-white"
                  : "border-primary/20 text-primary hover:border-primary",
                isOutOfStock && "opacity-40 cursor-not-allowed decoration-slice line-through"
              )}
            >
              {variant.options.size || variant.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
