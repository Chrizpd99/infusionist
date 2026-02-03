import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type CreateOrderInput = z.infer<typeof api.orders.create.input>;

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const res = await fetch(api.orders.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
           const error = api.orders.create.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to create order");
      }
      
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate relevant queries if we had a list of orders (which we don't publicly expose)
      // but keeping good practice
      queryClient.invalidateQueries({ queryKey: ["orders"] }); 
    }
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: [api.orders.get.path, id],
    queryFn: async () => {
      const url = api.orders.get.path.replace(":id", String(id));
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch order");
      return api.orders.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
