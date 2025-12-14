import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRoute } from "wouter";
import { MOCK_PRODUCTS, MOCK_REVIEWS, COMBO_PRODUCTS, getAllProducts, Product } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Truck, ShieldCheck, RefreshCw, ShoppingCart, Heart, Share2, Minus, Plus, Zap, Package, CheckCircle } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "./Home";
import { SideCart } from "@/components/SideCart";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  product: Product;
  quantity: number;
}

export default function ProductPage() {
  const [match, params] = useRoute("/product/:id");
  const id = params?.id;
  const { toast } = useToast();
  
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  const relatedProducts = getAllProducts(4);
  
  const relevantCombos = COMBO_PRODUCTS.filter(combo => combo.products.includes(product.id));
  
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = () => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    toast({
      title: "Proceeding to checkout",
      description: "Redirecting you to complete your purchase...",
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted border">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                data-testid="img-product-main"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-muted border cursor-pointer opacity-70 hover:opacity-100 hover:border-primary transition-all" data-testid={`img-thumbnail-${i}`}>
                  <img 
                    src={product.image} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge variant="secondary" className="text-primary bg-primary/10">{product.category}</Badge>
                {product.isSale && <Badge variant="destructive">Sale</Badge>}
                {product.isNew && <Badge className="bg-green-500">New Arrival</Badge>}
                {product.comboAvailable && <Badge className="bg-purple-500">Combo Available</Badge>}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground" data-testid="text-product-name">{product.name}</h1>
              
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-muted"}`} />
                  ))}
                  <span className="ml-1 font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">{product.reviews} Reviews</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-green-600 font-medium">{product.stock} In Stock</span>
                <span className="text-muted-foreground">{product.sold} Sold</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary" data-testid="text-product-price">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                  <Badge variant="destructive" className="text-sm">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description || "Experience the perfect blend of style and functionality. Meticulously designed to enhance your daily life with premium materials and superior craftsmanship."}
            </p>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="button-quantity-decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium" data-testid="text-quantity">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-quantity-increase"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1 h-12 text-base gap-2 border-primary text-primary"
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 w-12 p-0 border-primary/20 text-primary"
                  data-testid="button-wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              <Button 
                size="lg" 
                className="w-full h-12 text-base bg-gradient-to-r from-primary to-purple-600 gap-2"
                onClick={handleBuyNow}
                data-testid="button-buy-now"
              >
                <Zap className="h-5 w-5" /> Buy Now
              </Button>
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
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">2 Year Warranty</p>
                  <p className="text-muted-foreground text-xs">Full coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Secure Package</p>
                  <p className="text-muted-foreground text-xs">Safe delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relevantCombos.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Combo Deals - Save More
            </h2>
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                {COMBO_PRODUCTS.map((combo) => {
                  const comboProducts = combo.products.map(pid => MOCK_PRODUCTS.find(p => p.id === pid)).filter(Boolean);
                  return (
                    <Card key={combo.id} className="flex-shrink-0 w-80 overflow-hidden" data-testid={`card-combo-${combo.id}`}>
                      <div className="relative">
                        <img 
                          src={combo.image} 
                          alt={combo.name}
                          className="w-full h-40 object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          Save ${combo.savings.toFixed(2)}
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-bold text-lg">{combo.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {comboProducts.map(p => p && (
                            <Badge key={p.id} variant="outline" className="text-xs">{p.name.substring(0, 20)}...</Badge>
                          ))}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">${combo.price}</span>
                          <span className="text-muted-foreground line-through">${combo.originalPrice}</span>
                        </div>
                        <Button className="w-full gap-2" data-testid={`button-add-combo-${combo.id}`}>
                          <ShoppingCart className="h-4 w-4" /> Add Combo to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8 flex-wrap">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-lg font-medium"
                data-testid="tab-description"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-lg font-medium"
                data-testid="tab-specifications"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-lg font-medium"
                data-testid="tab-reviews"
              >
                Reviews ({product.reviews})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-8 text-muted-foreground leading-relaxed">
              <p className="mb-4">
                {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
              </p>
              <p>
                This product comes with our standard warranty and 30-day money-back guarantee. Experience the perfect blend of style and functionality, meticulously designed to enhance your daily life with premium materials and superior craftsmanship.
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
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Stock</span>
                  <span className="font-medium">{product.stock} units</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card className="lg:col-span-1">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{product.rating}</div>
                    <div className="flex justify-center text-amber-500 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm">Based on {product.reviews} reviews</p>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2 text-sm">
                          <span className="w-3">{stars}</span>
                          <Star className="h-3 w-3 text-amber-500 fill-current" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : 3}%` }}
                            />
                          </div>
                          <span className="w-8 text-muted-foreground">{stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : 3}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="lg:col-span-2 space-y-6">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-0" data-testid={`review-${review.id}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                            {review.userName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.userName}</span>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <CheckCircle className="h-3 w-3" /> Verified
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : ""}`} />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-semibold mb-1">{review.title}</h4>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full" data-testid="button-load-more-reviews">
                    Load More Reviews
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

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

      <SideCart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
