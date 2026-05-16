"use client";

import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CartIcon() {
  const { cart } = useCart();

  return (
    <Link href="/cart" className="relative group rounded-md bg-background p-2">
      <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
      {cart.total_quantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-in fade-in zoom-in">
          {cart.total_quantity}
        </span>
      )}
    </Link>
  );
}
