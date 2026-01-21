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
import { useDialog } from "./DialogContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // 1. QUERY: Fetch Cart (Guest from LS, User from API)
  const { data: items = [] } = useQuery({
    queryKey: ["cart", user?.id || "guest"],
    queryFn: async () => {
      // GUEST MODE
      if (!user) {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem("rokomferi-cart");
        return saved ? (JSON.parse(saved) as CartItem[]) : [];
      }

      // USER MODE
      const token = localStorage.getItem("token");
      if (!token) return [];

      const res = await fetch(getApiUrl("/cart"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      if (data.items) {
        return data.items.map((i: any) => ({
          ...i.product,
          quantity: i.quantity,
        })) as CartItem[];
      }
      return [];
    },
    // Guest cart doesn't change from outside, User cart might
    staleTime: user ? 1000 * 60 : Infinity,
  });

  // 2. MUTATION: Add to Cart
  const addMutation = useMutation({
    mutationFn: async (product: Product) => {
      // GUEST
      if (!user) {
        const current =
          queryClient.getQueryData<CartItem[]>(["cart", "guest"]) || [];
        const existing = current.find((i) => i.id === product.id);
        const newItem = existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { ...product, quantity: 1 };

        const newItems = existing
          ? current.map((i) => (i.id === product.id ? newItem : i))
          : [...current, newItem];

        localStorage.setItem("rokomferi-cart", JSON.stringify(newItems));
        return newItems;
      }

      // USER
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl("/cart"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add");
      return null;
    },
    onMutate: async (product) => {
      // Optimistic Update
      const key = ["cart", user?.id || "guest"];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CartItem[]>(key) || [];

      const existing = previous.find((i) => i.id === product.id);
      const optimistic = existing
        ? previous.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...previous, { ...product, quantity: 1 }];

      queryClient.setQueryData(key, optimistic);
      return { previous };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ["cart", user?.id || "guest"],
        context?.previous,
      );
      dialog.toast({ message: "Failed to add to cart", variant: "danger" });
    },
    onSettled: () => {
      // Re-fetch to confirm server state
      if (user) queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
      else queryClient.invalidateQueries({ queryKey: ["cart", "guest"] });
      dialog.toast({ message: "Added to cart!", variant: "success" });
    },
  });

  const addToCart = (product: Product) => {
    addMutation.mutate(product);
  };

  // 3. MUTATION: Remove
  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) {
        const current =
          queryClient.getQueryData<CartItem[]>(["cart", "guest"]) || [];
        const newItems = current.filter((i) => i.id !== productId);
        localStorage.setItem("rokomferi-cart", JSON.stringify(newItems));
        return;
      }

      const token = localStorage.getItem("token");
      await fetch(getApiUrl(`/cart/${productId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onMutate: async (productId) => {
      const key = ["cart", user?.id || "guest"];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CartItem[]>(key) || [];
      queryClient.setQueryData(
        key,
        previous.filter((i) => i.id !== productId),
      );
      return { previous };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(
        ["cart", user?.id || "guest"],
        context?.previous,
      );
      dialog.toast({ message: "Failed to remove item", variant: "danger" });
    },
    onSettled: () => {
      if (user) queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
      else queryClient.invalidateQueries({ queryKey: ["cart", "guest"] });
    },
  });

  const removeFromCart = (productId: string) =>
    removeMutation.mutate(productId);

  // 4. MUTATION: Update Quantity
  const updateMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (!user) {
        const current =
          queryClient.getQueryData<CartItem[]>(["cart", "guest"]) || [];
        const newItems = current.map((i) =>
          i.id === id ? { ...i, quantity } : i,
        );
        localStorage.setItem("rokomferi-cart", JSON.stringify(newItems));
        return;
      }

      const token = localStorage.getItem("token");
      await fetch(getApiUrl("/cart"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity }),
      });
    },
    onMutate: async ({ id, quantity }) => {
      const key = ["cart", user?.id || "guest"];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<CartItem[]>(key) || [];
      queryClient.setQueryData(
        key,
        previous.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
      return { previous };
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(
        ["cart", user?.id || "guest"],
        context?.previous,
      );
      dialog.toast({ message: "Failed to update quantity", variant: "danger" });
    },
    onSettled: () => {
      if (user) queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
      else queryClient.invalidateQueries({ queryKey: ["cart", "guest"] });
    },
  });

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    updateMutation.mutate({ id: productId, quantity });
  };

  const clearCart = () => {
    // Basic clear impl
    if (!user) {
      localStorage.removeItem("rokomferi-cart");
      queryClient.setQueryData(["cart", "guest"], []);
    } else {
      // If backend has clear endpoint, call it. Otherwise local state reset + maybe loop delete?
      // Assuming for now just cleaning state primarily or logout scenario
      queryClient.setQueryData(["cart", user.id], []);
    }
  };

  const toggleCart = () => setIsOpen((prev) => !prev);

  const total = items.reduce((sum, item) => {
    const price = item.salePrice || item.basePrice;
    return sum + price * item.quantity;
  }, 0);

  // 5. MERGE LOGIC (Effect)
  useEffect(() => {
    if (user) {
      const guestCartRaw = localStorage.getItem("rokomferi-cart");
      if (guestCartRaw) {
        const guestItems: CartItem[] = JSON.parse(guestCartRaw);
        if (guestItems.length > 0) {
          // Perform Merge
          const token = localStorage.getItem("token");
          Promise.all(
            guestItems.map((item) =>
              fetch(getApiUrl("/cart"), {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  productId: item.id,
                  quantity: item.quantity,
                }),
              }),
            ),
          )
            .then(() => {
              // Clear guest cart
              localStorage.removeItem("rokomferi-cart");
              // Invalidate to fetch merged server state
              queryClient.invalidateQueries({ queryKey: ["cart", user.id] });
              dialog.toast({
                message: "Cart merged from previous session",
                variant: "info",
              });
            })
            .catch(console.error);
        }
      }
    }
  }, [user, queryClient, dialog]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
export type { CartItem };
