// src/lib/hooks/product.specification.hook.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/services/apiService";

// ✅ Fetch all specs for a product
export const useGetProductSpecifications = (productId: string) =>
  useQuery({
    queryKey: ["product-specifications", productId],
    queryFn: async () => {
      const res = await apiService.get(
        `/products/${productId}/specifications/`
      );
      return res;
    },
    enabled: !!productId,
  });

// ✅ Add a new specification
export const useAddProductSpecification = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return await apiService.post(
        `/products/${productId}/specifications/`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-specifications", productId],
      });
    },
  });
};

// ✅ Update an existing specification
export const useUpdateProductSpecification = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return await apiService.patch(
        `/products/${productId}/specifications/`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-specifications", productId],
      });
    },
  });
};

// ✅ Delete a specification
export const useDeleteProductSpecification = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (specId: string) => {
      return await apiService.delete(
        `/products/${productId}/specifications/${specId}/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product-specifications", productId],
      });
    },
  });
};
