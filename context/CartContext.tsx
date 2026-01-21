"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Product } from "@/types";
import { getApiUrl } from "@/lib/utils";
import { useAuth } from "./AuthContext";
import { useDialog } from "./DialogContext";

export interface CartItem extends Product {
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

  // Pending Adds Ref (to prevent race conditions)
  const pendingAdds = useRef<Record<string, Promise<void>>>({});

  const addToCart = (product: Product) => {
    // Store previous state for potential rollback
    const previousItems = [...items];

    // OPTIMISTIC UPDATE: Update UI immediately
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // BACKGROUND SYNC with ROLLBACK on failure
    if (user) {
      const token = localStorage.getItem("token");
      if (token) {
        // Create the promise
        const addPromise = fetch(getApiUrl("/cart"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Server rejected cart update");
            }
            // Success toast
            dialog.toast({ message: "Added to cart!", variant: "success" });
          })
          .catch((error) => {
            console.error("Cart sync failed, rolling back:", error);
            // ROLLBACK: Revert to previous state
            setItems(previousItems);
            // Error toast
            dialog.toast({
              message: "Failed to add to cart",
              variant: "danger",
            });
          })
          .finally(() => {
            // Cleanup pending promise
            delete pendingAdds.current[product.id];
          });

        // Store the promise
        pendingAdds.current[product.id] = addPromise;
      }
    }
  };

  const removeFromCart = (productId: string) => {
    if (!productId) return;

    // 1. Store previous state for rollback
    const previousItems = [...items];

    // 2. OPTIMISTIC UPDATE: Remove immediately
    setItems((prev) => prev.filter((item) => item.id !== productId));

    // 3. BACKGROUND SYNC
    if (user) {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(getApiUrl(`/cart/${productId}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Remove failed");
          })
          .catch((error) => {
            console.error("Remove failed, rolling back", error);
            setItems(previousItems); // Rollback
            dialog.toast({
              message: "Failed to remove item",
              variant: "danger",
            });
          });
      }
    }
  };

  // Debounce Ref
  const updateTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    // Clear existing timeout
    if (updateTimeouts.current[productId]) {
      clearTimeout(updateTimeouts.current[productId]);
    }

    // Capture state for rollback
    const previousItems = [...items];

    // OPTIMISTIC UPDATE
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );

    // DEBOUNCED SYNC
    if (user) {
      updateTimeouts.current[productId] = setTimeout(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const res = await fetch(getApiUrl("/cart"), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId, quantity }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to update quantity");
          }

          // Success - cart is already updated optimistically
        } catch (error) {
          console.error("Update failed, rolling back", error);
          // Rollback
          setItems((currentItems) => {
            const originalItem = previousItems.find((i) => i.id === productId);
            if (!originalItem) return currentItems;
            return currentItems.map((item) =>
              item.id === productId ? originalItem : item,
            );
          });

          // Show error toast
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update quantity";
          dialog.toast({ message: errorMessage, variant: "danger" });
        } finally {
          delete updateTimeouts.current[productId];
        }
      }, 1000); // 1 second debounce for smoother UX
    }
  };

  const toggleCart = () => setIsOpen((prev) => !prev);

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("rokomferi-cart");
  };

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
