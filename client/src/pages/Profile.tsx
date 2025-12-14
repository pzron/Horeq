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
import { 
  Package, MapPin, CreditCard, Settings, User, ShoppingBag, Truck, 
  Edit, Plus, Trash2, Copy, ExternalLink, TrendingUp, DollarSign,
  MousePointer, Users, Check, Clock, AlertCircle, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { MOCK_ORDERS, MOCK_ADDRESSES, MOCK_PAYMENT_METHODS, MOCK_AFFILIATE_DATA } from "@/lib/mockData";

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
                  <p className="text-sm font-bold">${order.total.toFixed(2)}</p>
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
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} x ${item.price}</p>
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

function AffiliateSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-heading">Affiliate Program</h2>
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <Users className="h-16 w-16 mx-auto text-primary" />
          <h3 className="text-xl font-bold">Join Our Affiliate Program</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Earn commissions by sharing products with your audience. Get up to 10% commission on every sale.
          </p>
          <Button size="lg" className="mt-4" data-testid="button-apply-affiliate">
            Apply Now
          </Button>
        </CardContent>
      </Card>
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
            <p className="text-2xl font-bold">${data.totalEarnings.toFixed(2)}</p>
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
            <p className="text-3xl font-bold text-primary">${data.availableForWithdrawal.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mb-4">Available for withdrawal</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              <span>Pending: ${data.pendingEarnings.toFixed(2)}</span>
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
              <span className="font-bold text-primary">${data.stats.thisMonth.earnings.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="text-xs text-muted-foreground">
              vs Last Month: {data.stats.lastMonth.earnings > data.stats.thisMonth.earnings ? '-' : '+'}
              ${Math.abs(data.stats.thisMonth.earnings - data.stats.lastMonth.earnings).toFixed(2)}
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
                  <p className="font-bold text-primary">+${ref.commission.toFixed(2)}</p>
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
