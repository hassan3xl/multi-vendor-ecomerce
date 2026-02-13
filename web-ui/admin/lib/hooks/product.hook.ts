import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/product.api";
import { Product } from "../types/types";

// --------------------------------------
// GET ALL PRODUCTS
// --------------------------------------
export function useGetProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: productApi.getProducts,
  });
}

// --------------------------------------
// GET A SINGLE PRODUCT
// --------------------------------------
export function useGetProduct(productId: string) {
  return useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => productApi.getProduct(productId),
    enabled: !!productId,
  });
}

// --------------------------------------
// GET PRODUCT IMAGES
// --------------------------------------
export function useGetProductImages(productId: string) {
  return useQuery({
    queryKey: ["product-images", productId],
    queryFn: () => productApi.getProductImages(productId),
    enabled: !!productId,
  });
}

// --------------------------------------
// DELETE PRODUCT IMAGE
// --------------------------------------
export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      imageId,
    }: {
      productId: string;
      imageId: string;
    }) => productApi.DeleteProductImage(productId, imageId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.productId],
      });
    },
  });
};

// --------------------------------------
// UPLOAD PRODUCT IMAGE
// MUST SEND FORMDATA
// --------------------------------------
export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      formData,
    }: {
      productId: string;
      formData: FormData;
    }) => productApi.AddProductImage(productId, formData),

    onSuccess: (_, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.productId],
      });
    },
  });
};

// --------------------------------------
// SET PRIMARY IMAGE
// --------------------------------------
export const useSetPrimaryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      imageId,
    }: {
      productId: string;
      imageId: string;
    }) => productApi.SetPrimaryImage(productId, imageId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product-images", variables.productId],
      });
    },
  });
};

// --------------------------------------
// GET PRODUCT CATEGORIES
// --------------------------------------
export function useGetProductsCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: productApi.getProductsCategory,
  });
}

// --------------------------------------
// ADD PRODUCT
// --------------------------------------
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: any) => productApi.AddProduct(productData),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// --------------------------------------
// ADD PRODUCT FEATURE  (FIXED)
// --------------------------------------
export const useAddProductFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => productApi.AddProductFeature(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });
};

// --------------------------------------
// EDIT PRODUCT
// --------------------------------------
export const useEditProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: any) =>
      productApi.EditProduct(productData.id, productData),

    onSuccess: (_, productData) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productData.id] });
    },
  });
};

// --------------------------------------
// DELETE PRODUCT
// --------------------------------------
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) =>
      productApi.DeleteProduct(productId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
