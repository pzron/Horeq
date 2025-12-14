import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "./auth";
import bcrypt from "bcrypt";
import { 
  insertUserSchema,
  insertCategorySchema,
  insertProductSchema,
  insertReviewSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertCartItemSchema,
  insertAffiliateSchema,
  insertWishlistSchema,
  insertPageSchema,
  insertSettingSchema,
  insertMenuSchema,
  insertMenuItemSchema,
  insertCouponSchema,
  insertAffiliatePayoutSchema,
} from "@shared/schema";

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}

// Middleware to check if user has admin role
function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as any)?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
}

// Middleware to check if user has affiliate role
function isAffiliate(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && ((req.user as any)?.role === "affiliate" || (req.user as any)?.role === "admin")) {
    return next();
  }
  return res.status(403).json({ message: "Affiliate access required" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Authentication
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const userData = insertUserSchema.parse({
        username,
        email,
        password: hashedPassword,
        role: role || "customer",
      });

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        res.status(201).json(userWithoutPassword);
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "An error occurred during login" });
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  // Products
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/featured", async (_req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/category/:categoryId", async (req, res) => {
    try {
      const products = await storage.getProductsByCategory(req.params.categoryId);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products", isAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Categories
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/categories", isAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Reviews
  app.get("/api/reviews/product/:productId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByProduct(req.params.productId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Cart - Session-bound routes
  app.get("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const items = await storage.getCartItems(userId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const cartData = insertCartItemSchema.parse({ ...req.body, userId });
      const item = await storage.addToCart(cartData);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { quantity } = req.body;
      const cartItem = await storage.getCartItemById(req.params.id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      if (cartItem.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const item = await storage.updateCartItem(req.params.id, quantity);
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const cartItem = await storage.getCartItemById(req.params.id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      if (cartItem.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.removeFromCart(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/cart/clear", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      await storage.clearCart(userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Orders - Session-bound routes
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (order.userId !== userId && (req.user as any).role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id/items", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (order.userId !== userId && (req.user as any).role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      const items = await storage.getOrderItems(req.params.id);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      // Get cart items for this user - derive from server-side data, not client
      const cartItems = await storage.getCartItems(userId);
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Calculate total from cart items
      let total = 0;
      for (const item of cartItems) {
        const product = await storage.getProductById(item.productId);
        if (product) {
          total += product.price * item.quantity;
        }
      }
      
      const orderData = insertOrderSchema.parse({ 
        ...req.body, 
        userId,
        total: total.toString(),
      });
      const order = await storage.createOrder(orderData);
      
      // Create order items from user's actual cart (server-side validated)
      for (const cartItem of cartItems) {
        const product = await storage.getProductById(cartItem.productId);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: product.price.toString(),
          });
        }
      }
      
      // Clear the cart after order
      await storage.clearCart(userId);
      
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Wishlist
  app.get("/api/wishlist/:userId", async (req, res) => {
    try {
      const items = await storage.getWishlist(req.params.userId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const wishlistData = insertWishlistSchema.parse(req.body);
      const item = await storage.addToWishlist(wishlistData);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/wishlist/:id", async (req, res) => {
    try {
      await storage.removeFromWishlist(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Affiliates
  app.get("/api/affiliates/user/:userId", async (req, res) => {
    try {
      const affiliate = await storage.getAffiliateByUserId(req.params.userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      res.json(affiliate);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/affiliates/code/:code", async (req, res) => {
    try {
      const affiliate = await storage.getAffiliateByCode(req.params.code);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      res.json(affiliate);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/affiliates", async (req, res) => {
    try {
      const affiliateData = insertAffiliateSchema.parse(req.body);
      const affiliate = await storage.createAffiliate(affiliateData);
      res.status(201).json(affiliate);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/affiliates/:id", async (req, res) => {
    try {
      const affiliate = await storage.updateAffiliate(req.params.id, req.body);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      res.json(affiliate);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Users
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ============ ADMIN ROUTES ============
  
  // Dashboard Stats
  app.get("/api/admin/stats", isAdmin, async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin - Users Management
  app.get("/api/admin/users", isAdmin, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin - Orders Management
  app.get("/api/admin/orders", isAdmin, async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/orders/:id", isAdmin, async (req, res) => {
    try {
      const order = await storage.updateOrder(req.params.id, req.body);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin - Categories Management
  app.patch("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const category = await storage.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CMS - Pages
  app.get("/api/admin/pages", isAdmin, async (_req, res) => {
    try {
      const pages = await storage.getAllPages();
      res.json(pages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/pages/:id", isAdmin, async (req, res) => {
    try {
      const page = await storage.getPageById(req.params.id);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/pages", isAdmin, async (req, res) => {
    try {
      const pageData = insertPageSchema.parse(req.body);
      const page = await storage.createPage(pageData);
      res.status(201).json(page);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/admin/pages/:id", isAdmin, async (req, res) => {
    try {
      const page = await storage.updatePage(req.params.id, req.body);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/pages/:id", isAdmin, async (req, res) => {
    try {
      await storage.deletePage(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CMS - Settings
  app.get("/api/admin/settings", isAdmin, async (_req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/settings/group/:group", isAdmin, async (req, res) => {
    try {
      const settings = await storage.getSettingsByGroup(req.params.group);
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/settings", isAdmin, async (req, res) => {
    try {
      const settingData = insertSettingSchema.parse(req.body);
      const setting = await storage.upsertSetting(settingData);
      res.json(setting);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // CMS - Menus
  app.get("/api/admin/menus", isAdmin, async (_req, res) => {
    try {
      const menus = await storage.getAllMenus();
      res.json(menus);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/menus", isAdmin, async (req, res) => {
    try {
      const menuData = insertMenuSchema.parse(req.body);
      const menu = await storage.createMenu(menuData);
      res.status(201).json(menu);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/menus/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteMenu(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/menus/:id/items", isAdmin, async (req, res) => {
    try {
      const items = await storage.getMenuItems(req.params.id);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/menu-items", isAdmin, async (req, res) => {
    try {
      const itemData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(itemData);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/admin/menu-items/:id", isAdmin, async (req, res) => {
    try {
      const item = await storage.updateMenuItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/menu-items/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteMenuItem(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Coupons
  app.get("/api/admin/coupons", isAdmin, async (_req, res) => {
    try {
      const coupons = await storage.getAllCoupons();
      res.json(coupons);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/coupons", isAdmin, async (req, res) => {
    try {
      const couponData = insertCouponSchema.parse(req.body);
      const coupon = await storage.createCoupon(couponData);
      res.status(201).json(coupon);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/admin/coupons/:id", isAdmin, async (req, res) => {
    try {
      const coupon = await storage.updateCoupon(req.params.id, req.body);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/coupons/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteCoupon(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Activity Logs
  app.get("/api/admin/activity-logs", isAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getActivityLogs(limit);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Affiliate Payouts (Admin)
  app.get("/api/admin/payouts", isAdmin, async (_req, res) => {
    try {
      const payouts = await storage.getAllPayouts();
      res.json(payouts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/payouts/:id", isAdmin, async (req, res) => {
    try {
      const payout = await storage.updatePayout(req.params.id, req.body);
      if (!payout) {
        return res.status(404).json({ message: "Payout not found" });
      }
      res.json(payout);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============ AFFILIATE ROUTES ============
  
  app.get("/api/affiliate/stats", isAffiliate, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const affiliate = await storage.getAffiliateByUserId(userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }
      res.json(affiliate);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/affiliate/payouts", isAffiliate, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const affiliate = await storage.getAffiliateByUserId(userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }
      const payouts = await storage.getAffiliatePayouts(affiliate.id);
      res.json(payouts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/affiliate/request-payout", isAffiliate, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const affiliate = await storage.getAffiliateByUserId(userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }
      const payoutData = insertAffiliatePayoutSchema.parse({
        ...req.body,
        affiliateId: affiliate.id,
      });
      const payout = await storage.createPayout(payoutData);
      res.status(201).json(payout);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Notifications
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Public coupon validation
  app.get("/api/coupons/validate/:code", async (req, res) => {
    try {
      const coupon = await storage.getCouponByCode(req.params.code);
      if (!coupon || !coupon.isActive) {
        return res.status(404).json({ message: "Invalid coupon code" });
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return res.status(400).json({ message: "Coupon has expired" });
      }
      if (coupon.maxUses && coupon.usedCount && coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ message: "Coupon usage limit reached" });
      }
      res.json(coupon);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
