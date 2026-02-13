import TrendingProducts from "@/components/products/TrendingProducts";
import { Product } from "@/lib/types/product.types";
import React from "react";

const page = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
    next: { revalidate: 60 }, // revalidate every 60 seconds
  });

  if (!res.ok) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">Failed to load products.</p>
      </div>
    );
  }

  const products: Product[] = await res.json();
  return (
    // <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <div>
      <TrendingProducts />
    </div>
  );
};

export default page;
