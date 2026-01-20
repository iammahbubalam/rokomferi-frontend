"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart, CartItem } from "@/context/CartContext";
import { Product } from "@/types";
import { getProductById } from "@/lib/api/shop";

export type CheckoutMode = "cart" | "direct";
export type CheckoutStatus =
  | "initializing"
  | "ready"
  | "submitting"
  | "success"
  | "error";

export interface CheckoutState {
  status: CheckoutStatus;
  mode: CheckoutMode;
  items: CartItem[];
  total: number;
  error?: string;
  isDirectLoading: boolean;
}

export interface UseCheckoutFlowResult {
  state: CheckoutState;
  setState: React.Dispatch<React.SetStateAction<CheckoutState>>;
  refresh: () => void;
}

export function useCheckoutFlow(): UseCheckoutFlowResult {
  const searchParams = useSearchParams();
  const { items: cartItems, total: cartTotal } = useCart();

  // Initial State Derivation
  const isDirect = searchParams.get("type") === "direct";

  const [state, setState] = useState<CheckoutState>({
    status: "initializing",
    mode: isDirect ? "direct" : "cart",
    items: [],
    total: 0,
    isDirectLoading: isDirect, // Start true if direct
    error: undefined,
  });

  // State Machine Trigger
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      // 1. DIRECT MODE
      if (isDirect) {
        const productId = searchParams.get("productId");
        const qty = parseInt(searchParams.get("quantity") || "1");

        // VALIDATION: Missing Params
        if (!productId) {
          if (isMounted) {
            setState((prev) => ({
              ...prev,
              status: "error",
              isDirectLoading: false,
              error: "Invalid checkout link. Product ID missing.",
            }));
          }
          return;
        }

        try {
          const product = await getProductById(productId);

          // VALIDATION: Product Not Found
          if (!product) {
            if (isMounted) {
              setState((prev) => ({
                ...prev,
                status: "error",
                isDirectLoading: false,
                error: "Product not found or invalid link.",
              }));
            }
            return;
          }

          // VALIDATION: Out of Stock
          if (product.stock <= 0 || product.stockStatus === "out_of_stock") {
            if (isMounted) {
              setState((prev) => ({
                ...prev,
                status: "error",
                isDirectLoading: false,
                error: "This product is currently out of stock.",
              }));
            }
            return;
          }

          // SUCCESS: Direct Item Ready
          if (isMounted) {
            const directItem: CartItem = { ...product, quantity: qty };
            const directTotal =
              (product.salePrice && product.salePrice < product.basePrice
                ? product.salePrice
                : product.basePrice) * qty;

            setState((prev) => ({
              ...prev,
              status: "ready", // State Machine Transition -> READY
              isDirectLoading: false,
              items: [directItem],
              total: directTotal,
              error: undefined,
            }));
          }
        } catch (error) {
          // ERROR: Fetch Failed
          console.error(error);
          if (isMounted) {
            setState((prev) => ({
              ...prev,
              status: "error",
              isDirectLoading: false,
              error: "Failed to load product. Please check your connection.",
            }));
          }
        }
      }
      // 2. CART MODE
      else {
        // Just sync with CartContext, but wrapper in effect to be consistent
        // We only transition to READY here. Empty check happens in UI or can be an error state.
        // For now, let's keep it READY so the UI can show "Empty Bag" message naturally.

        setState((prev) => ({
          ...prev,
          status: "ready",
          mode: "cart",
          isDirectLoading: false,
          items: cartItems,
          total: cartTotal,
          error: undefined, // Clear any previous errors
        }));
      }
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, [isDirect, searchParams, cartItems, cartTotal]);

  const refresh = () => {
    // Logic to re-trigger initialization if needed
    // For cart mode, it auto-syncs via dependency array.
    // For direct mode, this is less relevant unless retrying a failed fetch.
    const currentUrl = new URL(window.location.href);
    window.location.href = currentUrl.toString(); // Hard refresh for simple retry
  };

  return { state, setState, refresh };
}
