
import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === PRODUCTS ===
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(), // Stored as string in DB, handled as number in app
  category: text("category").notNull(), // e.g., "Signatures", "Sides", "Beverages", "Rice & Bases", "Sauces"
  imageUrl: text("image_url").notNull(),
  available: boolean("available").default(true).notNull(),
  sizes: jsonb("sizes").$type<{ label: string; price: number }[] | null>().default(null), // For size variants like "2pcs", "4pcs"
  badges: jsonb("badges").$type<string[]>().default([]), // For product badges like "Bestseller", "Spicy", "New"
});

// === USERS ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  role: text("role").default("customer").notNull(), // "customer" or "admin"
  createdAt: timestamp("created_at").defaultNow(),
});

// === ORDERS ===
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"), // Optional email for marketing
  customerAddress: text("customer_address").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  status: text("status").default("pending").notNull(), // pending, paid, confirmed, delivered, cancelled
  paymentIntentId: text("payment_intent_id"),
  paymentStatus: text("payment_status").default("unpaid").notNull(), // unpaid, paid, failed, refunded
  cookieConsent: jsonb("cookie_consent").$type<{ marketing: boolean; analytics: boolean; timestamp: number } | null>().default(null), // Stores customer cookie/marketing consent
  createdAt: timestamp("created_at").defaultNow(),
});

// === ORDER ITEMS ===
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  priceAtTime: numeric("price_at_time").notNull(),
  selectedSize: text("selected_size"), // For products with sizes, stores which size was selected (e.g., "2pcs", "4pcs")
});

// === RELATIONS ===
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// === ZOD SCHEMAS ===
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const selectUserSchema = createSelectSchema(users).omit({ passwordHash: true }); // For client-side user data (without password hash)

// === EXPLICIT TYPES ===
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PublicUser = z.infer<typeof selectUserSchema>; // User type safe to send to client (passwordHash is present)

// API Request Types
export type CreateOrderRequest = InsertOrder & {
  items: { productId: number; quantity: number }[];
};

export type OrderResponse = Order & {
  items: (OrderItem & { product: Product })[];
};

// Admin types for order management and analytics
export type OrderFilters = {
  status?: string;
  paymentStatus?: string;
  customerName?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
};

export type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenueGrowth: number;
  ordersGrowth: number;
};

export type OrderAnalytics = {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
};

// Customer Analytics Types
export type CustomerInsight = {
  customerPhone: string;
  customerName: string;
  customerEmail: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  averageOrderValue: number;
  isInactive: boolean; // No order in 30+ days
};

export type CustomerAnalytics = {
  totalCustomers: number;
  activeCustomers: number; // Ordered in last 30 days
  inactiveCustomers: number; // No order in 30+ days
  customers: CustomerInsight[];
};
