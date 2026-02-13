import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/lib/services/apiService";

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
