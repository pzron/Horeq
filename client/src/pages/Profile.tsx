import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, MapPin, CreditCard, Settings, User, ShoppingBag, Truck, 
  Edit, Plus, Trash2, Copy, ExternalLink, TrendingUp, DollarSign,
  MousePointer, Users, Check, Clock, AlertCircle, ChevronRight, Heart, ShoppingCart, X
} from "lucide-react";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { MOCK_ORDERS, MOCK_ADDRESSES, MOCK_PAYMENT_METHODS, MOCK_AFFILIATE_DATA } from "@/lib/mockData";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

function PersonalInfoSection() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading">Personal Information</h2>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} data-testid="button-edit-profile">
          <Edit className="h-4 w-4 mr-2" /> {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" disabled={!isEditing} data-testid="input-first-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" disabled={!isEditing} data-testid="input-last-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" disabled={!isEditing} data-testid="input-email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+880 1712-345678" disabled={!isEditing} data-testid="input-phone" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" defaultValue="Shopping enthusiast" disabled={!isEditing} data-testid="input-bio" />
            </div>
          </div>
          {isEditing && (
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button data-testid="button-save-profile">Save Changes</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading">Order History</h2>

      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => (
          <Card key={order.id} className="overflow-hidden" data-testid={`card-order-${order.id}`}>
            <div className="bg-muted/30 p-4 flex flex-wrap justify-between items-center gap-3 border-b">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">ORDER ID</p>
                  <p className="text-sm font-bold">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">DATE</p>
                  <p className="text-sm">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">TOTAL</p>
                  <p className="text-sm font-bold">{formatCurrency(order.total)}</p>
                </div>
              </div>
              <Badge 
                variant={order.status === 'delivered' ? 'default' : order.status === 'shipped' ? 'secondary' : 'outline'}
                className={order.status === 'delivered' ? 'bg-green-500' : ''}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <CardContent className="p-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center py-2">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                {order.trackingNumber && (
                  <Button size="sm" variant="outline" className="gap-1" data-testid={`button-track-${order.id}`}>
                    <Truck className="h-4 w-4" /> Track Order
                  </Button>
                )}
                <Button size="sm" variant="ghost">View Details</Button>
                {order.status === 'delivered' && <Button size="sm" variant="ghost">Write Review</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AddressesSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading">My Addresses</h2>
        <Button size="sm" className="gap-1" data-testid="button-add-address">
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ADDRESSES.map((addr) => (
          <Card key={addr.id} className={addr.isDefault ? 'border-primary' : ''} data-testid={`card-address-${addr.id}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={addr.isDefault ? 'default' : 'outline'}>{addr.label}</Badge>
                  {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" data-testid={`button-edit-address-${addr.id}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" data-testid={`button-delete-address-${addr.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="font-medium">{addr.name}</p>
              <p className="text-sm text-muted-foreground">{addr.phone}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {addr.address}<br />
                {addr.city}, {addr.state} {addr.zipCode}<br />
                {addr.country}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PaymentsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading">Payment Methods</h2>
        <Button size="sm" className="gap-1" data-testid="button-add-payment">
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="space-y-3">
        {MOCK_PAYMENT_METHODS.map((method) => (
          <Card key={method.id} className={method.isDefault ? 'border-primary' : ''} data-testid={`card-payment-${method.id}`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-16 bg-muted rounded-md flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  {method.type === 'card' ? (
                    <>
                      <p className="font-medium">{method.brand} **** {method.last4}</p>
                      <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">{method.provider}</p>
                      <p className="text-sm text-muted-foreground">{method.number}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault && <Badge variant="secondary">Default</Badge>}
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Order Updates</p>
              <p className="text-sm text-muted-foreground">Get notified about your order status</p>
            </div>
            <Switch defaultChecked data-testid="switch-order-updates" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Promotional Emails</p>
              <p className="text-sm text-muted-foreground">Receive deals and offers</p>
            </div>
            <Switch data-testid="switch-promo-emails" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
            </div>
            <Switch defaultChecked data-testid="switch-sms" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your password</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-change-password">Change</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra security</p>
            </div>
            <Switch data-testid="switch-2fa" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account</p>
            </div>
            <Button variant="destructive" size="sm" data-testid="button-delete-account">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrackingSection() {
  const activeOrders = MOCK_ORDERS.filter(o => o.status !== 'delivered');

  const trackingSteps = [
    { status: 'processing', label: 'Order Placed', icon: Check },
    { status: 'confirmed', label: 'Confirmed', icon: Check },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: Check },
  ];

  const getStepStatus = (orderStatus: string, stepStatus: string) => {
    const order = ['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
    return order.indexOf(orderStatus) >= order.indexOf(stepStatus);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading">Delivery Tracking</h2>

      {activeOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No active orders to track</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeOrders.map((order) => (
            <Card key={order.id} data-testid={`card-tracking-${order.id}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order {order.id}</CardTitle>
                    <CardDescription>
                      {order.trackingNumber && `Tracking: ${order.trackingNumber}`}
                    </CardDescription>
                  </div>
                  <Badge>{order.carrier}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className="flex justify-between">
                    {trackingSteps.map((step, idx) => {
                      const isComplete = getStepStatus(order.status, step.status);
                      const isCurrent = order.status === step.status;
                      return (
                        <div key={step.status} className="flex flex-col items-center flex-1">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                            isComplete ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                          } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                            <step.icon className="h-4 w-4" />
                          </div>
                          <p className={`text-xs mt-2 text-center ${isComplete ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-0">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${(['processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'].indexOf(order.status) / 4) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Delivery</span>
                    <span className="text-sm font-medium">{order.estimatedDelivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Shipping Address</span>
                    <span className="text-sm">{order.shippingAddress}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistSection() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.salePrice || item.price,
      originalPrice: item.price,
      quantity: 1,
      image: item.images?.[0] || item.image,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleRemove = (item: any) => {
    removeFromWishlist(item.id);
    toast({
      title: "Removed from wishlist",
      description: `${item.name} has been removed.`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading">My Wishlist</h2>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link href="/shop">
              <Button data-testid="button-browse-products">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} data-testid={`card-wishlist-${item.id}`}>
              <CardContent className="p-4">
                <div className="relative">
                  <img 
                    src={item.images?.[0] || item.image || "https://placehold.co/200x200"} 
                    alt={item.name} 
                    className="w-full h-40 object-cover rounded-lg mb-3" 
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => handleRemove(item)}
                    data-testid={`button-remove-wishlist-${item.id}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <h4 className="font-medium line-clamp-1">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  {item.salePrice ? (
                    <>
                      <span className="font-bold text-primary">{formatCurrency(item.salePrice)}</span>
                      <span className="text-sm text-muted-foreground line-through">{formatCurrency(item.price)}</span>
                    </>
                  ) : (
                    <span className="font-bold">{formatCurrency(item.price)}</span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={() => handleAddToCart(item)}
                    data-testid={`button-add-to-cart-${item.id}`}
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>
                  <Link href={`/product/${item.id}`}>
                    <Button size="sm" variant="outline" data-testid={`button-view-${item.id}`}>
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const affiliateFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  socialMedia: z.string().min(3, "Please enter your social media handle"),
  platform: z.string().min(1, "Please select a platform"),
  audience: z.string().min(1, "Please enter your audience size"),
  reason: z.string().min(20, "Please provide at least 20 characters explaining why you want to join"),
});

type AffiliateFormData = z.infer<typeof affiliateFormSchema>;

function AffiliateSection() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { toast } = useToast();

  const form = useForm<AffiliateFormData>({
    resolver: zodResolver(affiliateFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      website: "",
      socialMedia: "",
      platform: "",
      audience: "",
      reason: "",
    },
  });

  const onSubmit = async (data: AffiliateFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsApproved(true);
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you within 2-3 business days.",
    });
  };

  if (isApproved) {
    return <AffiliateDashboardSection />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading">Affiliate Program</h2>
      
      {!showForm ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Users className="h-16 w-16 mx-auto text-primary" />
            <h3 className="text-xl font-bold">Join Our Affiliate Program</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Earn commissions by sharing products with your audience. Get up to 10% commission on every sale.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">10%</p>
                <p className="text-sm text-muted-foreground">Commission Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">30 Days</p>
                <p className="text-sm text-muted-foreground">Cookie Duration</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">Monthly</p>
                <p className="text-sm text-muted-foreground">Payouts</p>
              </div>
            </div>
            <Button size="lg" className="mt-4" onClick={() => setShowForm(true)} data-testid="button-apply-affiliate">
              Apply Now
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Application</CardTitle>
            <CardDescription>Fill out the form below to apply for our affiliate program</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} data-testid="input-affiliate-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} data-testid="input-affiliate-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+880 1xxx-xxxxxx" {...field} data-testid="input-affiliate-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourwebsite.com" {...field} data-testid="input-affiliate-website" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-affiliate-platform">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="blog">Blog/Website</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="socialMedia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Social Media Handle</FormLabel>
                        <FormControl>
                          <Input placeholder="@yourusername" {...field} data-testid="input-affiliate-social" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audience Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-affiliate-audience">
                              <SelectValue placeholder="Select audience size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1k-10k">1K - 10K followers</SelectItem>
                            <SelectItem value="10k-50k">10K - 50K followers</SelectItem>
                            <SelectItem value="50k-100k">50K - 100K followers</SelectItem>
                            <SelectItem value="100k-500k">100K - 500K followers</SelectItem>
                            <SelectItem value="500k+">500K+ followers</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to join our affiliate program?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself and why you'd be a great affiliate partner..." 
                          className="min-h-[100px]"
                          {...field} 
                          data-testid="textarea-affiliate-reason" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} data-testid="button-cancel-affiliate">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} data-testid="button-submit-affiliate">
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AffiliateDashboardSection() {
  const data = MOCK_AFFILIATE_DATA;
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading">Affiliate Dashboard</h2>
        <Badge className="bg-green-500">{data.tier} Member</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{formatCurrency(data.totalEarnings)}</p>
            <p className="text-xs text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MousePointer className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{data.totalClicks}</p>
            <p className="text-xs text-muted-foreground">Total Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{data.totalConversions}</p>
            <p className="text-xs text-muted-foreground">Conversions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{data.conversionRate}%</p>
            <p className="text-xs text-muted-foreground">Conv. Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Affiliate Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Affiliate Code</CardTitle>
          <CardDescription>Share this code with your audience to earn commissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input value={data.code} readOnly className="font-mono text-lg" data-testid="input-affiliate-code" />
            <Button variant="outline" onClick={copyCode} className="shrink-0 gap-1" data-testid="button-copy-code">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink className="h-4 w-4" /> Share Link
            </Button>
            <p className="text-sm text-muted-foreground flex items-center">
              Commission Rate: <span className="font-bold text-primary ml-1">{data.commission}%</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatCurrency(data.availableForWithdrawal)}</p>
            <p className="text-sm text-muted-foreground mb-4">Available for withdrawal</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              <span>Pending: {formatCurrency(data.pendingEarnings)}</span>
            </div>
            <Button className="w-full" data-testid="button-withdraw">Request Withdrawal</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Clicks</span>
              <span className="font-medium">{data.stats.thisMonth.clicks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Conversions</span>
              <span className="font-medium">{data.stats.thisMonth.conversions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Earnings</span>
              <span className="font-bold text-primary">{formatCurrency(data.stats.thisMonth.earnings)}</span>
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground">
              vs Last Month: {data.stats.lastMonth.earnings > data.stats.thisMonth.earnings ? '-' : '+'}
              {formatCurrency(Math.abs(data.stats.thisMonth.earnings - data.stats.lastMonth.earnings))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentReferrals.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">{ref.orderId}</p>
                  <p className="text-sm text-muted-foreground">{ref.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">+{formatCurrency(ref.commission)}</p>
                  <Badge variant={ref.status === 'paid' ? 'default' : 'secondary'} className="text-xs">
                    {ref.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Profile() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const defaultTab = urlParams.get('tab') || 'info';

  const sidebarItems = [
    { id: 'info', label: 'Personal Info', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'tracking', label: 'Delivery Tracking', icon: Truck },
    { id: 'affiliate', label: 'Affiliate Program', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue={defaultTab} className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <Card className="w-full md:w-72 h-fit shrink-0">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 relative">
                <Avatar className="h-20 w-20 border-4 border-primary/10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Badge className="absolute bottom-0 right-0 bg-green-500 border-2 border-white">Verified</Badge>
              </div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>john.doe@example.com</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <TabsList className="flex flex-col w-full h-auto bg-transparent gap-1">
                {sidebarItems.map((item) => (
                  <TabsTrigger 
                    key={item.id}
                    value={item.id} 
                    className="w-full justify-start gap-2 px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg"
                    data-testid={`tab-${item.id}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardContent>
          </Card>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <TabsContent value="info" className="mt-0"><PersonalInfoSection /></TabsContent>
            <TabsContent value="orders" className="mt-0"><OrdersSection /></TabsContent>
            <TabsContent value="wishlist" className="mt-0"><WishlistSection /></TabsContent>
            <TabsContent value="addresses" className="mt-0"><AddressesSection /></TabsContent>
            <TabsContent value="payments" className="mt-0"><PaymentsSection /></TabsContent>
            <TabsContent value="tracking" className="mt-0"><TrackingSection /></TabsContent>
            <TabsContent value="affiliate" className="mt-0"><AffiliateSection /></TabsContent>
            <TabsContent value="settings" className="mt-0"><SettingsSection /></TabsContent>
          </div>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
