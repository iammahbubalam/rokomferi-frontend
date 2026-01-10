"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import clsx from "clsx";

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeFromCart, total } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-main z-[101] shadow-2xl flex flex-col border-l border-primary/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-primary/10 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-primary">Your Bag</h2>
              <button 
                onClick={toggleCart}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-secondary" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-primary/20" />
                  <p className="font-serif text-lg text-primary">Your bag is empty.</p>
                  <p className="text-xs text-secondary uppercase tracking-widest">Start filling it up with heritage.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 h-32 bg-main-secondary flex-shrink-0">
                      <Image
                        src={item.media[0].url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-lg text-primary leading-tight pr-4">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] uppercase tracking-widest text-secondary/60 hover:text-status-error transition-colors border-b border-transparent hover:border-status-error"
                          >
                            Remove
                          </button>
                        </div>
                        <span className="text-secondary text-xs uppercase tracking-wide mt-1 block">{item.category}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm font-medium text-primary">Quantity: {item.quantity}</span>
                        <span className="text-lg text-primary">৳{((item.pricing.salePrice || item.pricing.basePrice) * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-primary/10 bg-main-secondary space-y-6">
                <div className="flex items-center justify-between text-lg font-medium text-primary">
                  <span>Subtotal</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-secondary text-center">Shipping and taxes calculated at checkout.</p>
                <Link href="/checkout" onClick={toggleCart} className="w-full">
                  <Button className="w-full py-4 text-sm font-medium tracking-widest uppercase">
                    Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
