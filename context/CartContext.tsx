"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/types";
import { getApiUrl } from "@/lib/utils";
import { useAuth } from "./AuthContext";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync Logic with Cart Merge on Login
  useEffect(() => {
    if (!isClient) return;

    if (user) {
      // Authenticated: Merge guest cart with server cart
      mergeAndSyncCart();
    } else {
      // Guest: Load from Local Storage
      const saved = localStorage.getItem("rokomferi-cart");
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setItems([]);
      }
    }
  }, [user, isClient]);

  // Guest: Save to Local Storage
  useEffect(() => {
    if (!user && isClient) {
      localStorage.setItem("rokomferi-cart", JSON.stringify(items));
    }
  }, [items, user, isClient]);

  // Merge guest cart with server cart on login
  const mergeAndSyncCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // 1. Get guest cart from localStorage
      const guestCartRaw = localStorage.getItem("rokomferi-cart");
      const guestItems: CartItem[] = guestCartRaw
        ? JSON.parse(guestCartRaw)
        : [];

      // 2. If guest cart has items, sync them to server
      if (guestItems.length > 0) {
        // Add each guest item to server cart
        for (const item of guestItems) {
          await fetch(getApiUrl("/cart"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: item.id,
              quantity: item.quantity,
            }),
          });
        }
        // Clear guest cart after merge
        localStorage.removeItem("rokomferi-cart");
      }

      // 3. Fetch merged cart from server
      const res = await fetch(getApiUrl("/cart"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          const mappedItems = data.items.map((i: any) => ({
            ...i.product,
            quantity: i.quantity,
          }));
          setItems(mappedItems);
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error("Failed to merge/fetch cart", error);
    }
  };

  const addToCart = async (product: Product) => {
    if (user) {
      // API Call
      try {
        const token = localStorage.getItem("token");
        await fetch(getApiUrl("/cart"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
        // Refresh Cart
        mergeAndSyncCart();
        setIsOpen(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      // Local Logic
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      setIsOpen(true);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!productId) {
      console.warn("Attempted to remove item with no ID");
      return;
    }

    if (user) {
      // Call DELETE endpoint for authenticated users
      try {
        const token = localStorage.getItem("token");
        await fetch(getApiUrl(`/cart/${productId}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Failed to remove from server cart", error);
      }
    }
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const toggleCart = () => setIsOpen((prev) => !prev);

  const total = items.reduce((sum, item) => {
    const price = item.salePrice || item.basePrice;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
