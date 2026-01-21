"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getApiUrl } from "@/lib/utils";
import { Product } from "@/types";

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Wishlist on Mount/Login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (user && token) {
      fetchWishlist(token);
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchWishlist = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/wishlist"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    const token = localStorage.getItem("token");
    if (!user || !token) return;

    // Optimistic Update
    const optimisticItem: WishlistItem = {
      id: `temp-${Date.now()}`,
      productId: product.id,
      product: product,
      addedAt: new Date().toISOString(),
    };

    setItems((prev) => [...prev, optimisticItem]);

    try {
      const res = await fetch(getApiUrl("/wishlist"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });
      if (!res.ok) {
        throw new Error("Failed to add");
      }
      // Background re-fetch to ensure sync (optional but safer for IDs)
      // fetchWishlist(token);
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      // Revert
      setItems((prev) => prev.filter((item) => item.productId !== product.id));
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!user || !token) return;

    // Optimistic Update
    setItems((prev) => prev.filter((item) => item.product.id !== productId));

    try {
      await fetch(getApiUrl(`/wishlist/${productId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
      fetchWishlist(token); // Revert on error
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
