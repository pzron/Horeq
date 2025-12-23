import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Store, Package, DollarSign, TrendingUp, Settings, Plus,
  Edit, Trash2, Eye, LogOut, BarChart3, ShoppingCart, Link2, Users, CreditCard,
  Copy, Check, AlertTriangle, Upload, Share2, Zap, TrendingDown, Calendar, Hash, 
  AreaChart as AreaChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Eye as EyeIcon, EyeOff, Lock, Image as ImageIcon, Download, Wallet, ArrowDown, ArrowUp,
  TrendingUp as TrendingUpIcon, Activity, Target, Award, AlertCircle, Gift, MousePointerClick, Bell
} from "lucide-react";
import type { VendorStore, Product, Category } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AffiliateProduct {
  productId: string;
  productName: string;
  price: string;
  commissionType: "percentage" | "fixed";
  commissionValue: string;
  isActive: boolean;
  totalClicks: number;
  totalSales: number;
  totalCommission: string;
}

interface WithdrawalRequest {
  id: string;
  amount: string;
  status: "pending" | "approved" | "processing" | "completed" | "rejected";
  paymentMethod: string;
  createdAt: Date;
  processedAt?: Date;
}

interface Transaction {
  id: string;
  type: "sale" | "commission" | "payout" | "refund" | "adjustment";
  amount: string;
  status: "completed" | "pending" | "failed";
  description: string;
  createdAt: Date;
}

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Product states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productOriginalPrice, setProductOriginalPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productIsPublished, setProductIsPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [productColors, setProductColors] = useState("");
  const [productSizes, setProductSizes] = useState("");
  const [productVideoUrl, setProductVideoUrl] = useState("");

  // Combo states
  const [comboDialogOpen, setComboDialogOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<any>(null);
  const [comboName, setComboName] = useState("");
  const [comboDescription, setComboDescription] = useState("");
  const [comboPrice, setComboPrice] = useState("");
  const [comboProductIds, setComboProductIds] = useState<string[]>([]);
  const [selectedProductsForCombo, setSelectedProductsForCombo] = useState<Map<string, number>>(new Map());

  // Affiliate states
  const [affiliateDialogOpen, setAffiliateDialogOpen] = useState(false);
  const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProduct[]>([]);
  const [selectedAffProduct, setSelectedAffProduct] = useState<string>("");
  const [affCommissionType, setAffCommissionType] = useState<"percentage" | "fixed">("percentage");
  const [affCommissionValue, setAffCommissionValue] = useState("5");

  // Payment & Settings states
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("bank_transfer");
  const [logoUploading, setLogoUploading] = useState(false);

  // Query data
  const { data: store, isLoading: storeLoading } = useQuery<VendorStore>({
    queryKey: ["/api/vendor/me"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/vendor/products"],
    enabled: !!store,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: combos = [] } = useQuery({
    queryKey: ["/api/vendor/combos"],
    enabled: !!store,
  });

  const { data: affiliates = [] } = useQuery({
    queryKey: ["/api/vendor/affiliates"],
    enabled: !!store,
  });

  const { data: commissionHistory = [] } = useQuery<any[]>({
    queryKey: ["/api/vendor/commissions"],
    enabled: !!store,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/vendor/transactions"],
    enabled: !!store,
  });

  const { data: analytics = {} } = useQuery({
    queryKey: ["/api/vendor/analytics"],
    enabled: !!store,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/vendor/notifications"],
    enabled: !!store,
  });

  const { data: vendorOrders = [] } = useQuery({
    queryKey: ["/api/vendor/orders"],
    enabled: !!store,
  });

  const { data: vendorReviews = [] } = useQuery({
    queryKey: ["/api/vendor/reviews"],
    enabled: !!store,
  });

  const { data: stockData = [] } = useQuery({
    queryKey: ["/api/vendor/stock"],
    enabled: !!store,
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/vendor/products", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/products"] });
      toast({ title: "Product created successfully!" });
      resetProductForm();
      setProductDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Failed to create product", description: error.message, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/vendor/products/${id}`, data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/products"] });
      toast({ title: "Product updated successfully!" });
      resetProductForm();
      setProductDialogOpen(false);
      setEditingProduct(null);
    },
    onError: (error: any) => {
      toast({ title: "Failed to update product", description: error.message, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/vendor/products/${id}`);
      if (!response.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/products"] });
      toast({ title: "Product deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete product", description: error.message, variant: "destructive" });
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", "/api/vendor/store", data);
      if (!response.ok) throw new Error("Failed to update store");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/me"] });
      toast({ title: "Store settings updated successfully!" });
      setSettingsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Failed to update store", description: error.message, variant: "destructive" });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", "/api/vendor/password", {
        currentPassword,
        newPassword,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Password updated successfully!" });
      setPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) => {
      toast({ title: "Failed to update password", description: error.message, variant: "destructive" });
    },
  });

  const updateLogoMutation = useMutation({
    mutationFn: async (logoUrl: string) => {
      const response = await apiRequest("PATCH", "/api/vendor/logo", { logo: logoUrl });
      if (!response.ok) throw new Error("Failed to update logo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/me"] });
      toast({ title: "Logo updated successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update logo", description: error.message, variant: "destructive" });
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/vendor/withdrawal-request", {
        amount: withdrawalAmount,
        paymentMethod: withdrawalMethod,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request withdrawal");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Withdrawal request submitted successfully!" });
      setWithdrawalDialogOpen(false);
      setWithdrawalAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/transactions"] });
    },
    onError: (error: any) => {
      toast({ title: "Withdrawal request failed", description: error.message, variant: "destructive" });
    },
  });

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");

  const resetProductForm = () => {
    setProductName("");
    setProductSlug("");
    setProductDescription("");
    setProductPrice("");
    setProductOriginalPrice("");
    setProductImage("");
    setProductCategoryId("");
    setProductStock("");
    setProductIsPublished(false);
    setProductColors("");
    setProductSizes("");
    setProductVideoUrl("");
  };

  const createCategoryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/categories", {
        name: newCategoryName,
        slug: newCategorySlug || newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setProductCategoryId(data.id);
      setCategoryDialogOpen(false);
      setNewCategoryName("");
      setNewCategorySlug("");
      toast({ title: "Category created successfully!" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create category", description: error.message, variant: "destructive" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiRequest("POST", "/api/upload", formData);
      if (!response.ok) throw new Error("Upload failed");
      const { url } = await response.json();
      setProductImage(url);
      toast({ title: "Image uploaded successfully!" });
    } catch (error) {
      toast({ title: "Image upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiRequest("POST", "/api/upload", formData);
      if (!response.ok) throw new Error("Upload failed");
      const { url } = await response.json();
      setStoreLogo(url);
      updateLogoMutation.mutate(url);
    } catch (error) {
      toast({ title: "Logo upload failed", variant: "destructive" });
    } finally {
      setLogoUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiRequest("POST", "/api/upload", formData);
      if (!response.ok) throw new Error("Upload failed");
      const { url } = await response.json();
      setProductVideoUrl(url);
      toast({ title: "Video uploaded successfully!" });
    } catch (error) {
      toast({ title: "Video upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductSlug(product.slug);
    setProductDescription(product.description || "");
    setProductPrice(product.price);
    setProductOriginalPrice(product.originalPrice || "");
    setProductImage(product.image);
    setProductCategoryId(product.categoryId);
    setProductStock(product.stock.toString());
    setProductIsPublished(product.isPublished);
    setProductDialogOpen(true);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: productName,
      slug: productSlug || productName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: productDescription || undefined,
      price: productPrice,
      originalPrice: productOriginalPrice || undefined,
      image: productImage,
      categoryId: productCategoryId,
      stock: parseInt(productStock) || 0,
      isPublished: productIsPublished,
      colors: productColors || undefined,
      sizes: productSizes || undefined,
      videoUrl: productVideoUrl || undefined,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>No Store Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-center">
              Your vendor store has not been set up yet. Please wait for admin approval.
            </p>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalSales = parseFloat(store.totalSales) || 0;
  const totalEarnings = parseFloat(store.totalEarnings) || 0;
  const pendingPayout = parseFloat(store.pendingPayout) || 0;
  const commissionRate = parseFloat(store.commissionRate) || 10;

  // Mock analytics data
  const chartData = [
    { date: "Mon", sales: 2400, orders: 24 },
    { date: "Tue", sales: 1398, orders: 18 },
    { date: "Wed", sales: 3200, orders: 32 },
    { date: "Thu", sales: 2780, orders: 28 },
    { date: "Fri", sales: 3908, orders: 42 },
    { date: "Sat", sales: 4800, orders: 52 },
    { date: "Sun", sales: 3800, orders: 38 },
  ];

  const categoryData = [
    { name: "Electronics", value: 35, color: "#3b82f6" },
    { name: "Fashion", value: 25, color: "#8b5cf6" },
    { name: "Home", value: 20, color: "#10b981" },
    { name: "Sports", value: 12, color: "#f59e0b" },
    { name: "Other", value: 8, color: "#6b7280" },
  ];

  const mockWithdrawals: WithdrawalRequest[] = [
    { id: "wr-001", amount: "500", status: "completed", paymentMethod: "bank_transfer", createdAt: new Date("2024-12-15"), processedAt: new Date("2024-12-16") },
    { id: "wr-002", amount: "1000", status: "processing", paymentMethod: "bank_transfer", createdAt: new Date("2024-12-18") },
  ];

  const mockTransactions: Transaction[] = [
    { id: "tr-001", type: "sale", amount: "250", status: "completed", description: "Sale from product #1", createdAt: new Date("2024-12-20") },
    { id: "tr-002", type: "commission", amount: "25", status: "completed", description: "Commission deduction", createdAt: new Date("2024-12-20") },
    { id: "tr-003", type: "sale", amount: "180", status: "completed", description: "Sale from product #2", createdAt: new Date("2024-12-19") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              {store?.logo ? (
                <img src={store.logo} alt={store.storeName} className="w-full h-full object-cover" />
              ) : (
                <Store className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg">{store.storeName}</h1>
              <p className="text-xs text-muted-foreground">Vendor Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user?.username}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-vendor-logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto mb-6">
            <TabsList className="w-full inline-flex">
              <TabsTrigger value="overview" data-testid="tab-vendor-overview">Overview</TabsTrigger>
              <TabsTrigger value="products" data-testid="tab-vendor-products">Products</TabsTrigger>
              <TabsTrigger value="orders-reviews" data-testid="tab-vendor-orders-reviews">Orders & Reviews</TabsTrigger>
              <TabsTrigger value="stock" data-testid="tab-vendor-stock">Stock</TabsTrigger>
              <TabsTrigger value="combos" data-testid="tab-vendor-combos">Combos</TabsTrigger>
              <TabsTrigger value="affiliates" data-testid="tab-vendor-affiliates">Affiliates</TabsTrigger>
              <TabsTrigger value="commissions" data-testid="tab-vendor-commissions">Commissions</TabsTrigger>
              <TabsTrigger value="payment" data-testid="tab-vendor-payment">Payment</TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-vendor-settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab - Enhanced */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                  <div className="flex items-center text-xs text-green-600 mt-1"><ArrowUp className="h-3 w-3 mr-1" />+12% from last month</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                  <CardTitle className="text-sm font-medium">Your Earnings</CardTitle>
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                  <div className="flex items-center text-xs text-blue-600 mt-1"><ArrowUp className="h-3 w-3 mr-1" />After commission</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                  <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Wallet className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${pendingPayout.toFixed(2)}</div>
                  <div className="flex items-center text-xs text-orange-600 mt-1"><AlertCircle className="h-3 w-3 mr-1" />Ready to withdraw</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <div className="flex items-center text-xs text-purple-600 mt-1"><Target className="h-3 w-3 mr-1" />Total listed</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AreaChartIcon className="h-5 w-5 text-primary" />
                      Sales Overview
                    </CardTitle>
                    <CardDescription>Weekly sales performance</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="url(#colorSales)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Sales by Category
                  </CardTitle>
                  <CardDescription>Product distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Store Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Store Status & Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Store Status</p>
                    <Badge variant={store.status === "active" ? "default" : "secondary"} className="mt-1">
                      {store.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Commission Rate</p>
                    <p className="text-lg font-semibold mt-1">{commissionRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verification Status</p>
                    <Badge variant={store.isVerified ? "default" : "outline"} className="mt-1">
                      {store.isVerified ? "VERIFIED" : "PENDING"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Store Rating</p>
                    <p className="text-lg font-semibold mt-1">{parseFloat(store.rating || "0").toFixed(1)} ⭐ ({store.reviewCount})</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab - Enhanced */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-bold">Your Products</h2>
              <Dialog open={productDialogOpen} onOpenChange={(open) => {
                setProductDialogOpen(open);
                if (!open) {
                  setEditingProduct(null);
                  resetProductForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500" data-testid="button-add-product">
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>Create or update your product</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitProduct} className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-3">
                      <Label className="font-semibold">Product Image</Label>
                      {productImage && (
                        <img src={productImage} alt="Preview" className="w-40 h-40 object-cover rounded-lg" />
                      )}
                      <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={uploading} className="w-full">
                        <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : "Upload Image"}
                      </Button>
                      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input id="name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input id="price" type="number" step="0.01" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="original-price">Original Price</Label>
                        <Input id="original-price" type="number" step="0.01" value={productOriginalPrice} onChange={(e) => setProductOriginalPrice(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="category">Category *</Label>
                        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="ghost" size="sm" className="text-xs">+ Create</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New Category</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="cat-name">Category Name *</Label>
                                <Input id="cat-name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g., Electronics" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cat-slug">Slug</Label>
                                <Input id="cat-slug" value={newCategorySlug} onChange={(e) => setNewCategorySlug(e.target.value)} placeholder="e.g., electronics" />
                              </div>
                              <div className="flex gap-2 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)} className="flex-1">Cancel</Button>
                                <Button type="button" disabled={!newCategoryName || createCategoryMutation.isPending} onClick={() => createCategoryMutation.mutate()} className="flex-1">Create</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <Select value={productCategoryId} onValueChange={setProductCategoryId}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock *</Label>
                      <Input id="stock" type="number" value={productStock} onChange={(e) => setProductStock(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="colors">Available Colors</Label>
                        <Input id="colors" placeholder="e.g., Red, Blue, Black" value={productColors} onChange={(e) => setProductColors(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sizes">Available Sizes</Label>
                        <Input id="sizes" placeholder="e.g., S, M, L, XL" value={productSizes} onChange={(e) => setProductSizes(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="font-semibold">Product Video</Label>
                      {productVideoUrl && (
                        <div className="text-sm text-muted-foreground">✓ Video uploaded</div>
                      )}
                      <Button type="button" variant="outline" onClick={() => videoInputRef.current?.click()} disabled={uploading} className="w-full">
                        <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploading..." : productVideoUrl ? "Change Video" : "Upload Video"}
                      </Button>
                      <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} rows={3} />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="published" checked={productIsPublished} onCheckedChange={setProductIsPublished} />
                      <Label htmlFor="published" className="font-normal">Publish this product</Label>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setProductDialogOpen(false)} className="flex-1">Cancel</Button>
                      <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500">
                        Save Product
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {products.length === 0 ? (
              <Card className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No products yet. Create your first product!</p>
              </Card>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} data-testid={`product-row-${product.id}`}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{categories.find(c => c.id === product.categoryId)?.name || "-"}</TableCell>
                        <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell><Badge variant={product.isPublished ? "default" : "secondary"}>{product.isPublished ? "Published" : "Draft"}</Badge></TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditProduct(product)} data-testid={`button-edit-product-${product.id}`}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteProductMutation.mutate(product.id)} data-testid={`button-delete-product-${product.id}`}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Orders & Reviews Combined Tab */}
          <TabsContent value="orders-reviews" className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Orders Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> Your Orders
                </h3>
                {(vendorOrders as any[]).length === 0 ? (
                  <Card className="text-center py-8">
                    <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-sm">No orders yet</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {(vendorOrders as any[]).slice(0, 10).map((order) => (
                      <Card key={order.id} data-testid={`order-row-${order.id}`} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-sm">{order.buyerName}</p>
                            <p className="text-xs text-muted-foreground">ID: {order.id.substring(0, 8)}</p>
                          </div>
                          <Badge>{order.status}</Badge>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-muted-foreground">{order.items?.length || 0} items</span>
                          <span className="font-bold">${parseFloat(order.total).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{new Date(order.createdAt).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1" data-testid={`button-share-order-${order.id}`}>
                            <Share2 className="h-3 w-3 mr-1" /> Share
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1" data-testid={`button-view-order-${order.id}`}>
                            <Eye className="h-3 w-3 mr-1" /> View
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" /> Customer Reviews
                </h3>
                {(vendorReviews as any[]).length === 0 ? (
                  <Card className="text-center py-8">
                    <Award className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-sm">No reviews yet</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {(vendorReviews as any[]).slice(0, 10).map((review) => (
                      <Card key={review.id} data-testid={`review-card-${review.id}`} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-sm">{review.reviewerName}</p>
                            <p className="text-xs text-muted-foreground">{review.productName}</p>
                          </div>
                          <Badge variant={review.rating >= 4 ? "default" : review.rating >= 3 ? "secondary" : "destructive"}>
                            {review.rating}/5
                          </Badge>
                        </div>
                        <p className="text-xs font-medium mb-1">{review.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Stock Management Tab - Enhanced */}
          <TabsContent value="stock" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-bold">Stock Management</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  const csv = ["Product,In Stock,Sold,Last Updated"];
                  (stockData as any[]).forEach(item => {
                    csv.push(`"${item.name}",${item.stock},${item.sold},${new Date(item.lastUpdated).toISOString()}`);
                  });
                  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "stock-data.csv";
                  a.click();
                }}>
                  <Download className="h-4 w-4 mr-2" /> Download CSV
                </Button>
              </div>
            </div>
            {(stockData as any[]).length === 0 ? (
              <Card className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No products</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {(stockData as any[]).map((item) => (
                  <Card key={item.id} data-testid={`stock-card-${item.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Stock Levels</p>
                        </div>
                        {item.isLowStock && (
                          <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" /> Low</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{item.stock}</p>
                          <p className="text-xs text-muted-foreground">In Stock</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{item.sold}</p>
                          <p className="text-xs text-muted-foreground">Sold</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Updated</p>
                          <p className="text-sm font-medium">{new Date(item.lastUpdated).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Plus className="h-3 w-3 mr-1" /> Stock In
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Trash2 className="h-3 w-3 mr-1" /> Stock Out
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <ArrowDown className="h-3 w-3 mr-1" /> Return
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Combos Tab - Enhanced */}
          <TabsContent value="combos" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-bold">Combo Deals</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500" data-testid="button-add-combo">
                <Plus className="h-4 w-4 mr-2" /> Add Combo
              </Button>
            </div>
            {(combos as any[]).length === 0 ? (
              <Card className="text-center py-12">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No combo deals yet</p>
              </Card>
            ) : (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {(combos as any[]).map((combo) => (
                  <Card key={combo.id} data-testid={`combo-card-${combo.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{combo.name}</CardTitle>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{combo.description}</p>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Combo Price</p>
                            <p className="text-lg font-bold">${parseFloat(combo.price).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Customer Saves</p>
                            <p className="text-lg font-bold text-green-600">${parseFloat(combo.savings).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Products in Combo</p>
                        <div className="flex flex-wrap gap-1">
                          {(combo.productIds || []).slice(0, 3).map((id: string) => (
                            <Badge key={id} variant="secondary" className="text-xs">
                              Prod {id.substring(0, 4)}
                            </Badge>
                          ))}
                          {(combo.productIds?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">+{(combo.productIds?.length || 0) - 3}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t">
                        <Button size="sm" variant="outline" className="flex-1" data-testid={`button-edit-combo-${combo.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1" data-testid={`button-delete-combo-${combo.id}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Affiliates Tab - Enhanced */}
          <TabsContent value="affiliates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Affiliate Program</h2>
              <Dialog open={affiliateDialogOpen} onOpenChange={setAffiliateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500" data-testid="button-add-affiliate-product">
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Product to Affiliate Program</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aff-product">Select Product *</Label>
                      <Select value={selectedAffProduct} onValueChange={setSelectedAffProduct}>
                        <SelectTrigger id="aff-product">
                          <SelectValue placeholder="Choose a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aff-type">Commission Type</Label>
                        <Select value={affCommissionType} onValueChange={(value) => setAffCommissionType(value as "percentage" | "fixed")}>
                          <SelectTrigger id="aff-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aff-value">Commission Value</Label>
                        <Input id="aff-value" type="number" step="0.01" value={affCommissionValue} onChange={(e) => setAffCommissionValue(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setAffiliateDialogOpen(false)} className="flex-1">Cancel</Button>
                      <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500">Add Product</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Affiliate Products</CardTitle>
                  <Award className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{affiliateProducts.length}</div>
                  <p className="text-xs text-muted-foreground">Active programs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  <MousePointerClick className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{affiliateProducts.reduce((sum, ap) => sum + ap.totalClicks, 0)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${affiliateProducts.reduce((sum, ap) => sum + parseFloat(ap.totalCommission || "0"), 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Earned</p>
                </CardContent>
              </Card>
            </div>

            {affiliateProducts.length === 0 ? (
              <Card className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No affiliate products. Start earning commissions!</p>
              </Card>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliateProducts.map((ap) => (
                      <TableRow key={ap.productId}>
                        <TableCell className="font-medium">{ap.productName}</TableCell>
                        <TableCell>{ap.commissionValue}{ap.commissionType === "percentage" ? "%" : "$"}</TableCell>
                        <TableCell>{ap.totalClicks}</TableCell>
                        <TableCell>{ap.totalSales}</TableCell>
                        <TableCell className="font-bold">${parseFloat(ap.totalCommission || "0").toFixed(2)}</TableCell>
                        <TableCell><Badge variant={ap.isActive ? "default" : "secondary"}>{ap.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions" className="space-y-6">
            <h2 className="text-2xl font-bold">Commission History</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${((commissionHistory as any[]) || []).reduce((sum: number, item: any) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                  <Zap className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{commissionRate}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <Hash className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{((commissionHistory as any[]) || []).length}</div>
                </CardContent>
              </Card>
            </div>

            {((commissionHistory as any[]) || []).length === 0 ? (
              <Card className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No commission history yet</p>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Commissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {((commissionHistory as any[]) || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted transition">
                        <div className="flex-1">
                          <p className="font-medium">{item.description || "Commission Entry"}</p>
                          <p className="text-sm text-muted-foreground">{item.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${parseFloat(item.amount).toFixed(2)}</p>
                          <Badge variant={item.status === "completed" ? "default" : "secondary"} className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payment Tab - Enhanced */}
          <TabsContent value="payment" className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Payment & Payouts
            </h2>

            {/* Balance Cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">${totalEarnings.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">${pendingPayout.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{commissionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
                </CardContent>
              </Card>
            </div>

            {/* Withdrawal Request */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Request Withdrawal</CardTitle>
                <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                      <Download className="h-4 w-4 mr-2" /> Request Payout
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Withdrawal</DialogTitle>
                      <DialogDescription>Submit a withdrawal request for your available balance</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Available Balance</Label>
                        <p className="text-2xl font-bold text-green-600">${pendingPayout.toFixed(2)}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="withdrawal-amount">Withdrawal Amount *</Label>
                        <Input id="withdrawal-amount" type="number" step="0.01" max={pendingPayout} value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="withdrawal-method">Payment Method *</Label>
                        <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                          <SelectTrigger id="withdrawal-method">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="stripe">Stripe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={() => setWithdrawalDialogOpen(false)} className="flex-1">Cancel</Button>
                        <Button onClick={() => withdrawalMutation.mutate()} disabled={withdrawalMutation.isPending || !withdrawalAmount} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                          {withdrawalMutation.isPending ? "Processing..." : "Submit Request"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Withdrawals are processed within 3-5 business days. A small processing fee may apply depending on your payment method.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockTransactions.map((tr) => (
                      <div key={tr.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${tr.type === "sale" ? "bg-green-100 dark:bg-green-950" : tr.type === "refund" ? "bg-red-100 dark:bg-red-950" : "bg-gray-100 dark:bg-gray-800"}`}>
                            {tr.type === "sale" ? <ArrowDown className="h-4 w-4 text-green-600" /> : <ArrowUp className="h-4 w-4 text-red-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tr.description}</p>
                            <p className="text-xs text-muted-foreground">{tr.createdAt.toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm ${tr.type === "sale" ? "text-green-600" : "text-red-600"}`}>
                            {tr.type === "sale" ? "+" : "-"}${parseFloat(tr.amount).toFixed(2)}
                          </p>
                          <Badge variant={tr.status === "completed" ? "default" : "secondary"} className="text-xs">{tr.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Withdrawal Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {mockWithdrawals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No withdrawal requests</div>
                ) : (
                  <div className="space-y-3">
                    {mockWithdrawals.map((wr) => (
                      <div key={wr.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">${parseFloat(wr.amount).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{wr.paymentMethod.replace(/_/g, " ")}</p>
                        </div>
                        <div>
                          <Badge variant={wr.status === "completed" ? "default" : wr.status === "processing" ? "secondary" : "outline"}>
                            {wr.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab - Enhanced */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-bold">Store Settings</h2>
            </div>

            {/* Notifications Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                    <div>
                      <p className="font-medium">Order Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified on new orders and updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                    <div>
                      <p className="font-medium">Review Alerts</p>
                      <p className="text-sm text-muted-foreground">Receive alerts when customers review products</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                    <div>
                      <p className="font-medium">Stock Warnings</p>
                      <p className="text-sm text-muted-foreground">Alert when product stock runs low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                    <div>
                      <p className="font-medium">Payment Updates</p>
                      <p className="text-sm text-muted-foreground">Notify on payment transactions and payouts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive promotional and marketing updates</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button className="w-full">Save Notification Settings</Button>
                </div>
              </CardContent>
            </Card>

            {/* Settings Grid */}
            <div className="grid gap-6">
              {/* Update Store Info */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Store Information
                  </CardTitle>
                  <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Update Store Information</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        updateStoreMutation.mutate({ storeName, description: storeDescription, paymentMethod, paymentDetails });
                      }} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="store-name">Store Name *</Label>
                          <Input id="store-name" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="store-description">Store Description</Label>
                          <Textarea id="store-description" value={storeDescription} onChange={(e) => setStoreDescription(e.target.value)} rows={4} />
                        </div>
                        <div className="space-y-3 p-4 bg-muted rounded-lg">
                          <h3 className="font-semibold">Payment Information</h3>
                          <div className="space-y-2">
                            <Label htmlFor="payment-method">Preferred Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                              <SelectTrigger id="payment-method">
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="paypal">PayPal</SelectItem>
                                <SelectItem value="stripe">Stripe</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="payment-details">Payment Details</Label>
                            <Textarea id="payment-details" value={paymentDetails} onChange={(e) => setPaymentDetails(e.target.value)} placeholder="Enter account details" rows={3} />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t">
                          <Button type="button" variant="outline" onClick={() => setSettingsDialogOpen(false)} className="flex-1">Cancel</Button>
                          <Button type="submit" disabled={updateStoreMutation.isPending} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500">
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Store Name</p>
                    <p className="font-semibold">{store.storeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{store.description || "No description"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Update Logo */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Store Logo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {store.logo && (
                    <div className="flex justify-center">
                      <img src={store.logo} alt="Store Logo" className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                  )}
                  <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()} disabled={logoUploading} className="w-full">
                    <Upload className="h-4 w-4 mr-2" /> {logoUploading ? "Uploading..." : "Upload New Logo"}
                  </Button>
                  <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <p className="text-xs text-muted-foreground">Recommended: 300x300px, PNG or JPG</p>
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                  <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Lock className="h-4 w-4 mr-2" /> Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (newPassword !== confirmPassword) {
                          toast({ title: "Passwords do not match", variant: "destructive" });
                          return;
                        }
                        updatePasswordMutation.mutate();
                      }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password *</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password *</Label>
                          <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password *</Label>
                          <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <div className="flex gap-2 pt-4 border-t">
                          <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)} className="flex-1">Cancel</Button>
                          <Button type="submit" disabled={updatePasswordMutation.isPending} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500">
                            {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Last password change: Never</p>
                  <Button variant="outline" className="w-full" size="sm">
                    <Lock className="h-4 w-4 mr-2" /> Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>

              {/* Store Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUpIcon className="h-5 w-5" />
                    Store Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Store Rating</p>
                    <p className="text-2xl font-bold">{parseFloat(store.rating || "0").toFixed(1)} ⭐</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verification</p>
                    <Badge variant={store.isVerified ? "default" : "outline"}>{store.isVerified ? "Verified" : "Pending"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={store.status === "active" ? "default" : "secondary"}>{store.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
