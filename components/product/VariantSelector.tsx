"use client";

import { Variant } from "@/types";
import { useState, useEffect, useMemo } from "react";
import clsx from "clsx";

interface VariantSelectorProps {
  variants: Variant[];
  selectedVariantId?: string;
  onSelect: (variant: Variant | undefined) => void;
}

export function VariantSelector({ variants, selectedVariantId, onSelect }: VariantSelectorProps) {
  // 1. Extract all available attribute keys (e.g., ["Color", "Size"])
  const attributeKeys = useMemo(() => {
    const keys = new Set<string>();
    variants.forEach((v) => {
      if (v.attributes) {
        Object.keys(v.attributes).forEach((k) => keys.add(k));
      }
    });
    // Sort keys mostly for consistency (Color first usually looks best)
    return Array.from(keys).sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      if (aLower.includes("color") || aLower.includes("colour")) return -1;
      if (bLower.includes("color") || bLower.includes("colour")) return 1;
      return 0;
    });
  }, [variants]);

  // 2. State for selections per attribute (e.g., { Color: "Red", Size: "M" })
  // Initialize from selectedVariantId if provided
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    if (selectedVariantId) {
      const found = variants.find(v => v.id === selectedVariantId);
      if (found?.attributes) return { ...found.attributes };
    }
    // Auto-select defaults? Maybe not, forcing user choice is safer for "L9" accuracy unless 1 option.
    // If only 1 variant exists, ProductInfo already handles auto-selection.
    return {};
  });

  // Sync state if prop changes externally
  useEffect(() => {
    if (selectedVariantId) {
      const found = variants.find(v => v.id === selectedVariantId);
      if (found?.attributes) {
        setSelections(prev => {
          // Only update if different to avoid loops
          const isDiff = Object.keys(found.attributes).some(k => found.attributes[k] !== prev[k]);
          return isDiff ? { ...found.attributes } : prev;
        });
      }
    }
  }, [selectedVariantId, variants]);

  // 3. Handle selection change
  const handleSelect = (key: string, value: string) => {
    // If clicking the same value, do we deselect? No, usually toggle off is annoying for required fields.
    const newSelections = { ...selections, [key]: value };

    // Check if this new combination invalidates other selections (e.g. Red selected, but current Size M is not available in Red)
    // If invalid, we might keep it (letting user see it's unavailable) or clear it.
    // "Smart" behavior: Keep it, but show it as unavailable/invalid combination.
    // OR: Clear downstream selections. 
    // For now: Keep it simple. Update state.

    setSelections(newSelections);

    // Try to find an exact match for ALL keys
    // We only propagate a match if ALL attributes are selected
    const allSelected = attributeKeys.every(k => newSelections[k]);

    if (allSelected) {
      const match = variants.find((v) => {
        if (!v.attributes) return false;
        return attributeKeys.every((k) => v.attributes[k] === newSelections[k]);
      });
      onSelect(match);
    } else {
      onSelect(undefined);
    }
  };

  // 4. Linked Options Logic
  const isValueAvailable = (key: string, value: string) => {
    // Current selections excluding the key we are checking
    const otherSelections = { ...selections };
    delete otherSelections[key];

    // Does any valid variant exist with this value AND compatible with other current selections?
    return variants.some((v) => {
      if (v.stock <= 0) return false;
      if (!v.attributes) return false;
      if (v.attributes[key] !== value) return false;

      // Check compatibility with other ALREADY SELECTED attributes
      return Object.entries(otherSelections).every(([k, val]) => {
        // If val is selected for k, the variant must match it.
        // If not selected, it's compatible.
        return !val || v.attributes[k] === val;
      });
    });
  };

  if (attributeKeys.length === 0) return null;

  return (
    <div className="space-y-6">
      {attributeKeys.map((key) => {
        // Get all unique values for this key from ALL variants
        const values = Array.from(new Set(variants.map(v => v.attributes?.[key]).filter(Boolean)));
        const isColor = key.toLowerCase() === "color" || key.toLowerCase() === "colour";

        return (
          <div key={key} className="space-y-3">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-secondary font-medium">
              <span>{key}</span>
              {selections[key] && <span className="text-primary font-bold">{selections[key]}</span>}
            </div>

            <div className="flex flex-wrap gap-3">
              {values.map((value) => {
                const isSelected = selections[key] === value;
                const isAvailable = isValueAvailable(key, value);

                if (isColor) {
                  return (
                    <button
                      key={value}
                      onClick={() => handleSelect(key, value)}
                      title={`${value}${!isAvailable ? ' - Unavailable' : ''}`}
                      className={clsx(
                        "w-8 h-8 rounded-full border flex items-center justify-center transition-all relative",
                        isSelected
                          ? "ring-2 ring-primary ring-offset-2 border-transparent scale-110"
                          : "border-gray-200 hover:border-gray-400 hover:scale-105",
                        !isAvailable && "opacity-50 cursor-not-allowed"
                      )}
                      style={{ backgroundColor: value?.toLowerCase() }} // Fallback to CSS name
                    >
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-gray-500 rotate-45" />
                        </div>
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={value}
                    onClick={() => handleSelect(key, value)}
                    className={clsx(
                      "min-w-[3rem] h-10 px-4 border text-sm font-medium transition-all duration-200 uppercase flex items-center justify-center relative",
                      isSelected
                        ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                        : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white",
                      !isAvailable && "opacity-50 text-gray-400 border-gray-100 bg-gray-50 cursor-not-allowed"
                    )}
                  >
                    {value}
                    {!isAvailable && (
                      <svg className="absolute w-full h-full text-gray-300 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
