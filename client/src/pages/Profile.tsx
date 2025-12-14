import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, CreditCard, Settings, User, ShoppingBag } from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Profile Card */}
          <Card className="w-full md:w-80 h-fit">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 relative">
                <Avatar className="h-24 w-24 border-4 border-primary/10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Badge className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 border-2 border-white">Verified</Badge>
              </div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>john.doe@example.com</CardDescription>
              <CardDescription>+880 1712-345678</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start font-medium bg-primary/5 text-primary">
                  <User className="mr-2 h-4 w-4" /> Personal Info
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium">
                  <ShoppingBag className="mr-2 h-4 w-4" /> My Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium">
                  <MapPin className="mr-2 h-4 w-4" /> Addresses
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium">
                  <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
                </Button>
                <Button variant="ghost" className="w-full justify-start font-medium">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="flex-1">
             <Tabs defaultValue="orders" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="reviews">My Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="space-y-4">
                <h2 className="text-2xl font-bold font-heading mb-4">Order History</h2>
                
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="bg-muted/30 p-4 flex flex-wrap justify-between items-center gap-4 border-b">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase font-bold">Order Placed</p>
                        <p className="text-sm font-medium">December {10 + i}, 2024</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase font-bold">Total</p>
                        <p className="text-sm font-medium">$124.00</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase font-bold">Ship To</p>
                        <p className="text-sm font-medium text-primary cursor-pointer hover:underline">John Doe</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase font-bold">Order #</p>
                        <p className="text-sm font-medium">112-3456789-{12345 + i}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="h-20 w-20 bg-muted rounded-md overflow-hidden shrink-0">
                          <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=200&q=80`} className="w-full h-full object-cover" alt="Product" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg hover:text-primary cursor-pointer">Premium Wireless Headphones</h3>
                          <p className="text-sm text-muted-foreground mb-2">Electronics • Black Edition</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Delivered</Badge>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                          <Button size="sm">Track Package</Button>
                          <Button size="sm" variant="outline">Write a Review</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="wishlist">
                <div className="text-center py-12 text-muted-foreground">
                  Your wishlist is empty.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
