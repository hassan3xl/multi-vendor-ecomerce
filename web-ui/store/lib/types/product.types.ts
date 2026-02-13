import { Merchant } from "./merchant.types";

export type Category = {
  id: string;
  name: string;
  product_count: number;
  image: string;
  created_at: string;
  updated_at: string;
};

type ProductImages = {
  id: string;
  image: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

type ProductSpecifications = {
  id: string;
  title: string;
  body: string;
};

type ProductReviews = {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  rating: number;
  comment: string;
  reviews: string;
  created_at: string;
};

type ProductInventory = {
  id: string;
};

export type ProductFeatures = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  is_active: boolean;
  merchant: Merchant;
  category: Category;
  name: string;
  specifications: ProductSpecifications[];
  product_reviews: ProductReviews[];
  stock: number;
  likes_count: number;
  inventory: ProductInventory;
  average_rating: number;
  description: string;
  images: ProductImages[];
  features: ProductFeatures[];
  sale_price: number;
  original_price: number;
  created_at: string;
  updated_at: string;
};
