import { 
  LucideIcon, ShoppingBag, Laptop, Shirt, Home, Zap, Watch, Music, Camera, 
  Gamepad, Book, Coffee, Smile, Star, ShoppingCart, User, Gift, Truck, 
  CreditCard, Headphones, Sparkles, Heart, Dumbbell, Sofa, Baby, UtensilsCrossed,
  PawPrint, Flower2, Plane, Bike, Hammer, Scissors, Paintbrush, Microscope,
  Pill, Footprints, Globe, TreePine, Car, Glasses, Crown, Gem, Wine, Smartphone,
  Monitor, Briefcase, Umbrella, Snowflake, Sun, Moon, Key, Package, Tent, Mountain,
  Anchor, Palette, Ruler, Wrench, Plug, Lamp, Bed, Bath, Shirt as TShirt, 
  BadgePercent, Banknote, Receipt, Tag, Megaphone, Radio, Tv, Fan, Thermometer,
  Lightbulb, Lock, Shield, Wifi, Bluetooth, Battery, Cpu, HardDrive,
  Backpack, Cake, Calculator, Candy, Carrot, ChefHat, Cherry, Cookie, Croissant,
  Dessert, Diamond, Drum, Egg, Factory, Feather, Film, Fish, Flag, Fuel,
  GraduationCap, Grape, Guitar, Handshake, HardHat, Hotel, IceCream, Joystick,
  Keyboard, Landmark, Leaf, Library, Magnet, Map, Medal, Mic, Milk, Newspaper,
  Pizza, Podcast, Popcorn, Printer, Puzzle, Recycle, Rocket, Sailboat, Salad,
  Sandwich, Satellite, Scale, School, Server, Shovel, ShowerHead, Snail,
  Soup, Speaker, Sprout, FlaskConical, TestTube
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
  images?: string[];
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: string;
  price?: number;
  stock?: number;
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
  { id: '37', name: 'Camping', icon: Tent, count: 320, slug: 'camping', color: '#166534', bgColor: 'bg-green-800' },
  { id: '38', name: 'Hiking', icon: Mountain, count: 280, slug: 'hiking', color: '#78716c', bgColor: 'bg-stone-500' },
  { id: '39', name: 'Marine', icon: Anchor, count: 190, slug: 'marine', color: '#0369a1', bgColor: 'bg-sky-700' },
  { id: '40', name: 'Crafts', icon: Palette, count: 420, slug: 'crafts', color: '#c026d3', bgColor: 'bg-fuchsia-600' },
  { id: '41', name: 'Measuring', icon: Ruler, count: 150, slug: 'measuring', color: '#71717a', bgColor: 'bg-zinc-500' },
  { id: '42', name: 'Hardware', icon: Wrench, count: 380, slug: 'hardware', color: '#44403c', bgColor: 'bg-stone-700' },
  { id: '43', name: 'Electrical', icon: Plug, count: 290, slug: 'electrical', color: '#facc15', bgColor: 'bg-yellow-400' },
  { id: '44', name: 'Lighting', icon: Lamp, count: 340, slug: 'lighting', color: '#fbbf24', bgColor: 'bg-amber-400' },
  { id: '45', name: 'Bedroom', icon: Bed, count: 420, slug: 'bedroom', color: '#818cf8', bgColor: 'bg-indigo-400' },
  { id: '46', name: 'Bathroom', icon: Bath, count: 380, slug: 'bathroom', color: '#38bdf8', bgColor: 'bg-sky-400' },
  { id: '47', name: 'Mens Wear', icon: TShirt, count: 1200, slug: 'mens-wear', color: '#2dd4bf', bgColor: 'bg-teal-400' },
  { id: '48', name: 'Deals', icon: BadgePercent, count: 890, slug: 'deals', color: '#f472b6', bgColor: 'bg-pink-400' },
  { id: '49', name: 'Finance', icon: Banknote, count: 120, slug: 'finance', color: '#4ade80', bgColor: 'bg-green-400' },
  { id: '50', name: 'Vouchers', icon: Receipt, count: 560, slug: 'vouchers', color: '#a78bfa', bgColor: 'bg-violet-400' },
  { id: '51', name: 'Promotions', icon: Tag, count: 780, slug: 'promotions', color: '#fb923c', bgColor: 'bg-orange-400' },
  { id: '52', name: 'Marketing', icon: Megaphone, count: 90, slug: 'marketing', color: '#f87171', bgColor: 'bg-red-400' },
  { id: '53', name: 'Radio', icon: Radio, count: 180, slug: 'radio', color: '#a3a3a3', bgColor: 'bg-neutral-400' },
  { id: '54', name: 'Television', icon: Tv, count: 340, slug: 'television', color: '#334155', bgColor: 'bg-slate-700' },
  { id: '55', name: 'Cooling', icon: Fan, count: 220, slug: 'cooling', color: '#7dd3fc', bgColor: 'bg-sky-300' },
  { id: '56', name: 'Heating', icon: Thermometer, count: 180, slug: 'heating', color: '#fca5a5', bgColor: 'bg-red-300' },
  { id: '57', name: 'Smart Home', icon: Lightbulb, count: 450, slug: 'smart-home', color: '#fde047', bgColor: 'bg-yellow-300' },
  { id: '58', name: 'Security', icon: Lock, count: 320, slug: 'security', color: '#475569', bgColor: 'bg-slate-600' },
  { id: '59', name: 'Protection', icon: Shield, count: 280, slug: 'protection', color: '#22d3ee', bgColor: 'bg-cyan-400' },
  { id: '60', name: 'Networking', icon: Wifi, count: 190, slug: 'networking', color: '#60a5fa', bgColor: 'bg-blue-400' },
  { id: '61', name: 'Backpacks', icon: Backpack, count: 340, slug: 'backpacks', color: '#059669', bgColor: 'bg-emerald-600' },
  { id: '62', name: 'Bakery', icon: Cake, count: 280, slug: 'bakery', color: '#f472b6', bgColor: 'bg-pink-400' },
  { id: '63', name: 'Calculators', icon: Calculator, count: 120, slug: 'calculators', color: '#6b7280', bgColor: 'bg-gray-500' },
  { id: '64', name: 'Sweets', icon: Candy, count: 450, slug: 'sweets', color: '#f87171', bgColor: 'bg-red-400' },
  { id: '65', name: 'Vegetables', icon: Carrot, count: 560, slug: 'vegetables', color: '#f97316', bgColor: 'bg-orange-500' },
  { id: '66', name: 'Cookware', icon: ChefHat, count: 380, slug: 'cookware', color: '#fbbf24', bgColor: 'bg-amber-400' },
  { id: '67', name: 'Fruits', icon: Cherry, count: 490, slug: 'fruits', color: '#dc2626', bgColor: 'bg-red-600' },
  { id: '68', name: 'Snacks', icon: Cookie, count: 620, slug: 'snacks', color: '#d97706', bgColor: 'bg-amber-600' },
  { id: '69', name: 'Breakfast', icon: Croissant, count: 310, slug: 'breakfast', color: '#ca8a04', bgColor: 'bg-yellow-600' },
  { id: '70', name: 'Desserts', icon: Dessert, count: 420, slug: 'desserts', color: '#ec4899', bgColor: 'bg-pink-500' },
  { id: '71', name: 'Diamonds', icon: Diamond, count: 180, slug: 'diamonds', color: '#0ea5e9', bgColor: 'bg-sky-500' },
  { id: '72', name: 'Donuts', icon: Cookie, count: 150, slug: 'donuts', color: '#f472b6', bgColor: 'bg-pink-400' },
  { id: '73', name: 'Instruments', icon: Drum, count: 290, slug: 'instruments', color: '#a855f7', bgColor: 'bg-purple-500' },
  { id: '74', name: 'Organic', icon: Egg, count: 340, slug: 'organic', color: '#fef08a', bgColor: 'bg-yellow-200' },
  { id: '75', name: 'Industrial', icon: Factory, count: 180, slug: 'industrial', color: '#64748b', bgColor: 'bg-slate-500' },
  { id: '76', name: 'Accessories', icon: Feather, count: 890, slug: 'accessories', color: '#c084fc', bgColor: 'bg-purple-400' },
  { id: '77', name: 'Movies', icon: Film, count: 520, slug: 'movies', color: '#ef4444', bgColor: 'bg-red-500' },
  { id: '78', name: 'Seafood', icon: Fish, count: 280, slug: 'seafood', color: '#0891b2', bgColor: 'bg-cyan-600' },
  { id: '79', name: 'Party', icon: Flag, count: 340, slug: 'party', color: '#f43f5e', bgColor: 'bg-rose-500' },
  { id: '80', name: 'Lab Equipment', icon: FlaskConical, count: 120, slug: 'lab-equipment', color: '#10b981', bgColor: 'bg-emerald-500' },
  { id: '81', name: 'Gas & Fuel', icon: Fuel, count: 90, slug: 'gas-fuel', color: '#ef4444', bgColor: 'bg-red-500' },
  { id: '82', name: 'Graduation', icon: GraduationCap, count: 180, slug: 'graduation', color: '#1e3a8a', bgColor: 'bg-blue-900' },
  { id: '83', name: 'Wine & Grapes', icon: Grape, count: 220, slug: 'wine-grapes', color: '#7c3aed', bgColor: 'bg-violet-600' },
  { id: '84', name: 'Music Gear', icon: Guitar, count: 340, slug: 'music-gear', color: '#b45309', bgColor: 'bg-amber-700' },
  { id: '85', name: 'Corporate', icon: Handshake, count: 150, slug: 'corporate', color: '#334155', bgColor: 'bg-slate-700' },
  { id: '86', name: 'Construction', icon: HardHat, count: 280, slug: 'construction', color: '#eab308', bgColor: 'bg-yellow-500' },
  { id: '87', name: 'Hotels', icon: Hotel, count: 120, slug: 'hotels', color: '#6366f1', bgColor: 'bg-indigo-500' },
  { id: '88', name: 'Ice Cream', icon: IceCream, count: 180, slug: 'ice-cream', color: '#f9a8d4', bgColor: 'bg-pink-300' },
  { id: '89', name: 'Controllers', icon: Joystick, count: 420, slug: 'controllers', color: '#4f46e5', bgColor: 'bg-indigo-600' },
  { id: '90', name: 'Keyboards', icon: Keyboard, count: 380, slug: 'keyboards', color: '#374151', bgColor: 'bg-gray-700' },
  { id: '91', name: 'Landmarks', icon: Landmark, count: 80, slug: 'landmarks', color: '#78716c', bgColor: 'bg-stone-500' },
  { id: '92', name: 'Natural', icon: Leaf, count: 560, slug: 'natural', color: '#22c55e', bgColor: 'bg-green-500' },
  { id: '93', name: 'Libraries', icon: Library, count: 240, slug: 'libraries', color: '#92400e', bgColor: 'bg-amber-800' },
  { id: '94', name: 'Magnets', icon: Magnet, count: 90, slug: 'magnets', color: '#dc2626', bgColor: 'bg-red-600' },
  { id: '95', name: 'Maps', icon: Map, count: 150, slug: 'maps', color: '#0d9488', bgColor: 'bg-teal-600' },
  { id: '96', name: 'Awards', icon: Medal, count: 180, slug: 'awards', color: '#f59e0b', bgColor: 'bg-amber-500' },
  { id: '97', name: 'Microphones', icon: Mic, count: 220, slug: 'microphones', color: '#6366f1', bgColor: 'bg-indigo-500' },
  { id: '98', name: 'Dairy', icon: Milk, count: 340, slug: 'dairy', color: '#f1f5f9', bgColor: 'bg-slate-100' },
  { id: '99', name: 'News', icon: Newspaper, count: 120, slug: 'news', color: '#1f2937', bgColor: 'bg-gray-800' },
  { id: '100', name: 'Pizza', icon: Pizza, count: 280, slug: 'pizza', color: '#ea580c', bgColor: 'bg-orange-600' },
  { id: '101', name: 'Podcasts', icon: Podcast, count: 180, slug: 'podcasts', color: '#8b5cf6', bgColor: 'bg-violet-500' },
  { id: '102', name: 'Cinema', icon: Popcorn, count: 220, slug: 'cinema', color: '#fcd34d', bgColor: 'bg-amber-300' },
  { id: '103', name: 'Printers', icon: Printer, count: 160, slug: 'printers', color: '#525252', bgColor: 'bg-neutral-600' },
  { id: '104', name: 'Puzzles', icon: Puzzle, count: 240, slug: 'puzzles', color: '#c084fc', bgColor: 'bg-purple-400' },
  { id: '105', name: 'Eco Friendly', icon: Recycle, count: 320, slug: 'eco-friendly', color: '#16a34a', bgColor: 'bg-green-600' },
  { id: '106', name: 'Space', icon: Rocket, count: 140, slug: 'space', color: '#1e40af', bgColor: 'bg-blue-800' },
  { id: '107', name: 'Sailing', icon: Sailboat, count: 110, slug: 'sailing', color: '#0284c7', bgColor: 'bg-sky-600' },
  { id: '108', name: 'Salads', icon: Salad, count: 180, slug: 'salads', color: '#4ade80', bgColor: 'bg-green-400' },
  { id: '109', name: 'Sandwiches', icon: Sandwich, count: 220, slug: 'sandwiches', color: '#d97706', bgColor: 'bg-amber-600' },
  { id: '110', name: 'Tech', icon: Satellite, count: 280, slug: 'tech', color: '#3b82f6', bgColor: 'bg-blue-500' },
  { id: '111', name: 'Weighing', icon: Scale, count: 90, slug: 'weighing', color: '#71717a', bgColor: 'bg-zinc-500' },
  { id: '112', name: 'Schools', icon: School, count: 180, slug: 'schools', color: '#2563eb', bgColor: 'bg-blue-600' },
  { id: '113', name: 'Seeds', icon: Sprout, count: 240, slug: 'seeds', color: '#15803d', bgColor: 'bg-green-700' },
  { id: '114', name: 'Servers', icon: Server, count: 160, slug: 'servers', color: '#374151', bgColor: 'bg-gray-700' },
  { id: '115', name: 'Gardening', icon: Shovel, count: 280, slug: 'gardening', color: '#78716c', bgColor: 'bg-stone-500' },
  { id: '116', name: 'Showers', icon: ShowerHead, count: 180, slug: 'showers', color: '#0ea5e9', bgColor: 'bg-sky-500' },
  { id: '117', name: 'Slow Living', icon: Snail, count: 90, slug: 'slow-living', color: '#a3e635', bgColor: 'bg-lime-400' },
  { id: '118', name: 'Soups', icon: Soup, count: 220, slug: 'soups', color: '#ea580c', bgColor: 'bg-orange-600' },
  { id: '119', name: 'Speakers', icon: Speaker, count: 380, slug: 'speakers', color: '#1f2937', bgColor: 'bg-gray-800' },
  { id: '120', name: 'Plants', icon: Sprout, count: 320, slug: 'plants', color: '#22c55e', bgColor: 'bg-green-500' },
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
    comboAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
    ],
    variants: [
      { id: 'v1', name: 'Matte Black', type: 'color', stock: 20 },
      { id: 'v2', name: 'Silver', type: 'color', stock: 15 },
      { id: 'v3', name: 'Rose Gold', type: 'color', stock: 10 }
    ],
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Battery Life': '30 hours',
      'Charging Time': '2 hours',
      'Bluetooth Version': '5.2',
      'Weight': '250g'
    }
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
    comboAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80'
    ],
    variants: [
      { id: 'v1', name: '40mm', type: 'size', stock: 15 },
      { id: 'v2', name: '44mm', type: 'size', stock: 13 }
    ]
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

const PRODUCT_ADJECTIVES = ['Premium', 'Pro', 'Ultra', 'Elite', 'Classic', 'Modern', 'Deluxe', 'Essential', 'Advanced', 'Smart', 'Wireless', 'Portable', 'Compact', 'Professional', 'Limited Edition', 'Signature', 'Plus', 'Max', 'Mini', 'XL'];
const PRODUCT_SUFFIXES = ['', 'V2', 'X', 'S', 'Plus', 'Pro', 'Max', 'SE', 'Air', 'Lite', 'Neo', 'GT', 'Sport', 'Home', 'Travel'];
const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  'https://images.unsplash.com/photo-1507473888900-52e1ad147298?w=800&q=80',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
  'https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=800&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055uj8b8a8a?w=800&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80'
];

export const getAllProducts = (count: number = 20): Product[] => {
  const products: Product[] = [...MOCK_PRODUCTS];
  const categoryNames = CATEGORIES.map(c => c.name);
  
  let genId = 1;
  while (products.length < count) {
    const base = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    const adj = PRODUCT_ADJECTIVES[Math.floor(Math.random() * PRODUCT_ADJECTIVES.length)];
    const suffix = PRODUCT_SUFFIXES[Math.floor(Math.random() * PRODUCT_SUFFIXES.length)];
    const category = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const image = PRODUCT_IMAGES[Math.floor(Math.random() * PRODUCT_IMAGES.length)];
    
    const priceMultiplier = 0.5 + Math.random() * 1.5;
    const newPrice = Number((base.price * priceMultiplier).toFixed(2));
    const hasDiscount = Math.random() > 0.7;
    const isNew = Math.random() > 0.8;
    const isSale = hasDiscount && !isNew;
    
    const hasVariants = Math.random() > 0.6;
    const variants: ProductVariant[] = hasVariants ? (
      Math.random() > 0.5 
        ? [
            { id: `v${genId}-1`, name: 'Black', type: 'color', stock: Math.floor(Math.random() * 30) + 5 },
            { id: `v${genId}-2`, name: 'White', type: 'color', stock: Math.floor(Math.random() * 30) + 5 },
            { id: `v${genId}-3`, name: 'Gray', type: 'color', stock: Math.floor(Math.random() * 20) + 5 },
          ]
        : [
            { id: `v${genId}-1`, name: 'Small', type: 'size', stock: Math.floor(Math.random() * 25) + 5 },
            { id: `v${genId}-2`, name: 'Medium', type: 'size', stock: Math.floor(Math.random() * 25) + 5 },
            { id: `v${genId}-3`, name: 'Large', type: 'size', stock: Math.floor(Math.random() * 25) + 5 },
          ]
    ) : undefined;

    products.push({
      id: `gen-${genId}`,
      name: `${adj} ${base.name.split(' ').slice(0, 2).join(' ')} ${suffix}`.trim(),
      price: newPrice,
      originalPrice: hasDiscount ? Number((newPrice * (1.1 + Math.random() * 0.3)).toFixed(2)) : undefined,
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 2000) + 50,
      image: image,
      category: category,
      isNew: isNew,
      isSale: isSale,
      description: base.description,
      stock: Math.floor(Math.random() * 200) + 10,
      sold: Math.floor(Math.random() * 5000) + 100,
      comboAvailable: Math.random() > 0.8,
      variants: variants
    });
    genId++;
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

export const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    date: '2024-12-10',
    status: 'delivered',
    total: 299.99,
    items: [
      { productId: '1', name: 'Wireless Noise Cancelling Headphones', quantity: 1, price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80' }
    ],
    shippingAddress: '123 Main St, Dhaka, Bangladesh',
    trackingNumber: 'TRK123456789',
    carrier: 'Express Delivery',
    estimatedDelivery: '2024-12-12',
    deliveredAt: '2024-12-11'
  },
  {
    id: 'ORD-002',
    date: '2024-12-08',
    status: 'shipped',
    total: 449.99,
    items: [
      { productId: '2', name: 'Smart Fitness Watch Series 7', quantity: 1, price: 399.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80' },
      { productId: '11', name: 'Yoga Mat Premium', quantity: 1, price: 49.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&q=80' }
    ],
    shippingAddress: '456 Oak Ave, Chittagong, Bangladesh',
    trackingNumber: 'TRK987654321',
    carrier: 'Standard Shipping',
    estimatedDelivery: '2024-12-15'
  },
  {
    id: 'ORD-003',
    date: '2024-12-05',
    status: 'processing',
    total: 159.00,
    items: [
      { productId: '8', name: 'Designer Sunglasses', quantity: 1, price: 159.00, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&q=80' }
    ],
    shippingAddress: '789 Pine Rd, Sylhet, Bangladesh'
  }
];

export const MOCK_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'John Doe',
    phone: '+880 1712-345678',
    address: '123 Main Street, Apt 4B',
    city: 'Dhaka',
    state: 'Dhaka Division',
    zipCode: '1205',
    country: 'Bangladesh',
    isDefault: true
  },
  {
    id: 'addr-2',
    label: 'Office',
    name: 'John Doe',
    phone: '+880 1712-345679',
    address: '456 Business Park, Floor 5',
    city: 'Dhaka',
    state: 'Dhaka Division',
    zipCode: '1212',
    country: 'Bangladesh',
    isDefault: false
  }
];

export const MOCK_PAYMENT_METHODS = [
  {
    id: 'pay-1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true
  },
  {
    id: 'pay-2',
    type: 'card',
    brand: 'Mastercard',
    last4: '8888',
    expiry: '06/26',
    isDefault: false
  },
  {
    id: 'pay-3',
    type: 'mobile',
    provider: 'bKash',
    number: '01712-XXX-XXX',
    isDefault: false
  }
];

export const MOCK_AFFILIATE_DATA = {
  status: 'active',
  code: 'JOHND20',
  commission: 10,
  tier: 'Gold',
  totalEarnings: 2450.50,
  pendingEarnings: 350.00,
  availableForWithdrawal: 2100.50,
  totalClicks: 1245,
  totalConversions: 89,
  conversionRate: 7.15,
  stats: {
    thisMonth: {
      clicks: 245,
      conversions: 18,
      earnings: 450.00
    },
    lastMonth: {
      clicks: 320,
      conversions: 24,
      earnings: 620.00
    }
  },
  recentReferrals: [
    { id: 'ref-1', orderId: 'ORD-456', amount: 299.99, commission: 30.00, date: '2024-12-10', status: 'paid' },
    { id: 'ref-2', orderId: 'ORD-457', amount: 449.99, commission: 45.00, date: '2024-12-08', status: 'pending' },
    { id: 'ref-3', orderId: 'ORD-458', amount: 129.99, commission: 13.00, date: '2024-12-05', status: 'paid' }
  ],
  payoutHistory: [
    { id: 'payout-1', amount: 500.00, date: '2024-12-01', method: 'Bank Transfer', status: 'completed' },
    { id: 'payout-2', amount: 750.00, date: '2024-11-15', method: 'bKash', status: 'completed' },
    { id: 'payout-3', amount: 400.00, date: '2024-11-01', method: 'Bank Transfer', status: 'completed' }
  ]
};
