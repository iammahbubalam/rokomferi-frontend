"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeFromCart, updateQuantity, total } =
    useCart();
  const [shippingThreshold] = useState(15000); // Free shipping threshold

  const progress = Math.min((total / shippingThreshold) * 100, 100);
  const remaining = shippingThreshold - total;

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
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
              <h2 className="font-serif text-2xl text-primary">
                Shopping Bag ({items.length})
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <p className="text-sm text-primary mb-2">
                  {remaining > 0 ? (
                    <span>
                      Spend{" "}
                      <span className="font-bold">
                        ৳{remaining.toLocaleString()}
                      </span>{" "}
                      more for{" "}
                      <span className="text-accent-gold font-medium">
                        Free Shipping
                      </span>
                    </span>
                  ) : (
                    <span className="text-green-700 font-medium">
                      ✨ You've unlocked Free Shipping!
                    </span>
                  )}
                </p>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="font-serif text-xl text-primary">
                    Your bag is empty
                  </h3>
                  <p className="text-sm text-secondary max-w-[200px]">
                    Explore our collection and find something timeless.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={toggleCart}
                    className="mt-4"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div layout key={item.id} className="flex gap-4 group">
                    {/* Image */}
                    <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden rounded-sm">
                      <Image
                        src={item.images?.[0] || ""}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={toggleCart}
                          >
                            <h4 className="font-serif text-base text-primary leading-tight hover:text-accent-gold transition-colors">
                              {item.name}
                            </h4>
                          </Link>
                          <span className="text-sm font-medium text-primary whitespace-nowrap">
                            ৳
                            {(
                              item.salePrice ||
                              item.basePrice ||
                              0
                            ).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-secondary uppercase tracking-wide mt-1">
                          {item.categories?.[0]?.name}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 rounded-sm">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-50 text-secondary hover:text-primary transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-50 text-secondary hover:text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-secondary hover:text-status-error transition-colors underline decoration-transparent hover:decoration-status-error underline-offset-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-secondary">
                    <span>Subtotal</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-secondary">
                    <span>Shipping</span>
                    <span className="text-primary">
                      {remaining <= 0 ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-lg font-serif text-primary pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={toggleCart}
                  className="block w-full"
                >
                  <Button className="w-full py-4 text-xs font-bold tracking-[0.15em] uppercase">
                    Checkout Securely
                  </Button>
                </Link>
                <p className="text-[10px] text-center text-gray-400">
                  Tax included. Returns accepted within 30 days.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
