import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getSubtotal, getTotal } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal > 50 ? 0 : 5.00;
  const discount = promoApplied ? 10 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true);
      toast({
        title: "Promo code applied!",
        description: "You saved $10 on your order.",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your code and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-heading mb-8 flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary" /> Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
            <Link href="/shop">
              <Button size="lg" className="rounded-full" data-testid="button-start-shopping">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <Link href="/shop">
                  <Button variant="outline" className="gap-2" data-testid="button-continue-shopping">
                    <ArrowLeft className="h-4 w-4" /> Continue Shopping
                  </Button>
                </Link>
                <span className="text-muted-foreground text-sm">{items.length} item(s)</span>
              </div>
              {items.map((item) => (
                <Card key={item.product.id} className="flex flex-col sm:flex-row overflow-hidden" data-testid={`cart-item-${item.product.id}`}>
                  <div className="w-full sm:w-32 h-32 bg-muted shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="flex-1 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg line-clamp-1">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                      </div>
                      <p className="font-bold text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center border rounded-md h-8">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => {
                          if (item.quantity === 1) {
                            removeFromCart(item.product.id);
                          } else {
                            updateQuantity(item.product.id, item.quantity - 1);
                          }
                        }}
                          data-testid={`button-decrease-${item.product.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.product.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10" 
                        onClick={() => removeFromCart(item.product.id)}
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex gap-2 mb-4">
                      <Input 
                        placeholder="Promo code" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                        data-testid="input-promo-code"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleApplyPromo}
                        disabled={promoApplied || !promoCode}
                        data-testid="button-apply-promo"
                      >
                        Apply
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-sm text-green-600 mb-4">SAVE10 applied!</p>
                    )}
                    <p className="text-xs text-muted-foreground mb-4">Try: SAVE10</p>
                    <Link href="/checkout">
                      <Button className="w-full h-12 text-base rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" data-testid="button-proceed-checkout">
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
