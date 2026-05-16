import { apiService } from "../services/apiService";

export const cartApi = {
  getCart: async () => {
    try {
      const res = await apiService.get("/cart/");
      return res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },
  addItemToCart: async (formData: {
    product_id: number | string;
    quantity: number;
  }) => {
    try {
      const res = await apiService.post("/cart/add_item/", formData);
      return res;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  },

  updateCartItem: async (itemId: string, formData: { quantity: number }) => {
    const res = await apiService.patch(
      `/cart/update_item/${itemId}/`,
      formData
    );
    return res;
  },

  removeItemFromCart: async (itemId: string) => {
    try {
      const res = await apiService.delete(`/cart/remove_item/${itemId}/`);
      return res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const res = await apiService.delete(`/cart/clear/`);
      return res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },
};
