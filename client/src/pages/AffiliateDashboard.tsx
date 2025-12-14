import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
} from "lucide-react";

type AffiliateSection = "dashboard" | "links" | "earnings" | "payouts" | "resources";

const menuItems = [
  { id: "dashboard" as AffiliateSection, title: "Dashboard", icon: LayoutDashboard },
  { id: "links" as AffiliateSection, title: "Referral Links", icon: Link2 },
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
      value: `$${stats?.totalEarnings?.toFixed(2) || "0.00"}`, 
      icon: DollarSign, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      trend: "Lifetime"
    },
    { 
      title: "Pending Payout", 
      value: `$${stats?.pendingPayout?.toFixed(2) || "0.00"}`, 
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
              <span className="font-medium">${stats?.avgOrderValue?.toFixed(2) || "0.00"}</span>
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

function RecentReferralsList() {
  const mockReferrals = [
    { id: 1, customer: "John D.", amount: 125.00, status: "completed", date: "2024-01-15" },
    { id: 2, customer: "Sarah M.", amount: 89.50, status: "completed", date: "2024-01-14" },
    { id: 3, customer: "Mike R.", amount: 245.00, status: "pending", date: "2024-01-13" },
  ];

  if (mockReferrals.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-4">No referrals yet</div>;
  }

  return (
    <div className="space-y-3">
      {mockReferrals.map((referral) => (
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
            <p className="text-sm font-medium">${referral.amount.toFixed(2)}</p>
            <p className="text-xs text-green-500">+${(referral.amount * 0.1).toFixed(2)} earned</p>
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
  const { data, isLoading } = useQuery({
    queryKey: ["/api/affiliate/earnings"],
  });
  const earnings = data as Earning[] | undefined;

  const mockEarnings: Earning[] = [
    { id: 1, date: "2024-01-15", orderId: "ORD-001", orderAmount: 125.00, commission: 12.50, status: "paid" },
    { id: 2, date: "2024-01-14", orderId: "ORD-002", orderAmount: 89.50, commission: 8.95, status: "paid" },
    { id: 3, date: "2024-01-13", orderId: "ORD-003", orderAmount: 245.00, commission: 24.50, status: "pending" },
    { id: 4, date: "2024-01-12", orderId: "ORD-004", orderAmount: 67.00, commission: 6.70, status: "pending" },
  ];

  const displayEarnings: Earning[] = earnings || mockEarnings;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500" data-testid="stat-total-earned">$52.65</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500" data-testid="stat-pending-earnings">$31.20</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-monthly-earnings">$52.65</div>
            <p className="text-xs text-muted-foreground">January 2024</p>
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
                    <TableCell>${earning.orderAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-green-500 font-medium">
                      +${earning.commission.toFixed(2)}
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
  
  const { data, isLoading } = useQuery({
    queryKey: ["/api/affiliate/payouts"],
  });
  const payouts = data as Payout[] | undefined;

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

  const mockPayouts: Payout[] = [
    { id: 1, requestedAt: "2024-01-10", amount: 100.00, status: "completed", paidAt: "2024-01-12", method: "PayPal" },
    { id: 2, requestedAt: "2023-12-15", amount: 75.50, status: "completed", paidAt: "2023-12-17", method: "Bank Transfer" },
  ];

  const displayPayouts: Payout[] = payouts || mockPayouts;

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
                Request a payout for your available balance. Minimum payout is $50.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-bold">$31.20</p>
              </div>
              <div className="space-y-2">
                <Label>Payout Method</Label>
                <Input value="PayPal - john@example.com" disabled />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => requestPayoutMutation.mutate(31.20)}
                disabled={requestPayoutMutation.isPending}
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
            <div className="text-2xl font-bold text-green-500" data-testid="stat-available-balance">$31.20</div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid Out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-paid">$175.50</div>
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
                    <TableCell className="font-medium">${payout.amount.toFixed(2)}</TableCell>
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
