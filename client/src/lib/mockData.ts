import { LucideIcon, ShoppingBag, Laptop, Shirt, Home, Zap, Watch, Music, Camera, Gamepad, Book, Coffee, Smile, Star, ShoppingCart, User, Gift, Truck, CreditCard, Headphones } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
  slug: string;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', icon: Laptop, count: 1250, slug: 'electronics' },
  { id: '2', name: 'Fashion', icon: Shirt, count: 3400, slug: 'fashion' },
  { id: '3', name: 'Home & Living', icon: Home, count: 850, slug: 'home-living' },
  { id: '4', name: 'Deals', icon: Zap, count: 500, slug: 'deals' },
  { id: '5', name: 'Accessories', icon: Watch, count: 920, slug: 'accessories' },
  { id: '6', name: 'Audio', icon: Music, count: 340, slug: 'audio' },
  { id: '7', name: 'Cameras', icon: Camera, count: 120, slug: 'cameras' },
  { id: '8', name: 'Gaming', icon: Gamepad, count: 560, slug: 'gaming' },
  { id: '9', name: 'Books', icon: Book, count: 2100, slug: 'books' },
  { id: '10', name: 'Kitchen', icon: Coffee, count: 670, slug: 'kitchen' },
  { id: '11', name: 'Baby', icon: Smile, count: 450, slug: 'baby' },
  { id: '12', name: 'Sports', icon: Star, count: 330, slug: 'sports' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise Cancelling Headphones',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    category: 'Audio',
    isSale: true
  },
  {
    id: '2',
    name: 'Smart Fitness Watch Series 7',
    price: 399.00,
    rating: 4.9,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: 'Accessories',
    isNew: true
  },
  {
    id: '3',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    rating: 4.5,
    reviews: 230,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'Fashion'
  },
  {
    id: '4',
    name: 'Minimalist Desk Lamp',
    price: 89.99,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1507473888900-52e1ad147298?w=800&q=80',
    category: 'Home & Living'
  },
  {
    id: '5',
    name: 'Pro Gaming Mouse',
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.6,
    reviews: 540,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    category: 'Gaming',
    isSale: true
  },
  {
    id: '6',
    name: '4K Digital Camera',
    price: 1299.00,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    category: 'Cameras'
  },
  {
    id: '7',
    name: 'Modern Coffee Maker',
    price: 149.99,
    rating: 4.4,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    category: 'Kitchen'
  },
  {
    id: '8',
    name: 'Designer Sunglasses',
    price: 159.00,
    rating: 4.3,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    category: 'Fashion',
    isNew: true
  },
];

// Helper to generate more products
export const getAllProducts = (count: number = 20) => {
  const products = [...MOCK_PRODUCTS];
  while (products.length < count) {
    const base = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    products.push({
      ...base,
      id: `gen-${products.length + 1}`,
      name: `${base.name} ${Math.floor(Math.random() * 100)}`,
      price: Number((base.price * (0.8 + Math.random() * 0.4)).toFixed(2))
    });
  }
  return products;
};
