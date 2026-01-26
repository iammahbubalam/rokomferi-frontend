"use client";

import { Check, Circle, Clock, Package, Truck, CreditCard, XCircle, RefreshCw, AlertOctagon } from "lucide-react";

interface OrderProgressProps {
    status: string;
    paymentStatus: string;
}

export function OrderProgress({ status, paymentStatus }: OrderProgressProps) {
    // Standard Happy Path
    const steps = [
        { id: "pending", label: "Pending", icon: Clock },
        { id: "processing", label: "Processing", icon: Package },
        { id: "shipped", label: "Shipped", icon: Truck },
        { id: "delivered", label: "Delivered", icon: Check },
        { id: "paid", label: "Paid", icon: CreditCard },
    ];

    // Check if current status is a "deviation" from happy path
    const happyPathIds = steps.map(s => s.id);
    const isDeviated = !happyPathIds.includes(status) && status !== "pending_verification";

    // If deviated (Cancelled, Returned, etc.), append strictly as the FINAL step
    // This shows the history: it went through steps? No, deviation usually terminates the flow immediately or from a point.
    // L9: Simple visualization - Just show the standard steps throughout.
    // AND if deviated, highlight the relevant stage or append it?
    // User requested "Show all order".

    // Better Logic:
    // If Cancelled/Returned/Refunded/Fake, we ADD it to the end of the stepper dynamically so the user sees "Pending -> ... -> Cancelled".

    const displaySteps = [...steps];

    if (isDeviated) {
        let icon = AlertOctagon;
        let color = "text-red-600";
        if (status === "cancelled") { icon = XCircle; }
        if (status === "returned") { icon = RefreshCw; }
        if (status === "refunded") { icon = RefreshCw; }

        displaySteps.push({
            id: status,
            label: status.replace("_", " "), // Capitalize primarily via CSS or utility
            icon: icon
        });
    }

    // Determine Active Index
    // If IsDeviated, the active index is the last one (The Status Itself).
    // If Standard, find index.

    let currentIndex = -1;
    if (isDeviated) {
        currentIndex = displaySteps.length - 1;
    } else {
        currentIndex = displaySteps.findIndex(s => s.id === status);
        if (status === 'pending_verification') currentIndex = 0;
    }

    return (
        <div className="w-full py-4 overflow-x-auto">
            <div className="relative flex items-center justify-between px-4 sm:px-12 min-w-[600px]">
                {/* Connecting Line */}
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-100 -z-10">
                    <div
                        className={`h-full transition-all duration-500 ease-in-out ${isDeviated ? "bg-red-500" : "bg-primary"}`}
                        style={{ width: `${(currentIndex / (displaySteps.length - 1)) * 100}%` }}
                    />
                </div>

                {displaySteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    // Specific Color Logic for Deviation Step
                    const isDangerStep = isDeviated && index === displaySteps.length - 1;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                ${isDangerStep
                                        ? "bg-red-500 border-red-500 text-white"
                                        : isCompleted
                                            ? "bg-primary border-primary text-white"
                                            : "bg-white border-gray-200 text-gray-300"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-medium uppercase tracking-wide transition-colors duration-300 
                                ${isDangerStep ? "text-red-600" : isCurrent ? "text-primary" : "text-gray-400"}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
