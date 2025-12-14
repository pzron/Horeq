import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, DollarSign, ShoppingBag, TrendingUp, Package, Settings, CreditCard } from "lucide-react";

export default function Dashboard() {
  const [location] = useLocation();
  const type = location.includes("admin") ? "Admin" : "Affiliate";

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <div className="bg-card rounded-xl border p-4 shadow-sm mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {type === "Admin" ? <Settings className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold">{type} Portal</h3>
                  <p className="text-xs text-muted-foreground">Welcome back</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <Button variant="secondary" className="w-full justify-start gap-2">
                <BarChart className="h-4 w-4" /> Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <ShoppingBag className="h-4 w-4" /> Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Package className="h-4 w-4" /> Products
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" /> Customers
              </Button>
              {type === "Affiliate" && (
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <DollarSign className="h-4 w-4" /> Payouts
                </Button>
              )}
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="h-4 w-4" /> Settings
              </Button>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold font-heading">{type} Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
                    <p className="text-muted-foreground">Chart Visualization Placeholder</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          OM
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Olivia Martin</p>
                          <p className="text-sm text-muted-foreground">
                            olivia.martin@email.com
                          </p>
                        </div>
                        <div className="ml-auto font-medium">+$1,999.00</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
