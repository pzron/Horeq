import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CATEGORIES, getAllProducts, Product } from "@/lib/mockData";
import { ArrowRight, Star, ShoppingCart, Truck, ShieldCheck, RefreshCw, Clock, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Hero Section Component
function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-primary/5 py-12 md:py-20 lg:py-24">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in slide-in-from-left duration-700">
            <Badge className="bg-accent text-white hover:bg-accent/90 px-4 py-1.5 text-sm rounded-full">New Season Arrivals</Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-primary leading-[1.1]">
              Shop the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Future</span> of Retail.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Discover a curated collection of premium products. 
              From latest tech to trending fashion, we have it all delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 h-12 px-8 text-base">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full border-primary/20 text-primary hover:bg-primary/5 h-12 px-8 text-base">
                View Categories
              </Button>
            </div>
            
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
          
          <div className="relative animate-in zoom-in duration-700 delay-200 hidden lg:block">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" 
                alt="Fashion" 
                className="rounded-2xl shadow-2xl translate-y-8 object-cover h-64 w-full" 
              />
              <img 
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80" 
                alt="Electronics" 
                className="rounded-2xl shadow-2xl object-cover h-64 w-full" 
              />
              <img 
                src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80" 
                alt="Home" 
                className="rounded-2xl shadow-2xl translate-y-8 object-cover h-64 w-full" 
              />
              <img 
                src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80" 
                alt="Tech" 
                className="rounded-2xl shadow-2xl object-cover h-64 w-full" 
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl z-20 flex items-center gap-3 animate-bounce duration-[3000ms]">
              <div className="bg-green-100 p-2 rounded-full">
                <Star className="h-5 w-5 text-green-600 fill-green-600" />
              </div>
              <div>
                <p className="font-bold text-sm">4.9 Rating</p>
                <p className="text-xs text-muted-foreground">From 10k+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Component
function CategorySection() {
  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold font-heading mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Browse our wide selection of products</p>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary/80 gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              <a className="group flex flex-col items-center justify-center p-6 rounded-xl border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <cat.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{cat.count} Items</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Product Card Component
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-card rounded-xl border hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link href={`/product/${product.id}`}>
        <a className="relative aspect-[4/3] overflow-hidden bg-muted block">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
            )}
            {product.isSale && (
              <Badge className="bg-destructive hover:bg-destructive">Sale</Badge>
            )}
          </div>
        </a>
      </Link>
        
      {/* Quick Actions */}
      <div className="absolute right-2 top-2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white">
          <Heart className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-sm bg-white/90 backdrop-blur hover:bg-white">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Add to Cart Overlay (Mobile hidden, Desktop show on hover) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block z-10">
        <Button className="w-full bg-primary text-white hover:bg-primary/90 shadow-lg gap-2">
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground mb-2">{product.category}</div>
        <Link href={`/product/${product.id}`}>
          <a className="font-medium text-foreground line-clamp-2 mb-2 flex-1 hover:text-primary cursor-pointer transition-colors">
            {product.name}
          </a>
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
          <Button size="icon" variant="ghost" className="md:hidden text-primary">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Featured Products Section
function FeaturedProducts() {
  const products = getAllProducts(8);
  
  return (
    <div className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-heading">Featured Products</h2>
          <div className="hidden md:flex gap-4">
            <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary bg-primary/5">Best Sellers</Button>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">New Arrivals</Button>
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">Top Rated</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  );
}

// Banner Section
function PromoBanner() {
  return (
    <div className="py-16 container mx-auto px-4">
      <div className="relative rounded-3xl overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
        
        <div className="relative z-10 p-8 md:p-16 max-w-2xl">
          <Badge className="bg-accent text-white mb-4 hover:bg-accent">Limited Time Offer</Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            End of Season Sale<br />
            <span className="text-accent">Up to 70% Off</span>
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-md">
            Grab the best deals on electronics, fashion, and home accessories before they run out. Free shipping on all orders over $100.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 border-0">
              Shop The Sale
            </Button>
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur px-4 py-2 rounded-lg">
              <Clock className="h-5 w-5 text-accent" />
              <span className="font-mono font-bold">24 : 12 : 45</span>
            </div>
          </div>
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
        <CategorySection />
        <FeaturedProducts />
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
