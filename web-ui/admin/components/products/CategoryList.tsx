import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types/types";

interface CategoryListProps {
  category: Category;
}

const CategoryList: React.FC<CategoryListProps> = ({ category }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border bg-card">
      <Link
        href={`/categories/${category.name}`}
        className="block relative aspect-square"
      >
        <Image
          src={category.image || "/placeholder.png"}
          alt={category.name}
          width={400}
          height={400}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-end p-3">
          <h3 className="text-white text-base sm:text-lg font-semibold drop-shadow-md">
            {category.name}
          </h3>
          <p className="text-gray-200 text-xs sm:text-sm">
            {category.product_count || 0} items
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CategoryList;
