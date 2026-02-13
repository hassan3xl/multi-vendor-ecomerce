"use client";
import { Product } from "@/lib/types/types";
import { Edit, Trash2, Eye, MoreVertical, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/providers/ToastProvider";
import { apiService } from "@/lib/services/apiService";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProduct } from "@/lib/hooks/product.hook";
import { Button } from "../ui/button";
import EditProductModal from "../inventory/EditProductModal";

interface ProductCardProps {
  product: Product;
  merchantView?: boolean;
}

const ProductCard = ({ product, merchantView = true }: ProductCardProps) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const deleteMutation = useDeleteProduct();

  const viewProductDetails = () => {
    router.push(`/inventory/products/${product.id}`);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteMutation.mutateAsync(product.id);

      addToast({
        title: "Product deleted",
        description: `${product.name} has been deleted successfully`,
        type: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to delete product",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate discount percentage
  const discountPercentage =
    product.original_price > product.sale_price
      ? Math.round(
          ((product.original_price - product.sale_price) /
            product.original_price) *
            100
        )
      : 0;

  // Get first image or fallback
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]?.image
      : "/makeup_product.png";

  // Calculate average rating
  const averageRating = product.average_rating || 0;
  const reviewCount = product.product_reviews?.length || 0;

  // Stock status
  const stockCount = product.stock ?? 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const isOutOfStock = stockCount === 0;

  if (!merchantView) {
    // Return customer view (your original implementation)
    // ... (your original customer view JSX)
  }

  return (
    <div className="bg-secondary/10 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group relative">
      {/* Status Badge */}
      {!product.is_active && (
        <div className="absolute top-3 left-3 z-30">
          <div className="bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-sm">
            Inactive
          </div>
        </div>
      )}
      {/* Image Container */}
      <div
        onClick={viewProductDetails}
        className="relative cursor-pointer overflow-hidden aspect-square bg-muted"
      >
        <Image
          src={imageError ? "/makeup_product.png" : productImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          unoptimized
        />

        {/* Stock Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <span className="text-white font-semibold text-sm px-6 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-xl">
            Manage Product
          </span>
        </div>
      </div>
      {/* Card Content */}
      <div className="p-4 space-y-3 relative">
        {/* Product Name & Status */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-base leading-tight line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < Math.floor(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"}
          </span>
          {reviewCount > 0 && (
            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-green-600">
            ${product.sale_price}
          </span>
          {discountPercentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.original_price}
            </span>
          )}
        </div>

        {/* Inventory Info */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Stock:</span>
            <span
              className={`font-semibold ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            >
              {stockCount} units
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span
              className={`font-medium ${
                product.is_active ? "text-green-600" : "text-gray-500"
              }`}
            >
              {product.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
      <div className="m-4 ">
        <div className="flex gap-4">
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      {/* Stock Warning */}

      <div className="m-4">
        {isLowStock && (
          <div className="flex items-center gap-1.5 text-xs text-orange-600 font-medium bg-orange-50 px-2.5 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            Low stock - reorder soon!
          </div>
        )}
        {isOutOfStock && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 px-2.5 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            Out of stock
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{product.name}"? This action
              cannot be undone and will remove all product data including
              inventory and reviews.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductCard;
