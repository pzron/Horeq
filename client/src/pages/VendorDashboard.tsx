import { useState } from "react";
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
import { 
  Store, Package, DollarSign, TrendingUp, Settings, Plus, 
  Edit, Trash2, Eye, LogOut, BarChart3, ShoppingCart, Link2, Users, CreditCard, Copy, Check, AlertTriangle, TrendingDown
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

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
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
  const [comboDialogOpen, setComboDialogOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<any>(null);
  const [comboName, setComboName] = useState("");
  const [comboDescription, setComboDescription] = useState("");
  const [comboPrice, setComboPrice] = useState("");
  const [comboDiscountPercent, setComboDiscountPercent] = useState("");
  const [comboProductIds, setComboProductIds] = useState<string[]>([]);
  const [affiliateDialogOpen, setAffiliateDialogOpen] = useState(false);
  const [affiliateName, setAffiliateName] = useState("");
  const [affiliateEmail, setAffiliateEmail] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [affiliateCommission, setAffiliateCommission] = useState("5");

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

  const { data: combos = [], isLoading: combosLoading } = useQuery({
    queryKey: ["/api/vendor/combos"],
    enabled: !!store,
  });

  const { data: affiliates = [], isLoading: affiliatesLoading } = useQuery({
    queryKey: ["/api/vendor/affiliates"],
    enabled: !!store,
  });

  const { data: commissionHistory = [], isLoading: commissionsLoading } = useQuery({
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
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
      setComboName("");
      setComboDescription("");
      setComboPrice("");
      setComboDiscountPercent("");
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
      toast({ title: "Combo updated!" });
      setComboDialogOpen(false);
      setEditingCombo(null);
    },
  });

  const deleteComboMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/vendor/combos/${id}`);
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/combos"] });
      toast({ title: "Combo deleted!" });
    },
  });

  const createAffiliateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/vendor/affiliates", data);
      if (!response.ok) throw new Error("Failed to create affiliate");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/affiliates"] });
      toast({ title: "Affiliate invited!" });
      setAffiliateDialogOpen(false);
      setAffiliateName("");
      setAffiliateEmail("");
      setAffiliateCode("");
      setAffiliateCommission("5");
    },
  });

  const deleteAffiliateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/vendor/affiliates/${id}`);
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor/affiliates"] });
      toast({ title: "Affiliate removed!" });
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

  const handleLogout = async () => {
    await logout();
    setLocation("/sweet/vendor");
  };

  if (storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Store Found</h2>
          <p className="text-muted-foreground mb-4">
            Your vendor store has not been set up yet. Please wait for admin approval.
          </p>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-2 rounded-lg">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">{store.storeName}</h1>
              <p className="text-xs text-muted-foreground">Vendor Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} data-testid="button-vendor-logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="overview" data-testid="tab-vendor-overview">Overview</TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-vendor-products">Products</TabsTrigger>
            <TabsTrigger value="combos" data-testid="tab-vendor-combos">Combos</TabsTrigger>
            <TabsTrigger value="affiliates" data-testid="tab-vendor-affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="commissions" data-testid="tab-vendor-commissions">Commissions</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-vendor-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-vendor-total-sales">${totalSales.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Earnings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-vendor-earnings">${totalEarnings.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-vendor-pending">${pendingPayout.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-vendor-products-count">{products.length}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Store Status</span>
                  <Badge variant={store.status === "active" ? "default" : "secondary"}>
                    {store.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission Rate</span>
                  <span>{commissionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified</span>
                  <Badge variant={store.isVerified ? "default" : "outline"}>
                    {store.isVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Products</h2>
              <Dialog open={productDialogOpen} onOpenChange={(open) => {
                setProductDialogOpen(open);
                if (!open) {
                  setEditingProduct(null);
                  resetProductForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-teal-500 to-emerald-500" data-testid="button-add-product">
                    <Plus className="h-4 w-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>
                      Fill in the product details below.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitProduct} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-name">Product Name *</Label>
                        <Input
                          id="product-name"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          required
                          data-testid="input-product-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-slug">Slug</Label>
                        <Input
                          id="product-slug"
                          value={productSlug}
                          onChange={(e) => setProductSlug(e.target.value)}
                          placeholder="auto-generated"
                          data-testid="input-product-slug"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="product-description">Description</Label>
                      <Textarea
                        id="product-description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        rows={3}
                        data-testid="input-product-description"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-price">Price *</Label>
                        <Input
                          id="product-price"
                          type="number"
                          step="0.01"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          required
                          data-testid="input-product-price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-original-price">Original Price</Label>
                        <Input
                          id="product-original-price"
                          type="number"
                          step="0.01"
                          value={productOriginalPrice}
                          onChange={(e) => setProductOriginalPrice(e.target.value)}
                          data-testid="input-product-original-price"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-stock">Stock *</Label>
                        <Input
                          id="product-stock"
                          type="number"
                          value={productStock}
                          onChange={(e) => setProductStock(e.target.value)}
                          required
                          data-testid="input-product-stock"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-image">Image URL *</Label>
                      <Input
                        id="product-image"
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                        required
                        data-testid="input-product-image"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-category">Category *</Label>
                      <Select value={productCategoryId} onValueChange={setProductCategoryId}>
                        <SelectTrigger data-testid="select-product-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="product-published"
                        checked={productIsPublished}
                        onCheckedChange={setProductIsPublished}
                        data-testid="switch-product-published"
                      />
                      <Label htmlFor="product-published">Published (visible to customers)</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setProductDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending} data-testid="button-save-product">
                        {editingProduct ? "Update Product" : "Create Product"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            ) : products.length === 0 ? (
              <Card className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-4">Start by adding your first product</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={product.isPublished ? "default" : "secondary"}
                      >
                        {product.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                      <p className="text-lg font-bold text-teal-600">${product.price}</p>
                      <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditProduct(product)}
                          data-testid={`button-edit-product-${product.id}`}
                        >
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                          disabled={deleteProductMutation.isPending}
                          data-testid={`button-delete-product-${product.id}`}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="combos">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Combo Deals</h2>
              <Dialog open={comboDialogOpen} onOpenChange={setComboDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-teal-500 to-emerald-500" data-testid="button-add-combo"><Plus className="h-4 w-4 mr-2" />Add Combo</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader><DialogTitle>{editingCombo ? "Edit Combo" : "Create New Combo"}</DialogTitle><DialogDescription>Bundle multiple products with special pricing</DialogDescription></DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (editingCombo) {
                      updateComboMutation.mutate({ id: editingCombo.id, data: { name: comboName, description: comboDescription, bundlePrice: parseFloat(comboPrice), discountPercent: parseFloat(comboDiscountPercent) } });
                    } else {
                      createComboMutation.mutate({ name: comboName, description: comboDescription, bundlePrice: parseFloat(comboPrice), discountPercent: parseFloat(comboDiscountPercent) });
                    }
                  }} className="space-y-4">
                    <div className="space-y-2"><Label>Combo Name *</Label><Input value={comboName} onChange={(e) => setComboName(e.target.value)} required data-testid="input-combo-name" /></div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={comboDescription} onChange={(e) => setComboDescription(e.target.value)} rows={3} data-testid="input-combo-description" /></div>
                    <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Bundle Price *</Label><Input type="number" step="0.01" value={comboPrice} onChange={(e) => setComboPrice(e.target.value)} required data-testid="input-combo-price" /></div><div className="space-y-2"><Label>Discount %</Label><Input type="number" step="0.01" value={comboDiscountPercent} onChange={(e) => setComboDiscountPercent(e.target.value)} placeholder="e.g. 10" data-testid="input-combo-discount" /></div></div>
                    <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => { setComboDialogOpen(false); setEditingCombo(null); setComboName(""); setComboDescription(""); setComboPrice(""); setComboDiscountPercent(""); }}>Cancel</Button><Button type="submit">{editingCombo ? "Update" : "Create"}</Button></div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {combosLoading ? <div className="text-center py-8">Loading...</div> : combos.length === 0 ? <Card className="text-center py-12"><ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-medium mb-2">No Combos Yet</h3><p className="text-muted-foreground">Create your first combo bundle</p></Card> : <div className="grid gap-4 md:grid-cols-2">{(combos as any[]).map((combo: any) => <Card key={combo.id} className="overflow-hidden"><CardContent className="p-4"><h3 className="font-medium mb-2">{combo.name}</h3><p className="text-sm text-muted-foreground mb-3">{combo.description}</p><div className="flex justify-between mb-3"><span className="text-lg font-bold">${combo.bundlePrice}</span><Badge>{combo.discountPercent}% off</Badge></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setEditingCombo(combo); setComboName(combo.name); setComboDescription(combo.description); setComboPrice(combo.bundlePrice); setComboDiscountPercent(combo.discountPercent); setComboDialogOpen(true); }} data-testid={`button-edit-combo-${combo.id}`}><Edit className="h-3 w-3 mr-1" />Edit</Button><Button size="sm" variant="destructive" onClick={() => deleteComboMutation.mutate(combo.id)} data-testid={`button-delete-combo-${combo.id}`}><Trash2 className="h-3 w-3 mr-1" />Delete</Button></div></CardContent></Card>)}</div>}
          </TabsContent>

          <TabsContent value="affiliates">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Affiliate Partners</h2>
              <Dialog open={affiliateDialogOpen} onOpenChange={setAffiliateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-teal-500 to-emerald-500" data-testid="button-add-affiliate"><Plus className="h-4 w-4 mr-2" />Invite Affiliate</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>Invite Affiliate Partner</DialogTitle><DialogDescription>Add a new affiliate to promote your products</DialogDescription></DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); createAffiliateMutation.mutate({ name: affiliateName, email: affiliateEmail, code: affiliateCode, commission: parseFloat(affiliateCommission) }); }} className="space-y-4">
                    <div className="space-y-2"><Label>Affiliate Name *</Label><Input value={affiliateName} onChange={(e) => setAffiliateName(e.target.value)} required data-testid="input-affiliate-name" /></div>
                    <div className="space-y-2"><Label>Email *</Label><Input type="email" value={affiliateEmail} onChange={(e) => setAffiliateEmail(e.target.value)} required data-testid="input-affiliate-email" /></div>
                    <div className="space-y-2"><Label>Affiliate Code *</Label><Input value={affiliateCode} onChange={(e) => setAffiliateCode(e.target.value)} placeholder="e.g. AFF-001" required data-testid="input-affiliate-code" /></div>
                    <div className="space-y-2"><Label>Commission Rate % *</Label><Input type="number" step="0.01" value={affiliateCommission} onChange={(e) => setAffiliateCommission(e.target.value)} required data-testid="input-affiliate-commission" /></div>
                    <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => { setAffiliateDialogOpen(false); setAffiliateName(""); setAffiliateEmail(""); setAffiliateCode(""); setAffiliateCommission("5"); }}>Cancel</Button><Button type="submit" disabled={createAffiliateMutation.isPending}>Create</Button></div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {affiliatesLoading ? <div className="text-center py-8">Loading...</div> : affiliates.length === 0 ? <Card className="text-center py-12"><Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-medium mb-2">No Affiliates Yet</h3><p className="text-muted-foreground">Invite your first affiliate partner</p></Card> : <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Code</TableHead><TableHead>Commission</TableHead><TableHead>Conversions</TableHead><TableHead>Earnings</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{affiliates.map((aff: any) => <TableRow key={aff.id} data-testid={`affiliate-row-${aff.id}`}><TableCell className="font-medium">{aff.name}</TableCell><TableCell>{aff.email}</TableCell><TableCell className="font-mono text-sm">{aff.code}</TableCell><TableCell>{aff.commission}%</TableCell><TableCell>{aff.totalConversions || 0}</TableCell><TableCell>${parseFloat(aff.totalEarnings || 0).toFixed(2)}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => deleteAffiliateMutation.mutate(aff.id)} data-testid={`button-delete-affiliate-${aff.id}`}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>}
          </TabsContent>

          <TabsContent value="commissions">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4"><p className="text-sm text-muted-foreground mb-2">Total Earnings</p><p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p><p className="text-xs text-muted-foreground mt-2">From {commissionHistory.length} transactions</p></Card>
                <Card className="p-4"><p className="text-sm text-muted-foreground mb-2">Pending Payout</p><p className="text-2xl font-bold">${pendingPayout.toFixed(2)}</p><Badge className="mt-2">Threshold: $100</Badge></Card>
                <Card className="p-4"><p className="text-sm text-muted-foreground mb-2">Commission Rate</p><p className="text-2xl font-bold">{commissionRate}%</p><p className="text-xs text-muted-foreground mt-2">From platform</p></Card>
              </div>
              <Card>
                <CardHeader><CardTitle>Commission History</CardTitle><CardDescription>Track all your earnings and payouts</CardDescription></CardHeader>
                <CardContent>{commissionsLoading ? <div className="text-center py-8">Loading...</div> : commissionHistory.length === 0 ? <div className="text-center py-8 text-muted-foreground"><CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" /><p>No commission records yet</p><p className="text-sm mt-2">Commission entries will appear as you make sales</p></div> : <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Description</TableHead></TableRow></TableHeader><TableBody>{(commissionHistory as any[]).map((record: any) => <TableRow key={record.id} data-testid={`commission-row-${record.id}`}><TableCell className="text-sm">{new Date(record.createdAt).toLocaleDateString()}</TableCell><TableCell className="capitalize text-sm">{record.type}</TableCell><TableCell className="font-medium text-sm">${parseFloat(record.amount).toFixed(2)}</TableCell><TableCell><Badge variant={record.status === "paid" ? "default" : record.status === "pending" ? "secondary" : "outline"} className="text-xs">{record.status}</Badge></TableCell><TableCell className="text-sm text-muted-foreground">{record.description}</TableCell></TableRow>)}</TableBody></Table>}</CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Manage your store information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Store Name</Label>
                    <p className="font-medium">{store.storeName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Store URL</Label>
                    <p className="font-medium">/store/{store.slug}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="font-medium">{store.description || "No description set"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{store.email || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{store.phone || "Not set"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">City</Label>
                    <p className="font-medium">{store.city || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Country</Label>
                    <p className="font-medium">{store.country || "Not set"}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Commission Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Your commission rate is <span className="font-semibold text-teal-600">{commissionRate}%</span>. 
                    This is the platform fee deducted from each sale.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
