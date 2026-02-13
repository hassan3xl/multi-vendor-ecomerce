import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/product.api";
import { Product } from "../types/types";
import { StoreApi } from "../api/store.api";
import { Store } from "../types/store.types";

export function useGetStore() {
  return useQuery<Store>({
    queryKey: ["store"],
    queryFn: StoreApi.getStore,
  });
}

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (storeData: any) => {
      return await StoreApi.UpdateStore(storeData as any);
    },
    onSuccess: () => {
      // Invalidate store cache to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};

export const useUpdateStoreStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await StoreApi.UpdateStoreStatus();
    },
    onSuccess: () => {
      // Invalidate store cache to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};

export const useUpdateStoreLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await StoreApi.UpdateStoreLogo(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};
