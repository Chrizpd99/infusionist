
import { z } from 'zod';
import { insertProductSchema, products, orders } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/admin/products',
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/admin/products/:id',
      input: insertProductSchema.partial(),
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/admin/products/:id',
      responses: {
        200: z.object({ message: z.string() }),
        404: errorSchemas.notFound,
        401: errorSchemas.validation,
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: z.object({
        customerName: z.string().min(1, "Name is required"),
        customerPhone: z.string().min(1, "Phone is required"),
        customerEmail: z.string().email().optional().or(z.literal("")),
        customerAddress: z.string().min(1, "Address is required"),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number().min(1)
        })).min(1, "Order must have at least one item")
      }),
      responses: {
        201: z.object({ id: z.number(), status: z.string() }),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:id',
      responses: {
        200: z.custom<typeof orders.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
        name: z.string().optional(),
      }),
      responses: {
        201: z.object({ message: z.string() }),
        400: errorSchemas.validation,
        409: z.object({ message: z.string() }), // Conflict for existing user
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      }),
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
        401: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.object({
          id: z.number(),
          email: z.string().email(),
          name: z.string().nullable(),
          role: z.string(),
          createdAt: z.string(), // ISO date string
        }),
        401: errorSchemas.validation, // or unauthorized error
      },
    },
  },
  payments: {
    createOrder: {
      method: 'POST' as const,
      path: '/api/payments/create-intent',
      input: z.object({
        orderId: z.number(),
      }),
      responses: {
        200: z.object({
          orderId: z.string(),
          amount: z.number(),
          currency: z.string(),
          keyId: z.string(),
        }),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    verify: {
      method: 'POST' as const,
      path: '/api/payments/confirm',
      input: z.object({
        orderId: z.number(),
        paymentIntentId: z.string(),
        razorpay_payment_id: z.string().optional(),
        razorpay_signature: z.string().optional(),
      }),
      responses: {
        200: z.object({ message: z.string(), status: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },
  admin: {
    orders: {
      list: {
        method: 'GET' as const,
        path: '/api/admin/orders',
        input: z.object({
          status: z.string().optional(),
          paymentStatus: z.string().optional(),
          customerName: z.string().optional(),
          dateFrom: z.string().optional(),
          dateTo: z.string().optional(),
          limit: z.coerce.number().optional(),
          offset: z.coerce.number().optional(),
        }),
        responses: {
          200: z.array(z.any()), // OrderResponse[]
          401: errorSchemas.validation,
          403: errorSchemas.validation,
        },
      },
      updateStatus: {
        method: 'PUT' as const,
        path: '/api/admin/orders/:id/status',
        input: z.object({
          status: z.enum(['pending', 'paid', 'confirmed', 'delivered', 'cancelled']),
        }),
        responses: {
          200: z.custom<typeof orders.$inferSelect>(),
          404: errorSchemas.notFound,
          401: errorSchemas.validation,
          403: errorSchemas.validation,
        },
      },
      export: {
        method: 'GET' as const,
        path: '/api/admin/orders/export',
        input: z.object({
          format: z.enum(['csv', 'json']),
          status: z.string().optional(),
          paymentStatus: z.string().optional(),
          customerName: z.string().optional(),
          dateFrom: z.string().optional(),
          dateTo: z.string().optional(),
        }),
        responses: {
          200: z.string(),
          401: errorSchemas.validation,
          403: errorSchemas.validation,
        },
      },
    },
    analytics: {
      dashboard: {
        method: 'GET' as const,
        path: '/api/admin/analytics/dashboard',
        responses: {
          200: z.object({
            totalRevenue: z.number(),
            totalOrders: z.number(),
            pendingOrders: z.number(),
            completedOrders: z.number(),
            revenueGrowth: z.number(),
            ordersGrowth: z.number(),
          }),
          401: errorSchemas.validation,
          403: errorSchemas.validation,
        },
      },
      orders: {
        method: 'GET' as const,
        path: '/api/admin/analytics/orders',
        responses: {
          200: z.object({
            totalRevenue: z.number(),
            totalOrders: z.number(),
            averageOrderValue: z.number(),
            ordersByStatus: z.record(z.number()),
            revenueByMonth: z.array(z.object({
              month: z.string(),
              revenue: z.number(),
            })),
          }),
          401: errorSchemas.validation,
          403: errorSchemas.validation,
        },
      },
      customers: {
        method: 'GET' as const,
        path: '/api/admin/analytics/customers',
        responses: {
          200: z.object({
            totalCustomers: z.number(),
            activeCustomers: z.number(),
            inactiveCustomers: z.number(),
            customers: z.array(z.object({
              customerPhone: z.string(),
              customerName: z.string(),
              customerEmail: z.string().nullable(),
              totalOrders: z.number(),
              totalSpent: z.number(),
              lastOrderDate: z.string(),
              daysSinceLastOrder: z.number(),
              averageOrderValue: z.number(),
              isInactive: z.boolean(),
            })),
          }),
          401: errorSchemas.validation,
          403: errorSchemas.validation,
        },
      },
    },
    customers: {
      export: {
        method: 'GET' as const,
        path: '/api/admin/customers/export',
        input: z.object({
          format: z.enum(['csv', 'json']),
        }),
        responses: {
          200: z.string(),
          401: errorSchemas.validation,
          403: errorSchemas.validation,
        },
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
