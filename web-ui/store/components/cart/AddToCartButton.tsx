"use client";
import { useCart } from "@/contexts/CartContext";
import { Button } from "../ui/button";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import { Product } from "@/lib/types/product.types";
import { useAuth } from "@/contexts/AuthContext";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, removeItemFromCart, cart, isLoading } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  // Helper to check if product is already in cart
  const getCartItem = (productId: string) => {
    return cart.items.find((item) => item.product.id === productId);
  };

  const cartItem = getCartItem(product.id);
  const inCart = !!cartItem;
  const stockCount = product?.stock || 0;
  const isOutOfStock = stockCount === 0;
  const handleToggleCart = () => {
    if (!user) {
      addToast({
        title: "Please sign in to add items to your cart",
        type: "error",
        duration: 2500,
      });
      return;
    }

    if (inCart && cartItem) {
      removeItemFromCart(cartItem.id);
      addToast({
        title: `${product.name} removed from cart.`,
        type: "info",
        duration: 2000,
      });
    } else {
      addToCart({
        product_id: product.id,
        quantity: 1,
      });

      addToast({
        title: `${product.name} added to cart!`,
        type: "success",
        duration: 3000,
      });
    }
  };

  return (
    <Button
      onClick={handleToggleCart}
      disabled={isOutOfStock || isLoading}
      className={`w-full group/btn mt-3 transition-all duration-200 ${
        isOutOfStock
          ? "bg-accent text-secondary cursor-not-allowed"
          : inCart
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "shadow-md hover:shadow-lg"
      }`}
    >
      {isLoading ? (
        <Loader2 size={18} className="mr-2 animate-spin" />
      ) : inCart ? (
        <>Remove from Cart</>
      ) : (
        <>Add to Cart</>
      )}
    </Button>
  );
}
