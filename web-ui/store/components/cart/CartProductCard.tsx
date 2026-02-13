"use client";

import { Heart, Star, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface CartProductCardProps {
  product: any; // Product object with quantity added
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

const CartProductCard = ({
  product,
  onRemove,
  onQuantityChange,
}: CartProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const discountPercentage =
    product.original_price &&
    product.sale_price &&
    product.original_price > product.sale_price
      ? Math.round(
          ((product.original_price - product.sale_price) /
            product.original_price) *
            100
        )
      : 0;

  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]?.image
      : product.image || "/makeup_product.png";

  const averageRating = product.average_rating || 0;
  const reviewCount = product.product_reviews?.length || 0;

  const stockCount = product.inventory?.stock || 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const isOutOfStock = stockCount === 0;

  const viewProduct = () => {
    router.push(`/products/${product.id}`);
  };

  const decreaseQuantity = () => {
    if (product.quantity > 1) {
      onQuantityChange(product.quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (!isOutOfStock) {
      onQuantityChange(product.quantity + 1);
    }
  };

  return (
    <div className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image Section */}
        <div
          onClick={viewProduct}
          className="relative cursor-pointer overflow-hidden aspect-square bg-gray-100 rounded-lg shrink-0 w-full sm:w-32"
        >
          <Image
            src={imageError ? "/makeup_product.png" : productImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 128px"
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />

          {/* Badges */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3
              onClick={viewProduct}
              className="font-semibold text-lg cursor-pointer hover:text-blue-600 transition-colors"
            >
              {product.name}
            </h3>
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-300 text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating > 0 ? averageRating : "No ratings"}
            </span>
            {reviewCount > 0 && (
              <span className="text-xs text-gray-500">({reviewCount})</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-green-600">
              ${product.sale_price || product.price}
            </span>
            {discountPercentage > 0 && product.original_price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.original_price}
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseQuantity}
                  disabled={product.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-medium">
                  {product.quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  disabled={isOutOfStock}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <div className="text-sm text-gray-600">Item Total</div>
              <div className="text-lg font-bold">
                ${(product.sale_price || product.price) * product.quantity}
              </div>
            </div>
          </div>

          {/* Stock Warning */}
          {isLowStock && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-600 font-medium">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              Only {stockCount} left in stock!
            </div>
          )}
          {isOutOfStock && (
            <div className="mt-2 text-xs text-red-600 font-medium">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
