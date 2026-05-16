"use client";

import ProductCard from "@/components/products/ProductCard";
import { featuredProducts } from "@/lib/dummyData";
import { apiService } from "@/lib/services/apiService";
import { Product } from "@/lib/types/product.types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CategoryDetailsType {
  name: string;
  image: string;
  product_count: number;
  products: Product[];
}
const CategoryDetailsPage = () => {
  const params = useParams();
  const name = params.name;

  const fetchCategory = async () => {
    try {
      const res = await apiService.get(`/categories/${name}`);
      return res;
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  // ✅ Use Query
  const {
    data: category,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category"],
    queryFn: fetchCategory,
    retry: 1, // avoid retrying too many times
    staleTime: 1000 * 60, // cache for 1 minute
  });

  if (!category) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex category-center justify-between mb-6">
        <span className=" flex gap-2 text-2xl font-bold text-primary">
          <span>
            {name}
            {category.product_count} category
          </span>
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {category.products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
