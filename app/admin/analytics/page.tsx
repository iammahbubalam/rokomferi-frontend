"use client";

import { useState, useEffect } from "react";
import { KPICards } from "@/components/admin/analytics/KPICards";
import { RevenueChart } from "@/components/admin/analytics/RevenueChart";
import { InventoryCustomerTables } from "@/components/admin/analytics/InventoryCustomerTables";
import {
  DailySalesStat,
  RevenueKPIs,
  LowStockProduct,
  TopSellingProduct,
  TopCustomer,
  CustomerRetention,
} from "@/types";
import { subDays, format } from "date-fns";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });

  const [kpis, setKpis] = useState<RevenueKPIs | null>(null);
  const [salesData, setSalesData] = useState<DailySalesStat[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [retention, setRetention] = useState<CustomerRetention | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch all analytics endpoints in parallel
      const [
        kpisRes,
        salesRes,
        lowStockRes,
        topProductsRes,
        topCustomersRes,
        retentionRes,
      ] = await Promise.all([
        fetch(
          `/api/v1/admin/stats/kpis?start=${dateRange.start}&end=${dateRange.end}`,
          { credentials: "include" },
        ),
        fetch(
          `/api/v1/admin/stats/revenue?start=${dateRange.start}&end=${dateRange.end}`,
          { credentials: "include" },
        ),
        fetch(`/api/v1/admin/stats/inventory/low-stock?threshold=5&limit=10`, {
          credentials: "include",
        }),
        fetch(
          `/api/v1/admin/stats/products/top-selling?start=${dateRange.start}&end=${dateRange.end}&limit=10`,
          { credentials: "include" },
        ),
        fetch(
          `/api/v1/admin/stats/customers/top?start=${dateRange.start}&end=${dateRange.end}&limit=10`,
          { credentials: "include" },
        ),
        fetch(
          `/api/v1/admin/stats/customers/retention?start=${dateRange.start}&end=${dateRange.end}`,
          { credentials: "include" },
        ),
      ]);

      const [
        kpisData,
        salesData,
        lowStockData,
        topProductsData,
        topCustomersData,
        retentionData,
      ] = await Promise.all([
        kpisRes.json(),
        salesRes.json(),
        lowStockRes.json(),
        topProductsRes.json(),
        topCustomersRes.json(),
        retentionRes.json(),
      ]);

      setKpis(kpisData);
      setSalesData(salesData || []);
      setLowStock(lowStockData || []);
      setTopProducts(topProductsData || []);
      setTopCustomers(topCustomersData || []);
      setRetention(retentionData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (preset: string) => {
    const end = format(new Date(), "yyyy-MM-dd");
    let start = "";

    switch (preset) {
      case "7d":
        start = format(subDays(new Date(), 7), "yyyy-MM-dd");
        break;
      case "30d":
        start = format(subDays(new Date(), 30), "yyyy-MM-dd");
        break;
      case "90d":
        start = format(subDays(new Date(), 90), "yyyy-MM-dd");
        break;
      default:
        return;
    }

    setDateRange({ start, end });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your business performance and key metrics
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2 mb-6">
        {["7d", "30d", "90d"].map((preset) => (
          <button
            key={preset}
            onClick={() => handleDateRangeChange(preset)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              dateRange.start ===
              format(subDays(new Date(), parseInt(preset)), "yyyy-MM-dd")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Last {preset}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <KPICards kpis={kpis} loading={loading} />

      {/* Revenue Chart */}
      <RevenueChart data={salesData} loading={loading} />

      {/* Inventory & Customer Analytics */}
      <InventoryCustomerTables
        lowStock={lowStock}
        topProducts={topProducts}
        topCustomers={topCustomers}
        retention={retention}
        loading={loading}
      />
    </div>
  );
}
