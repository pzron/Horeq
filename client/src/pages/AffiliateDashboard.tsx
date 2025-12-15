import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  pendingPayout: number;
  conversionRate: number;
  monthlyProgress: number;
  avgOrderValue: number;
  totalReferrals: number;
}

interface Earning {
  id: number;
  date: string;
  orderId: string;
  orderAmount: number;
  commission: number;
  status: string;
}

interface Payout {
  id: number;
  requestedAt: string;
  amount: number;
  status: string;
  paidAt: string | null;
  method: string;
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  Link2,
  DollarSign,
  TrendingUp,
  MousePointer,
  Users,
  LogOut,
  Copy,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Wallet,
  ArrowUpRight,
  Calendar,
  Download,
  Share2,
  Tag,
  Plus,
  Percent,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AffiliateSection = "dashboard" | "links" | "coupons" | "earnings" | "payouts" | "resources";

const menuItems = [
  { id: "dashboard" as AffiliateSection, title: "Dashboard", icon: LayoutDashboard },
  { id: "links" as AffiliateSection, title: "Referral Links", icon: Link2 },
  { id: "coupons" as AffiliateSection, title: "Coupons", icon: Tag },
  { id: "earnings" as AffiliateSection, title: "Earnings", icon: DollarSign },
  { id: "payouts" as AffiliateSection, title: "Payouts", icon: Wallet },
  { id: "resources" as AffiliateSection, title: "Resources", icon: Share2 },
];

export default function AffiliateDashboard() {
  const [activeSection, setActiveSection] = useState<AffiliateSection>("dashboard");
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
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Affiliate Portal</h2>
                <p className="text-xs text-muted-foreground">Partner Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        className={activeSection === item.id ? "bg-sidebar-accent" : ""}
                        data-testid={`nav-affiliate-${item.id}`}
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
                <p className="text-xs text-muted-foreground truncate">{user?.affiliateCode || "Partner"}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={handleLogout}
              data-testid="button-affiliate-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-4 border-b bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-affiliate-sidebar-toggle" />
              <div>
                <h1 className="text-xl font-bold capitalize" data-testid="text-affiliate-section-title">
                  {activeSection === "dashboard" ? "Affiliate Dashboard" : activeSection}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {activeSection === "dashboard" 
                    ? `Welcome back, ${user?.name || "Partner"}` 
                    : `Manage your ${activeSection}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm" data-testid="link-affiliate-view-site">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Store
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            {activeSection === "dashboard" && <AffiliateDashboardOverview user={user} />}
            {activeSection === "links" && <ReferralLinksSection user={user} />}
            {activeSection === "coupons" && <CouponsSection />}
            {activeSection === "earnings" && <EarningsSection />}
            {activeSection === "payouts" && <PayoutsSection />}
            {activeSection === "resources" && <ResourcesSection />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AffiliateDashboardOverview({ user }: { user: any }) {
  const { toast } = useToast();
  
  const { data, isLoading } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });
  const stats = data as AffiliateStats | undefined;

  const affiliateLink = `${window.location.origin}?ref=${user?.affiliateCode || ""}`;

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link Copied",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const statCards = [
    { 
      title: "Total Clicks", 
      value: stats?.totalClicks || 0, 
      icon: MousePointer, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      trend: "+12% this month"
    },
    { 
      title: "Conversions", 
      value: stats?.totalConversions || 0, 
      icon: TrendingUp, 
      color: "text-green-500", 
      bg: "bg-green-500/10",
      trend: "+8% this month"
    },
    { 
      title: "Total Earnings", 
      value: formatCurrency(stats?.totalEarnings || 0), 
      icon: DollarSign, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      trend: "Lifetime"
    },
    { 
      title: "Pending Payout", 
      value: formatCurrency(stats?.pendingPayout || 0), 
      icon: Wallet, 
      color: "text-orange-500", 
      bg: "bg-orange-500/10",
      trend: "Available to withdraw"
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Your Referral Link</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Share this link to earn 10% commission on every sale
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="bg-background px-3 py-2 rounded-lg text-sm border" data-testid="text-affiliate-link">
                  {affiliateLink}
                </code>
                <Button size="sm" onClick={copyLink} data-testid="button-copy-affiliate-link">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-3xl font-bold text-purple-500">10%</div>
              <p className="text-sm text-muted-foreground">Commission Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <div className="text-2xl font-bold" data-testid={`stat-affiliate-${stat.title.toLowerCase().replace(' ', '-')}`}>
                {isLoading ? "..." : stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Referrals</CardTitle>
            <CardDescription>Latest customer activity from your links</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentReferralsList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Overview</CardTitle>
            <CardDescription>Your conversion metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Conversion Rate</span>
                <span className="text-sm font-medium">
                  {stats?.conversionRate?.toFixed(1) || "0"}%
                </span>
              </div>
              <Progress value={stats?.conversionRate || 0} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Monthly Goal</span>
                <span className="text-sm font-medium">
                  {stats?.monthlyProgress || 0}%
                </span>
              </div>
              <Progress value={stats?.monthlyProgress || 0} className="h-2" />
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Average Order Value</span>
              <span className="font-medium">{formatCurrency(stats?.avgOrderValue || 0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Referrals</span>
              <span className="font-medium">{stats?.totalReferrals || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface Referral {
  id: number;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

function RecentReferralsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/affiliate/referrals"],
  });
  const referrals = data as Referral[] | undefined;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground text-center py-4">Loading referrals...</div>;
  }

  if (!referrals || referrals.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-4">No referrals yet</div>;
  }

  return (
    <div className="space-y-3">
      {referrals.map((referral) => (
        <div key={referral.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${referral.status === "completed" ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
              {referral.status === "completed" 
                ? <CheckCircle className="h-4 w-4 text-green-500" />
                : <Clock className="h-4 w-4 text-yellow-500" />
              }
            </div>
            <div>
              <p className="text-sm font-medium">{referral.customer}</p>
              <p className="text-xs text-muted-foreground">{referral.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{formatCurrency(referral.amount)}</p>
            <p className="text-xs text-green-500">+{formatCurrency(referral.amount * 0.1)} earned</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReferralLinksSection({ user }: { user: any }) {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const affiliateCode = user?.affiliateCode || "";

  const links = [
    { name: "Homepage", path: "/", description: "Main store landing page" },
    { name: "Shop", path: "/shop", description: "All products page" },
    { name: "Deals", path: "/deals", description: "Special offers and discounts" },
    { name: "Combo Packs", path: "/combo", description: "Value bundle packages" },
  ];

  const copyLink = (path: string) => {
    const fullLink = `${baseUrl}${path}?ref=${affiliateCode}`;
    navigator.clipboard.writeText(fullLink);
    toast({
      title: "Link Copied",
      description: "Referral link copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Use this code in all your referral links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg">
              <span className="text-2xl font-bold text-white" data-testid="text-affiliate-code">
                {affiliateCode || "N/A"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">Commission Rate: 10%</p>
              <p className="text-xs text-muted-foreground">On every successful sale</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Pre-built referral links for different pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {links.map((link) => (
              <div 
                key={link.path} 
                className="flex items-center justify-between p-4 rounded-lg border"
                data-testid={`row-link-${link.name.toLowerCase()}`}
              >
                <div>
                  <p className="font-medium">{link.name}</p>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                  <code className="text-xs text-muted-foreground mt-1 block">
                    {baseUrl}{link.path}?ref={affiliateCode}
                  </code>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyLink(link.path)}
                  data-testid={`button-copy-link-${link.name.toLowerCase()}`}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EarningsSection() {
  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: ["/api/affiliate/earnings"],
  });
  const earnings = earningsData as Earning[] | undefined;

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });
  const stats = statsData as AffiliateStats | undefined;

  const isLoading = earningsLoading || statsLoading;
  const displayEarnings: Earning[] = earnings || [];

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500" data-testid="stat-total-earned">
              {statsLoading ? "..." : formatCurrency(stats?.totalEarnings || 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500" data-testid="stat-pending-earnings">
              {statsLoading ? "..." : formatCurrency(stats?.pendingPayout || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-monthly-earnings">
              {statsLoading ? "..." : formatCurrency(stats?.totalEarnings || 0)}
            </div>
            <p className="text-xs text-muted-foreground">{currentMonth}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
          <CardDescription>Detailed breakdown of your commissions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Order Amount</TableHead>
                <TableHead>Commission (10%)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading earnings...
                  </TableCell>
                </TableRow>
              ) : displayEarnings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No earnings yet. Start sharing your referral links!
                  </TableCell>
                </TableRow>
              ) : (
                displayEarnings.map((earning: any) => (
                  <TableRow key={earning.id} data-testid={`row-earning-${earning.id}`}>
                    <TableCell>{earning.date}</TableCell>
                    <TableCell className="font-mono">{earning.orderId}</TableCell>
                    <TableCell>{formatCurrency(earning.orderAmount)}</TableCell>
                    <TableCell className="text-green-500 font-medium">
                      +{formatCurrency(earning.commission)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={earning.status === "paid" ? "default" : "secondary"}>
                        {earning.status}
                      </Badge>
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

function PayoutsSection() {
  const { toast } = useToast();
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  
  const { data: payoutsData, isLoading } = useQuery({
    queryKey: ["/api/affiliate/payouts"],
  });
  const payouts = payoutsData as Payout[] | undefined;

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });
  const stats = statsData as AffiliateStats | undefined;

  const requestPayoutMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("POST", "/api/affiliate/request-payout", { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/payouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/stats"] });
      toast({
        title: "Payout Requested",
        description: "Your payout request has been submitted for review.",
      });
      setRequestDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Failed to submit payout request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const displayPayouts: Payout[] = payouts || [];
  const pendingBalance = stats?.pendingPayout || 0;
  const totalPaidOut = displayPayouts
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Payout Management</h2>
          <p className="text-sm text-muted-foreground">Request and track your payouts</p>
        </div>
        <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-request-payout">
              <DollarSign className="h-4 w-4 mr-2" />
              Request Payout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Payout</DialogTitle>
              <DialogDescription>
                Request a payout for your available balance. Minimum payout is ৳50.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? "..." : formatCurrency(pendingBalance)}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Payout Method</Label>
                <Input value="PayPal / Bank Transfer" disabled />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => requestPayoutMutation.mutate(pendingBalance)}
                disabled={requestPayoutMutation.isPending || pendingBalance < 50}
                data-testid="button-confirm-payout"
              >
                {requestPayoutMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500" data-testid="stat-available-balance">
              {statsLoading ? "..." : formatCurrency(pendingBalance)}
            </div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid Out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-paid">
              {isLoading ? "..." : formatCurrency(totalPaidOut)}
            </div>
            <p className="text-xs text-muted-foreground">All time payouts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>Your past payout requests and payments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requested</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading payouts...
                  </TableCell>
                </TableRow>
              ) : displayPayouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No payout history yet
                  </TableCell>
                </TableRow>
              ) : (
                displayPayouts.map((payout: any) => (
                  <TableRow key={payout.id} data-testid={`row-payout-${payout.id}`}>
                    <TableCell>{payout.requestedAt}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(payout.amount)}</TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell>
                      <Badge variant={
                        payout.status === "completed" ? "default" :
                        payout.status === "pending" ? "secondary" : "destructive"
                      }>
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{payout.paidAt || "-"}</TableCell>
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

interface Coupon {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minPurchase: number | null;
  maxUses: number | null;
  currentUses: number;
  expiresAt: string | null;
  isActive: boolean;
}

function CouponsSection() {
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [maxUses, setMaxUses] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/affiliate/coupons"],
  });
  const coupons = data as Coupon[] | undefined;

  const createCouponMutation = useMutation({
    mutationFn: async (couponData: any) => {
      return apiRequest("POST", "/api/affiliate/coupons", couponData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/coupons"] });
      toast({
        title: "Coupon Created",
        description: "Your new coupon code has been created successfully.",
      });
      setCreateDialogOpen(false);
      setNewCouponCode("");
      setDiscountType("percentage");
      setDiscountValue("");
      setMinPurchase("");
      setMaxUses("");
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create coupon. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateCoupon = () => {
    if (!newCouponCode || !discountValue) {
      toast({
        title: "Missing Fields",
        description: "Please fill in the coupon code and discount value.",
        variant: "destructive",
      });
      return;
    }
    
    const parsedDiscountValue = parseFloat(discountValue);
    if (isNaN(parsedDiscountValue) || parsedDiscountValue <= 0) {
      toast({
        title: "Invalid Discount",
        description: "Please enter a valid discount value greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const parsedMinPurchase = minPurchase ? parseFloat(minPurchase) : null;
    const parsedMaxUses = maxUses ? parseInt(maxUses, 10) : null;

    if (parsedMinPurchase !== null && isNaN(parsedMinPurchase)) {
      toast({
        title: "Invalid Minimum Purchase",
        description: "Please enter a valid minimum purchase amount.",
        variant: "destructive",
      });
      return;
    }

    if (parsedMaxUses !== null && isNaN(parsedMaxUses)) {
      toast({
        title: "Invalid Max Uses",
        description: "Please enter a valid maximum uses number.",
        variant: "destructive",
      });
      return;
    }

    createCouponMutation.mutate({
      code: newCouponCode.toUpperCase(),
      discountType,
      discountValue: parsedDiscountValue,
      minPurchase: parsedMinPurchase,
      maxUses: parsedMaxUses,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Coupon Management</h2>
          <p className="text-sm text-muted-foreground">Create and manage your promotional coupons</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-coupon">
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Create a promotional coupon for your referrals.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <Input 
                  placeholder="e.g., SAVE10"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  data-testid="input-coupon-code"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger data-testid="select-discount-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input 
                    type="number"
                    placeholder={discountType === "percentage" ? "10" : "100"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    data-testid="input-discount-value"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min. Purchase (optional)</Label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value)}
                    data-testid="input-min-purchase"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Uses (optional)</Label>
                  <Input 
                    type="number"
                    placeholder="Unlimited"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    data-testid="input-max-uses"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCoupon}
                disabled={createCouponMutation.isPending}
                data-testid="button-confirm-create-coupon"
              >
                {createCouponMutation.isPending ? "Creating..." : "Create Coupon"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Coupons</CardTitle>
          <CardDescription>Manage your promotional coupon codes</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min. Purchase</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading coupons...
                  </TableCell>
                </TableRow>
              ) : !coupons || coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No coupons yet. Create your first coupon to start promoting!
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id} data-testid={`row-coupon-${coupon.id}`}>
                    <TableCell>
                      <code className="font-mono font-bold">{coupon.code}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {coupon.discountType === "percentage" ? (
                          <><Percent className="h-3 w-3" /> {coupon.discountValue}%</>
                        ) : (
                          formatCurrency(coupon.discountValue)
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.minPurchase ? formatCurrency(coupon.minPurchase) : "-"}
                    </TableCell>
                    <TableCell>
                      {coupon.currentUses} / {coupon.maxUses || "∞"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.isActive ? "default" : "secondary"}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </Badge>
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

function ResourcesSection() {
  const resources = [
    {
      title: "Brand Guidelines",
      description: "Logo usage, colors, and brand assets",
      icon: Download,
      action: "Download",
    },
    {
      title: "Marketing Banners",
      description: "Ready-to-use promotional banners",
      icon: Share2,
      action: "View All",
    },
    {
      title: "Product Images",
      description: "High-quality product photography",
      icon: Download,
      action: "Download",
    },
    {
      title: "Social Media Kit",
      description: "Posts, stories, and captions",
      icon: Share2,
      action: "View All",
    },
  ];

  const tips = [
    "Share your links on social media during peak hours (12-2pm and 7-9pm)",
    "Create product reviews and tutorials featuring your affiliate links",
    "Use email marketing to reach your existing audience",
    "Engage with your followers and answer product questions",
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Marketing Materials</CardTitle>
          <CardDescription>Download resources to promote HOREQ products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <div 
                key={resource.title}
                className="flex items-center justify-between p-4 rounded-lg border"
                data-testid={`card-resource-${resource.title.toLowerCase().replace(' ', '-')}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <resource.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{resource.title}</p>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  {resource.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Success Tips</CardTitle>
          <CardDescription>Best practices to maximize your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="bg-green-500/10 p-1 rounded-full mt-0.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Contact our affiliate support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm">
                Have questions about the affiliate program? Our dedicated team is here to help.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Email: affiliates@horeq.com
              </p>
            </div>
            <Button variant="outline" data-testid="button-contact-support">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
