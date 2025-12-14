import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, getAllProducts, Product } from "@/lib/mockData";
import { ArrowRight, Star, ShoppingCart, Truck, ShieldCheck, RefreshCw, Clock, Heart, Zap, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// --- Dynamic Hero Section with Auto-Updating Images ---
function HeroSection() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      alt: "Fashion Collection"
    },
    {
      src: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
      alt: "Latest Electronics"
    },
    {
      src: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
      alt: "Home Decor"
    },
    {
      src: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
      alt: "Tech Gadgets"
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative overflow-hidden bg-primary/5 py-12 md:py-20 lg:py-24">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6 z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-accent text-white hover:bg-accent/90 px-4 py-1.5 text-sm rounded-full mb-4 shadow-lg shadow-accent/20">
                New Season Arrivals
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-primary leading-[1.1]">
                Shop the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Future</span> of Retail.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mt-4">
                Discover a curated collection of premium products. 
                From latest tech to trending fashion, we have it all delivered to your door.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 h-12 px-8 text-base shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Shop Now
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/5 h-12 px-8 text-base transition-transform hover:scale-105">
                <Link href="/combo">
                  View Combos
                </Link>
              </Button>
            </motion.div>
            
            <div className="flex gap-8 pt-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Truck className="h-4 w-4 text-accent" />
                </div>
                Free Shipping
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                </div>
                Secure Payment
              </div>
            </div>
          </div>
          
          {/* Animated Image Carousel */}
          <div className="relative h-[400px] md:h-[500px] hidden lg:block perspective-1000">
             {/* Floating Badge */}
            <motion.div 
              className="absolute top-10 -left-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl z-30 flex items-center gap-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="bg-green-100 p-2 rounded-full">
                <Star className="h-5 w-5 text-green-600 fill-green-600" />
              </div>
              <div>
                <p className="font-bold text-sm">4.9 Rating</p>
                <p className="text-xs text-muted-foreground">From 10k+ Reviews</p>
              </div>
            </motion.div>

            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.95, rotate: -2, x: 50 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1.05, rotate: 2, x: -50 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute inset-0 z-10"
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                    <img 
                      src={images[currentImageIndex].src} 
                      alt={images[currentImageIndex].alt}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay for text readability if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Caption */}
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {images[currentImageIndex].alt}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Background Stacked Card Effect */}
              <div className="absolute top-4 left-4 w-full h-full bg-primary/10 rounded-3xl -z-10 rotate-3"></div>
              <div className="absolute top-8 left-8 w-full h-full bg-accent/10 rounded-3xl -z-20 rotate-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Scrolling Marquee Categories ---
function CategoryMarquee() {
  const duplicatedCategories = [...CATEGORIES, ...CATEGORIES]; // Duplicate for seamless loop

  return (
    <div className="py-12 bg-background border-y overflow-hidden relative">
      <div className="container mx-auto px-4 mb-6">
         <h2 className="text-2xl font-bold font-heading">Shop by Category</h2>
      </div>
      
      {/* Marquee Container */}
      <div className="flex w-full overflow-hidden relative">
        <motion.div 
          className="flex gap-6 whitespace-nowrap"
          animate={{ x: [0, -1000] }} // Adjust value based on width
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 30, // Slow speed for readability
          }}
        >
          {duplicatedCategories.map((cat, idx) => (
            <Link key={`${cat.id}-${idx}`} href={`/category/${cat.slug}`} className="inline-flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-card border hover:border-accent hover:shadow-lg transition-all duration-300 group shrink-0">
                <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-3 transition-colors duration-300
                  ${idx % 2 === 0 ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white'}
                `}>
                  <cat.icon className="h-7 w-7" />
                </div>
                <span className="font-medium text-sm group-hover:text-primary transition-colors">{cat.name}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// --- Dynamic Grid with Color Changing Styles ---
function DynamicProductGrid() {
  const products = getAllProducts(8);
  // Color themes that will cycle
  const themes = [
    "border-primary/20 hover:border-primary shadow-primary/5",
    "border-accent/20 hover:border-accent shadow-accent/5",
    "border-green-500/20 hover:border-green-500 shadow-green-500/5",
    "border-purple-500/20 hover:border-purple-500 shadow-purple-500/5"
  ];
  
  const [themeIndex, setThemeIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % themes.length);
    }, 5000); // Change theme every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-16 bg-secondary/30 transition-colors duration-1000">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-accent animate-pulse" />
            <h2 className="text-3xl font-bold font-heading">Trending Now</h2>
          </div>
          <div className="hidden md:flex gap-4">
            <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary bg-primary/5">Best Sellers</Button>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">New Arrivals</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className={`group relative bg-card rounded-xl border-2 transition-all duration-1000 hover:shadow-xl overflow-hidden flex flex-col h-full ${themes[themeIndex]}`}>
                <Link href={`/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted block">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                    />
                    
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <Badge className="bg-green-500 hover:bg-green-600 animate-pulse">New</Badge>
                      )}
                      {product.isSale && (
                        <Badge className="bg-destructive hover:bg-destructive">Sale</Badge>
                      )}
                    </div>
                </Link>
                  
                <div className="absolute right-2 top-2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-xs text-muted-foreground mb-2">{product.category}</div>
                  <Link href={`/product/${product.id}`} className="font-medium text-foreground line-clamp-2 mb-2 flex-1 hover:text-primary cursor-pointer transition-colors">
                      {product.name}
                  </Link>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted"}`} 
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <Button size="sm" className="rounded-full px-4 bg-primary text-white hover:bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 rounded-full transition-all hover:shadow-lg hover:shadow-primary/20">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  );
}

// Re-using PromoBanner but ensuring it fits
function PromoBanner() {
  return (
    <div className="py-16 container mx-auto px-4">
      <div className="relative rounded-3xl overflow-hidden bg-primary text-white shadow-2xl shadow-primary/20 transform hover:scale-[1.01] transition-transform duration-500">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        
        <div className="relative z-10 p-8 md:p-16 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-accent text-white mb-4 hover:bg-accent px-3 py-1">Limited Time Offer</Badge>
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              End of Season Sale<br />
              <span className="text-accent">Up to 70% Off</span>
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Grab the best deals on electronics, fashion, and home accessories before they run out. Free shipping on all orders over $100.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 border-0 rounded-full px-8 font-bold">
                Shop The Sale
              </Button>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
                <Clock className="h-5 w-5 text-accent animate-pulse" />
                <span className="font-mono font-bold tracking-widest">24 : 12 : 45</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Product Card for More to Love section (simplified)
export function ProductCard({ product }: { product: Product }) {
   return (
    <div className="group relative bg-card rounded-xl border hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link href={`/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted block">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
          />
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
            )}
            {product.isSale && (
              <Badge className="bg-destructive hover:bg-destructive">Sale</Badge>
            )}
          </div>
      </Link>
        
      <div className="absolute right-2 top-2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground mb-2">{product.category}</div>
        <Link href={`/product/${product.id}`} className="font-medium text-foreground line-clamp-2 mb-2 flex-1 hover:text-primary cursor-pointer transition-colors">
            {product.name}
        </Link>
        
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted"}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
          <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10 rounded-full">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryMarquee />
        <DynamicProductGrid />
        <PromoBanner />
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-heading mb-8">More to Love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getAllProducts(8).map((product) => (
                <ProductCard key={`more-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
