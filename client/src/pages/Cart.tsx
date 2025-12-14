import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { getAllProducts } from "@/lib/mockData";

export default function Cart() {
  // Mock cart items
  const [cartItems, setCartItems] = useState(getAllProducts(3).map(p => ({ ...p, quantity: 1 })));

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.00;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-heading mb-8 flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary" /> Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/">
              <Button size="lg" className="rounded-full">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="flex flex-col sm:flex-row overflow-hidden">
                  <div className="w-full sm:w-32 h-32 bg-muted shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="flex-1 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center border rounded-md h-8">
                        <Button 
                          variant="ghost" size="icon" className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button 
                          variant="ghost" size="icon" className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax Estimate</span>
                    <span>${(subtotal * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(total + subtotal * 0.08).toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex gap-2 mb-4">
                      <Input placeholder="Promo code" />
                      <Button variant="outline">Apply</Button>
                    </div>
                    <Link href="/checkout">
                      <Button className="w-full h-12 text-base rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-4 text-xs text-muted-foreground text-center">
                  Secure Checkout - SSL Encrypted
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
