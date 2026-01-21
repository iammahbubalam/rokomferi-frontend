import { cookies } from "next/headers";
import { getApiUrl } from "@/lib/utils";
import OrdersClient from "@/components/admin/orders/OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status || "";
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Server-side fetch
  const url = new URL(getApiUrl("/admin/orders"));
  if (status) url.searchParams.set("status", status);

  let orders = [];

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Admin data should be fresh
    });

    if (res.ok) {
      const data = await res.json();
      orders = data.orders || [];
    }
  } catch (e) {
    console.error("Failed to fetch orders on server", e);
  }

  return <OrdersClient initialOrders={orders} />;
}
