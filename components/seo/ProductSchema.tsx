import JsonLd from "./JsonLd";
import { Product } from "@/types";
import { env } from "@/lib/env";

interface ProductSchemaProps {
  product: Product;
  rating?: {
    value: number;
    count: number;
  };
}

export function ProductSchema({ product, rating }: ProductSchemaProps) {
  const price = product.salePrice || product.basePrice;
  const isInstock = product.stock > 0 && product.stockStatus !== "out_of_stock";

  const schema: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description.substring(0, 160), // Truncate for optimal SEO
    image: product.images,
    sku: product.sku || product.id,
    mpn: product.sku || product.id, // Manufacturer Part Number
    brand: {
      "@type": "Brand",
      name: "Rokomferi", // Or dynamically set if multi-brand
    },
    offers: {
      "@type": "Offer",
      url: `${env.NEXT_PUBLIC_APP_URL}/shop/product/${product.slug}`,
      priceCurrency: "BDT",
      price: price,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      )
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: isInstock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Rokomferi",
      },
    },
  };

  // Add AggregateRating if available
  if (rating && rating.count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.value,
      reviewCount: rating.count,
    };
  }

  return <JsonLd data={schema} />;
}
