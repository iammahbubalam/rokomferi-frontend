"use client";

import { Container } from "@/components/ui/Container";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/ui/ProductCard";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { items, isLoading } = useWishlist();
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading || (isLoading && items.length === 0)) {
    return (
      <Container className="py-20 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Heart className="h-16 w-16 text-gray-200 mb-6" />
        <h1 className="text-3xl font-display mb-4">My Wishlist</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Sign in to save items to your wishlist and access them from any
          device.
        </p>
        <Link href="/auth/login?redirect=/wishlist">
          <Button>Sign In</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 min-h-screen">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display mb-2">My Wishlist</h1>
          <p className="text-gray-500">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-100 rounded-xl">
          <Heart className="h-12 w-12 text-gray-200 mb-4" />
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">
            Browse our collections and save your favorite items.
          </p>
          <Link href="/collections/all">
            <Button variant="outline">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </Container>
  );
}
