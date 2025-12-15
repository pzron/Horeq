import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  pendingPayout: number;
  conversionRate: number;
  monthlyProgress: number;
  avgOrderValue: number;
  totalReferrals: number;
  commission: string;
  code: string;
}

interface Earning {
  id: string;
  date: string;
  orderId: string;
  orderAmount: number;
  commission: number;
  status: string;
}

interface Payout {
  id: string;
  createdAt: string;
  amount: string;
  status: string;
  processedAt: string | null;
  paymentMethod: string;
}

interface Referral {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
  commission: number;
}

interface AffiliateClick {
  id: string;
  affiliateId: string;
  ipAddress: string | null;
  converted: boolean;
  orderId: string | null;
  createdAt: string;
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
import { Textarea } from "@/components/ui/textarea";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  ArrowDownRight,
  Calendar,
  Download,
  Share2,
  Tag,
  Plus,
  Percent,
  Settings,
  BarChart3,
  Target,
  Award,
  Star,
  Crown,
  Gift,
  CreditCard,
  Building2,
  Smartphone,
  Mail,
  Bell,
  Shield,
  Eye,
  EyeOff,
  RefreshCcw,
  FileText,
  TrendingDown,
  Activity,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type AffiliateSection = "dashboard" | "analytics" | "links" | "coupons" | "earnings" | "payouts" | "settings" | "resources";

const menuItems = [
  { id: "dashboard" as AffiliateSection, title: "Dashboard", icon: LayoutDashboard },
  { id: "analytics" as AffiliateSection, title: "Analytics", icon: BarChart3 },
  { id: "links" as AffiliateSection, title: "Referral Links", icon: Link2 },
  { id: "coupons" as AffiliateSection, title: "Coupons", icon: Tag },
  { id: "earnings" as AffiliateSection, title: "Earnings", icon: DollarSign },
  { id: "payouts" as AffiliateSection, title: "Payouts", icon: Wallet },
  { id: "settings" as AffiliateSection, title: "Settings", icon: Settings },
  { id: "resources" as AffiliateSection, title: "Resources", icon: Share2 },
];

function getTierInfo(totalEarnings: number) {
  if (totalEarnings >= 10000) {
    return { tier: "Diamond", color: "text-cyan-500", bg: "bg-cyan-500/10", icon: Crown, nextTier: null, progress: 100 };
  } else if (totalEarnings >= 5000) {
    return { tier: "Platinum", color: "text-purple-500", bg: "bg-purple-500/10", icon: Award, nextTier: "Diamond", progress: ((totalEarnings - 5000) / 5000) * 100, remaining: 10000 - totalEarnings };
  } else if (totalEarnings >= 2000) {
    return { tier: "Gold", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Star, nextTier: "Platinum", progress: ((totalEarnings - 2000) / 3000) * 100, remaining: 5000 - totalEarnings };
  } else if (totalEarnings >= 500) {
    return { tier: "Silver", color: "text-gray-400", bg: "bg-gray-400/10", icon: Award, nextTier: "Gold", progress: ((totalEarnings - 500) / 1500) * 100, remaining: 2000 - totalEarnings };
  }
  return { tier: "Bronze", color: "text-orange-600", bg: "bg-orange-600/10", icon: Award, nextTier: "Silver", progress: (totalEarnings / 500) * 100, remaining: 500 - totalEarnings };
}

export default function AffiliateDashboard() {
  const [activeSection, setActiveSection] = useState<AffiliateSection>("dashboard");
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: statsData } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });
  const stats = statsData as AffiliateStats | undefined;

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const tierInfo = getTierInfo(stats?.totalEarnings || 0);
  const TierIcon = tierInfo.icon;

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

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel>Your Tier</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2">
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${tierInfo.bg}`}>
                    <TierIcon className={`h-5 w-5 ${tierInfo.color}`} />
                    <div>
                      <p className={`font-semibold ${tierInfo.color}`}>{tierInfo.tier}</p>
                      <p className="text-xs text-muted-foreground">
                        {parseFloat(stats?.commission || "10")}% commission
                      </p>
                    </div>
                  </div>
                  {tierInfo.nextTier && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress to {tierInfo.nextTier}</span>
                        <span>{tierInfo.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={tierInfo.progress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(tierInfo.remaining || 0)} to go
                      </p>
                    </div>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.username || "Partner"}</p>
                <p className="text-xs text-muted-foreground truncate">{stats?.code || "Partner"}</p>
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
                  {activeSection === "dashboard" ? "Affiliate Dashboard" : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {activeSection === "dashboard" 
                    ? `Welcome back, ${user?.username || "Partner"}` 
                    : `Manage your ${activeSection}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={tierInfo.bg + " " + tierInfo.color + " border-0"}>
                <TierIcon className="h-3 w-3 mr-1" />
                {tierInfo.tier} Partner
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm" data-testid="link-affiliate-view-site">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Store
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            {activeSection === "dashboard" && <AffiliateDashboardOverview user={user} stats={stats} tierInfo={tierInfo} />}
            {activeSection === "analytics" && <AnalyticsSection />}
            {activeSection === "links" && <ReferralLinksSection user={user} stats={stats} />}
            {activeSection === "coupons" && <CouponsSection />}
            {activeSection === "earnings" && <EarningsSection />}
            {activeSection === "payouts" && <PayoutsSection />}
            {activeSection === "settings" && <SettingsSection user={user} />}
            {activeSection === "resources" && <ResourcesSection />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AffiliateDashboardOverview({ user, stats, tierInfo }: { user: any; stats: AffiliateStats | undefined; tierInfo: any }) {
  const { toast } = useToast();
  
  const { isLoading } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });

  const affiliateLink = `${window.location.origin}?ref=${stats?.code || ""}`;

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link Copied",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const TierIcon = tierInfo.icon;

  const statCards = [
    { 
      title: "Total Clicks", 
      value: stats?.totalClicks || 0, 
      icon: MousePointer, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      trend: stats?.totalClicks && stats.totalClicks > 0 ? "+12%" : "0%",
      trendUp: true
    },
    { 
      title: "Conversions", 
      value: stats?.totalConversions || 0, 
      icon: TrendingUp, 
      color: "text-green-500", 
      bg: "bg-green-500/10",
      trend: stats?.totalConversions && stats.totalConversions > 0 ? "+8%" : "0%",
      trendUp: true
    },
    { 
      title: "Total Earnings", 
      value: formatCurrency(stats?.totalEarnings || 0), 
      icon: DollarSign, 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      trend: "Lifetime",
      trendUp: true
    },
    { 
      title: "Pending Payout", 
      value: formatCurrency(stats?.pendingPayout || 0), 
      icon: Wallet, 
      color: "text-orange-500", 
      bg: "bg-orange-500/10",
      trend: "Available",
      trendUp: true
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">Your Referral Link</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Share this link to earn {parseFloat(stats?.commission || "10")}% commission on every sale
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="bg-background px-3 py-2 rounded-lg text-sm border max-w-xs truncate" data-testid="text-affiliate-link">
                    {affiliateLink}
                  </code>
                  <Button size="sm" onClick={copyLink} data-testid="button-copy-affiliate-link">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-3xl font-bold text-purple-500">{parseFloat(stats?.commission || "10")}%</div>
                <p className="text-sm text-muted-foreground">Commission Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={tierInfo.bg + " border-0"}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg bg-background`}>
                <TierIcon className={`h-6 w-6 ${tierInfo.color}`} />
              </div>
              <div>
                <h3 className={`font-bold text-xl ${tierInfo.color}`}>{tierInfo.tier}</h3>
                <p className="text-sm text-muted-foreground">Partner Status</p>
              </div>
            </div>
            {tierInfo.nextTier ? (
              <>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress to {tierInfo.nextTier}</span>
                  <span className="font-medium">{tierInfo.progress.toFixed(0)}%</span>
                </div>
                <Progress value={tierInfo.progress} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Earn {formatCurrency(tierInfo.remaining || 0)} more to reach {tierInfo.nextTier}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                You've reached the highest tier. Enjoy maximum benefits!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

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
              <div className="flex items-center gap-1 mt-1">
                {stat.trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <p className={`text-xs ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</p>
              </div>
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
              <Progress value={Math.min(stats?.conversionRate || 0, 100)} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Monthly Goal</span>
                <span className="text-sm font-medium">
                  {stats?.monthlyProgress?.toFixed(0) || "0"}%
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
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Commission Rate</span>
              <span className="font-medium">{parseFloat(stats?.commission || "10")}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Share2 className="h-5 w-5" />
              <span className="text-sm">Share Links</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Tag className="h-5 w-5" />
              <span className="text-sm">Create Coupon</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Wallet className="h-5 w-5" />
              <span className="text-sm">Request Payout</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
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
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">No referrals yet</p>
        <p className="text-xs text-muted-foreground mt-1">Start sharing your links to earn commissions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {referrals.slice(0, 5).map((referral) => (
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
              <p className="text-xs text-muted-foreground">
                {typeof referral.date === 'string' 
                  ? referral.date.includes('T') 
                    ? format(new Date(referral.date), 'MMM d, yyyy')
                    : referral.date
                  : format(new Date(referral.date), 'MMM d, yyyy')
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{formatCurrency(referral.amount)}</p>
            <p className="text-xs text-green-500">+{formatCurrency(referral.commission)} earned</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsSection() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });
  const stats = statsData as AffiliateStats | undefined;

  const { data: clicksData, isLoading: clicksLoading } = useQuery({
    queryKey: ["/api/affiliate/clicks"],
  });
  const clicks = clicksData as AffiliateClick[] | undefined;

  const { data: earningsData } = useQuery({
    queryKey: ["/api/affiliate/earnings"],
  });
  const earnings = earningsData as Earning[] | undefined;

  const isLoading = statsLoading || clicksLoading;

  const recentClicks = clicks?.slice(0, 20) || [];
  const convertedClicks = clicks?.filter(c => c.converted).length || 0;
  const totalClicksCount = clicks?.length || 0;
  const realConversionRate = totalClicksCount > 0 ? (convertedClicks / totalClicksCount) * 100 : 0;

  const last7DaysClicks = clicks?.filter(c => {
    const clickDate = new Date(c.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return clickDate >= weekAgo;
  }).length || 0;

  const last30DaysClicks = clicks?.filter(c => {
    const clickDate = new Date(c.createdAt);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return clickDate >= monthAgo;
  }).length || 0;

  const totalEarningsAmount = earnings?.reduce((sum, e) => sum + e.commission, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="analytics-total-clicks">
              {isLoading ? "..." : totalClicksCount}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="analytics-7day-clicks">
              {isLoading ? "..." : last7DaysClicks}
            </div>
            <p className="text-xs text-muted-foreground">Recent clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="analytics-conversion-rate">
              {isLoading ? "..." : realConversionRate.toFixed(1) + "%"}
            </div>
            <p className="text-xs text-muted-foreground">{convertedClicks} conversions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500" data-testid="analytics-total-earned">
              {isLoading ? "..." : formatCurrency(totalEarningsAmount)}
            </div>
            <p className="text-xs text-muted-foreground">From referrals</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Click Performance</CardTitle>
            <CardDescription>Your referral link click statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Last 7 Days</span>
                  <span className="text-sm font-medium">{last7DaysClicks} clicks</span>
                </div>
                <Progress value={Math.min((last7DaysClicks / Math.max(last30DaysClicks, 1)) * 100, 100)} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Last 30 Days</span>
                  <span className="text-sm font-medium">{last30DaysClicks} clicks</span>
                </div>
                <Progress value={Math.min((last30DaysClicks / Math.max(totalClicksCount, 1)) * 100, 100)} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="text-sm font-medium">{realConversionRate.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(realConversionRate, 100)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
            <CardDescription>Commission earnings by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Paid Commissions</span>
                </div>
                <span className="font-medium text-green-500">
                  {formatCurrency(earnings?.filter(e => e.status === 'paid').reduce((s, e) => s + e.commission, 0) || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Pending Commissions</span>
                </div>
                <span className="font-medium text-yellow-500">
                  {formatCurrency(earnings?.filter(e => e.status === 'pending').reduce((s, e) => s + e.commission, 0) || 0)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Lifetime</span>
                <span className="font-bold text-lg">{formatCurrency(stats?.totalEarnings || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Click Activity</CardTitle>
          <CardDescription>Last 20 clicks from your referral links</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">Loading clicks...</TableCell>
                </TableRow>
              ) : recentClicks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No click data yet. Share your links to start tracking!
                  </TableCell>
                </TableRow>
              ) : (
                recentClicks.map((click) => (
                  <TableRow key={click.id}>
                    <TableCell>
                      {format(new Date(click.createdAt), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {click.ipAddress || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={click.converted ? "default" : "secondary"}>
                        {click.converted ? "Converted" : "Clicked"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {click.orderId ? (
                        <span className="font-mono text-sm">{click.orderId.substring(0, 8)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
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

function ReferralLinksSection({ user, stats }: { user: any; stats: AffiliateStats | undefined }) {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  const affiliateCode = stats?.code || "";

  const links = [
    { name: "Homepage", path: "/", description: "Main store landing page", icon: LayoutDashboard },
    { name: "Shop", path: "/shop", description: "All products page", icon: Tag },
    { name: "Deals", path: "/deals", description: "Special offers and discounts", icon: Gift },
    { name: "Combo Packs", path: "/combo", description: "Value bundle packages", icon: Share2 },
  ];

  const copyLink = (path: string) => {
    const fullLink = `${baseUrl}${path}?ref=${affiliateCode}`;
    navigator.clipboard.writeText(fullLink);
    toast({
      title: "Link Copied",
      description: "Referral link copied to clipboard.",
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(affiliateCode);
    toast({
      title: "Code Copied",
      description: "Your affiliate code has been copied.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Use this code in all your referral links and promotions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg">
              <span className="text-2xl font-bold text-white" data-testid="text-affiliate-code">
                {affiliateCode || "N/A"}
              </span>
            </div>
            <Button variant="outline" onClick={copyCode}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </Button>
            <div className="flex-1">
              <p className="text-sm font-medium">Commission Rate: {parseFloat(stats?.commission || "10")}%</p>
              <p className="text-xs text-muted-foreground">On every successful sale through your links</p>
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
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <link.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{link.name}</p>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                    <code className="text-xs text-muted-foreground mt-1 block">
                      {baseUrl}{link.path}?ref={affiliateCode}
                    </code>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyLink(link.path)}
                    data-testid={`button-copy-link-${link.name.toLowerCase()}`}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                  >
                    <a href={`${link.path}?ref=${affiliateCode}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Link Builder</CardTitle>
          <CardDescription>Create a referral link for any page on the store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input 
                placeholder="Enter any page URL (e.g., /product/123)"
                id="custom-link-input"
                data-testid="input-custom-link"
              />
            </div>
            <Button onClick={() => {
              const input = document.getElementById('custom-link-input') as HTMLInputElement;
              const path = input?.value || '/';
              copyLink(path);
            }}>
              <Copy className="h-4 w-4 mr-2" />
              Generate & Copy
            </Button>
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

  const paidEarnings = displayEarnings.filter(e => e.status === 'paid').reduce((s, e) => s + e.commission, 0);
  const pendingEarnings = displayEarnings.filter(e => e.status === 'pending').reduce((s, e) => s + e.commission, 0);

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
              {isLoading ? "..." : formatCurrency(pendingEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-paid-earnings">
              {isLoading ? "..." : formatCurrency(paidEarnings)}
            </div>
            <p className="text-xs text-muted-foreground">Successfully paid</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Earnings History</CardTitle>
              <CardDescription>Detailed breakdown of your commissions</CardDescription>
            </div>
            <Badge variant="secondary">{displayEarnings.length} transactions</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Order Amount</TableHead>
                <TableHead>Commission</TableHead>
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
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p>No earnings yet. Start sharing your referral links!</p>
                  </TableCell>
                </TableRow>
              ) : (
                displayEarnings.map((earning: any) => (
                  <TableRow key={earning.id} data-testid={`row-earning-${earning.id}`}>
                    <TableCell>
                      {typeof earning.date === 'string' && earning.date.includes('T')
                        ? format(new Date(earning.date), 'MMM d, yyyy')
                        : earning.date
                      }
                    </TableCell>
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
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [payoutAmount, setPayoutAmount] = useState("");
  
  const { data: payoutsData, isLoading } = useQuery({
    queryKey: ["/api/affiliate/payouts"],
  });
  const payouts = payoutsData as Payout[] | undefined;

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });
  const stats = statsData as AffiliateStats | undefined;

  const requestPayoutMutation = useMutation({
    mutationFn: async (data: { amount: number; paymentMethod: string }) => {
      return apiRequest("POST", "/api/affiliate/request-payout", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/payouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/stats"] });
      toast({
        title: "Payout Requested",
        description: "Your payout request has been submitted for review.",
      });
      setRequestDialogOpen(false);
      setPayoutAmount("");
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
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const handleRequestPayout = () => {
    const amount = parseFloat(payoutAmount) || pendingBalance;
    if (amount < 50) {
      toast({
        title: "Minimum Amount Required",
        description: "Minimum payout amount is ৳50.",
        variant: "destructive",
      });
      return;
    }
    if (amount > pendingBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You cannot request more than your available balance.",
        variant: "destructive",
      });
      return;
    }
    requestPayoutMutation.mutate({ amount, paymentMethod });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Payout Management</h2>
          <p className="text-sm text-muted-foreground">Request and track your payouts</p>
        </div>
        <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-request-payout" disabled={pendingBalance < 50}>
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
                <Label>Payout Amount</Label>
                <Input 
                  type="number"
                  placeholder={`Max: ${pendingBalance}`}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  data-testid="input-payout-amount"
                />
                <p className="text-xs text-muted-foreground">Leave empty to request full balance</p>
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger data-testid="select-payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleRequestPayout}
                disabled={requestPayoutMutation.isPending || pendingBalance < 50}
                data-testid="button-confirm-payout"
              >
                {requestPayoutMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {isLoading ? "..." : displayPayouts.filter(p => p.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
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
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p>No payout history yet</p>
                  </TableCell>
                </TableRow>
              ) : (
                displayPayouts.map((payout: any) => (
                  <TableRow key={payout.id} data-testid={`row-payout-${payout.id}`}>
                    <TableCell>
                      {payout.createdAt && format(new Date(payout.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(parseFloat(payout.amount))}</TableCell>
                    <TableCell>{payout.paymentMethod || "Bank Transfer"}</TableCell>
                    <TableCell>
                      <Badge variant={
                        payout.status === "paid" ? "default" :
                        payout.status === "pending" ? "secondary" : "destructive"
                      }>
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payout.processedAt ? format(new Date(payout.processedAt), 'MMM d, yyyy') : "-"}
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

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: string;
  minPurchase: string | null;
  maxUses: number | null;
  usedCount: number;
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

    createCouponMutation.mutate({
      code: newCouponCode.toUpperCase(),
      discountType,
      discountValue: parsedDiscountValue,
      minPurchase: minPurchase ? parseFloat(minPurchase) : null,
      maxUses: maxUses ? parseInt(maxUses, 10) : null,
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Your Coupons</CardTitle>
              <CardDescription>Manage your promotional coupon codes</CardDescription>
            </div>
            <Badge variant="secondary">{coupons?.length || 0} coupons</Badge>
          </div>
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
                    <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p>No coupons yet. Create your first coupon to start promoting!</p>
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
                          formatCurrency(parseFloat(coupon.discountValue))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.minPurchase ? formatCurrency(parseFloat(coupon.minPurchase)) : "-"}
                    </TableCell>
                    <TableCell>
                      {coupon.usedCount || 0} / {coupon.maxUses || "∞"}
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

function SettingsSection({ user }: { user: any }) {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  
  const { data: statsData } = useQuery({
    queryKey: ["/api/affiliate/stats"],
  });
  const stats = statsData as AffiliateStats | undefined;

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your affiliate account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">{user?.username?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user?.username || "Affiliate Partner"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email || "affiliate@example.com"}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={user?.username || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Affiliate Code</Label>
                  <Input value={stats?.code || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Commission Rate</Label>
                  <Input value={`${parseFloat(stats?.commission || "10")}%`} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure your payout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger data-testid="select-preferred-payment">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Bank Transfer
                      </div>
                    </SelectItem>
                    <SelectItem value="bkash">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        bKash
                      </div>
                    </SelectItem>
                    <SelectItem value="nagad">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Nagad
                      </div>
                    </SelectItem>
                    <SelectItem value="paypal">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        PayPal
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === "bank" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input placeholder="Enter bank name" data-testid="input-bank-name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input placeholder="Enter account number" data-testid="input-account-number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Holder Name</Label>
                    <Input placeholder="Enter account holder name" data-testid="input-holder-name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Routing Number</Label>
                    <Input placeholder="Enter routing number" data-testid="input-routing" />
                  </div>
                </div>
              )}

              {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                <div className="space-y-2">
                  <Label>{paymentMethod === "bkash" ? "bKash" : "Nagad"} Number</Label>
                  <Input placeholder="Enter mobile number" data-testid="input-mobile-number" />
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="space-y-2">
                  <Label>PayPal Email</Label>
                  <Input placeholder="Enter PayPal email" type="email" data-testid="input-paypal-email" />
                </div>
              )}

              <Button onClick={handleSaveSettings} data-testid="button-save-payment">
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout Preferences</CardTitle>
              <CardDescription>Configure automatic payout settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Payouts</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically request payout when balance exceeds threshold
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Minimum Payout Threshold</Label>
                <Input type="number" placeholder="100" defaultValue="100" />
                <p className="text-xs text-muted-foreground">Minimum balance required to trigger automatic payout</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about referrals and earnings
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                  data-testid="switch-email-notifications"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    New Referral Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone uses your referral link
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Payout Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about payout status changes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Weekly Performance Reports
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summary of your affiliate performance
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleSaveSettings} data-testid="button-save-notifications">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ResourcesSection() {
  const resources = [
    {
      title: "Brand Guidelines",
      description: "Logo usage, colors, and brand assets",
      icon: FileText,
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
    "Use your exclusive coupon codes to offer additional value to customers",
    "Track your analytics regularly to optimize your promotional strategies",
  ];

  const faqs = [
    { q: "How do I get paid?", a: "Request payouts from your dashboard when your balance exceeds ৳50. We support bank transfer, bKash, Nagad, and PayPal." },
    { q: "When do I earn commission?", a: "You earn commission when a customer completes a purchase using your referral link or coupon code." },
    { q: "How long is the cookie duration?", a: "Our referral cookie lasts for 30 days, meaning you'll earn commission on any purchase within 30 days of the initial click." },
    { q: "Can I promote on social media?", a: "Yes! We encourage sharing on social media, blogs, YouTube, and any other platform where you have an audience." },
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions about the affiliate program</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <h4 className="font-medium mb-1">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
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
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm">
                Have questions about the affiliate program? Our dedicated team is here to help.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Email: affiliates@horeq.com
              </p>
            </div>
            <Button variant="outline" data-testid="button-contact-support">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
