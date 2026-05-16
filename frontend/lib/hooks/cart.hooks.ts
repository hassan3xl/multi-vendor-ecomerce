import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cart.api";
import { AddItemPayload, UpdateQuantityPayload } from "../types/cart.types";
import { useAuth } from "@/contexts/AuthContext";

export function useGetCart() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    enabled: !!user, // <---- prevents request when user is not signed in
  });
}

export const useAddItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddItemPayload) => cartApi.addItemToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      console.error("Failed to add item to cart:", error);
    },
  });
};

// Remove itemId parameter - it should come from the mutation call
export const useRemoveItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItemFromCart(itemId),
    onSuccess: () => {
      // Invalidate the entire cart, not just one item
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      console.error("Failed to remove item from cart:", error);
    },
  });
};

// Remove parameters - they should come from the mutation call
export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: UpdateQuantityPayload) =>
      cartApi.updateCartItem(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      console.error("Failed to update quantity:", error);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      console.error("Failed to clear cart:", error);
    },
  });
};
