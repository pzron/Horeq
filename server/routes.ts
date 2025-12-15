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
  insertAffiliateClickSchema,
  insertWishlistSchema,
  insertPageSchema,
  insertSettingSchema,
  insertMenuSchema,
  insertMenuItemSchema,
  insertCouponSchema,
  insertAffiliatePayoutSchema,
} from "@shared/schema";
import { z, ZodError } from "zod";

// Partial schemas for PATCH operations
const updateProductSchema = insertProductSchema.partial();
const updateCategorySchema = insertCategorySchema.partial();
const updateUserSchema = insertUserSchema.omit({ password: true }).partial();
const updateOrderSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
  shippingAddress: z.string().optional(),
  paymentMethod: z.string().optional(),
});
const updateAffiliateSchema = insertAffiliateSchema.partial();
const updatePageSchema = insertPageSchema.partial();
const updateCartQuantitySchema = z.object({
  quantity: z.number().int().min(1),
});
const updateMenuItemSchema = insertMenuItemSchema.partial();
const updateCouponSchema = insertCouponSchema.partial();
const updatePayoutSchema = z.object({
  status: z.enum(["pending", "approved", "paid", "rejected"]).optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
  processedBy: z.string().optional(),
});

// Helper to determine error status code
function getErrorStatusCode(error: unknown): number {
  return error instanceof ZodError ? 400 : 500;
}

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
      const validatedData = updateProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
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
      const { quantity } = updateCartQuantitySchema.parse(req.body);
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
      res.status(getErrorStatusCode(error)).json({ message: error.message });
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
      const { affiliateCode, clickId, ...orderFields } = req.body;
      
      // Get cart items for this user - derive from server-side data, not client
      const cartItems = await storage.getCartItems(userId);
      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Calculate total from cart items using integer cents for precision
      let totalCents = 0;
      for (const item of cartItems) {
        const product = await storage.getProductById(item.productId);
        if (product) {
          const priceCents = Math.round(parseFloat(product.price.toString()) * 100);
          totalCents += priceCents * item.quantity;
        }
      }
      const total = (totalCents / 100).toFixed(2);
      
      // Verify affiliate by code (not arbitrary ID from client) if provided
      let validAffiliateId = null;
      let affiliate = null;
      if (affiliateCode && typeof affiliateCode === 'string') {
        affiliate = await storage.getAffiliateByCode(affiliateCode);
        if (affiliate) {
          validAffiliateId = affiliate.id;
        }
      }
      
      const orderData = insertOrderSchema.parse({ 
        ...orderFields, 
        userId,
        total,
        affiliateId: validAffiliateId,
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
      
      // Handle affiliate commission if affiliate is attached
      if (affiliate && validAffiliateId) {
        // Calculate commission using integer cents for precision
        const commissionRate = parseFloat(affiliate.commission.toString()) / 100;
        const commissionCents = Math.round(totalCents * commissionRate);
        const commission = (commissionCents / 100).toFixed(2);
        
        // Update affiliate stats (increment conversions and earnings)
        await storage.incrementAffiliateConversions(validAffiliateId, commission);
        
        // Mark click as converted if clickId provided and valid
        if (clickId && typeof clickId === 'string') {
          // Validate click belongs to this affiliate and isn't already converted
          const clicks = await storage.getAffiliateClicks(validAffiliateId);
          const click = clicks.find(c => c.id === clickId && !c.converted);
          if (click) {
            await storage.markClickConverted(clickId, order.id);
          }
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

  app.patch("/api/affiliates/:id", isAdmin, async (req, res) => {
    try {
      const validatedData = updateAffiliateSchema.parse(req.body);
      const affiliate = await storage.updateAffiliate(req.params.id, validatedData);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      res.json(affiliate);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  // Affiliate Click Tracking - record when user visits with affiliate code
  app.post("/api/affiliates/track-click", async (req, res) => {
    try {
      const { code, ipAddress } = req.body;
      
      const affiliate = await storage.getAffiliateByCode(code);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate code not found" });
      }
      
      // Create click record
      const clickData = insertAffiliateClickSchema.parse({
        affiliateId: affiliate.id,
        ipAddress: ipAddress || req.ip || null,
        converted: false,
      });
      
      const click = await storage.createAffiliateClick(clickData);
      
      // Increment affiliate click count
      await storage.incrementAffiliateClicks(affiliate.id);
      
      res.status(201).json({ 
        clickId: click.id,
        affiliateId: affiliate.id,
        message: "Click tracked successfully" 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get affiliate clicks (for affiliate dashboard)
  app.get("/api/affiliates/:id/clicks", isAffiliate, async (req, res) => {
    try {
      const affiliate = await storage.getAffiliateById(req.params.id);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      
      // Check if user owns this affiliate account or is admin
      const userId = (req.user as any).id;
      const userRole = (req.user as any).role;
      if (affiliate.userId !== userId && userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const clicks = await storage.getAffiliateClicks(req.params.id);
      res.json(clicks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get affiliate stats (for affiliate dashboard)
  app.get("/api/affiliates/:id/stats", isAffiliate, async (req, res) => {
    try {
      const affiliate = await storage.getAffiliateById(req.params.id);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      
      // Check if user owns this affiliate account or is admin
      const userId = (req.user as any).id;
      const userRole = (req.user as any).role;
      if (affiliate.userId !== userId && userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const clicks = await storage.getAffiliateClicks(req.params.id);
      const payouts = await storage.getAffiliatePayouts(req.params.id);
      
      const conversionRate = affiliate.totalClicks > 0 
        ? (affiliate.totalConversions / affiliate.totalClicks * 100).toFixed(2)
        : "0.00";
      
      const pendingPayouts = payouts
        .filter(p => p.status === "pending")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      res.json({
        totalClicks: affiliate.totalClicks,
        totalConversions: affiliate.totalConversions,
        totalEarnings: affiliate.totalEarnings,
        commission: affiliate.commission,
        conversionRate,
        pendingPayouts: pendingPayouts.toFixed(2),
        recentClicks: clicks.slice(0, 10),
      });
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
      const validatedData = updateUserSchema.parse(req.body);
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
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

  // Admin - Affiliates Management
  app.get("/api/admin/affiliates", isAdmin, async (_req, res) => {
    try {
      const affiliates = await storage.getAllAffiliates();
      res.json(affiliates);
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
      const validatedData = updateOrderSchema.parse(req.body);
      const order = await storage.updateOrder(req.params.id, validatedData);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  // Admin - Categories Management
  app.patch("/api/admin/categories/:id", isAdmin, async (req, res) => {
    try {
      const validatedData = updateCategorySchema.parse(req.body);
      const category = await storage.updateCategory(req.params.id, validatedData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
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
      const validatedData = updatePageSchema.parse(req.body);
      const page = await storage.updatePage(req.params.id, validatedData);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
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
      const validatedData = updateMenuItemSchema.parse(req.body);
      const item = await storage.updateMenuItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
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
      const validatedData = updateCouponSchema.parse(req.body);
      const coupon = await storage.updateCoupon(req.params.id, validatedData);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json(coupon);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
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
      const validatedData = updatePayoutSchema.parse(req.body);
      const payout = await storage.updatePayout(req.params.id, validatedData);
      if (!payout) {
        return res.status(404).json({ message: "Payout not found" });
      }
      res.json(payout);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  // ============ AFFILIATE ROUTES ============
  
  // Affiliate Registration
  app.post("/api/affiliate/register", async (req, res) => {
    try {
      const { username, email, password, code } = req.body;
      
      // Check if username exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Generate affiliate code if not provided
      let affiliateCode = code;
      if (!affiliateCode) {
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        affiliateCode = `AFF${randomPart}`;
      }

      // Check if affiliate code already exists
      const existingAffiliate = await storage.getAffiliateByCode(affiliateCode);
      if (existingAffiliate) {
        return res.status(400).json({ message: "Affiliate code already taken. Please choose another." });
      }

      // Hash password and create user with affiliate role
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = insertUserSchema.parse({
        username,
        email,
        password: hashedPassword,
        role: "affiliate",
      });

      const user = await storage.createUser(userData);

      // Create affiliate profile
      const affiliateData = insertAffiliateSchema.parse({
        userId: user.id,
        code: affiliateCode,
        commission: "10.00",
        totalEarnings: "0",
        totalClicks: 0,
        totalConversions: 0,
      });

      const affiliate = await storage.createAffiliate(affiliateData);

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({
          ...userWithoutPassword,
          affiliateCode: affiliate.code,
          affiliateId: affiliate.id,
        });
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get affiliate profile for current user
  app.get("/api/affiliate/profile", isAffiliate, async (req, res) => {
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

  // Get detailed affiliate stats
  app.get("/api/affiliate/stats", isAffiliate, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const affiliate = await storage.getAffiliateByUserId(userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }
      
      // Get clicks and payouts for detailed stats
      const clicks = await storage.getAffiliateClicks(affiliate.id);
      const payouts = await storage.getAffiliatePayouts(affiliate.id);
      
      // Calculate pending payout (earnings minus paid payouts)
      const paidPayouts = payouts
        .filter(p => p.status === "paid")
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const pendingPayout = parseFloat(affiliate.totalEarnings) - paidPayouts;
      
      // Calculate conversion rate
      const conversionRate = affiliate.totalClicks > 0 
        ? (affiliate.totalConversions / affiliate.totalClicks) * 100 
        : 0;
      
      // Monthly progress (goal: $500/month)
      const monthlyGoal = 500;
      const monthlyProgress = Math.min((parseFloat(affiliate.totalEarnings) / monthlyGoal) * 100, 100);
      
      // Average order value (if we have conversions)
      const avgOrderValue = affiliate.totalConversions > 0 
        ? parseFloat(affiliate.totalEarnings) / (affiliate.totalConversions * 0.1) 
        : 0;
      
      res.json({
        totalClicks: affiliate.totalClicks,
        totalConversions: affiliate.totalConversions,
        totalEarnings: parseFloat(affiliate.totalEarnings),
        pendingPayout: Math.max(0, pendingPayout),
        conversionRate,
        monthlyProgress,
        avgOrderValue,
        totalReferrals: affiliate.totalConversions,
        commission: affiliate.commission,
        code: affiliate.code,
      });
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

  // Get affiliate earnings (orders with this affiliate)
  app.get("/api/affiliate/earnings", isAffiliate, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const affiliate = await storage.getAffiliateByUserId(userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }
      
      // Get all orders with this affiliate
      const allOrders = await storage.getAllOrders();
      const affiliateOrders = allOrders.filter(o => o.affiliateId === affiliate.id);
      
      // Map to earnings format
      const earnings = affiliateOrders.map(order => ({
        id: order.id,
        date: order.createdAt,
        orderId: order.id.substring(0, 8).toUpperCase(),
        orderAmount: parseFloat(order.total),
        commission: parseFloat(order.total) * (parseFloat(affiliate.commission) / 100),
        status: order.status === "delivered" ? "paid" : "pending",
      }));
      
      res.json(earnings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get affiliate clicks
  app.get("/api/affiliate/clicks", isAffiliate, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const affiliate = await storage.getAffiliateByUserId(userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }
      const clicks = await storage.getAffiliateClicks(affiliate.id);
      res.json(clicks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get affiliate coupons
  app.get("/api/affiliate/coupons", isAffiliate, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const affiliate = await storage.getAffiliateByUserId(userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }
      const allCoupons = await storage.getAllCoupons();
      const affiliateCoupons = allCoupons.filter(c => c.affiliateId === affiliate.id);
      res.json(affiliateCoupons);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create affiliate coupon
  app.post("/api/affiliate/coupons", isAffiliate, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const affiliate = await storage.getAffiliateByUserId(userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }
      
      // Check if code already exists
      const existingCoupon = await storage.getCouponByCode(req.body.code);
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
      
      const couponData = insertCouponSchema.parse({
        ...req.body,
        affiliateId: affiliate.id,
        createdBy: userId,
      });
      
      const coupon = await storage.createCoupon(couponData);
      res.status(201).json(coupon);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get recent referrals for dashboard
  app.get("/api/affiliate/referrals", isAffiliate, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const affiliate = await storage.getAffiliateByUserId(userId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate profile not found" });
      }
      
      const allOrders = await storage.getAllOrders();
      const affiliateOrders = allOrders
        .filter(o => o.affiliateId === affiliate.id)
        .slice(0, 10)
        .map(order => ({
          id: order.id,
          customer: `Customer #${order.userId.substring(0, 4)}`,
          amount: parseFloat(order.total),
          status: order.status === "delivered" ? "completed" : "pending",
          date: order.createdAt,
          commission: parseFloat(order.total) * (parseFloat(affiliate.commission) / 100),
        }));
      
      res.json(affiliateOrders);
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
