import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard, Truck, Zap, Clock, Tag, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const shippingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(4, "Zip code is required"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export default function Checkout() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { items, getSubtotal, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingOption, setShippingOption] = useState('standard');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zip: "",
    },
  });

  const shippingOptions = [
    { id: 'express', label: 'Express Shipping', price: 200, time: '1-2 business days', icon: Zap },
    { id: 'standard', label: 'Standard Shipping', price: 0, time: '3-5 business days', icon: Truck },
    { id: 'economy', label: 'Economy Shipping', price: 0, time: '7-10 business days', icon: Clock },
  ];

  const subtotal = getSubtotal();
  const shippingCost = shippingOptions.find(o => o.id === shippingOption)?.price || 0;
  const discount = couponApplied ? 500 : 0;
  const total = subtotal + shippingCost - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'save50') {
      setCouponApplied(true);
      toast({
        title: "Coupon Applied!",
        description: "You saved ৳500 on your order",
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid",
        variant: "destructive"
      });
    }
  };

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!shippingData) {
      toast({
        title: "Missing Information",
        description: "Please complete shipping information first.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Clear server cart
      await apiRequest("DELETE", "/api/cart/clear");

      // Step 2: Sync local cart items to server
      for (const item of items) {
        await apiRequest("POST", "/api/cart", {
          productId: parseInt(item.product.id),
          quantity: item.quantity,
        });
      }

      // Step 3: Place the order
      const shippingAddress = `${shippingData.firstName} ${shippingData.lastName}, ${shippingData.address}, ${shippingData.city} ${shippingData.zip}`;
      
      await apiRequest("POST", "/api/orders", {
        shippingAddress,
        paymentMethod,
      });

      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been confirmed. Check your email for details.",
        className: "bg-green-600 text-white border-none"
      });
      setLocation("/");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to place order. Please try again.";
      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some products before checkout.</p>
            <Link href="/shop">
              <Button size="lg" className="rounded-full" data-testid="button-go-shopping">Go Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please log in to checkout</h2>
            <p className="text-muted-foreground mb-8">You need to be logged in to complete your order.</p>
            <Link href="/login">
              <Button size="lg" className="rounded-full" data-testid="button-login-checkout">Log In to Continue</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-heading mb-8 text-center">Checkout</h1>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <Card className={step === 1 ? "border-primary ring-1 ring-primary" : ""}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${step > 1 ? "bg-green-500 text-white" : "bg-primary text-white"}`}>
                  {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                </div>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className={step !== 1 ? "hidden" : ""}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onShippingSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} data-testid="input-first-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} data-testid="input-last-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+880 1XXX-XXXXXX" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Street Name" {...field} data-testid="input-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Dhaka" {...field} data-testid="input-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="1212" {...field} data-testid="input-zip" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <Label className="text-base font-semibold mb-3 block">Shipping Method</Label>
                      <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-3">
                        {shippingOptions.map((option) => (
                          <div key={option.id} className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-colors ${shippingOption === option.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id} className="cursor-pointer flex items-center gap-2">
                                <option.icon className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="font-medium">{option.label}</p>
                                  <p className="text-sm text-muted-foreground">{option.time}</p>
                                </div>
                              </Label>
                            </div>
                            <span className="font-bold">{option.price === 0 ? 'Free' : formatCurrency(option.price)}</span>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full mt-4" data-testid="button-continue-payment">
                      Continue to Payment
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className={step === 2 ? "border-primary ring-1 ring-primary" : ""}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${step > 2 ? "bg-green-500 text-white" : step === 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  {step > 2 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
                </div>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className={step !== 2 ? "hidden" : "space-y-6"}>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                      <CreditCard className="h-5 w-5" /> Credit/Debit Card
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer flex items-center gap-2">
                      <Truck className="h-5 w-5" /> Cash on Delivery
                    </Label>
                  </div>
                  <div className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer transition-colors ${paymentMethod === 'bkash' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                    <RadioGroupItem value="bkash" id="bkash" />
                    <Label htmlFor="bkash" className="flex-1 cursor-pointer flex items-center gap-2">
                      Bkash / Nagad
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="0000 0000 0000 0000" data-testid="input-card-number" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" data-testid="input-expiry" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" data-testid="input-cvc" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1" onClick={() => setStep(3)} data-testid="button-continue-review">
                    Continue to Review
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className={step === 3 ? "border-primary ring-1 ring-primary" : ""}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${step === 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  3
                </div>
                <CardTitle>Review Order</CardTitle>
              </CardHeader>
              <CardContent className={step !== 3 ? "hidden" : "space-y-6"}>
                <div className="space-y-4">
                  {shippingData && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <p className="text-sm text-muted-foreground">{shippingData.firstName} {shippingData.lastName}</p>
                      <p className="text-sm text-muted-foreground">{shippingData.address}, {shippingData.city} {shippingData.zip}</p>
                      <p className="text-sm text-muted-foreground">{shippingData.phone}</p>
                    </div>
                  )}

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Shipping Method</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{shippingOptions.find(o => o.id === shippingOption)?.label}</span>
                      <span className="text-sm font-medium">{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{shippingOptions.find(o => o.id === shippingOption)?.time}</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Payment Method</h4>
                    <p className="text-sm text-muted-foreground">
                      {paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bkash / Nagad'}
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-3">
                          <div className="h-12 w-12 bg-white rounded-md border p-1">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 flex justify-between">
                            <div>
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-sm">{formatCurrency(item.product.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-1" onClick={handlePlaceOrder} disabled={loading} data-testid="button-place-order">
                    {loading ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-muted/20">
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="h-16 w-16 bg-white rounded-md border p-1">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="font-bold text-sm">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="coupon" className="text-sm font-medium flex items-center gap-1">
                    <Tag className="h-4 w-4" /> Coupon Code
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id="coupon" 
                      placeholder="Enter code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      data-testid="input-coupon"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || !couponCode}
                      data-testid="button-apply-coupon"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponApplied && (
                    <Badge className="bg-green-500">SAVE50 applied - ৳500 off</Badge>
                  )}
                  <p className="text-xs text-muted-foreground">Try: SAVE50</p>
                </div>

                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
