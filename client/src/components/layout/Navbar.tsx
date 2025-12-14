import { 
  Plus, 
  Menu, 
  Search, 
  Bell, 
  Heart, 
  ShoppingCart, 
  User,
  Grid3x3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/lib/mockData";

// Mock Notification System
function NotificationSystem() {
  const { toast } = useToast();

  useEffect(() => {
    // Random notification every 30-60 seconds
    const interval = setInterval(() => {
      const messages = [
        "Someone just bought a Smart Watch!",
        "New items added to Flash Sale!",
        "Someone in Dhaka just placed an order",
        "Limited stock on Trending items!"
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      toast({
        title: "Live Update",
        description: randomMsg,
        className: "bg-background border-l-4 border-l-accent shadow-lg",
        duration: 3000,
      });
    }, 45000);

    return () => clearInterval(interval);
  }, [toast]);

  return null;
}

export function Navbar() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const mainMenuItems = [
    { label: 'Shop', href: '/shop' },
    { label: 'Combo Deals', href: '/combo' },
    { label: 'Flash Deals', href: '/deals' },
    { label: 'New Arrivals', href: '/new' },
    { label: 'Best Sellers', href: '/bestsellers' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NotificationSystem />
      {/* Top Bar - Promotion */}
      <div className="bg-primary text-primary-foreground px-4 py-2 text-xs font-medium text-center hidden sm:block">
        Free Shipping on Orders Over $50 | Join Horeq Plus for Exclusive Deals
      </div>

      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 py-6">
              <div className="flex items-center gap-2">
                <img src="/attached_assets/horeq_1765711133478.jpg" alt="Horeq" className="h-8 w-8 rounded-full object-cover" />
                <span className="text-xl font-bold font-heading text-primary">Horeq</span>
              </div>
              <nav className="flex flex-col gap-2">
                <Link href="/auth">
                  <Button className="w-full justify-start mb-4" data-testid="button-mobile-signin">
                    <User className="mr-2 h-4 w-4" /> Sign In / Join
                  </Button>
                </Link>
                {mainMenuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost" className="w-full justify-start" data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <div className="border-t pt-4 mt-2">
                  <p className="text-xs text-muted-foreground mb-2 px-2">Categories</p>
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.slice(0, 12).map((cat) => (
                      <Link key={cat.id} href={`/category/${cat.slug}`} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md transition-colors text-sm" data-testid={`link-mobile-category-${cat.slug}`}>
                          <cat.icon className="h-4 w-4 text-muted-foreground" />
                          {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-4 md:mr-8 transition-opacity hover:opacity-90" data-testid="link-logo">
            <img 
              src="/attached_assets/horeq_1765711133478.jpg" 
              alt="Horeq Logo" 
              className="h-10 w-10 rounded-full object-cover border-2 border-primary/20 shadow-sm" 
            />
            <span className="text-2xl font-bold font-heading text-primary hidden sm:inline-block">Horeq</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <Input 
            placeholder="Search for products, brands and categories..." 
            className="w-full pl-4 pr-12 h-11 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all rounded-full"
            data-testid="input-search-desktop"
          />
          <Button size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-full bg-primary hover:bg-primary/90" data-testid="button-search-desktop">
            <Search className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Search Toggle - Mobile */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          data-testid="button-search-mobile"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-primary" data-testid="button-notifications">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-primary" data-testid="button-wishlist">
            <Heart className="h-5 w-5" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary" data-testid="button-cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1" data-testid="button-user-menu">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer" data-testid="link-profile">Profile</DropdownMenuItem>
              </Link>
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer" data-testid="link-orders">Orders</DropdownMenuItem>
              </Link>
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer" data-testid="link-wishlist-menu">Wishlist</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/affiliate">
                <DropdownMenuItem className="cursor-pointer" data-testid="link-affiliate">Affiliate Dashboard</DropdownMenuItem>
              </Link>
              <Link href="/admin">
                <DropdownMenuItem className="cursor-pointer" data-testid="link-admin">Admin Panel</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/auth">
                <DropdownMenuItem className="text-destructive cursor-pointer" data-testid="button-logout">Log out</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden p-4 border-t bg-background animate-in slide-in-from-top-2">
          <div className="relative">
            <Input 
              placeholder="Search products..." 
              className="w-full pl-4 pr-10"
              autoFocus
              data-testid="input-search-mobile"
            />
            <Button size="icon" variant="ghost" className="absolute right-0 top-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Menu Bar - Desktop */}
      <div className="hidden md:block border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {/* All Categories Dropdown - Now first item */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="font-medium gap-2 px-3 hover:bg-transparent hover:text-primary whitespace-nowrap" data-testid="button-all-categories">
                  <Grid3x3 className="h-4 w-4" />
                  All Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[600px] p-4" align="start">
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.slug}`}>
                      <DropdownMenuItem className="gap-2 cursor-pointer" data-testid={`link-category-${cat.slug}`}>
                        <div className={`h-8 w-8 rounded-lg ${cat.color} bg-opacity-10 flex items-center justify-center`}>
                          <cat.icon className="h-4 w-4" style={{ color: cat.color.replace('bg-', '').replace('-', ' ') }} />
                        </div>
                        <span className="text-sm">{cat.name}</span>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="h-4 w-[1px] bg-border"></div>

            {/* Main Menu Items */}
            {mainMenuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-sm font-medium transition-colors whitespace-nowrap px-3 ${
                    location === item.href ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-primary'
                  }`}
                  data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
