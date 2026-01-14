"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, isLoading, router]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    deliveryLocation: "inside_dhaka",
    division: "",
    district: "",
    thana: "",
    address: "",
    landmark: "",
    zip: "",
  });

  // Pre-fill Form with User Data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const [isFormValid, setIsFormValid] = useState(false);

  // Validate Form
  useEffect(() => {
    const {
      firstName,
      phone,
      address,
      division,
      district,
      thana,
      deliveryLocation,
    } = formData;
    const isValid =
      firstName?.trim() !== "" &&
      phone.trim() !== "" &&
      address.trim() !== "" &&
      division.trim() !== "" &&
      district.trim() !== "" &&
      thana.trim() !== "" &&
      deliveryLocation.trim() !== "";
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem("token");
      // Construct Payload
      const payload = {
        paymentMethod: "cod", // Default for now
        address: {
          ...formData,
          // Add explicit shipping cost if needed by backend,
          // but backend calculates total from Items usually.
          // Backend order_usecase.go uses `req.Address` as JSONB.
        },
      };

      const res = await fetch(getApiUrl("/checkout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Checkout failed");
      }

      setIsSuccess(true);
      // Ideally clear cart here, but backend clears it.
      // Client state might need refresh (CartContext syncs automatically on next fetch or we force it).
      // Reloading page or redirecting handles it.
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Shipping Cost
  const shippingCost = formData.deliveryLocation === "outside_dhaka" ? 150 : 80;
  const finalTotal = total + shippingCost;

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-bg-primary text-center flex flex-col items-center">
        <Container>
          <h1 className="font-serif text-3xl md:text-4xl mb-6 text-primary">
            Your bag is empty
          </h1>
          <p className="text-secondary mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your bag yet.
          </p>
          <Link href="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </Container>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-bg-primary flex flex-col items-center justify-center text-center px-4">
        <Container className="max-w-md bg-white p-12 shadow-2xl border border-primary/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-gold/40 via-accent-gold to-accent-gold/40" />

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-700" />
            </div>
          </div>

          <h1 className="font-serif text-3xl mb-4 text-primary">
            Order Confirmed
          </h1>
          <p className="text-secondary text-sm leading-relaxed mb-8">
            Thank you for your purchase,{" "}
            <span className="font-medium text-primary">
              {formData.firstName}
            </span>
            . We have received your order and will begin preparing it with care.
            You will receive an SMS updates at{" "}
            <span className="font-medium text-primary">{formData.phone}</span>.
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
      <Container className="max-w-[1920px] px-6 md:px-12 lg:px-24">
        <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center lg:text-left">
          Checkout
        </h1>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-8">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* LEFT: Shipping Form */}
          <div className="w-full lg:w-3/5 space-y-12">
            {/* Contact Info */}
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold border-b border-primary/10 pb-4 mb-8 text-secondary">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="group relative">
                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    Email Address (Optional)
                  </label>
                </div>

                <div className="group relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder=" "
                    value={formData.phone}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold border-b border-primary/10 pb-4 mb-8 text-secondary">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group relative">
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder=" "
                    value={formData.firstName}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    First Name <span className="text-red-400">*</span>
                  </label>
                </div>

                <div className="group relative">
                  <input
                    type="text"
                    name="lastName"
                    placeholder=" "
                    value={formData.lastName}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    Last Name
                  </label>
                </div>
              </div>

              <div className="group relative mt-6">
                <select
                  name="deliveryLocation"
                  value={formData.deliveryLocation}
                  onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors text-primary appearance-none cursor-pointer"
                >
                  <option value="inside_dhaka">Inside Dhaka (80 BDT)</option>
                  <option value="outside_dhaka">Outside Dhaka (150 BDT)</option>
                </select>
                <label className="absolute left-0 -top-2 text-xs text-accent-gold">
                  Delivery Zone <span className="text-red-400">*</span>
                </label>
                {/* Custom Arrow */}
                <div className="absolute right-0 top-4 pointer-events-none">
                  <ArrowRight className="w-4 h-4 text-secondary/50 rotate-90" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="group relative">
                  <input
                    type="text"
                    name="division"
                    required
                    placeholder=" "
                    value={formData.division}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    Division <span className="text-red-400">*</span>
                  </label>
                </div>

                <div className="group relative">
                  <input
                    type="text"
                    name="district"
                    required
                    placeholder=" "
                    value={formData.district}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    District <span className="text-red-400">*</span>
                  </label>
                </div>

                <div className="group relative">
                  <input
                    type="text"
                    name="thana"
                    required
                    placeholder=" "
                    value={formData.thana}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    Thana <span className="text-red-400">*</span>
                  </label>
                </div>
              </div>

              <div className="group relative mt-6">
                <input
                  type="text"
                  name="address"
                  required
                  placeholder=" "
                  value={formData.address}
                  onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                />
                <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                  House / Road / Block / Flat{" "}
                  <span className="text-red-400">*</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="group relative">
                  <input
                    type="text"
                    name="landmark"
                    placeholder=" "
                    value={formData.landmark}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    Landmark / Common Place Name (Optional)
                  </label>
                </div>

                <div className="group relative">
                  <input
                    type="text"
                    name="zip"
                    placeholder=" "
                    value={formData.zip}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    Postal Code
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: Order Summary (Sticky) */}
          <div className="w-full lg:w-2/5 relative h-fit lg:sticky lg:top-24">
            <div className="bg-white p-8 lg:p-12 shadow-xl border border-primary/5">
              <h2 className="font-serif text-2xl mb-8">Order Summary</h2>

              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto scrollbar-hide pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-bg-secondary flex-shrink-0">
                      {item.images?.[0] && (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-serif text-sm">{item.name}</h4>
                      <p className="font-medium text-sm mt-1">
                        ৳
                        {(
                          (item.salePrice || item.basePrice || 0) *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-6 border-t border-primary/10 text-sm">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>
                    Shipping (
                    {formData.deliveryLocation === "outside_dhaka"
                      ? "Outside Dhaka"
                      : "Inside Dhaka"}
                    )
                  </span>
                  <span>৳{shippingCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-serif py-6 border-t border-primary/10 mb-8">
                <span>Total</span>
                <span>৳{finalTotal.toLocaleString()}</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={!isFormValid || isSubmitting}
                className="w-full"
              >
                {isSubmitting
                  ? "Processing..."
                  : isFormValid
                  ? "Place Order"
                  : "Fill Details to Order"}
              </Button>

              <p className="text-center text-[10px] text-secondary/60 mt-4 uppercase tracking-widest">
                Secure Checkout • Cash on Delivery Available
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
