// app/products/page.tsx

import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/lib/types/product.types";
import { FilterIcon } from "lucide-react";
import React from "react";

export default async function ProductsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">Failed to load products.</p>
      </div>
    );
  }

  const products: Product[] = await res.json();

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">No products available.</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <span className="flex gap-2 text-2xl font-bold text-primary">
          <FilterIcon /> Filter coming soon
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
