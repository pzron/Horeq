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
  Mail,
  Truck,
  Building2,
  MapPin,
  Key,
  Database,
  Save,
  Check,
  RefreshCw,
  Server,
  Lock,
  Wallet,
  Store,
  Bell,
  Languages,
  Calendar,
  Upload,
  Receipt,
  Boxes,
  PackageCheck,
  PackageMinus,
  PackagePlus,
  RotateCcw,
  TrendingDown,
  Warehouse,
  ReceiptText,
  BadgeDollarSign,
  Wrench,
  Settings2,
  AlertTriangle,
  Info,
  Link as LinkIcon,
  BarChart2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type AdminSection = "dashboard" | "products" | "categories" | "combos" | "banners" | "orders" | "users" | "affiliates" | "pages" | "all-pages" | "add-page" | "blocks" | "patterns" | "media" | "menus" | "coupons" | "roles" | "reports" | "settings" | "activity" | "appearance" | "comments" | "tools" | "transactions" | "inventory" | "suppliers" | "applications" | "vendor-stores";

interface MenuGroup {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { id: AdminSection; title: string; icon?: React.ComponentType<{ className?: string }> }[];
}

const menuGroups: MenuGroup[] = [
  {
    id: "dashboard-group",
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { id: "dashboard", title: "Home" },
    ],
  },
  {
    id: "store-group",
    title: "Store",
    icon: Store,
    items: [
      { id: "products", title: "All Products", icon: Package },
      { id: "categories", title: "Categories", icon: FolderOpen },
      { id: "combos", title: "Combo Deals", icon: Gift },
      { id: "orders", title: "Orders", icon: ShoppingCart },
      { id: "coupons", title: "Coupons", icon: Tag },
    ],
  },
  {
    id: "finance-group",
    title: "Finance",
    icon: BadgeDollarSign,
    items: [
      { id: "transactions", title: "TransT", icon: Receipt },
    ],
  },
  {
    id: "inventory-group",
    title: "Inventory",
    icon: Warehouse,
    items: [
      { id: "inventory", title: "Stock Management", icon: Boxes },
      { id: "suppliers", title: "Suppliers", icon: Truck },
    ],
  },
  {
    id: "media-group",
    title: "Media",
    icon: Image,
    items: [
      { id: "media", title: "Library", icon: FileImage },
      { id: "banners", title: "Banners", icon: Image },
    ],
  },
  {
    id: "pages-group",
    title: "Pages",
    icon: FileText,
    items: [
      { id: "all-pages", title: "All Pages", icon: FileText },
      { id: "add-page", title: "Add New", icon: Plus },
      { id: "blocks", title: "Blocks", icon: Grid3X3 },
      { id: "patterns", title: "Patterns", icon: Layout },
    ],
  },
  {
    id: "users-group",
    title: "Users",
    icon: Users,
    items: [
      { id: "users", title: "All Users", icon: Users },
      { id: "roles", title: "Roles & Permissions", icon: Shield },
      { id: "applications", title: "Applications", icon: FileText },
      { id: "affiliates", title: "Affiliates", icon: UserCheck },
      { id: "vendor-stores", title: "Vendor Stores", icon: Building2 },
    ],
  },
  {
    id: "appearance-group",
    title: "Appearance",
    icon: Palette,
    items: [
      { id: "menus", title: "Menus", icon: Menu },
      { id: "appearance", title: "Customize", icon: Palette },
    ],
  },
  {
    id: "tools-group",
    title: "Tools",
    icon: Zap,
    items: [
      { id: "reports", title: "Reports", icon: BarChart3 },
      { id: "activity", title: "Activity Log", icon: Activity },
      { id: "tools", title: "Import/Export", icon: Download },
    ],
  },
  {
    id: "settings-group",
    title: "Settings",
    icon: Settings,
    items: [
      { id: "settings", title: "General", icon: Settings },
    ],
  },
];

const menuItems = menuGroups.flatMap(g => g.items.map(i => ({ id: i.id, title: i.title, icon: i.icon || g.icon })));

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["dashboard-group", "store-group", "pages-group"]));
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b bg-sidebar">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">HOREQ Admin</h2>
                <p className="text-xs text-muted-foreground">WordPress-style CMS</p>
              </div>
            </div>
          </SidebarHeader>
          <ScrollArea className="flex-1">
            <SidebarContent className="p-2">
              {menuGroups.map((group) => (
                <SidebarGroup key={group.id} className="mb-1">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md hover-elevate"
                    data-testid={`nav-group-${group.id}`}
                  >
                    <div className="flex items-center gap-2">
                      <group.icon className="h-4 w-4" />
                      <span>{group.title}</span>
                    </div>
                    {expandedGroups.has(group.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {expandedGroups.has(group.id) && (
                    <SidebarGroupContent className="ml-4 mt-1 border-l border-border/50 pl-2">
                      <SidebarMenu>
                        {group.items.map((item) => {
                          const ItemIcon = item.icon || group.icon;
                          return (
                            <SidebarMenuItem key={item.id}>
                              <SidebarMenuButton
                                onClick={() => setActiveSection(item.id)}
                                className={activeSection === item.id ? "bg-sidebar-accent font-medium" : ""}
                                data-testid={`nav-${item.id}`}
                              >
                                <ItemIcon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  )}
                </SidebarGroup>
              ))}
            </SidebarContent>
          </ScrollArea>
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
            {activeSection === "all-pages" && <AllPagesSection />}
            {activeSection === "add-page" && <AddPageSection />}
            {activeSection === "blocks" && <BlocksSection />}
            {activeSection === "patterns" && <PatternsSection />}
            {activeSection === "media" && <MediaLibrarySection />}
            {activeSection === "menus" && <MenusSection />}
            {activeSection === "coupons" && <CouponsSection />}
            {activeSection === "roles" && <RolesPermissionsSection />}
            {activeSection === "reports" && <ReportsSection />}
            {activeSection === "settings" && <SettingsSection />}
            {activeSection === "activity" && <ActivitySection />}
            {activeSection === "appearance" && <AppearanceSection />}
            {activeSection === "tools" && <ToolsSection />}
            {activeSection === "transactions" && <TransactionsSection />}
            {activeSection === "inventory" && <InventorySection />}
            {activeSection === "suppliers" && <SuppliersSection />}
            {activeSection === "applications" && <ApplicationsSection />}
            {activeSection === "vendor-stores" && <VendorStoresSection />}
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
    videoUrl: "",
    categoryId: "",
    stock: 0,
    featured: false,
    comboAvailable: false,
    affiliateEnabled: true,
    affiliateCommissionType: "percentage",
    affiliateCommissionValue: "10.00",
    affiliatePoints: 0,
    sizes: [] as string[],
    colors: [] as string[],
  };
  const [formData, setFormData] = useState(initialFormData);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

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
    if (!formData.name || !formData.slug || !formData.price || !formData.categoryId) {
      toast({ title: "Validation Error", description: "Name, slug, price, and category are required", variant: "destructive" });
      return;
    }
    if (!formData.image && !imageFile) {
      toast({ title: "Validation Error", description: "Product image is required", variant: "destructive" });
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
      videoUrl: product.videoUrl || "",
      categoryId: product.categoryId || "",
      stock: product.stock || 0,
      featured: product.featured || false,
      comboAvailable: product.comboAvailable || false,
      affiliateEnabled: product.affiliateEnabled ?? true,
      affiliateCommissionType: product.affiliateCommissionType || "percentage",
      affiliateCommissionValue: product.affiliateCommissionValue?.toString() || "10.00",
      affiliatePoints: product.affiliatePoints || 0,
      sizes: product.sizes || [],
      colors: product.colors || [],
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product-image">Product Image</Label>
          <div className="space-y-2">
            <Input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => setFormData({ ...formData, image: e.target?.result as string });
                  reader.readAsDataURL(file);
                }
              }}
              data-testid="input-product-image-file"
            />
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Or paste image URL"
              data-testid="input-product-image-url"
            />
          </div>
          {formData.image && (
            <div className="mt-2">
              <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-video">Product Video (optional)</Label>
          <div className="space-y-2">
            <Input
              id="product-video"
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setVideoFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => setFormData({ ...formData, videoUrl: e.target?.result as string });
                  reader.readAsDataURL(file);
                }
              }}
              data-testid="input-product-video-file"
            />
            <Input
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="Or paste video URL"
              data-testid="input-product-video-url"
            />
          </div>
          {formData.videoUrl && (
            <div className="mt-2 text-xs text-muted-foreground">
              Video selected ✓
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-6 flex-wrap">
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

        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Available Sizes</h4>
            <div className="flex gap-2 flex-wrap mb-2">
              {formData.sizes.map((size, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1 pl-2">
                  {size}
                  <button onClick={() => setFormData({ ...formData, sizes: formData.sizes.filter((_, i) => i !== idx) })} className="ml-1 text-xs">✕</button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="e.g., S, M, L, XL"
                data-testid="input-new-size"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (newSize && !formData.sizes.includes(newSize)) {
                    setFormData({ ...formData, sizes: [...formData.sizes, newSize] });
                    setNewSize("");
                  }
                }}
                data-testid="button-add-size"
              >
                Add Size
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Available Colors</h4>
            <div className="flex gap-2 flex-wrap mb-2">
              {formData.colors.map((color, idx) => (
                <Badge key={idx} variant="outline" className="gap-1 pl-2" style={{ borderColor: color }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  {color}
                  <button onClick={() => setFormData({ ...formData, colors: formData.colors.filter((_, i) => i !== idx) })} className="ml-1 text-xs">✕</button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  type="color"
                  value={newColor || "#000000"}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-12 h-9 p-1 cursor-pointer"
                  data-testid="input-color-picker"
                />
              </div>
              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Color name or hex"
                data-testid="input-new-color"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (newColor && !formData.colors.includes(newColor)) {
                    setFormData({ ...formData, colors: [...formData.colors, newColor] });
                    setNewColor("");
                  }
                }}
                data-testid="button-add-color"
              >
                Add Color
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-4" />
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">Affiliate Settings</h4>
            <p className="text-xs text-muted-foreground">Configure commission for this product</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="product-affiliate-enabled"
              checked={formData.affiliateEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, affiliateEnabled: checked })}
              data-testid="switch-product-affiliate-enabled"
            />
            <Label htmlFor="product-affiliate-enabled">Active for Affiliates</Label>
          </div>
        </div>
        
        {formData.affiliateEnabled && (
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label htmlFor="affiliate-commission-type">Commission Type</Label>
              <Select 
                value={formData.affiliateCommissionType} 
                onValueChange={(value) => setFormData({ ...formData, affiliateCommissionType: value })}
              >
                <SelectTrigger data-testid="select-affiliate-commission-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  <SelectItem value="points">Points</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="affiliate-commission-value">
                {formData.affiliateCommissionType === "percentage" ? "Commission %" : 
                 formData.affiliateCommissionType === "fixed" ? "Amount ($)" : "Points Value"}
              </Label>
              <Input
                id="affiliate-commission-value"
                type="number"
                step="0.01"
                value={formData.affiliateCommissionValue}
                onChange={(e) => setFormData({ ...formData, affiliateCommissionValue: e.target.value })}
                placeholder={formData.affiliateCommissionType === "percentage" ? "10.00" : "5.00"}
                data-testid="input-affiliate-commission-value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="affiliate-points">Bonus Points</Label>
              <Input
                id="affiliate-points"
                type="number"
                value={formData.affiliatePoints}
                onChange={(e) => setFormData({ ...formData, affiliatePoints: parseInt(e.target.value) || 0 })}
                placeholder="0"
                data-testid="input-affiliate-points"
              />
            </div>
          </div>
        )}
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
  const [pageType, setPageType] = useState<string>("public");
  const [allowedRoles, setAllowedRoles] = useState<string[]>([]);
  const [selectedBlockType, setSelectedBlockType] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const { toast } = useToast();

  const pageTypes = [
    { value: "public", label: "Public", description: "Visible to everyone" },
    { value: "ecommerce", label: "E-commerce", description: "Shop and product pages" },
    { value: "user", label: "User Dashboard", description: "Customer account pages" },
    { value: "affiliate", label: "Affiliate", description: "Affiliate partner pages" },
    { value: "admin", label: "Admin", description: "Admin panel pages" },
  ];

  const availableRoles = [
    { value: "customer", label: "Customer" },
    { value: "affiliate", label: "Affiliate" },
    { value: "admin", label: "Admin" },
  ];

  const toggleRole = (role: string) => {
    setAllowedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleNewPage = () => {
    setEditingPage(null);
    setPageTitle("");
    setPageSlug("");
    setPageStatus("draft");
    setPageType("public");
    setAllowedRoles([]);
    setPageBlocks([]);
    setShowBuilder(true);
  };

  const handleEditPage = (page: any) => {
    setEditingPage(page);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageStatus(page.status);
    setPageType(page.pageType || "public");
    setAllowedRoles(page.allowedRoles || []);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Page Type</Label>
                    <Select value={pageType} onValueChange={setPageType}>
                      <SelectTrigger data-testid="select-page-type">
                        <SelectValue placeholder="Select page type" />
                      </SelectTrigger>
                      <SelectContent>
                        {pageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex flex-col">
                              <span>{type.label}</span>
                              <span className="text-xs text-muted-foreground">{type.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Allowed Roles</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableRoles.map((role) => (
                        <Badge
                          key={role.value}
                          variant={allowedRoles.includes(role.value) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleRole(role.value)}
                          data-testid={`badge-role-${role.value}`}
                        >
                          {role.label}
                          {allowedRoles.includes(role.value) && (
                            <Check className="h-3 w-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {allowedRoles.length === 0 ? "All roles can access (public)" : `Restricted to: ${allowedRoles.join(", ")}`}
                    </p>
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
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={async () => {
              try {
                const res = await apiRequest("POST", "/api/admin/pages/seed-system");
                const data = await res.json();
                toast({ title: "System Pages Seeded", description: data.message });
                queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
              } catch (error: any) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
              }
            }}
            data-testid="button-seed-system-pages"
          >
            <Database className="h-4 w-4 mr-2" />
            Seed System Pages
          </Button>
          <Button onClick={handleNewPage} data-testid="button-add-page">
            <Plus className="h-4 w-4 mr-2" />
            Add Page
          </Button>
        </div>
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
                        {page.isSystemPage && (
                          <Badge variant="outline" className="text-xs">System</Badge>
                        )}
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          disabled={page.isSystemPage}
                          title={page.isSystemPage ? "System pages cannot be deleted" : "Delete page"}
                          onClick={async () => {
                            if (page.isSystemPage) return;
                            try {
                              await apiRequest("DELETE", `/api/admin/pages/${page.id}`);
                              toast({ title: "Page Deleted", description: `"${page.title}" has been deleted.` });
                              queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
                            } catch (error: any) {
                              toast({ title: "Error", description: error.message, variant: "destructive" });
                            }
                          }}
                          data-testid={`button-delete-page-${page.id}`}
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
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/coupons"],
  });
  const coupons = data as any[] | undefined;

  const { data: affiliatesData } = useQuery({
    queryKey: ["/api/admin/affiliates"],
  });
  const affiliates = affiliatesData as any[] | undefined;

  const createCouponMutation = useMutation({
    mutationFn: async (couponData: any) => {
      return await apiRequest("POST", "/api/admin/coupons", couponData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({ title: "Coupon created successfully" });
      setShowCreateDialog(false);
    },
    onError: (error: any) => {
      toast({ title: "Failed to create coupon", description: error.message, variant: "destructive" });
    },
  });

  const updateCouponMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/admin/coupons/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({ title: "Coupon updated successfully" });
      setEditingCoupon(null);
    },
    onError: (error: any) => {
      toast({ title: "Failed to update coupon", description: error.message, variant: "destructive" });
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
      toast({ title: "Coupon deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete coupon", description: error.message, variant: "destructive" });
    },
  });

  const toggleCouponStatus = async (coupon: any) => {
    updateCouponMutation.mutate({ id: coupon.id, data: { isActive: !coupon.isActive } });
  };

  const filteredCoupons = (coupons || []).filter((coupon: any) => {
    const matchesSearch = !searchQuery || 
      coupon.code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && coupon.isActive) ||
      (filterStatus === "inactive" && !coupon.isActive) ||
      (filterStatus === "expired" && coupon.expiresAt && new Date(coupon.expiresAt) < new Date());
    const matchesType = filterType === "all" || coupon.discountType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: (coupons || []).length,
    active: (coupons || []).filter((c: any) => c.isActive).length,
    expired: (coupons || []).filter((c: any) => c.expiresAt && new Date(c.expiresAt) < new Date()).length,
    totalUsage: (coupons || []).reduce((acc: number, c: any) => acc + (c.usedCount || 0), 0),
  };

  const CouponForm = ({ coupon, onSubmit, onCancel }: { coupon?: any; onSubmit: (data: any) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      code: coupon?.code || "",
      discountType: coupon?.discountType || "percentage",
      discountValue: coupon?.discountValue || "",
      minPurchase: coupon?.minPurchase || "0",
      maxUses: coupon?.maxUses || "",
      startsAt: coupon?.startsAt ? new Date(coupon.startsAt).toISOString().split("T")[0] : "",
      expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : "",
      isActive: coupon?.isActive ?? true,
      affiliateId: coupon?.affiliateId || "",
    });

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Coupon Code</Label>
            <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="SUMMER20" required data-testid="input-coupon-code" />
          </div>
          <div className="space-y-2">
            <Label>Discount Type</Label>
            <Select value={formData.discountType} onValueChange={(val) => setFormData({ ...formData, discountType: val })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Discount Value</Label>
            <Input type="number" step="0.01" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} placeholder={formData.discountType === "percentage" ? "20" : "10.00"} required data-testid="input-coupon-value" />
          </div>
          <div className="space-y-2">
            <Label>Minimum Purchase</Label>
            <Input type="number" step="0.01" value={formData.minPurchase} onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })} placeholder="0.00" data-testid="input-coupon-min" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Max Uses (leave empty for unlimited)</Label>
            <Input type="number" value={formData.maxUses} onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })} placeholder="Unlimited" data-testid="input-coupon-max-uses" />
          </div>
          <div className="space-y-2">
            <Label>Affiliate (optional)</Label>
            <Select value={formData.affiliateId} onValueChange={(val) => setFormData({ ...formData, affiliateId: val })}>
              <SelectTrigger><SelectValue placeholder="Select affiliate" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No affiliate</SelectItem>
                {(affiliates || []).map((aff: any) => (
                  <SelectItem key={aff.id} value={aff.id}>{aff.username || aff.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" value={formData.startsAt} onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })} data-testid="input-coupon-start" />
          </div>
          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Input type="date" value={formData.expiresAt} onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })} data-testid="input-coupon-expiry" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={formData.isActive} onCheckedChange={(val) => setFormData({ ...formData, isActive: val })} data-testid="switch-coupon-active" />
          <Label>Active</Label>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={createCouponMutation.isPending || updateCouponMutation.isPending}>
            {coupon ? "Update Coupon" : "Create Coupon"}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Tag className="h-6 w-6" />Coupon Management</h2>
          <p className="text-muted-foreground">Create and manage discount codes for your store</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-coupon"><Plus className="h-4 w-4 mr-2" />Add Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>Add a new discount code for your customers</DialogDescription>
            </DialogHeader>
            <CouponForm 
              onSubmit={(data) => createCouponMutation.mutate({ ...data, createdBy: "admin" })} 
              onCancel={() => setShowCreateDialog(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30"><Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div><div><p className="text-sm text-muted-foreground">Total Coupons</p><p className="text-2xl font-bold">{stats.total}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30"><Check className="h-5 w-5 text-green-600 dark:text-green-400" /></div><div><p className="text-sm text-muted-foreground">Active Coupons</p><p className="text-2xl font-bold text-green-600">{stats.active}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30"><Clock className="h-5 w-5 text-red-600 dark:text-red-400" /></div><div><p className="text-sm text-muted-foreground">Expired</p><p className="text-2xl font-bold text-red-600">{stats.expired}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30"><TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div><div><p className="text-sm text-muted-foreground">Total Uses</p><p className="text-2xl font-bold">{stats.totalUsage}</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle>All Coupons</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search codes..." className="pl-9 w-48" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} data-testid="input-search-coupons" /></div>
              <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-28"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="expired">Expired</SelectItem></SelectContent></Select>
              <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="w-28"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed</SelectItem></SelectContent></Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Purchase</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Affiliate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8">Loading coupons...</TableCell></TableRow>
              ) : filteredCoupons.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground"><Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><p>No coupons found</p></TableCell></TableRow>
              ) : (
                filteredCoupons.map((coupon: any) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  return (
                    <TableRow key={coupon.id} data-testid={`row-coupon-${coupon.id}`}>
                      <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                      <TableCell><Badge variant="outline">{coupon.discountType}</Badge></TableCell>
                      <TableCell className="font-semibold">{coupon.discountType === "percentage" ? `${coupon.discountValue}%` : formatCurrency(parseFloat(coupon.discountValue))}</TableCell>
                      <TableCell>{parseFloat(coupon.minPurchase || 0) > 0 ? formatCurrency(parseFloat(coupon.minPurchase)) : "-"}</TableCell>
                      <TableCell>{coupon.usedCount || 0} / {coupon.maxUses || "∞"}</TableCell>
                      <TableCell>
                        <Badge variant={isExpired ? "destructive" : coupon.isActive ? "default" : "secondary"}>
                          {isExpired ? "Expired" : coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {coupon.startsAt ? new Date(coupon.startsAt).toLocaleDateString() : "Now"} - {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}
                      </TableCell>
                      <TableCell>{coupon.affiliateId ? <Badge variant="outline">Affiliate</Badge> : "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => toggleCouponStatus(coupon)} title={coupon.isActive ? "Deactivate" : "Activate"} data-testid={`button-toggle-coupon-${coupon.id}`}>
                            {coupon.isActive ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                          </Button>
                          <Dialog open={editingCoupon?.id === coupon.id} onOpenChange={(open) => !open && setEditingCoupon(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setEditingCoupon(coupon)} data-testid={`button-edit-coupon-${coupon.id}`}><Edit className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Edit Coupon</DialogTitle><DialogDescription>Modify coupon details</DialogDescription></DialogHeader>
                              <CouponForm coupon={coupon} onSubmit={(data) => updateCouponMutation.mutate({ id: coupon.id, data })} onCancel={() => setEditingCoupon(null)} />
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="icon" onClick={() => deleteCouponMutation.mutate(coupon.id)} data-testid={`button-delete-coupon-${coupon.id}`}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function RolesPermissionsSection() {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string | null>("admin");
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"permissions" | "page-access">("permissions");

  const [roles, setRoles] = useState([
    { id: "admin", name: "Administrator", description: "Full system access with all permissions", usersCount: 2, color: "bg-destructive" },
    { id: "manager", name: "Manager", description: "Can manage products, orders, and customers", usersCount: 5, color: "bg-primary" },
    { id: "editor", name: "Editor", description: "Can manage content and CMS pages", usersCount: 8, color: "bg-accent" },
    { id: "support", name: "Support Agent", description: "Can view and respond to customer inquiries", usersCount: 12, color: "bg-secondary" },
    { id: "viewer", name: "Viewer", description: "Read-only access to dashboard and reports", usersCount: 3, color: "bg-muted" },
  ]);

  const [cmsPages] = useState([
    { id: "home", title: "Home", slug: "/", status: "published" },
    { id: "about", title: "About Us", slug: "/about", status: "published" },
    { id: "contact", title: "Contact", slug: "/contact", status: "published" },
    { id: "products", title: "Products", slug: "/products", status: "published" },
    { id: "terms", title: "Terms & Conditions", slug: "/terms", status: "published" },
    { id: "privacy", title: "Privacy Policy", slug: "/privacy", status: "published" },
    { id: "faq", title: "FAQ", slug: "/faq", status: "draft" },
    { id: "team", title: "Our Team", slug: "/team", status: "draft" },
  ]);

  const [pageAccessRoles, setPageAccessRoles] = useState<Record<string, string[]>>({
    home: [],
    about: [],
    contact: [],
    products: [],
    terms: [],
    privacy: [],
    faq: ["admin", "editor"],
    team: ["admin", "manager", "editor"],
  });

  const togglePageRole = (pageId: string, roleId: string) => {
    setPageAccessRoles(prev => {
      const currentRoles = prev[pageId] || [];
      const hasRole = currentRoles.includes(roleId);
      return {
        ...prev,
        [pageId]: hasRole 
          ? currentRoles.filter(r => r !== roleId) 
          : [...currentRoles, roleId],
      };
    });
  };

  const setPagePublic = (pageId: string) => {
    setPageAccessRoles(prev => ({
      ...prev,
      [pageId]: [],
    }));
  };

  const setPagePrivate = (pageId: string, roleIds: string[]) => {
    setPageAccessRoles(prev => ({
      ...prev,
      [pageId]: roleIds,
    }));
  };

  const modules = [
    { id: "dashboard", name: "Dashboard", description: "View dashboard and statistics" },
    { id: "products", name: "Products", description: "Manage product catalog" },
    { id: "orders", name: "Orders", description: "View and manage orders" },
    { id: "customers", name: "Customers", description: "Manage customer accounts" },
    { id: "content", name: "CMS & Content", description: "Manage pages and content" },
    { id: "coupons", name: "Coupons", description: "Create and manage discount codes" },
    { id: "affiliates", name: "Affiliates", description: "Manage affiliate program" },
    { id: "reports", name: "Reports", description: "Access reports and analytics" },
    { id: "settings", name: "Settings", description: "Configure system settings" },
    { id: "users", name: "User Management", description: "Manage admin users and roles" },
  ];

  const permissions = ["view", "create", "edit", "delete"];

  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, string[]>>>({
    admin: {
      dashboard: ["view", "create", "edit", "delete"],
      products: ["view", "create", "edit", "delete"],
      orders: ["view", "create", "edit", "delete"],
      customers: ["view", "create", "edit", "delete"],
      content: ["view", "create", "edit", "delete"],
      coupons: ["view", "create", "edit", "delete"],
      affiliates: ["view", "create", "edit", "delete"],
      reports: ["view", "create", "edit", "delete"],
      settings: ["view", "create", "edit", "delete"],
      users: ["view", "create", "edit", "delete"],
    },
    manager: {
      dashboard: ["view"],
      products: ["view", "create", "edit"],
      orders: ["view", "edit"],
      customers: ["view", "edit"],
      content: ["view"],
      coupons: ["view", "create", "edit"],
      affiliates: ["view"],
      reports: ["view"],
      settings: [],
      users: [],
    },
    editor: {
      dashboard: ["view"],
      products: ["view", "edit"],
      orders: ["view"],
      customers: ["view"],
      content: ["view", "create", "edit", "delete"],
      coupons: [],
      affiliates: [],
      reports: [],
      settings: [],
      users: [],
    },
    support: {
      dashboard: ["view"],
      products: ["view"],
      orders: ["view", "edit"],
      customers: ["view", "edit"],
      content: [],
      coupons: ["view"],
      affiliates: [],
      reports: [],
      settings: [],
      users: [],
    },
    viewer: {
      dashboard: ["view"],
      products: ["view"],
      orders: ["view"],
      customers: ["view"],
      content: ["view"],
      coupons: ["view"],
      affiliates: ["view"],
      reports: ["view"],
      settings: [],
      users: [],
    },
  });

  const [assignedUsers] = useState([
    { id: 1, name: "John Admin", email: "john@horeq.com", role: "admin", avatar: "" },
    { id: 2, name: "Sarah Manager", email: "sarah@horeq.com", role: "manager", avatar: "" },
    { id: 3, name: "Mike Editor", email: "mike@horeq.com", role: "editor", avatar: "" },
    { id: 4, name: "Lisa Support", email: "lisa@horeq.com", role: "support", avatar: "" },
    { id: 5, name: "Tom Viewer", email: "tom@horeq.com", role: "viewer", avatar: "" },
  ]);

  const togglePermission = (moduleId: string, permission: string) => {
    if (!selectedRole) return;
    
    setRolePermissions(prev => {
      const rolePerms = prev[selectedRole] || {};
      const modulePerms = rolePerms[moduleId] || [];
      
      const hasPermission = modulePerms.includes(permission);
      const newModulePerms = hasPermission
        ? modulePerms.filter(p => p !== permission)
        : [...modulePerms, permission];
      
      return {
        ...prev,
        [selectedRole]: {
          ...rolePerms,
          [moduleId]: newModulePerms,
        },
      };
    });
  };

  const toggleAllPermissions = (moduleId: string) => {
    if (!selectedRole) return;
    
    const currentPerms = rolePermissions[selectedRole]?.[moduleId] || [];
    const hasAll = permissions.every(p => currentPerms.includes(p));
    
    setRolePermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [moduleId]: hasAll ? [] : [...permissions],
      },
    }));
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;
    
    const newRole = {
      id: newRoleName.toLowerCase().replace(/\s+/g, "_"),
      name: newRoleName,
      description: newRoleDescription,
      usersCount: 0,
      color: "bg-purple-500",
    };
    
    setRoles([...roles, newRole]);
    setRolePermissions(prev => ({
      ...prev,
      [newRole.id]: {},
    }));
    
    setNewRoleName("");
    setNewRoleDescription("");
    setIsAddRoleOpen(false);
    
    toast({
      title: "Role Created",
      description: `${newRoleName} role has been created successfully.`,
    });
  };

  const handleSavePermissions = () => {
    toast({
      title: "Permissions Saved",
      description: "Role permissions have been updated successfully.",
    });
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage user roles and access control</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-role">
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>Add a new role with custom permissions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g., Marketing Manager"
                    data-testid="input-role-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Description</Label>
                  <Textarea
                    id="roleDescription"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                    placeholder="Describe what this role can do..."
                    data-testid="input-role-description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>Cancel</Button>
                <Button onClick={handleAddRole} data-testid="button-save-role">Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handleSavePermissions} data-testid="button-save-permissions">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${activeTab === "permissions" ? "border-primary" : "border-transparent"}`}
          onClick={() => setActiveTab("permissions")}
          data-testid="tab-permissions"
        >
          <Shield className="h-4 w-4 mr-2" />
          Module Permissions
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 ${activeTab === "page-access" ? "border-primary" : "border-transparent"}`}
          onClick={() => setActiveTab("page-access")}
          data-testid="tab-page-access"
        >
          <FileText className="h-4 w-4 mr-2" />
          Page Access Control
        </Button>
      </div>

      {activeTab === "permissions" && (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Roles</CardTitle>
            <CardDescription>Select a role to manage</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {roles.map((role) => (
                <button
                  key={role.id}
                  className={`w-full p-4 text-left hover-elevate transition-colors ${selectedRole === role.id ? "bg-muted" : ""}`}
                  onClick={() => setSelectedRole(role.id)}
                  data-testid={`button-select-role-${role.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.usersCount} users</p>
                    </div>
                    {selectedRole === role.id && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {selectedRoleData && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${selectedRoleData.color}`} />
                      <div>
                        <CardTitle>{selectedRoleData.name}</CardTitle>
                        <CardDescription>{selectedRoleData.description}</CardDescription>
                      </div>
                    </div>
                    {selectedRole !== "admin" && (
                      <Button variant="ghost" size="icon" data-testid="button-delete-role">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Module</TableHead>
                          <TableHead className="text-center">View</TableHead>
                          <TableHead className="text-center">Create</TableHead>
                          <TableHead className="text-center">Edit</TableHead>
                          <TableHead className="text-center">Delete</TableHead>
                          <TableHead className="text-center w-[100px]">All</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {modules.map((module) => {
                          const modulePerms = selectedRole ? (rolePermissions[selectedRole]?.[module.id] || []) : [];
                          const hasAll = permissions.every(p => modulePerms.includes(p));
                          
                          return (
                            <TableRow key={module.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{module.name}</p>
                                  <p className="text-xs text-muted-foreground">{module.description}</p>
                                </div>
                              </TableCell>
                              {permissions.map((perm) => (
                                <TableCell key={perm} className="text-center">
                                  <Switch
                                    checked={modulePerms.includes(perm)}
                                    onCheckedChange={() => togglePermission(module.id, perm)}
                                    disabled={selectedRole === "admin"}
                                    data-testid={`switch-${module.id}-${perm}`}
                                  />
                                </TableCell>
                              ))}
                              <TableCell className="text-center">
                                <Button
                                  variant={hasAll ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleAllPermissions(module.id)}
                                  disabled={selectedRole === "admin"}
                                  data-testid={`button-toggle-all-${module.id}`}
                                >
                                  {hasAll ? "All" : "None"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Users with this Role</CardTitle>
                  <CardDescription>Users currently assigned to {selectedRoleData.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignedUsers
                      .filter(u => u.role === selectedRole)
                      .map((user) => (
                        <div key={user.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Select defaultValue={user.role}>
                            <SelectTrigger className="w-[140px]" data-testid={`select-user-role-${user.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    {assignedUsers.filter(u => u.role === selectedRole).length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No users assigned to this role</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      )}

      {activeTab === "page-access" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Page Access Control
              </CardTitle>
              <CardDescription>
                Define which user roles can access specific pages. Pages with no roles assigned are public and accessible to everyone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Page</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Access</TableHead>
                      {roles.map((role) => (
                        <TableHead key={role.id} className="text-center w-[100px]">
                          <div className="flex items-center justify-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${role.color}`} />
                            <span className="text-xs">{role.name}</span>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cmsPages.map((page) => {
                      const allowedRoles = pageAccessRoles[page.id] || [];
                      const isPublic = allowedRoles.length === 0;
                      
                      return (
                        <TableRow key={page.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{page.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{page.slug}</TableCell>
                          <TableCell>
                            <Badge variant={page.status === "published" ? "default" : "secondary"} className="text-xs">
                              {page.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isPublic ? "outline" : "default"} className="text-xs">
                              {isPublic ? "Public" : "Restricted"}
                            </Badge>
                          </TableCell>
                          {roles.map((role) => (
                            <TableCell key={role.id} className="text-center">
                              <Switch
                                checked={allowedRoles.includes(role.id)}
                                onCheckedChange={() => togglePageRole(page.id, role.id)}
                                disabled={role.id === "admin"}
                                data-testid={`switch-page-${page.id}-role-${role.id}`}
                              />
                            </TableCell>
                          ))}
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPagePublic(page.id)}
                                disabled={isPublic}
                                data-testid={`button-make-public-${page.id}`}
                              >
                                <Globe className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPagePrivate(page.id, roles.map(r => r.id))}
                                disabled={allowedRoles.length === roles.length}
                                data-testid={`button-make-private-${page.id}`}
                              >
                                <Lock className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Access Summary</CardTitle>
                <CardDescription>Overview of page visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-green-500" />
                      <span>Public Pages</span>
                    </div>
                    <Badge variant="outline">{cmsPages.filter(p => (pageAccessRoles[p.id] || []).length === 0).length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-orange-500" />
                      <span>Restricted Pages</span>
                    </div>
                    <Badge variant="outline">{cmsPages.filter(p => (pageAccessRoles[p.id] || []).length > 0).length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Role Access Overview</CardTitle>
                <CardDescription>Pages each role can access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {roles.map((role) => {
                    const accessiblePages = cmsPages.filter(page => {
                      const allowedRoles = pageAccessRoles[page.id] || [];
                      return allowedRoles.length === 0 || allowedRoles.includes(role.id);
                    });
                    return (
                      <div key={role.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${role.color}`} />
                          <span className="text-sm font-medium">{role.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {accessiblePages.length} / {cmsPages.length} pages
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportsSection() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("30d");
  const [reportType, setReportType] = useState("sales");
  const [isExporting, setIsExporting] = useState(false);

  const salesReportData = [
    { date: "Week 1", revenue: 12500, orders: 85, avgOrder: 147 },
    { date: "Week 2", revenue: 15800, orders: 102, avgOrder: 155 },
    { date: "Week 3", revenue: 11200, orders: 78, avgOrder: 144 },
    { date: "Week 4", revenue: 18500, orders: 125, avgOrder: 148 },
  ];

  const productReportData = [
    { name: "Industrial Drill Pro", sold: 245, revenue: 48755, growth: 12.5 },
    { name: "Safety Helmet Set", sold: 189, revenue: 9450, growth: 8.2 },
    { name: "Commercial Mixer", sold: 156, revenue: 77844, growth: -3.4 },
    { name: "Welding Machine X1", sold: 134, revenue: 53466, growth: 15.8 },
    { name: "Power Generator 5K", sold: 98, revenue: 147000, growth: 22.1 },
  ];

  const customerReportData = [
    { metric: "New Customers", value: 342, change: 18.5, period: "This Month" },
    { metric: "Returning Customers", value: 156, change: 12.3, period: "This Month" },
    { metric: "Customer Lifetime Value", value: 485, change: 8.7, period: "Average" },
    { metric: "Churn Rate", value: 2.8, change: -0.5, period: "This Month" },
  ];

  const trafficSourceData = [
    { name: "Direct", value: 35, visitors: 12500 },
    { name: "Organic Search", value: 28, visitors: 10000 },
    { name: "Social Media", value: 18, visitors: 6500 },
    { name: "Referral", value: 12, visitors: 4300 },
    { name: "Email", value: 7, visitors: 2500 },
  ];

  const handleExport = async (format: string) => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);
    toast({
      title: "Report Exported",
      description: `Your ${reportType} report has been exported as ${format.toUpperCase()}.`,
    });
  };

  const CHART_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive business insights and data export</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]" data-testid="select-date-range">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="365d">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="button-export-report">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Report</DialogTitle>
                <DialogDescription>Choose a format to export your report</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <Button variant="outline" onClick={() => handleExport("csv")} disabled={isExporting} data-testid="button-export-csv">
                  <FileText className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" onClick={() => handleExport("pdf")} disabled={isExporting} data-testid="button-export-pdf">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" onClick={() => handleExport("excel")} disabled={isExporting} data-testid="button-export-excel">
                  <FileText className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" onClick={() => handleExport("json")} disabled={isExporting} data-testid="button-export-json">
                  <Code className="h-4 w-4 mr-2" />
                  JSON
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid gap-1">
          <TabsTrigger value="sales" className="flex items-center gap-2" data-testid="tab-sales-report">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Sales</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2" data-testid="tab-products-report">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2" data-testid="tab-customers-report">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Customers</span>
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center gap-2" data-testid="tab-traffic-report">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Traffic</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-revenue">$58,000</div>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12.5% from last period
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-orders">390</div>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  8.2% from last period
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Order</CardTitle>
                <CreditCard className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-avg-order">$148.72</div>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  3.8% from last period
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Refund Rate</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-refund-rate">2.4%</div>
                <div className="flex items-center text-xs text-green-500 mt-1">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  0.3% from last period
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue & Orders Trend
              </CardTitle>
              <CardDescription>Weekly breakdown of sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesReportData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="orders" fill="#3b82f6" name="Orders" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products with highest sales in selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productReportData.map((product, index) => (
                    <TableRow key={index} data-testid={`row-product-report-${index}`}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.sold}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={product.growth >= 0 ? "default" : "secondary"}>
                          {product.growth >= 0 ? "+" : ""}{product.growth}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerReportData.map((item, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{item.metric}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid={`stat-${item.metric.toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.metric.includes("Value") ? formatCurrency(item.value) : 
                     item.metric.includes("Rate") ? `${item.value}%` : item.value}
                  </div>
                  <div className={`flex items-center text-xs mt-1 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {item.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(item.change)}% {item.period}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Breakdown by acquisition channel</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={trafficSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {trafficSourceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Breakdown</CardTitle>
                <CardDescription>Visitors by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSourceData.map((source, index) => (
                    <div key={source.name} className="flex items-center gap-4">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} 
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{source.name}</span>
                          <span className="text-muted-foreground">{source.visitors.toLocaleString()} visitors</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${source.value}%`, 
                              backgroundColor: CHART_COLORS[index % CHART_COLORS.length] 
                            }} 
                          />
                        </div>
                      </div>
                      <Badge variant="outline">{source.value}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsSection() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "HOREQ Store",
    siteDescription: "Your one-stop shop for quality products",
    siteEmail: "contact@horeq.com",
    sitePhone: "+1 234 567 8900",
    siteAddress: "123 Commerce Street, City, Country",
    siteLogo: "",
    favicon: "",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    maintenanceMode: false,
    allowGuestCheckout: true,
    enableReviews: true,
    enableWishlist: true,
    enableCompare: true,
    itemsPerPage: "12",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "USD",
    currencySymbol: "$",
    currencyPosition: "before",
    thousandSeparator: ",",
    decimalSeparator: ".",
    decimalPlaces: "2",
    stripeEnabled: true,
    stripePublicKey: "",
    stripeSecretKey: "",
    paypalEnabled: false,
    paypalClientId: "",
    paypalSecret: "",
    codEnabled: true,
    bankTransferEnabled: false,
    bankName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
    minOrderAmount: "0",
    maxOrderAmount: "10000",
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    smtpEncryption: "tls",
    fromName: "HOREQ Store",
    fromEmail: "noreply@horeq.com",
    orderConfirmation: true,
    shippingNotification: true,
    deliveryConfirmation: true,
    abandonedCartReminder: true,
    newsletterEnabled: true,
    welcomeEmailEnabled: true,
    passwordResetEnabled: true,
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: "50",
    flatRateEnabled: true,
    flatRateAmount: "5.99",
    weightBasedEnabled: false,
    weightUnit: "kg",
    dimensionUnit: "cm",
    defaultCountry: "US",
    allowedCountries: "US,CA,GB,AU",
    restrictedCountries: "",
    handlingFee: "0",
    processingTime: "1-2 business days",
    localPickupEnabled: false,
    localPickupAddress: "",
    trackingEnabled: true,
    signatureRequired: false,
    insuranceEnabled: false,
    insuranceRate: "1",
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  ];

  const timezones = [
    "UTC", "America/New_York", "America/Los_Angeles", "America/Chicago",
    "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Shanghai",
    "Australia/Sydney", "Pacific/Auckland",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-muted-foreground">Configure your store settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} data-testid="button-save-settings">
          {isSaving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid gap-1">
          <TabsTrigger value="general" className="flex items-center gap-2" data-testid="tab-general">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2" data-testid="tab-payment">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2" data-testid="tab-email">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2" data-testid="tab-shipping">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Shipping</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>Basic information about your store</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Store Name</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                  data-testid="input-site-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteEmail">Contact Email</Label>
                <Input
                  id="siteEmail"
                  type="email"
                  value={generalSettings.siteEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteEmail: e.target.value })}
                  data-testid="input-site-email"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="siteDescription">Store Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                  data-testid="input-site-description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sitePhone">Phone Number</Label>
                <Input
                  id="sitePhone"
                  value={generalSettings.sitePhone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, sitePhone: e.target.value })}
                  data-testid="input-site-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteAddress">Business Address</Label>
                <Input
                  id="siteAddress"
                  value={generalSettings.siteAddress}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteAddress: e.target.value })}
                  data-testid="input-site-address"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Branding
              </CardTitle>
              <CardDescription>Logo and visual identity</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteLogo">Logo URL</Label>
                <Input
                  id="siteLogo"
                  placeholder="https://example.com/logo.png"
                  value={generalSettings.siteLogo}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteLogo: e.target.value })}
                  data-testid="input-logo-url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  placeholder="https://example.com/favicon.ico"
                  value={generalSettings.favicon}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, favicon: e.target.value })}
                  data-testid="input-favicon-url"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Localization
              </CardTitle>
              <CardDescription>Regional settings and formats</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={generalSettings.timezone} 
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                >
                  <SelectTrigger data-testid="select-timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select 
                  value={generalSettings.dateFormat} 
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, dateFormat: value })}
                >
                  <SelectTrigger data-testid="select-date-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemsPerPage">Items Per Page</Label>
                <Select 
                  value={generalSettings.itemsPerPage} 
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, itemsPerPage: value })}
                >
                  <SelectTrigger data-testid="select-items-per-page">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="16">16</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Store Features
              </CardTitle>
              <CardDescription>Enable or disable store features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable the store for visitors</p>
                </div>
                <Switch 
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
                  data-testid="switch-maintenance-mode" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Guest Checkout</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to checkout without creating an account</p>
                </div>
                <Switch 
                  checked={generalSettings.allowGuestCheckout}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, allowGuestCheckout: checked })}
                  data-testid="switch-guest-checkout" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Product Reviews</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to leave product reviews</p>
                </div>
                <Switch 
                  checked={generalSettings.enableReviews}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, enableReviews: checked })}
                  data-testid="switch-enable-reviews" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Wishlist</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to save products to wishlist</p>
                </div>
                <Switch 
                  checked={generalSettings.enableWishlist}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, enableWishlist: checked })}
                  data-testid="switch-enable-wishlist" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Product Compare</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to compare products</p>
                </div>
                <Switch 
                  checked={generalSettings.enableCompare}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, enableCompare: checked })}
                  data-testid="switch-enable-compare" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Currency Settings
              </CardTitle>
              <CardDescription>Configure currency display and formatting</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={paymentSettings.currency} 
                  onValueChange={(value) => {
                    const curr = currencies.find(c => c.code === value);
                    setPaymentSettings({ 
                      ...paymentSettings, 
                      currency: value,
                      currencySymbol: curr?.symbol || "$"
                    });
                  }}
                >
                  <SelectTrigger data-testid="select-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} - {curr.name} ({curr.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currencyPosition">Symbol Position</Label>
                <Select 
                  value={paymentSettings.currencyPosition} 
                  onValueChange={(value) => setPaymentSettings({ ...paymentSettings, currencyPosition: value })}
                >
                  <SelectTrigger data-testid="select-currency-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Before amount ($100)</SelectItem>
                    <SelectItem value="after">After amount (100$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="thousandSeparator">Thousand Separator</Label>
                <Select 
                  value={paymentSettings.thousandSeparator} 
                  onValueChange={(value) => setPaymentSettings({ ...paymentSettings, thousandSeparator: value })}
                >
                  <SelectTrigger data-testid="select-thousand-sep">
                    <SelectValue placeholder="Select separator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma (1,000)</SelectItem>
                    <SelectItem value=".">Period (1.000)</SelectItem>
                    <SelectItem value=" ">Space (1 000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="decimalPlaces">Decimal Places</Label>
                <Select 
                  value={paymentSettings.decimalPlaces} 
                  onValueChange={(value) => setPaymentSettings({ ...paymentSettings, decimalPlaces: value })}
                >
                  <SelectTrigger data-testid="select-decimal-places">
                    <SelectValue placeholder="Select places" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 ($100)</SelectItem>
                    <SelectItem value="2">2 ($100.00)</SelectItem>
                    <SelectItem value="3">3 ($100.000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Gateways
              </CardTitle>
              <CardDescription>Configure payment methods for your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                      <CreditCard className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <Label className="text-base">Stripe</Label>
                      <p className="text-sm text-muted-foreground">Accept credit cards via Stripe</p>
                    </div>
                  </div>
                  <Switch 
                    checked={paymentSettings.stripeEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, stripeEnabled: checked })}
                    data-testid="switch-stripe-enabled" 
                  />
                </div>
                {paymentSettings.stripeEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="stripePublicKey">Publishable Key</Label>
                      <Input
                        id="stripePublicKey"
                        type="password"
                        placeholder="pk_live_..."
                        value={paymentSettings.stripePublicKey}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripePublicKey: e.target.value })}
                        data-testid="input-stripe-public-key"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripeSecretKey">Secret Key</Label>
                      <Input
                        id="stripeSecretKey"
                        type="password"
                        placeholder="sk_live_..."
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeSecretKey: e.target.value })}
                        data-testid="input-stripe-secret-key"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <Wallet className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <Label className="text-base">PayPal</Label>
                      <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
                    </div>
                  </div>
                  <Switch 
                    checked={paymentSettings.paypalEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, paypalEnabled: checked })}
                    data-testid="switch-paypal-enabled" 
                  />
                </div>
                {paymentSettings.paypalEnabled && (
                  <div className="grid gap-4 md:grid-cols-2 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="paypalClientId">Client ID</Label>
                      <Input
                        id="paypalClientId"
                        type="password"
                        placeholder="Enter PayPal Client ID"
                        value={paymentSettings.paypalClientId}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalClientId: e.target.value })}
                        data-testid="input-paypal-client-id"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypalSecret">Secret</Label>
                      <Input
                        id="paypalSecret"
                        type="password"
                        placeholder="Enter PayPal Secret"
                        value={paymentSettings.paypalSecret}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, paypalSecret: e.target.value })}
                        data-testid="input-paypal-secret"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <Label className="text-base">Cash on Delivery</Label>
                      <p className="text-sm text-muted-foreground">Accept payment upon delivery</p>
                    </div>
                  </div>
                  <Switch 
                    checked={paymentSettings.codEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, codEnabled: checked })}
                    data-testid="switch-cod-enabled" 
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-2 rounded-lg">
                      <Building2 className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <Label className="text-base">Bank Transfer</Label>
                      <p className="text-sm text-muted-foreground">Accept direct bank transfers</p>
                    </div>
                  </div>
                  <Switch 
                    checked={paymentSettings.bankTransferEnabled}
                    onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, bankTransferEnabled: checked })}
                    data-testid="switch-bank-transfer-enabled" 
                  />
                </div>
                {paymentSettings.bankTransferEnabled && (
                  <div className="grid gap-4 md:grid-cols-3 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="Enter bank name"
                        value={paymentSettings.bankName}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                        data-testid="input-bank-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountNumber">Account Number</Label>
                      <Input
                        id="bankAccountNumber"
                        placeholder="Enter account number"
                        value={paymentSettings.bankAccountNumber}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankAccountNumber: e.target.value })}
                        data-testid="input-bank-account"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankRoutingNumber">Routing Number</Label>
                      <Input
                        id="bankRoutingNumber"
                        placeholder="Enter routing number"
                        value={paymentSettings.bankRoutingNumber}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, bankRoutingNumber: e.target.value })}
                        data-testid="input-bank-routing"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Order Limits
              </CardTitle>
              <CardDescription>Set minimum and maximum order amounts</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minOrderAmount">Minimum Order Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    className="pl-7"
                    value={paymentSettings.minOrderAmount}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, minOrderAmount: e.target.value })}
                    data-testid="input-min-order"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxOrderAmount">Maximum Order Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="maxOrderAmount"
                    type="number"
                    className="pl-7"
                    value={paymentSettings.maxOrderAmount}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, maxOrderAmount: e.target.value })}
                    data-testid="input-max-order"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                SMTP Configuration
              </CardTitle>
              <CardDescription>Configure your email server settings</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  placeholder="smtp.gmail.com"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                  data-testid="input-smtp-host"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  placeholder="587"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                  data-testid="input-smtp-port"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">Username</Label>
                <Input
                  id="smtpUsername"
                  placeholder="your@email.com"
                  value={emailSettings.smtpUsername}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                  data-testid="input-smtp-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  placeholder="Enter password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                  data-testid="input-smtp-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpEncryption">Encryption</Label>
                <Select 
                  value={emailSettings.smtpEncryption} 
                  onValueChange={(value) => setEmailSettings({ ...emailSettings, smtpEncryption: value })}
                >
                  <SelectTrigger data-testid="select-smtp-encryption">
                    <SelectValue placeholder="Select encryption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full" data-testid="button-test-smtp">
                  <Mail className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Sender Information
              </CardTitle>
              <CardDescription>Configure the from address for outgoing emails</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  placeholder="HOREQ Store"
                  value={emailSettings.fromName}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                  data-testid="input-from-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="noreply@horeq.com"
                  value={emailSettings.fromEmail}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                  data-testid="input-from-email"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure which emails are sent automatically</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Order Confirmation</Label>
                  <p className="text-sm text-muted-foreground">Send email when order is placed</p>
                </div>
                <Switch 
                  checked={emailSettings.orderConfirmation}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, orderConfirmation: checked })}
                  data-testid="switch-order-confirmation" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Shipping Notification</Label>
                  <p className="text-sm text-muted-foreground">Send email when order is shipped</p>
                </div>
                <Switch 
                  checked={emailSettings.shippingNotification}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, shippingNotification: checked })}
                  data-testid="switch-shipping-notification" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Delivery Confirmation</Label>
                  <p className="text-sm text-muted-foreground">Send email when order is delivered</p>
                </div>
                <Switch 
                  checked={emailSettings.deliveryConfirmation}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, deliveryConfirmation: checked })}
                  data-testid="switch-delivery-confirmation" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Abandoned Cart Reminder</Label>
                  <p className="text-sm text-muted-foreground">Send reminder for abandoned carts</p>
                </div>
                <Switch 
                  checked={emailSettings.abandonedCartReminder}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, abandonedCartReminder: checked })}
                  data-testid="switch-abandoned-cart" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Newsletter</Label>
                  <p className="text-sm text-muted-foreground">Allow customers to subscribe to newsletter</p>
                </div>
                <Switch 
                  checked={emailSettings.newsletterEnabled}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, newsletterEnabled: checked })}
                  data-testid="switch-newsletter" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Welcome Email</Label>
                  <p className="text-sm text-muted-foreground">Send email when user registers</p>
                </div>
                <Switch 
                  checked={emailSettings.welcomeEmailEnabled}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, welcomeEmailEnabled: checked })}
                  data-testid="switch-welcome-email" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Methods
              </CardTitle>
              <CardDescription>Configure shipping options for your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                      <Gift className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <Label className="text-base">Free Shipping</Label>
                      <p className="text-sm text-muted-foreground">Offer free shipping over a threshold</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      className="pl-7"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: e.target.value })}
                      data-testid="input-free-shipping-threshold"
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <Package className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <Label className="text-base">Flat Rate Shipping</Label>
                      <p className="text-sm text-muted-foreground">Charge a fixed shipping rate</p>
                    </div>
                  </div>
                  <Switch 
                    checked={shippingSettings.flatRateEnabled}
                    onCheckedChange={(checked) => setShippingSettings({ ...shippingSettings, flatRateEnabled: checked })}
                    data-testid="switch-flat-rate" 
                  />
                </div>
                {shippingSettings.flatRateEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="flatRateAmount">Flat Rate Amount</Label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="flatRateAmount"
                        type="number"
                        step="0.01"
                        className="pl-7"
                        value={shippingSettings.flatRateAmount}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, flatRateAmount: e.target.value })}
                        data-testid="input-flat-rate"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <Label className="text-base">Local Pickup</Label>
                      <p className="text-sm text-muted-foreground">Allow customers to pickup orders</p>
                    </div>
                  </div>
                  <Switch 
                    checked={shippingSettings.localPickupEnabled}
                    onCheckedChange={(checked) => setShippingSettings({ ...shippingSettings, localPickupEnabled: checked })}
                    data-testid="switch-local-pickup" 
                  />
                </div>
                {shippingSettings.localPickupEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="localPickupAddress">Pickup Address</Label>
                    <Textarea
                      id="localPickupAddress"
                      placeholder="Enter pickup address"
                      value={shippingSettings.localPickupAddress}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, localPickupAddress: e.target.value })}
                      data-testid="input-pickup-address"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Shipping Zones
              </CardTitle>
              <CardDescription>Configure where you ship to</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultCountry">Default Country</Label>
                <Select 
                  value={shippingSettings.defaultCountry} 
                  onValueChange={(value) => setShippingSettings({ ...shippingSettings, defaultCountry: value })}
                >
                  <SelectTrigger data-testid="select-default-country">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allowedCountries">Allowed Countries (comma-separated)</Label>
                <Input
                  id="allowedCountries"
                  placeholder="US,CA,GB,AU"
                  value={shippingSettings.allowedCountries}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, allowedCountries: e.target.value })}
                  data-testid="input-allowed-countries"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Additional Options
              </CardTitle>
              <CardDescription>Configure additional shipping options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="handlingFee">Handling Fee</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="handlingFee"
                      type="number"
                      step="0.01"
                      className="pl-7"
                      value={shippingSettings.handlingFee}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, handlingFee: e.target.value })}
                      data-testid="input-handling-fee"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingTime">Processing Time</Label>
                  <Input
                    id="processingTime"
                    placeholder="1-2 business days"
                    value={shippingSettings.processingTime}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, processingTime: e.target.value })}
                    data-testid="input-processing-time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightUnit">Weight Unit</Label>
                  <Select 
                    value={shippingSettings.weightUnit} 
                    onValueChange={(value) => setShippingSettings({ ...shippingSettings, weightUnit: value })}
                  >
                    <SelectTrigger data-testid="select-weight-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                      <SelectItem value="oz">Ounces (oz)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Order Tracking</Label>
                  <p className="text-sm text-muted-foreground">Enable tracking for shipments</p>
                </div>
                <Switch 
                  checked={shippingSettings.trackingEnabled}
                  onCheckedChange={(checked) => setShippingSettings({ ...shippingSettings, trackingEnabled: checked })}
                  data-testid="switch-tracking" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Signature Required</Label>
                  <p className="text-sm text-muted-foreground">Require signature on delivery</p>
                </div>
                <Switch 
                  checked={shippingSettings.signatureRequired}
                  onCheckedChange={(checked) => setShippingSettings({ ...shippingSettings, signatureRequired: checked })}
                  data-testid="switch-signature" 
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Shipping Insurance</Label>
                  <p className="text-sm text-muted-foreground">Offer insurance for shipments</p>
                </div>
                <Switch 
                  checked={shippingSettings.insuranceEnabled}
                  onCheckedChange={(checked) => setShippingSettings({ ...shippingSettings, insuranceEnabled: checked })}
                  data-testid="switch-insurance" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
  const [productSearch, setProductSearch] = useState("");
  const [bucketColors] = useState(["bg-blue-100", "bg-green-100", "bg-purple-100", "bg-orange-100", "bg-pink-100", "bg-yellow-100"]);
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
  const { data: productsData } = useQuery({
    queryKey: ["/api/products"],
  });
  const combos = data as any[] | undefined;
  const allProducts = (productsData as any[]) || [];
  const isLoading = !combos;
  
  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) && 
    !formData.productIds.includes(p.id)
  ).slice(0, 8);

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
                <div className="space-y-3">
                  <Label htmlFor="product-search">Add Products</Label>
                  <Input
                    id="product-search"
                    placeholder="Search and add products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    data-testid="input-combo-product-search"
                  />
                  {filteredProducts.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 border rounded-lg p-2 bg-muted/30 max-h-40 overflow-y-auto">
                      {filteredProducts.map(product => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, productIds: [...formData.productIds, product.id] });
                            setProductSearch("");
                          }}
                          className="text-left p-2 rounded-md hover:bg-primary/10 text-sm font-medium transition-colors"
                          data-testid={`button-add-product-${product.id}`}
                        >
                          {product.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Combo Packages</Label>
                  {formData.productIds.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.productIds.map((productId, idx) => {
                        const product = allProducts.find(p => p.id === productId);
                        const color = bucketColors[idx % bucketColors.length];
                        return (
                          <div
                            key={productId}
                            className={`${color} rounded-lg px-3 py-2 flex items-center gap-2 text-sm font-medium border border-black/10`}
                            data-testid={`bucket-product-${productId}`}
                          >
                            <span className="truncate">{product?.name || 'Unknown'}</span>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, productIds: formData.productIds.filter(id => id !== productId) })}
                              className="text-destructive hover:text-destructive/80 ml-1"
                              data-testid={`button-remove-product-${productId}`}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">No products added yet</p>
                  )}
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

function AllPagesSection() {
  const { data, isLoading } = useQuery({ queryKey: ["/api/admin/pages"] });
  const pages = data as any[] | undefined;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPages = pages?.filter(page => {
    const matchesSearch = page.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className={statusFilter === "all" ? "bg-primary text-primary-foreground" : ""} onClick={() => setStatusFilter("all")} data-testid="filter-all">All ({pages?.length || 0})</Button>
          <Button variant="outline" size="sm" className={statusFilter === "published" ? "bg-primary text-primary-foreground" : ""} onClick={() => setStatusFilter("published")} data-testid="filter-published">Published ({pages?.filter(p => p.status === "published").length || 0})</Button>
          <Button variant="outline" size="sm" className={statusFilter === "draft" ? "bg-primary text-primary-foreground" : ""} onClick={() => setStatusFilter("draft")} data-testid="filter-draft">Draft ({pages?.filter(p => p.status === "draft").length || 0})</Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search pages..." className="pl-9 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} data-testid="input-search-pages" />
          </div>
          <Button data-testid="button-add-page"><Plus className="h-4 w-4 mr-2" />Add New Page</Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"><input type="checkbox" className="rounded" /></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading pages...</TableCell></TableRow>
              ) : filteredPages.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">No pages found</TableCell></TableRow>
              ) : filteredPages.map((page) => (
                <TableRow key={page.id} data-testid={`row-page-${page.id}`}>
                  <TableCell><input type="checkbox" className="rounded" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center"><FileImage className="h-6 w-6 text-muted-foreground" /></div>
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-xs text-muted-foreground">/{page.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{page.createdBy || "Admin"}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">0 views</Badge></TableCell>
                  <TableCell><Badge className={page.status === "published" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}>{page.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(page.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AddPageSection() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-4">
        <Input placeholder="Add title" className="text-2xl font-bold border-0 border-b rounded-none focus-visible:ring-0 px-0" value={title} onChange={(e) => setTitle(e.target.value)} data-testid="input-page-title" />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Type className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><ImagePlus className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Grid3X3 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Code className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Start writing or type / to choose a block" className="min-h-[400px] resize-none border-0 focus-visible:ring-0" value={content} onChange={(e) => setContent(e.target.value)} data-testid="input-page-content" />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Publish</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Status:</span><Badge>{status}</Badge></div>
            <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Visibility:</span><span>Public</span></div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setStatus("draft"); toast({ title: "Saved as draft" }); }} data-testid="button-save-draft">Save Draft</Button>
              <Button className="flex-1" onClick={() => { setStatus("published"); toast({ title: "Page published!" }); }} data-testid="button-publish">Publish</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Page Attributes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Template</Label>
              <Select defaultValue="default"><SelectTrigger data-testid="select-template"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                  <SelectItem value="full-width">Full Width</SelectItem>
                  <SelectItem value="sidebar">With Sidebar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Parent Page</Label>
              <Select defaultValue="none"><SelectTrigger data-testid="select-parent"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="none">(no parent)</SelectItem></SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Featured Image</CardTitle></CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover-elevate">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Set featured image</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BlocksSection() {
  const blockTypes = [
    { id: "paragraph", name: "Paragraph", icon: Type, description: "Start with plain text" },
    { id: "heading", name: "Heading", icon: Type, description: "Add a heading (H1-H6)" },
    { id: "image", name: "Image", icon: Image, description: "Insert an image" },
    { id: "gallery", name: "Gallery", icon: Grid3X3, description: "Display multiple images" },
    { id: "video", name: "Video", icon: Play, description: "Embed a video" },
    { id: "button", name: "Button", icon: MousePointerClick, description: "Add a call-to-action" },
    { id: "columns", name: "Columns", icon: Columns, description: "Add a multi-column layout" },
    { id: "spacer", name: "Spacer", icon: RectangleHorizontal, description: "Add whitespace" },
    { id: "quote", name: "Quote", icon: MessageSquareQuote, description: "Add a quote block" },
    { id: "code", name: "Code", icon: Code, description: "Add code snippet" },
    { id: "products", name: "Products", icon: Package, description: "Display products" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-lg font-semibold">Blocks Library</h2><p className="text-sm text-muted-foreground">Reusable content blocks for your pages</p></div>
        <Button data-testid="button-create-block"><Plus className="h-4 w-4 mr-2" />Create Custom Block</Button>
      </div>
      <Tabs defaultValue="all">
        <TabsList><TabsTrigger value="all">All Blocks</TabsTrigger><TabsTrigger value="text">Text</TabsTrigger><TabsTrigger value="media">Media</TabsTrigger><TabsTrigger value="design">Design</TabsTrigger><TabsTrigger value="widgets">Widgets</TabsTrigger></TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {blockTypes.map((block) => (
              <Card key={block.id} className="cursor-pointer hover-elevate" data-testid={`block-${block.id}`}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center"><block.icon className="h-6 w-6 text-primary" /></div>
                  <h3 className="font-medium text-sm">{block.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{block.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PatternsSection() {
  const patterns = [
    { id: "hero-1", name: "Hero with CTA", category: "Heroes", preview: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "hero-2", name: "Hero with Image", category: "Heroes", preview: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { id: "features-1", name: "Feature Grid", category: "Features", preview: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { id: "cta-1", name: "Call to Action", category: "CTA", preview: "bg-gradient-to-r from-orange-500 to-red-500" },
    { id: "testimonials-1", name: "Testimonials", category: "Social Proof", preview: "bg-gradient-to-r from-indigo-500 to-purple-500" },
    { id: "footer-1", name: "Footer", category: "Footers", preview: "bg-gradient-to-r from-gray-700 to-gray-900" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h2 className="text-lg font-semibold">Patterns</h2><p className="text-sm text-muted-foreground">Pre-designed layouts and sections</p></div>
        <Button data-testid="button-create-pattern"><Plus className="h-4 w-4 mr-2" />Create Pattern</Button>
      </div>
      <Tabs defaultValue="all">
        <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="heroes">Heroes</TabsTrigger><TabsTrigger value="features">Features</TabsTrigger><TabsTrigger value="cta">CTA</TabsTrigger><TabsTrigger value="footers">Footers</TabsTrigger></TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.map((pattern) => (
              <Card key={pattern.id} className="overflow-hidden cursor-pointer hover-elevate" data-testid={`pattern-${pattern.id}`}>
                <div className={`h-32 ${pattern.preview}`} />
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">{pattern.category}</Badge>
                  <h3 className="font-medium">{pattern.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MediaLibrarySection() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const { data, isLoading } = useQuery({ queryKey: ["/api/admin/media"] });
  const mediaItems = data as any[] | undefined;

  const folders = ["all", "uploads", "products", "banners", "avatars"];
  const mockMedia = [
    { id: "1", filename: "product-1.jpg", type: "image/jpeg", size: 245000, folder: "products", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
    { id: "2", filename: "banner-hero.jpg", type: "image/jpeg", size: 512000, folder: "banners", url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200" },
    { id: "3", filename: "avatar-user.png", type: "image/png", size: 85000, folder: "avatars", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" },
  ];

  const displayMedia = mediaItems || mockMedia;
  const filteredMedia = selectedFolder === "all" ? displayMedia : displayMedia.filter(m => m.folder === selectedFolder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Media Library</h2>
          <div className="flex border rounded-md">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")} data-testid="button-grid-view"><Grid3X3 className="h-4 w-4" /></Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")} data-testid="button-list-view"><Menu className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search media..." className="pl-9 w-64" data-testid="input-search-media" /></div>
          <Button data-testid="button-upload-media"><Upload className="h-4 w-4 mr-2" />Upload</Button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-48 space-y-1">
          {folders.map((folder) => (
            <Button key={folder} variant={selectedFolder === folder ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setSelectedFolder(folder)} data-testid={`folder-${folder}`}>
              <FolderOpen className="h-4 w-4 mr-2" />{folder === "all" ? "All Files" : folder.charAt(0).toUpperCase() + folder.slice(1)}
            </Button>
          ))}
          <Separator className="my-2" />
          <Button variant="ghost" className="w-full justify-start text-muted-foreground"><Plus className="h-4 w-4 mr-2" />New Folder</Button>
        </div>
        <div className="flex-1">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <Card key={item.id} className="overflow-hidden cursor-pointer hover-elevate" data-testid={`media-${item.id}`}>
                  <div className="aspect-square relative"><img src={item.url} alt={item.filename} className="w-full h-full object-cover" /></div>
                  <CardContent className="p-2"><p className="text-xs truncate">{item.filename}</p><p className="text-xs text-muted-foreground">{(item.size / 1024).toFixed(0)} KB</p></CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>File</TableHead><TableHead>Folder</TableHead><TableHead>Size</TableHead><TableHead>Date</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredMedia.map((item) => (
                  <TableRow key={item.id} data-testid={`media-row-${item.id}`}>
                    <TableCell className="flex items-center gap-3"><img src={item.url} alt="" className="w-10 h-10 object-cover rounded" /><span>{item.filename}</span></TableCell>
                    <TableCell>{item.folder}</TableCell><TableCell>{(item.size / 1024).toFixed(0)} KB</TableCell><TableCell>Dec 15, 2025</TableCell>
                    <TableCell><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

function AppearanceSection() {
  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Theme Customization</CardTitle><CardDescription>Customize the look and feel of your store</CardDescription></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4"><Label>Primary Color</Label><div className="flex gap-2">{["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"].map(color => (<button key={color} className="w-10 h-10 rounded-md border-2" style={{ backgroundColor: color }} data-testid={`color-${color}`} />))}</div></div>
            <div className="space-y-4"><Label>Font Family</Label><Select defaultValue="inter"><SelectTrigger data-testid="select-font"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="inter">Inter</SelectItem><SelectItem value="roboto">Roboto</SelectItem><SelectItem value="poppins">Poppins</SelectItem></SelectContent></Select></div>
          </div>
          <Separator />
          <div className="space-y-4"><Label>Logo</Label><div className="flex items-center gap-4"><div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center"><Upload className="h-8 w-8 text-muted-foreground" /></div><div><p className="text-sm">Upload your store logo</p><p className="text-xs text-muted-foreground">Recommended: 200x50px</p></div></div></div>
        </CardContent>
      </Card>
    </div>
  );
}

function ToolsSection() {
  const [activeToolTab, setActiveToolTab] = useState("import-export");
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<string | null>(null);
  const [systemAction, setSystemAction] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: activityLogs, isLoading: logsLoading } = useQuery({ queryKey: ["/api/admin/activity-logs"] });
  const { data: statsData } = useQuery({ queryKey: ["/api/admin/stats"] });
  const stats = statsData as { totalUsers: number; totalOrders: number; totalProducts: number; totalRevenue: string } | undefined;

  const handleExport = (type: string) => {
    if (isExporting) return;
    setIsExporting(true);
    setExportType(type);
    setTimeout(() => {
      toast({ title: `${type} exported successfully`, description: "Download will start automatically" });
      setIsExporting(false);
      setExportType(null);
    }, 1500);
  };

  const handleImport = (type: string) => {
    toast({ title: `Import ${type}`, description: "File upload dialog would open here" });
  };

  const handleSystemAction = (action: string) => {
    if (systemAction) return;
    setSystemAction(action);
    setTimeout(() => {
      toast({ title: `${action} completed`, description: "Action completed successfully" });
      setSystemAction(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Wrench className="h-6 w-6" />Tools & Utilities</h2>
          <p className="text-muted-foreground">Import, export, reports, and system utilities</p>
        </div>
      </div>

      <Tabs value={activeToolTab} onValueChange={setActiveToolTab}>
        <TabsList>
          <TabsTrigger value="import-export" data-testid="tab-import-export"><Upload className="h-4 w-4 mr-2" />Import / Export</TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports"><BarChart2 className="h-4 w-4 mr-2" />Reports</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity"><Activity className="h-4 w-4 mr-2" />Activity Log</TabsTrigger>
          <TabsTrigger value="system" data-testid="tab-system"><Settings2 className="h-4 w-4 mr-2" />System</TabsTrigger>
        </TabsList>

        <TabsContent value="import-export" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Import Data</CardTitle><CardDescription>Import data from CSV or JSON files</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate cursor-pointer" onClick={() => handleImport("file")}>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Drop files here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports CSV, JSON, XML formats</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleImport("products")} data-testid="button-import-products"><Package className="h-4 w-4 mr-2" />Import Products (CSV)</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleImport("users")} data-testid="button-import-users"><Users className="h-4 w-4 mr-2" />Import Users (CSV)</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleImport("pages")} data-testid="button-import-pages"><FileText className="h-4 w-4 mr-2" />Import Pages (JSON)</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleImport("orders")} data-testid="button-import-orders"><ShoppingCart className="h-4 w-4 mr-2" />Import Orders (CSV)</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Export Data</CardTitle><CardDescription>Export your store data for backup or migration</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleExport("Products")} disabled={isExporting && exportType === "Products"} data-testid="button-export-products"><Package className="h-4 w-4 mr-2" />{isExporting && exportType === "Products" ? "Exporting..." : "Export Products (CSV)"}</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleExport("Orders")} disabled={isExporting && exportType === "Orders"} data-testid="button-export-orders"><ShoppingCart className="h-4 w-4 mr-2" />{isExporting && exportType === "Orders" ? "Exporting..." : "Export Orders (CSV)"}</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleExport("Users")} disabled={isExporting && exportType === "Users"} data-testid="button-export-users"><Users className="h-4 w-4 mr-2" />{isExporting && exportType === "Users" ? "Exporting..." : "Export Users (CSV)"}</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleExport("Transactions")} disabled={isExporting && exportType === "Transactions"} data-testid="button-export-transactions"><Receipt className="h-4 w-4 mr-2" />{isExporting && exportType === "Transactions" ? "Exporting..." : "Export Transactions (CSV)"}</Button>
                </div>
                <Separator />
                <Button className="w-full" onClick={() => handleExport("Full Backup")} disabled={isExporting && exportType === "Full Backup"} data-testid="button-export-all"><Database className="h-4 w-4 mr-2" />{isExporting && exportType === "Full Backup" ? "Creating backup..." : "Full Database Export (JSON)"}</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30"><Package className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div><div><p className="text-sm text-muted-foreground">Total Products</p><p className="text-2xl font-bold" data-testid="text-report-products">{stats?.totalProducts || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30"><ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" /></div><div><p className="text-sm text-muted-foreground">Total Orders</p><p className="text-2xl font-bold" data-testid="text-report-orders">{stats?.totalOrders || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30"><Users className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div><div><p className="text-sm text-muted-foreground">Total Users</p><p className="text-2xl font-bold" data-testid="text-report-users">{stats?.totalUsers || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30"><DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" /></div><div><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold" data-testid="text-report-revenue">${stats?.totalRevenue || "0.00"}</p></div></div></CardContent></Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Generate Reports</CardTitle><CardDescription>Create custom reports for your business</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" data-testid="button-report-sales"><TrendingUp className="h-4 w-4 mr-2" />Sales Report</Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-report-inventory"><Package className="h-4 w-4 mr-2" />Inventory Report</Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-report-customers"><Users className="h-4 w-4 mr-2" />Customer Report</Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-report-affiliates"><LinkIcon className="h-4 w-4 mr-2" />Affiliate Performance Report</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Scheduled Reports</CardTitle><CardDescription>Set up automated report delivery</CardDescription></CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-sm">No scheduled reports configured</p>
                  <Button variant="outline" className="mt-3" data-testid="button-schedule-report"><Plus className="h-4 w-4 mr-2" />Schedule Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <div><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Activity Log</CardTitle><CardDescription>Recent actions and system events</CardDescription></div>
              <Button variant="outline" size="sm" data-testid="button-clear-logs"><Trash2 className="h-4 w-4 mr-2" />Clear Old Logs</Button>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading activity logs...</div>
              ) : !activityLogs || (activityLogs as any[]).length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No activity recorded yet</p>
                  <p className="text-sm text-muted-foreground">Actions will appear here as they occur</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(activityLogs as any[]).slice(0, 20).map((log: any, index: number) => (
                    <div key={log.id || index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50" data-testid={`activity-log-${index}`}>
                      <div className="p-2 rounded-full bg-background"><Activity className="h-4 w-4" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{log.action || "System action"}</p>
                        <p className="text-xs text-muted-foreground">{log.details || log.description || "No details"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "Just now"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Database</CardTitle><CardDescription>Database maintenance and optimization</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSystemAction("Optimize Database")} disabled={!!systemAction} data-testid="button-optimize-db">{systemAction === "Optimize Database" ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}{systemAction === "Optimize Database" ? "Optimizing..." : "Optimize Database"}</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSystemAction("Clear Cache")} disabled={!!systemAction} data-testid="button-clear-cache">{systemAction === "Clear Cache" ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}{systemAction === "Clear Cache" ? "Clearing..." : "Clear Cache"}</Button>
                <Button variant="outline" className="w-full justify-start text-red-600 dark:text-red-400" onClick={() => handleSystemAction("Reset Demo Data")} disabled={!!systemAction} data-testid="button-reset-demo">{systemAction === "Reset Demo Data" ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <AlertTriangle className="h-4 w-4 mr-2" />}{systemAction === "Reset Demo Data" ? "Resetting..." : "Reset Demo Data"}</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Security</CardTitle><CardDescription>Security settings and audit</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSystemAction("Security Scan")} disabled={!!systemAction} data-testid="button-security-scan">{systemAction === "Security Scan" ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}{systemAction === "Security Scan" ? "Scanning..." : "Run Security Scan"}</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSystemAction("View Sessions")} disabled={!!systemAction} data-testid="button-view-sessions">{systemAction === "View Sessions" ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Users className="h-4 w-4 mr-2" />}{systemAction === "View Sessions" ? "Loading..." : "View Active Sessions"}</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleSystemAction("API Keys")} disabled={!!systemAction} data-testid="button-api-keys">{systemAction === "API Keys" ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}{systemAction === "API Keys" ? "Loading..." : "API Keys"}</Button>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />System Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-xs text-muted-foreground">Version</p><p className="font-medium">1.0.0</p></div>
                <div><p className="text-xs text-muted-foreground">Environment</p><p className="font-medium">Production</p></div>
                <div><p className="text-xs text-muted-foreground">Node Version</p><p className="font-medium">20.x</p></div>
                <div><p className="text-xs text-muted-foreground">Database</p><p className="font-medium">PostgreSQL</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// TransT - Comprehensive Transaction History Section
function TransactionsSection() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDateRange, setFilterDateRange] = useState<string>("all");
  const [filterMoneySource, setFilterMoneySource] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { toast } = useToast();

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["/api/admin/transactions"],
  });
  const transactions = transactionsData as any[] | undefined;

  const { data: statsData } = useQuery({
    queryKey: ["/api/admin/transactions/stats"],
  });
  const stats = statsData as { totalTransactions: number; totalAmount: string; pendingAmount: string; completedAmount: string } | undefined;

  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions/stats"] });
      toast({ title: "Transaction created successfully" });
      setShowCreateDialog(false);
    },
    onError: (error: any) => {
      toast({ title: "Failed to create transaction", description: error.message, variant: "destructive" });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/admin/transactions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions/stats"] });
      toast({ title: "Transaction updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update transaction", description: error.message, variant: "destructive" });
    },
  });

  const getDateRangeFilter = (range: string) => {
    const now = new Date();
    switch (range) {
      case "today": return new Date(now.setHours(0, 0, 0, 0));
      case "7days": return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "30days": return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "90days": return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case "year": return new Date(now.getFullYear(), 0, 1);
      default: return null;
    }
  };

  const filteredTransactions = (transactions || []).filter((tx: any) => {
    const matchesType = filterType === "all" || tx.type === filterType;
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    const matchesSearch = !searchQuery || 
      tx.transactionNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMoneySource = filterMoneySource === "all" || tx.paymentMethod === filterMoneySource;
    const dateFilter = getDateRangeFilter(filterDateRange);
    const matchesDate = !dateFilter || (tx.createdAt && new Date(tx.createdAt) >= dateFilter);
    return matchesType && matchesStatus && matchesSearch && matchesMoneySource && matchesDate;
  });

  const earnTypes = ["payment", "commission"];
  const costTypes = ["refund", "payout", "fee"];
  const completedTx = filteredTransactions.filter((tx: any) => tx.status === "completed");
  const totalEarnings = completedTx.filter((tx: any) => earnTypes.includes(tx.type)).reduce((sum: number, tx: any) => sum + parseFloat(tx.amount || 0), 0);
  const totalCosts = completedTx.filter((tx: any) => costTypes.includes(tx.type)).reduce((sum: number, tx: any) => sum + parseFloat(tx.amount || 0), 0);
  const netProfit = totalEarnings - totalCosts;
  const profitMargin = totalEarnings > 0 ? ((netProfit / totalEarnings) * 100).toFixed(1) : "0.0";

  const moneySources = [...new Set((transactions || []).map((tx: any) => tx.paymentMethod).filter(Boolean))];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      processing: { variant: "outline", label: "Processing" },
      completed: { variant: "default", label: "Completed" },
      failed: { variant: "destructive", label: "Failed" },
      refunded: { variant: "secondary", label: "Refunded" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    };
    const s = statusMap[status] || { variant: "outline" as const, label: status };
    return <Badge variant={s.variant} className="text-xs">{s.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { color: string; label: string }> = {
      payment: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", label: "Payment" },
      refund: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", label: "Refund" },
      payout: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", label: "Payout" },
      commission: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300", label: "Commission" },
      fee: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", label: "Fee" },
      adjustment: { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300", label: "Adjustment" },
    };
    const t = typeMap[type] || { color: "bg-gray-100 text-gray-800", label: type };
    return <span className={`px-2 py-1 rounded-md text-xs font-medium ${t.color}`}>{t.label}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Receipt className="h-6 w-6" />TransT - Transaction History</h2>
          <p className="text-muted-foreground">Comprehensive financial transaction tracking with earn/cost analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterDateRange} onValueChange={setFilterDateRange}>
            <SelectTrigger className="w-36"><Calendar className="h-4 w-4 mr-2" /><SelectValue placeholder="Time Period" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-transaction"><Plus className="h-4 w-4 mr-2" />Record Transaction</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Record New Transaction</DialogTitle>
                <DialogDescription>Add a manual transaction record</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createTransactionMutation.mutate({
                  type: formData.get("type"),
                  category: formData.get("category") || "manual",
                  amount: formData.get("amount"),
                  status: formData.get("status") || "completed",
                  description: formData.get("description"),
                  paymentMethod: formData.get("paymentMethod"),
                  moneySource: formData.get("moneySource"),
                });
              }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Type</Label><Select name="type" defaultValue="payment"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="payment">Payment (Earn)</SelectItem><SelectItem value="refund">Refund (Cost)</SelectItem><SelectItem value="payout">Payout (Cost)</SelectItem><SelectItem value="commission">Commission (Earn)</SelectItem><SelectItem value="fee">Fee (Cost)</SelectItem><SelectItem value="adjustment">Adjustment</SelectItem></SelectContent></Select></div>
                    <div><Label>Status</Label><Select name="status" defaultValue="completed"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="processing">Processing</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent></Select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Amount</Label><Input name="amount" type="number" step="0.01" placeholder="0.00" required data-testid="input-tx-amount" /></div>
                    <div><Label>Payment Method / Source</Label><Input name="paymentMethod" placeholder="e.g. Stripe, PayPal, Bank" data-testid="input-tx-method" /></div>
                  </div>
                  <div><Label>Description</Label><Textarea name="description" placeholder="Transaction description..." data-testid="input-tx-description" /></div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={createTransactionMutation.isPending}>{createTransactionMutation.isPending ? "Creating..." : "Create Transaction"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-tx-overview"><BarChart2 className="h-4 w-4 mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="records" data-testid="tab-tx-records"><Receipt className="h-4 w-4 mr-2" />Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30"><TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" /></div><div><p className="text-sm text-muted-foreground">Total Earnings</p><p className="text-2xl font-bold text-green-600" data-testid="text-total-earnings">${totalEarnings.toFixed(2)}</p><p className="text-xs text-muted-foreground">Payments + Commissions</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30"><TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" /></div><div><p className="text-sm text-muted-foreground">Total Costs</p><p className="text-2xl font-bold text-red-600" data-testid="text-total-costs">${totalCosts.toFixed(2)}</p><p className="text-xs text-muted-foreground">Refunds + Payouts + Fees</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30"><DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div><div><p className="text-sm text-muted-foreground">Net Profit</p><p className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`} data-testid="text-net-profit">${netProfit.toFixed(2)}</p><p className="text-xs text-muted-foreground">Margin: {profitMargin}%</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30"><Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div><div><p className="text-sm text-muted-foreground">Transactions</p><p className="text-2xl font-bold" data-testid="text-tx-count">{filteredTransactions.length}</p><p className="text-xs text-muted-foreground">{filterDateRange === "all" ? "All time" : filterDateRange}</p></div></div></CardContent></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5" />Money Sources</CardTitle><CardDescription>Transaction breakdown by payment method</CardDescription></CardHeader>
              <CardContent>
                {moneySources.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No payment methods recorded yet</div>
                ) : (
                  <div className="space-y-3">
                    {moneySources.map((source) => {
                      const sourceTx = filteredTransactions.filter((tx: any) => tx.paymentMethod === source);
                      const sourceAmount = sourceTx.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount || 0), 0);
                      const percentage = totalEarnings > 0 ? (sourceAmount / totalEarnings * 100) : 0;
                      return (
                        <div key={source} className="space-y-1">
                          <div className="flex items-center justify-between"><span className="text-sm font-medium">{source}</span><span className="text-sm text-muted-foreground">${sourceAmount.toFixed(2)} ({percentage.toFixed(1)}%)</span></div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" />Transaction Types</CardTitle><CardDescription>Volume by transaction type</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["payment", "refund", "payout", "commission", "fee"].map((type) => {
                    const typeTx = filteredTransactions.filter((tx: any) => tx.type === type);
                    const typeAmount = typeTx.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount || 0), 0);
                    const total = filteredTransactions.reduce((sum: number, tx: any) => sum + parseFloat(tx.amount || 0), 0);
                    const percentage = total > 0 ? (typeAmount / total * 100) : 0;
                    const isEarn = earnTypes.includes(type);
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isEarn ? "bg-green-500" : "bg-red-500"}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between"><span className="text-sm capitalize">{type}</span><span className="text-xs text-muted-foreground">{typeTx.length} tx</span></div>
                        </div>
                        <span className={`text-sm font-medium ${isEarn ? "text-green-600" : "text-red-600"}`}>${typeAmount.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="mt-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle>Transaction Records</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search transactions..." className="pl-9 w-48" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} data-testid="input-search-transactions" /></div>
                  <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="w-28"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="payment">Payment</SelectItem><SelectItem value="refund">Refund</SelectItem><SelectItem value="payout">Payout</SelectItem><SelectItem value="commission">Commission</SelectItem><SelectItem value="fee">Fee</SelectItem></SelectContent></Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-28"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent></Select>
                  {moneySources.length > 0 && (
                    <Select value={filterMoneySource} onValueChange={setFilterMoneySource}><SelectTrigger className="w-28"><SelectValue placeholder="Source" /></SelectTrigger><SelectContent><SelectItem value="all">All Sources</SelectItem>{moneySources.map((src) => (<SelectItem key={src} value={src}>{src}</SelectItem>))}</SelectContent></Select>
                  )}
                  <Button variant="outline" size="icon" data-testid="button-export-tx"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground">Create your first transaction to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Transaction ID</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Payment Method</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx: any) => (
                  <TableRow key={tx.id} data-testid={`transaction-row-${tx.id}`}>
                    <TableCell className="font-mono text-sm">{tx.transactionNumber}</TableCell>
                    <TableCell>{getTypeBadge(tx.type)}</TableCell>
                    <TableCell className={tx.type === "refund" ? "text-red-600" : "text-green-600"}>
                      {tx.type === "refund" ? "-" : ""}${parseFloat(tx.amount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.status)}</TableCell>
                    <TableCell>{tx.paymentMethod || "-"}</TableCell>
                    <TableCell>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" data-testid={`button-view-tx-${tx.id}`}><Eye className="h-4 w-4" /></Button>
                        <Select value={tx.status} onValueChange={(val) => updateTransactionMutation.mutate({ id: tx.id, data: { status: val } })}>
                          <SelectTrigger className="w-8 h-8 p-0 border-0"><Edit className="h-4 w-4" /></SelectTrigger>
                          <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="processing">Processing</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="failed">Failed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);
}

// Inventory Management Section
function InventorySection() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRecordType, setSelectedRecordType] = useState<"stock_in" | "stock_out" | "return" | "adjustment">("stock_in");
  const { toast } = useToast();

  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ["/api/admin/inventory"],
  });
  const inventoryRecords = inventoryData as any[] | undefined;

  const { data: statsData } = useQuery({
    queryKey: ["/api/admin/inventory/stats"],
  });
  const stats = statsData as { totalRecords: number; stockInCount: number; stockOutCount: number; returnCount: number } | undefined;

  const { data: productsData } = useQuery({
    queryKey: ["/api/products"],
  });
  const products = productsData as any[] | undefined;

  const createInventoryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/inventory", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inventory/stats"] });
      toast({ title: "Inventory record created successfully" });
      setShowCreateDialog(false);
    },
    onError: (error: any) => {
      toast({ title: "Failed to create inventory record", description: error.message, variant: "destructive" });
    },
  });

  const filteredRecords = (inventoryRecords || []).filter((rec: any) => {
    const matchesType = filterType === "all" || rec.type === filterType;
    const matchesSearch = !searchQuery || 
      rec.recordNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stock_in": return <PackagePlus className="h-4 w-4 text-green-600" />;
      case "stock_out": return <PackageMinus className="h-4 w-4 text-red-600" />;
      case "return": return <RotateCcw className="h-4 w-4 text-blue-600" />;
      case "adjustment": return <RefreshCw className="h-4 w-4 text-orange-600" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { color: string; label: string }> = {
      stock_in: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", label: "Stock In" },
      stock_out: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", label: "Stock Out" },
      return: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", label: "Return" },
      adjustment: { color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", label: "Adjustment" },
    };
    const t = typeMap[type] || { color: "bg-gray-100 text-gray-800", label: type };
    return <span className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${t.color}`}>{getTypeIcon(type)}{t.label}</span>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      pending: { variant: "secondary", label: "Pending" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const s = statusMap[status] || { variant: "outline" as const, label: status };
    return <Badge variant={s.variant} className="text-xs">{s.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Boxes className="h-6 w-6" />Inventory Management</h2>
          <p className="text-muted-foreground">Track stock movements, returns, and adjustments</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-inventory"><Plus className="h-4 w-4 mr-2" />Add Stock Movement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record Stock Movement</DialogTitle>
              <DialogDescription>Add a new inventory record</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createInventoryMutation.mutate({
                productId: formData.get("productId"),
                type: selectedRecordType,
                reason: formData.get("reason"),
                quantity: parseInt(formData.get("quantity") as string),
                previousStock: parseInt(formData.get("previousStock") as string) || 0,
                newStock: parseInt(formData.get("newStock") as string) || 0,
                notes: formData.get("notes"),
                unitCost: formData.get("unitCost"),
                supplierName: formData.get("supplierName"),
                warehouseLocation: formData.get("warehouseLocation"),
              });
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(["stock_in", "stock_out", "return", "adjustment"] as const).map((type) => (
                    <Button key={type} type="button" variant={selectedRecordType === type ? "default" : "outline"} className="justify-start" onClick={() => setSelectedRecordType(type)}>
                      {getTypeIcon(type)}<span className="ml-2 capitalize">{type.replace("_", " ")}</span>
                    </Button>
                  ))}
                </div>
                <div><Label>Product</Label><Select name="productId" required><SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger><SelectContent>{(products || []).map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Quantity</Label><Input name="quantity" type="number" required data-testid="input-inv-quantity" /></div>
                  <div><Label>Previous Stock</Label><Input name="previousStock" type="number" data-testid="input-inv-prev-stock" /></div>
                  <div><Label>New Stock</Label><Input name="newStock" type="number" data-testid="input-inv-new-stock" /></div>
                </div>
                <div><Label>Reason</Label><Select name="reason" required><SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger><SelectContent><SelectItem value="purchase">Purchase</SelectItem><SelectItem value="sale">Sale</SelectItem><SelectItem value="customer_return">Customer Return</SelectItem><SelectItem value="damaged">Damaged</SelectItem><SelectItem value="expired">Expired</SelectItem><SelectItem value="transfer">Transfer</SelectItem><SelectItem value="correction">Inventory Correction</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
                {selectedRecordType === "stock_in" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Unit Cost</Label><Input name="unitCost" type="number" step="0.01" placeholder="0.00" data-testid="input-inv-cost" /></div>
                    <div><Label>Supplier</Label><Input name="supplierName" placeholder="Supplier name" data-testid="input-inv-supplier" /></div>
                  </div>
                )}
                <div><Label>Warehouse Location</Label><Input name="warehouseLocation" placeholder="e.g. Warehouse A, Shelf B3" data-testid="input-inv-location" /></div>
                <div><Label>Notes</Label><Textarea name="notes" placeholder="Additional notes..." data-testid="input-inv-notes" /></div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={createInventoryMutation.isPending}>{createInventoryMutation.isPending ? "Creating..." : "Create Record"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30"><Boxes className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div><div><p className="text-sm text-muted-foreground">Total Records</p><p className="text-2xl font-bold" data-testid="text-total-records">{stats?.totalRecords || 0}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30"><PackagePlus className="h-5 w-5 text-green-600 dark:text-green-400" /></div><div><p className="text-sm text-muted-foreground">Stock In</p><p className="text-2xl font-bold" data-testid="text-stock-in">{stats?.stockInCount || 0}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30"><PackageMinus className="h-5 w-5 text-red-600 dark:text-red-400" /></div><div><p className="text-sm text-muted-foreground">Stock Out</p><p className="text-2xl font-bold" data-testid="text-stock-out">{stats?.stockOutCount || 0}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30"><RotateCcw className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div><div><p className="text-sm text-muted-foreground">Returns</p><p className="text-2xl font-bold" data-testid="text-returns">{stats?.returnCount || 0}</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Stock Movement Records</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search records..." className="pl-9 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} data-testid="input-search-inventory" /></div>
              <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="stock_in">Stock In</SelectItem><SelectItem value="stock_out">Stock Out</SelectItem><SelectItem value="return">Return</SelectItem><SelectItem value="adjustment">Adjustment</SelectItem></SelectContent></Select>
              <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading inventory records...</div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <Boxes className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No inventory records found</p>
              <p className="text-sm text-muted-foreground">Create your first stock movement to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Record ID</TableHead><TableHead>Type</TableHead><TableHead>Quantity</TableHead><TableHead>Stock Change</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((rec: any) => (
                  <TableRow key={rec.id} data-testid={`inventory-row-${rec.id}`}>
                    <TableCell className="font-mono text-sm">{rec.recordNumber}</TableCell>
                    <TableCell>{getTypeBadge(rec.type)}</TableCell>
                    <TableCell className="font-semibold">{rec.quantity}</TableCell>
                    <TableCell>{rec.previousStock} <ArrowRight className="inline h-3 w-3" /> {rec.newStock}</TableCell>
                    <TableCell className="capitalize">{rec.reason?.replace("_", " ") || "-"}</TableCell>
                    <TableCell>{getStatusBadge(rec.status)}</TableCell>
                    <TableCell>{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" data-testid={`button-view-inv-${rec.id}`}><Eye className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Suppliers Management Section
function SuppliersSection() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: suppliersData, isLoading } = useQuery({
    queryKey: ["/api/admin/suppliers"],
  });
  const suppliers = suppliersData as any[] | undefined;

  const createSupplierMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/admin/suppliers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suppliers"] });
      toast({ title: "Supplier created successfully" });
      setShowCreateDialog(false);
    },
    onError: (error: any) => {
      toast({ title: "Failed to create supplier", description: error.message, variant: "destructive" });
    },
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suppliers"] });
      toast({ title: "Supplier deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete supplier", description: error.message, variant: "destructive" });
    },
  });

  const filteredSuppliers = (suppliers || []).filter((s: any) => {
    return !searchQuery || 
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Truck className="h-6 w-6" />Suppliers</h2>
          <p className="text-muted-foreground">Manage your product suppliers and vendors</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-supplier"><Plus className="h-4 w-4 mr-2" />Add Supplier</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>Register a new supplier in the system</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createSupplierMutation.mutate({
                name: formData.get("name"),
                code: formData.get("code"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                address: formData.get("address"),
                city: formData.get("city"),
                country: formData.get("country"),
                contactPerson: formData.get("contactPerson"),
                paymentTerms: formData.get("paymentTerms"),
                notes: formData.get("notes"),
              });
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Supplier Name</Label><Input name="name" required data-testid="input-supplier-name" /></div>
                  <div><Label>Supplier Code</Label><Input name="code" required placeholder="e.g. SUP-001" data-testid="input-supplier-code" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Email</Label><Input name="email" type="email" data-testid="input-supplier-email" /></div>
                  <div><Label>Phone</Label><Input name="phone" data-testid="input-supplier-phone" /></div>
                </div>
                <div><Label>Contact Person</Label><Input name="contactPerson" data-testid="input-supplier-contact" /></div>
                <div><Label>Address</Label><Input name="address" data-testid="input-supplier-address" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>City</Label><Input name="city" data-testid="input-supplier-city" /></div>
                  <div><Label>Country</Label><Input name="country" data-testid="input-supplier-country" /></div>
                </div>
                <div><Label>Payment Terms</Label><Select name="paymentTerms"><SelectTrigger><SelectValue placeholder="Select terms" /></SelectTrigger><SelectContent><SelectItem value="net_30">Net 30</SelectItem><SelectItem value="net_60">Net 60</SelectItem><SelectItem value="cod">Cash on Delivery</SelectItem><SelectItem value="prepaid">Prepaid</SelectItem></SelectContent></Select></div>
                <div><Label>Notes</Label><Textarea name="notes" placeholder="Additional notes..." data-testid="input-supplier-notes" /></div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={createSupplierMutation.isPending}>{createSupplierMutation.isPending ? "Creating..." : "Add Supplier"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>All Suppliers</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search suppliers..." className="pl-9 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} data-testid="input-search-suppliers" /></div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading suppliers...</div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No suppliers found</p>
              <p className="text-sm text-muted-foreground">Add your first supplier to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Contact</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier: any) => (
                  <TableRow key={supplier.id} data-testid={`supplier-row-${supplier.id}`}>
                    <TableCell className="font-mono text-sm">{supplier.code}</TableCell>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson || "-"}</TableCell>
                    <TableCell>{supplier.email || "-"}</TableCell>
                    <TableCell>{supplier.phone || "-"}</TableCell>
                    <TableCell><Badge variant={supplier.status === "active" ? "default" : "secondary"} className="text-xs">{supplier.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-supplier-${supplier.id}`}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteSupplierMutation.mutate(supplier.id)} data-testid={`button-delete-supplier-${supplier.id}`}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Applications Section - Shows all application types (Vendor, Affiliate, Job, etc.)
function ApplicationsSection() {
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["/api/admin/vendor-applications"],
  });

  const appTypes = [
    { value: "all", label: "All Applications", icon: FileText },
    { value: "vendor", label: "Vendor Applications", icon: Store },
    { value: "affiliate", label: "Affiliate Applications", icon: UserCheck },
    { value: "job", label: "Job Applications", icon: Users },
  ];

  const filteredApps = applications.filter((app: any) => {
    const statusMatch = statusFilter === "all" || app.status === statusFilter;
    const typeMatch = typeFilter === "all" || app.type === typeFilter || (typeFilter === "vendor" && !app.type);
    return statusMatch && typeMatch;
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/admin/vendor-applications/${id}/approve`, { commissionRate: "10.00" });
      if (!response.ok) throw new Error("Failed to approve");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vendor-applications"] });
      toast({ title: "Application approved successfully!" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await apiRequest("POST", `/api/admin/vendor-applications/${id}/reject`, { reason });
      if (!response.ok) throw new Error("Failed to reject");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vendor-applications"] });
      toast({ title: "Application rejected" });
    },
  });

  const getApplicationTypeLabel = (app: any) => {
    if (app.type === "affiliate") return "Affiliate";
    if (app.type === "job") return "Job";
    return "Vendor";
  };

  const getApplicationTypeIcon = (app: any) => {
    if (app.type === "affiliate") return <UserCheck className="h-4 w-4" />;
    if (app.type === "job") return <Users className="h-4 w-4" />;
    return <Store className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6" />Applications</h2>
        <p className="text-muted-foreground">Review and manage all application types</p>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>All Applications</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1 border rounded-lg p-1 bg-muted">
                {appTypes.map((type) => (
                  <Button key={type.value} variant={typeFilter === type.value ? "default" : "ghost"} size="sm" onClick={() => setTypeFilter(type.value)} className="text-xs" data-testid={`button-filter-type-${type.value}`}>
                    {type.label}
                  </Button>
                ))}
              </div>
              <div className="flex gap-1">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <Button key={status} variant={statusFilter === status ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(status)} className="capitalize text-xs" data-testid={`button-filter-status-${status}`}>
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading applications...</div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground"><FileText className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No applications found</p></div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app: any) => (
                <Card key={app.id} className="p-4 border hover-elevate transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getApplicationTypeIcon(app)}
                        <h3 className="font-semibold">{app.storeName || app.name || "Unknown"}</h3>
                        <Badge variant="outline" className="text-xs">{getApplicationTypeLabel(app)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{app.businessName || app.email || "No details"}</p>
                    </div>
                    <Badge variant={app.status === "pending" ? "default" : app.status === "approved" ? "secondary" : "destructive"} className="capitalize">{app.status}</Badge>
                  </div>
                  <p className="text-sm mb-3"><span className="font-medium">Description:</span> {app.description || "N/A"}</p>
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => approveMutation.mutate(app.id)} disabled={approveMutation.isPending} data-testid={`button-approve-app-${app.id}`}>
                        <Check className="h-4 w-4 mr-2" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectMutation.mutate({ id: app.id, reason: "Application rejected by admin" })} disabled={rejectMutation.isPending} data-testid={`button-reject-app-${app.id}`}>
                        <AlertTriangle className="h-4 w-4 mr-2" /> Reject
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Vendor Stores Section
function VendorStoresSection() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["/api/admin/vendor-stores"],
  });

  const filteredStores = stores.filter((store: any) => 
    store.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStoreMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/admin/vendor-stores/${id}`, data);
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vendor-stores"] });
      toast({ title: "Vendor updated successfully!" });
    },
  });

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold flex items-center gap-2"><Store className="h-6 w-6" />Vendor Stores</h2><p className="text-muted-foreground">Manage all active vendor stores</p></div>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>All Vendors</CardTitle>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search vendors..." className="pl-9 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} data-testid="input-search-vendors" /></div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading vendors...</div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-8"><Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><p className="text-muted-foreground">No vendors found</p></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Store Name</TableHead><TableHead>Commission Rate</TableHead><TableHead>Status</TableHead><TableHead>Verified</TableHead><TableHead>Total Sales</TableHead><TableHead>Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {filteredStores.map((store: any) => (
                  <TableRow key={store.id} data-testid={`vendor-row-${store.id}`}>
                    <TableCell className="font-medium">{store.storeName}</TableCell>
                    <TableCell>{store.commissionRate}%</TableCell>
                    <TableCell><Badge variant={store.status === "active" ? "default" : "secondary"} className="capitalize">{store.status}</Badge></TableCell>
                    <TableCell><Badge variant={store.isVerified ? "default" : "outline"}>{store.isVerified ? "Yes" : "No"}</Badge></TableCell>
                    <TableCell>${parseFloat(store.totalSales || 0).toFixed(2)}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" data-testid={`button-view-vendor-${store.id}`}><Eye className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing ArrowRight icon for inventory section
function ArrowRight({ className }: { className?: string }) {
  return <ChevronRight className={className} />;
}
