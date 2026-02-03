import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Settings,
  LogOut,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Calendar
} from "lucide-react";
import { Link } from "wouter";
import { useDashboardStats, useOrderAnalytics } from "@/hooks/use-analytics";
import { useOrders } from "@/hooks/use-admin-orders";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: analytics, isLoading: analyticsLoading } = useOrderAnalytics();
  const { data: recentOrders, isLoading: ordersLoading } = useOrders({ limit: 10 });
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user || user.role !== "admin") return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paid': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'unpaid': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      case 'refunded': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-zinc-950 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-amber-500">Infusionist</h1>
          <p className="text-xs text-white/40 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-grow space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start gap-3 bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/admin/menu">
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5">
              <Utensils className="w-4 h-4" /> Menu Items
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5">
              <ShoppingBag className="w-4 h-4" /> Orders
            </Button>
          </Link>
          <Link href="/admin/customers">
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5">
              <Users className="w-4 h-4" /> Customers
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5">
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </Link>
        </nav>

        <div className="pt-4 border-t border-white/10 mt-4">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-white/40">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto bg-zinc-950/50">
        <header className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
          <p className="text-white/50 mt-1">Monitor your business performance</p>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">₹{stats?.totalRevenue?.toFixed(0) || '0'}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {(stats?.revenueGrowth || 0) >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={(stats?.revenueGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"}>
                      {(stats?.revenueGrowth || 0) >= 0 ? '+' : ''}{(stats?.revenueGrowth || 0).toFixed(1)}%
                    </span>
                    <span className="text-white/40">vs last month</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Total Orders</CardTitle>
              <Package className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {(stats?.ordersGrowth || 0) >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={(stats?.ordersGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"}>
                      {(stats?.ordersGrowth || 0) >= 0 ? '+' : ''}{(stats?.ordersGrowth || 0).toFixed(1)}%
                    </span>
                    <span className="text-white/40">vs last month</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Pending Orders</CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">{stats?.pendingOrders || 0}</div>
                  <p className="text-xs text-white/40 mt-1">Awaiting processing</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Avg Order Value</CardTitle>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">₹{analytics?.averageOrderValue?.toFixed(0) || '0'}</div>
                  <p className="text-xs text-white/40 mt-1">Per order average</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Status Breakdown & Revenue Chart */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Order Status Breakdown</CardTitle>
              <CardDescription className="text-white/50">Current order distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-white/50" />
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(analytics?.ordersByStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {status === 'delivered' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {status === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                        {status === 'confirmed' && <Package className="w-4 h-4 text-blue-500" />}
                        {status === 'cancelled' && <XCircle className="w-4 h-4 text-red-500" />}
                        {status === 'paid' && <DollarSign className="w-4 h-4 text-amber-500" />}
                        <span className="text-white/70 capitalize">{status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              status === 'delivered' ? 'bg-green-500' :
                              status === 'pending' ? 'bg-yellow-500' :
                              status === 'confirmed' ? 'bg-blue-500' :
                              status === 'cancelled' ? 'bg-red-500' :
                              'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(((count as number) / (stats?.totalOrders || 1)) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-white font-medium w-8 text-right">{count as number}</span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(analytics?.ordersByStatus || {}).length === 0 && (
                    <p className="text-white/40 text-center py-4">No orders yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Revenue by Month</CardTitle>
              <CardDescription className="text-white/50">Monthly revenue trend</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-white/50" />
                </div>
              ) : (
                <div className="space-y-3">
                  {(analytics?.revenueByMonth || []).slice(-6).map((item, index) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-amber-500/60" />
                        <span className="text-white/70">{item.month}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min((item.revenue / Math.max(...(analytics?.revenueByMonth || []).map(r => r.revenue), 1)) * 100, 100)}%`
                            }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          />
                        </div>
                        <span className="text-white font-medium w-20 text-right">₹{item.revenue.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                  {(analytics?.revenueByMonth || []).length === 0 && (
                    <p className="text-white/40 text-center py-4">No revenue data yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders with Expandable Details */}
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent Orders</CardTitle>
              <CardDescription className="text-white/50">Click to view order details</CardDescription>
            </div>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm" className="border-white/10 text-white/70 hover:text-white">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="text-center py-10">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-white/50" />
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-white/10 rounded-lg overflow-hidden">
                    {/* Order Header - Clickable */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <span className="text-amber-500 font-bold text-sm">#{order.id}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{order.customerName}</p>
                          <p className="text-xs text-white/40">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-white">₹{order.totalAmount}</p>
                          <p className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} border`}>
                          {order.status}
                        </Badge>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-4 h-4 text-white/40" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/40" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-white/10 bg-black/20"
                        >
                          <div className="p-4 grid md:grid-cols-2 gap-6">
                            {/* Customer Details */}
                            <div>
                              <h4 className="text-sm font-medium text-amber-500 mb-3">Customer Details</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="w-4 h-4 text-white/40" />
                                  <span className="text-white">{order.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-white/40" />
                                  <span className="text-white">{order.customerPhone}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-white/40 mt-0.5" />
                                  <span className="text-white">{order.customerAddress}</span>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="text-sm font-medium text-amber-500 mb-3">Order Items</h4>
                              <div className="space-y-2">
                                {order.items?.map((item: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between text-sm bg-white/5 p-2 rounded">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white/60">x{item.quantity}</span>
                                      <span className="text-white">{item.product?.name || `Product #${item.productId}`}</span>
                                      {item.selectedSize && (
                                        <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                          {item.selectedSize}
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-white/70">₹{item.priceAtTime}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">No orders yet</p>
                <p className="text-xs text-white/30 mt-1">Orders will appear here once customers start ordering</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
