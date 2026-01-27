import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProductReviews } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ShoppingBag, Ruler, Info } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WishlistButton } from "@/components/common/WishlistButton";
import { ProductGallery } from "@/components/product/ProductGallery";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import { ProductSchema } from "@/components/seo/ProductSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ProductInfo } from "@/components/product/ProductInfo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.metaTitle || product.name,
    description:
      product.metaDescription || product.description.substring(0, 160),
    openGraph: {
      title: product.metaTitle || product.name,
      description:
        product.metaDescription || product.description.substring(0, 160),
      images:
        product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product.id);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
  ];

  if (product.categories?.[0]) {
    breadcrumbs.push({
      name: product.categories[0].name,
      url: `/category/${product.categories[0].slug}`,
    });
  }

  breadcrumbs.push({
    name: product.name,
    url: `/product/${product.slug}`,
  });

  return (
    <div className="min-h-screen bg-bg-primary text-primary pt-20">
      <ProductSchema
        product={product}
        rating={{ value: avgRating, count: reviews.length }}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      {/* Top Navigation / Breadcrumb */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20 pt-8 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20">
        <ProductInfo product={product} />
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20 py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl mb-12 text-center">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-secondary uppercase text-xs tracking-widest mb-6 border-b border-gray-100 pb-2">
                Recent Feedback
              </h3>
              <ReviewList reviews={reviews} />
            </div>
            <div>
              <div className="sticky top-24">
                <ReviewForm productId={product.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
