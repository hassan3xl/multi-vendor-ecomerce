export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  bio: string;
  avatar: string | null;
  phone: string;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
  user: User;
}
export type MerchantReviews = {
  id: string;
  avatar: string;
  user_names: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type Merchant = {
  id: string;
  user: User;
  store_name: string;
  is_verified: boolean;
  store_description: string;
  store_address: string;
  store_logo: string;
  store_phone: number;
  average_rating: number;
  merchant_reviews: MerchantReviews[];
  total_sales: number;
  created_at: string;
  updated_at: string;
};

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
