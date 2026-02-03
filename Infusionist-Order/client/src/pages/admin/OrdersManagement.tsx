import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Utensils, ShoppingBag, Settings, LogOut, Download, Loader2, Eye, Users } from "lucide-react";
import { Link } from "wouter";
import { useOrders, useUpdateOrderStatus, useExportOrders } from "@/hooks/use-admin-orders";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { OrderResponse } from "@shared/schema";

type OrderFilters = {
  status?: string;
  paymentStatus?: string;
  customerName?: string;
  dateFrom?: string;
  dateTo?: string;
};

export default function OrdersManagement() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [filters, setFilters] = useState<OrderFilters>({});
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  const { data: orders, isLoading: ordersLoading } = useOrders(filters);
  const updateStatus = useUpdateOrderStatus();
  const exportOrders = useExportOrders();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status: newStatus });
      toast({ title: "Order status updated successfully" });
    } catch (error: any) {
      toast({ title: error.message || "Failed to update status", variant: "destructive" });
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      await exportOrders.mutateAsync({ format, filters });
      toast({ title: `Orders exported as ${format.toUpperCase()}` });
    } catch (error: any) {
      toast({ title: error.message || "Export failed", variant: "destructive" });
    }
  };

  if (isLoading || !user || user.role !== "admin") return null;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-primary">Infusion Admin</h1>
        </div>

        <nav className="flex-grow space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/admin/menu">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Utensils className="w-4 h-4" /> Menu Items
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" className="w-full justify-start gap-3 bg-accent/50">
              <ShoppingBag className="w-4 h-4" /> Orders
            </Button>
          </Link>
          <Link href="/admin/customers">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Users className="w-4 h-4" /> Customers
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </Link>
        </nav>

        <Button variant="ghost" className="mt-auto justify-start gap-3 text-destructive" onClick={() => logout()}>
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Orders Management</h2>
            <p className="text-muted-foreground">View and manage customer orders</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleExport('csv')}
              disabled={exportOrders.isPending}
            >
              {exportOrders.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export CSV
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleExport('json')}
              disabled={exportOrders.isPending}
            >
              {exportOrders.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export JSON
            </Button>
          </div>
        </header>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : v })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="Search customer..."
              value={filters.customerName || ''}
              onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateFrom">Date From</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateTo">Date To</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : orders && orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.items.length} item(s)</TableCell>
                    <TableCell className="font-semibold">₹{order.totalAmount}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order.id, v)}
                        disabled={updateStatus.isPending}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'cancelled' ? 'destructive' :
                            'outline'
                          }>
                            {order.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer Information</Label>
                  <p className="mt-1 font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Delivery Address</Label>
                  <p className="mt-1 text-sm">{selectedOrder.customerAddress}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Order Items</Label>
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.priceAtTime}</TableCell>
                        <TableCell>₹{(Number(item.priceAtTime) * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Badge variant={
                    selectedOrder.status === 'delivered' ? 'default' :
                    selectedOrder.status === 'cancelled' ? 'destructive' :
                    'outline'
                  }>
                    {selectedOrder.status}
                  </Badge>
                  <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'default' : 'outline'}>
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">₹{selectedOrder.totalAmount}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
