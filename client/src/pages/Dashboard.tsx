import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  Users, DollarSign, ShoppingBag, TrendingUp, Copy, Settings, Bell, CreditCard, 
  Package, Truck, Heart, MapPin, Clock, Star, Eye, MousePointerClick, 
  ChevronRight, Plus, Edit, Trash2, Search, Filter, MoreVertical, 
  CheckCircle, XCircle, AlertCircle, ShoppingCart
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_PRODUCTS } from "@/lib/mockData";

const salesData = [
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

const userOrdersData = [
  { name: 'Jan', orders: 2 },
  { name: 'Feb', orders: 1 },
  { name: 'Mar', orders: 3 },
  { name: 'Apr', orders: 0 },
  { name: 'May', orders: 2 },
  { name: 'Jun', orders: 4 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Fashion', value: 25 },
  { name: 'Home', value: 20 },
  { name: 'Beauty', value: 12 },
  { name: 'Other', value: 8 },
];

const COLORS = ['#3b82f6', '#ec4899', '#f97316', '#a855f7', '#64748b'];

const recentOrders = [
  { id: 'ORD-1234', date: '2024-12-14', status: 'delivered', total: 299.99, items: 2 },
  { id: 'ORD-1233', date: '2024-12-12', status: 'shipped', total: 149.50, items: 1 },
  { id: 'ORD-1232', date: '2024-12-10', status: 'processing', total: 89.99, items: 3 },
  { id: 'ORD-1231', date: '2024-12-08', status: 'delivered', total: 459.00, items: 4 },
];

const recentSales = [
  { name: 'Sarah Johnson', email: 'sarah@email.com', amount: 1999.00 },
  { name: 'Mike Chen', email: 'mike@email.com', amount: 459.00 },
  { name: 'Emma Wilson', email: 'emma@email.com', amount: 299.99 },
  { name: 'John Doe', email: 'john@email.com', amount: 149.50 },
  { name: 'Lisa Park', email: 'lisa@email.com', amount: 89.99 },
];

const wishlistItems = MOCK_PRODUCTS.slice(0, 4);

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    delivered: { color: 'bg-green-500', icon: CheckCircle, text: 'Delivered' },
    shipped: { color: 'bg-blue-500', icon: Truck, text: 'Shipped' },
    processing: { color: 'bg-yellow-500', icon: Clock, text: 'Processing' },
    cancelled: { color: 'bg-red-500', icon: XCircle, text: 'Cancelled' },
  }[status] || { color: 'bg-gray-500', icon: AlertCircle, text: status };

  return (
    <Badge className={`${config.color} gap-1`}>
      <config.icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
};

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading" data-testid="text-dashboard-title">Dashboard</h1>
            <p className="text-muted-foreground">Manage your account, orders, and affiliate performance</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" data-testid="button-settings">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
            <Button variant="outline" size="sm" data-testid="button-notifications">
              <Bell className="h-4 w-4 mr-2" /> Notifications
              <Badge className="ml-2 bg-red-500 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">3</Badge>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="user" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="user" data-testid="tab-user">My Account</TabsTrigger>
            <TabsTrigger value="affiliate" data-testid="tab-affiliate">Affiliate Center</TabsTrigger>
            <TabsTrigger value="admin" data-testid="tab-admin">Admin Panel</TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card data-testid="card-total-orders">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">4 orders this month</p>
                </CardContent>
              </Card>
              <Card data-testid="card-total-spent">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,847.50</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +$459 this month
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-wishlist">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">2 items on sale</p>
                </CardContent>
              </Card>
              <Card data-testid="card-loyalty-points">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,250</div>
                  <p className="text-xs text-muted-foreground">Worth $12.50</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest purchases</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-view-all-orders">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg" data-testid={`order-${order.id}`}>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.items} items - {order.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <StatusBadge status={order.status} />
                          <span className="font-bold">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                  <CardDescription>Your default address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">Home</span>
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      123 Main Street, Apt 4B<br />
                      Dhaka 1205, Bangladesh
                    </p>
                  </div>
                  <Button variant="outline" className="w-full" data-testid="button-add-address">
                    <Plus className="h-4 w-4 mr-2" /> Add New Address
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <div>
                  <CardTitle>My Wishlist</CardTitle>
                  <CardDescription>Products you want to buy later</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="group relative p-3 border rounded-lg" data-testid={`wishlist-item-${item.id}`}>
                      <div className="aspect-square rounded-md overflow-hidden bg-muted mb-3">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-primary font-bold">${item.price}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1 gap-1" data-testid={`button-add-cart-${item.id}`}>
                          <ShoppingCart className="h-3 w-3" /> Add
                        </Button>
                        <Button size="sm" variant="outline" data-testid={`button-remove-wishlist-${item.id}`}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliate" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none shadow-lg" data-testid="card-affiliate-earnings">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/80">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$1,245.00</div>
                  <p className="text-xs text-white/70 mt-1">Available for withdrawal</p>
                  <Button className="mt-4 bg-white text-purple-600" size="sm" data-testid="button-withdraw">
                    Withdraw Funds
                  </Button>
                </CardContent>
              </Card>
              <Card data-testid="card-affiliate-clicks">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8,542</div>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +12.5% this week
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-affiliate-conversion">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2.4%</div>
                  <p className="text-xs text-muted-foreground mt-1">Industry avg: 1.8%</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card data-testid="card-total-conversions">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">205</div>
                  <p className="text-xs text-muted-foreground">Successful sales</p>
                </CardContent>
              </Card>
              <Card data-testid="card-pending-earnings">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$328.50</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>
              <Card data-testid="card-commission-rate">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8%</div>
                  <p className="text-xs text-muted-foreground">Per sale</p>
                </CardContent>
              </Card>
              <Card data-testid="card-link-views">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Link Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24.5K</div>
                  <p className="text-xs text-muted-foreground">All time</p>
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
                      <AreaChart data={affiliateData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area yAxisId="left" type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={2} />
                        <Area yAxisId="right" type="monotone" dataKey="earnings" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} strokeWidth={2} />
                      </AreaChart>
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
                  <Button className="w-full gap-2" data-testid="button-copy-affiliate-link">
                    <Copy className="h-4 w-4" /> Copy Link
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Top Referring Products</h4>
                    <div className="space-y-3">
                      {MOCK_PRODUCTS.slice(0, 3).map((product, i) => (
                        <div key={product.id} className="flex items-center gap-3" data-testid={`top-product-${product.id}`}>
                          <div className="h-10 w-10 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{12 - i * 3} sales</p>
                          </div>
                          <div className="text-sm font-bold text-green-600">+${((12 - i * 3) * product.price * 0.08).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card data-testid="card-admin-revenue">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-admin-users">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2,350</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-admin-sales">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-admin-active">
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
              <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue for the current year</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
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

              <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentSales.map((sale, i) => (
                      <div key={i} className="flex items-center" data-testid={`sale-${i}`}>
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {sale.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{sale.name}</p>
                          <p className="text-xs text-muted-foreground">{sale.email}</p>
                        </div>
                        <div className="ml-auto font-medium">+${sale.amount.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution of sales across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {categoryData.map((entry, index) => (
                      <Badge key={entry.name} variant="outline" className="gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        {entry.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage your product inventory</CardDescription>
                  </div>
                  <Button size="sm" data-testid="button-add-product">
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search products..." className="pl-10" data-testid="input-search-products" />
                    </div>
                    <Button variant="outline" size="icon" data-testid="button-filter-products">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg" data-testid={`product-row-${product.id}`}>
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category} - Stock: {product.stock}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">${product.price}</p>
                          <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" data-testid={`button-edit-${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-delete-${product.id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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
