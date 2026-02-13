// src/lib/hooks/product.specification.hook.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/services/apiService";
import { ProductFeatures } from "../types/types";

// ✅ Fetch all specs for a product
export const useGetProductFeatures = (productId: string) =>
  useQuery<ProductFeatures[]>({
    queryKey: ["product-Features", productId],
    queryFn: async () => {
      const res = await apiService.get(`/products/${productId}/features/`);
      return res;
    },
    enabled: !!productId,
  });

// ✅ Add a new feature
export const useAddProductFeature = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return await apiService.post(`/products/${productId}/features/`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-features", productId],
      });
    },
  });
};

// ✅ Delete a feature
export const useDeleteProductFeature = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specId: string) => {
      return await apiService.delete(
        `/products/${productId}/Features/${specId}/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-Features", productId],
      });
    },
  });
};
