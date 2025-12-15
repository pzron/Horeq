import { db } from "../server/db";
import { categories, products } from "../shared/schema";

const categoryData = [
  { name: "Electronics", slug: "electronics", color: "#3b82f6", icon: "Laptop" },
  { name: "Fashion", slug: "fashion", color: "#ec4899", icon: "Shirt" },
  { name: "Home & Living", slug: "home-living", color: "#f97316", icon: "Home" },
  { name: "Beauty", slug: "beauty", color: "#a855f7", icon: "Sparkles" },
  { name: "Health", slug: "health", color: "#ef4444", icon: "Heart" },
  { name: "Sports", slug: "sports", color: "#22c55e", icon: "Dumbbell" },
  { name: "Furniture", slug: "furniture", color: "#d97706", icon: "Sofa" },
  { name: "Baby & Kids", slug: "baby-kids", color: "#06b6d4", icon: "Baby" },
  { name: "Food", slug: "food", color: "#84cc16", icon: "UtensilsCrossed" },
  { name: "Pet Supplies", slug: "pet-supplies", color: "#14b8a6", icon: "PawPrint" },
  { name: "Watches", slug: "watches", color: "#f59e0b", icon: "Watch" },
  { name: "Audio", slug: "audio", color: "#9333ea", icon: "Music" },
];

const productData = [
  {
    name: "Wireless Noise Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life.",
    price: "299.99",
    originalPrice: "349.99",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    categoryId: "",
    stock: 45,
    sold: 3420,
    rating: "4.8",
    reviewCount: 1240,
    featured: true,
  },
  {
    name: "Smart Fitness Watch Series 7",
    slug: "smart-fitness-watch-series-7",
    description: "Track your fitness goals with GPS, heart rate monitor, and sleep tracking.",
    price: "399.00",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    categoryId: "",
    stock: 28,
    sold: 2150,
    rating: "4.9",
    reviewCount: 850,
    featured: true,
  },
  {
    name: "Premium Cotton T-Shirt",
    slug: "premium-cotton-tshirt",
    description: "100% organic cotton, comfortable fit for everyday wear.",
    price: "29.99",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    categoryId: "",
    stock: 120,
    sold: 890,
    rating: "4.5",
    reviewCount: 230,
    featured: false,
  },
  {
    name: "Minimalist Desk Lamp",
    slug: "minimalist-desk-lamp",
    description: "Modern LED desk lamp with adjustable brightness and color temperature.",
    price: "89.99",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    categoryId: "",
    stock: 65,
    sold: 1100,
    rating: "4.6",
    reviewCount: 420,
    featured: true,
  },
  {
    name: "Organic Face Serum",
    slug: "organic-face-serum",
    description: "Natural vitamin C serum for glowing skin.",
    price: "45.99",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    categoryId: "",
    stock: 200,
    sold: 3200,
    rating: "4.7",
    reviewCount: 890,
    featured: true,
  },
  {
    name: "Yoga Mat Premium",
    slug: "yoga-mat-premium",
    description: "Extra thick eco-friendly yoga mat with carrying strap.",
    price: "59.99",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    categoryId: "",
    stock: 80,
    sold: 1500,
    rating: "4.8",
    reviewCount: 560,
    featured: false,
  },
  {
    name: "Modern Accent Chair",
    slug: "modern-accent-chair",
    description: "Comfortable velvet accent chair for living room or bedroom.",
    price: "299.99",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    categoryId: "",
    stock: 25,
    sold: 450,
    rating: "4.6",
    reviewCount: 180,
    featured: true,
  },
  {
    name: "Baby Stroller Deluxe",
    slug: "baby-stroller-deluxe",
    description: "Lightweight foldable stroller with all-terrain wheels.",
    price: "349.99",
    originalPrice: "449.99",
    image: "https://images.unsplash.com/photo-1622253694242-abeb37a33e97?w=800&q=80",
    categoryId: "",
    stock: 30,
    sold: 780,
    rating: "4.9",
    reviewCount: 340,
    featured: false,
  },
  {
    name: "Gourmet Coffee Beans",
    slug: "gourmet-coffee-beans",
    description: "Premium single-origin arabica coffee beans, medium roast.",
    price: "24.99",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
    categoryId: "",
    stock: 150,
    sold: 2800,
    rating: "4.7",
    reviewCount: 920,
    featured: true,
  },
  {
    name: "Premium Dog Food",
    slug: "premium-dog-food",
    description: "Grain-free natural dog food with real chicken.",
    price: "54.99",
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&q=80",
    categoryId: "",
    stock: 100,
    sold: 1200,
    rating: "4.8",
    reviewCount: 450,
    featured: false,
  },
  {
    name: "Bluetooth Speaker Pro",
    slug: "bluetooth-speaker-pro",
    description: "Waterproof portable speaker with 24-hour battery life.",
    price: "129.99",
    originalPrice: "159.99",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
    categoryId: "",
    stock: 55,
    sold: 1800,
    rating: "4.6",
    reviewCount: 670,
    featured: true,
  },
  {
    name: "Classic Leather Watch",
    slug: "classic-leather-watch",
    description: "Elegant analog watch with genuine leather strap.",
    price: "189.99",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    categoryId: "",
    stock: 40,
    sold: 920,
    rating: "4.7",
    reviewCount: 380,
    featured: true,
  },
];

async function seed() {
  console.log("Seeding database...");

  // Check if categories already exist
  const existingCategories = await db.select().from(categories);
  if (existingCategories.length > 0) {
    console.log("Database already has categories, skipping seed");
    process.exit(0);
  }

  // Insert categories
  const insertedCategories = await db.insert(categories).values(categoryData).returning();
  console.log(`Inserted ${insertedCategories.length} categories`);

  // Map category names to IDs
  const categoryMap: Record<string, string> = {};
  insertedCategories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  // Assign categories to products
  const productsWithCategories = productData.map((product, index) => {
    const categorySlug = 
      index < 2 ? "audio" :
      index === 2 ? "fashion" :
      index === 3 ? "home-living" :
      index === 4 ? "beauty" :
      index === 5 ? "sports" :
      index === 6 ? "furniture" :
      index === 7 ? "baby-kids" :
      index === 8 ? "food" :
      index === 9 ? "pet-supplies" :
      index === 10 ? "audio" :
      "watches";
    
    return {
      ...product,
      categoryId: categoryMap[categorySlug] || insertedCategories[0].id,
    };
  });

  // Insert products
  const insertedProducts = await db.insert(products).values(productsWithCategories).returning();
  console.log(`Inserted ${insertedProducts.length} products`);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
