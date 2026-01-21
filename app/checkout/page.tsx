import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getProductById } from "@/lib/api/shop";

interface CheckoutPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const type = params.type;
  const productId = params.productId as string | undefined;
  const quantity = params.quantity ? parseInt(params.quantity as string) : 1;

  let initialProduct = null;

  if (type === "direct" && productId) {
    try {
      initialProduct = await getProductById(productId);

      // Basic stock check on server to avoid passing invalid product
      if (
        initialProduct &&
        (initialProduct.stock <= 0 ||
          initialProduct.stockStatus === "out_of_stock")
      ) {
        initialProduct = null;
      }
    } catch (error) {
      console.error("Failed to prefetch product for checkout", error);
    }
  }

  return (
    <CheckoutClient
      initialProduct={initialProduct}
      initialQuantity={quantity}
    />
  );
}
