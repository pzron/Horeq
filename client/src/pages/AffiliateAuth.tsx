import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Users, Mail, Lock, TrendingUp, DollarSign, MousePointer, User, Check, ArrowRight, Gift, Target, BarChart3 } from "lucide-react";

export default function AffiliateAuth() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup form state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(loginEmail, loginPassword, "affiliate");
    
    setLoading(false);
    if (result.success) {
      toast({
        title: "Welcome back, Partner!",
        description: "Successfully logged in to your affiliate dashboard.",
        className: "bg-purple-600 text-white border-none"
      });
      setLocation("/affiliate");
    } else {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid credentials or not an affiliate account.",
        variant: "destructive"
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Register as affiliate
      const response = await apiRequest("POST", "/api/affiliate/register", {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
        code: affiliateCode || undefined,
      });
      
      const userData = await response.json();
      
      toast({
        title: "Welcome to the Team!",
        description: `Your affiliate account has been created. Your code is: ${userData.affiliateCode}`,
        className: "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none"
      });
      
      // Auto-login after registration
      const loginResult = await login(signupUsername, signupPassword, "affiliate");
      if (loginResult.success) {
        setLocation("/affiliate");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create affiliate account.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: DollarSign, title: "10% Commission", description: "On every successful sale", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: MousePointer, title: "Click Tracking", description: "Real-time analytics", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: TrendingUp, title: "Growth Tools", description: "Marketing materials", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: Gift, title: "Exclusive Coupons", description: "Create your own codes", color: "text-pink-500", bg: "bg-pink-500/10" },
    { icon: Target, title: "Performance Goals", description: "Bonus rewards system", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: BarChart3, title: "Detailed Reports", description: "Export your data", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12 bg-gradient-to-br from-purple-500/10 via-background to-pink-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-5xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-heading mb-2">Affiliate Partner Program</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Join our affiliate program and earn commissions by promoting our products. 
              Get access to exclusive marketing tools and real-time analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Benefits Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Partner Benefits</h2>
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
              
              <Card className="p-4 mt-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border-purple-500/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" /> How It Works
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span>Sign up and get your unique referral code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span>Share your links on social media, blogs, or websites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span>Earn 10% commission on every sale made through your link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <span>Request payouts when you reach the minimum threshold</span>
                  </li>
                </ol>
              </Card>
            </div>

            {/* Auth Form */}
            <Card className="shadow-2xl border-purple-500/20">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-bold font-heading">
                  {activeTab === "login" ? "Partner Login" : "Become an Affiliate"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "login" 
                    ? "Access your affiliate dashboard" 
                    : "Create your affiliate account today"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" data-testid="tab-affiliate-login">Login</TabsTrigger>
                    <TabsTrigger value="signup" data-testid="tab-affiliate-signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email or Username</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="login-email" 
                            type="text"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="affiliate@example.com" 
                            className="pl-10" 
                            required 
                            data-testid="input-affiliate-email"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="login-password" 
                            type="password" 
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Enter your password" 
                            className="pl-10" 
                            required 
                            data-testid="input-affiliate-password"
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                        disabled={loading}
                        data-testid="button-affiliate-login"
                      >
                        {loading ? "Signing In..." : "Access Dashboard"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-username">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="signup-username" 
                            type="text"
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                            placeholder="Your unique username" 
                            className="pl-10" 
                            required 
                            data-testid="input-affiliate-signup-username"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="signup-email" 
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="your@email.com" 
                            className="pl-10" 
                            required 
                            data-testid="input-affiliate-signup-email"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="signup-password" 
                              type="password"
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              placeholder="Min 6 chars" 
                              className="pl-10" 
                              required 
                              data-testid="input-affiliate-signup-password"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm">Confirm</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="signup-confirm" 
                              type="password"
                              value={signupConfirmPassword}
                              onChange={(e) => setSignupConfirmPassword(e.target.value)}
                              placeholder="Confirm" 
                              className="pl-10" 
                              required 
                              data-testid="input-affiliate-signup-confirm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="affiliate-code">Custom Affiliate Code (Optional)</Label>
                        <Input 
                          id="affiliate-code" 
                          type="text"
                          value={affiliateCode}
                          onChange={(e) => setAffiliateCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                          placeholder="MYCODE123 (leave empty for auto-generated)" 
                          maxLength={12}
                          data-testid="input-affiliate-custom-code"
                        />
                        <p className="text-xs text-muted-foreground">
                          Letters and numbers only. This will be your unique referral code.
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                        disabled={loading}
                        data-testid="button-affiliate-signup"
                      >
                        {loading ? "Creating Account..." : "Join Affiliate Program"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-4 pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">
                    By joining, you agree to our affiliate terms and conditions.
                  </p>
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
