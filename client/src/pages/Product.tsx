import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";
import { MOCK_PRODUCTS, getAllProducts } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, ShieldCheck, RefreshCw, ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "./Home";

export default function ProductPage() {
  const [match, params] = useRoute("/product/:id");
  const id = params?.id;
  
  // Find product or fallback to first one for demo
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  const relatedProducts = getAllProducts(4);
  
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted border">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted border cursor-pointer opacity-70 hover:opacity-100 hover:border-primary transition-all">
                  <img 
                    src={product.image} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="text-primary bg-primary/10 hover:bg-primary/20">{product.category}</Badge>
                {product.isSale && <Badge variant="destructive">Sale</Badge>}
                {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">New Arrival</Badge>}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">{product.name}</h1>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-muted"}`} />
                  ))}
                </div>
                <span className="text-muted-foreground">{product.reviews} Reviews</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-green-600 font-medium">In Stock</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Experience the perfect blend of style and functionality. 
              Meticulously designed to enhance your daily life with premium materials and superior craftsmanship. 
              This product comes with our standard 2-year warranty and 30-day money-back guarantee.
            </p>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button size="lg" className="flex-1 h-12 text-base bg-primary hover:bg-primary/90 gap-2">
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </Button>
                
                <Button size="lg" variant="outline" className="h-12 w-12 p-0 border-primary/20 text-primary hover:bg-primary/5">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 text-sm">
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-muted-foreground text-xs">Orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <RefreshCw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-muted-foreground text-xs">30 Days Policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-lg font-medium"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-lg font-medium"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-lg font-medium"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-8 text-muted-foreground leading-relaxed">
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </TabsContent>
            <TabsContent value="specifications" className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-medium">Premium Composite</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">250g</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium">10 x 5 x 2 inches</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Warranty</span>
                  <span className="font-medium">2 Years Limited</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-8">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                          U{i}
                        </div>
                        <span className="font-medium">User {i}</span>
                      </div>
                      <div className="flex text-accent">
                        {Array.from({ length: 5 }).map((_, starI) => (
                          <Star key={starI} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      This product exceeded my expectations! The quality is amazing and it arrived faster than expected. Highly recommended.
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold font-heading mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
