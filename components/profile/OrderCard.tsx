"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Truck, CreditCard, ChevronDown, ChevronUp, MapPin, Calendar, Receipt } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  id: string;
  productId: string;
  product?: {
    name: string;
    images?: string[];
    slug: string;
  };
  variantName?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  shippingAddress?: any;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  pending: { color: "text-amber-600", bg: "bg-amber-50", icon: Calendar },
  processing: { color: "text-blue-600", bg: "bg-blue-50", icon: Package },
  shipped: { color: "text-indigo-600", bg: "bg-indigo-50", icon: Truck },
  delivered: { color: "text-emerald-600", bg: "bg-emerald-50", icon: Package },
  paid: { color: "text-emerald-600", bg: "bg-emerald-50", icon: Receipt },
  cancelled: { color: "text-rose-600", bg: "bg-rose-50", icon: Package },
  returned: { color: "text-orange-600", bg: "bg-orange-50", icon: Package },
  refunded: { color: "text-purple-600", bg: "bg-purple-50", icon: CreditCard },
};

export function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] || { color: "text-gray-600", bg: "bg-gray-50", icon: Package };
  const StatusIcon = status.icon;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header / Summary */}
      <div
        className="p-5 md:p-6 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${status.bg} ${status.color}`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color} border border-current/10`}>
                  {order.status.replace("_", " ")}
                </div>
              </div>
              <p className="text-sm text-primary/60 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6">
            <div className="text-right">
              <p className="text-xs text-primary/40 uppercase tracking-widest font-medium">Total Price</p>
              <p className="font-serif text-xl md:text-2xl mt-0.5">৳{order.totalAmount.toLocaleString()}</p>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-primary/30" />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary/30" />
            )}
          </div>
        </div>

        <div className="mt-4 md:hidden">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.bg} ${status.color} border border-current/10`}>
            {order.status.replace("_", " ")}
          </div>
        </div>

        {/* Quick Items Preview (collapsed) */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex items-center gap-2 overflow-hidden"
            >
              {order.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className="relative w-10 h-12 bg-canvas rounded overflow-hidden flex-shrink-0 border border-gray-100">
                  {item.product?.images?.[0] ? (
                    <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                  ) : (
                    <Package className="w-full h-full p-2 text-gray-200" />
                  )}
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="text-xs text-primary/40 pl-1">+{order.items.length - 3} more</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detailed Info (expanded) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-50 overflow-hidden"
          >
            <div className="p-5 md:p-8 bg-gray-50/50 space-y-8">
              {/* Items List */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-primary/40 font-bold mb-4">Ordered Items</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100/50 shadow-sm">
                      <div className="relative w-14 h-16 bg-canvas rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <Package className="w-full h-full p-3 text-gray-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm text-primary truncate">{item.product?.name || "Product"}</h5>
                        {item.variantName && <p className="text-[10px] text-primary/50 mt-0.5">{item.variantName}</p>}
                        <p className="text-xs text-primary/60 mt-1">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-sm">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-primary/40 font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Shipping Details
                  </h4>
                  <div className="text-sm text-primary/70 space-y-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="font-semibold text-primary">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                    <p>{order.shippingAddress?.phone}</p>
                    <p className="pt-2 leading-relaxed">
                      {order.shippingAddress?.addressLine}<br />
                      {order.shippingAddress?.thana}, {order.shippingAddress?.district}<br />
                      {order.shippingAddress?.division} {order.shippingAddress?.postalCode}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-widest text-primary/40 font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="w-3 h-3" /> Payment Info
                  </h4>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary/50">Method</span>
                      <span className="font-medium capitalize">{order.paymentMethod.replace("_", " ")}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary/50">Status</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="h-px bg-gray-50" />
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-primary/40">Subtotal</span>
                        <span className="text-primary/70">৳{(order.totalAmount - order.shippingFee).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-primary/40">Shipping</span>
                        <span className="text-primary/70">৳{order.shippingFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-serif pt-1">
                        <span>Total</span>
                        <span className="text-primary">৳{order.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
