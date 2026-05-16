"use client";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/providers/ToastProvider";
import AddToCartButton from "../cart/AddToCartButton";
import { Product } from "@/lib/types/product.types";
import { apiService } from "@/lib/services/apiService";
import { useGetProductWishlistStatus } from "@/lib/hooks/product.hook";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const viewProduct = () => {
    router.push(`/products/${product.id}`);
  };

  const { data: wishlistStatus } = useGetProductWishlistStatus(product.id);

  console.log("wishlistStatus", wishlistStatus);

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
  const stockCount = product.stock || 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const isOutOfStock = stockCount === 0;

  return (
    <div className="bg-muted rounded-2xl overflow-hidden border border-border hover:shadow-2xl hover:border-primary/40 transition-all duration-300 group  relative">
      {/* linear overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 rounded-2xl" />

      {/* Image Container */}
      <div
        onClick={viewProduct}
        className="relative cursor-pointer overflow-hidden aspect-square bg-muted"
      >
        <Image
          src={imageError ? "/makeup_product.png" : productImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
          unoptimized
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {discountPercentage > 0 && (
            <div className="bg-linear-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm">
              -{discountPercentage}% OFF
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-sm">
              Only {stockCount} left
            </div>
          )}
          {isOutOfStock && (
            <div className="bg-linear-to-r from-gray-700 to-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg backdrop-blur-sm">
              Out of Stock
            </div>
          )}
        </div>

        {/* Like Button */}
        <div className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-20 border border-gray-200">
          <Heart
            size={18}
            className={`transition-all duration-200 ${
              isLiked
                ? "fill-red-500 text-red-500 scale-110"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <span className="text-white font-semibold text-sm px-6 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Quick View
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3 relative">
        {/* Product Name */}
        <h3 className="font-semibold text-base leading-tight line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-accent-400 text-gray-400"
                }
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {averageRating > 0 ? averageRating.toFixed(1) : "New"}
          </span>
          {reviewCount > 0 && (
            <span className="text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          )}
        </div>

        {/* Price Section */}
        <div className="flex bg-muted items-baseline gap-2 pt-1">
          <span className="text-2xl font-bold">${product.sale_price}</span>
          {discountPercentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.original_price}
            </span>
          )}
        </div>
        {/* Add to Cart Button */}
        <AddToCartButton product={product} />

        {/* Stock Warning */}
        {isLowStock && (
          <div className="flex items-center gap-1.5 text-xs text-orange-600 font-medium bg-orange-50 px-2.5 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            Only {stockCount} left in stock!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
