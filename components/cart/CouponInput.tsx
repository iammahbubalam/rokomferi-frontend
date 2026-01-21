"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Loader2, TicketPercent, X } from "lucide-react";

export function CouponInput() {
  const {
    applyCoupon,
    removeCoupon,
    couponCode,
    discountAmount,
    isCouponLoading,
  } = useCart();
  const [code, setCode] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    const success = await applyCoupon(code.toUpperCase());
    if (success) {
      setCode(""); // Clear input on success
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setCode("");
  };

  // L9: Applied state - show badge with remove option
  if (couponCode) {
    return (
      <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketPercent className="w-5 h-5 text-accent-gold" />
            <span className="font-medium text-primary uppercase">
              {couponCode}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-secondary">Discount Applied</span>
          <span className="font-bold text-green-700">
            -৳{discountAmount.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }

  // L9: Input state - show input field with apply button
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-secondary">Promo Code</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          placeholder="Enter coupon code"
          disabled={isCouponLoading}
          className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold transition-all uppercase placeholder:normal-case disabled:opacity-50"
        />
        <Button
          onClick={handleApply}
          disabled={isCouponLoading || !code.trim()}
          variant="secondary"
          className="min-w-[80px]"
        >
          {isCouponLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
    </div>
  );
}
