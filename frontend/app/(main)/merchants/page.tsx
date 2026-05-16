import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, BadgeCheck, Star, ShoppingBag, Calendar } from "lucide-react";
import { BASE_URL } from "@/lib/services/apiService";
import { Merchant } from "@/lib/types/merchant.types";

const MerchantsPage = async () => {
  const res = await fetch(`${BASE_URL}/merchants/`, {
    next: { revalidate: 60 }, // revalidate every 60 seconds
  });
  const merchants: Merchant[] = await res.json();

  if (merchants.length === 0)
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-muted-foreground">
        <Store className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">No merchants available</p>
        <p className="text-sm mt-1">Check back later for new stores</p>
      </div>
    );

  return (
    <div className="">
      {/* Header with linear */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 blur-3xl -z-10" />
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
          <Store className="w-4 h-4" />
          <span>Trusted Marketplace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          Our Verified Merchants
        </h1>
        <p className="text-base text-muted-foreground mt-3 max-w-2xl mx-auto">
          Discover trusted stores and shop directly from verified merchants with
          confidence
        </p>
      </div>

      {/* Merchants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {merchants.map((merchant) => (
          <Link
            key={merchant.id}
            href={`/merchants/${merchant.id}`}
            className="group relative border border-border bg-muted rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* linear Overlay on Hover */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative p-6 flex flex-col items-center text-center">
              {/* Merchant Logo with Ring Animation */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-linear-to-br from-primary to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <Image
                  src={merchant.store_logo || "/default_avatar.png"}
                  alt={merchant.store_name}
                  width={96}
                  height={96}
                  className="relative rounded-full object-cover w-24 h-24 ring-2 ring-border group-hover:ring-4 group-hover:ring-primary/20 transition-all duration-300"
                />
                {merchant.verification_status == "verified" && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 ring-4 ring-card">
                    <BadgeCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Merchant Info */}
              <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                {merchant.store_name}
              </h2>

              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 min-h-10">
                {merchant.store_description || "No description provided"}
              </p>

              {/* Stats Grid */}
              <div className="w-full grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="text-sm">
                      {merchant.average_rating || "0.0"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    Rating
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm">{merchant.total_sales}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    Sales
                  </span>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Joined{" "}
                  {new Date(merchant.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* View Store CTA */}
              <div className="mt-5 w-full">
                <div className="w-full px-4 py-2.5 text-sm font-medium text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <span>View Store</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MerchantsPage;
