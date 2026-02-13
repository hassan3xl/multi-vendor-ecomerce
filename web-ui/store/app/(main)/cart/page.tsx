"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQuantity, removeItemFromCart, clearCart, isLoading } =
    useCart();

  // Loading state
  if (isLoading && (!cart.items || cart.items.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          Add some products to get started!
        </p>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemFromCart(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cart.total_quantity} {cart.total_quantity === 1 ? "item" : "items"}{" "}
            in your cart
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCart}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={isLoading}
        >
          <Trash2 size={16} className="mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="xl:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <Link
                href={`/products/${item.product.id}`}
                className="relative w-full sm:w-28 h-38 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-muted group"
              >
                {item.product.images && item.product.images.length > 0 ? (
                  <Image
                    src={item.product.images[0].image}
                    alt={item.product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 112px"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-lg font-bold text-primary">
                      ${parseFloat(item.product.effective_price).toFixed(2)}
                    </p>
                    {item.product.is_on_sale && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${parseFloat(item.product.original_price).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.product.stock > 0 ? (
                      <>
                        {item.product.stock <= 5 && (
                          <span className="text-orange-600 font-medium">
                            Only {item.product.stock} left in stock
                          </span>
                        )}
                        {item.product.stock > 5 && (
                          <span className="text-green-600">In Stock</span>
                        )}
                      </>
                    ) : (
                      <span className="text-destructive font-medium">
                        Out of Stock
                      </span>
                    )}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-sm text-muted-foreground mr-2">
                    Quantity:
                  </span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1 || isLoading}
                      className="h-8 w-8 p-0 hover:bg-muted rounded-r-none"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-12 text-center font-semibold text-sm border-x">
                      {item.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={
                        item.quantity >= item.product.stock || isLoading
                      }
                      className="h-8 w-8 p-0 hover:bg-muted rounded-l-none"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Price & Remove */}
              <div className="flex sm:flex-col items-end justify-between sm:justify-between gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                  <p className="font-bold text-xl">
                    ${item.item_total.toFixed(2)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isLoading}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label={`Remove ${item.product.name} from cart`}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="mr-1 animate-spin" />
                  ) : (
                    <Trash2 size={16} className="mr-1" />
                  )}
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-card shadow-sm sticky top-4">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({cart.total_quantity} items)</span>
                <span className="font-semibold text-foreground">
                  ${cart.cart_total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span className="font-medium text-foreground">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Estimated Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${cart.cart_total.toFixed(2)}
                </span>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full mb-3" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>

            <div className="mt-6 pt-6 border-t">
              <p className="text-xs text-muted-foreground text-center">
                🔒 Secure checkout • 🔄 Free returns • ✓ 30-day guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
