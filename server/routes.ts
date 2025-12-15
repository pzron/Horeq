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
  insertComboSchema,
  insertBannerSchema,
  insertRoleSchema,
  insertAffiliateTierSchema,
  insertAffiliateLinkSchema,
  insertCommissionLedgerSchema,
  insertFeatureFlagSchema,
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
const updateComboSchema = insertComboSchema.partial();
const updateBannerSchema = insertBannerSchema.partial();
const updatePayoutSchema = z.object({
  status: z.enum(["pending", "approved", "paid", "rejected"]).optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
  processedBy: z.string().optional(),
});
const updateRoleSchema = insertRoleSchema.partial();
const updateAffiliateTierSchema = insertAffiliateTierSchema.partial();
const updateAffiliateLinkSchema = insertAffiliateLinkSchema.partial();
const updateFeatureFlagSchema = insertFeatureFlagSchema.partial();

// Schema for admin user creation
const createAdminUserSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
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

// Middleware to check if affiliate is approved (for operations that require approval)
async function isApprovedAffiliate(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const userRole = (req.user as any)?.role;
  if (userRole === "admin") {
    return next();
  }
  if (userRole === "affiliate") {
    const affiliate = await storage.getAffiliateByUserId((req.user as any).id);
    if (affiliate && affiliate.status === "approved") {
      return next();
    }
    return res.status(403).json({ message: "Your affiliate account is pending approval" });
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
      const { username, email, password } = req.body;
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Force role to customer - prevent privilege escalation
      const userData = insertUserSchema.parse({
        username,
        email,
        password: hashedPassword,
        role: "customer",
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
      
      // Cache product lookups to avoid N+1 queries
      const productCache = new Map();
      for (const cartItem of cartItems) {
        if (!productCache.has(cartItem.productId)) {
          const product = await storage.getProductById(cartItem.productId);
          if (product) productCache.set(cartItem.productId, product);
        }
      }
      
      // Create order items from user's actual cart (server-side validated)
      for (const cartItem of cartItems) {
        const product = productCache.get(cartItem.productId);
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
        // Calculate commission per product using product-level settings
        let totalCommissionCents = 0;
        let totalBonusPoints = 0;
        
        for (const cartItem of cartItems) {
          const product = productCache.get(cartItem.productId);
          if (product && product.affiliateEnabled) {
            const productPriceCents = Math.round(parseFloat(product.price.toString()) * 100);
            const lineTotal = productPriceCents * cartItem.quantity;
            
            // Calculate commission based on product's commission type
            const commissionType = product.affiliateCommissionType || 'percentage';
            const rawValue = parseFloat(product.affiliateCommissionValue?.toString() || '0');
            const commissionValue = isNaN(rawValue) || rawValue < 0 ? 0 : rawValue;
            
            if (commissionType === 'percentage' && commissionValue > 0) {
              // Percentage-based commission (capped at 100%)
              const rate = Math.min(commissionValue, 100) / 100;
              totalCommissionCents += Math.round(lineTotal * rate);
            } else if (commissionType === 'fixed' && commissionValue > 0) {
              // Fixed dollar amount per unit sold (value is in dollars)
              totalCommissionCents += Math.round(commissionValue * 100 * cartItem.quantity);
            } else if (commissionType === 'points') {
              // Points-only: use product's affiliatePoints value for points credit
              // No monetary commission for points type
            }
            
            // Add bonus points if product has them (accumulated regardless of commission type)
            if (product.affiliatePoints && product.affiliatePoints > 0) {
              totalBonusPoints += product.affiliatePoints * cartItem.quantity;
            }
          }
        }
        
        // Fallback to affiliate's base commission if no product-level settings gave commission
        if (totalCommissionCents === 0 && totalCents > 0) {
          const commissionRate = parseFloat(affiliate.commission.toString()) / 100;
          totalCommissionCents = Math.round(totalCents * commissionRate);
        }
        
        const commission = (totalCommissionCents / 100).toFixed(2);
        
        // Update affiliate stats (increment conversions and earnings)
        // Note: Points are tracked in totalBonusPoints for future points system implementation
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
  app.get("/api/affiliates/:id/clicks", isApprovedAffiliate, async (req, res) => {
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
  app.get("/api/affiliates/:id/stats", isApprovedAffiliate, async (req, res) => {
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

  app.post("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const { username, email, password, role, name } = req.body;
      
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
        name: name || username,
      });

      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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
      // Check if it's a system page - prevent deletion
      const page = await storage.getPageById(req.params.id);
      if (page?.isSystemPage) {
        return res.status(403).json({ message: "System pages cannot be deleted. You can edit their content instead." });
      }
      await storage.deletePage(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Seed system pages endpoint
  app.post("/api/admin/pages/seed-system", isAdmin, async (req, res) => {
    try {
      const systemPages = [
        // Ecommerce pages
        { title: "Homepage", slug: "home", pageType: "ecommerce", template: "homepage", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Shop", slug: "shop", pageType: "ecommerce", template: "shop", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Product Detail", slug: "product", pageType: "ecommerce", template: "product-detail", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Cart", slug: "cart", pageType: "ecommerce", template: "cart", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Checkout", slug: "checkout", pageType: "ecommerce", template: "checkout", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Order Confirmation", slug: "order-confirmation", pageType: "ecommerce", template: "order-confirmation", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Combo Deals", slug: "combo-deals", pageType: "ecommerce", template: "combo-deals", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Flash Deals", slug: "flash-deals", pageType: "ecommerce", template: "flash-deals", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        // User pages
        { title: "User Profile", slug: "profile", pageType: "user", template: "profile", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["customer", "affiliate", "admin"] },
        { title: "My Orders", slug: "my-orders", pageType: "user", template: "orders", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["customer", "affiliate", "admin"] },
        { title: "My Addresses", slug: "my-addresses", pageType: "user", template: "addresses", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["customer", "affiliate", "admin"] },
        { title: "Wishlist", slug: "wishlist", pageType: "user", template: "wishlist", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["customer", "affiliate", "admin"] },
        { title: "Account Settings", slug: "account-settings", pageType: "user", template: "settings", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["customer", "affiliate", "admin"] },
        // Affiliate pages
        { title: "Affiliate Dashboard", slug: "affiliate-dashboard", pageType: "affiliate", template: "affiliate-dashboard", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["affiliate", "admin"] },
        { title: "Affiliate Links", slug: "affiliate-links", pageType: "affiliate", template: "affiliate-links", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["affiliate", "admin"] },
        { title: "Affiliate Commissions", slug: "affiliate-commissions", pageType: "affiliate", template: "affiliate-commissions", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["affiliate", "admin"] },
        { title: "Affiliate Payouts", slug: "affiliate-payouts", pageType: "affiliate", template: "affiliate-payouts", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["affiliate", "admin"] },
        { title: "Marketing Materials", slug: "affiliate-materials", pageType: "affiliate", template: "affiliate-materials", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: ["affiliate", "admin"] },
        // Public pages
        { title: "About Us", slug: "about", pageType: "public", template: "about", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Contact", slug: "contact", pageType: "public", template: "contact", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Privacy Policy", slug: "privacy-policy", pageType: "public", template: "legal", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "Terms of Service", slug: "terms-of-service", pageType: "public", template: "legal", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
        { title: "FAQ", slug: "faq", pageType: "public", template: "faq", isSystemPage: true, status: "published", createdBy: "system", allowedRoles: [] },
      ];

      const created: any[] = [];
      const skipped: string[] = [];

      for (const pageData of systemPages) {
        // Check if page already exists
        const existing = await storage.getPageBySlug(pageData.slug);
        if (existing) {
          skipped.push(pageData.slug);
          continue;
        }
        const page = await storage.createPage(pageData);
        created.push(page);
      }

      res.json({ 
        message: `Seeded ${created.length} system pages. Skipped ${skipped.length} existing pages.`,
        created: created.length,
        skipped: skipped.length,
        skippedSlugs: skipped
      });
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

  // Admin Affiliate Management
  app.get("/api/admin/affiliates", isAdmin, async (_req, res) => {
    try {
      const affiliates = await storage.getAllAffiliates();
      // Get user info for each affiliate
      const affiliatesWithUsers = await Promise.all(
        affiliates.map(async (affiliate) => {
          const user = await storage.getUser(affiliate.userId);
          return {
            ...affiliate,
            username: user?.username,
            email: user?.email,
          };
        })
      );
      res.json(affiliatesWithUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/affiliates/:id/approve", isAdmin, async (req, res) => {
    try {
      const adminId = (req.user as any).id;
      const affiliate = await storage.getAffiliateById(req.params.id);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      const updated = await storage.updateAffiliate(req.params.id, {
        status: "approved",
        approvedBy: adminId,
        approvedAt: new Date(),
      });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/affiliates/:id/reject", isAdmin, async (req, res) => {
    try {
      const adminId = (req.user as any).id;
      const affiliate = await storage.getAffiliateById(req.params.id);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      const updated = await storage.updateAffiliate(req.params.id, {
        status: "rejected",
        approvedBy: adminId,
        approvedAt: new Date(),
      });
      res.json(updated);
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

      // Create affiliate profile with pending status
      const affiliateData = insertAffiliateSchema.parse({
        userId: user.id,
        code: affiliateCode,
        commission: "10.00",
        totalEarnings: "0",
        totalClicks: 0,
        totalConversions: 0,
        status: "pending",
        applicationNote: req.body.applicationNote || null,
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
          affiliateStatus: affiliate.status,
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

  // Combos - Public routes
  app.get("/api/combos", async (_req, res) => {
    try {
      const combos = await storage.getAllCombos();
      res.json(combos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/combos/:id", async (req, res) => {
    try {
      const combo = await storage.getComboById(req.params.id);
      if (!combo) {
        return res.status(404).json({ message: "Combo not found" });
      }
      res.json(combo);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Combos - Admin routes
  app.post("/api/admin/combos", isAdmin, async (req, res) => {
    try {
      const comboData = insertComboSchema.parse(req.body);
      const combo = await storage.createCombo(comboData);
      res.status(201).json(combo);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.patch("/api/admin/combos/:id", isAdmin, async (req, res) => {
    try {
      const validatedData = updateComboSchema.parse(req.body);
      const combo = await storage.updateCombo(req.params.id, validatedData);
      if (!combo) {
        return res.status(404).json({ message: "Combo not found" });
      }
      res.json(combo);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.delete("/api/admin/combos/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteCombo(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Banners - Public routes
  app.get("/api/banners", async (_req, res) => {
    try {
      const banners = await storage.getAllBanners();
      res.json(banners);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/banners/:id", async (req, res) => {
    try {
      const banner = await storage.getBannerById(req.params.id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json(banner);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Banners - Admin routes
  app.post("/api/admin/banners", isAdmin, async (req, res) => {
    try {
      const bannerData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(bannerData);
      res.status(201).json(banner);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.patch("/api/admin/banners/:id", isAdmin, async (req, res) => {
    try {
      const validatedData = updateBannerSchema.parse(req.body);
      const banner = await storage.updateBanner(req.params.id, validatedData);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json(banner);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.delete("/api/admin/banners/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteBanner(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // =====================================================
  // ADMIN USER MANAGEMENT ROUTES
  // =====================================================

  // Admin create user with role assignment
  app.post("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const userData = createAdminUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const adminId = (req.user as any).id;
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        createdBy: adminId,
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  // Update user status
  app.patch("/api/admin/users/:id/status", isAdmin, async (req, res) => {
    try {
      const { status } = z.object({ status: z.enum(["active", "inactive", "suspended"]) }).parse(req.body);
      const user = await storage.updateUser(req.params.id, { status });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  // Search users
  app.get("/api/admin/users/search", isAdmin, async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const users = await storage.searchUsers(query);
      const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get users count
  app.get("/api/admin/users/count", isAdmin, async (req, res) => {
    try {
      const count = await storage.getUsersCount();
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // =====================================================
  // ROLES MANAGEMENT ROUTES
  // =====================================================

  app.get("/api/admin/roles", isAdmin, async (_req, res) => {
    try {
      const roles = await storage.getAllRoles();
      res.json(roles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/roles", isAdmin, async (req, res) => {
    try {
      const roleData = insertRoleSchema.parse(req.body);
      const role = await storage.createRole(roleData);
      res.status(201).json(role);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.patch("/api/admin/roles/:id", isAdmin, async (req, res) => {
    try {
      const validatedData = updateRoleSchema.parse(req.body);
      const role = await storage.updateRole(req.params.id, validatedData);
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.json(role);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.delete("/api/admin/roles/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteRole(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // =====================================================
  // AFFILIATE TIERS ROUTES
  // =====================================================

  app.get("/api/admin/affiliate-tiers", isAdmin, async (_req, res) => {
    try {
      const tiers = await storage.getAllAffiliateTiers();
      res.json(tiers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/affiliate-tiers", isAdmin, async (req, res) => {
    try {
      const tierData = insertAffiliateTierSchema.parse(req.body);
      const tier = await storage.createAffiliateTier(tierData);
      res.status(201).json(tier);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.patch("/api/admin/affiliate-tiers/:id", isAdmin, async (req, res) => {
    try {
      const validatedData = updateAffiliateTierSchema.parse(req.body);
      const tier = await storage.updateAffiliateTier(req.params.id, validatedData);
      if (!tier) {
        return res.status(404).json({ message: "Tier not found" });
      }
      res.json(tier);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.delete("/api/admin/affiliate-tiers/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteAffiliateTier(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // =====================================================
  // AFFILIATE LINKS ROUTES
  // =====================================================

  app.get("/api/affiliates/:affiliateId/links", isApprovedAffiliate, async (req, res) => {
    try {
      const affiliate = await storage.getAffiliateById(req.params.affiliateId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      
      const userId = (req.user as any).id;
      const userRole = (req.user as any).role;
      if (affiliate.userId !== userId && userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const links = await storage.getAffiliateLinksByAffiliateId(req.params.affiliateId);
      res.json(links);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/affiliates/:affiliateId/links", isApprovedAffiliate, async (req, res) => {
    try {
      const affiliate = await storage.getAffiliateById(req.params.affiliateId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      
      const userId = (req.user as any).id;
      const userRole = (req.user as any).role;
      if (affiliate.userId !== userId && userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const linkData = insertAffiliateLinkSchema.parse({
        ...req.body,
        affiliateId: req.params.affiliateId,
      });
      const link = await storage.createAffiliateLink(linkData);
      res.status(201).json(link);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.delete("/api/affiliate-links/:id", isApprovedAffiliate, async (req, res) => {
    try {
      await storage.deleteAffiliateLink(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // =====================================================
  // COMMISSION LEDGER ROUTES
  // =====================================================

  app.get("/api/affiliates/:affiliateId/ledger", isApprovedAffiliate, async (req, res) => {
    try {
      const affiliate = await storage.getAffiliateById(req.params.affiliateId);
      if (!affiliate) {
        return res.status(404).json({ message: "Affiliate not found" });
      }
      
      const userId = (req.user as any).id;
      const userRole = (req.user as any).role;
      if (affiliate.userId !== userId && userRole !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const ledger = await storage.getCommissionLedger(req.params.affiliateId);
      res.json(ledger);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // =====================================================
  // FEATURE FLAGS ROUTES
  // =====================================================

  app.get("/api/admin/feature-flags", isAdmin, async (_req, res) => {
    try {
      const flags = await storage.getAllFeatureFlags();
      res.json(flags);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/feature-flags", isAdmin, async (req, res) => {
    try {
      const flagData = insertFeatureFlagSchema.parse(req.body);
      const flag = await storage.createFeatureFlag(flagData);
      res.status(201).json(flag);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.patch("/api/admin/feature-flags/:id", isAdmin, async (req, res) => {
    try {
      const validatedData = updateFeatureFlagSchema.parse(req.body);
      const flag = await storage.updateFeatureFlag(req.params.id, validatedData);
      if (!flag) {
        return res.status(404).json({ message: "Feature flag not found" });
      }
      res.json(flag);
    } catch (error: any) {
      res.status(getErrorStatusCode(error)).json({ message: error.message });
    }
  });

  app.delete("/api/admin/feature-flags/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteFeatureFlag(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
