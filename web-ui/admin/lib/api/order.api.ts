import { apiService } from "../services/apiService";

export const orderApi = {
  createOrder: async (shippingData: any) => {
    try {
      const res = await apiService.post("/orders/", shippingData);
      return res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },
  getOrders: async () => {
    try {
      const res = await apiService.get("/orders/");
      return res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  getOrderDetails: async (orderId: string | null) => {
    try {
      const res = await apiService.get(`/orders/${orderId}/`);
      return res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  acceptOrder: async (orderId: string | null) => {
    try {
      const res = await apiService.post(`/orders/${orderId}/accept/`);
      return res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  rejectOrder: async (orderId: string | null) => {
    try {
      const res = await apiService.post(`/orders/${orderId}/reject/`);
      return res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  shipOrderAndDeliverOrder: async (orderId: string | null) => {
    try {
      const res = await apiService.post(`/orders/${orderId}/ship/`);
      return res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },
};
