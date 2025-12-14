import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";
import { formatCurrency } from "@/lib/utils";

export function SideCart() {
  const { items, updateQuantity, removeFromCart, getSubtotal, getTotal, isCartOpen, setIsCartOpen } = useCart();
  const [_, setLocation] = useLocation();
  
  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 100;
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setLocation("/checkout");
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
        data-testid="cart-overlay"
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 transition-transform duration-300 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        data-testid="side-cart"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Your Cart</h2>
              <Badge variant="secondary" className="ml-2">{items.length} items</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} data-testid="button-close-cart">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Add items to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-muted/30 rounded-lg" data-testid={`cart-item-${item.product.id}`}>
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                      <p className="text-primary font-bold">{formatCurrency(item.product.price)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md bg-background">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            data-testid={`button-decrease-${item.product.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.product.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                          data-testid={`button-remove-${item.product.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
                {shipping > 0 && subtotal < 5000 && (
                  <p className="text-xs text-muted-foreground">Add {formatCurrency(5000 - subtotal)} more for free shipping</p>
                )}
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full" size="lg" onClick={handleProceedToCheckout} data-testid="button-checkout">
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full" onClick={handleContinueShopping} data-testid="button-continue-shopping">
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
