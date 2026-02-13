"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import BaseModal from "../modals/BaseModal";
import { Star } from "lucide-react";
import { Input } from "../ui/input";
import { useAddProductFeature } from "@/lib/hooks/product.feature.hook";
import { useToast } from "@/providers/ToastProvider";

interface FeaturesModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  productId: string;
}

type FormValues = {
  name: string;
};

const FeaturesModal = ({
  isModalOpen,
  closeModal,
  productId,
}: FeaturesModalProps) => {
  const { mutateAsync: addFeature } = useAddProductFeature(productId);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      await addFeature({ name: formData.name });

      addToast({
        title: "Success",
        description: "Feature added successfully",
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
          "Failed to add feature. Please try again.",
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
      title="Add Product Feature"
      description="Add a new feature to highlight what makes your product special."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="space-y-4">
            <Input
              name="name"
              label="Feature Name"
              placeholder="e.g. Water Resistant"
              register={register}
              validation={{
                required: "Feature name is required",
                minLength: {
                  value: 3,
                  message: "Feature name must be at least 3 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Feature name must be less than 100 characters",
                },
              }}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Helper Text */}
          <div className="bg-muted-background border border-border rounded-lg p-3 mt-4">
            <p className="text-xs text-primary">
              <strong>Tip:</strong> Features are key selling points that make
              your product stand out. Be clear and concise!
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
              "Add Feature"
            )}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default FeaturesModal;
