"use client";
import { Heart, Truck, Shield, RefreshCw, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";
import ProductMerchantCard from "@/components/products/ProductMerchantCard";
import ProductReview from "@/components/products/ProductReviews";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useGetProduct,
  useGetProductWishlistStatus,
} from "@/lib/hooks/product.hook";
import AdditionalProductInfo from "@/components/products/AdditionalProductInfo";
import { apiService } from "@/lib/services/apiService";
import { useToast } from "@/providers/ToastProvider";

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useAuth();
  const params = useParams();
  const productId = params.productId as string;
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productError,
  } = useGetProduct(productId);

  const {
    data: likeData,
    isLoading: isLoadingLike,
    error: getLikesError,
  } = useGetProductWishlistStatus(productId);

  // ✅ Toggle like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Please log in to like this product");
      }
      return await apiService.post(`/products/${productId}/wishlist/`);
    },
    onSuccess: (data) => {
      // Update the like status cache
      addToast({
        title: "Success",
        description: "Product successfully added to wishlist",
        type: "success",
        duration: 3000,
      });
      queryClient.setQueryData(["productLike", productId], data);
    },
    onError: (error: any) => {
      alert(error.message || "Error toggling like");
      addToast({
        title: "Error",
        description: error.message || "Error toggling like",
        type: "error",
        duration: 3000,
      });
    },
  });

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Loading state
  if (isLoadingProduct) {
    return <Loader title="Loading Product..." />;
  }

  // Error state
  if (productError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground">
          The product you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const isLiked = likeData?.liked || false;
  const likesCount = likeData?.likes_count || product.likes_count || 0;

  return (
    <div className="">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Image Gallery */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-border bg-card">
            <Image
              src={
                product?.images[selectedImage]?.image || "/makeup_product.png"
              }
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
            />

            {product.original_price > product.sale_price && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold">
                Sale
              </div>
            )}
            <Button
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending || isLoadingLike}
              className={`absolute top-3 right-3 p-2 sm:p-3 rounded-full shadow-md transition-colors ${
                isLiked ? "bg-red-100" : "bg-white hover:bg-red-50"
              }`}
            >
              <Heart
                size={20}
                className={`sm:w-5 sm:h-5 transition-colors ${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500 hover:text-red-500"
                }`}
              />
            </Button>
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-blue-600"
                      : "border-border hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img.image}
                    alt={`${product.name} - Image ${idx + 1}`}
                    className="w-full h-16 sm:h-20 lg:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(product.average_rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-secondary-foreground">
                ({product.product_reviews?.length || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-blue-600">
              ${product.sale_price}
            </span>
            {product.original_price > product.sale_price && (
              <>
                <span className="text-lg sm:text-xl text-gray-500 line-through">
                  ${product.original_price}
                </span>
                <span className="text-sm sm:text-base text-green-600 font-semibold">
                  Save $
                  {(product.original_price - product.sale_price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-b border-border py-3 sm:py-4">
            <p className="text-sm sm:text-base text-primary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2 sm:space-y-3">
            <p className="font-semibold text-sm sm:text-base">Quantity:</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center rounded-lg gap-2 overflow-hidden">
                <Button
                  onClick={decrementQuantity}
                  variant="outline"
                  className="px-3 sm:px-4 py-2 hover:bg-card transition-colors"
                >
                  -
                </Button>
                <Button
                  variant="outline"
                  className="px-4 sm:px-6 py-2 bg-card border border-border font-semibold"
                >
                  {quantity}
                </Button>
                <Button
                  variant="outline"
                  onClick={incrementQuantity}
                  className="px-3 sm:px-4 py-2 hover:bg-card transition-colors"
                >
                  +
                </Button>
              </div>
              <span className="text-xs sm:text-sm text-secondary-foreground">
                Only {product?.stock || 0} items left in stock!
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <AddToCartButton product={product} />

            <Button variant="outline" className="">
              Buy Now
            </Button>
          </div>

          {/* Oder info */}
          <div className="grid grid-cols-3 gap-2 bg-card rounded-md sm:gap-4 pt-4 sm:pt-6 border-t border-border">
            <div className="flex flex-col items-center text-center p-2 sm:p-4 bg-card rounded-lg">
              <Truck className="mb-1 sm:mb-2 text-blue-600" size={20} />
              <span className="text-[10px] sm:text-xs font-semibold">
                Free Shipping
              </span>
              <span className="text-[9px] sm:text-xs text-secondary hidden sm:block">
                On orders over $50
              </span>
            </div>
            <div className="flex flex-col items-center text-center p-2 sm:p-4 bg-card rounded-lg">
              <Shield className="mb-1 sm:mb-2 text-blue-600" size={20} />
              <span className="text-[10px] sm:text-xs font-semibold">
                2 Year Warranty
              </span>
              <span className="text-[9px] sm:text-xs text-secondary hidden sm:block">
                Full coverage
              </span>
            </div>
            <div className="flex flex-col items-center text-center p-2 sm:p-4 bg-card rounded-lg">
              <RefreshCw className="mb-1 sm:mb-2 text-blue-600" size={20} />
              <span className="text-[10px] sm:text-xs font-semibold">
                30-Day Returns
              </span>
              <span className="text-[9px] sm:text-xs text-secondary hidden sm:block">
                Easy refunds
              </span>
            </div>
          </div>

          {/* Product Merchant */}
          <ProductMerchantCard product={product} />
        </div>
      </div>
      <br />
      {/* spec and features */}
      <div className="flex justify-between gap-4">
        <div className="bg-card p-4 sm:p-6 rounded-lg w-full">
          <h3 className="font-semibold mb-3 text-base sm:text-lg">
            Specifications
          </h3>
          {product.specifications?.map((spec) => (
            <div key={spec.id} className="flex justify-between">
              <dt className="text-primary">{spec.title}:</dt>
              <dd className="font-medium">{spec.body}</dd>
            </div>
          ))}
        </div>

        {/* Product features */}
        <div className="space-y-2 sm:space-y-3 w-full bg-card rounded-md p-4">
          <h3 className="font-semibold text-base sm:text-lg">Key Features:</h3>
          <ul className="space-y-2">
            {product.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check size={18} className="text-green-600 mt-0.5 shrink-0" />
                <span className="text-sm sm:text-base text-primary">
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Reviews Section */}
      <ProductReview product={product} />
      {/* Additional Information */}
      <AdditionalProductInfo />
    </div>
  );
};

export default ProductDetails;
