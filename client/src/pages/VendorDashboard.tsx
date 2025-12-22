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
  Copy, Check, AlertTriangle, Upload, Share2, Zap, TrendingDown, Calendar, Hash
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

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const imageInputRef = useRef<HTMLInputElement>(null);

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
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");

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

  const { data: commissionHistory = [] } = useQuery({
    queryKey: ["/api/vendor/commissions"],
    enabled: !!store,
  });

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

  const createComboMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/vendor/combos", data);
      if (!response.ok) throw new Error("Failed to create combo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/combos"] });
      toast({ title: "Combo created successfully!" });
      setComboDialogOpen(false);
      resetComboForm();
    },
  });

  const updateComboMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PATCH", `/api/vendor/combos/${id}`, data);
      if (!response.ok) throw new Error("Failed to update combo");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/combos"] });
      toast({ title: "Combo updated successfully!" });
      setComboDialogOpen(false);
      setEditingCombo(null);
    },
  });

  const deleteComboMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/vendor/combos/${id}`);
      if (!response.ok) throw new Error("Failed to delete combo");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/combos"] });
      toast({ title: "Combo deleted successfully!" });
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
  };

  const resetComboForm = () => {
    setComboName("");
    setComboDescription("");
    setComboPrice("");
    setComboProductIds([]);
    setSelectedProductsForCombo(new Map());
  };

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
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleSubmitCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductsForCombo.size === 0) {
      toast({ title: "Please select at least one product for the combo", variant: "destructive" });
      return;
    }

    const productIds = Array.from(selectedProductsForCombo.keys());
    const totalProductPrice = productIds.reduce((sum, id) => {
      const product = products.find(p => p.id === id);
      return sum + (product ? parseFloat(product.price) : 0);
    }, 0);

    const comboData = {
      name: comboName,
      slug: comboName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: comboDescription,
      image: products.find(p => p.id === productIds[0])?.image || "",
      productIds,
      price: comboPrice || totalProductPrice.toString(),
      originalPrice: totalProductPrice.toString(),
      savings: (totalProductPrice - parseFloat(comboPrice || "0")).toString(),
    };

    if (editingCombo) {
      updateComboMutation.mutate({ id: editingCombo.id, data: comboData });
    } else {
      createComboMutation.mutate(comboData);
    }
  };

  const toggleProductForCombo = (productId: string) => {
    const newMap = new Map(selectedProductsForCombo);
    if (newMap.has(productId)) {
      newMap.delete(productId);
    } else {
      newMap.set(productId, 1);
    }
    setSelectedProductsForCombo(newMap);
  };

  const handleAddAffiliateProduct = () => {
    if (!selectedAffProduct) return;
    const product = products.find(p => p.id === selectedAffProduct);
    if (!product) return;

    const existing = affiliateProducts.find(ap => ap.productId === selectedAffProduct);
    if (existing) {
      toast({ title: "Product already added", variant: "destructive" });
      return;
    }

    setAffiliateProducts([
      ...affiliateProducts,
      {
        productId: selectedAffProduct,
        productName: product.name,
        price: product.price,
        commissionType: affCommissionType,
        commissionValue: affCommissionValue,
        isActive: true,
        totalClicks: 0,
        totalSales: 0,
        totalCommission: "0",
      },
    ]);
    setSelectedAffProduct("");
    setAffCommissionValue("5");
  };

  const removeAffiliateProduct = (productId: string) => {
    setAffiliateProducts(affiliateProducts.filter(ap => ap.productId !== productId));
  };

  const toggleAffiliateProductActive = (productId: string) => {
    setAffiliateProducts(
      affiliateProducts.map(ap =>
        ap.productId === productId ? { ...ap, isActive: !ap.isActive } : ap
      )
    );
  };

  const handleShareProduct = (product: Product) => {
    const shareUrl = `${window.location.origin}/products/${product.slug}`;
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Product link copied to clipboard!" });
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/sweet/vendor");
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
              <Store className="h-6 w-6 text-white" />
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
              <TabsTrigger value="combos" data-testid="tab-vendor-combos">Combos</TabsTrigger>
              <TabsTrigger value="affiliates" data-testid="tab-vendor-affiliates">Affiliates</TabsTrigger>
              <TabsTrigger value="commissions" data-testid="tab-vendor-commissions">Commissions</TabsTrigger>
              <TabsTrigger value="payment" data-testid="tab-vendor-payment">Payment</TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-vendor-settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">All-time sales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">After commission</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
                  <CreditCard className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${pendingPayout.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Awaiting processing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                  <p className="text-xs text-muted-foreground">Total listed</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Store Status & Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
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
                    <DialogDescription>Create or update your product with image upload support</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitProduct} className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="space-y-3">
                      <Label className="font-semibold">Product Image</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition">
                        {productImage ? (
                          <div className="space-y-3">
                            <img src={productImage} alt="Product" className="h-40 w-40 object-cover mx-auto rounded" />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => imageInputRef.current?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" /> Change Image
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer"
                            onClick={() => imageInputRef.current?.click()}
                          >
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-name" className="font-semibold">Product Name *</Label>
                        <Input
                          id="product-name"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="Enter product name"
                          required
                          data-testid="input-product-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-category" className="font-semibold">Category *</Label>
                        <Select value={productCategoryId} onValueChange={setProductCategoryId}>
                          <SelectTrigger data-testid="select-product-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-description" className="font-semibold">Description</Label>
                      <Textarea
                        id="product-description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        placeholder="Enter detailed product description"
                        rows={4}
                        data-testid="input-product-description"
                      />
                    </div>

                    {/* Pricing & Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-price" className="font-semibold">Price (USD) *</Label>
                        <Input
                          id="product-price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          placeholder="0.00"
                          required
                          data-testid="input-product-price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-original-price" className="font-semibold">Original Price</Label>
                        <Input
                          id="product-original-price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={productOriginalPrice}
                          onChange={(e) => setProductOriginalPrice(e.target.value)}
                          placeholder="0.00"
                          data-testid="input-product-original-price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-stock" className="font-semibold">Stock *</Label>
                        <Input
                          id="product-stock"
                          type="number"
                          min="0"
                          value={productStock}
                          onChange={(e) => setProductStock(e.target.value)}
                          placeholder="0"
                          required
                          data-testid="input-product-stock"
                        />
                      </div>
                    </div>

                    {/* Publish Status */}
                    <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                      <Switch
                        id="product-published"
                        checked={productIsPublished}
                        onCheckedChange={setProductIsPublished}
                        data-testid="switch-product-published"
                      />
                      <Label htmlFor="product-published" className="font-medium cursor-pointer">
                        Publish product (visible to customers)
                      </Label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setProductDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createProductMutation.isPending || updateProductMutation.isPending || uploading}
                        className="bg-gradient-to-r from-blue-500 to-purple-500"
                        data-testid="button-save-product"
                      >
                        {editingProduct ? "Update Product" : "Create Product"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {productsLoading ? (
              <Card className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              </Card>
            ) : products.length === 0 ? (
              <Card className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No products yet. Create your first product to get started!</p>
                <Button onClick={() => setProductDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Product
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="flex flex-col hover:shadow-lg transition">
                    <div className="aspect-square bg-muted overflow-hidden rounded-t-lg">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="pt-4 flex-grow space-y-3">
                      <div>
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-2xl font-bold">${parseFloat(product.price).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
                        </div>
                        <Badge variant={product.isPublished ? "default" : "secondary"}>
                          {product.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </CardContent>
                    <div className="p-4 border-t space-y-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditProduct(product)}
                          data-testid="button-edit-product"
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShareProduct(product)}
                          data-testid="button-share-product"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                          data-testid="button-delete-product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Combos Tab */}
          <TabsContent value="combos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Combo Deals</h2>
              <Dialog open={comboDialogOpen} onOpenChange={(open) => {
                setComboDialogOpen(open);
                if (!open) {
                  setEditingCombo(null);
                  resetComboForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500" data-testid="button-add-combo">
                    <Plus className="h-4 w-4 mr-2" /> Create Combo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingCombo ? "Edit Combo" : "Create New Combo"}</DialogTitle>
                    <DialogDescription>Bundle multiple products together with special pricing</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitCombo} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="combo-name" className="font-semibold">Combo Name *</Label>
                        <Input
                          id="combo-name"
                          value={comboName}
                          onChange={(e) => setComboName(e.target.value)}
                          placeholder="e.g., Summer Bundle"
                          required
                          data-testid="input-combo-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="combo-price" className="font-semibold">Combo Price (USD) *</Label>
                        <Input
                          id="combo-price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={comboPrice}
                          onChange={(e) => setComboPrice(e.target.value)}
                          placeholder="0.00"
                          required
                          data-testid="input-combo-price"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="combo-description" className="font-semibold">Description</Label>
                      <Textarea
                        id="combo-description"
                        value={comboDescription}
                        onChange={(e) => setComboDescription(e.target.value)}
                        placeholder="Describe your combo deal"
                        rows={3}
                        data-testid="input-combo-description"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="font-semibold">Select Products for Combo *</Label>
                      <ScrollArea className="border rounded-lg p-4 h-64">
                        <div className="space-y-2">
                          {products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition cursor-pointer"
                              onClick={() => toggleProductForCombo(product.id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedProductsForCombo.has(product.id)}
                                onChange={() => toggleProductForCombo(product.id)}
                                className="cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{product.name}</p>
                                <p className="text-sm text-muted-foreground">${parseFloat(product.price).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedProductsForCombo.size} product{selectedProductsForCombo.size !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setComboDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createComboMutation.isPending || updateComboMutation.isPending}
                        className="bg-gradient-to-r from-blue-500 to-purple-500"
                        data-testid="button-save-combo"
                      >
                        {editingCombo ? "Update Combo" : "Create Combo"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {combos.length === 0 ? (
              <Card className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No combos yet. Bundle products to offer special deals!</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {(combos as any[]).map((combo) => (
                  <Card key={combo.id} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{combo.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{combo.description}</p>
                        <div className="flex gap-2 mb-3">
                          {combo.productIds.map((pid: string) => {
                            const prod = products.find(p => p.id === pid);
                            return prod ? (
                              <Badge key={pid} variant="secondary" className="text-xs">
                                {prod.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-2xl font-bold">${parseFloat(combo.price).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Combo Price</p>
                          </div>
                          <div>
                            <p className="text-lg text-green-600 font-semibold">
                              Save ${parseFloat(combo.savings).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">vs. individual</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" data-testid="button-edit-combo">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteComboMutation.mutate(combo.id)}
                          data-testid="button-delete-combo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Affiliate Products</h2>
              <Dialog open={affiliateDialogOpen} onOpenChange={setAffiliateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500" data-testid="button-add-affiliate-product">
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Product to Affiliate Program</DialogTitle>
                    <DialogDescription>Set commission and pricing for affiliate sales</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aff-product" className="font-semibold">Select Product *</Label>
                      <Select value={selectedAffProduct} onValueChange={setSelectedAffProduct}>
                        <SelectTrigger id="aff-product">
                          <SelectValue placeholder="Choose a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products
                            .filter(p => !affiliateProducts.find(ap => ap.productId === p.id))
                            .map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aff-type" className="font-semibold">Commission Type</Label>
                        <Select
                          value={affCommissionType}
                          onValueChange={(value) => setAffCommissionType(value as "percentage" | "fixed")}
                        >
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
                        <Label htmlFor="aff-value" className="font-semibold">Commission Value</Label>
                        <Input
                          id="aff-value"
                          type="number"
                          step="0.01"
                          value={affCommissionValue}
                          onChange={(e) => setAffCommissionValue(e.target.value)}
                          placeholder="5.00"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setAffiliateDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddAffiliateProduct}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                      >
                        Add Product
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {affiliateProducts.length === 0 ? (
              <Card className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No affiliate products yet. Add products to your affiliate program!</p>
              </Card>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliateProducts.map((ap) => (
                      <TableRow key={ap.productId}>
                        <TableCell className="font-medium">{ap.productName}</TableCell>
                        <TableCell>${parseFloat(ap.price).toFixed(2)}</TableCell>
                        <TableCell>
                          {ap.commissionValue}{ap.commissionType === "percentage" ? "%" : "$"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={ap.isActive ? "default" : "secondary"}>
                            {ap.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleAffiliateProductActive(ap.productId)}
                          >
                            {ap.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeAffiliateProduct(ap.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
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
                  <div className="text-2xl font-bold">
                    ${commissionHistory.reduce((sum: number, item: any) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}
                  </div>
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
                  <div className="text-2xl font-bold">{commissionHistory.length}</div>
                </CardContent>
              </Card>
            </div>

            {commissionHistory.length === 0 ? (
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
                    {(commissionHistory as any[]).map((item, idx) => (
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

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <h2 className="text-2xl font-bold">Payment & Payouts</h2>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Current Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Available for Payout</p>
                    <p className="text-3xl font-bold text-green-600">${pendingPayout.toFixed(2)}</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500">
                    <DollarSign className="h-4 w-4 mr-2" /> Request Payout
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Method</p>
                    <p className="font-semibold">{paymentMethod || store.paymentMethod || "Not set"}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" /> Update Payment Info
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>No payouts processed yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Store Settings</h2>
              <Button
                onClick={() => {
                  setStoreName(store.storeName);
                  setStoreDescription(store.description || "");
                  setPaymentMethod(store.paymentMethod || "");
                  setPaymentDetails(store.paymentDetails || "");
                  setSettingsDialogOpen(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Settings
              </Button>
            </div>

            <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Store Settings</DialogTitle>
                  <DialogDescription>Manage your store information and payment details</DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateStoreMutation.mutate({
                      storeName,
                      description: storeDescription,
                      paymentMethod,
                      paymentDetails,
                    });
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="store-name" className="font-semibold">Store Name *</Label>
                    <Input
                      id="store-name"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      required
                      data-testid="input-store-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store-description" className="font-semibold">Store Description</Label>
                    <Textarea
                      id="store-description"
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      rows={4}
                      placeholder="Tell customers about your store"
                      data-testid="input-store-description"
                    />
                  </div>

                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold">Payment Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="payment-method" className="font-semibold">Preferred Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger id="payment-method">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-details" className="font-semibold">Payment Details</Label>
                      <Textarea
                        id="payment-details"
                        value={paymentDetails}
                        onChange={(e) => setPaymentDetails(e.target.value)}
                        placeholder="Enter your payment details (account, email, wallet address, etc.)"
                        rows={3}
                        data-testid="input-payment-details"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setSettingsDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateStoreMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                      data-testid="button-save-settings"
                    >
                      Save Settings
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Store Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Store Name</p>
                    <p className="font-semibold">{store.storeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{store.description || "No description added yet"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Store ID</p>
                    <p className="text-sm font-mono">{store.id}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Stats</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Combos</p>
                    <p className="text-2xl font-bold">{(combos as any[]).length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Affiliate Products</p>
                    <p className="text-2xl font-bold">{affiliateProducts.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Store Rating</p>
                    <p className="text-2xl font-bold">{parseFloat(store.rating || "0").toFixed(1)} ⭐</p>
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
