"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getApiUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCheckoutFlow } from "@/hooks/useCheckoutFlow";
import { AddressManager, Address } from "@/components/checkout/AddressManager";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // 1. DATA FLOW (State Machine)
  const { state, updateQuantity } = useCheckoutFlow();
  const { status, items, total, error, isDirectLoading } = state;

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, isAuthLoading, router]);

  // Form State
  const [deliveryLocation, setDeliveryLocation] = useState("inside_dhaka");
  const [email, setEmail] = useState("");

  // Address State managed by AddressManager
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  // Pre-fill Email
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  // Fetch Saved Addresses
  useEffect(() => {
    if (user) {
      fetchSavedAddresses();
    }
  }, [user]);

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl("/user/addresses"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSavedAddresses(data || []);
      }
    } catch (e) {
      console.error("Failed to fetch addresses", e);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) return;

    setIsSubmitting(true);
    setSubmitError(null);
    const token = localStorage.getItem("token");

    try {
      // 1. If "New Address" + "Save Address" checked, save it first
      if (selectedAddress.id === "new" && selectedAddress.saveAddress) {
        try {
          await fetch(getApiUrl("/user/addresses"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              label: selectedAddress.label || "Home",
              firstName: selectedAddress.firstName,
              phone: selectedAddress.phone,
              addressLine: selectedAddress.address,
              division: selectedAddress.division,
              district: selectedAddress.district,
              thana: selectedAddress.thana,
              postalCode: selectedAddress.zip,
              isDefault: savedAddresses.length === 0, // First one is default
            }),
          });
          // Don't fail checkout if save fails, just log it
        } catch (saveErr) {
          console.warn("Failed to save new address:", saveErr);
        }
      }
      // 2. If Existing Address + "isEdited", Update it
      else if (selectedAddress.id !== "new" && selectedAddress.isEdited) {
        try {
          await fetch(getApiUrl(`/user/addresses/${selectedAddress.id}`), {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              label: selectedAddress.label || "Home",
              firstName: selectedAddress.firstName,
              phone: selectedAddress.phone,
              addressLine: selectedAddress.address,
              division: selectedAddress.division,
              district: selectedAddress.district,
              thana: selectedAddress.thana,
              postalCode: selectedAddress.zip,
            }),
          });
        } catch (updateErr) {
          console.warn("Failed to update address:", updateErr);
        }
      }

      // 2. Place Order
      const payload = {
        paymentMethod: "cod",
        address: {
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          email: email,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          division: selectedAddress.division,
          district: selectedAddress.district,
          thana: selectedAddress.thana,
          zip: selectedAddress.zip,
          deliveryLocation: deliveryLocation, // Include zone
        },
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
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
    } catch (error: any) {
      console.error(error);
      setSubmitError(
        error.message || "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippingCost = deliveryLocation === "outside_dhaka" ? 150 : 80;

  // Validation
  const isFormValid =
    selectedAddress &&
    selectedAddress.firstName?.trim() !== "" &&
    selectedAddress.phone?.trim() !== "" &&
    selectedAddress.address?.trim() !== "" &&
    selectedAddress.division?.trim() !== "" &&
    selectedAddress.district?.trim() !== "" &&
    selectedAddress.thana?.trim() !== "";

  // --- RENDER LOGIC (FAIL FAST) ---

  // 1. Initializing (Loading Direct Item)
  if (status === "initializing" || isDirectLoading) {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-bg-primary flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // 2. Critical Error (Invalid Link, OOS, Network)
  if (status === "error") {
    return (
      <div className="min-h-screen pt-40 pb-20 bg-bg-primary text-center flex flex-col items-center px-4">
        <Container>
          <div className="bg-red-50 text-red-600 p-8 rounded-lg max-w-md mx-auto border border-red-100">
            <h1 className="font-serif text-2xl mb-4">Unable to Proceed</h1>
            <p className="mb-6">{error}</p>
            <Link href="/shop">
              <Button variant="outline">Back to Shop</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // 3. Empty State (Ready but no items)
  if (status === "ready" && items.length === 0 && !isSuccess) {
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
            <Button>Continue Shopping</Button>
          </Link>
        </Container>
      </div>
    );
  }

  // 4. Success State
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
            Thank you for your purchase. We have received your order and will
            begin preparing it with care. You will receive updates at{" "}
            <span className="font-medium text-primary">
              {selectedAddress?.phone}
            </span>
            .
          </p>

          <Link href="/">
            <Button className="w-full">Return Home</Button>
          </Link>
        </Container>
      </div>
    );
  }

  // 5. Checkout Form (Ready with items)
  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-primary text-primary">
      <Container className="max-w-[1920px] px-6 md:px-12 lg:px-24">
        <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center lg:text-left">
          Checkout
        </h1>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-8">
            {submitError}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
                  />
                  <label className="absolute left-0 top-4 text-secondary/60 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-accent-gold peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent-gold cursor-text">
                    Email Address (Optional)
                  </label>
                </div>
              </div>
            </section>

            {/* Shipping Address - DELEGATED TO COMPONENT */}
            <section>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold border-b border-primary/10 pb-4 mb-8 text-secondary">
                Shipping Address
              </h2>

              <AddressManager
                savedAddresses={savedAddresses}
                onSelectAddress={(addr) => setSelectedAddress(addr)}
                userFirstName={user?.firstName}
                userLastName={user?.lastName}
                defaultPhone={user?.phone || ""}
              />

              <div className="group relative mt-8">
                <select
                  name="deliveryLocation"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="peer w-full bg-transparent border-b border-primary/20 py-4 text-base focus:outline-none focus:border-primary transition-colors text-primary appearance-none cursor-pointer"
                >
                  <option value="inside_dhaka">Inside Dhaka (80 BDT)</option>
                  <option value="outside_dhaka">Outside Dhaka (150 BDT)</option>
                </select>
                <label className="absolute left-0 -top-2 text-xs text-accent-gold">
                  Delivery Zone <span className="text-red-400">*</span>
                </label>
                <div className="absolute right-0 top-4 pointer-events-none">
                  <ArrowRight className="w-4 h-4 text-secondary/50 rotate-90" />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: Order Summary (Sticky) */}
          <div className="w-full lg:w-2/5 relative h-fit lg:sticky lg:top-24">
            <OrderSummary
              items={items}
              total={total}
              deliveryLocation={deliveryLocation}
              shippingCost={shippingCost}
              onCheckout={handleCheckout}
              isSubmitting={isSubmitting}
              isFormValid={isFormValid || false}
              onUpdateQuantity={updateQuantity}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
