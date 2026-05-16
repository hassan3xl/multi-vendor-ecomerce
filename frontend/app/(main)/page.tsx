import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React from "react";

import FlashDeals from "@/components/products/FlashDeals";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import CategoryList from "@/components/products/CategoryList";
import PromotionalBanners from "@/components/products/PromotionalBanners";
import TrendingProducts from "@/components/products/TrendingProducts";
import HeroBanner from "@/components/products/HeroBanner";
import Categories from "./(items)/categories/page";

export default function Home() {
  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Flash Deals */}
      <FlashDeals />

      {/* Categories */}
      <Categories />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Promotional Banners */}
      <PromotionalBanners />

      {/* Trending Now */}
      <TrendingProducts />
    </div>
  );
}
