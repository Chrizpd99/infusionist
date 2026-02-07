
import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcryptjs";
import session from "express-session";
import helmet from "helmet";
// PublicUser type used via api.auth.me.responses
import { log } from "./index";

// Razorpay removed - orders are finalized immediately on creation.
// Future: Petpooja integration will handle payments.

// Extend the SessionData interface to include userId
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Basic security hardening with CSP configured for external resources
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Note: unsafe-inline needed for Vite HMR in dev
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://*.unsplash.com"],
        connectSrc: ["'self'", "https://api.unsplash.com", "wss:", "ws:"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Configure session middleware
  // In a real application, you'd want a more robust session store (e.g., Redis)
  const isCodespaces = process.env.CODESPACES === "true" || !!process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
  const isProduction = process.env.NODE_ENV === "production";

  app.use(
    session({
      secret: process.env.SESSION_SECRET || (() => {
        if (process.env.NODE_ENV === "production") {
          throw new Error("SESSION_SECRET environment variable is required in production");
        }
        console.warn("⚠️  Using default session secret. Set SESSION_SECRET in production!");
        return "dev-secret-change-in-production";
      })(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: isProduction || isCodespaces, // HTTPS required for Codespaces
        sameSite: isCodespaces ? "none" : "lax", // "none" required for Codespaces cross-origin
      },
    })
  );

  // Middleware to protect routes
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Middleware to check admin role
  const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await storage.findUserById(req.session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // === PRODUCTS ===
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  // === ORDERS ===
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);

      // If the client included cookie/marketing consent with the order, log and persist it.
      const cookieConsent = req.body && (req.body as any).cookieConsent ? (req.body as any).cookieConsent : null;
      if (cookieConsent) {
        log(`Order consent for ${input.customerPhone || input.customerName}: ${JSON.stringify(cookieConsent)}`, "privacy");
      }

      // Pass consent through to storage layer for persistence.
      const storageInput = {
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        customerAddress: input.customerAddress,
        items: input.items,
        cookieConsent, // Include consent so it's persisted on the order record
      };

      const order = await storage.createOrder(storageInput as any);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          field: err.errors[0].message
        });
      }
      log(`Order error: ${err}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.orders.get.path, async (req, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  });

  // === ORDER TRACKING (POS-READY) ===
  app.get("/api/orders/:id/tracking", async (req, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Map database status to UI steps
      const statusMap: Record<string, string> = {
        pending: "pending",
        confirmed: "confirmed",
        preparing: "preparing",
        ready: "ready",
        shipped: "out_for_delivery",
        delivered: "delivered",
        cancelled: "cancelled",
      };

      // Calculate estimated time based on status
      const estimatedTimes: Record<string, number> = {
        pending: 25,
        confirmed: 20,
        preparing: 15,
        ready: 5,
        out_for_delivery: 10,
        delivered: 0,
      };

      const uiStatus = statusMap[order.status] || order.status;
      
      res.json({
        id: order.id,
        status: uiStatus,
        estimatedTime: estimatedTimes[uiStatus] || 0,
        currentStep: `${order.status} - ${order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'N/A'}`,
        posSystemId: process.env.POS_SYSTEM_ID || null, // For future POS integration
        updatedAt: order.createdAt,
      });
    } catch (err) {
      log(`Order tracking error: ${err}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === PROMO CODES ===
  const VALID_PROMOS: Record<string, { discount: number; isPercentage: boolean }> = {
    SAVE50: { discount: 50, isPercentage: false },
    SAVE100: { discount: 100, isPercentage: false },
    WELCOME: { discount: 75, isPercentage: false },
    FIRST20: { discount: 20, isPercentage: true },
  };

  app.post("/api/promos/validate", async (req, res) => {
    try {
      const { code } = z.object({ code: z.string().min(1) }).parse(req.body);
      const promo = VALID_PROMOS[code.toUpperCase()];

      if (!promo) {
        return res.status(400).json({ message: "Invalid promo code" });
      }

      res.json({
        code: code.toUpperCase(),
        discount: promo.discount,
        isPercentage: promo.isPercentage,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed" });
      }
      log(`Promo validation error: ${err}`, "error");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === AUTHENTICATION ===
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const { email, password, name } = api.auth.register.input.parse(req.body);

      const existingUser = await storage.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10); // Hash password with salt rounds = 10
      const newUser = await storage.createUser({ email, passwordHash, name });

      // Log in the user immediately after registration
      req.session.userId = newUser.id;
      log(`User registered and logged in: ${newUser.email}`, "auth");

      res.status(201).json({ message: "Registration successful" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          field: err.errors[0].path[0]
        });
      }
      log(`Error during registration: ${err}`, "auth");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { email, password } = api.auth.login.input.parse(req.body);

      const user = await storage.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      log(`User logged in: ${user.email}`, "auth");

      res.status(200).json({ message: "Logged in successfully" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          field: err.errors[0].path[0]
        });
      }
      log(`Error during login: ${err}`, "auth");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.logout.path, isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    req.session.destroy((err) => {
      if (err) {
        log(`Error destroying session for user ${userId}: ${err}`, "auth");
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("connect.sid"); // Clear the session cookie
      log(`User logged out: ${userId}`, "auth");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get(api.auth.me.path, isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.findUserById(userId);

      if (!user) {
        // This case should ideally not happen if session.userId is valid
        // but handles potential data inconsistencies
        log(`Authenticated user ${userId} not found in DB`, "auth");
        req.session.destroy(() => {
          res.clearCookie("connect.sid");
          res.status(401).json({ message: "Unauthorized" });
        });
        return;
      }
      
      // Remove sensitive fields before sending to client
      const publicUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      };

      // Validate with shared schema for client response type safety
      const parsedUser = api.auth.me.responses[200].parse(publicUser);
      res.json(parsedUser);
    } catch (err) {
      log(`Error fetching current user: ${err}`, "auth");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === ADMIN PRODUCT ROUTES ===
  app.post(api.products.create.path, isAdmin, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      log(`Admin created product: ${product.name}`, "admin");
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", field: err.errors[0].message });
      }
      log(`Error creating product: ${err}`, "admin");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(id, input);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      log(`Admin updated product: ${product.name}`, "admin");
      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", field: err.errors[0].message });
      }
      log(`Error updating product: ${err}`, "admin");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      log(`Admin deleted product ID: ${id}`, "admin");
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      log(`Error deleting product: ${err}`, "admin");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === INTEGRATIONS - Petpooja (placeholder) ===
  // This is a stub endpoint to prepare for future Petpooja integration.
  // It currently accepts init requests and returns a simple acknowledgement.
  app.post("/api/integrations/petpooja/init", async (req, res) => {
    try {
      const payload = req.body || {};
      // In the future: validate payload, create/return Petpooja order mapping, store credentials, etc.
      log(`Petpooja init requested: ${JSON.stringify(payload)}`, "integrations");
      res.json({ message: "Petpooja integration placeholder received", received: payload });
    } catch (err) {
      log(`Error in Petpooja placeholder: ${err}`, "integrations");
      res.status(500).json({ message: "Petpooja placeholder error" });
    }
  });

  app.get("/api/integrations/petpooja/status", async (_req, res) => {
    // Simple health/status endpoint for future Petpooja connection checks
    res.json({ status: "stub", message: "Petpooja integration not configured" });
  });

  // === COOKIE / PRIVACY CONSENT ===
  app.post("/api/consent", async (req, res) => {
    try {
      const payload = req.body || {};
      // Log consent for audit; in future persist to DB if required
      log(`Consent received: ${JSON.stringify(payload)}`, "privacy");
      res.json({ ok: true });
    } catch (err) {
      log(`Consent endpoint error: ${err}`, "privacy");
      res.status(500).json({ message: "Failed to record consent" });
    }
  });

  // === ADMIN ORDER MANAGEMENT ROUTES ===
  app.get(api.admin.orders.list.path, isAdmin, async (req, res) => {
    try {
      const filters = api.admin.orders.list.input.parse(req.query);
      const orders = await storage.getOrders({
        ...filters,
        dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
        dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
      });
      res.json(orders);
    } catch (err) {
      log(`Error listing orders: ${err}`, "admin");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.admin.orders.updateStatus.path, isAdmin, async (req, res) => {
    try {
      const { status } = api.admin.orders.updateStatus.input.parse(req.body);
      const order = await storage.updateOrderStatus(Number(req.params.id), status);
      if (!order) return res.status(404).json({ message: "Order not found" });
      log(`Admin updated order ${req.params.id} to ${status}`, "admin");
      res.json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", field: err.errors[0].message });
      }
      log(`Error updating order status: ${err}`, "admin");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.admin.orders.export.path, isAdmin, async (req, res) => {
    try {
      const { format, ...filters } = api.admin.orders.export.input.parse(req.query);
      const data = await storage.exportOrders(format, {
        ...filters,
        dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
        dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
      });

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=orders-${new Date().toISOString().split('T')[0]}.csv`);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=orders-${new Date().toISOString().split('T')[0]}.json`);
      }
      res.send(data);
    } catch (err) {
      log(`Error exporting orders: ${err}`, "admin");
      res.status(500).json({ message: "Export failed" });
    }
  });

  // === ADMIN ANALYTICS ROUTES ===
  app.get(api.admin.analytics.dashboard.path, isAdmin, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (err) {
      log(`Error fetching dashboard stats: ${err}`, "admin");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.admin.analytics.orders.path, isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getOrdersAnalytics();
      res.json(analytics);
    } catch (err) {
      log(`Error fetching order analytics: ${err}`, "admin");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === ADMIN CUSTOMER ANALYTICS ROUTES ===
  app.get(api.admin.analytics.customers.path, isAdmin, async (req, res) => {
    try {
      const analytics = await storage.getCustomerAnalytics();
      res.json(analytics);
    } catch (err) {
      log(`Error fetching customer analytics: ${err}`, "admin");
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.admin.customers.export.path, isAdmin, async (req, res) => {
    try {
      const { format } = api.admin.customers.export.input.parse(req.query);
      const data = await storage.exportCustomers(format);

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=customers-${new Date().toISOString().split('T')[0]}.csv`);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=customers-${new Date().toISOString().split('T')[0]}.json`);
      }
      res.send(data);
    } catch (err) {
      log(`Error exporting customers: ${err}`, "admin");
      res.status(500).json({ message: "Export failed" });
    }
  });

  // Seed Data Endpoint (Internal use or just run on startup)
  await seedDatabase();
  await seedAdminUser();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getProducts();
  if (existing.length > 0) return;

  log("Seeding database...", "db");

  const seeds = [
    // === SIGNATURE COMBOS ===
    {
      name: "Infusionist Feast Combo",
      description: "Our signature. Built to be shared. Includes: 1 Full Infused Chicken (choice of flavour), Mandi Rice, Rumali Roti (x4), Crispy Fries, Fresh Garden Salad & 3 Global Dips.",
      price: "699",
      category: "Signature Combos",
      imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=2500&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: ["Bestseller"]
    },
    // === INFUSED CHICKENS ===
    {
      name: "Peri Peri Classic",
      description: "Citrus heat · slow char finish. Our African-inspired classic, infused for 24 hours with peri peri spices.",
      price: "449",
      category: "Infused Chickens",
      imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=2500&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: ["Spicy"]
    },
    {
      name: "Creamy Cheese Infused",
      description: "Mild · rich · comforting. Slow-infused with a creamy cheese blend that melts in your mouth.",
      price: "449",
      category: "Infused Chickens",
      imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=2569&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: ["Mild"]
    },
    {
      name: "Honey Chilli Glaze",
      description: "Sweet heat · balanced caramelisation. The perfect harmony of honey sweetness and chilli kick.",
      price: "449",
      category: "Infused Chickens",
      imageUrl: "https://images.unsplash.com/photo-1527477396000-64bc618e7d38?q=80&w=2500&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: ["Popular"]
    },
    // === SIDES & BREADS ===
    {
      name: "Mandi Rice",
      description: "Aromatic, lightly spiced basmati rice cooked in the traditional Mandi style.",
      price: "120",
      category: "Sides & Breads",
      imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=2500&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: []
    },
    {
      name: "Butter Garlic Rice",
      description: "Fragrant basmati rice sautéed with butter and roasted garlic.",
      price: "129",
      category: "Sides & Breads",
      imageUrl: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=2400&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: []
    },
    {
      name: "Rumali Roti",
      description: "Soft, thin handkerchief bread - perfect for wrapping around your favorite infused meats.",
      price: "0",
      category: "Sides & Breads",
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2400&auto=format&fit=crop",
      available: true,
      sizes: [
        { label: "2 pcs", price: 40 },
        { label: "4 pcs", price: 70 }
      ],
      badges: []
    },
    {
      name: "Fresh Garden Salad",
      description: "Crisp mixed greens with cherry tomatoes, cucumber, and house vinaigrette.",
      price: "49",
      category: "Sides & Breads",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2400&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: []
    },
    // === GLOBAL SAUCES ===
    {
      name: "Peri Peri Drizzle",
      description: "Portuguese-African inspired sauce with citrus heat and smoky undertones.",
      price: "39",
      category: "Global Sauces",
      imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?q=80&w=2400&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: ["🇵🇹"]
    },
    {
      name: "Creamy Mushroom Garlic",
      description: "Rich Italian-style cream sauce with sautéed mushrooms and roasted garlic.",
      price: "39",
      category: "Global Sauces",
      imageUrl: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?q=80&w=2400&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: ["🇮🇹"]
    },
    {
      name: "Herb Butter Jus",
      description: "French-inspired herb-infused butter sauce. Silky, aromatic, luxurious.",
      price: "39",
      category: "Global Sauces",
      imageUrl: "https://images.unsplash.com/photo-1607098665874-fd193397547b?q=80&w=2400&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: ["🇫🇷"]
    },
    {
      name: "Korean Chilli Glaze",
      description: "Sweet and spicy gochujang-based glaze with sesame and ginger notes.",
      price: "39",
      category: "Global Sauces",
      imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172789a?q=80&w=2400&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: ["🇰🇷"]
    },
    {
      name: "Sesame Soy Reduction",
      description: "Japanese-inspired umami-rich reduction with toasted sesame and premium soy.",
      price: "39",
      category: "Global Sauces",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2400&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: ["🇯🇵"]
    },
    // === BEVERAGES ===
    {
      name: "Craft Cola",
      description: "Artisanal cola made with natural spices, caramel, and a hint of citrus.",
      price: "60",
      category: "Beverages",
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2500&auto=format&fit=crop",
      available: true,
      sizes: null,
      badges: []
    },
    {
      name: "Fresh Lime Soda",
      description: "Refreshing lime soda - the perfect palate cleanser.",
      price: "0",
      category: "Beverages",
      imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2400&auto=format&fit=crop",
      available: true,
      sizes: [
        { label: "Sweet", price: 49 },
        { label: "Salted", price: 49 }
      ],
      badges: []
    }
  ];

  for (const product of seeds) {
    await storage.createProduct(product);
  }
  log("Database seeded!", "db");
}

async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Skip seeding if admin credentials not provided
  if (!adminEmail || !adminPassword) {
    if (process.env.NODE_ENV === "production") {
      log("No ADMIN_EMAIL/ADMIN_PASSWORD set - skipping admin seed", "db");
    }
    return;
  }

  const existingAdmin = await storage.findUserByEmail(adminEmail);
  if (existingAdmin) return;

  log("Seeding admin user...", "db");
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await storage.createUser({
    email: adminEmail,
    passwordHash,
    name: "Admin",
    role: "admin"
  });
  log("Admin user seeded!", "db");
}
