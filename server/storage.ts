import { 
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Review,
  type InsertReview,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CartItem,
  type InsertCartItem,
  type Affiliate,
  type InsertAffiliate,
  type Wishlist,
  type InsertWishlist,
  type Page,
  type InsertPage,
  type Setting,
  type InsertSetting,
  type Menu,
  type InsertMenu,
  type MenuItem,
  type InsertMenuItem,
  type ActivityLog,
  type InsertActivityLog,
  type AffiliatePayout,
  type InsertAffiliatePayout,
  type Coupon,
  type InsertCoupon,
  type Notification,
  type InsertNotification,
  users,
  products,
  categories,
  reviews,
  orders,
  orderItems,
  cartItems,
  affiliates,
  wishlist,
  pages,
  settings,
  menus,
  menuItems,
  activityLogs,
  affiliatePayouts,
  coupons,
  notifications,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, sql, like } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;
  
  // Reviews
  getReviewsByProduct(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Cart
  getCartItems(userId: string): Promise<CartItem[]>;
  getCartItemById(id: string): Promise<CartItem | undefined>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Orders
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Wishlist
  getWishlist(userId: string): Promise<Wishlist[]>;
  addToWishlist(item: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(id: string): Promise<void>;
  
  // Affiliates
  getAffiliateByUserId(userId: string): Promise<Affiliate | undefined>;
  getAffiliateByCode(code: string): Promise<Affiliate | undefined>;
  createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate>;
  updateAffiliate(id: string, data: Partial<InsertAffiliate>): Promise<Affiliate | undefined>;
  
  // Admin - Users Management
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;
  getUsersByRole(role: string): Promise<User[]>;
  
  // Admin - Orders Management
  getAllOrders(): Promise<Order[]>;
  updateOrder(id: string, data: Partial<Order>): Promise<Order | undefined>;
  
  // Admin - Categories Management
  updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<void>;
  
  // CMS - Pages
  getAllPages(): Promise<Page[]>;
  getPageById(id: string): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, data: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: string): Promise<void>;
  
  // CMS - Settings
  getAllSettings(): Promise<Setting[]>;
  getSettingsByGroup(group: string): Promise<Setting[]>;
  getSettingByKey(key: string): Promise<Setting | undefined>;
  upsertSetting(setting: InsertSetting): Promise<Setting>;
  
  // CMS - Menus
  getAllMenus(): Promise<Menu[]>;
  getMenuByLocation(location: string): Promise<Menu | undefined>;
  createMenu(menu: InsertMenu): Promise<Menu>;
  updateMenu(id: string, data: Partial<InsertMenu>): Promise<Menu | undefined>;
  deleteMenu(id: string): Promise<void>;
  getMenuItems(menuId: string): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, data: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<void>;
  
  // Activity Logs
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  
  // Affiliate Payouts
  getAffiliatePayouts(affiliateId: string): Promise<AffiliatePayout[]>;
  getAllPayouts(): Promise<AffiliatePayout[]>;
  createPayout(payout: InsertAffiliatePayout): Promise<AffiliatePayout>;
  updatePayout(id: string, data: Partial<InsertAffiliatePayout>): Promise<AffiliatePayout | undefined>;
  
  // Coupons
  getAllCoupons(): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: string, data: Partial<InsertCoupon>): Promise<Coupon | undefined>;
  deleteCoupon(id: string): Promise<void>;
  
  // Notifications
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;
  
  // Dashboard Stats
  getDashboardStats(): Promise<{
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: string;
  }>;
}

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.slug, slug));
    return result[0];
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Reviews
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  // Cart
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async getCartItemById(id: string): Promise<CartItem | undefined> {
    const result = await db.select().from(cartItems).where(eq(cartItems.id, id));
    return result[0];
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const existing = await db.select().from(cartItems).where(
      and(eq(cartItems.userId, item.userId), eq(cartItems.productId, item.productId))
    );
    
    if (existing.length > 0) {
      const updated = await db.update(cartItems)
        .set({ quantity: existing[0].quantity + item.quantity })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updated[0];
    }
    
    const result = await db.insert(cartItems).values(item).returning();
    return result[0];
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const result = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return result[0];
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Orders
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(item).returning();
    return result[0];
  }

  // Wishlist
  async getWishlist(userId: string): Promise<Wishlist[]> {
    return await db.select().from(wishlist).where(eq(wishlist.userId, userId));
  }

  async addToWishlist(item: InsertWishlist): Promise<Wishlist> {
    const result = await db.insert(wishlist).values(item).returning();
    return result[0];
  }

  async removeFromWishlist(id: string): Promise<void> {
    await db.delete(wishlist).where(eq(wishlist.id, id));
  }

  // Affiliates
  async getAffiliateByUserId(userId: string): Promise<Affiliate | undefined> {
    const result = await db.select().from(affiliates).where(eq(affiliates.userId, userId));
    return result[0];
  }

  async getAffiliateByCode(code: string): Promise<Affiliate | undefined> {
    const result = await db.select().from(affiliates).where(eq(affiliates.code, code));
    return result[0];
  }

  async createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate> {
    const result = await db.insert(affiliates).values(affiliate).returning();
    return result[0];
  }

  async updateAffiliate(id: string, data: Partial<InsertAffiliate>): Promise<Affiliate | undefined> {
    const result = await db.update(affiliates).set(data).where(eq(affiliates.id, id)).returning();
    return result[0];
  }

  // Admin - Users Management
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  // Admin - Orders Management
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order | undefined> {
    const result = await db.update(orders).set(data).where(eq(orders.id, id)).returning();
    return result[0];
  }

  // Admin - Categories Management
  async updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // CMS - Pages
  async getAllPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(desc(pages.createdAt));
  }

  async getPageById(id: string): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.id, id));
    return result[0];
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const result = await db.select().from(pages).where(eq(pages.slug, slug));
    return result[0];
  }

  async createPage(page: InsertPage): Promise<Page> {
    const result = await db.insert(pages).values(page).returning();
    return result[0];
  }

  async updatePage(id: string, data: Partial<InsertPage>): Promise<Page | undefined> {
    const result = await db.update(pages).set({ ...data, updatedAt: new Date() }).where(eq(pages.id, id)).returning();
    return result[0];
  }

  async deletePage(id: string): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }

  // CMS - Settings
  async getAllSettings(): Promise<Setting[]> {
    return await db.select().from(settings);
  }

  async getSettingsByGroup(group: string): Promise<Setting[]> {
    return await db.select().from(settings).where(eq(settings.settingGroup, group));
  }

  async getSettingByKey(key: string): Promise<Setting | undefined> {
    const result = await db.select().from(settings).where(eq(settings.settingKey, key));
    return result[0];
  }

  async upsertSetting(setting: InsertSetting): Promise<Setting> {
    const existing = await this.getSettingByKey(setting.settingKey);
    if (existing) {
      const result = await db.update(settings)
        .set({ ...setting, updatedAt: new Date() })
        .where(eq(settings.settingKey, setting.settingKey))
        .returning();
      return result[0];
    }
    const result = await db.insert(settings).values(setting).returning();
    return result[0];
  }

  // CMS - Menus
  async getAllMenus(): Promise<Menu[]> {
    return await db.select().from(menus);
  }

  async getMenuByLocation(location: string): Promise<Menu | undefined> {
    const result = await db.select().from(menus).where(eq(menus.location, location));
    return result[0];
  }

  async createMenu(menu: InsertMenu): Promise<Menu> {
    const result = await db.insert(menus).values(menu).returning();
    return result[0];
  }

  async updateMenu(id: string, data: Partial<InsertMenu>): Promise<Menu | undefined> {
    const result = await db.update(menus).set(data).where(eq(menus.id, id)).returning();
    return result[0];
  }

  async deleteMenu(id: string): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.menuId, id));
    await db.delete(menus).where(eq(menus.id, id));
  }

  async getMenuItems(menuId: string): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.menuId, menuId)).orderBy(menuItems.sortOrder);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const result = await db.insert(menuItems).values(item).returning();
    return result[0];
  }

  async updateMenuItem(id: string, data: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const result = await db.update(menuItems).set(data).where(eq(menuItems.id, id)).returning();
    return result[0];
  }

  async deleteMenuItem(id: string): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // Activity Logs
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const result = await db.insert(activityLogs).values(log).returning();
    return result[0];
  }

  async getActivityLogs(limit = 100): Promise<ActivityLog[]> {
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
  }

  // Affiliate Payouts
  async getAffiliatePayouts(affiliateId: string): Promise<AffiliatePayout[]> {
    return await db.select().from(affiliatePayouts).where(eq(affiliatePayouts.affiliateId, affiliateId)).orderBy(desc(affiliatePayouts.createdAt));
  }

  async getAllPayouts(): Promise<AffiliatePayout[]> {
    return await db.select().from(affiliatePayouts).orderBy(desc(affiliatePayouts.createdAt));
  }

  async createPayout(payout: InsertAffiliatePayout): Promise<AffiliatePayout> {
    const result = await db.insert(affiliatePayouts).values(payout).returning();
    return result[0];
  }

  async updatePayout(id: string, data: Partial<InsertAffiliatePayout>): Promise<AffiliatePayout | undefined> {
    const result = await db.update(affiliatePayouts).set(data).where(eq(affiliatePayouts.id, id)).returning();
    return result[0];
  }

  // Coupons
  async getAllCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const result = await db.select().from(coupons).where(eq(coupons.code, code));
    return result[0];
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const result = await db.insert(coupons).values(coupon).returning();
    return result[0];
  }

  async updateCoupon(id: string, data: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    const result = await db.update(coupons).set(data).where(eq(coupons.id, id)).returning();
    return result[0];
  }

  async deleteCoupon(id: string): Promise<void> {
    await db.delete(coupons).where(eq(coupons.id, id));
  }

  // Notifications
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async markNotificationRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    totalRevenue: string;
  }> {
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [ordersCount] = await db.select({ count: count() }).from(orders);
    const [productsCount] = await db.select({ count: count() }).from(products);
    const [revenueResult] = await db.select({ 
      total: sql<string>`COALESCE(SUM(${orders.total}), 0)` 
    }).from(orders);
    
    return {
      totalUsers: usersCount?.count || 0,
      totalOrders: ordersCount?.count || 0,
      totalProducts: productsCount?.count || 0,
      totalRevenue: revenueResult?.total || "0",
    };
  }
}

export const storage = new DbStorage();
