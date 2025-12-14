import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Mail, Lock, TrendingUp, DollarSign, MousePointer } from "lucide-react";

export default function AffiliateAuth() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password, "affiliate");
    
    setLoading(false);
    if (success) {
      toast({
        title: "Welcome back, Partner!",
        description: "Successfully logged in to your affiliate dashboard.",
        className: "bg-purple-600 text-white border-none"
      });
      setLocation("/profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12 bg-gradient-to-br from-purple-500/10 via-background to-pink-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="text-center p-4">
              <DollarSign className="h-6 w-6 mx-auto text-green-500 mb-2" />
              <p className="text-sm font-medium">10% Commission</p>
            </Card>
            <Card className="text-center p-4">
              <MousePointer className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-sm font-medium">Track Clicks</p>
            </Card>
            <Card className="text-center p-4">
              <TrendingUp className="h-6 w-6 mx-auto text-purple-500 mb-2" />
              <p className="text-sm font-medium">Real Analytics</p>
            </Card>
          </div>

          <Card className="shadow-2xl border-purple-500/20">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto bg-gradient-to-br from-purple-500 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center mb-2">
                <Users className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold font-heading">Affiliate Partner Login</CardTitle>
              <CardDescription>
                Access your affiliate dashboard and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Affiliate Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="affiliate@example.com" 
                      className="pl-10" 
                      required 
                      data-testid="input-affiliate-email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Not an affiliate yet?{" "}
                  <a href="/profile" className="text-purple-500 hover:underline font-medium">
                    Apply Now
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
