
import { db } from "./db";
import {
  products,
  orders,
  orderItems,
  users, // Added users table
  type Product,
  type Order,
  type User, // Added User type
  type InsertProduct,
  type InsertOrder,
  type InsertUser, // Added InsertUser type
  type OrderResponse,
  type CreateOrderRequest,
  type OrderFilters,
  type DashboardStats,
  type OrderAnalytics,
  type CustomerInsight,
  type CustomerAnalytics
} from "@shared/schema";
import { eq, and, gte, lte, ilike, sql, desc, inArray } from "drizzle-orm";

// Order creation input - items only, total calculated server-side
export type OrderCreateInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: { productId: number; quantity: number }[];
  cookieConsent?: { marketing: boolean; analytics: boolean; timestamp: number };
};

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Orders
  createOrder(orderReq: OrderCreateInput): Promise<OrderResponse>;
  getOrder(id: number): Promise<OrderResponse | undefined>;
  updateOrderPayment(id: number, paymentIntentId: string, paymentStatus: string, status?: string): Promise<Order | undefined>;

  // Users
  createUser(user: InsertUser): Promise<User>;
  findUserByEmail(email: string): Promise<User | undefined>;
  findUserById(id: number): Promise<User | undefined>;

  // Admin - Orders Management
  getOrders(filters?: OrderFilters): Promise<OrderResponse[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Admin - Analytics
  getDashboardStats(): Promise<DashboardStats>;
  getOrdersAnalytics(): Promise<OrderAnalytics>;
  getCustomerAnalytics(): Promise<CustomerAnalytics>;

  // Admin - Export
  exportOrders(format: 'csv' | 'json', filters?: OrderFilters): Promise<string>;
  exportCustomers(format: 'csv' | 'json'): Promise<string>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product as any).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db.update(products).set(product as any).where(eq(products.id, id)).returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async createOrder(orderReq: OrderCreateInput): Promise<OrderResponse> {
    // 1. Calculate total (in a real app, verify prices from DB)
    // For MVP we will trust the product prices from DB lookup loop or just sum them up
    
    // We need to fetch products to get current prices
    let total = 0;
    const itemsToInsert = [];

    // Start transaction-like logic (simplified for MVP)
    for (const item of orderReq.items) {
      const product = await this.getProduct(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      const price = Number(product.price);
      total += price * item.quantity;
      itemsToInsert.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: product.price // keep as string/numeric
      });
    }

    // 2. Insert Order (with optional cookie consent)
    const [newOrder] = await db.insert(orders).values({
      customerName: orderReq.customerName,
      customerPhone: orderReq.customerPhone,
      customerEmail: orderReq.customerEmail || null,
      customerAddress: orderReq.customerAddress,
      totalAmount: total.toString(),
      status: "pending",
      cookieConsent: orderReq.cookieConsent || null, // Persist consent if provided
    }).returning();

    // 3. Insert Items
    const insertedItems = [];
    for (const item of itemsToInsert) {
      const [insertedItem] = await db.insert(orderItems).values({
        orderId: newOrder.id,
        ...item
      }).returning();
      
      // Fetch product details for response
      const product = await this.getProduct(item.productId);
      insertedItems.push({ ...insertedItem, product: product! });
    }

    return { ...newOrder, items: insertedItems };
  }

  async getOrder(id: number): Promise<OrderResponse | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    
    // Enrich items with product details
    const enrichedItems = [];
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        enrichedItems.push({ ...item, product });
      }
    }

    return { ...order, items: enrichedItems };
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateOrderPayment(id: number, paymentIntentId: string, paymentStatus: string, status?: string): Promise<Order | undefined> {
    const updateData: any = { paymentIntentId, paymentStatus };
    if (status) updateData.status = status;
    const [updatedOrder] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return updatedOrder;
  }

  // Admin - Get orders with filters and pagination
  async getOrders(filters?: OrderFilters): Promise<OrderResponse[]> {
    let query = db.select().from(orders);

    // Build WHERE conditions
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(orders.status, filters.status));
    }
    if (filters?.paymentStatus) {
      conditions.push(eq(orders.paymentStatus, filters.paymentStatus));
    }
    if (filters?.customerName) {
      conditions.push(ilike(orders.customerName, `%${filters.customerName}%`));
    }
    if (filters?.dateFrom) {
      conditions.push(gte(orders.createdAt, filters.dateFrom));
    }
    if (filters?.dateTo) {
      conditions.push(lte(orders.createdAt, filters.dateTo));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const ordersResult = await query
      .orderBy(desc(orders.createdAt))
      .limit(filters?.limit || 50)
      .offset(filters?.offset || 0);

    // Enrich with items - optimized batch fetch
    const enrichedOrders = [];
    for (const order of ordersResult) {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

      // Batch fetch products
      if (items.length > 0) {
        const productIds = items.map(i => i.productId);
        const productsResult = await db.select().from(products).where(inArray(products.id, productIds));
        const productsMap = new Map(productsResult.map(p => [p.id, p]));

        const enrichedItems = items.map(item => ({
          ...item,
          product: productsMap.get(item.productId)!
        }));

        enrichedOrders.push({ ...order, items: enrichedItems });
      } else {
        enrichedOrders.push({ ...order, items: [] });
      }
    }

    return enrichedOrders;
  }

  // Admin - Update order status
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updatedOrder;
  }

  // Admin - Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Current period (last 30 days)
    const currentResult = await db.select({
      totalRevenue: sql<string>`COALESCE(SUM(CAST(${orders.totalAmount} AS NUMERIC)), 0)`,
      totalOrders: sql<number>`COUNT(*)::int`,
      completedOrders: sql<number>`COUNT(*) FILTER (WHERE ${orders.status} = 'delivered')::int`,
      pendingOrders: sql<number>`COUNT(*) FILTER (WHERE ${orders.status} IN ('pending', 'confirmed'))::int`,
    }).from(orders).where(gte(orders.createdAt, thirtyDaysAgo));

    // Previous period (30-60 days ago)
    const previousResult = await db.select({
      totalRevenue: sql<string>`COALESCE(SUM(CAST(${orders.totalAmount} AS NUMERIC)), 0)`,
      totalOrders: sql<number>`COUNT(*)::int`,
    }).from(orders).where(and(
      gte(orders.createdAt, sixtyDaysAgo),
      lte(orders.createdAt, thirtyDaysAgo)
    ));

    const currentRevenue = Number(currentResult[0]?.totalRevenue || 0);
    const previousRevenue = Number(previousResult[0]?.totalRevenue || 0);
    const revenueGrowth = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const currentOrders = currentResult[0]?.totalOrders || 0;
    const previousOrders = previousResult[0]?.totalOrders || 0;
    const ordersGrowth = previousOrders > 0
      ? ((currentOrders - previousOrders) / previousOrders) * 100
      : 0;

    return {
      totalRevenue: currentRevenue,
      totalOrders: currentOrders,
      pendingOrders: currentResult[0]?.pendingOrders || 0,
      completedOrders: currentResult[0]?.completedOrders || 0,
      revenueGrowth,
      ordersGrowth,
    };
  }

  // Admin - Get order analytics
  async getOrdersAnalytics(): Promise<OrderAnalytics> {
    // Get all-time stats
    const statsResult = await db.select({
      totalRevenue: sql<string>`COALESCE(SUM(CAST(${orders.totalAmount} AS NUMERIC)), 0)`,
      totalOrders: sql<number>`COUNT(*)::int`,
    }).from(orders);

    const totalRevenue = Number(statsResult[0]?.totalRevenue || 0);
    const totalOrders = statsResult[0]?.totalOrders || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders by status
    const statusResult = await db.select({
      status: orders.status,
      count: sql<number>`COUNT(*)::int`,
    }).from(orders).groupBy(orders.status);

    const ordersByStatus: Record<string, number> = {};
    statusResult.forEach(row => {
      ordersByStatus[row.status] = row.count;
    });

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyResult = await db.select({
      month: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
      revenue: sql<string>`COALESCE(SUM(CAST(${orders.totalAmount} AS NUMERIC)), 0)`,
    }).from(orders)
      .where(gte(orders.createdAt, sixMonthsAgo))
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`);

    const revenueByMonth = monthlyResult.map(row => ({
      month: row.month,
      revenue: Number(row.revenue),
    }));

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      ordersByStatus,
      revenueByMonth,
    };
  }

  // Admin - Export orders
  async exportOrders(format: 'csv' | 'json', filters?: OrderFilters): Promise<string> {
    const ordersData = await this.getOrders(filters);

    if (format === 'json') {
      return JSON.stringify(ordersData, null, 2);
    }

    // CSV format with proper escaping
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Email', 'Address', 'Total Amount', 'Status', 'Payment Status', 'Created At', 'Items'];
    const rows = ordersData.map(order => [
      order.id,
      `"${order.customerName.replace(/"/g, '""')}"`,
      order.customerPhone,
      order.customerEmail || '',
      `"${order.customerAddress.replace(/"/g, '""')}"`,
      order.totalAmount,
      order.status,
      order.paymentStatus,
      order.createdAt?.toISOString() || '',
      `"${order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}"`,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }

  // Admin - Get customer analytics with re-engagement insights
  async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get customer insights grouped by phone number
    const customerData = await db.select({
      customerPhone: orders.customerPhone,
      customerName: sql<string>`MAX(${orders.customerName})`,
      customerEmail: sql<string | null>`MAX(${orders.customerEmail})`,
      totalOrders: sql<number>`COUNT(*)::int`,
      totalSpent: sql<string>`SUM(CAST(${orders.totalAmount} AS NUMERIC))`,
      lastOrderDate: sql<string>`MAX(${orders.createdAt})::text`,
    })
    .from(orders)
    .groupBy(orders.customerPhone)
    .orderBy(sql`MAX(${orders.createdAt}) DESC`);

    const customers: CustomerInsight[] = customerData.map(customer => {
      const lastOrderDate = new Date(customer.lastOrderDate);
      const daysSinceLastOrder = Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalSpent = Number(customer.totalSpent);

      return {
        customerPhone: customer.customerPhone,
        customerName: customer.customerName,
        customerEmail: customer.customerEmail,
        totalOrders: customer.totalOrders,
        totalSpent,
        lastOrderDate: customer.lastOrderDate,
        daysSinceLastOrder,
        averageOrderValue: customer.totalOrders > 0 ? totalSpent / customer.totalOrders : 0,
        isInactive: daysSinceLastOrder >= 30,
      };
    });

    const activeCustomers = customers.filter(c => !c.isInactive).length;
    const inactiveCustomers = customers.filter(c => c.isInactive).length;

    return {
      totalCustomers: customers.length,
      activeCustomers,
      inactiveCustomers,
      customers,
    };
  }

  // Admin - Export customers
  async exportCustomers(format: 'csv' | 'json'): Promise<string> {
    const analytics = await this.getCustomerAnalytics();

    if (format === 'json') {
      return JSON.stringify(analytics.customers, null, 2);
    }

    // CSV format
    const headers = ['Phone', 'Name', 'Email', 'Total Orders', 'Total Spent', 'Avg Order Value', 'Last Order', 'Days Since Last Order', 'Status'];
    const rows = analytics.customers.map(customer => [
      customer.customerPhone,
      `"${customer.customerName.replace(/"/g, '""')}"`,
      customer.customerEmail || '',
      customer.totalOrders,
      customer.totalSpent.toFixed(2),
      customer.averageOrderValue.toFixed(2),
      customer.lastOrderDate,
      customer.daysSinceLastOrder,
      customer.isInactive ? 'Inactive' : 'Active',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }
}

export const storage = new DatabaseStorage();
