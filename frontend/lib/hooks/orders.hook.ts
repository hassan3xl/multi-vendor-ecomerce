import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/order.api";
import { Order } from "../types/order.types";

// get orders

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getOrders(),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shippingData: any) => orderApi.createOrder(shippingData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
    onError: (error) => {
      console.error("Failed to create order:", error);
    },
  });
};
