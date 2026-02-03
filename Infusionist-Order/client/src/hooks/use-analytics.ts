import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { DashboardStats, OrderAnalytics } from "@shared/schema";

export function useDashboardStats() {
  return useQuery({
    queryKey: [api.admin.analytics.dashboard.path],
    queryFn: async () => {
      const res = await fetch(api.admin.analytics.dashboard.path, {
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch dashboard stats");
      }
      return res.json() as Promise<DashboardStats>;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useOrderAnalytics() {
  return useQuery({
    queryKey: [api.admin.analytics.orders.path],
    queryFn: async () => {
      const res = await fetch(api.admin.analytics.orders.path, {
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch analytics");
      }
      return res.json() as Promise<OrderAnalytics>;
    },
  });
}
