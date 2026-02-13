"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/Header";
import AddProductModal from "@/components/inventory/AddProductModal";
import Loader from "@/components/Loader";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useGetProducts } from "@/lib/hooks/product.hook";

const ProductsInventory: React.FC = () => {
  const { data: products, isLoading, error, refetch } = useGetProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(
      new Set(products.map((p: any) => p.category?.name || "Uncategorized"))
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const q = searchTerm.trim().toLowerCase();

    return products.filter((product: any) => {
      const matchesSearch =
        !q || (product.name || "").toLowerCase().includes(q);
      const matchesCategory =
        filterCategory === "all" || product.category?.name === filterCategory;

      // Stock filtering
      const stockCount = product.inventory?.quantity ?? 0;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && stockCount > 0) ||
        (stockFilter === "low-stock" && stockCount > 0 && stockCount < 10) ||
        (stockFilter === "out-of-stock" && stockCount === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, filterCategory, stockFilter]);

  const totalProducts = useMemo(
    () => (products ? products.length : 0),
    [products]
  );

  const inStock = useMemo(
    () =>
      products
        ? products.filter(
            (p: any) => p.inventory?.in_stock && (p.inventory.quantity ?? 0) > 0
          ).length
        : 0,
    [products]
  );

  const lowStock = useMemo(
    () =>
      products
        ? products.filter(
            (p: any) =>
              p.inventory?.in_stock &&
              (p.inventory.quantity ?? 0) > 0 &&
              p.inventory.quantity < 10
          ).length
        : 0,
    [products]
  );

  const outOfStock = useMemo(
    () =>
      products
        ? products.filter(
            (p: any) =>
              !p.inventory?.in_stock || (p.inventory.quantity ?? 0) === 0
          ).length
        : 0,
    [products]
  );

  const handleProductUpdate = () => {
    refetch();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">Error fetching products.</p>
      </div>
    );
  }

  return (
    <>
      <AddProductModal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onProductAdded={handleProductUpdate}
      />
      {products.length === 0 ? (
        <div className="flex flex-col gap-4 justify-center items-center h-[60vh]">
          <p className="text-muted-foreground">No products available.</p>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              console.log("clicked");
            }}
          >
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Section */}
          <Header
            title="Product Inventory"
            subtitle="Manage your product catalog and inventory"
            stats={[
              { title: "Total Products", value: `${totalProducts}` },
              { title: "In Stock", value: `${inStock}` },
              { title: "Low Stock", value: `${lowStock}` },
              { title: "Out of Stock", value: `${outOfStock}` },
            ]}
            actions={
              <Button onClick={() => setIsModalOpen(true)}>
                + Add Product
              </Button>
            }
          />

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg shadow-sm">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat: any) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stock Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  merchantView={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[40vh]">
              <p className="text-muted-foreground">
                No products match your filters.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductsInventory;
