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
        fetch(getApiUrl("/cart"), {
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
          })
          .catch((error) => {
            console.error("Cart sync failed, rolling back:", error);
            // ROLLBACK: Revert to previous state
            setItems(previousItems);
            // TODO: Show toast notification to user
          });
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
            // TODO: Toast error
          });
      }
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    // 1. Store previous
    const previousItems = [...items];

    // 2. OPTIMISTIC UPDATE
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );

    // 3. BACKGROUND SYNC
    if (user) {
      const token = localStorage.getItem("token");
      if (token) {
        // Debouncing could be good here, but for now direct sync implies "Save"
        // Actually, for quantity, usually we send the DELTA or the NEW TOTAL.
        // The backend /cart POST adds to existing? Or sets?
        // Usually POST /cart adds. We might need a PUT /cart/items/{id} or similar to set absolute quantity.
        // Looking at addToCart logic: it sends { productId, quantity: 1 } via POST.
        // If backend only supports ADD, we might have trouble setting exact quantity if we decrease.
        // Let's assume for now we don't have a specific "Update Quantity" endpoint verified?
        // Wait, looking at lines 85-94 in original file:
        /*
          body: JSON.stringify({
            productId: item.id,
            quantity: item.quantity,
          }),
        */
        // This was for merging.
        // Let's try to assume POST /cart adds, so we might need a specific PUT endpoint?
        // Or if the backend implementation logic (which I don't see) handles "set".
        // Use standard convention: If I can't verify backend, I'll stick to local state for quantity for now
        // BUT user asked for "blazingly fast remove". I fixed remove.
        // Update Quantity was just missing. I will leave updateQuantity local-only
        // for safety unless I confirm backend supports it, TO AVOID BREAKING IT.
        // Wait, if I don't sync quantity, it reverts on refresh.
        // I will add a TODO or try a likely endpoint strictly for the "Remove" task requested.
        // Actually, stick to the USER REQUEST: "when i click remove it took too muh time".
        // I will ONLY fix removeFromCart to be optimistic.
        // I will leave updateQuantity as is to avoid scope creep/bugs.
      }
    }
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
