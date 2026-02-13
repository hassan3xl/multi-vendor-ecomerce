"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import BaseModal from "../modals/BaseModal";
import {
  useEditProduct,
  useGetProductImages,
  useDeleteProductImage,
  useUploadProductImage,
  useSetPrimaryImage,
} from "@/lib/hooks/product.hook";
import { Input } from "../ui/input";
import { Upload, Trash2, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/providers/ToastProvider";

interface AddProductImageModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  productId: string;
}

type FormValues = {
  images: FileList;
};

const AddProductImageModal = ({
  isModalOpen,
  closeModal,
  productId,
}: AddProductImageModalProps) => {
  const {
    data: productImages,
    isLoading,
    refetch,
  } = useGetProductImages(productId);
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormValues>({});

  const { mutate: deleteImage, isPending: isDeleting } =
    useDeleteProductImage();
  const { mutate: uploadImages, isPending: isUploading } =
    useUploadProductImage();
  const { mutate: setPrimaryImage, isPending: isSettingPrimary } =
    useSetPrimaryImage();

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...filesArray]);

    // Create preview URLs
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove preview image
  const removePreviewImage = (index: number) => {
    setPreviewImages((prev) => {
      URL.revokeObjectURL(prev[index]); // Clean up object URL
      return prev.filter((_, i) => i !== index);
    });
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete existing image
  const handleDeleteImage = (imageId: string) => {
    deleteImage(
      { productId, imageId },
      {
        onSuccess: () => {
          addToast({
            title: "Image Deleted",
            description: "The image was removed successfully.",
            type: "success",
            duration: 3000,
          });
          refetch();
        },
        onError: () => {
          addToast({
            title: "Delete Failed",
            description: "Unable to delete image. Please try again.",
            type: "error",
            duration: 3000,
          });
        },
      }
    );
  };

  // Set primary image
  const handleSetPrimary = (imageId: string) => {
    setPrimaryImage(
      { productId, imageId },
      {
        onSuccess: () => {
          addToast({
            title: "Primary Image Set",
            description: "The image has been set as primary.",
            type: "success",
            duration: 3000,
          });
          refetch();
          //   closeModal();
        },
        onError: () => {
          addToast({
            title: "Update Failed",
            description: "Unable to set primary image. Please try again.",
            type: "error",
            duration: 3000,
          });
        },
      }
    );
  };

  // Upload images
  const onSubmit = async () => {
    if (selectedFiles.length === 0) {
      addToast({
        title: "No Images",
        description: "Please select at least one image to upload.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("image", file);
    });

    uploadImages(
      { productId, formData },
      {
        onSuccess: () => {
          addToast({
            title: "Images Uploaded",
            description: "Images have been uploaded successfully.",
            type: "success",
            duration: 3000,
          });
          // Clean up
          previewImages.forEach((url) => URL.revokeObjectURL(url));
          setPreviewImages([]);
          setSelectedFiles([]);
          refetch();
          reset();
        },
        onError: () => {
          addToast({
            title: "Upload Failed",
            description: "Unable to upload images. Please try again.",
            type: "error",
            duration: 3000,
          });
        },
      }
    );
  };

  const handleClose = () => {
    // Clean up object URLs
    previewImages.forEach((url) => URL.revokeObjectURL(url));
    setPreviewImages([]);
    setSelectedFiles([]);
    reset();
    closeModal();
  };

  if (isLoading) {
    return (
      <BaseModal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Upload Product Image"
        description="Manage product images."
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </BaseModal>
    );
  }

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={handleClose}
      title="Upload Product Image"
      description="Manage product images."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
      >
        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Select Image
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Preview New Images */}
          {previewImages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">New Image to Upload</h3>
              <div className="grid grid-cols-3 gap-3">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={preview}
                      width={120}
                      height={120}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removePreviewImage(index)}
                      className="absolute top-1 right-1 p-1.5 bg-destructive text-destructive-foreground rounded-full transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Existing Images */}
        {productImages && productImages.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Current Images</h3>
            <div className="grid grid-cols-3 gap-3">
              {productImages.map((image: any) => (
                <div
                  key={image.id}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <Image
                    src={image.image}
                    width={120}
                    height={120}
                    alt="Product image"
                    className="w-full h-32 object-cover"
                    unoptimized
                  />

                  {/* Primary badge */}
                  {image.is_primary && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Primary
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mx-4 p-1 transition-opacity flex items-center justify-center gap-2">
                    {!image.is_primary && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetPrimary(image.id)}
                        className="flex items-center gap-1"
                      >
                        {isSettingPrimary ? "working" : "Set primary"}
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isUploading || selectedFiles.length === 0}
          >
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AddProductImageModal;
