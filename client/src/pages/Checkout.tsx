import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CreditCard, Truck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Checkout() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Order Placed Successfully!",
        description: "Your order #12345 has been confirmed. Check your email for details.",
        className: "bg-green-600 text-white border-none"
      });
      setLocation("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-heading mb-8 text-center">Checkout</h1>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Shipping Info */}
            <Card className={step === 1 ? "border-primary ring-1 ring-primary" : ""}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${step > 1 ? "bg-green-500 text-white" : "bg-primary text-white"}`}>
                  {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                </div>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className={step !== 1 ? "hidden" : "space-y-4"}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Street Name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Dhaka" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input id="zip" placeholder="1212" />
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => setStep(2)}>
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>

            {/* Step 2: Payment */}
            <Card className={step === 2 ? "border-primary ring-1 ring-primary" : ""}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${step > 2 ? "bg-green-500 text-white" : step === 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                  2
                </div>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className={step !== 2 ? "hidden" : "space-y-6"}>
                <RadioGroup defaultValue="card">
                  <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                      <CreditCard className="h-5 w-5" /> Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer flex items-center gap-2">
                      <Truck className="h-5 w-5" /> Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="bkash" id="bkash" />
                    <Label htmlFor="bkash" className="flex-1 cursor-pointer flex items-center gap-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/BKash_Logo_icon.svg/50px-BKash_Logo_icon.svg.png" alt="Bkash" className="h-5 w-5 object-contain" /> Bkash / Nagad
                    </Label>
                  </div>
                </RadioGroup>

                <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                   <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-1" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
             <Card className="sticky top-24 bg-muted/20">
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mock Item */}
                <div className="flex gap-3">
                  <div className="h-16 w-16 bg-white rounded-md border p-1">
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="font-medium text-sm line-clamp-1">Smart Fitness Watch</p>
                    <p className="text-xs text-muted-foreground">Qty: 1</p>
                    <p className="font-bold text-sm">$399.00</p>
                  </div>
                </div>
                 <div className="flex gap-3">
                  <div className="h-16 w-16 bg-white rounded-md border p-1">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="font-medium text-sm line-clamp-1">Headphones</p>
                    <p className="text-xs text-muted-foreground">Qty: 1</p>
                    <p className="font-bold text-sm">$299.99</p>
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>$698.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">$698.99</span>
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
