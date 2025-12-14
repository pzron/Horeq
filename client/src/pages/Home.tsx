import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, getAllProducts, Product, NOTIFICATION_MESSAGES } from "@/lib/mockData";
import { ArrowRight, Star, ShoppingCart, Truck, ShieldCheck, RefreshCw, Clock, Heart, Zap, Play, Pause, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative overflow-hidden bg-primary/5 py-8 md:py-12">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <div className="space-y-4 z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-accent text-white hover:bg-accent/90 px-3 py-1 text-xs rounded-full mb-3 shadow-lg shadow-accent/20">
                New Season Arrivals
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold font-heading text-primary leading-[1.1]">
                Shop the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Future</span> of Retail.
              </h1>
              <p className="text-base text-muted-foreground max-w-md mt-3">
                Discover a curated collection of premium products. 
                From latest tech to trending fashion, we have it all.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/shop">
                <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 h-10 px-6 text-sm shadow-lg shadow-primary/20 transition-transform hover:scale-105" data-testid="button-hero-shop">
                  Shop Now
                </Button>
              </Link>
              <Link href="/combo">
                <Button size="lg" variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/5 h-10 px-6 text-sm transition-transform hover:scale-105" data-testid="button-hero-combos">
                  View Combos
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <div className="relative h-[300px] hidden md:block perspective-1000">
            <motion.div 
              className="absolute top-4 -left-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-xl z-30 flex items-center gap-2"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="bg-green-100 p-1.5 rounded-full">
                <Star className="h-4 w-4 text-green-600 fill-green-600" />
              </div>
              <div>
                <p className="font-bold text-xs">4.9 Rating</p>
              </div>
            </motion.div>

            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotateY: 0,
                    y: [0, -15, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  transition={{ 
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.5 },
                    rotateY: { duration: 0.8, ease: "backOut" },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute z-10 w-[80%] aspect-[4/3]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 transform-gpu">
                    <img 
                      src={images[currentImageIndex].src} 
                      alt={images[currentImageIndex].alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {images[currentImageIndex].alt}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/30 blur-[60px] -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScrollingCategoriesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isPaused) return;

    const scrollSpeed = 1;
    let animationFrameId: number;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const doubledCategories = [...CATEGORIES, ...CATEGORIES];

  const getColorClasses = (color: string, bgColor: string) => {
    return {
      iconColor: color,
      bgClass: bgColor
    };
  };

  return (
    <div className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold font-heading mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">Explore our wide range of products</p>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar py-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{ scrollBehavior: 'auto' }}
        >
          {doubledCategories.map((cat, idx) => {
            const { iconColor, bgClass } = getColorClasses(cat.color, cat.bgColor);
            return (
              <Link key={`${cat.id}-${idx}`} href={`/category/${cat.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex-shrink-0"
                >
                  <div 
                    className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-transparent hover:border-primary/30 transition-all duration-300 cursor-pointer min-w-[120px] min-h-[130px]" 
                    style={{ backgroundColor: `${cat.color}15` }}
                    data-testid={`card-category-${cat.slug}-${idx}`}
                  >
                    <div 
                      className="h-14 w-14 rounded-full flex items-center justify-center mb-3 shadow-lg"
                      style={{ backgroundColor: cat.color }}
                    >
                      <cat.icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="font-medium text-xs text-center transition-colors leading-tight" style={{ color: cat.color }}>
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1">{cat.count} items</span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DynamicProductGrid() {
  const products = getAllProducts(24);
  const themes = [
    { border: "border-blue-500/30 hover:border-blue-500", shadow: "shadow-blue-500/10", accent: "bg-blue-500" },
    { border: "border-purple-500/30 hover:border-purple-500", shadow: "shadow-purple-500/10", accent: "bg-purple-500" },
    { border: "border-green-500/30 hover:border-green-500", shadow: "shadow-green-500/10", accent: "bg-green-500" },
    { border: "border-orange-500/30 hover:border-orange-500", shadow: "shadow-orange-500/10", accent: "bg-orange-500" },
    { border: "border-pink-500/30 hover:border-pink-500", shadow: "shadow-pink-500/10", accent: "bg-pink-500" },
    { border: "border-cyan-500/30 hover:border-cyan-500", shadow: "shadow-cyan-500/10", accent: "bg-cyan-500" },
  ];
  
  const [themeIndex, setThemeIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % themes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getItemTheme = (idx: number) => {
    const rowThemes = [
      themes[themeIndex % themes.length],
      themes[(themeIndex + 1) % themes.length],
      themes[(themeIndex + 2) % themes.length],
      themes[(themeIndex + 3) % themes.length],
    ];
    return rowThemes[idx % rowThemes.length];
  };

  return (
    <div className="py-12 bg-secondary/30 transition-colors duration-1000">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent animate-pulse" />
            <h2 className="text-2xl font-bold font-heading">Trending Now</h2>
          </div>
          <div className="hidden md:flex gap-4">
            <Link href="/bestsellers">
              <Button variant="outline" size="sm" className="rounded-full h-8 text-xs border-primary/20 text-primary bg-primary/5" data-testid="button-bestsellers">Best Sellers</Button>
            </Link>
            <Link href="/new">
              <Button variant="ghost" size="sm" className="rounded-full h-8 text-xs text-muted-foreground" data-testid="button-newarrivals">New Arrivals</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product, idx) => {
            const theme = getItemTheme(idx);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.02 }}
              >
                <div className={`group relative bg-card rounded-lg border-2 transition-all duration-500 hover:shadow-xl overflow-hidden flex flex-col h-full ${theme.border} ${theme.shadow}`} data-testid={`card-product-${product.id}`}>
                  <Link href={`/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted block">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                      />
                      
                      <div className="absolute top-1 left-1 flex flex-col gap-1">
                        {product.isNew && (
                          <Badge className="bg-green-500/90 hover:bg-green-600 text-[10px] px-1.5 py-0">New</Badge>
                        )}
                        {product.isSale && (
                          <Badge className="bg-destructive/90 hover:bg-destructive text-[10px] px-1.5 py-0">Sale</Badge>
                        )}
                      </div>
                  </Link>
                    
                  <div className="absolute right-1 top-1 flex flex-col gap-1 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                    <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white" data-testid={`button-wishlist-${product.id}`}>
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="p-3 flex flex-col flex-1">
                    <div className="text-[10px] text-muted-foreground mb-1">{product.category}</div>
                    <Link href={`/product/${product.id}`} className="font-medium text-xs text-foreground line-clamp-2 mb-2 flex-1 hover:text-primary cursor-pointer transition-colors leading-tight">
                        {product.name}
                    </Link>
                    
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-2.5 w-2.5 ${i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-muted"}`} 
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-primary">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-muted-foreground line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <Button size="icon" className={`h-6 w-6 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 ${theme.accent}`} data-testid={`button-add-cart-${product.id}`}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/shop">
            <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-6 rounded-full transition-all hover:shadow-lg hover:shadow-primary/20" data-testid="button-load-more">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 12, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
              <Link href="/deals">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 border-0 rounded-full px-8 font-bold" data-testid="button-promo-shop">
                  Shop The Sale
                </Button>
              </Link>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
                <Clock className="h-5 w-5 text-accent animate-pulse" />
                <span className="font-mono font-bold tracking-widest">
                  {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
   return (
    <div className="group relative bg-card rounded-xl border hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full" data-testid={`card-product-more-${product.id}`}>
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

function FeaturesSection() {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected" },
    { icon: RefreshCw, title: "Easy Returns", desc: "30-day returns" },
    { icon: Clock, title: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <div className="py-12 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { toast } = useToast();

  useEffect(() => {
    const showRandomNotification = () => {
      const notification = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
      const icons = {
        product: { title: 'New Product', className: 'border-l-4 border-l-green-500' },
        combo: { title: 'Combo Deal', className: 'border-l-4 border-l-purple-500' },
        deal: { title: 'Flash Deal', className: 'border-l-4 border-l-orange-500' },
        delivery: { title: 'Delivery Update', className: 'border-l-4 border-l-blue-500' },
      };
      const config = icons[notification.type as keyof typeof icons] || icons.product;
      
      toast({
        title: config.title,
        description: notification.message,
        className: `bg-background ${config.className} shadow-lg`,
        duration: 4000,
      });
    };

    const interval = setInterval(showRandomNotification, 30000);
    const initialTimer = setTimeout(showRandomNotification, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ScrollingCategoriesSection />
        <DynamicProductGrid />
        <PromoBanner />
        <div className="bg-background py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-heading mb-8">More to Love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getAllProducts(8).map((product) => (
                <ProductCard key={`more-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </div>
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
