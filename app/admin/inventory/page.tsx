import { cookies } from "next/headers";
import { getApiUrl } from "@/lib/utils";
import InventoryClient from "@/components/admin/inventory/InventoryClient";

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let products = [];

  try {
    const url = new URL(getApiUrl("/admin/products"));
    url.searchParams.set("limit", "100");
    if (search) url.searchParams.set("search", search);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      products = data.data || [];
    }
  } catch (e) {
    console.error("Failed to fetch inventory", e);
  }

  return <InventoryClient initialProducts={products} initialSearch={search} />;
}
