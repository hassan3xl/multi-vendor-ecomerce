import { MerchantReviews } from "./types";

export type Store = {
  id: string;
  active_status: string;
  verification_status: string;
  store_name: string;
  store_description: string;
  store_address: string;
  store_logo: string;
  store_phone: number;
  total_sales: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
  merchant_reviews: MerchantReviews[];
};
