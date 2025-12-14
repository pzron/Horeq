import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/Category";
import ProductPage from "@/pages/Product";
import Dashboard from "@/pages/Dashboard";
import ComboPage from "@/pages/Combo";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/combo" component={ComboPage} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/auth" component={Auth} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/affiliate" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
