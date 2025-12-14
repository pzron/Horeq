import { 
  LucideIcon, ShoppingBag, Laptop, Shirt, Home, Zap, Watch, Music, Camera, 
  Gamepad, Book, Coffee, Smile, Star, ShoppingCart, User, Gift, Truck, 
  CreditCard, Headphones, Sparkles, Heart, Dumbbell, Sofa, Baby, UtensilsCrossed,
  PawPrint, Flower2, Plane, Bike, Hammer, Scissors, Paintbrush, Microscope,
  Pill, Footprints, Globe, TreePine, Car, Glasses, Crown, Gem, Wine, Smartphone,
  Monitor, Briefcase, Umbrella, Snowflake, Sun, Moon, Key, Package
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
  color: string;
  bgColor: string;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', icon: Laptop, count: 1250, slug: 'electronics', color: '#3b82f6', bgColor: 'bg-blue-500' },
  { id: '2', name: 'Fashion', icon: Shirt, count: 3400, slug: 'fashion', color: '#ec4899', bgColor: 'bg-pink-500' },
  { id: '3', name: 'Home & Living', icon: Home, count: 850, slug: 'home-living', color: '#f97316', bgColor: 'bg-orange-500' },
  { id: '4', name: 'Beauty', icon: Sparkles, count: 1680, slug: 'beauty', color: '#a855f7', bgColor: 'bg-purple-500' },
  { id: '5', name: 'Health', icon: Heart, count: 920, slug: 'health', color: '#ef4444', bgColor: 'bg-red-500' },
  { id: '6', name: 'Sports', icon: Dumbbell, count: 750, slug: 'sports', color: '#22c55e', bgColor: 'bg-green-500' },
  { id: '7', name: 'Furniture', icon: Sofa, count: 450, slug: 'furniture', color: '#d97706', bgColor: 'bg-amber-600' },
  { id: '8', name: 'Baby & Kids', icon: Baby, count: 1200, slug: 'baby-kids', color: '#06b6d4', bgColor: 'bg-cyan-500' },
  { id: '9', name: 'Food', icon: UtensilsCrossed, count: 890, slug: 'food', color: '#84cc16', bgColor: 'bg-lime-500' },
  { id: '10', name: 'Pet Supplies', icon: PawPrint, count: 560, slug: 'pet-supplies', color: '#14b8a6', bgColor: 'bg-teal-500' },
  { id: '11', name: 'Garden', icon: Flower2, count: 430, slug: 'garden', color: '#10b981', bgColor: 'bg-emerald-500' },
  { id: '12', name: 'Travel', icon: Plane, count: 340, slug: 'travel', color: '#0ea5e9', bgColor: 'bg-sky-500' },
  { id: '13', name: 'Bikes', icon: Bike, count: 280, slug: 'bikes', color: '#6366f1', bgColor: 'bg-indigo-500' },
  { id: '14', name: 'Tools', icon: Hammer, count: 510, slug: 'tools', color: '#64748b', bgColor: 'bg-slate-600' },
  { id: '15', name: 'Stationery', icon: Scissors, count: 670, slug: 'stationery', color: '#f43f5e', bgColor: 'bg-rose-500' },
  { id: '16', name: 'Art', icon: Paintbrush, count: 390, slug: 'art', color: '#d946ef', bgColor: 'bg-fuchsia-500' },
  { id: '17', name: 'Education', icon: Microscope, count: 820, slug: 'education', color: '#8b5cf6', bgColor: 'bg-violet-500' },
  { id: '18', name: 'Pharmacy', icon: Pill, count: 1100, slug: 'pharmacy', color: '#dc2626', bgColor: 'bg-red-600' },
  { id: '19', name: 'Shoes', icon: Footprints, count: 1540, slug: 'shoes', color: '#ca8a04', bgColor: 'bg-yellow-600' },
  { id: '20', name: 'Watches', icon: Watch, count: 920, slug: 'watches', color: '#f59e0b', bgColor: 'bg-amber-500' },
  { id: '21', name: 'Audio', icon: Music, count: 640, slug: 'audio', color: '#9333ea', bgColor: 'bg-purple-600' },
  { id: '22', name: 'Cameras', icon: Camera, count: 320, slug: 'cameras', color: '#4b5563', bgColor: 'bg-gray-600' },
  { id: '23', name: 'Gaming', icon: Gamepad, count: 860, slug: 'gaming', color: '#4f46e5', bgColor: 'bg-indigo-600' },
  { id: '24', name: 'Books', icon: Book, count: 2100, slug: 'books', color: '#92400e', bgColor: 'bg-amber-700' },
  { id: '25', name: 'Kitchen', icon: Coffee, count: 970, slug: 'kitchen', color: '#ea580c', bgColor: 'bg-orange-600' },
  { id: '26', name: 'Automotive', icon: Car, count: 680, slug: 'automotive', color: '#52525b', bgColor: 'bg-zinc-600' },
  { id: '27', name: 'Eyewear', icon: Glasses, count: 450, slug: 'eyewear', color: '#0891b2', bgColor: 'bg-cyan-600' },
  { id: '28', name: 'Luxury', icon: Crown, count: 230, slug: 'luxury', color: '#7c3aed', bgColor: 'bg-violet-600' },
  { id: '29', name: 'Jewelry', icon: Gem, count: 780, slug: 'jewelry', color: '#db2777', bgColor: 'bg-pink-600' },
  { id: '30', name: 'Beverages', icon: Wine, count: 540, slug: 'beverages', color: '#b91c1c', bgColor: 'bg-red-700' },
  { id: '31', name: 'Phones', icon: Smartphone, count: 1850, slug: 'phones', color: '#1d4ed8', bgColor: 'bg-blue-700' },
  { id: '32', name: 'Computers', icon: Monitor, count: 960, slug: 'computers', color: '#374151', bgColor: 'bg-gray-700' },
  { id: '33', name: 'Office', icon: Briefcase, count: 420, slug: 'office', color: '#0f766e', bgColor: 'bg-teal-700' },
  { id: '34', name: 'Outdoor', icon: Umbrella, count: 380, slug: 'outdoor', color: '#15803d', bgColor: 'bg-green-700' },
  { id: '35', name: 'Winter', icon: Snowflake, count: 290, slug: 'winter', color: '#2563eb', bgColor: 'bg-blue-600' },
  { id: '36', name: 'Summer', icon: Sun, count: 510, slug: 'summer', color: '#eab308', bgColor: 'bg-yellow-500' },
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
    isSale: true,
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
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
    category: 'Watches',
    isNew: true,
    description: 'Track your fitness goals with this advanced smartwatch featuring GPS, heart rate monitor, and sleep tracking.',
    stock: 28,
    sold: 2150,
    comboAvailable: true
  },
  {
    id: '3',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    rating: 4.5,
    reviews: 230,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'Fashion',
    description: '100% organic cotton, comfortable fit for everyday wear.',
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
    description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
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
    description: 'RGB gaming mouse with 16000 DPI, programmable buttons, and ergonomic design.',
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
    category: 'Cameras',
    description: 'Professional 4K mirrorless camera with advanced autofocus system.',
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
    category: 'Kitchen',
    description: 'Programmable coffee maker with thermal carafe and brew strength control.',
    stock: 54,
    sold: 780,
    comboAvailable: true
  },
  {
    id: '8',
    name: 'Designer Sunglasses',
    price: 159.00,
    rating: 4.3,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    category: 'Eyewear',
    isNew: true,
    description: 'UV protection polarized sunglasses with premium frame.',
    stock: 38,
    sold: 340
  },
  {
    id: '9',
    name: 'Wireless Earbuds Pro',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    category: 'Audio',
    isSale: true,
    description: 'True wireless earbuds with active noise cancellation and 8-hour battery.',
    stock: 78,
    sold: 2340,
    comboAvailable: true
  },
  {
    id: '10',
    name: 'Running Shoes Ultra',
    price: 129.99,
    rating: 4.6,
    reviews: 445,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    category: 'Shoes',
    isNew: true,
    description: 'Lightweight running shoes with responsive cushioning.',
    stock: 95,
    sold: 1890
  },
  {
    id: '11',
    name: 'Yoga Mat Premium',
    price: 49.99,
    rating: 4.5,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    category: 'Sports',
    description: 'Non-slip yoga mat with extra cushioning for comfort.',
    stock: 150,
    sold: 890
  },
  {
    id: '12',
    name: 'Smartphone Stand',
    price: 24.99,
    rating: 4.4,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=800&q=80',
    category: 'Phones',
    description: 'Adjustable smartphone stand for desk or nightstand.',
    stock: 200,
    sold: 670
  },
];

export const COMBO_PRODUCTS = [
  {
    id: 'combo-1',
    name: 'Ultimate Audio Bundle',
    products: ['1', '9'],
    price: 449.99,
    originalPrice: 549.98,
    savings: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  },
  {
    id: 'combo-2',
    name: 'Gaming Essentials',
    products: ['5', '2'],
    price: 429.99,
    originalPrice: 488.99,
    savings: 59.00,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'
  },
  {
    id: 'combo-3',
    name: 'Work From Home Kit',
    products: ['4', '7'],
    price: 199.99,
    originalPrice: 239.98,
    savings: 39.99,
    image: 'https://images.unsplash.com/photo-1507473888900-52e1ad147298?w=800&q=80'
  }
];

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

export const MOCK_REVIEWS = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'Sarah Johnson',
    rating: 5,
    title: 'Amazing quality!',
    comment: 'This product exceeded my expectations. The quality is outstanding and delivery was fast!',
    verified: true,
    createdAt: '2024-12-10'
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'Mike Chen',
    rating: 4,
    title: 'Great value for money',
    comment: 'Very happy with this purchase. Works exactly as described.',
    verified: true,
    createdAt: '2024-12-08'
  },
  {
    id: '3',
    userId: 'user-3',
    userName: 'Emma Wilson',
    rating: 5,
    title: 'Highly recommend!',
    comment: 'Best purchase I have made this year. Will definitely buy again.',
    verified: false,
    createdAt: '2024-12-05'
  }
];

export const NOTIFICATION_MESSAGES = [
  { type: 'product', message: 'New product added: Wireless Charging Pad!' },
  { type: 'combo', message: 'New combo deal: Gaming Bundle - Save 20%!' },
  { type: 'deal', message: 'Flash Sale: 50% off on Electronics!' },
  { type: 'delivery', message: 'Order #1234 is out for delivery!' },
  { type: 'product', message: 'Limited stock: Smart Watch Pro' },
  { type: 'deal', message: 'Weekend special: Free shipping on all orders!' },
  { type: 'combo', message: 'New combo: Home Office Essentials' },
  { type: 'delivery', message: 'Order delivered successfully to Dhaka!' }
];
