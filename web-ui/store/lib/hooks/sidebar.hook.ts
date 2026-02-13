import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cart.api";
import { AddItemPayload, UpdateQuantityPayload } from "../types/cart.types";
import { useAuth } from "@/contexts/AuthContext";
import { sidebarApi } from "../api/sidebar.api";

export function useGetSidebar() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sidebar"],
    queryFn: sidebarApi.getSidebar,
    enabled: !!user,
  });
}
