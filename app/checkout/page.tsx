"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-bg-primary text-center">
         <Container>
            <h1 className="font-serif text-3xl mb-4">Your bag is empty</h1>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
         </Container>
      </div>
    );
  }

  if (isSuccess) {
     return (
        <div className="min-h-screen pt-32 pb-20 bg-bg-primary flex flex-col items-center justify-center text-center">
           <Container className="max-w-md bg-white p-12 shadow-sm border border-primary/5">
              <div className="flex justify-center mb-6">
                 <CheckCircle2 className="w-16 h-16 text-green-600" />
              </div>
              <h1 className="font-serif text-3xl mb-4 text-primary">Order Confirmed</h1>
              <p className="text-secondary/80 font-light mb-8">
                Thank you for your purchase. We have received your order and will begin preparing it with care.
              </p>
              <Link href="/">
                <Button className="w-full">Return Home</Button>
              </Link>
           </Container>
        </div>
     );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-primary text-primary">
      <Container className="max-w-4xl">
        <h1 className="font-serif text-4xl mb-12">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           {/* Form Placeholder */}
           <div className="space-y-6">
              <h2 className="text-sm uppercase tracking-widest border-b border-primary/10 pb-4">Shipping Details</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="w-full bg-bg-secondary border-none p-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-secondary/50" />
                    <input type="text" placeholder="Last Name" className="w-full bg-bg-secondary border-none p-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-secondary/50" />
                 </div>
                 <input type="email" placeholder="Email Address" className="w-full bg-bg-secondary border-none p-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-secondary/50" />
                 <input type="text" placeholder="Address" className="w-full bg-bg-secondary border-none p-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-secondary/50" />
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="City" className="w-full bg-bg-secondary border-none p-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-secondary/50" />
                    <input type="text" placeholder="Postal Code" className="w-full bg-bg-secondary border-none p-4 text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-secondary/50" />
                 </div>
              </form>
           </div>

           {/* Order Summary */}
           <div className="bg-bg-secondary p-8 h-fit">
              <h2 className="text-sm uppercase tracking-widest border-b border-white/10 pb-4 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                 {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                       <span className="text-secondary">{item.quantity}x {item.name}</span>
                       <span className="font-medium">৳{((item.pricing.salePrice || item.pricing.basePrice) * item.quantity).toLocaleString()}</span>
                    </div>
                 ))}
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-serif mb-8">
                 <span>Total</span>
                 <span>৳{total.toLocaleString()}</span>
              </div>
              <Button onClick={() => setIsSuccess(true)} className="w-full bg-primary text-white py-4 text-sm uppercase tracking-widest">
                 Complete Order
              </Button>
           </div>
        </div>
      </Container>
    </div>
  );
}
