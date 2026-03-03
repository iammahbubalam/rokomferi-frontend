"use client";

import { CartProvider } from "@/context/CartContext";
import { GoogleAuthProvider } from "@/components/auth/AuthProvider";
import { AuthContextProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { DialogProvider } from "@/context/DialogContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { IntroProvider } from "@/context/IntroContext";

export function AllProviders({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <AuthContextProvider>
                <GoogleAuthProvider>
                    <DialogProvider>
                        <IntroProvider>
                            <CartProvider>
                                <WishlistProvider>
                                    {children}
                                </WishlistProvider>
                            </CartProvider>
                        </IntroProvider>
                    </DialogProvider>
                </GoogleAuthProvider>
            </AuthContextProvider>
        </QueryProvider>
    );
}
