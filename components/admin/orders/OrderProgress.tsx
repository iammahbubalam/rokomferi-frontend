"use client";

import { Check, Circle, Clock, Package, Truck, CreditCard } from "lucide-react";

interface OrderProgressProps {
    status: string;
    paymentStatus: string;
}

export function OrderProgress({ status, paymentStatus }: OrderProgressProps) {
    const steps = [
        { id: "pending", label: "Pending", icon: Clock },
        { id: "processing", label: "Processing", icon: Package },
        { id: "shipped", label: "Shipped", icon: Truck },
        { id: "delivered", label: "Delivered", icon: Check },
        { id: "paid", label: "Paid", icon: CreditCard },
    ];

    // Determine current step index
    // Note: status 'paid' is after 'delivered'.
    // If status is 'cancelled'/'returned'/'fake', this linear progress might not apply well.
    // We can show a "Cancelled" badge overlay or specific state.

    let currentIndex = -1;
    if (status === 'cancelled' || status === 'returned' || status === 'fake' || status === 'refunded') {
        // Error state handling in parent, or we show 0 progress?
        // Let's just match the last valid state if possible or 0.
        // For simplicity, linear progress is hidden or greyed out in terminal failure states.
        currentIndex = -1;
    } else {
        currentIndex = steps.findIndex(s => s.id === status);
        // If status is 'pending_verification', map to pending (0) visually or add step.
        if (status === 'pending_verification') currentIndex = 0;
    }

    if (currentIndex === -1 && status !== 'pending') {
        // Handle failure states visually
        return (
            <div className="w-full bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-center gap-3 text-red-700">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-medium uppercase tracking-wide">Order is {status.replace("_", " ")}</span>
            </div>
        );
    }

    return (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between px-4 sm:px-12">
                {/* Connecting Line */}
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-10">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                ${isCompleted
                                        ? "bg-primary border-primary text-white"
                                        : "bg-white border-gray-200 text-gray-300"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-medium transition-colors duration-300 ${isCurrent ? "text-primary" : "text-gray-400"}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
