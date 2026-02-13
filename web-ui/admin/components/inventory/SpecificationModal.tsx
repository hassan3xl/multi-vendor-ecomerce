"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import BaseModal from "../modals/BaseModal";
import { Wrench } from "lucide-react";
import { Input } from "../ui/input";
import { useAddProductSpecification } from "@/lib/hooks/product.specification.hook";
import { useToast } from "@/providers/ToastProvider";

interface SpecificationModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  productId: string;
}

type FormValues = {
  title: string;
  body: string;
};

const SpecificationModal = ({
  isModalOpen,
  closeModal,
  productId,
}: SpecificationModalProps) => {
  const { mutateAsync: addSpec } = useAddProductSpecification(productId);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      await addSpec({
        title: formData.title,
        body: formData.body,
      });

      addToast({
        title: "Success",
        description: "Specification added successfully",
        type: "success",
        duration: 3000,
      });

      reset();
      closeModal();
    } catch (error: any) {
      addToast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to add specification. Please try again.",
        type: "error",
        duration: 4000,
      });
    }
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleClose}
      title="Add Specification"
      description="Add a technical specification for your product."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Specification Details</h3>
          </div>

          <div className="space-y-4">
            <div className="border p-4 rounded-lg bg-card">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Input
                    name="title"
                    label="Title"
                    placeholder="e.g. Material, Weight, Dimensions"
                    register={register}
                    validation={{
                      required: "Title is required",
                      minLength: {
                        value: 2,
                        message: "Title must be at least 2 characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Title must be less than 100 characters",
                      },
                    }}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    name="body"
                    label="Value"
                    placeholder="e.g. Stainless Steel, 500g, 10x5x3 cm"
                    register={register}
                    validation={{
                      required: "Value is required",
                      minLength: {
                        value: 2,
                        message: "Value must be at least 2 characters",
                      },
                      maxLength: {
                        value: 200,
                        message: "Value must be less than 200 characters",
                      },
                    }}
                  />
                  {errors.body && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.body.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-xs text-blue-800">
              <strong>Tip:</strong> Add technical details that help customers
              understand your product better. Common examples: Material, Weight,
              Dimensions, Color, Brand, Model Number, Warranty.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Adding...
              </>
            ) : (
              "Add Specification"
            )}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default SpecificationModal;
