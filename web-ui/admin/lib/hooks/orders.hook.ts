import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/order.api";
import { q } from "framer-motion/client";

// get orders

export const useGetOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderApi.getOrders(),
  });
};

export const useGetOrder = (orderId: string | null) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderApi.getOrderDetails(orderId),
    enabled: !!orderId,
  });
};

export const useAcceptOrder = (orderId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => orderApi.acceptOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
};

export const useRejectOrder = (orderId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => orderApi.rejectOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
};

export const useShipOrDeliverOrder = (orderId: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => orderApi.shipOrderAndDeliverOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
  });
};
