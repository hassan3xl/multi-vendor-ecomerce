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
};
