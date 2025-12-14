import { 
  Menu, 
  Search, 
  Bell, 
  Heart, 
  ShoppingCart, 
  User,
  X
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

function NotificationSystem() {
  const { toast } = useToast();

  useEffect(() => {
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
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const mainMenuItems = [
    { label: 'Shop', href: '/shop' },
    { label: 'Combo Deals', href: '/combo' },
    { label: 'Flash Deals', href: '/deals' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NotificationSystem />

      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-2">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden shrink-0" data-testid="button-mobile-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <img src="/attached_assets/horeq_1765711133478.jpg" alt="Horeq" className="h-8 w-8 rounded-full object-cover" />
                <span className="text-xl font-bold font-heading text-primary">Horeq</span>
              </div>
              <nav className="flex flex-col gap-1">
                <Link href="/auth">
                  <Button className="w-full justify-start mb-3" data-testid="button-mobile-signin">
                    <User className="mr-2 h-4 w-4" /> Sign In / Join
                  </Button>
                </Link>
                {mainMenuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={location === item.href ? "secondary" : "ghost"} 
                      className="w-full justify-start" 
                      data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-logo">
          <img 
            src="/attached_assets/horeq_1765711133478.jpg" 
            alt="Horeq Logo" 
            className="h-9 w-9 rounded-full object-cover border-2 border-primary/20" 
          />
          <span className="text-xl font-bold font-heading text-primary hidden sm:inline-block">Horeq</span>
        </Link>

        {/* Desktop Navigation - Single Line */}
        <nav className="hidden md:flex items-center gap-1 mx-4">
          {mainMenuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-sm font-medium px-3 ${
                  location === item.href ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
                }`}
                data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
          <Input 
            placeholder="Search products..." 
            className="w-full pl-4 pr-10 h-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-desktop"
          />
          <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-9 w-9 rounded-full" data-testid="button-search-desktop">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Mobile Search Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden shrink-0"
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          data-testid="button-search-mobile-toggle"
        >
          {isSearchExpanded ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </Button>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground" data-testid="button-notifications">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground" data-testid="button-wishlist">
            <Heart className="h-5 w-5" />
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground" data-testid="button-cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-user-menu">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer" data-testid="link-profile">Profile</DropdownMenuItem>
              </Link>
              <Link href="/profile?tab=orders">
                <DropdownMenuItem className="cursor-pointer" data-testid="link-orders">Orders</DropdownMenuItem>
              </Link>
              <Link href="/profile?tab=wishlist">
                <DropdownMenuItem className="cursor-pointer" data-testid="link-wishlist-menu">Wishlist</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/profile?tab=affiliate">
                <DropdownMenuItem className="cursor-pointer" data-testid="link-affiliate">Affiliate Program</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="/auth">
                <DropdownMenuItem className="text-destructive cursor-pointer" data-testid="button-logout">Log out</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {isSearchExpanded && (
        <div className="md:hidden px-4 pb-3 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="relative">
            <Input 
              placeholder="Search products..." 
              className="w-full pl-4 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              data-testid="input-search-mobile"
            />
            <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0" data-testid="button-search-mobile">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
