export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  weight: string;
  ingredients: string[];
  category: 'vegetarian' | 'classic' | 'meat' | 'breakfast';
  available: boolean;
}

export interface CartItem {
  pizza: Pizza;
  quantity: number;
  size: 'S' | 'M' | 'L';
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  taxes: number;
  deliveryFee: number;
  subtotal: number;
  address: DeliveryAddress;
  paymentMethod: 'cash' | 'online';
  status: 'pending' | 'confirmed' | 'preparing' | 'delivery' | 'delivered';
  createdAt: Date;
  userId: string;
}

export interface DeliveryAddress {
  type: 'home' | 'office';
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: DeliveryAddress[];
  isAdmin: boolean;
}
