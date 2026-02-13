"use client";
import { Product } from "@/lib/types/types";
import { Edit, Package, TrendingUp, BarChart3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";
import { apiService } from "@/lib/services/apiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SpecificationModal from "@/components/inventory/SpecificationModal";
import { useDeleteProductImage, useGetProduct } from "@/lib/hooks/product.hook";
import FeaturesModal from "@/components/inventory/FeaturesModal";
import { useToast } from "@/providers/ToastProvider";
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
import EditProductModal from "@/components/inventory/EditProductModal";
import AddProductImageModal from "@/components/inventory/AddProductImageModal";

const ProductDetailsPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  const [showSpecificationModal, setShowSpecificationModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const { addToast } = useToast();

  // Delete confirmation states
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "feature" | "spec" | null;
    id: string | number | null;
    name?: string;
  }>({
    open: false,
    type: null,
    id: null,
    name: undefined,
  });

  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
    refetch,
  } = useGetProduct(productId);

  const deleteImage = useDeleteProductImage();

  const handleDeleteImage = (imageId: string) => {
    deleteImage.mutate(
      { productId, imageId },
      {
        onSuccess: () => {
          addToast({
            title: "Image Deleted",
            description: "The image was removed successfully.",
            type: "success",
            duration: 3000,
          });
          refetch(); // refresh product data
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

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const confirmDelete = (
    type: "feature" | "spec",
    id: string | number,
    name?: string
  ) => {
    setDeleteConfirm({
      open: true,
      type,
      id,
      name,
    });
  };

  const handleDeleteFeature = async () => {
    const featureId = deleteConfirm.id;
    if (!featureId) return;

    try {
      await apiService.delete(`/products/${productId}/features/${featureId}/`);
      addToast({
        title: "Success",
        description: "Feature deleted successfully",
        type: "success",
        duration: 3000,
      });
      refetch();
      setDeleteConfirm({ open: false, type: null, id: null });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to delete feature. Please try again.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleDeleteSpec = async () => {
    const specId = deleteConfirm.id;
    if (!specId) return;

    try {
      await apiService.delete(
        `/products/${productId}/specifications/${specId}/`
      );
      addToast({
        title: "Success",
        description: "Specification deleted successfully",
        type: "success",
        duration: 3000,
      });
      refetch();
      setDeleteConfirm({ open: false, type: null, id: null });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to delete specification. Please try again.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleViewAnalytics = () => {
    router.push(`/products/${productId}/analytics`);
  };

  // Calculate metrics
  const original = product?.original_price ?? 0;
  const sale = product?.sale_price ?? 0;

  const discountPercentage =
    original > sale ? Math.round(((original - sale) / original) * 100) : 0;

  const discountAmount = original > sale ? original - sale : 0;

  const stockCount = product?.stock ?? 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const isOutOfStock = stockCount === 0;
  const isActive = product?.is_active !== false;

  // Loading state
  if (isProductLoading) {
    return <Loader title="Loading Product Details..." />;
  }

  // Error state
  if (productError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or you don't have access.
        </p>
        <Button onClick={() => router.push("/inventory")}>
          Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Product Details</h1>
            {!isActive && (
              <Badge variant="secondary" className="bg-gray-500 text-white">
                Inactive
              </Badge>
            )}
            {isLowStock && (
              <Badge variant="secondary" className="bg-orange-500 text-white">
                Low Stock
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary" className="bg-red-500 text-white">
                Out of Stock
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Manage and monitor your product
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <Card>
            <CardHeader></CardHeader>
            <CardContent className="space-y-4">
              <div className="relative mb-7 overflow-hidden rounded-lg border border-border bg-card aspect-square">
                <Image
                  src={
                    product.images?.[selectedImage]?.image &&
                    !imageErrors[selectedImage]
                      ? product.images[selectedImage].image
                      : "/makeup_product.png"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(selectedImage)}
                  unoptimized
                />

                {/* Sale Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    -{discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === idx
                            ? "border-blue-600"
                            : "border-border hover:border-gray-400"
                        }`}
                      >
                        <Image
                          src={
                            img.image && !imageErrors[idx]
                              ? img.image
                              : "/makeup_product.png"
                          }
                          alt={`${product.name} - Image ${idx + 1}`}
                          fill
                          className="object-cover"
                          onError={() => handleImageError(idx)}
                          unoptimized
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Sale Price
                  </label>
                  <p className="text-2xl font-bold text-green-600">
                    ${product.sale_price}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Original Price
                  </label>
                  <p className="text-xl text-muted-foreground line-through">
                    ${product.original_price}
                  </p>
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Category
                  </label>
                  <p className="font-medium">
                    {product.category?.name || "Uncategorized"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                    <span className="font-medium">
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory & Analytics */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stockCount}</div>
                <p className="text-sm text-muted-foreground">units in stock</p>
                {isLowStock && (
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-orange-100 text-orange-800"
                  >
                    Low Stock Warning
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-red-100 text-red-800"
                  >
                    Out of Stock
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {product.average_rating
                    ? product.average_rating.toFixed(1)
                    : "0.0"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.product_reviews?.length || 0} reviews
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Specifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Specifications</CardTitle>
            <Button
              onClick={() => setShowSpecificationModal(true)}
              size="sm"
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </CardHeader>
          <CardContent>
            {product.specifications && product.specifications.length > 0 ? (
              <div className="space-y-2">
                {product.specifications.map((specification: any) => (
                  <div
                    key={specification.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <dt className="text-sm text-muted-foreground">
                        {specification.title}
                      </dt>
                      <dd className="font-medium">{specification.body}</dd>
                    </div>
                    <Button
                      onClick={() =>
                        confirmDelete(
                          "spec",
                          specification.id,
                          specification.title
                        )
                      }
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No specifications added yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Product Features</CardTitle>
            <Button
              onClick={() => setShowFeaturesModal(true)}
              size="sm"
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </CardHeader>
          <CardContent>
            {product.features && product.features.length > 0 ? (
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-2 py-2 border-b last:border-0"
                  >
                    <div className="flex items-start gap-2 flex-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                      <span className="text-sm">{feature.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        confirmDelete("feature", feature.id, feature.name)
                      }
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No features added yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAddImageModal(true)}
            >
              <Package className="w-4 h-4 mr-2" />
              Manage Images
            </Button>
            <Button variant="outline" onClick={() => setShowEditModal(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Summary */}
      {product.product_reviews && product.product_reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {product.product_reviews.slice(0, 3).map((review: any) => (
                <div key={review.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">
                      {review.user?.name || "Anonymous"}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
            {product.product_reviews.length > 3 && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleViewAnalytics}
              >
                View All {product.product_reviews.length} Reviews
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <SpecificationModal
        productId={product.id}
        isModalOpen={showSpecificationModal}
        closeModal={() => {
          setShowSpecificationModal(false);
          refetch();
        }}
      />
      <FeaturesModal
        productId={product.id}
        isModalOpen={showFeaturesModal}
        closeModal={() => {
          setShowFeaturesModal(false);
          refetch();
        }}
      />
      <EditProductModal
        isModalOpen={showEditModal}
        closeModal={() => setShowEditModal(false)}
        productId={product.id}
      />
      <AddProductImageModal
        isModalOpen={showAddImageModal}
        closeModal={() => setShowAddImageModal(false)}
        productId={product.id}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirm.open}
        onOpenChange={(open) =>
          !open && setDeleteConfirm({ open: false, type: null, id: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this{" "}
              {deleteConfirm.type === "feature" ? "feature" : "specification"}
              {deleteConfirm.name && (
                <>
                  : <span className="font-semibold">{deleteConfirm.name}</span>
                </>
              )}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={
                deleteConfirm.type === "feature"
                  ? handleDeleteFeature
                  : handleDeleteSpec
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductDetailsPage;
