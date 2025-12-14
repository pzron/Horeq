import { 
  LucideIcon, ShoppingBag, Laptop, Shirt, Home, Zap, Watch, Music, Camera, 
  Gamepad, Book, Coffee, Smile, Star, ShoppingCart, User, Gift, Truck, 
  CreditCard, Headphones, Sparkles, Heart, Dumbbell, Sofa, Baby, UtensilsCrossed,
  PawPrint, Flower2, Plane, Bike, Hammer, Scissors, Paintbrush, Microscope,
  Pill, Footprints, Globe, TreePine, Car, Cigarette
} from "lucide-react";

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
  description?: string;
  stock?: number;
  sold?: number;
  comboAvailable?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
  slug: string;
  color: string; // For colorful display
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', icon: Laptop, count: 1250, slug: 'electronics', color: 'bg-blue-500' },
  { id: '2', name: 'Fashion', icon: Shirt, count: 3400, slug: 'fashion', color: 'bg-pink-500' },
  { id: '3', name: 'Home & Living', icon: Home, count: 850, slug: 'home-living', color: 'bg-orange-500' },
  { id: '4', name: 'Beauty', icon: Sparkles, count: 1680, slug: 'beauty', color: 'bg-purple-500' },
  { id: '5', name: 'Health & Wellness', icon: Heart, count: 920, slug: 'health-wellness', color: 'bg-red-500' },
  { id: '6', name: 'Sports & Fitness', icon: Dumbbell, count: 750, slug: 'sports-fitness', color: 'bg-green-500' },
  { id: '7', name: 'Furniture', icon: Sofa, count: 450, slug: 'furniture', color: 'bg-amber-600' },
  { id: '8', name: 'Baby & Kids', icon: Baby, count: 1200, slug: 'baby-kids', color: 'bg-cyan-500' },
  { id: '9', name: 'Food & Beverage', icon: UtensilsCrossed, count: 890, slug: 'food-beverage', color: 'bg-lime-500' },
  { id: '10', name: 'Pet Supplies', icon: PawPrint, count: 560, slug: 'pet-supplies', color: 'bg-teal-500' },
  { id: '11', name: 'Garden & Outdoor', icon: Flower2, count: 430, slug: 'garden-outdoor', color: 'bg-emerald-500' },
  { id: '12', name: 'Travel & Luggage', icon: Plane, count: 340, slug: 'travel-luggage', color: 'bg-sky-500' },
  { id: '13', name: 'Bikes & Scooters', icon: Bike, count: 280, slug: 'bikes-scooters', color: 'bg-indigo-500' },
  { id: '14', name: 'Tools & Hardware', icon: Hammer, count: 510, slug: 'tools-hardware', color: 'bg-slate-600' },
  { id: '15', name: 'Stationery & Craft', icon: Scissors, count: 670, slug: 'stationery-craft', color: 'bg-rose-500' },
  { id: '16', name: 'Art Supplies', icon: Paintbrush, count: 390, slug: 'art-supplies', color: 'bg-fuchsia-500' },
  { id: '17', name: 'Educational', icon: Microscope, count: 820, slug: 'educational', color: 'bg-violet-500' },
  { id: '18', name: 'Pharmacy', icon: Pill, count: 1100, slug: 'pharmacy', color: 'bg-red-600' },
  { id: '19', name: 'Shoes & Footwear', icon: Footprints, count: 1540, slug: 'shoes-footwear', color: 'bg-yellow-600' },
  { id: '20', name: 'Watches & Jewelry', icon: Watch, count: 920, slug: 'watches-jewelry', color: 'bg-amber-500' },
  { id: '21', name: 'Audio & Music', icon: Music, count: 640, slug: 'audio-music', color: 'bg-purple-600' },
  { id: '22', name: 'Cameras & Photo', icon: Camera, count: 320, slug: 'cameras-photo', color: 'bg-gray-600' },
  { id: '23', name: 'Gaming', icon: Gamepad, count: 860, slug: 'gaming', color: 'bg-indigo-600' },
  { id: '24', name: 'Books & Media', icon: Book, count: 2100, slug: 'books-media', color: 'bg-brown-500' },
  { id: '25', name: 'Kitchen & Dining', icon: Coffee, count: 970, slug: 'kitchen-dining', color: 'bg-orange-600' },
  { id: '26', name: 'Automotive', icon: Car, count: 680, slug: 'automotive', color: 'bg-zinc-600' },
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
    category: 'Audio & Music',
    isSale: true,
    description: 'Premium wireless headphones with active noise cancellation',
    stock: 45,
    sold: 3420,
    comboAvailable: true
  },
  {
    id: '2',
    name: 'Smart Fitness Watch Series 7',
    price: 399.00,
    rating: 4.9,
    reviews: 850,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    category: 'Watches & Jewelry',
    isNew: true,
    description: 'Track your fitness goals with this advanced smartwatch',
    stock: 28,
    sold: 2150,
    comboAvailable: false
  },
  {
    id: '3',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    rating: 4.5,
    reviews: 230,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'Fashion',
    description: '100% organic cotton, comfortable fit',
    stock: 120,
    sold: 890
  },
  {
    id: '4',
    name: 'Minimalist Desk Lamp',
    price: 89.99,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1507473888900-52e1ad147298?w=800&q=80',
    category: 'Home & Living',
    description: 'Modern LED desk lamp with adjustable brightness',
    stock: 67,
    sold: 450
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
    isSale: true,
    description: 'RGB gaming mouse with 16000 DPI',
    stock: 92,
    sold: 1560,
    comboAvailable: true
  },
  {
    id: '6',
    name: '4K Digital Camera',
    price: 1299.00,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    category: 'Cameras & Photo',
    description: 'Professional 4K mirrorless camera',
    stock: 12,
    sold: 234
  },
  {
    id: '7',
    name: 'Modern Coffee Maker',
    price: 149.99,
    rating: 4.4,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    category: 'Kitchen & Dining',
    description: 'Programmable coffee maker with thermal carafe',
    stock: 54,
    sold: 780
  },
  {
    id: '8',
    name: 'Designer Sunglasses',
    price: 159.00,
    rating: 4.3,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    category: 'Fashion',
    isNew: true,
    description: 'UV protection polarized sunglasses',
    stock: 38,
    sold: 340
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
