"use client";
import React, { createContext, useContext, ReactNode } from "react";
import {
  useAddItem,
  useClearCart,
  useGetCart,
  useRemoveItem,
  useUpdateQuantity,
} from "@/lib/hooks/cart.hooks";
import { Cart, CartContextType } from "@/lib/types/cart.types";
import { useCreateOrder } from "@/lib/hooks/orders.hook";

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  // Fetch cart data
  const { data: cartData, isLoading } = useGetCart();

  // cart Mutations
  const { mutate: addToCart, isPending: isAdding } = useAddItem();
  const { mutate: removeItemFromCart, isPending: isRemoving } = useRemoveItem();
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateQuantity();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();

  // order mutations
  const { mutateAsync: createOrder } = useCreateOrder();

  // Default cart if no data
  const cart: Cart = cartData || {
    id: 0,
    items: [],
    total: 0,
    itemCount: 0,
  };

  const value: CartContextType = {
    cart,
    isLoading: isLoading || isAdding || isRemoving || isUpdating || isClearing,
    addToCart,
    updateQuantity,
    removeItemFromCart,
    clearCart,
    createOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
