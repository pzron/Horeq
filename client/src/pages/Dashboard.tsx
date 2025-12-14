import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, DollarSign, ShoppingBag, TrendingUp, Copy, Settings, Bell, CreditCard } from "lucide-react";

const data = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 1800 },
  { name: 'Apr', total: 2400 },
  { name: 'May', total: 3200 },
  { name: 'Jun', total: 3800 },
];

const affiliateData = [
  { name: 'Mon', clicks: 45, earnings: 12 },
  { name: 'Tue', clicks: 52, earnings: 15 },
  { name: 'Wed', clicks: 38, earnings: 8 },
  { name: 'Thu', clicks: 65, earnings: 22 },
  { name: 'Fri', clicks: 48, earnings: 18 },
  { name: 'Sat', clicks: 72, earnings: 28 },
  { name: 'Sun', clicks: 60, earnings: 20 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
            <p className="text-muted-foreground">Manage your store and affiliate performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" /> Notifications
            </Button>
          </div>
        </div>

        <Tabs defaultValue="admin" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
            <TabsTrigger value="affiliate">Affiliate Center</TabsTrigger>
          </TabsList>

          {/* Admin Tab Content */}
          <TabsContent value="admin" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
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
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
              {/* Chart */}
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip />
                        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Sales */}
              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
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
                          <p className="text-xs text-muted-foreground">olivia.martin@email.com</p>
                        </div>
                        <div className="ml-auto font-medium">+$1,999.00</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Affiliate Tab Content */}
          <TabsContent value="affiliate" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-white/80 absolute right-6 top-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$1,245.00</div>
                  <p className="text-xs text-white/70 mt-1">Available for withdrawal</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground absolute right-6 top-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8,542</div>
                  <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12.5% this week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground absolute right-6 top-6" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2.4%</div>
                  <p className="text-xs text-muted-foreground mt-1">Industry avg: 1.8%</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                  <CardDescription>Clicks vs Earnings over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={affiliateData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="earnings" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Affiliate Link</CardTitle>
                  <CardDescription>Share this link to earn commissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg break-all text-sm font-mono border">
                    https://horeq.com/ref/johndoe
                  </div>
                  <Button className="w-full gap-2">
                    <Copy className="h-4 w-4" /> Copy Link
                  </Button>
                  
                  <div className="pt-4 space-y-4">
                    <h4 className="font-medium text-sm">Top Referring Products</h4>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-muted rounded-md overflow-hidden">
                            <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=100&q=80`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Premium Headphones</p>
                            <p className="text-xs text-muted-foreground">12 sales</p>
                          </div>
                          <div className="text-sm font-bold text-green-600">+$24.00</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
