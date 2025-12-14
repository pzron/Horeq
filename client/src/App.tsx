import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import CategoryPage from "@/pages/Category";
import ProductPage from "@/pages/Product";
import Dashboard from "@/pages/Dashboard";
import ComboPage from "@/pages/Combo";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import AffiliateAuth from "@/pages/AffiliateAuth";
import AdminAuth from "@/pages/AdminAuth";
import AdminDashboard from "@/pages/AdminDashboard";
import AffiliateDashboard from "@/pages/AffiliateDashboard";
import Profile from "@/pages/Profile";
import Deals from "@/pages/Deals";
import Search from "@/pages/Search";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/combo" component={ComboPage} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/auth" component={Auth} />
      <Route path="/sweet/affiliate" component={AffiliateAuth} />
      <Route path="/cup/doo/admin" component={AdminAuth} />
      <Route path="/profile" component={Profile} />
      <Route path="/deals" component={Deals} />
      <Route path="/search" component={Search} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/affiliate" component={AffiliateDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
