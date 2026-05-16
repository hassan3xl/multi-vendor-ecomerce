"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/products/ProductCard";
import {
  BadgeCheck,
  Star,
  ShoppingBag,
  Calendar,
  Phone,
  Mail,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MerchantReview from "@/components/merchants/MerchantReview";
import Loader from "@/components/Loader";
import { useGetMerchant } from "@/lib/hooks/merchant.hook";

const MerchantPage = () => {
  const params = useParams();
  const merchantId = params.merchantId;

  const { data: merchant, isLoading: loading } = useGetMerchant(
    merchantId as string
  );

  if (loading) return <Loader title="Loading merchant info..." />;

  if (!merchant)
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-xl font-semibold text-foreground">
          Merchant not found
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          This store may have been removed
        </p>
      </div>
    );

  return (
    <div className="">
      {/* Hero Section with Gradient Background */}
      <div className="relative">
        {/* Gradient Background */}

        {/* Main Content Card */}
        <div className="relative bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          {/* Top Accent Bar */}

          <div className="p-2 sm:p-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Logo & Quick Stats */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative group">
                  <Image
                    src={merchant.store_logo || "/default_avatar.png"}
                    alt={merchant.store_name}
                    width={160}
                    height={160}
                    className="relative rounded-full object-cover w-32 h-32 lg:w-40 lg:h-40 ring-4 ring-card shadow-xl"
                    unoptimized
                  />
                  {merchant.verification_status === "verified" && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 ring-4 ring-card shadow-lg">
                      <BadgeCheck className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Quick Stats Cards - Mobile/Desktop */}
                <div className="grid grid-cols-3 gap-3 mt-6 w-full lg:max-w-xs">
                  <div className="bg-linear-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl p-3 text-center border border-yellow-500/20">
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">
                      {merchant.average_rating || "0.0"}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="bg-linear-to-br from-muted/10 to-accent/5 rounded-xl p-3 text-center border border-border">
                    <ShoppingBag className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">
                      {merchant.total_sales}
                    </div>
                    <div className="text-xs text-muted-foreground">Sales</div>
                  </div>
                  <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-3 text-center border border-purple-500/20">
                    <Package className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">
                      {merchant.products?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Products
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Store Details */}
              <div className="flex-1 space-y-6">
                {/* Store Name & Badge */}
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                      {merchant.store_name}
                    </h1>
                    {merchant.verification_status === "verified" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium border border-green-500/20">
                        <BadgeCheck className="w-4 h-4" />
                        Verified Store
                      </span>
                    )}
                  </div>
                  <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                    {merchant.store_description || "No description available"}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {merchant.store_phone && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl border border-border">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">
                          Phone
                        </div>
                        <div className="text-sm font-medium text-foreground truncate">
                          {merchant.store_phone}
                        </div>
                      </div>
                    </div>
                  )}

                  {merchant.store_email && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl border border-border">
                      <div className="bg-purple-500/10 rounded-lg p-2">
                        <Mail className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground">
                          Email
                        </div>
                        <div className="text-sm font-medium text-foreground truncate">
                          {merchant.store_email}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Member Since */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Member since{" "}
                    {new Date(merchant.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <MerchantReview merchant={merchant} />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between my-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Store Products
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {merchant.products?.length || 0} items available
            </p>
          </div>
        </div>

        {merchant.products && merchant.products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {merchant.products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-2xl bg-muted/20">
            <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-foreground">
              No products yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This store hasn't listed any products
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantPage;
