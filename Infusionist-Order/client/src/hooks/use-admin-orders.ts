import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { OrderResponse } from "@shared/schema";

type OrderFilters = {
  status?: string;
  paymentStatus?: string;
  customerName?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
};

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: [api.admin.orders.list.path, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
      }
      const url = `${api.admin.orders.list.path}?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch orders");
      }
      return res.json() as Promise<OrderResponse[]>;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.orders.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.admin.analytics.dashboard.path] });
    },
  });
}

export function useExportOrders() {
  return useMutation({
    mutationFn: async ({ format, filters }: { format: 'csv' | 'json'; filters?: OrderFilters }) => {
      const params = new URLSearchParams({ format });
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            params.append(key, String(value));
          }
        });
      }
      const res = await fetch(`/api/admin/orders/export?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Export failed");
      }
      const data = await res.text();

      // Trigger download
      const blob = new Blob([data], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return data;
    },
  });
}
