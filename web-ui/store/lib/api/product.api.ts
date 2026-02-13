import { apiService } from "../services/apiService";

export const productApi = {
  getProducts: async () => {
    try {
      const res = await apiService.get("/products/");
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProduct: async (productId: string) => {
    try {
      const res = await apiService.get(`/products/${productId}/`);
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductWishlistStatus: async (productId: string) => {
    try {
      const res = await apiService.get(`/products/${productId}/wishlist/`);
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductsCategory: async () => {
    try {
      const res = await apiService.get("/categories/");
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  AddProduct: async (productData: any) => {
    try {
      const res = await apiService.post("/products/", productData);
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  AddProductFeature: async (data: any) => {
    try {
      const res = await apiService.post("/products/", data);
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  EditProduct: async (productId: string | number, data: FormData | any) => {
    const res = await apiService.patch(`/products/${productId}/`, data);
    return res.data;
  },

  DeleteProduct: async (productId: string) => {
    try {
      const res = await apiService.delete(`/products/${productId}/`);
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  DeleteProductImage: async (productId: string, imageId: string) => {
    try {
      const res = await apiService.delete(
        `/products/${productId}/images/${imageId}/`
      );
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  getProductImages: async (productId: string) => {
    try {
      const res = await apiService.get(`/products/${productId}/images/`);
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  AddProductImage: async (productId: string, formData: any) => {
    try {
      const res = await apiService.postFormData(
        `/products/${productId}/images/`,
        formData
      );
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  SetPrimaryImage: async (productId: string, imageId: string) => {
    try {
      const res = await apiService.post(
        `/products/${productId}/images/${imageId}/set-primary/`
      );
      return res;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
};

export const specificationApi = {
  // GET product specifications
  getSpecifications: async (productId: string) => {
    const res = await apiService.get(`/products/${productId}/specifications/`);
    return res;
  },

  // add specs
  addSpecifications: async (productId: string, data: any) => {
    const res = await apiService.post(
      `/products/${productId}/specifications/`,
      data
    );
    return res;
  },

  // UPDATE product specifications
  updateSpecifications: async (productId: string, data: any) => {
    const res = await apiService.patch(
      `/products/${productId}/specifications/`,
      data
    );
    return res;
  },
};
