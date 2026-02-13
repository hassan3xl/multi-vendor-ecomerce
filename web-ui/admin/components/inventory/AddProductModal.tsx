"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import BaseModal from "../modals/BaseModal";
import {
  useAddProduct,
  useGetProductsCategories,
} from "@/lib/hooks/product.hook";
import { Input } from "../ui/input";
import {
  Package,
  DollarSign,
  Layers,
  Wrench,
  List,
  Image as ImageIcon,
} from "lucide-react";

interface AddProductModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  onProductAdded: () => void;
}

type FormValues = {
  name: string;
  description: string;
  category_id: string;
  sale_price: number;
  original_price: number;
  stock: number;
};

const AddProductModal = ({
  isModalOpen,
  closeModal,
  onProductAdded,
}: AddProductModalProps) => {
  const { mutate: addProduct, isPending } = useAddProduct();
  const { data: categories, isLoading } = useGetProductsCategories();
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<FormValues>({});

  const onSubmit = (data: FormValues) => {
    // Send as JSON instead of FormData
    const productData = {
      name: data.name,
      description: data.description,
      category_id: data.category_id,
      sale_price: Number(data.sale_price),
      original_price: Number(data.original_price),
      is_on_sale: true,
      stock: Number(data.stock),
    };

    console.log("Submitting Product Data:", productData);

    addProduct(productData, {
      onSuccess: () => {
        reset();
        setImagePreview([]);
        closeModal();
        onProductAdded();
      },
      onError: (error) => {
        console.error("Failed to add product:", error);
      },
    });
  };

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Add Product"
      description="Fill in product details to add a new item."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="">
        {/* Basic Info */}
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
              isLoading
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

        <Input
          name="stock"
          register={register}
          label="Stock"
          type="number"
          placeholder="0.00"
          error={errors.stock}
          validation={{ required: "Sale price is required" }}
        />

        {/* Pricing */}
        <div className="mt2">
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

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setImagePreview([]);
              closeModal();
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? "Adding..." : "Add Product"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AddProductModal;
