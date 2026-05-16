"use client";

import { useCart } from "@/contexts/CartContext";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import OrderCompleteModal from "@/components/checkout/OrderCompleteModal";
import { Lock, MapPin, CreditCard } from "lucide-react";

interface FormData {
  // Shipping Address
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function CheckoutPage() {
  const { cart, createOrder, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);

  console.log("cart checkout page", cart);

  const cartItems = cart?.items || [];
  const subtotal = cart?.cart_total || 0;
  const shipping = 14;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    defaultValues: {
      country: "Nigeria",
    },
  });

  const onSubmit = async (data: FormData) => {
    // Final submission
    setLoading(true);
    try {
      const orderData = await createOrder({
        shipping_address: {
          full_address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zip,
          country: data.country,
          phone: "", // You might want to add phone field to the form
        },
        payment_method: "paystack",
      });

      // Clear the cart and show success modal
      // clearCart();
      setOrderComplete(true);
    } catch (err) {
      alert("Error creating order. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return <OrderCompleteModal />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form Section */}
      <div className="">
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-accent/30 rounded-xl shadow-sm p-4 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-primary">
                Shipping Address
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  First Name
                </label>
                <Input
                  register={register}
                  name="firstName"
                  placeholder="First Name"
                  required
                  error={errors.firstName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Last Name
                </label>
                <Input
                  register={register}
                  name="lastName"
                  placeholder="Last Name"
                  required
                  error={errors.lastName}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-primary mb-2">
                  Street Address
                </label>
                <Input
                  register={register}
                  name="address"
                  placeholder="Street Address"
                  required
                  error={errors.address}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  City
                </label>
                <Input
                  register={register}
                  name="city"
                  placeholder="City"
                  required
                  error={errors.city}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  State
                </label>
                <Input
                  register={register}
                  name="state"
                  placeholder="State"
                  required
                  error={errors.state}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  ZIP Code
                </label>
                <Input
                  register={register}
                  name="zip"
                  placeholder="ZIP Code"
                  required
                  error={errors.zip}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Country
                </label>
                <select
                  {...register("country", {
                    required: "Country is required",
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? "Processing..."
              : currentStep === 3
              ? "Complete Order"
              : "Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
}
