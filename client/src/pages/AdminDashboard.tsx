import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Settings,
  Menu,
  Tag,
  Activity,
  DollarSign,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  TrendingUp,
  UserCheck,
  Clock,
  ChevronRight,
  Shield,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Percent,
  CreditCard,
  Layers,
  Globe,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend,
} from "recharts";

type AdminSection = "dashboard" | "products" | "orders" | "users" | "affiliates" | "pages" | "menus" | "coupons" | "settings" | "activity";

const menuItems = [
  { id: "dashboard" as AdminSection, title: "Dashboard", icon: LayoutDashboard },
  { id: "products" as AdminSection, title: "Products", icon: Package },
  { id: "orders" as AdminSection, title: "Orders", icon: ShoppingCart },
  { id: "users" as AdminSection, title: "Users", icon: Users },
  { id: "affiliates" as AdminSection, title: "Affiliates", icon: UserCheck },
  { id: "pages" as AdminSection, title: "CMS Pages", icon: FileText },
  { id: "menus" as AdminSection, title: "Menus", icon: Menu },
  { id: "coupons" as AdminSection, title: "Coupons", icon: Tag },
  { id: "settings" as AdminSection, title: "Settings", icon: Settings },
  { id: "activity" as AdminSection, title: "Activity Log", icon: Activity },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">HOREQ Management</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        className={activeSection === item.id ? "bg-sidebar-accent" : ""}
                        data-testid={`nav-${item.id}`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-4 border-b bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div>
                <h1 className="text-xl font-bold capitalize" data-testid="text-section-title">
                  {activeSection === "dashboard" ? "Dashboard Overview" : activeSection}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {activeSection === "dashboard" 
                    ? "Welcome back, Admin" 
                    : `Manage your ${activeSection}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm" data-testid="link-view-site">
                  <Eye className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            {activeSection === "dashboard" && <DashboardOverview />}
            {activeSection === "products" && <ProductsSection />}
            {activeSection === "orders" && <OrdersSection />}
            {activeSection === "users" && <UsersSection />}
            {activeSection === "affiliates" && <AffiliatesSection />}
            {activeSection === "pages" && <PagesSection />}
            {activeSection === "menus" && <MenusSection />}
            {activeSection === "coupons" && <CouponsSection />}
            {activeSection === "settings" && <SettingsSection />}
            {activeSection === "activity" && <ActivitySection />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const salesData = [
  { name: "Jan", sales: 4000, orders: 24, visitors: 1200 },
  { name: "Feb", sales: 3000, orders: 18, visitors: 980 },
  { name: "Mar", sales: 5000, orders: 32, visitors: 1500 },
  { name: "Apr", sales: 4500, orders: 28, visitors: 1350 },
  { name: "May", sales: 6000, orders: 42, visitors: 1800 },
  { name: "Jun", sales: 5500, orders: 38, visitors: 1650 },
  { name: "Jul", sales: 7000, orders: 52, visitors: 2100 },
];

const categoryData = [
  { name: "Fashion", value: 35, color: "#8b5cf6" },
  { name: "Electronics", value: 25, color: "#3b82f6" },
  { name: "Home", value: 20, color: "#10b981" },
  { name: "Sports", value: 12, color: "#f59e0b" },
  { name: "Other", value: 8, color: "#6b7280" },
];

const trafficData = [
  { name: "Mon", desktop: 1200, mobile: 800, tablet: 200 },
  { name: "Tue", desktop: 1400, mobile: 900, tablet: 250 },
  { name: "Wed", desktop: 1100, mobile: 750, tablet: 180 },
  { name: "Thu", desktop: 1600, mobile: 1100, tablet: 300 },
  { name: "Fri", desktop: 1800, mobile: 1300, tablet: 350 },
  { name: "Sat", desktop: 2000, mobile: 1500, tablet: 400 },
  { name: "Sun", desktop: 1700, mobile: 1200, tablet: 320 },
];

function DashboardOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });
  const stats = data as DashboardStats | undefined;

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12.5%", trendUp: true },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "text-green-500", bg: "bg-green-500/10", trend: "+8.2%", trendUp: true },
    { title: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+5.1%", trendUp: true },
    { title: "Total Revenue", value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, color: "text-orange-500", bg: "bg-orange-500/10", trend: "+18.7%", trendUp: true },
  ];

  const performanceCards = [
    { title: "Conversion Rate", value: "3.2%", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+0.4%", trendUp: true },
    { title: "Avg Order Value", value: "$125.50", icon: CreditCard, color: "text-cyan-500", bg: "bg-cyan-500/10", trend: "+$12.30", trendUp: true },
    { title: "Cart Abandonment", value: "68.5%", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", trend: "-2.1%", trendUp: false },
    { title: "Returning Customers", value: "42%", icon: UserCheck, color: "text-indigo-500", bg: "bg-indigo-500/10", trend: "+5.8%", trendUp: true },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(' ', '-')}`}>
                {isLoading ? "..." : stat.value}
              </div>
              <div className={`flex items-center text-xs mt-1 ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                {stat.trendUp ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {stat.trend} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Sales Overview
              </CardTitle>
              <CardDescription>Monthly sales performance and trends</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">Last 7 months</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Sales by Category
            </CardTitle>
            <CardDescription>Product category distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`flex items-center text-xs mt-1 ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                {stat.trendUp ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Orders & Visitors Trend
            </CardTitle>
            <CardDescription>Correlation between traffic and orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsLineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                <Line yAxisId="right" type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Traffic by Device
            </CardTitle>
            <CardDescription>Weekly device breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="desktop" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mobile" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tablet" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <CardDescription>Latest orders from customers</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrdersList limit={5} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start" data-testid="button-add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" className="justify-start" data-testid="button-view-orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Orders
            </Button>
            <Button variant="outline" className="justify-start" data-testid="button-manage-users">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="justify-start" data-testid="button-site-settings">
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </Button>
            <Button variant="outline" className="justify-start" data-testid="button-manage-coupons">
              <Tag className="h-4 w-4 mr-2" />
              Manage Coupons
            </Button>
            <Button variant="outline" className="justify-start" data-testid="button-view-reports">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RecentOrdersList({ limit = 5 }: { limit?: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
  });
  const orders = data as any[] | undefined;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading orders...</div>;
  }

  const recentOrders = (orders || []).slice(0, limit);

  if (recentOrders.length === 0) {
    return <div className="text-sm text-muted-foreground">No orders yet</div>;
  }

  return (
    <div className="space-y-3">
      {recentOrders.map((order: any) => (
        <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Order #{order.id}</p>
              <p className="text-xs text-muted-foreground">{order.customerName || "Customer"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{formatCurrency(order.totalAmount || 0)}</p>
            <Badge variant="outline" className="text-xs">
              {order.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsSection() {
  const { data } = useQuery({
    queryKey: ["/api/products"],
  });
  const products = data as any[] | undefined;
  const isLoading = !products;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10" data-testid="input-search-products" />
          </div>
        </div>
        <Button data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : (products || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                (products || []).map((product: any) => (
                  <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.categoryId || "Uncategorized"}</TableCell>
                    <TableCell>{formatCurrency(product.price || 0)}</TableCell>
                    <TableCell>{product.stock || 0}</TableCell>
                    <TableCell>
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-product-${product.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-product-${product.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersSection() {
  const { data } = useQuery({
    queryKey: ["/api/admin/orders"],
  });
  const orders = data as any[] | undefined;
  const isLoading = !orders;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-10" data-testid="input-search-orders" />
          </div>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40" data-testid="select-order-status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : (orders || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                (orders || []).map((order: any) => (
                  <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customerName || "Customer"}</TableCell>
                    <TableCell>{order.items?.length || 0} items</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount || 0)}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === "delivered" ? "default" :
                        order.status === "cancelled" ? "destructive" : "secondary"
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-view-order-${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-edit-order-${order.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersSection() {
  const { data } = useQuery({
    queryKey: ["/api/admin/users"],
  });
  const users = data as any[] | undefined;
  const isLoading = !users;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-10" data-testid="input-search-users" />
          </div>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40" data-testid="select-user-role">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="affiliate">Affiliates</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : (users || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                (users || []).map((user: any) => (
                  <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive !== false ? "default" : "secondary"}>
                        {user.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-user-${user.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-user-${user.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function PagesSection() {
  const { data } = useQuery({
    queryKey: ["/api/admin/pages"],
  });
  const pages = data as any[] | undefined;
  const isLoading = !pages;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search pages..." className="pl-10" data-testid="input-search-pages" />
          </div>
        </div>
        <Button data-testid="button-add-page">
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading pages...
                  </TableCell>
                </TableRow>
              ) : (pages || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No pages found. Create your first page.
                  </TableCell>
                </TableRow>
              ) : (
                (pages || []).map((page: any) => (
                  <TableRow key={page.id} data-testid={`row-page-${page.id}`}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="text-muted-foreground">/{page.slug}</TableCell>
                    <TableCell>{page.template || "Default"}</TableCell>
                    <TableCell>
                      <Badge variant={
                        page.status === "published" ? "default" :
                        page.status === "draft" ? "secondary" : "outline"
                      }>
                        {page.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-view-page-${page.id}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-edit-page-${page.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-page-${page.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function MenusSection() {
  const { data } = useQuery({
    queryKey: ["/api/admin/menus"],
  });
  const menus = data as any[] | undefined;
  const isLoading = !menus;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold">Navigation Menus</h2>
        <Button data-testid="button-add-menu">
          <Plus className="h-4 w-4 mr-2" />
          Add Menu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center">Loading menus...</CardContent>
          </Card>
        ) : (menus || []).length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No menus found. Create your first menu.
            </CardContent>
          </Card>
        ) : (
          (menus || []).map((menu: any) => (
            <Card key={menu.id} data-testid={`card-menu-${menu.id}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <div>
                  <CardTitle className="text-base">{menu.name}</CardTitle>
                  <CardDescription>{menu.location || "No location"}</CardDescription>
                </div>
                <Menu className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {menu.itemCount || 0} items
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" data-testid={`button-edit-menu-${menu.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" data-testid={`button-delete-menu-${menu.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function CouponsSection() {
  const { data } = useQuery({
    queryKey: ["/api/admin/coupons"],
  });
  const coupons = data as any[] | undefined;
  const isLoading = !coupons;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search coupons..." className="pl-10" data-testid="input-search-coupons" />
          </div>
        </div>
        <Button data-testid="button-add-coupon">
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading coupons...
                  </TableCell>
                </TableRow>
              ) : (coupons || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No coupons found. Create your first coupon.
                  </TableCell>
                </TableRow>
              ) : (
                (coupons || []).map((coupon: any) => (
                  <TableRow key={coupon.id} data-testid={`row-coupon-${coupon.id}`}>
                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.discountType}</TableCell>
                    <TableCell>
                      {coupon.discountType === "percentage" 
                        ? `${coupon.discountValue}%` 
                        : formatCurrency(coupon.discountValue)}
                    </TableCell>
                    <TableCell>
                      {coupon.usageCount || 0} / {coupon.usageLimit || "Unlimited"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.isActive ? "default" : "secondary"}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {coupon.expiresAt 
                        ? new Date(coupon.expiresAt).toLocaleDateString() 
                        : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-coupon-${coupon.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-coupon-${coupon.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsSection() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  const settingsGroups = [
    { key: "general", title: "General Settings", description: "Site name, description, and basic info" },
    { key: "store", title: "Store Settings", description: "Currency, shipping, and payment options" },
    { key: "email", title: "Email Settings", description: "SMTP configuration and email templates" },
    { key: "seo", title: "SEO Settings", description: "Meta tags, sitemap, and search optimization" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsGroups.map((group) => (
          <Card key={group.key} className="hover-elevate cursor-pointer" data-testid={`card-settings-${group.key}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">{group.title}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
          <CardDescription>Commonly modified settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Temporarily disable the store</p>
            </div>
            <Switch data-testid="switch-maintenance-mode" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Guest Checkout</Label>
              <p className="text-sm text-muted-foreground">Let customers checkout without account</p>
            </div>
            <Switch defaultChecked data-testid="switch-guest-checkout" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Reviews</Label>
              <p className="text-sm text-muted-foreground">Allow customers to leave product reviews</p>
            </div>
            <Switch defaultChecked data-testid="switch-enable-reviews" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AffiliateWithUser {
  id: string;
  userId: string;
  code: string;
  commission: string;
  totalEarnings: string;
  totalClicks: number;
  totalConversions: number;
  status: "pending" | "approved" | "rejected";
  applicationNote: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

function AffiliatesSection() {
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/affiliates"],
  });
  const affiliates = data as AffiliateWithUser[] | undefined;

  const approveMutation = useMutation({
    mutationFn: async (affiliateId: string) => {
      await apiRequest("PATCH", `/api/admin/affiliates/${affiliateId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/affiliates"] });
      toast({
        title: "Affiliate Approved",
        description: "The affiliate has been approved and can now access their dashboard.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve affiliate",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (affiliateId: string) => {
      await apiRequest("PATCH", `/api/admin/affiliates/${affiliateId}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/affiliates"] });
      toast({
        title: "Affiliate Rejected",
        description: "The affiliate application has been rejected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject affiliate",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">Pending</Badge>;
    }
  };

  const pendingAffiliates = affiliates?.filter(a => a.status === "pending") || [];
  const approvedAffiliates = affiliates?.filter(a => a.status === "approved") || [];
  const rejectedAffiliates = affiliates?.filter(a => a.status === "rejected") || [];

  return (
    <div className="space-y-6">
      {pendingAffiliates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pending Applications ({pendingAffiliates.length})
            </CardTitle>
            <CardDescription>Review and approve affiliate applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAffiliates.map((affiliate) => (
                  <TableRow key={affiliate.id} data-testid={`row-affiliate-pending-${affiliate.id}`}>
                    <TableCell className="font-medium">{affiliate.user?.username || "Unknown"}</TableCell>
                    <TableCell>{affiliate.user?.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{affiliate.code}</Badge>
                    </TableCell>
                    <TableCell>
                      {affiliate.createdAt ? new Date(affiliate.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(affiliate.id)}
                          disabled={approveMutation.isPending}
                          data-testid={`button-approve-${affiliate.id}`}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectMutation.mutate(affiliate.id)}
                          disabled={rejectMutation.isPending}
                          data-testid={`button-reject-${affiliate.id}`}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Affiliates</CardTitle>
          <CardDescription>Manage all affiliate accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading affiliates...</div>
          ) : (affiliates || []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No affiliates registered yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(affiliates || []).map((affiliate) => (
                  <TableRow key={affiliate.id} data-testid={`row-affiliate-${affiliate.id}`}>
                    <TableCell className="font-medium">{affiliate.user?.username || "Unknown"}</TableCell>
                    <TableCell>{affiliate.user?.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{affiliate.code}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                    <TableCell>{affiliate.commission}%</TableCell>
                    <TableCell>{affiliate.totalClicks}</TableCell>
                    <TableCell>{affiliate.totalConversions}</TableCell>
                    <TableCell>${parseFloat(affiliate.totalEarnings).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {affiliate.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => approveMutation.mutate(affiliate.id)}
                              disabled={approveMutation.isPending}
                              data-testid={`button-approve-list-${affiliate.id}`}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectMutation.mutate(affiliate.id)}
                              disabled={rejectMutation.isPending}
                              data-testid={`button-reject-list-${affiliate.id}`}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {affiliate.status === "rejected" && (
                          <Button
                            size="sm"
                            onClick={() => approveMutation.mutate(affiliate.id)}
                            disabled={approveMutation.isPending}
                            data-testid={`button-reapprove-${affiliate.id}`}
                          >
                            Re-approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-affiliates">{affiliates?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-approved-affiliates">{approvedAffiliates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600" data-testid="text-pending-affiliates">{pendingAffiliates.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActivitySection() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/activity-logs"],
  });
  const logs = data as any[] | undefined;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Admin actions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading activity logs...</div>
          ) : (logs || []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity logs yet
            </div>
          ) : (
            <div className="space-y-4">
              {(logs || []).map((log: any) => (
                <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50" data-testid={`row-activity-${log.id}`}>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.details || "No additional details"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                    </p>
                  </div>
                  {log.userId && (
                    <Badge variant="outline">User #{log.userId}</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
