"use client";

import { Button } from "@/components/ui/Button";
import { CartItem } from "@/context/CartContext";
import { Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { CouponInput } from "@/components/cart/CouponInput";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  grandTotal: number;
  deliveryLocation: string;
  shippingCost: number;
  onCheckout?: () => void;
  isSubmitting?: boolean;
  isFormValid?: boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function OrderSummary({
  items,
  subtotal,
  discountAmount,
  couponCode,
  grandTotal,
  deliveryLocation,
  shippingCost,
  onCheckout,
  isSubmitting = false,
  isFormValid = false,
  onUpdateQuantity,
}: OrderSummaryProps) {
  // L9: Final total includes shipping
  const finalTotal = grandTotal + shippingCost;

  return (
    <div className="bg-white p-8 lg:p-10 shadow-xl border border-primary/5 transition-all hover:shadow-2xl">
      <h2 className="font-serif text-2xl mb-8 border-b border-primary/10 pb-4">
        Order Summary
      </h2>

      {/* ITEMS LIST */}
      <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto scrollbar-hide pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 group">
            <div className="relative w-20 h-24 bg-bg-secondary flex-shrink-0 overflow-hidden rounded-md border border-primary/5">
              {item.images?.[0] && (
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
            <div className="flex-grow flex flex-col justify-between py-1">
              <div>
                <h4 className="font-serif text-base leading-tight">
                  {item.name}
                </h4>
              </div>

              <div className="flex justify-between items-end mt-2">
                <div className="flex items-center border border-primary/20 rounded-md">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-1.5 text-secondary hover:text-primary disabled:opacity-30 disabled:hover:text-secondary transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-medium w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.stock <= item.quantity}
                    className="p-1.5 text-secondary hover:text-primary disabled:opacity-30 disabled:hover:text-secondary transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <p className="font-medium text-sm">
                  ৳
                  {(
                    (item.salePrice || item.basePrice || 0) * item.quantity
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* L9: COUPON INPUT */}
      <div className="mb-6 pb-6 border-b border-primary/10">
        <CouponInput />
      </div>

      {/* PRICE BREAKDOWN */}
      <div className="space-y-4 py-6 border-t border-primary/10 text-sm">
        <div className="flex justify-between text-secondary">
          <span>Subtotal</span>
          <span>৳{subtotal.toLocaleString()}</span>
        </div>

        {/* L9: Discount line (conditional) */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-700 font-medium">
            <span>Discount {couponCode && `(${couponCode})`}</span>
            <span>-৳{discountAmount.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between text-secondary items-center">
          <span>Shipping</span>
          <span className="text-xs text-secondary/60">
            {deliveryLocation === "outside_dhaka"
              ? "(Outside Dhaka)"
              : "(Inside Dhaka)"}
          </span>
          <span>৳{shippingCost.toLocaleString()}</span>
        </div>
      </div>

      {/* TOTAL */}
      <div className="flex justify-between text-xl font-serif py-6 border-t border-primary/10 mb-8 items-center bg-primary/5 -mx-8 px-8 border-b">
        <span className="font-bold text-primary">Total</span>
        <div className="text-right">
          <span className="block font-bold text-lg md:text-xl">
            ৳{finalTotal.toLocaleString()}
          </span>
          <span className="text-[10px] text-secondary/70 font-sans font-normal block mt-1">
            Including VAT
          </span>
        </div>
      </div>

      {onCheckout && (
        <Button
          onClick={onCheckout}
          disabled={!isFormValid || isSubmitting}
          className="w-full h-12 text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.99]"
        >
          {isSubmitting
            ? "Processing Order..."
            : isFormValid
              ? "Confirm Order"
              : "Complete Details"}
        </Button>
      )}

      {/* TRUST BADGES */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-primary/10">
        <div className="flex items-center gap-2 text-secondary/70 justify-center">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span className="text-[10px] uppercase tracking-wider font-medium">
            Secure
          </span>
        </div>
        <div className="flex items-center gap-2 text-secondary/70 justify-center">
          <Truck className="w-4 h-4 text-primary" />
          <span className="text-[10px] uppercase tracking-wider font-medium">
            Fast Delivery
          </span>
        </div>
      </div>
    </div>
  );
}
