import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest } from "../lib/queryClient";
import { toast } from "./use-toast";
import { z } from "zod";

// Client-side user type from API response
type ClientUser = z.infer<typeof api.auth.me.responses[200]>;

export function useAuth() {
  const queryClient = useQueryClient();

  // Query to fetch the current authenticated user
  const { data: user, isLoading } = useQuery<ClientUser | null>({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      try {
        const res = await apiRequest(api.auth.me.method, api.auth.me.path);
        const data = await res.json();
        return api.auth.me.responses[200].parse(data);
      } catch (error: any) {
        // If 401, return null for no authenticated user, otherwise re-throw
        if (error.message.includes("401")) {
          return null;
        }
        throw error;
      }
    },
    staleTime: Infinity, // User data typically doesn't change frequently once fetched
    retry: false, // Don't retry on auth check failures
  });

  // Mutation for user registration
  const registerMutation = useMutation<any, Error, z.infer<typeof api.auth.register.input>>({
    mutationFn: async (data) => {
      const res = await apiRequest(api.auth.register.method, api.auth.register.path, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] }); // Refetch user info after successful registration
      toast({
        title: "Registration Successful",
        description: "You have been successfully registered and logged in.",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for user login
  const loginMutation = useMutation<any, Error, z.infer<typeof api.auth.login.input>>({
    mutationFn: async (data) => {
      const res = await apiRequest(api.auth.login.method, api.auth.login.path, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] }); // Refetch user info after successful login
      toast({
        title: "Login Successful",
        description: "You have been successfully logged in.",
      });
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for user logout
  const logoutMutation = useMutation<any, Error, void>({
    mutationFn: async () => {
      const res = await apiRequest(api.auth.logout.method, api.auth.logout.path);
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null); // Clear user data from cache
      toast({
        title: "Logout Successful",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error) => {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    user,
    isLoading,
    register: registerMutation.mutateAsync,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
  };
}
