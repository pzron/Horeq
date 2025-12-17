import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Store, Mail, Lock, Package, DollarSign, TrendingUp, Settings, User, Check, ArrowRight, ShoppingBag, BarChart3 } from "lucide-react";

export default function VendorAuth() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "apply">("login");
  
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [storeName, setStoreName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [productCategories, setProductCategories] = useState("");
  const [reason, setReason] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(loginUsername, loginPassword, "vendor");
    
    setLoading(false);
    if (result.success) {
      toast({
        title: "Welcome back, Vendor!",
        description: "Successfully logged in to your vendor dashboard.",
        className: "bg-teal-600 text-white border-none"
      });
      setLocation("/vendor");
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid credentials or not a vendor account.",
        variant: "destructive"
      });
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to your account first before applying as a vendor.",
        variant: "destructive"
      });
      setLocation("/auth");
      return;
    }

    if (!storeName.trim()) {
      toast({
        title: "Store Name Required",
        description: "Please enter a name for your store.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/vendor/apply", {
        storeName,
        businessName: businessName || undefined,
        businessType: businessType || undefined,
        description: description || undefined,
        phone: phone || undefined,
        address: address || undefined,
        city: city || undefined,
        country: country || undefined,
        productCategories: productCategories || undefined,
        reason: reason || undefined,
      });
      
      toast({
        title: "Application Submitted!",
        description: "Your vendor application has been submitted for review. We will contact you soon.",
        className: "bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-none"
      });
      
      setStoreName("");
      setBusinessName("");
      setBusinessType("");
      setDescription("");
      setPhone("");
      setAddress("");
      setCity("");
      setCountry("");
      setProductCategories("");
      setReason("");
      
    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error.message || "Could not submit vendor application.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Store, title: "Your Own Store", description: "Branded storefront", color: "text-teal-500", bg: "bg-teal-500/10" },
    { icon: Package, title: "Product Management", description: "Add unlimited products", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: DollarSign, title: "Direct Earnings", description: "Competitive commissions", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: BarChart3, title: "Sales Analytics", description: "Track your performance", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: TrendingUp, title: "Growth Support", description: "Marketing tools", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: Settings, title: "Full Control", description: "Manage your business", color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12 bg-gradient-to-br from-teal-500/10 via-background to-emerald-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-5xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-gradient-to-br from-teal-500 to-emerald-500 w-16 h-16 rounded-2xl mb-4">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-heading mb-2">Vendor Partner Program</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Become a vendor and sell your products on our platform. 
              Get your own storefront, manage products, and grow your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Vendor Benefits</h2>
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit) => (
                  <Card key={benefit.title} className="p-4">
                    <div className={`${benefit.bg} p-2 rounded-lg w-fit mb-2`}>
                      <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
                    </div>
                    <h3 className="font-medium text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </Card>
                ))}
              </div>
              
              <Card className="p-4 mt-4 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 border-teal-500/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> How It Works
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Submit your vendor application with store details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Our team reviews your application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Once approved, start adding products and selling!</span>
                  </li>
                </ol>
              </Card>
            </div>

            <Card className="shadow-xl">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "apply")}>
                <CardHeader className="pb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" data-testid="tab-vendor-login">Vendor Login</TabsTrigger>
                    <TabsTrigger value="apply" data-testid="tab-vendor-apply">Apply as Vendor</TabsTrigger>
                  </TabsList>
                </CardHeader>
                
                <CardContent>
                  <TabsContent value="login" className="mt-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="login-username" 
                            placeholder="Enter your username" 
                            className="pl-10"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            required
                            data-testid="input-vendor-login-username"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="login-password" 
                            type="password" 
                            placeholder="Enter your password" 
                            className="pl-10"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            data-testid="input-vendor-login-password"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                        disabled={loading}
                        data-testid="button-vendor-login"
                      >
                        {loading ? "Signing In..." : "Sign In to Dashboard"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="apply" className="mt-0">
                    <form onSubmit={handleApply} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name">Store Name *</Label>
                        <div className="relative">
                          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="store-name" 
                            placeholder="Your store name" 
                            className="pl-10"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            required
                            data-testid="input-vendor-store-name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="business-name">Business Name</Label>
                          <Input 
                            id="business-name" 
                            placeholder="Legal business name"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            data-testid="input-vendor-business-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="business-type">Business Type</Label>
                          <Input 
                            id="business-type" 
                            placeholder="e.g., LLC, Sole Prop"
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            data-testid="input-vendor-business-type"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Store Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Tell us about your store and products..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          data-testid="input-vendor-description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            placeholder="Contact number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            data-testid="input-vendor-phone"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            placeholder="Your city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            data-testid="input-vendor-city"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-categories">Product Categories</Label>
                        <Input 
                          id="product-categories" 
                          placeholder="e.g., Electronics, Fashion, Home"
                          value={productCategories}
                          onChange={(e) => setProductCategories(e.target.value)}
                          data-testid="input-vendor-categories"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason">Why do you want to sell with us?</Label>
                        <Textarea 
                          id="reason" 
                          placeholder="Tell us about your goals..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          rows={2}
                          data-testid="input-vendor-reason"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                        disabled={loading}
                        data-testid="button-vendor-apply"
                      >
                        {loading ? "Submitting..." : "Submit Application"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      
                      {!user && (
                        <p className="text-xs text-center text-muted-foreground">
                          You must be logged in to apply. <a href="/auth" className="text-teal-500 hover:underline">Login here</a>
                        </p>
                      )}
                    </form>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
