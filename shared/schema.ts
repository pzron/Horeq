import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  avatar: text("avatar"),
  status: text("status").notNull().default("active"),
  department: text("department"),
  lastLoginAt: timestamp("last_login_at"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const roles = pgTable("roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  color: text("color").default("#6B7280"),
  level: integer("level").notNull().default(0),
  isSystem: boolean("is_system").notNull().default(false),
  canManageUsers: boolean("can_manage_users").notNull().default(false),
  canManageProducts: boolean("can_manage_products").notNull().default(false),
  canManageOrders: boolean("can_manage_orders").notNull().default(false),
  canManageAffiliates: boolean("can_manage_affiliates").notNull().default(false),
  canManageCms: boolean("can_manage_cms").notNull().default(false),
  canManageSettings: boolean("can_manage_settings").notNull().default(false),
  canViewReports: boolean("can_view_reports").notNull().default(false),
  canProcessPayments: boolean("can_process_payments").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
});

export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;

export const affiliateTiers = pgTable("affiliate_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  minEarnings: decimal("min_earnings", { precision: 10, scale: 2 }).notNull().default("0"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull(),
  bonusPercentage: decimal("bonus_percentage", { precision: 5, scale: 2 }).default("0"),
  benefits: text("benefits"),
  color: text("color").default("#6B7280"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAffiliateTierSchema = createInsertSchema(affiliateTiers).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliateTier = z.infer<typeof insertAffiliateTierSchema>;
export type AffiliateTier = typeof affiliateTiers.$inferSelect;

export const affiliateLinks = pgTable("affiliate_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  affiliateId: varchar("affiliate_id").notNull(),
  name: text("name").notNull(),
  targetUrl: text("target_url").notNull(),
  shortCode: text("short_code").notNull().unique(),
  clicks: integer("clicks").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAffiliateLinkSchema = createInsertSchema(affiliateLinks).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliateLink = z.infer<typeof insertAffiliateLinkSchema>;
export type AffiliateLink = typeof affiliateLinks.$inferSelect;

export const commissionLedger = pgTable("commission_ledger", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  affiliateId: varchar("affiliate_id").notNull(),
  orderId: varchar("order_id"),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommissionLedgerSchema = createInsertSchema(commissionLedger).omit({
  id: true,
  createdAt: true,
});

export type InsertCommissionLedger = z.infer<typeof insertCommissionLedgerSchema>;
export type CommissionLedger = typeof commissionLedger.$inferSelect;

export const featureFlags = pgTable("feature_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  isEnabled: boolean("is_enabled").notNull().default(false),
  category: text("category").notNull().default("general"),
  roles: text("roles").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;

export const pageRevisions = pgTable("page_revisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").notNull(),
  content: text("content"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  version: integer("version").notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPageRevisionSchema = createInsertSchema(pageRevisions).omit({
  id: true,
  createdAt: true,
});

export type InsertPageRevision = z.infer<typeof insertPageRevisionSchema>;
export type PageRevision = typeof pageRevisions.$inferSelect;

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  image: text("image").notNull(),
  categoryId: varchar("category_id").notNull(),
  stock: integer("stock").notNull().default(0),
  sold: integer("sold").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  comboAvailable: boolean("combo_available").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  affiliateEnabled: boolean("affiliate_enabled").notNull().default(true),
  affiliateCommissionType: text("affiliate_commission_type").notNull().default("percentage"),
  affiliateCommissionValue: decimal("affiliate_commission_value", { precision: 10, scale: 2 }).notNull().default("10.00"),
  affiliatePoints: integer("affiliate_points").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  userId: varchar("user_id").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  status: text("status").notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  affiliateId: varchar("affiliate_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  productId: varchar("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export const affiliates = pgTable("affiliates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  code: text("code").notNull().unique(),
  tierId: varchar("tier_id"),
  commission: decimal("commission", { precision: 5, scale: 2 }).notNull().default("10.00"),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).notNull().default("0"),
  pendingEarnings: decimal("pending_earnings", { precision: 10, scale: 2 }).notNull().default("0"),
  paidEarnings: decimal("paid_earnings", { precision: 10, scale: 2 }).notNull().default("0"),
  totalClicks: integer("total_clicks").notNull().default(0),
  totalConversions: integer("total_conversions").notNull().default(0),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).default("0"),
  status: text("status").notNull().default("pending"),
  applicationNote: text("application_note"),
  paymentMethod: text("payment_method"),
  paymentDetails: text("payment_details"),
  approvedBy: varchar("approved_by"),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAffiliateSchema = createInsertSchema(affiliates).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliate = z.infer<typeof insertAffiliateSchema>;
export type Affiliate = typeof affiliates.$inferSelect;

export const affiliateClicks = pgTable("affiliate_clicks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  affiliateId: varchar("affiliate_id").notNull(),
  ipAddress: text("ip_address"),
  converted: boolean("converted").notNull().default(false),
  orderId: varchar("order_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAffiliateClickSchema = createInsertSchema(affiliateClicks).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliateClick = z.infer<typeof insertAffiliateClickSchema>;
export type AffiliateClick = typeof affiliateClicks.$inferSelect;

export const wishlist = pgTable("wishlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  productId: varchar("product_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWishlistSchema = createInsertSchema(wishlist).omit({
  id: true,
  createdAt: true,
});

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlist.$inferSelect;

// CMS Pages Table
export const pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: text("status").notNull().default("draft"), // draft, published, archived
  template: text("template").default("default"),
  sortOrder: integer("sort_order").default(0),
  parentId: varchar("parent_id"),
  createdBy: varchar("created_by").notNull(),
  updatedBy: varchar("updated_by"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;

// Page Blocks/Widgets Table
export const pageBlocks = pgTable("page_blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").notNull(),
  blockType: text("block_type").notNull(), // hero, text, image, gallery, products, cta, etc.
  content: text("content"), // JSON content for the block
  settings: text("settings"), // JSON settings
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPageBlockSchema = createInsertSchema(pageBlocks).omit({
  id: true,
  createdAt: true,
});

export type InsertPageBlock = z.infer<typeof insertPageBlockSchema>;
export type PageBlock = typeof pageBlocks.$inferSelect;

// Media Library Table
export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  folder: text("folder").default("uploads"),
  uploadedBy: varchar("uploaded_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

// Navigation Menus Table
export const menus = pgTable("menus", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  location: text("location").notNull(), // header, footer, sidebar
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMenuSchema = createInsertSchema(menus).omit({
  id: true,
  createdAt: true,
});

export type InsertMenu = z.infer<typeof insertMenuSchema>;
export type Menu = typeof menus.$inferSelect;

// Menu Items Table
export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menuId: varchar("menu_id").notNull(),
  parentId: varchar("parent_id"),
  label: text("label").notNull(),
  url: text("url"),
  pageId: varchar("page_id"),
  categoryId: varchar("category_id"),
  icon: text("icon"),
  target: text("target").default("_self"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

// Site Settings Table
export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
  settingType: text("setting_type").default("text"), // text, number, boolean, json, image
  settingGroup: text("setting_group").default("general"), // general, appearance, commerce, email, etc.
  description: text("description"),
  updatedBy: varchar("updated_by"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;

// Permissions Table
export const permissions = pgTable("permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  resource: text("resource").notNull(), // pages, products, users, orders, settings, etc.
  action: text("action").notNull(), // create, read, update, delete, publish
});

export const insertPermissionSchema = createInsertSchema(permissions).omit({
  id: true,
});

export type InsertPermission = z.infer<typeof insertPermissionSchema>;
export type Permission = typeof permissions.$inferSelect;

// Role Permissions Junction Table
export const rolePermissions = pgTable("role_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(), // admin, affiliate, customer
  permissionId: varchar("permission_id").notNull(),
});

export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({
  id: true,
});

export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;
export type RolePermission = typeof rolePermissions.$inferSelect;

// Activity Logs Table
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // created, updated, deleted, published, login, logout
  resource: text("resource").notNull(), // user, product, order, page, etc.
  resourceId: varchar("resource_id"),
  details: text("details"), // JSON with additional details
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Affiliate Payouts Table
export const affiliatePayouts = pgTable("affiliate_payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  affiliateId: varchar("affiliate_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, paid, rejected
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  notes: text("notes"),
  processedBy: varchar("processed_by"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAffiliatePayoutSchema = createInsertSchema(affiliatePayouts).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliatePayout = z.infer<typeof insertAffiliatePayoutSchema>;
export type AffiliatePayout = typeof affiliatePayouts.$inferSelect;

// Coupons Table
export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(), // percentage, fixed
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minPurchase: decimal("min_purchase", { precision: 10, scale: 2 }).default("0"),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  affiliateId: varchar("affiliate_id"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  createdAt: true,
});

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

// Notifications Table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"), // info, success, warning, error
  isRead: boolean("is_read").default(false),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Combo Deals Table
export const combos = pgTable("combos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image").notNull(),
  productIds: text("product_ids").array().notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  savings: decimal("savings", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertComboSchema = createInsertSchema(combos).omit({
  id: true,
  createdAt: true,
});

export type InsertCombo = z.infer<typeof insertComboSchema>;
export type Combo = typeof combos.$inferSelect;

// Homepage Banners Table
export const banners = pgTable("banners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  image: text("image").notNull(),
  link: text("link"),
  buttonText: text("button_text"),
  position: text("position").notNull().default("hero"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBannerSchema = createInsertSchema(banners).omit({
  id: true,
  createdAt: true,
});

export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof banners.$inferSelect;

// Affiliate Marketing Materials Table
export const affiliateMaterials = pgTable("affiliate_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // banner, link, text, email_template
  content: text("content").notNull(), // URL for banners, text content, etc.
  dimensions: text("dimensions"), // For banners: 728x90, 300x250, etc.
  category: text("category").default("general"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAffiliateMaterialSchema = createInsertSchema(affiliateMaterials).omit({
  id: true,
  createdAt: true,
});

export type InsertAffiliateMaterial = z.infer<typeof insertAffiliateMaterialSchema>;
export type AffiliateMaterial = typeof affiliateMaterials.$inferSelect;

// System Configuration Table
export const systemConfig = pgTable("system_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // general, payment, email, shipping, affiliate, seo
  configKey: text("config_key").notNull(),
  configValue: text("config_value"),
  configType: text("config_type").default("text"), // text, number, boolean, json, select
  label: text("label").notNull(),
  description: text("description"),
  options: text("options"), // JSON array for select type
  isRequired: boolean("is_required").default(false),
  sortOrder: integer("sort_order").default(0),
  updatedBy: varchar("updated_by"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSystemConfigSchema = createInsertSchema(systemConfig).omit({
  id: true,
  updatedAt: true,
});

export type InsertSystemConfig = z.infer<typeof insertSystemConfigSchema>;
export type SystemConfig = typeof systemConfig.$inferSelect;

// Reports Table for saved/scheduled reports
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // sales, orders, products, affiliates, users
  dateRange: text("date_range"), // JSON with start/end dates
  filters: text("filters"), // JSON with filter criteria
  columns: text("columns"), // JSON array of columns to include
  schedule: text("schedule"), // cron expression for scheduled reports
  lastRun: timestamp("last_run"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

// Email Templates Table
export const emailTemplates = pgTable("email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  variables: text("variables"), // JSON array of available variables
  category: text("category").default("transactional"), // transactional, marketing, affiliate
  isActive: boolean("is_active").default(true),
  updatedBy: varchar("updated_by"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;

// Update user schema helper
export const updateUserSchema = createInsertSchema(users).partial().omit({
  id: true,
  createdAt: true,
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

// Update role schema helper
export const updateRoleSchema = createInsertSchema(roles).partial().omit({
  id: true,
  createdAt: true,
});

export type UpdateRole = z.infer<typeof updateRoleSchema>;
