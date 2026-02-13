// Cart Types based on actual API response
export interface CartProduct {
  id: string;
  name: string;
  images?: any[];
  original_price: string;
  effective_price: string;
  is_on_sale: boolean;
  stock: number;
}

export interface CartItem {
  id: string; // Cart item ID
  product: CartProduct;
  quantity: number;
  item_total: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_quantity: number;
  cart_total: number;
  created_at: string;
}

export interface AddItemPayload {
  product_id: string;
  quantity: number;
}

export interface UpdateQuantityPayload {
  itemId: string;
  quantity: number;
}

export interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addToCart: (payload: AddItemPayload) => void;
  updateQuantity: (payload: UpdateQuantityPayload) => void;
  removeItemFromCart: (itemId: string) => void;
  clearCart: () => void;
  createOrder: (shippingData: any) => void;
}
