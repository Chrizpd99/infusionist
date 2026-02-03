import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = `HTTP error! Status: ${res.status}`;
    try {
      const errorBody = await res.json();
      errorMessage = errorBody.message || errorMessage;
      if (errorBody.field) {
        errorMessage += ` (Field: ${errorBody.field})`;
      }
    } catch (e) {
      // If response is not JSON, use statusText or raw text
      errorMessage = (await res.text()) || res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Ensure cookies (sessions) are sent
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options?: {
  on401?: UnauthorizedBehavior;
}) => QueryFunction<T | null> =
  ({ on401: unauthorizedBehavior = "throw" } = {}) => // Default to "throw" if not specified
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include", // Ensure cookies (sessions) are sent
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default queryFn for all queries. Can be overridden per-query.
      // We set on401 to "returnNull" by default for a smoother UX on public data
      // but specific auth checks (like /api/auth/me) will handle their own 401s.
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
