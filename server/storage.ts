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
  type AffiliateClick,
  type InsertAffiliateClick,
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
  type Combo,
  type InsertCombo,
  type Banner,
  type InsertBanner,
  type Role,
  type InsertRole,
  type AffiliateTier,
  type InsertAffiliateTier,
  type AffiliateLink,
  type InsertAffiliateLink,
  type CommissionLedger,
  type InsertCommissionLedger,
  type FeatureFlag,
  type InsertFeatureFlag,
  type PageRevision,
  type InsertPageRevision,
  type Transaction,
  type InsertTransaction,
  type InventoryRecord,
  type InsertInventoryRecord,
  type Supplier,
  type InsertSupplier,
  type StockAlert,
  type InsertStockAlert,
  type Brand,
  type InsertBrand,
  type VendorStore,
  type InsertVendorStore,
  type VendorApplication,
  type InsertVendorApplication,
  type ProductVariant,
  type InsertProductVariant,
  type ProductImage,
  type InsertProductImage,
  type PaymentMethod,
  type InsertPaymentMethod,
  type VendorNotification,
  type InsertVendorNotification,
  type OrderTracking,
  type InsertOrderTracking,
  users,
  products,
  categories,
  reviews,
  orders,
  orderItems,
  cartItems,
  affiliates,
  affiliateClicks,
  wishlist,
  pages,
  settings,
  menus,
  menuItems,
  activityLogs,
  affiliatePayouts,
  coupons,
  notifications,
  combos,
  banners,
  roles,
  affiliateTiers,
  affiliateLinks,
  commissionLedger,
  featureFlags,
  pageRevisions,
  transactions,
  inventoryRecords,
  suppliers,
  stockAlerts,
  brands,
  vendorStores,
  vendorApplications,
  productVariants,
  productImages,
  paymentMethods,
  vendorNotifications,
  orderTracking,
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
  getAffiliateById(id: string): Promise<Affiliate | undefined>;
  getAllAffiliates(): Promise<Affiliate[]>;
  createAffiliate(affiliate: InsertAffiliate): Promise<Affiliate>;
  updateAffiliate(id: string, data: Partial<InsertAffiliate>): Promise<Affiliate | undefined>;
  
  // Affiliate Clicks
  createAffiliateClick(click: InsertAffiliateClick): Promise<AffiliateClick>;
  getAffiliateClicks(affiliateId: string): Promise<AffiliateClick[]>;
  markClickConverted(clickId: string, orderId: string): Promise<AffiliateClick | undefined>;
  incrementAffiliateClicks(affiliateId: string): Promise<void>;
  incrementAffiliateConversions(affiliateId: string, commission: string): Promise<void>;
  
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

  // Combos
  getAllCombos(): Promise<Combo[]>;
  getComboById(id: string): Promise<Combo | undefined>;
  createCombo(combo: InsertCombo): Promise<Combo>;
  updateCombo(id: string, data: Partial<InsertCombo>): Promise<Combo | undefined>;
  deleteCombo(id: string): Promise<void>;

  // Banners
  getAllBanners(): Promise<Banner[]>;
  getBannerById(id: string): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: string, data: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: string): Promise<void>;

  // Roles
  getAllRoles(): Promise<Role[]>;
  getRoleByName(name: string): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: string, data: Partial<InsertRole>): Promise<Role | undefined>;
  deleteRole(id: string): Promise<void>;

  // Affiliate Tiers
  getAllAffiliateTiers(): Promise<AffiliateTier[]>;
  createAffiliateTier(tier: InsertAffiliateTier): Promise<AffiliateTier>;
  updateAffiliateTier(id: string, data: Partial<InsertAffiliateTier>): Promise<AffiliateTier | undefined>;
  deleteAffiliateTier(id: string): Promise<void>;

  // Affiliate Links
  getAffiliateLinksByAffiliateId(affiliateId: string): Promise<AffiliateLink[]>;
  createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink>;
  updateAffiliateLink(id: string, data: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined>;
  deleteAffiliateLink(id: string): Promise<void>;
  incrementAffiliateLinkClicks(id: string): Promise<void>;

  // Commission Ledger
  getCommissionLedger(affiliateId: string): Promise<CommissionLedger[]>;
  createCommissionEntry(entry: InsertCommissionLedger): Promise<CommissionLedger>;

  // Feature Flags
  getAllFeatureFlags(): Promise<FeatureFlag[]>;
  getFeatureFlagByName(name: string): Promise<FeatureFlag | undefined>;
  createFeatureFlag(flag: InsertFeatureFlag): Promise<FeatureFlag>;
  updateFeatureFlag(id: string, data: Partial<InsertFeatureFlag>): Promise<FeatureFlag | undefined>;
  deleteFeatureFlag(id: string): Promise<void>;

  // Page Revisions
  getPageRevisions(pageId: string): Promise<PageRevision[]>;
  createPageRevision(revision: InsertPageRevision): Promise<PageRevision>;

  // Search Users
  searchUsers(query: string): Promise<User[]>;
  getUsersCount(): Promise<number>;

  // Brands
  getAllBrands(): Promise<Brand[]>;
  getBrandById(id: string): Promise<Brand | undefined>;
  getBrandBySlug(slug: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, data: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: string): Promise<void>;

  // Vendor Stores
  getAllVendorStores(): Promise<VendorStore[]>;
  getVendorStoreById(id: string): Promise<VendorStore | undefined>;
  getVendorStoreByUserId(userId: string): Promise<VendorStore | undefined>;
  getVendorStoreBySlug(slug: string): Promise<VendorStore | undefined>;
  createVendorStore(store: InsertVendorStore): Promise<VendorStore>;
  updateVendorStore(id: string, data: Partial<InsertVendorStore>): Promise<VendorStore | undefined>;
  deleteVendorStore(id: string): Promise<void>;

  // Vendor Applications
  getAllVendorApplications(): Promise<VendorApplication[]>;
  getVendorApplicationById(id: string): Promise<VendorApplication | undefined>;
  getVendorApplicationByUserId(userId: string): Promise<VendorApplication | undefined>;
  createVendorApplication(application: InsertVendorApplication): Promise<VendorApplication>;
  updateVendorApplication(id: string, data: Partial<InsertVendorApplication>): Promise<VendorApplication | undefined>;

  // Vendor Products
  getProductsByVendorStore(vendorStoreId: string): Promise<Product[]>;
  getProductsByBrand(brandId: string): Promise<Product[]>;

  // Product Variants
  getProductVariants(productId: string): Promise<ProductVariant[]>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateProductVariant(id: string, data: Partial<InsertProductVariant>): Promise<ProductVariant | undefined>;
  deleteProductVariant(id: string): Promise<void>;

  // Product Images
  getProductImages(productId: string): Promise<ProductImage[]>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;
  deleteProductImage(id: string): Promise<void>;

  // Payment Methods
  getPaymentMethodsByVendor(vendorStoreId: string): Promise<PaymentMethod[]>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: string, data: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined>;
  deletePaymentMethod(id: string): Promise<void>;

  // Vendor Notifications
  getVendorNotifications(vendorStoreId: string): Promise<VendorNotification[]>;
  createVendorNotification(notification: InsertVendorNotification): Promise<VendorNotification>;
  markVendorNotificationRead(id: string): Promise<void>;
  getUnreadNotificationsCount(vendorStoreId: string): Promise<number>;

  // Order Tracking
  getOrderTracking(orderId: string): Promise<OrderTracking | undefined>;
  createOrderTracking(tracking: InsertOrderTracking): Promise<OrderTracking>;
  updateOrderTracking(id: string, data: Partial<InsertOrderTracking>): Promise<OrderTracking | undefined>;
  getTrackingByShareableLink(link: string): Promise<OrderTracking | undefined>;
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
        .set({ quantity: existing[0].quantity + (item.quantity ?? 1) })
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

  async getAffiliateById(id: string): Promise<Affiliate | undefined> {
    const result = await db.select().from(affiliates).where(eq(affiliates.id, id));
    return result[0];
  }

  async getAllAffiliates(): Promise<Affiliate[]> {
    return await db.select().from(affiliates).orderBy(desc(affiliates.createdAt));
  }

  // Affiliate Clicks
  async createAffiliateClick(click: InsertAffiliateClick): Promise<AffiliateClick> {
    const result = await db.insert(affiliateClicks).values(click).returning();
    return result[0];
  }

  async getAffiliateClicks(affiliateId: string): Promise<AffiliateClick[]> {
    return await db.select().from(affiliateClicks).where(eq(affiliateClicks.affiliateId, affiliateId)).orderBy(desc(affiliateClicks.createdAt));
  }

  async markClickConverted(clickId: string, orderId: string): Promise<AffiliateClick | undefined> {
    const result = await db.update(affiliateClicks)
      .set({ converted: true, orderId })
      .where(eq(affiliateClicks.id, clickId))
      .returning();
    return result[0];
  }

  async incrementAffiliateClicks(affiliateId: string): Promise<void> {
    await db.update(affiliates)
      .set({ totalClicks: sql`${affiliates.totalClicks} + 1` })
      .where(eq(affiliates.id, affiliateId));
  }

  async incrementAffiliateConversions(affiliateId: string, commission: string): Promise<void> {
    await db.update(affiliates)
      .set({ 
        totalConversions: sql`${affiliates.totalConversions} + 1`,
        totalEarnings: sql`${affiliates.totalEarnings} + ${commission}::decimal`
      })
      .where(eq(affiliates.id, affiliateId));
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

  // Combos
  async getAllCombos(): Promise<Combo[]> {
    return await db.select().from(combos).orderBy(combos.sortOrder);
  }

  async getComboById(id: string): Promise<Combo | undefined> {
    const result = await db.select().from(combos).where(eq(combos.id, id));
    return result[0];
  }

  async createCombo(combo: InsertCombo): Promise<Combo> {
    const result = await db.insert(combos).values(combo).returning();
    return result[0];
  }

  async updateCombo(id: string, data: Partial<InsertCombo>): Promise<Combo | undefined> {
    const result = await db.update(combos).set(data).where(eq(combos.id, id)).returning();
    return result[0];
  }

  async deleteCombo(id: string): Promise<void> {
    await db.delete(combos).where(eq(combos.id, id));
  }

  // Banners
  async getAllBanners(): Promise<Banner[]> {
    return await db.select().from(banners).orderBy(banners.sortOrder);
  }

  async getBannerById(id: string): Promise<Banner | undefined> {
    const result = await db.select().from(banners).where(eq(banners.id, id));
    return result[0];
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const result = await db.insert(banners).values(banner).returning();
    return result[0];
  }

  async updateBanner(id: string, data: Partial<InsertBanner>): Promise<Banner | undefined> {
    const result = await db.update(banners).set(data).where(eq(banners.id, id)).returning();
    return result[0];
  }

  async deleteBanner(id: string): Promise<void> {
    await db.delete(banners).where(eq(banners.id, id));
  }

  // Roles
  async getAllRoles(): Promise<Role[]> {
    return await db.select().from(roles).orderBy(roles.level);
  }

  async getRoleByName(name: string): Promise<Role | undefined> {
    const result = await db.select().from(roles).where(eq(roles.name, name));
    return result[0];
  }

  async createRole(role: InsertRole): Promise<Role> {
    const result = await db.insert(roles).values(role).returning();
    return result[0];
  }

  async updateRole(id: string, data: Partial<InsertRole>): Promise<Role | undefined> {
    const result = await db.update(roles).set(data).where(eq(roles.id, id)).returning();
    return result[0];
  }

  async deleteRole(id: string): Promise<void> {
    await db.delete(roles).where(eq(roles.id, id));
  }

  // Affiliate Tiers
  async getAllAffiliateTiers(): Promise<AffiliateTier[]> {
    return await db.select().from(affiliateTiers).orderBy(affiliateTiers.sortOrder);
  }

  async createAffiliateTier(tier: InsertAffiliateTier): Promise<AffiliateTier> {
    const result = await db.insert(affiliateTiers).values(tier).returning();
    return result[0];
  }

  async updateAffiliateTier(id: string, data: Partial<InsertAffiliateTier>): Promise<AffiliateTier | undefined> {
    const result = await db.update(affiliateTiers).set(data).where(eq(affiliateTiers.id, id)).returning();
    return result[0];
  }

  async deleteAffiliateTier(id: string): Promise<void> {
    await db.delete(affiliateTiers).where(eq(affiliateTiers.id, id));
  }

  // Affiliate Links
  async getAffiliateLinksByAffiliateId(affiliateId: string): Promise<AffiliateLink[]> {
    return await db.select().from(affiliateLinks).where(eq(affiliateLinks.affiliateId, affiliateId));
  }

  async createAffiliateLink(link: InsertAffiliateLink): Promise<AffiliateLink> {
    const result = await db.insert(affiliateLinks).values(link).returning();
    return result[0];
  }

  async updateAffiliateLink(id: string, data: Partial<InsertAffiliateLink>): Promise<AffiliateLink | undefined> {
    const result = await db.update(affiliateLinks).set(data).where(eq(affiliateLinks.id, id)).returning();
    return result[0];
  }

  async deleteAffiliateLink(id: string): Promise<void> {
    await db.delete(affiliateLinks).where(eq(affiliateLinks.id, id));
  }

  async incrementAffiliateLinkClicks(id: string): Promise<void> {
    await db.update(affiliateLinks).set({ 
      clicks: sql`${affiliateLinks.clicks} + 1` 
    }).where(eq(affiliateLinks.id, id));
  }

  // Commission Ledger
  async getCommissionLedger(affiliateId: string): Promise<CommissionLedger[]> {
    return await db.select().from(commissionLedger).where(eq(commissionLedger.affiliateId, affiliateId)).orderBy(desc(commissionLedger.createdAt));
  }

  async createCommissionEntry(entry: InsertCommissionLedger): Promise<CommissionLedger> {
    const result = await db.insert(commissionLedger).values(entry).returning();
    return result[0];
  }

  // Feature Flags
  async getAllFeatureFlags(): Promise<FeatureFlag[]> {
    return await db.select().from(featureFlags);
  }

  async getFeatureFlagByName(name: string): Promise<FeatureFlag | undefined> {
    const result = await db.select().from(featureFlags).where(eq(featureFlags.name, name));
    return result[0];
  }

  async createFeatureFlag(flag: InsertFeatureFlag): Promise<FeatureFlag> {
    const result = await db.insert(featureFlags).values(flag).returning();
    return result[0];
  }

  async updateFeatureFlag(id: string, data: Partial<InsertFeatureFlag>): Promise<FeatureFlag | undefined> {
    const result = await db.update(featureFlags).set(data).where(eq(featureFlags.id, id)).returning();
    return result[0];
  }

  async deleteFeatureFlag(id: string): Promise<void> {
    await db.delete(featureFlags).where(eq(featureFlags.id, id));
  }

  // Page Revisions
  async getPageRevisions(pageId: string): Promise<PageRevision[]> {
    return await db.select().from(pageRevisions).where(eq(pageRevisions.pageId, pageId)).orderBy(desc(pageRevisions.version));
  }

  async createPageRevision(revision: InsertPageRevision): Promise<PageRevision> {
    const result = await db.insert(pageRevisions).values(revision).returning();
    return result[0];
  }

  // Search Users
  async searchUsers(query: string): Promise<User[]> {
    return await db.select().from(users).where(
      sql`${users.username} ILIKE ${`%${query}%`} OR ${users.email} ILIKE ${`%${query}%`} OR ${users.firstName} ILIKE ${`%${query}%`} OR ${users.lastName} ILIKE ${`%${query}%`}`
    );
  }

  async getUsersCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(users);
    return result?.count || 0;
  }

  // Transactions
  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0];
  }

  async getTransactionsByType(type: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.type, type)).orderBy(desc(transactions.createdAt));
  }

  async getTransactionsByStatus(status: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.status, status)).orderBy(desc(transactions.createdAt));
  }

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async updateTransaction(id: string, data: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const result = await db.update(transactions).set({ ...data, updatedAt: new Date() }).where(eq(transactions.id, id)).returning();
    return result[0];
  }

  async getTransactionStats(): Promise<{ totalTransactions: number; totalAmount: string; pendingAmount: string; completedAmount: string }> {
    const allTx = await db.select().from(transactions);
    const total = allTx.reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
    const pending = allTx.filter(t => t.status === "pending").reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
    const completed = allTx.filter(t => t.status === "completed").reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
    return {
      totalTransactions: allTx.length,
      totalAmount: total.toFixed(2),
      pendingAmount: pending.toFixed(2),
      completedAmount: completed.toFixed(2),
    };
  }

  // Inventory Records
  async getAllInventoryRecords(): Promise<InventoryRecord[]> {
    return await db.select().from(inventoryRecords).orderBy(desc(inventoryRecords.createdAt));
  }

  async getInventoryRecordById(id: string): Promise<InventoryRecord | undefined> {
    const result = await db.select().from(inventoryRecords).where(eq(inventoryRecords.id, id));
    return result[0];
  }

  async getInventoryRecordsByProduct(productId: string): Promise<InventoryRecord[]> {
    return await db.select().from(inventoryRecords).where(eq(inventoryRecords.productId, productId)).orderBy(desc(inventoryRecords.createdAt));
  }

  async getInventoryRecordsByType(type: string): Promise<InventoryRecord[]> {
    return await db.select().from(inventoryRecords).where(eq(inventoryRecords.type, type)).orderBy(desc(inventoryRecords.createdAt));
  }

  async createInventoryRecord(record: InsertInventoryRecord): Promise<InventoryRecord> {
    const result = await db.insert(inventoryRecords).values(record).returning();
    return result[0];
  }

  async updateInventoryRecord(id: string, data: Partial<InsertInventoryRecord>): Promise<InventoryRecord | undefined> {
    const result = await db.update(inventoryRecords).set({ ...data, updatedAt: new Date() }).where(eq(inventoryRecords.id, id)).returning();
    return result[0];
  }

  async getInventoryStats(): Promise<{ totalRecords: number; stockInCount: number; stockOutCount: number; returnCount: number }> {
    const allRecords = await db.select().from(inventoryRecords);
    return {
      totalRecords: allRecords.length,
      stockInCount: allRecords.filter(r => r.type === "stock_in").length,
      stockOutCount: allRecords.filter(r => r.type === "stock_out").length,
      returnCount: allRecords.filter(r => r.type === "return").length,
    };
  }

  // Suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(desc(suppliers.createdAt));
  }

  async getSupplierById(id: string): Promise<Supplier | undefined> {
    const result = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return result[0];
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const result = await db.insert(suppliers).values(supplier).returning();
    return result[0];
  }

  async updateSupplier(id: string, data: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const result = await db.update(suppliers).set({ ...data, updatedAt: new Date() }).where(eq(suppliers.id, id)).returning();
    return result[0];
  }

  async deleteSupplier(id: string): Promise<void> {
    await db.delete(suppliers).where(eq(suppliers.id, id));
  }

  // Stock Alerts
  async getAllStockAlerts(): Promise<StockAlert[]> {
    return await db.select().from(stockAlerts).orderBy(desc(stockAlerts.createdAt));
  }

  async getActiveStockAlerts(): Promise<StockAlert[]> {
    return await db.select().from(stockAlerts).where(eq(stockAlerts.status, "active")).orderBy(desc(stockAlerts.createdAt));
  }

  async createStockAlert(alert: InsertStockAlert): Promise<StockAlert> {
    const result = await db.insert(stockAlerts).values(alert).returning();
    return result[0];
  }

  async updateStockAlert(id: string, data: Partial<InsertStockAlert>): Promise<StockAlert | undefined> {
    const result = await db.update(stockAlerts).set(data).where(eq(stockAlerts.id, id)).returning();
    return result[0];
  }

  // Brands
  async getAllBrands(): Promise<Brand[]> {
    return await db.select().from(brands).orderBy(brands.sortOrder);
  }

  async getBrandById(id: string): Promise<Brand | undefined> {
    const result = await db.select().from(brands).where(eq(brands.id, id));
    return result[0];
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    const result = await db.select().from(brands).where(eq(brands.slug, slug));
    return result[0];
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const result = await db.insert(brands).values(brand).returning();
    return result[0];
  }

  async updateBrand(id: string, data: Partial<InsertBrand>): Promise<Brand | undefined> {
    const result = await db.update(brands).set(data).where(eq(brands.id, id)).returning();
    return result[0];
  }

  async deleteBrand(id: string): Promise<void> {
    await db.delete(brands).where(eq(brands.id, id));
  }

  // Vendor Stores
  async getAllVendorStores(): Promise<VendorStore[]> {
    return await db.select().from(vendorStores).orderBy(desc(vendorStores.createdAt));
  }

  async getVendorStoreById(id: string): Promise<VendorStore | undefined> {
    const result = await db.select().from(vendorStores).where(eq(vendorStores.id, id));
    return result[0];
  }

  async getVendorStoreByUserId(userId: string): Promise<VendorStore | undefined> {
    const result = await db.select().from(vendorStores).where(eq(vendorStores.userId, userId));
    return result[0];
  }

  async getVendorStoreBySlug(slug: string): Promise<VendorStore | undefined> {
    const result = await db.select().from(vendorStores).where(eq(vendorStores.slug, slug));
    return result[0];
  }

  async createVendorStore(store: InsertVendorStore): Promise<VendorStore> {
    const result = await db.insert(vendorStores).values(store).returning();
    return result[0];
  }

  async updateVendorStore(id: string, data: Partial<InsertVendorStore>): Promise<VendorStore | undefined> {
    const result = await db.update(vendorStores).set({ ...data, updatedAt: new Date() }).where(eq(vendorStores.id, id)).returning();
    return result[0];
  }

  async deleteVendorStore(id: string): Promise<void> {
    await db.delete(vendorStores).where(eq(vendorStores.id, id));
  }

  // Vendor Applications
  async getAllVendorApplications(): Promise<VendorApplication[]> {
    return await db.select().from(vendorApplications).orderBy(desc(vendorApplications.createdAt));
  }

  async getVendorApplicationById(id: string): Promise<VendorApplication | undefined> {
    const result = await db.select().from(vendorApplications).where(eq(vendorApplications.id, id));
    return result[0];
  }

  async getVendorApplicationByUserId(userId: string): Promise<VendorApplication | undefined> {
    const result = await db.select().from(vendorApplications).where(eq(vendorApplications.userId, userId));
    return result[0];
  }

  async createVendorApplication(application: InsertVendorApplication): Promise<VendorApplication> {
    const result = await db.insert(vendorApplications).values(application).returning();
    return result[0];
  }

  async updateVendorApplication(id: string, data: Partial<InsertVendorApplication>): Promise<VendorApplication | undefined> {
    const result = await db.update(vendorApplications).set(data).where(eq(vendorApplications.id, id)).returning();
    return result[0];
  }

  // Vendor Products
  async getProductsByVendorStore(vendorStoreId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.vendorStoreId, vendorStoreId)).orderBy(desc(products.createdAt));
  }

  async getProductsByBrand(brandId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.brandId, brandId)).orderBy(desc(products.createdAt));
  }

  // Product Variants
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    return await db.select().from(productVariants).where(eq(productVariants.productId, productId));
  }

  async createProductVariant(variant: InsertProductVariant): Promise<ProductVariant> {
    const result = await db.insert(productVariants).values(variant).returning();
    return result[0];
  }

  async updateProductVariant(id: string, data: Partial<InsertProductVariant>): Promise<ProductVariant | undefined> {
    const result = await db.update(productVariants).set(data).where(eq(productVariants.id, id)).returning();
    return result[0];
  }

  async deleteProductVariant(id: string): Promise<void> {
    await db.delete(productVariants).where(eq(productVariants.id, id));
  }

  // Product Images
  async getProductImages(productId: string): Promise<ProductImage[]> {
    return await db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(productImages.sortOrder);
  }

  async createProductImage(image: InsertProductImage): Promise<ProductImage> {
    const result = await db.insert(productImages).values(image).returning();
    return result[0];
  }

  async deleteProductImage(id: string): Promise<void> {
    await db.delete(productImages).where(eq(productImages.id, id));
  }

  // Payment Methods
  async getPaymentMethodsByVendor(vendorStoreId: string): Promise<PaymentMethod[]> {
    return await db.select().from(paymentMethods).where(eq(paymentMethods.vendorStoreId, vendorStoreId)).orderBy(paymentMethods.sortOrder);
  }

  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const result = await db.insert(paymentMethods).values(method).returning();
    return result[0];
  }

  async updatePaymentMethod(id: string, data: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined> {
    const result = await db.update(paymentMethods).set({ ...data, updatedAt: new Date() }).where(eq(paymentMethods.id, id)).returning();
    return result[0];
  }

  async deletePaymentMethod(id: string): Promise<void> {
    await db.delete(paymentMethods).where(eq(paymentMethods.id, id));
  }

  // Vendor Notifications
  async getVendorNotifications(vendorStoreId: string): Promise<VendorNotification[]> {
    return await db.select().from(vendorNotifications).where(eq(vendorNotifications.vendorStoreId, vendorStoreId)).orderBy(desc(vendorNotifications.createdAt));
  }

  async createVendorNotification(notification: InsertVendorNotification): Promise<VendorNotification> {
    const result = await db.insert(vendorNotifications).values(notification).returning();
    return result[0];
  }

  async markVendorNotificationRead(id: string): Promise<void> {
    await db.update(vendorNotifications).set({ isRead: true, readAt: new Date() }).where(eq(vendorNotifications.id, id));
  }

  async getUnreadNotificationsCount(vendorStoreId: string): Promise<number> {
    const result = await db.select({ count: count() }).from(vendorNotifications).where(and(eq(vendorNotifications.vendorStoreId, vendorStoreId), eq(vendorNotifications.isRead, false)));
    return result[0]?.count || 0;
  }

  // Order Tracking
  async getOrderTracking(orderId: string): Promise<OrderTracking | undefined> {
    const result = await db.select().from(orderTracking).where(eq(orderTracking.orderId, orderId));
    return result[0];
  }

  async createOrderTracking(tracking: InsertOrderTracking): Promise<OrderTracking> {
    const result = await db.insert(orderTracking).values(tracking).returning();
    return result[0];
  }

  async updateOrderTracking(id: string, data: Partial<InsertOrderTracking>): Promise<OrderTracking | undefined> {
    const result = await db.update(orderTracking).set({ ...data, updatedAt: new Date() }).where(eq(orderTracking.id, id)).returning();
    return result[0];
  }

  async getTrackingByShareableLink(link: string): Promise<OrderTracking | undefined> {
    const result = await db.select().from(orderTracking).where(eq(orderTracking.shareableLink, link));
    return result[0];
  }
}

export const storage = new DbStorage();
