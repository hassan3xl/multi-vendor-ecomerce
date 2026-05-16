import ProductCard from "@/components/products/ProductCard";
import { useGetProducts } from "@/lib/hooks/product.hook";
import { Product } from "@/lib/types/product.types";
import { Newspaper, Tag } from "lucide-react";
import React from "react";

const WishlistPage = async () => {
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
  // Filter products created in the last 10 days
  const newArrivals = products?.filter((product: Product) => {
    if (!product.created_at) return false;

    const createdDate = new Date(product.created_at);
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    return createdDate >= tenDaysAgo;
  });

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Tag className="text-purple-600" size={28} />
        <h2 className="text-2xl font-bold text-primary">Saved Products</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {newArrivals?.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default WishlistPage;
