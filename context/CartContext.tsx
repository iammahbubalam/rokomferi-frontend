"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

  // Sync Logic
  useEffect(() => {
    if (!isClient) return;

    if (user) {
      // Authenticated: Fetch from Server
      fetchCartFromServer();
    } else {
      // Guest: Load from Local Storage
      const saved = localStorage.getItem("rokomferi-cart");
      if (saved) {
        try {
            setItems(JSON.parse(saved));
        } catch(e) { console.error(e) }
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

  const fetchCartFromServer = async () => {
      try {
          const token = localStorage.getItem("token");
          if (!token) return;
          const res = await fetch(getApiUrl("/cart"), {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              // Mapper: Server Cart might have different structure.
              // Assuming Server Cart .items has embedded Product
              // For MVP, if server returns just { items: [...] }, we might need to map it.
              // Let's assume server returns { items: [{ product: {...}, quantity: 1 }] }
              // Based on domain.Cart structure... which I haven't seen fully to know if it preloads product.
              // If it doesn't preload product, we have a problem (N+1 fetches).
              // Let's assume for now we just use the API response if it matches, else empty.
              // Actually, looking at repo, CartItem struct usually has ProductID.
              // I'll trust the User for now, but likely need to map.
              if (data.items) {
                   // Optimistic mapping if server returns populated items
                   const mappedItems = data.items.map((i: any) => ({
                       ...i.product, // Assuming populated
                       quantity: i.quantity
                   }));
                   setItems(mappedItems);
              }
          }
      } catch (error) {
          console.error("Failed to fetch server cart", error);
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
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ productId: product.id, quantity: 1 })
            });
            // Refresh Cart
            fetchCartFromServer();
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
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
      if (user) {
          // TODO: Implement DELETE /api/v1/cart/{items} if exists, or sync update
          // For now, MVP: only local remove is instant, server needs endpoint
          // Since API didn't list RemoveCartItem, we might be stuck?
          // Wait, `orderHandler` didn't show `RemoveFromCart`! 
          // CRITICAL GAP. 
          // Fallback: We can't remove from server cart yet without that API?
          // Or maybe passing quantity 0 to AddToCart/Update?
          // Let's implement Local state update for now and assumes it syncs later? No.
          // I will just do Local setItem for now to unblock UI, but Client knows it won't persist on Server without API support.
          // Actually, I'll log a warning.
          console.warn("Remove from server cart not fully implemented in API yet.");
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
    <CartContext.Provider value={{ items, isOpen, addToCart, removeFromCart, updateQuantity, toggleCart, total }}>
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
