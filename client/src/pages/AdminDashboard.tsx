import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertAffiliateTierSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  FolderOpen,
  Gift,
  Image,
  Link2,
  Copy,
  Download,
  ExternalLink,
  Megaphone,
  FileImage,
  Code,
  Layout,
  Type,
  ImagePlus,
  Grid3X3,
  MessageSquareQuote,
  Star,
  MousePointerClick,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Columns,
  Square,
  RectangleHorizontal,
  Play,
  Sparkles,
  Zap,
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

type AdminSection = "dashboard" | "products" | "categories" | "combos" | "banners" | "orders" | "users" | "affiliates" | "pages" | "menus" | "coupons" | "settings" | "activity";

const menuItems = [
  { id: "dashboard" as AdminSection, title: "Dashboard", icon: LayoutDashboard },
  { id: "products" as AdminSection, title: "Products", icon: Package },
  { id: "categories" as AdminSection, title: "Categories", icon: FolderOpen },
  { id: "combos" as AdminSection, title: "Combo Deals", icon: Gift },
  { id: "banners" as AdminSection, title: "Banners", icon: Image },
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
              <ThemeToggle />
              <Link href="/">
                <Button variant="outline" size="sm" data-testid="link-view-site">
                  <Eye className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            {activeSection === "dashboard" && <DashboardOverview onNavigate={setActiveSection} />}
            {activeSection === "products" && <ProductsSection />}
            {activeSection === "categories" && <CategoriesSection />}
            {activeSection === "combos" && <CombosSection />}
            {activeSection === "banners" && <BannersSection />}
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

interface DashboardOverviewProps {
  onNavigate: (section: AdminSection) => void;
}

function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
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
            <Button variant="outline" className="justify-start" onClick={() => onNavigate("products")} data-testid="button-add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onNavigate("orders")} data-testid="button-view-orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Orders
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onNavigate("users")} data-testid="button-manage-users">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onNavigate("settings")} data-testid="button-site-settings">
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onNavigate("coupons")} data-testid="button-manage-coupons">
              <Tag className="h-4 w-4 mr-2" />
              Manage Coupons
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => onNavigate("activity")} data-testid="button-view-reports">
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
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const initialFormData = {
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    categoryId: "",
    stock: 0,
    featured: false,
    comboAvailable: false,
  };
  const [formData, setFormData] = useState(initialFormData);

  const { data: productsData } = useQuery({
    queryKey: ["/api/products"],
  });
  const products = productsData as any[] | undefined;
  const isLoading = !products;

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
  });
  const categories = categoriesData as any[] | undefined;

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const productData = {
        ...data,
        price: data.price,
        originalPrice: data.originalPrice || null,
        stock: Number(data.stock) || 0,
      };
      await apiRequest("POST", "/api/products", productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsAddOpen(false);
      setFormData(initialFormData);
      toast({ title: "Product Created", description: "The product has been created successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create product", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const productData = {
        ...data,
        price: data.price,
        originalPrice: data.originalPrice || null,
        stock: Number(data.stock) || 0,
      };
      await apiRequest("PATCH", `/api/products/${id}`, productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      toast({ title: "Product Updated", description: "The product has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update product", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setDeleteConfirm(null);
      toast({ title: "Product Deleted", description: "The product has been deleted." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete product", variant: "destructive" });
    },
  });

  const handleAdd = () => {
    if (!formData.name || !formData.slug || !formData.price || !formData.image || !formData.categoryId) {
      toast({ title: "Validation Error", description: "Name, slug, price, image, and category are required", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = () => {
    if (!editingProduct) return;
    updateMutation.mutate({ id: editingProduct.id, data: formData });
  };

  const openEditDialog = (product: any) => {
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      originalPrice: product.originalPrice?.toString() || "",
      image: product.image || "",
      categoryId: product.categoryId || "",
      stock: product.stock || 0,
      featured: product.featured || false,
      comboAvailable: product.comboAvailable || false,
    });
    setEditingProduct(product);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories?.find((c: any) => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const filteredProducts = (products || []).filter((product: any) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProductFormFields = () => (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-name">Name</Label>
          <Input
            id="product-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })}
            placeholder="Product name"
            data-testid="input-product-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-slug">Slug</Label>
          <Input
            id="product-slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="product-slug"
            data-testid="input-product-slug"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="product-description">Description</Label>
        <Textarea
          id="product-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product description..."
          className="min-h-[80px]"
          data-testid="input-product-description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-price">Price</Label>
          <Input
            id="product-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            data-testid="input-product-price"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-original-price">Original Price (optional)</Label>
          <Input
            id="product-original-price"
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            placeholder="0.00"
            data-testid="input-product-original-price"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-category">Category</Label>
          <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger data-testid="select-product-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {(categories || []).map((category: any) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-stock">Stock</Label>
          <Input
            id="product-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            placeholder="0"
            data-testid="input-product-stock"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="product-image">Image URL</Label>
        <Input
          id="product-image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
          data-testid="input-product-image"
        />
        {formData.image && (
          <div className="mt-2">
            <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="product-featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
            data-testid="switch-product-featured"
          />
          <Label htmlFor="product-featured">Featured Product</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="product-combo"
            checked={formData.comboAvailable}
            onCheckedChange={(checked) => setFormData({ ...formData, comboAvailable: checked })}
            data-testid="switch-product-combo"
          />
          <Label htmlFor="product-combo">Available for Combos</Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-products" 
            />
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) setFormData(initialFormData);
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product for your store.</DialogDescription>
            </DialogHeader>
            <ProductFormFields />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={createMutation.isPending} data-testid="button-save-product">
                {createMutation.isPending ? "Creating..." : "Create Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No products match your search" : "No products found. Create your first product."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product: any) => (
                  <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || "/placeholder.png"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <span className="font-medium block">{product.name}</span>
                          {product.featured && <Badge variant="outline" className="text-xs mt-1">Featured</Badge>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">{formatCurrency(product.price || 0)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through ml-2">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                        {product.stock || 0} in stock
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? "default" : "secondary"}>
                        {product.stock > 0 ? "Active" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditDialog(product)}
                          data-testid={`button-edit-product-${product.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setDeleteConfirm(product.id)}
                          data-testid={`button-delete-product-${product.id}`}
                        >
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

      <Dialog open={!!editingProduct} onOpenChange={(open) => {
        if (!open) {
          setEditingProduct(null);
          setFormData(initialFormData);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details.</DialogDescription>
          </DialogHeader>
          <ProductFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending} data-testid="button-update-product">
              {updateMutation.isPending ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete-product"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CategoriesSection() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", color: "#8b5cf6", icon: "folder" });

  const { data } = useQuery({
    queryKey: ["/api/categories"],
  });
  const categories = data as any[] | undefined;
  const isLoading = !categories;

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; slug: string; color: string; icon: string }) => {
      await apiRequest("POST", "/api/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsAddOpen(false);
      setFormData({ name: "", slug: "", color: "#8b5cf6", icon: "folder" });
      toast({ title: "Category Created", description: "The category has been created successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create category", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; slug?: string; color?: string; icon?: string } }) => {
      await apiRequest("PATCH", `/api/admin/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setEditingCategory(null);
      toast({ title: "Category Updated", description: "The category has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update category", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setDeleteConfirm(null);
      toast({ title: "Category Deleted", description: "The category has been deleted." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete category", variant: "destructive" });
    },
  });

  const handleAdd = () => {
    if (!formData.name || !formData.slug) {
      toast({ title: "Validation Error", description: "Name and slug are required", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = () => {
    if (!editingCategory) return;
    updateMutation.mutate({ id: editingCategory.id, data: formData });
  };

  const openEditDialog = (category: any) => {
    setFormData({ name: category.name, slug: category.slug, color: category.color, icon: category.icon });
    setEditingCategory(category);
  };

  const iconOptions = ["folder", "shirt", "laptop", "home", "gamepad", "book", "car", "gift", "heart", "star"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search categories..." className="pl-10" data-testid="input-search-categories" />
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-category">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new product category.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="e.g. Electronics"
                  data-testid="input-category-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. electronics"
                  data-testid="input-category-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-9 p-1 cursor-pointer"
                    data-testid="input-category-color"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#8b5cf6"
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger data-testid="select-category-icon">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={createMutation.isPending} data-testid="button-save-category">
                {createMutation.isPending ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : (categories || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No categories found. Create your first category.
                  </TableCell>
                </TableRow>
              ) : (
                (categories || []).map((category: any) => (
                  <TableRow key={category.id} data-testid={`row-category-${category.id}`}>
                    <TableCell>
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: category.color }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">/{category.slug}</TableCell>
                    <TableCell>{category.icon}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(category)}
                          data-testid={`button-edit-category-${category.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(category.id)}
                          data-testid={`button-delete-category-${category.id}`}
                        >
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

      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-edit-category-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                data-testid="input-edit-category-slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="edit-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-9 p-1 cursor-pointer"
                  data-testid="input-edit-category-color"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                <SelectTrigger data-testid="select-edit-category-icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending} data-testid="button-update-category">
              {updateMutation.isPending ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete-category"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrdersSection() {
  const { toast } = useToast();
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [statusOrder, setStatusOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data } = useQuery({
    queryKey: ["/api/admin/orders"],
  });
  const orders = data as any[] | undefined;
  const isLoading = !orders;

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/orders/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Success", description: "Order status updated successfully" });
      setStatusOrder(null);
      setNewStatus("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleUpdateStatus = () => {
    if (statusOrder && newStatus) {
      updateStatusMutation.mutate({ id: statusOrder.id, status: newStatus });
    }
  };

  const openStatusDialog = (order: any) => {
    setStatusOrder(order);
    setNewStatus(order.status);
  };

  const filteredOrders = (orders || []).filter((order: any) => {
    const matchesSearch = !searchQuery || 
      order.id?.toString().includes(searchQuery) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "processing": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "shipped": return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "delivered": return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "cancelled": return "bg-red-500/10 text-red-600 dark:text-red-400";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-orders" 
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order: any) => (
                  <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customerName || "Customer"}</TableCell>
                    <TableCell>{order.items?.length || 0} items</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount || 0)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setViewingOrder(order)}
                          data-testid={`button-view-order-${order.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openStatusDialog(order)}
                          data-testid={`button-edit-order-${order.id}`}
                        >
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

      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details #{viewingOrder?.id}</DialogTitle>
            <DialogDescription>
              Order placed on {viewingOrder?.createdAt ? new Date(viewingOrder.createdAt).toLocaleDateString() : "-"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Customer</Label>
                <p className="font-medium">{viewingOrder?.customerName || "Customer"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge className={getStatusColor(viewingOrder?.status || "")}>
                  {viewingOrder?.status}
                </Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Shipping Address</Label>
                <p className="text-sm">{viewingOrder?.shippingAddress || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Payment Method</Label>
                <p className="text-sm">{viewingOrder?.paymentMethod || "Not specified"}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-muted-foreground mb-2 block">Order Items</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {viewingOrder?.items?.length > 0 ? (
                  viewingOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.productName || item.name || "Product"}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No items in this order</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount</span>
              <span className="text-xl font-bold">{formatCurrency(viewingOrder?.totalAmount || 0)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingOrder(null)}>Close</Button>
            <Button onClick={() => { setViewingOrder(null); openStatusDialog(viewingOrder); }}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!statusOrder} onOpenChange={(open) => !open && setStatusOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for Order #{statusOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Badge className={getStatusColor(statusOrder?.status || "")}>
                {statusOrder?.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger data-testid="select-new-order-status">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusOrder(null)}>Cancel</Button>
            <Button 
              onClick={handleUpdateStatus} 
              disabled={updateStatusMutation.isPending || !newStatus || newStatus === statusOrder?.status}
              data-testid="button-update-order-status"
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type UserFormData = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  department: string;
  status: string;
};

const defaultUserForm: UserFormData = {
  username: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  role: "customer",
  department: "",
  status: "active",
};

const userRoles = [
  { value: "customer", label: "Customer", description: "Basic shopping access" },
  { value: "affiliate", label: "Affiliate", description: "Referral & earnings access" },
  { value: "staff", label: "Staff", description: "Basic staff access" },
  { value: "cashier", label: "Cashier", description: "Point of sale & payments" },
  { value: "manager", label: "Manager", description: "Team & inventory management" },
  { value: "vendor", label: "Vendor", description: "Product & order management" },
  { value: "admin", label: "Admin", description: "Full system access" },
];

const userStatuses = [
  { value: "active", label: "Active", color: "bg-green-500" },
  { value: "inactive", label: "Inactive", color: "bg-gray-500" },
  { value: "suspended", label: "Suspended", color: "bg-red-500" },
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
];

const departments = [
  "Sales",
  "Marketing",
  "Operations",
  "Support",
  "Finance",
  "IT",
  "HR",
  "Warehouse",
];

function UsersSection() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState<UserFormData>(defaultUserForm);

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });
  const users = usersData as any[] | undefined;

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["/api/admin/roles"],
  });
  const roles = rolesData as any[] | undefined;

  const filteredUsers = (users || []).filter((user: any) => {
    const matchesSearch = !searchQuery || 
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      await apiRequest("POST", "/api/admin/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User created successfully" });
      setIsAddOpen(false);
      setFormData(defaultUserForm);
    },
    onError: (error: any) => {
      toast({ title: "Failed to create user", description: error.message, variant: "destructive" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User status updated" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleStatusToggle = (user: any) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    updateStatusMutation.mutate({ userId: user.id, status: newStatus });
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      password: "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      role: user.role || "customer",
      department: user.department || "",
      status: user.status || "active",
    });
  };

  const getUserDisplayName = (user: any) => {
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.name) return user.name;
    return user.username || "Unknown";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = userStatuses.find(s => s.value === status) || userStatuses[0];
    return (
      <Badge variant={status === "active" ? "default" : status === "suspended" ? "destructive" : "secondary"}>
        {statusConfig.label}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const isHighLevel = ["admin", "manager", "vendor"].includes(role);
    return (
      <Badge variant={isHighLevel ? "default" : "outline"}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 border-b">
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${activeTab === "users" ? "border-primary" : "border-transparent"}`}
          onClick={() => setActiveTab("users")}
          data-testid="tab-users"
        >
          <Users className="h-4 w-4 mr-2" />
          Users
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${activeTab === "roles" ? "border-primary" : "border-transparent"}`}
          onClick={() => setActiveTab("roles")}
          data-testid="tab-roles"
        >
          <Shield className="h-4 w-4 mr-2" />
          Roles & Permissions
        </Button>
      </div>

      {activeTab === "users" && (
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, or username..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-users" 
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-36" data-testid="select-filter-role">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {userRoles.map(role => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36" data-testid="select-filter-status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {userStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddOpen} onOpenChange={(open) => {
                setIsAddOpen(open);
                if (!open) setFormData(defaultUserForm);
              }}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-user">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>Add a new user with specific role and access permissions.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="First name"
                          data-testid="input-new-firstname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Last name"
                          data-testid="input-new-lastname"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Enter username"
                        data-testid="input-new-username"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter email"
                          data-testid="input-new-email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Phone number"
                          data-testid="input-new-phone"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter password"
                        data-testid="input-new-password"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                          <SelectTrigger data-testid="select-new-role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {userRoles.map(role => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                          <SelectTrigger data-testid="select-new-department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Initial Status</Label>
                      <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                        <SelectTrigger data-testid="select-new-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {userStatuses.map(status => (
                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-user">
                        {createMutation.isPending ? "Creating..." : "Create User"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchQuery || roleFilter !== "all" || statusFilter !== "all" 
                          ? "No users match your filters" 
                          : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user: any) => (
                      <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {getUserDisplayName(user).charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{getUserDisplayName(user)}</p>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{user.email}</p>
                            {user.phone && (
                              <p className="text-xs text-muted-foreground">{user.phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.department || "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status || "active")}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {user.lastLoginAt 
                            ? new Date(user.lastLoginAt).toLocaleDateString() 
                            : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openEditDialog(user)}
                              data-testid={`button-edit-user-${user.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleStatusToggle(user)}
                              disabled={updateStatusMutation.isPending}
                              data-testid={`button-toggle-status-${user.id}`}
                            >
                              {user.status === "active" ? (
                                <UserCheck className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                              )}
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

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredUsers.length} of {(users || []).length} users</span>
          </div>
        </>
      )}

      {activeTab === "roles" && <RolesManagement />}

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={formData.email} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map(role => (
                        <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={formData.department} onValueChange={(v) => setFormData({...formData, department: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button onClick={() => {
                  toast({ title: "User updated", description: "Changes saved successfully" });
                  setEditingUser(null);
                }}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RolesManagement() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    displayName: "",
    description: "",
    color: "#6B7280",
    level: 0,
    canManageUsers: false,
    canManageProducts: false,
    canManageOrders: false,
    canManageAffiliates: false,
    canManageCms: false,
    canManageSettings: false,
    canViewReports: false,
    canProcessPayments: false,
  });

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ["/api/admin/roles"],
  });
  const roles = rolesData as any[] | undefined;

  const createRoleMutation = useMutation({
    mutationFn: async (data: typeof newRole) => {
      await apiRequest("POST", "/api/admin/roles", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roles"] });
      toast({ title: "Role created successfully" });
      setIsAddOpen(false);
      setNewRole({
        name: "",
        displayName: "",
        description: "",
        color: "#6B7280",
        level: 0,
        canManageUsers: false,
        canManageProducts: false,
        canManageOrders: false,
        canManageAffiliates: false,
        canManageCms: false,
        canManageSettings: false,
        canViewReports: false,
        canProcessPayments: false,
      });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create role", description: error.message, variant: "destructive" });
    },
  });

  const permissions = [
    { key: "canManageUsers", label: "Manage Users", description: "Create, edit, delete users" },
    { key: "canManageProducts", label: "Manage Products", description: "Product catalog management" },
    { key: "canManageOrders", label: "Manage Orders", description: "Order processing & fulfillment" },
    { key: "canManageAffiliates", label: "Manage Affiliates", description: "Affiliate program management" },
    { key: "canManageCms", label: "Manage CMS", description: "Content & page management" },
    { key: "canManageSettings", label: "Manage Settings", description: "System configuration" },
    { key: "canViewReports", label: "View Reports", description: "Access analytics & reports" },
    { key: "canProcessPayments", label: "Process Payments", description: "Handle transactions" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Role Management</h3>
          <p className="text-sm text-muted-foreground">Define roles and their permissions</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-role">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>Define a new role with specific permissions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role Name *</Label>
                  <Input 
                    value={newRole.name} 
                    onChange={(e) => setNewRole({...newRole, name: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                    placeholder="e.g., store_manager"
                    data-testid="input-role-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Display Name *</Label>
                  <Input 
                    value={newRole.displayName} 
                    onChange={(e) => setNewRole({...newRole, displayName: e.target.value})}
                    placeholder="e.g., Store Manager"
                    data-testid="input-role-display"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={newRole.description} 
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  placeholder="Describe what this role can do..."
                  data-testid="input-role-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Color</Label>
                  <Input 
                    type="color"
                    value={newRole.color} 
                    onChange={(e) => setNewRole({...newRole, color: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Access Level (0-100)</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={newRole.level} 
                    onChange={(e) => setNewRole({...newRole, level: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="text-base font-medium">Permissions</Label>
                {permissions.map(perm => (
                  <div key={perm.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                    <Switch 
                      checked={(newRole as any)[perm.key]}
                      onCheckedChange={(checked) => setNewRole({...newRole, [perm.key]: checked})}
                      data-testid={`switch-${perm.key}`}
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button 
                  onClick={() => createRoleMutation.mutate(newRole)}
                  disabled={!newRole.name || !newRole.displayName || createRoleMutation.isPending}
                  data-testid="button-submit-role"
                >
                  {createRoleMutation.isPending ? "Creating..." : "Create Role"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading roles...
            </CardContent>
          </Card>
        ) : (roles || []).length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No custom roles defined. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          (roles || []).map((role: any) => (
            <Card key={role.id} data-testid={`card-role-${role.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: role.color || "#6B7280" }}
                    />
                    <CardTitle className="text-base">{role.displayName}</CardTitle>
                  </div>
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-xs">System</Badge>
                  )}
                </div>
                <CardDescription className="text-xs">{role.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {role.canManageUsers && <Badge variant="outline" className="text-xs">Users</Badge>}
                  {role.canManageProducts && <Badge variant="outline" className="text-xs">Products</Badge>}
                  {role.canManageOrders && <Badge variant="outline" className="text-xs">Orders</Badge>}
                  {role.canManageAffiliates && <Badge variant="outline" className="text-xs">Affiliates</Badge>}
                  {role.canManageCms && <Badge variant="outline" className="text-xs">CMS</Badge>}
                  {role.canManageSettings && <Badge variant="outline" className="text-xs">Settings</Badge>}
                  {role.canViewReports && <Badge variant="outline" className="text-xs">Reports</Badge>}
                  {role.canProcessPayments && <Badge variant="outline" className="text-xs">Payments</Badge>}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">Level: {role.level}</span>
                  {!role.isSystem && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

interface PageBlock {
  id: string;
  type: "hero" | "products" | "gallery" | "cta" | "text" | "features" | "testimonials" | "banner";
  settings: Record<string, any>;
}

const blockTypes = [
  { type: "hero", name: "Hero Section", icon: Layout, description: "Large header with image background", color: "text-purple-500", bg: "bg-purple-500/10" },
  { type: "products", name: "Products Grid", icon: Grid3X3, description: "Display products in a grid", color: "text-blue-500", bg: "bg-blue-500/10" },
  { type: "gallery", name: "Image Gallery", icon: ImagePlus, description: "Showcase multiple images", color: "text-green-500", bg: "bg-green-500/10" },
  { type: "cta", name: "Call to Action", icon: MousePointerClick, description: "Conversion-focused section", color: "text-orange-500", bg: "bg-orange-500/10" },
  { type: "text", name: "Text Content", icon: Type, description: "Rich text content block", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { type: "features", name: "Features List", icon: Sparkles, description: "Highlight key features", color: "text-pink-500", bg: "bg-pink-500/10" },
  { type: "testimonials", name: "Testimonials", icon: MessageSquareQuote, description: "Customer reviews section", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { type: "banner", name: "Promo Banner", icon: Megaphone, description: "Promotional announcement", color: "text-red-500", bg: "bg-red-500/10" },
];

function PagesSection() {
  const { data } = useQuery({
    queryKey: ["/api/admin/pages"],
  });
  const pages = data as any[] | undefined;
  const isLoading = !pages;
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>([]);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageStatus, setPageStatus] = useState<"draft" | "published">("draft");
  const [selectedBlockType, setSelectedBlockType] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const { toast } = useToast();

  const handleNewPage = () => {
    setEditingPage(null);
    setPageTitle("");
    setPageSlug("");
    setPageStatus("draft");
    setPageBlocks([]);
    setShowBuilder(true);
  };

  const handleEditPage = (page: any) => {
    setEditingPage(page);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageStatus(page.status);
    setPageBlocks(page.blocks || []);
    setShowBuilder(true);
  };

  const addBlock = (type: string) => {
    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      type: type as PageBlock["type"],
      settings: getDefaultBlockSettings(type),
    };
    setPageBlocks([...pageBlocks, newBlock]);
    setSelectedBlockType(null);
    toast({
      title: "Block Added",
      description: `${blockTypes.find(b => b.type === type)?.name} added to page.`,
    });
  };

  const getDefaultBlockSettings = (type: string): Record<string, any> => {
    switch (type) {
      case "hero":
        return { title: "Welcome to Our Store", subtitle: "Discover amazing products", buttonText: "Shop Now", buttonLink: "/shop", imageUrl: "", alignment: "center", overlay: true };
      case "products":
        return { title: "Featured Products", columns: 4, limit: 8, category: "", showPrice: true, showRating: true };
      case "gallery":
        return { title: "Gallery", columns: 3, images: [], spacing: "medium" };
      case "cta":
        return { title: "Ready to Get Started?", description: "Join thousands of satisfied customers", buttonText: "Sign Up Now", buttonLink: "/register", style: "gradient" };
      case "text":
        return { content: "", alignment: "left", maxWidth: "prose" };
      case "features":
        return { title: "Why Choose Us", columns: 3, features: [
          { icon: "Zap", title: "Fast Delivery", description: "Get your orders quickly" },
          { icon: "Shield", title: "Secure Payment", description: "100% secure checkout" },
          { icon: "Star", title: "Quality Products", description: "Premium quality guaranteed" },
        ]};
      case "testimonials":
        return { title: "What Our Customers Say", testimonials: [
          { name: "John D.", rating: 5, text: "Amazing products and service!", avatar: "" },
          { name: "Sarah M.", rating: 5, text: "Best shopping experience ever!", avatar: "" },
        ], style: "cards" };
      case "banner":
        return { text: "Special Offer!", backgroundColor: "#ef4444", textColor: "#ffffff", link: "", dismissible: false };
      default:
        return {};
    }
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...pageBlocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      setPageBlocks(newBlocks);
    }
  };

  const removeBlock = (index: number) => {
    setPageBlocks(pageBlocks.filter((_, i) => i !== index));
    toast({
      title: "Block Removed",
      description: "Block has been removed from the page.",
    });
  };

  const updateBlockSettings = (blockId: string, newSettings: Record<string, any>) => {
    setPageBlocks(pageBlocks.map(block => 
      block.id === blockId ? { ...block, settings: { ...block.settings, ...newSettings } } : block
    ));
  };

  const handleSavePage = () => {
    toast({
      title: "Page Saved",
      description: `"${pageTitle}" has been saved as ${pageStatus}.`,
    });
    setShowBuilder(false);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  if (showBuilder) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowBuilder(false)} data-testid="button-back-to-pages">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold">{editingPage ? "Edit Page" : "Create New Page"}</h2>
              <p className="text-sm text-muted-foreground">Visual page builder</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={pageStatus} onValueChange={(v) => setPageStatus(v as "draft" | "published")}>
              <SelectTrigger className="w-32" data-testid="select-page-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowBuilder(false)} data-testid="button-cancel-page">Cancel</Button>
            <Button onClick={handleSavePage} data-testid="button-save-page">
              Save Page
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Page Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Page Title</Label>
                    <Input 
                      value={pageTitle} 
                      onChange={(e) => {
                        setPageTitle(e.target.value);
                        if (!editingPage) setPageSlug(generateSlug(e.target.value));
                      }}
                      placeholder="Enter page title"
                      data-testid="input-page-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL Slug</Label>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-1">/</span>
                      <Input 
                        value={pageSlug}
                        onChange={(e) => setPageSlug(generateSlug(e.target.value))}
                        placeholder="page-url-slug"
                        data-testid="input-page-slug"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Page Blocks ({pageBlocks.length})
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" data-testid="button-add-block">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Block
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Content Block</DialogTitle>
                        <DialogDescription>Choose a block type to add to your page</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4">
                        {blockTypes.map((block) => (
                          <button
                            key={block.type}
                            onClick={() => addBlock(block.type)}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border hover-elevate text-center"
                            data-testid={`button-add-block-${block.type}`}
                          >
                            <div className={`p-3 rounded-lg ${block.bg}`}>
                              <block.icon className={`h-5 w-5 ${block.color}`} />
                            </div>
                            <span className="text-sm font-medium">{block.name}</span>
                            <span className="text-xs text-muted-foreground">{block.description}</span>
                          </button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {pageBlocks.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-2">No blocks added yet</p>
                    <p className="text-sm text-muted-foreground">Click "Add Block" to start building your page</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pageBlocks.map((block, index) => {
                      const blockType = blockTypes.find(b => b.type === block.type);
                      return (
                        <div 
                          key={block.id} 
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                          data-testid={`block-item-${block.id}`}
                        >
                          <div className="flex flex-col gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => moveBlock(index, "up")}
                              disabled={index === 0}
                              data-testid={`button-move-up-${block.id}`}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => moveBlock(index, "down")}
                              disabled={index === pageBlocks.length - 1}
                              data-testid={`button-move-down-${block.id}`}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className={`p-2 rounded-lg ${blockType?.bg}`}>
                            {blockType && <blockType.icon className={`h-4 w-4 ${blockType.color}`} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{blockType?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {block.settings.title || block.settings.text || "Configured"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setEditingBlock(block)}
                                  data-testid={`button-edit-block-${block.id}`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Edit {blockType?.name}</DialogTitle>
                                  <DialogDescription>Configure block settings</DialogDescription>
                                </DialogHeader>
                                <BlockSettingsEditor 
                                  block={block} 
                                  onUpdate={(settings) => updateBlockSettings(block.id, settings)} 
                                />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeBlock(index)}
                              data-testid={`button-remove-block-${block.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-background">
                  <div className="aspect-[9/16] max-h-[500px] overflow-y-auto">
                    <PagePreview blocks={pageBlocks} title={pageTitle} />
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-3" data-testid="button-full-preview">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Full Preview
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    setPageBlocks([
                      { id: "t1", type: "hero", settings: getDefaultBlockSettings("hero") },
                      { id: "t2", type: "features", settings: getDefaultBlockSettings("features") },
                      { id: "t3", type: "products", settings: { ...getDefaultBlockSettings("products"), title: "Best Sellers" } },
                      { id: "t4", type: "cta", settings: getDefaultBlockSettings("cta") },
                    ]);
                    toast({ title: "Template Applied", description: "Landing page template loaded." });
                  }}
                  data-testid="button-template-landing"
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Landing Page
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setPageBlocks([
                      { id: "t1", type: "text", settings: { ...getDefaultBlockSettings("text"), content: "# About Us\n\nWelcome to our company..." } },
                      { id: "t2", type: "features", settings: { ...getDefaultBlockSettings("features"), title: "Our Values" } },
                      { id: "t3", type: "testimonials", settings: getDefaultBlockSettings("testimonials") },
                    ]);
                    toast({ title: "Template Applied", description: "About page template loaded." });
                  }}
                  data-testid="button-template-about"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  About Page
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setPageBlocks([
                      { id: "t1", type: "hero", settings: { ...getDefaultBlockSettings("hero"), title: "Contact Us", subtitle: "Get in touch with our team" } },
                      { id: "t2", type: "text", settings: { ...getDefaultBlockSettings("text"), content: "## How to Reach Us\n\nFeel free to contact us..." } },
                    ]);
                    toast({ title: "Template Applied", description: "Contact page template loaded." });
                  }}
                  data-testid="button-template-contact"
                >
                  <MessageSquareQuote className="h-4 w-4 mr-2" />
                  Contact Page
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search pages..." className="pl-10" data-testid="input-search-pages" />
          </div>
        </div>
        <Button onClick={handleNewPage} data-testid="button-add-page">
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(pages || []).length}</div>
            <p className="text-xs text-muted-foreground">All created pages</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            <Globe className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(pages || []).filter((p: any) => p.status === "published").length}
            </div>
            <p className="text-xs text-muted-foreground">Live on your site</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {(pages || []).filter((p: any) => p.status === "draft").length}
            </div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Blocks</TableHead>
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
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p>No pages found. Create your first page.</p>
                      <Button size="sm" onClick={handleNewPage} className="mt-2" data-testid="button-create-first-page">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Page
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (pages || []).map((page: any) => (
                  <TableRow key={page.id} data-testid={`row-page-${page.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{page.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">/{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{page.blocks?.length || 0} blocks</Badge>
                    </TableCell>
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditPage(page)}
                          data-testid={`button-edit-page-${page.id}`}
                        >
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

function BlockSettingsEditor({ block, onUpdate }: { block: PageBlock; onUpdate: (settings: Record<string, any>) => void }) {
  const [settings, setSettings] = useState(block.settings);

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdate(newSettings);
  };

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              value={settings.title} 
              onChange={(e) => handleChange("title", e.target.value)} 
              data-testid="input-hero-title"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input 
              value={settings.subtitle} 
              onChange={(e) => handleChange("subtitle", e.target.value)}
              data-testid="input-hero-subtitle"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input 
                value={settings.buttonText} 
                onChange={(e) => handleChange("buttonText", e.target.value)}
                data-testid="input-hero-button-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input 
                value={settings.buttonLink} 
                onChange={(e) => handleChange("buttonLink", e.target.value)}
                data-testid="input-hero-button-link"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input 
              value={settings.imageUrl} 
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://..."
              data-testid="input-hero-image"
            />
          </div>
          <div className="space-y-2">
            <Label>Alignment</Label>
            <Select value={settings.alignment} onValueChange={(v) => handleChange("alignment", v)}>
              <SelectTrigger data-testid="select-hero-alignment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Dark Overlay</Label>
            <Switch 
              checked={settings.overlay} 
              onCheckedChange={(v) => handleChange("overlay", v)}
              data-testid="switch-hero-overlay"
            />
          </div>
        </div>
      );
    case "products":
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input 
              value={settings.title} 
              onChange={(e) => handleChange("title", e.target.value)}
              data-testid="input-products-title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Columns</Label>
              <Select value={String(settings.columns)} onValueChange={(v) => handleChange("columns", Number(v))}>
                <SelectTrigger data-testid="select-products-columns">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Limit</Label>
              <Select value={String(settings.limit)} onValueChange={(v) => handleChange("limit", Number(v))}>
                <SelectTrigger data-testid="select-products-limit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 Products</SelectItem>
                  <SelectItem value="8">8 Products</SelectItem>
                  <SelectItem value="12">12 Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Prices</Label>
            <Switch 
              checked={settings.showPrice} 
              onCheckedChange={(v) => handleChange("showPrice", v)}
              data-testid="switch-products-price"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Ratings</Label>
            <Switch 
              checked={settings.showRating} 
              onCheckedChange={(v) => handleChange("showRating", v)}
              data-testid="switch-products-rating"
            />
          </div>
        </div>
      );
    case "cta":
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              value={settings.title} 
              onChange={(e) => handleChange("title", e.target.value)}
              data-testid="input-cta-title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              value={settings.description} 
              onChange={(e) => handleChange("description", e.target.value)}
              data-testid="input-cta-description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input 
                value={settings.buttonText} 
                onChange={(e) => handleChange("buttonText", e.target.value)}
                data-testid="input-cta-button-text"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input 
                value={settings.buttonLink} 
                onChange={(e) => handleChange("buttonLink", e.target.value)}
                data-testid="input-cta-button-link"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Style</Label>
            <Select value={settings.style} onValueChange={(v) => handleChange("style", v)}>
              <SelectTrigger data-testid="select-cta-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="solid">Solid Color</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    case "text":
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Content (Markdown supported)</Label>
            <Textarea 
              value={settings.content} 
              onChange={(e) => handleChange("content", e.target.value)}
              className="min-h-[200px]"
              data-testid="input-text-content"
            />
          </div>
          <div className="space-y-2">
            <Label>Alignment</Label>
            <Select value={settings.alignment} onValueChange={(v) => handleChange("alignment", v)}>
              <SelectTrigger data-testid="select-text-alignment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    case "gallery":
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input 
              value={settings.title} 
              onChange={(e) => handleChange("title", e.target.value)}
              data-testid="input-gallery-title"
            />
          </div>
          <div className="space-y-2">
            <Label>Columns</Label>
            <Select value={String(settings.columns)} onValueChange={(v) => handleChange("columns", Number(v))}>
              <SelectTrigger data-testid="select-gallery-columns">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Spacing</Label>
            <Select value={settings.spacing} onValueChange={(v) => handleChange("spacing", v)}>
              <SelectTrigger data-testid="select-gallery-spacing">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Image URLs (one per line)</Label>
            <Textarea 
              value={(settings.images || []).join("\n")} 
              onChange={(e) => handleChange("images", e.target.value.split("\n").filter(Boolean))}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              className="min-h-[100px]"
              data-testid="input-gallery-images"
            />
          </div>
        </div>
      );
    case "features":
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input 
              value={settings.title} 
              onChange={(e) => handleChange("title", e.target.value)}
              data-testid="input-features-title"
            />
          </div>
          <div className="space-y-2">
            <Label>Columns</Label>
            <Select value={String(settings.columns)} onValueChange={(v) => handleChange("columns", Number(v))}>
              <SelectTrigger data-testid="select-features-columns">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label>Features (up to 6)</Label>
            {(settings.features || []).slice(0, 6).map((feature: any, idx: number) => (
              <div key={idx} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Feature {idx + 1}</span>
                </div>
                <Input 
                  value={feature.title} 
                  onChange={(e) => {
                    const newFeatures = [...(settings.features || [])];
                    newFeatures[idx] = { ...newFeatures[idx], title: e.target.value };
                    handleChange("features", newFeatures);
                  }}
                  placeholder="Feature title"
                  data-testid={`input-feature-title-${idx}`}
                />
                <Input 
                  value={feature.description} 
                  onChange={(e) => {
                    const newFeatures = [...(settings.features || [])];
                    newFeatures[idx] = { ...newFeatures[idx], description: e.target.value };
                    handleChange("features", newFeatures);
                  }}
                  placeholder="Feature description"
                  data-testid={`input-feature-desc-${idx}`}
                />
              </div>
            ))}
          </div>
        </div>
      );
    case "testimonials":
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input 
              value={settings.title} 
              onChange={(e) => handleChange("title", e.target.value)}
              data-testid="input-testimonials-title"
            />
          </div>
          <div className="space-y-2">
            <Label>Style</Label>
            <Select value={settings.style} onValueChange={(v) => handleChange("style", v)}>
              <SelectTrigger data-testid="select-testimonials-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cards">Cards</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label>Testimonials</Label>
            {(settings.testimonials || []).map((testimonial: any, idx: number) => (
              <div key={idx} className="p-3 border rounded-lg space-y-2">
                <Input 
                  value={testimonial.name} 
                  onChange={(e) => {
                    const newTestimonials = [...(settings.testimonials || [])];
                    newTestimonials[idx] = { ...newTestimonials[idx], name: e.target.value };
                    handleChange("testimonials", newTestimonials);
                  }}
                  placeholder="Customer name"
                  data-testid={`input-testimonial-name-${idx}`}
                />
                <Textarea 
                  value={testimonial.text} 
                  onChange={(e) => {
                    const newTestimonials = [...(settings.testimonials || [])];
                    newTestimonials[idx] = { ...newTestimonials[idx], text: e.target.value };
                    handleChange("testimonials", newTestimonials);
                  }}
                  placeholder="Testimonial text"
                  data-testid={`input-testimonial-text-${idx}`}
                />
              </div>
            ))}
          </div>
        </div>
      );
    case "banner":
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Banner Text</Label>
            <Input 
              value={settings.text} 
              onChange={(e) => handleChange("text", e.target.value)}
              data-testid="input-banner-text"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="color"
                  value={settings.backgroundColor} 
                  onChange={(e) => handleChange("backgroundColor", e.target.value)}
                  className="w-12 h-9 p-1"
                  data-testid="input-banner-bg-color"
                />
                <Input 
                  value={settings.backgroundColor} 
                  onChange={(e) => handleChange("backgroundColor", e.target.value)}
                  placeholder="#ef4444"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="color"
                  value={settings.textColor} 
                  onChange={(e) => handleChange("textColor", e.target.value)}
                  className="w-12 h-9 p-1"
                  data-testid="input-banner-text-color"
                />
                <Input 
                  value={settings.textColor} 
                  onChange={(e) => handleChange("textColor", e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Link (optional)</Label>
            <Input 
              value={settings.link} 
              onChange={(e) => handleChange("link", e.target.value)}
              placeholder="https://..."
              data-testid="input-banner-link"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Dismissible</Label>
            <Switch 
              checked={settings.dismissible} 
              onCheckedChange={(v) => handleChange("dismissible", v)}
              data-testid="switch-banner-dismissible"
            />
          </div>
        </div>
      );
    default:
      return (
        <div className="py-4 text-center text-muted-foreground">
          <p>Settings for {block.type} block</p>
          <p className="text-sm">Additional configuration options available</p>
        </div>
      );
  }
}

function PagePreview({ blocks, title }: { blocks: PageBlock[]; title: string }) {
  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground p-4 text-center">
        <div>
          <Layout className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Add blocks to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs">
      {blocks.map((block) => (
        <div key={block.id} className="border-b last:border-b-0">
          {block.type === "hero" && (
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-4 text-center">
              <h3 className="font-bold text-sm">{block.settings.title}</h3>
              <p className="text-xs opacity-80">{block.settings.subtitle}</p>
              <div className="mt-2 bg-white text-purple-600 px-2 py-1 rounded text-xs inline-block">
                {block.settings.buttonText}
              </div>
            </div>
          )}
          {block.type === "products" && (
            <div className="p-3">
              <p className="font-semibold text-center mb-2">{block.settings.title}</p>
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-muted rounded p-2 text-center">
                    <div className="bg-muted-foreground/20 h-8 rounded mb-1" />
                    <div className="h-2 bg-muted-foreground/20 rounded w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {block.type === "cta" && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 text-center">
              <p className="font-bold">{block.settings.title}</p>
              <p className="text-xs opacity-80">{block.settings.description}</p>
              <div className="mt-2 bg-white text-orange-600 px-2 py-1 rounded text-xs inline-block">
                {block.settings.buttonText}
              </div>
            </div>
          )}
          {block.type === "features" && (
            <div className="p-3">
              <p className="font-semibold text-center mb-2">{block.settings.title}</p>
              <div className="grid grid-cols-3 gap-1">
                {(block.settings.features || []).slice(0, 3).map((f: any, i: number) => (
                  <div key={i} className="text-center p-1">
                    <Zap className="h-3 w-3 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-medium truncate">{f.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {block.type === "testimonials" && (
            <div className="p-3 bg-muted/50">
              <p className="font-semibold text-center mb-2">{block.settings.title}</p>
              <div className="flex gap-1">
                {(block.settings.testimonials || []).slice(0, 2).map((t: any, i: number) => (
                  <div key={i} className="flex-1 bg-card p-2 rounded">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-2 w-2 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs">{t.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {block.type === "text" && (
            <div className="p-3">
              <p className="text-xs whitespace-pre-wrap">{block.settings.content?.slice(0, 100)}...</p>
            </div>
          )}
          {block.type === "gallery" && (
            <div className="p-3">
              <p className="font-semibold text-center mb-2">{block.settings.title}</p>
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-muted aspect-square rounded" />
                ))}
              </div>
            </div>
          )}
          {block.type === "banner" && (
            <div 
              className="p-2 text-center text-xs"
              style={{ backgroundColor: block.settings.backgroundColor, color: block.settings.textColor }}
            >
              {block.settings.text}
            </div>
          )}
        </div>
      ))}
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

interface AffiliateTier {
  id: string;
  name: string;
  minEarnings: string;
  commissionRate: string;
  bonusPercentage: string | null;
  benefits: string | null;
  color: string | null;
  sortOrder: number | null;
  createdAt: string;
}

const tierFormSchema = insertAffiliateTierSchema.extend({
  name: z.string().min(1, "Tier name is required"),
  commissionRate: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Commission rate must be between 0 and 100"),
  minEarnings: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Minimum earnings must be 0 or greater"),
  bonusPercentage: z.string().nullable().refine(val => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Bonus percentage must be between 0 and 100"),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

type TierFormValues = z.infer<typeof tierFormSchema>;

function AffiliatesSection() {
  const { toast } = useToast();
  const [tierDialogOpen, setTierDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<AffiliateTier | null>(null);
  const [deleteTierConfirm, setDeleteTierConfirm] = useState<string | null>(null);

  const tierForm = useForm<TierFormValues>({
    resolver: zodResolver(tierFormSchema),
    defaultValues: {
      name: "",
      minEarnings: "0",
      commissionRate: "10",
      bonusPercentage: "0",
      benefits: "",
      color: "#6B7280",
      sortOrder: 0,
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/affiliates"],
  });
  const affiliates = data as AffiliateWithUser[] | undefined;

  const { data: tiersData, isLoading: tiersLoading } = useQuery({
    queryKey: ["/api/admin/affiliate-tiers"],
  });
  const tiers = tiersData as AffiliateTier[] | undefined;

  const resetTierForm = () => {
    tierForm.reset({
      name: "",
      minEarnings: "0",
      commissionRate: "10",
      bonusPercentage: "0",
      benefits: "",
      color: "#6B7280",
      sortOrder: 0,
    });
    setEditingTier(null);
  };

  const createTierMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      minEarnings: string;
      commissionRate: string;
      bonusPercentage: string;
      benefits: string | null;
      color: string;
      sortOrder: number;
    }) => {
      await apiRequest("POST", "/api/admin/affiliate-tiers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/affiliate-tiers"] });
      setTierDialogOpen(false);
      resetTierForm();
      toast({ title: "Tier Created", description: "The affiliate tier has been created successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create tier", variant: "destructive" });
    },
  });

  const updateTierMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: {
      name: string;
      minEarnings: string;
      commissionRate: string;
      bonusPercentage: string;
      benefits: string | null;
      color: string;
      sortOrder: number;
    }}) => {
      await apiRequest("PATCH", `/api/admin/affiliate-tiers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/affiliate-tiers"] });
      setTierDialogOpen(false);
      resetTierForm();
      toast({ title: "Tier Updated", description: "The affiliate tier has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update tier", variant: "destructive" });
    },
  });

  const deleteTierMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/affiliate-tiers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/affiliate-tiers"] });
      setDeleteTierConfirm(null);
      toast({ title: "Tier Deleted", description: "The affiliate tier has been deleted." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete tier", variant: "destructive" });
    },
  });

  const onTierSubmit = (values: TierFormValues) => {
    const payload = {
      name: values.name.trim(),
      minEarnings: parseFloat(values.minEarnings || "0").toFixed(2),
      commissionRate: parseFloat(values.commissionRate).toFixed(2),
      bonusPercentage: parseFloat(values.bonusPercentage || "0").toFixed(2),
      benefits: values.benefits?.trim() || null,
      color: values.color || "#6B7280",
      sortOrder: values.sortOrder || 0,
    };
    
    if (editingTier) {
      updateTierMutation.mutate({ id: editingTier.id, data: payload });
    } else {
      createTierMutation.mutate(payload);
    }
  };

  const openEditTier = (tier: AffiliateTier) => {
    setEditingTier(tier);
    tierForm.reset({
      name: tier.name,
      minEarnings: tier.minEarnings,
      commissionRate: tier.commissionRate,
      bonusPercentage: tier.bonusPercentage || "0",
      benefits: tier.benefits || "",
      color: tier.color || "#6B7280",
      sortOrder: tier.sortOrder || 0,
    });
    setTierDialogOpen(true);
  };

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

  // Analytics data derived from affiliates
  const totalClicks = affiliates?.reduce((sum, a) => sum + a.totalClicks, 0) || 0;
  const totalConversions = affiliates?.reduce((sum, a) => sum + a.totalConversions, 0) || 0;
  const totalEarnings = affiliates?.reduce((sum, a) => sum + parseFloat(a.totalEarnings), 0) || 0;
  const avgConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0.00";
  const avgEarningsPerAffiliate = approvedAffiliates.length > 0 
    ? (totalEarnings / approvedAffiliates.length).toFixed(2) 
    : "0.00";

  // Mock monthly performance data for charts
  const monthlyPerformance = [
    { month: "Jan", clicks: 1200, conversions: 48, earnings: 2400 },
    { month: "Feb", clicks: 1450, conversions: 58, earnings: 2900 },
    { month: "Mar", clicks: 1680, conversions: 72, earnings: 3600 },
    { month: "Apr", clicks: 2100, conversions: 84, earnings: 4200 },
    { month: "May", clicks: 2350, conversions: 94, earnings: 4700 },
    { month: "Jun", clicks: 2800, conversions: 112, earnings: 5600 },
  ];

  // Top performers from actual data
  const topPerformers = [...(affiliates || [])]
    .filter(a => a.status === "approved")
    .sort((a, b) => parseFloat(b.totalEarnings) - parseFloat(a.totalEarnings))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Target className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-clicks">{totalClicks.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              +18.2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-total-conversions">{totalConversions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10">
              <DollarSign className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600" data-testid="text-affiliate-earnings">${totalEarnings.toFixed(2)}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              +24.8% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Percent className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600" data-testid="text-conversion-rate">{avgConversionRate}%</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              +0.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Earnings</CardTitle>
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <CreditCard className="h-4 w-4 text-cyan-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600" data-testid="text-avg-earnings">${avgEarningsPerAffiliate}</div>
            <div className="text-xs text-muted-foreground mt-1">Per approved affiliate</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Clicks & Conversions Trend
            </CardTitle>
            <CardDescription>Monthly affiliate performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="clicks" fill="#3b82f6" name="Clicks" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill="#10b981" name="Conversions" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Earnings Over Time
            </CardTitle>
            <CardDescription>Monthly commission payouts trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyPerformance}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value}`, 'Earnings']}
                />
                <Area type="monotone" dataKey="earnings" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Performing Affiliates
            </CardTitle>
            <CardDescription>Highest earning affiliates this period</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Conv. Rate</TableHead>
                  <TableHead>Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((affiliate, index) => {
                  const convRate = affiliate.totalClicks > 0 
                    ? ((affiliate.totalConversions / affiliate.totalClicks) * 100).toFixed(1) 
                    : "0.0";
                  return (
                    <TableRow key={affiliate.id} data-testid={`row-top-affiliate-${affiliate.id}`}>
                      <TableCell>
                        <Badge 
                          variant={index === 0 ? "default" : "secondary"}
                          className={index === 0 ? "bg-yellow-500 text-yellow-950" : ""}
                        >
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{affiliate.user?.username || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{affiliate.code}</Badge>
                      </TableCell>
                      <TableCell>{affiliate.totalClicks.toLocaleString()}</TableCell>
                      <TableCell>{affiliate.totalConversions.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-green-600">
                          {convRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${parseFloat(affiliate.totalEarnings).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Affiliate Tiers
            </CardTitle>
            <CardDescription>Manage commission tiers and rewards</CardDescription>
          </div>
          <Dialog open={tierDialogOpen} onOpenChange={(open) => {
            setTierDialogOpen(open);
            if (!open) resetTierForm();
          }}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-add-tier">
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTier ? "Edit Tier" : "Create New Tier"}</DialogTitle>
                <DialogDescription>
                  {editingTier ? "Update the tier details" : "Set up a new affiliate commission tier"}
                </DialogDescription>
              </DialogHeader>
              <Form {...tierForm}>
                <form onSubmit={tierForm.handleSubmit(onTierSubmit)} className="space-y-4">
                  <FormField
                    control={tierForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tier Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Bronze, Silver, Gold"
                            {...field}
                            data-testid="input-tier-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={tierForm.control}
                      name="commissionRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Commission Rate (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              {...field}
                              data-testid="input-tier-commission"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tierForm.control}
                      name="bonusPercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bonus (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              {...field}
                              value={field.value || "0"}
                              data-testid="input-tier-bonus"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={tierForm.control}
                    name="minEarnings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min. Earnings to Qualify ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="10"
                            {...field}
                            data-testid="input-tier-min-earnings"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={tierForm.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={field.value || "#6B7280"}
                                onChange={field.onChange}
                                className="w-12 h-9 p-1 cursor-pointer"
                                data-testid="input-tier-color"
                              />
                              <Input
                                value={field.value || "#6B7280"}
                                onChange={field.onChange}
                                className="flex-1"
                                placeholder="#6B7280"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tierForm.control}
                      name="sortOrder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sort Order</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-tier-sort-order"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={tierForm.control}
                    name="benefits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Benefits (one per line)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Priority support&#10;Exclusive promotions&#10;Higher payouts"
                            {...field}
                            value={field.value || ""}
                            rows={3}
                            data-testid="input-tier-benefits"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => { setTierDialogOpen(false); resetTierForm(); }}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createTierMutation.isPending || updateTierMutation.isPending}
                      data-testid="button-save-tier"
                    >
                      {editingTier ? "Update Tier" : "Create Tier"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {tiersLoading ? (
            <div className="text-center py-8">Loading tiers...</div>
          ) : (tiers || []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No affiliate tiers configured yet. Create your first tier to set up commission levels.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {(tiers || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)).map((tier) => (
                <Card key={tier.id} className="relative overflow-visible" data-testid={`card-tier-${tier.id}`}>
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-md"
                    style={{ backgroundColor: tier.color || "#6B7280" }}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tier.color || "#6B7280" }}
                        />
                        {tier.name}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditTier(tier)}
                          data-testid={`button-edit-tier-${tier.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog open={deleteTierConfirm === tier.id} onOpenChange={(open) => !open && setDeleteTierConfirm(null)}>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeleteTierConfirm(tier.id)}
                              data-testid={`button-delete-tier-${tier.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Tier</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the "{tier.name}" tier? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteTierConfirm(null)}>Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteTierMutation.mutate(tier.id)}
                                disabled={deleteTierMutation.isPending}
                                data-testid={`button-confirm-delete-tier-${tier.id}`}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Commission</span>
                      <Badge variant="secondary" className="font-semibold">
                        <Percent className="h-3 w-3 mr-1" />
                        {tier.commissionRate}%
                      </Badge>
                    </div>
                    {parseFloat(tier.bonusPercentage || "0") > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bonus</span>
                        <Badge variant="outline" className="text-green-600">
                          +{tier.bonusPercentage}%
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Min. Earnings</span>
                      <span className="text-sm font-medium">${tier.minEarnings}</span>
                    </div>
                    {tier.benefits && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Benefits:</p>
                        <ul className="text-xs space-y-1">
                          {tier.benefits.split("\n").filter(Boolean).slice(0, 3).map((benefit, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <ChevronRight className="h-3 w-3 text-primary" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout Management Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payout Management
            </CardTitle>
            <CardDescription>Process affiliate commission payouts</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600">
              ${totalEarnings.toFixed(2)} Total Commissions
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payout Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-lg font-bold text-yellow-600">$1,250.00</p>
                <p className="text-xs text-muted-foreground">Pending Payouts</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-lg font-bold text-blue-600">$850.00</p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-lg font-bold text-green-600">$15,420.00</p>
                <p className="text-xs text-muted-foreground">Paid Out (Total)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-lg font-bold text-purple-600">$50.00</p>
                <p className="text-xs text-muted-foreground">Min. Payout Threshold</p>
              </div>
            </div>
          </div>

          {/* Payout Requests Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedAffiliates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No payout requests at this time
                    </TableCell>
                  </TableRow>
                ) : (
                  approvedAffiliates.slice(0, 5).map((affiliate, index) => {
                    const payoutAmount = parseFloat(affiliate.totalEarnings) * 0.8;
                    const statuses = ["pending", "processing", "completed", "completed", "pending"];
                    const methods = ["PayPal", "Bank Transfer", "PayPal", "Stripe", "Bank Transfer"];
                    const status = statuses[index % 5];
                    return payoutAmount >= 50 ? (
                      <TableRow key={affiliate.id} data-testid={`row-payout-${affiliate.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{affiliate.user?.username?.charAt(0) || "A"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{affiliate.user?.username || "Unknown"}</p>
                              <p className="text-xs text-muted-foreground">{affiliate.code}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">${payoutAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{methods[index % 5]}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(Date.now() - index * 86400000 * 3).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {status === "pending" && (
                            <Badge className="bg-yellow-500/10 text-yellow-600">Pending</Badge>
                          )}
                          {status === "processing" && (
                            <Badge className="bg-blue-500/10 text-blue-600">Processing</Badge>
                          )}
                          {status === "completed" && (
                            <Badge className="bg-green-500/10 text-green-600">Completed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {status === "pending" && (
                              <>
                                <Button size="sm" variant="default" data-testid={`button-approve-payout-${affiliate.id}`}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" data-testid={`button-reject-payout-${affiliate.id}`}>
                                  Reject
                                </Button>
                              </>
                            )}
                            {status === "processing" && (
                              <Button size="sm" variant="outline" data-testid={`button-complete-payout-${affiliate.id}`}>
                                Mark Complete
                              </Button>
                            )}
                            {status === "completed" && (
                              <Button size="sm" variant="ghost" data-testid={`button-view-payout-${affiliate.id}`}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null;
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Payout History */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Payout History
              </h4>
              <Button variant="outline" size="sm" data-testid="button-export-payouts">
                Export CSV
              </Button>
            </div>
            <div className="space-y-2">
              {[
                { affiliate: "john_doe", amount: 250.00, date: "Dec 10, 2025", method: "PayPal", status: "completed" },
                { affiliate: "jane_smith", amount: 180.50, date: "Dec 8, 2025", method: "Bank Transfer", status: "completed" },
                { affiliate: "mike_wilson", amount: 320.00, date: "Dec 5, 2025", method: "Stripe", status: "completed" },
                { affiliate: "sarah_johnson", amount: 95.75, date: "Dec 2, 2025", method: "PayPal", status: "completed" },
              ].map((payout, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  data-testid={`row-payout-history-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                      <UserCheck className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{payout.affiliate}</p>
                      <p className="text-xs text-muted-foreground">{payout.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">${payout.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{payout.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Tools Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Marketing Tools
          </CardTitle>
          <CardDescription>Banners, links, and promotional materials for affiliates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Links Generator */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              Affiliate Link Generator
            </h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="text-sm font-medium mb-2">Homepage Link</p>
                <div className="flex items-center gap-2">
                  <Input 
                    value="https://horeq.com/?ref=AFFILIATE_CODE" 
                    readOnly 
                    className="text-xs bg-background"
                    data-testid="input-homepage-link"
                  />
                  <Button size="icon" variant="outline" data-testid="button-copy-homepage-link">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="text-sm font-medium mb-2">Products Page Link</p>
                <div className="flex items-center gap-2">
                  <Input 
                    value="https://horeq.com/products?ref=AFFILIATE_CODE" 
                    readOnly 
                    className="text-xs bg-background"
                    data-testid="input-products-link"
                  />
                  <Button size="icon" variant="outline" data-testid="button-copy-products-link">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <p className="text-sm font-medium mb-2">Special Offers Link</p>
                <div className="flex items-center gap-2">
                  <Input 
                    value="https://horeq.com/deals?ref=AFFILIATE_CODE" 
                    readOnly 
                    className="text-xs bg-background"
                    data-testid="input-deals-link"
                  />
                  <Button size="icon" variant="outline" data-testid="button-copy-deals-link">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Banner Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <FileImage className="h-4 w-4 text-primary" />
                Promotional Banners
              </h4>
              <Button variant="outline" size="sm" data-testid="button-upload-banner">
                <Plus className="h-4 w-4 mr-2" />
                Upload Banner
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { id: 1, name: "Summer Sale Banner", size: "728x90", downloads: 156 },
                { id: 2, name: "Holiday Promo", size: "300x250", downloads: 89 },
                { id: 3, name: "New Arrivals", size: "160x600", downloads: 234 },
                { id: 4, name: "Flash Sale", size: "970x250", downloads: 67 },
                { id: 5, name: "Best Sellers", size: "320x50", downloads: 312 },
                { id: 6, name: "Free Shipping", size: "468x60", downloads: 145 },
              ].map((banner) => (
                <div 
                  key={banner.id} 
                  className="p-4 rounded-lg border bg-muted/30"
                  data-testid={`card-banner-${banner.id}`}
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-md mb-3 flex items-center justify-center">
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">{banner.name}</p>
                      <Badge variant="secondary" className="text-xs">{banner.size}</Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">{banner.downloads} downloads</span>
                      <div className="flex items-center gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost"
                          data-testid={`button-download-banner-${banner.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          data-testid={`button-copy-banner-code-${banner.id}`}
                        >
                          <Code className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Embed Codes */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              Embed Codes
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-medium">Text Link HTML</p>
                  <Button size="sm" variant="outline" data-testid="button-copy-text-embed">
                    <Copy className="h-3 w-3 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-background rounded-md p-3 font-mono text-xs overflow-x-auto">
                  <code className="text-muted-foreground">
                    {'<a href="https://horeq.com/?ref=CODE">Shop Now at HOREQ</a>'}
                  </code>
                </div>
              </div>
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-medium">Banner HTML</p>
                  <Button size="sm" variant="outline" data-testid="button-copy-banner-embed">
                    <Copy className="h-3 w-3 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-background rounded-md p-3 font-mono text-xs overflow-x-auto">
                  <code className="text-muted-foreground">
                    {'<a href="https://horeq.com/?ref=CODE"><img src="banner.jpg" /></a>'}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Promo Materials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                Promotional Materials
              </h4>
              <Button variant="outline" size="sm" data-testid="button-download-all-materials">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Brand Guidelines", type: "PDF", size: "2.4 MB", icon: FileText },
                { name: "Logo Pack", type: "ZIP", size: "8.1 MB", icon: FileImage },
                { name: "Product Images", type: "ZIP", size: "45.2 MB", icon: Image },
                { name: "Social Media Kit", type: "ZIP", size: "12.8 MB", icon: Globe },
              ].map((material, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover-elevate cursor-pointer"
                  data-testid={`card-material-${index}`}
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <material.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{material.name}</p>
                    <p className="text-xs text-muted-foreground">{material.type} - {material.size}</p>
                  </div>
                  <Button size="icon" variant="ghost" data-testid={`button-download-material-${index}`}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="pt-4 border-t">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-3 rounded-lg bg-blue-500/10">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-xs text-muted-foreground">Active Banners</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-500/10">
                <p className="text-2xl font-bold text-green-600">1,847</p>
                <p className="text-xs text-muted-foreground">Total Downloads</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-500/10">
                <p className="text-2xl font-bold text-purple-600">24</p>
                <p className="text-xs text-muted-foreground">Link Templates</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-500/10">
                <p className="text-2xl font-bold text-orange-600">8</p>
                <p className="text-xs text-muted-foreground">Promo Materials</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Affiliate Status Summary
          </CardTitle>
          <CardDescription>Overview of affiliate program membership</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-affiliates">{affiliates?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Affiliates</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="p-3 rounded-lg bg-green-500/10">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600" data-testid="text-approved-affiliates">{approvedAffiliates.length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600" data-testid="text-pending-affiliates">{pendingAffiliates.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="p-3 rounded-lg bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600" data-testid="text-rejected-affiliates">{rejectedAffiliates.length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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

function CombosSection() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    productIds: [] as string[],
    price: "",
    originalPrice: "",
    savings: "",
    isActive: true,
    sortOrder: 0,
  });

  const { data } = useQuery({
    queryKey: ["/api/combos"],
  });
  const combos = data as any[] | undefined;
  const isLoading = !combos;

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/admin/combos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/combos"] });
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Combo Created", description: "The combo deal has been created successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create combo", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      await apiRequest("PATCH", `/api/admin/combos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/combos"] });
      setEditingCombo(null);
      toast({ title: "Combo Updated", description: "The combo deal has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update combo", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/combos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/combos"] });
      setDeleteConfirm(null);
      toast({ title: "Combo Deleted", description: "The combo deal has been deleted." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete combo", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      productIds: [],
      price: "",
      originalPrice: "",
      savings: "",
      isActive: true,
      sortOrder: 0,
    });
  };

  const handleAdd = () => {
    if (!formData.name || !formData.slug || !formData.image || !formData.price || !formData.originalPrice) {
      toast({ title: "Validation Error", description: "Name, slug, image, price, and original price are required", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = () => {
    if (!editingCombo) return;
    updateMutation.mutate({ id: editingCombo.id, data: formData });
  };

  const openEditDialog = (combo: any) => {
    setFormData({
      name: combo.name,
      slug: combo.slug,
      description: combo.description || "",
      image: combo.image,
      productIds: combo.productIds || [],
      price: combo.price,
      originalPrice: combo.originalPrice,
      savings: combo.savings,
      isActive: combo.isActive,
      sortOrder: combo.sortOrder || 0,
    });
    setEditingCombo(combo);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search combos..." className="pl-10" data-testid="input-search-combos" />
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-combo">
              <Plus className="h-4 w-4 mr-2" />
              Add Combo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Combo Deal</DialogTitle>
              <DialogDescription>Create a new product combo with special pricing.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 py-4 pr-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                    placeholder="e.g. Summer Bundle"
                    data-testid="input-combo-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. summer-bundle"
                    data-testid="input-combo-slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this combo..."
                    data-testid="input-combo-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    data-testid="input-combo-image"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => {
                        const orig = parseFloat(e.target.value) || 0;
                        const price = parseFloat(formData.price) || 0;
                        setFormData({ ...formData, originalPrice: e.target.value, savings: (orig - price).toFixed(2) });
                      }}
                      placeholder="99.99"
                      data-testid="input-combo-original-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Sale Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => {
                        const price = parseFloat(e.target.value) || 0;
                        const orig = parseFloat(formData.originalPrice) || 0;
                        setFormData({ ...formData, price: e.target.value, savings: (orig - price).toFixed(2) });
                      }}
                      placeholder="79.99"
                      data-testid="input-combo-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="savings">Savings</Label>
                    <Input
                      id="savings"
                      value={formData.savings}
                      onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                      placeholder="20.00"
                      data-testid="input-combo-savings"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    data-testid="switch-combo-active"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={createMutation.isPending} data-testid="button-save-combo">
                {createMutation.isPending ? "Creating..." : "Create Combo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading combos...
                  </TableCell>
                </TableRow>
              ) : (combos || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No combo deals found. Create your first combo.
                  </TableCell>
                </TableRow>
              ) : (
                (combos || []).map((combo: any) => (
                  <TableRow key={combo.id} data-testid={`row-combo-${combo.id}`}>
                    <TableCell>
                      <img src={combo.image} alt={combo.name} className="w-12 h-12 object-cover rounded-md" />
                    </TableCell>
                    <TableCell className="font-medium">{combo.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">${combo.price}</span>
                        <span className="text-xs text-muted-foreground line-through">${combo.originalPrice}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">${combo.savings} off</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={combo.isActive ? "default" : "outline"}>
                        {combo.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(combo)}
                          data-testid={`button-edit-combo-${combo.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(combo.id)}
                          data-testid={`button-delete-combo-${combo.id}`}
                        >
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

      <Dialog open={!!editingCombo} onOpenChange={(open) => !open && setEditingCombo(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Combo Deal</DialogTitle>
            <DialogDescription>Update combo details.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-edit-combo-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  data-testid="input-edit-combo-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  data-testid="input-edit-combo-description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  data-testid="input-edit-combo-image"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-originalPrice">Original Price</Label>
                  <Input
                    id="edit-originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => {
                      const orig = parseFloat(e.target.value) || 0;
                      const price = parseFloat(formData.price) || 0;
                      setFormData({ ...formData, originalPrice: e.target.value, savings: (orig - price).toFixed(2) });
                    }}
                    data-testid="input-edit-combo-original-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Sale Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      const orig = parseFloat(formData.originalPrice) || 0;
                      setFormData({ ...formData, price: e.target.value, savings: (orig - price).toFixed(2) });
                    }}
                    data-testid="input-edit-combo-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-savings">Savings</Label>
                  <Input
                    id="edit-savings"
                    value={formData.savings}
                    onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                    data-testid="input-edit-combo-savings"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-edit-combo-active"
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCombo(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending} data-testid="button-update-combo">
              {updateMutation.isPending ? "Updating..." : "Update Combo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Combo</DialogTitle>
            <DialogDescription>Are you sure you want to delete this combo deal? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-combo">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BannersSection() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    buttonText: "",
    position: "hero",
    isActive: true,
    sortOrder: 0,
  });

  const { data } = useQuery({
    queryKey: ["/api/banners"],
  });
  const banners = data as any[] | undefined;
  const isLoading = !banners;

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/admin/banners", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      setIsAddOpen(false);
      resetForm();
      toast({ title: "Banner Created", description: "The banner has been created successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create banner", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      await apiRequest("PATCH", `/api/admin/banners/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      setEditingBanner(null);
      toast({ title: "Banner Updated", description: "The banner has been updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update banner", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      setDeleteConfirm(null);
      toast({ title: "Banner Deleted", description: "The banner has been deleted." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete banner", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      link: "",
      buttonText: "",
      position: "hero",
      isActive: true,
      sortOrder: 0,
    });
  };

  const handleAdd = () => {
    if (!formData.title || !formData.image) {
      toast({ title: "Validation Error", description: "Title and image are required", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = () => {
    if (!editingBanner) return;
    updateMutation.mutate({ id: editingBanner.id, data: formData });
  };

  const openEditDialog = (banner: any) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image: banner.image,
      link: banner.link || "",
      buttonText: banner.buttonText || "",
      position: banner.position || "hero",
      isActive: banner.isActive,
      sortOrder: banner.sortOrder || 0,
    });
    setEditingBanner(banner);
  };

  const positionOptions = ["hero", "sidebar", "footer", "promotional"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search banners..." className="pl-10" data-testid="input-search-banners" />
          </div>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-banner">
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>Create a new banner for your homepage.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 py-4 pr-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Holiday Sale"
                    data-testid="input-banner-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Up to 50% off"
                    data-testid="input-banner-subtitle"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    data-testid="input-banner-image"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Link URL</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/products or https://..."
                    data-testid="input-banner-link"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="e.g. Shop Now"
                    data-testid="input-banner-button-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                    <SelectTrigger data-testid="select-banner-position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map((pos) => (
                        <SelectItem key={pos} value={pos}>{pos.charAt(0).toUpperCase() + pos.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    data-testid="switch-banner-active"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={createMutation.isPending} data-testid="button-save-banner">
                {createMutation.isPending ? "Creating..." : "Create Banner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading banners...
                  </TableCell>
                </TableRow>
              ) : (banners || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No banners found. Create your first banner.
                  </TableCell>
                </TableRow>
              ) : (
                (banners || []).map((banner: any) => (
                  <TableRow key={banner.id} data-testid={`row-banner-${banner.id}`}>
                    <TableCell>
                      <img src={banner.image} alt={banner.title} className="w-20 h-12 object-cover rounded-md" />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{banner.title}</span>
                        {banner.subtitle && <span className="text-xs text-muted-foreground">{banner.subtitle}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{banner.position}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={banner.isActive ? "default" : "outline"}>
                        {banner.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(banner)}
                          data-testid={`button-edit-banner-${banner.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirm(banner.id)}
                          data-testid={`button-delete-banner-${banner.id}`}
                        >
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

      <Dialog open={!!editingBanner} onOpenChange={(open) => !open && setEditingBanner(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Update banner details.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-4 pr-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  data-testid="input-edit-banner-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-subtitle">Subtitle</Label>
                <Input
                  id="edit-subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  data-testid="input-edit-banner-subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  data-testid="input-edit-banner-image"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link">Link URL</Label>
                <Input
                  id="edit-link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  data-testid="input-edit-banner-link"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-buttonText">Button Text</Label>
                <Input
                  id="edit-buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  data-testid="input-edit-banner-button-text"
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                  <SelectTrigger data-testid="select-edit-banner-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos.charAt(0).toUpperCase() + pos.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-edit-banner-active"
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBanner(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={updateMutation.isPending} data-testid="button-update-banner">
              {updateMutation.isPending ? "Updating..." : "Update Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>Are you sure you want to delete this banner? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-banner">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
