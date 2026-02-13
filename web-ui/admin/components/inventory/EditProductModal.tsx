"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import BaseModal from "../modals/BaseModal";
import {
  useEditProduct,
  useGetProductsCategories,
  useGetProduct,
} from "@/lib/hooks/product.hook";
import { Input } from "../ui/input";
import { DollarSign, Package } from "lucide-react";

interface EditProductModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  productId: string;
}

type FormValues = {
  name: string;
  description: string;
  category_id: string;
  sale_price: number;
  original_price: number;
};

const EditProductModal = ({
  isModalOpen,
  closeModal,
  productId,
}: EditProductModalProps) => {
  const { mutate: editProduct, isPending: isEditing } = useEditProduct();

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetProductsCategories();
  const { data: product, isLoading: isProductLoading } =
    useGetProduct(productId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<FormValues>({});

  // Reset form when product data is available
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        category_id: product.category.id,
        sale_price: product.sale_price,
        original_price: product.original_price,
      });
    }
  }, [product, reset]);

  const onSubmit = (data: FormValues) => {
    const productData = {
      id: productId,
      name: data.name,
      description: data.description,
      category_id: data.category_id,
      sale_price: Number(data.sale_price),
      original_price: Number(data.original_price),
      is_on_sale: true,
    };

    editProduct(productData, {
      onSuccess: () => {
        reset();
        closeModal();
      },
      onError: (error) => {
        console.error("Failed to edit product:", error);
      },
    });
  };

  if (isProductLoading) {
    return (
      <BaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Edit Product"
        description="Loading product data..."
      >
        <div className="flex justify-center py-8">Loading...</div>
      </BaseModal>
    );
  }

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Edit Product"
      description="Update product details."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Basic Info</h3>
          </div>

          <Input
            name="name"
            register={register}
            label="Product Name"
            placeholder="Enter name"
            error={errors.name}
            validation={{ required: "Name is required" }}
          />

          <Input
            name="category_id"
            register={register}
            label="Category"
            field="select"
            placeholder="Select category"
            options={
              isProductLoading
                ? [{ value: "", label: "Loading..." }]
                : categories?.map((c: any) => ({
                    value: c.id,
                    label: c.name,
                  })) || []
            }
            error={errors.category_id}
            validation={{ required: "Category is required" }}
          />

          <Input
            name="description"
            register={register}
            label="Description"
            field="textarea"
            placeholder="Enter description"
            rows={3}
            error={errors.description}
            validation={{ required: "Description is required" }}
          />
        </div>

        {/* Pricing */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Pricing</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="sale_price"
              register={register}
              label="Sale Price"
              type="number"
              placeholder="0.00"
              error={errors.sale_price}
              validation={{ required: "Sale price is required" }}
            />

            <Input
              name="original_price"
              register={register}
              label="Original Price"
              type="number"
              placeholder="0.00"
              error={errors.original_price}
              validation={{ required: "Original price is required" }}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              closeModal();
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting || isEditing}
          >
            {isSubmitting || isEditing ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditProductModal;
