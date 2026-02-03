import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Settings,
  LogOut,
  Loader2,
  Users,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MessageCircle,
  Download,
  AlertTriangle,
  TrendingUp,
  Calendar,
  DollarSign,
  Search,
  Filter,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CustomerInsight = {
  customerPhone: string;
  customerName: string;
  customerEmail: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  averageOrderValue: number;
  isInactive: boolean;
};

type CustomerAnalytics = {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  customers: CustomerInsight[];
};

function useCustomerAnalytics() {
  return useQuery<CustomerAnalytics>({
    queryKey: [api.admin.analytics.customers.path],
    queryFn: async () => {
      const res = await apiRequest(api.admin.analytics.customers.method, api.admin.analytics.customers.path);
      return res.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });
}

export default function CustomerAnalyticsPage() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: analytics, isLoading: analyticsLoading } = useCustomerAnalytics();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user || user.role !== "admin") return null;

  // Filter customers based on search and status
  const filteredCustomers = analytics?.customers.filter(customer => {
    const matchesSearch =
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerPhone.includes(searchTerm) ||
      (customer.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && !customer.isInactive) ||
      (filterStatus === "inactive" && customer.isInactive);

    return matchesSearch && matchesFilter;
  }) || [];

  // Get inactive customers for re-engagement alerts (30+ days)
  const inactiveCustomers = analytics?.customers.filter(c => c.isInactive) || [];

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const res = await apiRequest('GET', `/api/admin/customers/export?format=${format}`);
      const data = await res.text();

      // Create download
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customers-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({ title: `Customers exported as ${format.toUpperCase()}` });
    } catch (error) {
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    // Clean phone number (remove spaces, dashes)
    const cleanPhone = phone.replace(/[\s-]/g, '');
    // Add country code if not present
    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone.replace('+', '') :
                           cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const message = encodeURIComponent(
      `Hi ${name}! 👋\n\nWe miss you at Infusionist! It's been a while since your last order.\n\n🎉 Come back and enjoy our delicious infused dishes. Use code WELCOME50 for ₹50 off your next order!\n\n📱 Order now: ${window.location.origin}/menu`
    );

    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
  };

  const openSMS = (phone: string, name: string) => {
    const message = encodeURIComponent(
      `Hi ${name}! We miss you at Infusionist. Use WELCOME50 for ₹50 off! Order: ${window.location.origin}/menu`
    );
    window.open(`sms:${phone}?body=${message}`, '_blank');
  };

  const sendEmail = (email: string, name: string) => {
    const subject = encodeURIComponent("We miss you at Infusionist! 🍗");
    const body = encodeURIComponent(
      `Hi ${name},\n\nIt's been a while since your last order with us!\n\nWe've got some exciting new items on our menu, and we'd love to have you back.\n\n🎉 Special Offer: Use code WELCOME50 for ₹50 off your next order!\n\nOrder now: ${window.location.origin}/menu\n\nBest,\nTeam Infusionist`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
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
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5">
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
            <Button variant="ghost" className="w-full justify-start gap-3 bg-amber-500/10 text-amber-400 border border-amber-500/20">
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
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Customer Analytics</h2>
            <p className="text-white/50 mt-1">Track customer activity and re-engage inactive customers</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white/70 hover:text-white"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-white/70 hover:text-white"
              onClick={() => handleExport('json')}
              disabled={isExporting}
            >
              Export JSON
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Total Customers</CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              ) : (
                <div className="text-2xl font-bold text-white">{analytics?.totalCustomers || 0}</div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Active Customers</CardTitle>
              <UserCheck className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">{analytics?.activeCustomers || 0}</div>
                  <p className="text-xs text-green-500 mt-1">Ordered in last 30 days</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10 border-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Inactive Customers</CardTitle>
              <UserX className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-400">{analytics?.inactiveCustomers || 0}</div>
                  <p className="text-xs text-red-400 mt-1">No order in 30+ days</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Re-engagement Alerts */}
        {inactiveCustomers.length > 0 && (
          <Card className="bg-red-950/30 border-red-500/30 mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <CardTitle className="text-red-400">Re-engagement Alert</CardTitle>
              </div>
              <CardDescription className="text-red-300/70">
                {inactiveCustomers.length} customer{inactiveCustomers.length !== 1 ? 's' : ''} haven't ordered in 30+ days.
                Click to send a re-engagement message via WhatsApp or SMS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {inactiveCustomers.slice(0, 5).map((customer) => (
                  <div
                    key={customer.customerPhone}
                    className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-2"
                  >
                    <span className="text-white text-sm font-medium">{customer.customerName}</span>
                    <Badge variant="outline" className="text-red-400 border-red-500/30 text-xs">
                      {customer.daysSinceLastOrder}d ago
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      onClick={() => openWhatsApp(customer.customerPhone, customer.customerName)}
                      title="Send WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      onClick={() => openSMS(customer.customerPhone, customer.customerName)}
                      title="Send SMS"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {inactiveCustomers.length > 5 && (
                  <Badge variant="outline" className="text-red-300 border-red-500/30">
                    +{inactiveCustomers.length - 5} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900/50 border-white/10"
            />
          </div>
          <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
            <SelectTrigger className="w-[180px] bg-zinc-900/50 border-white/10">
              <Filter className="w-4 h-4 mr-2 text-white/40" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Customer Table */}
        <Card className="bg-zinc-900/50 border-white/10">
          <CardContent className="p-0">
            {analyticsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-white/50" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white/70">Customer</TableHead>
                    <TableHead className="text-white/70">Contact</TableHead>
                    <TableHead className="text-white/70 text-center">Orders</TableHead>
                    <TableHead className="text-white/70 text-right">Total Spent</TableHead>
                    <TableHead className="text-white/70 text-right">Avg Order</TableHead>
                    <TableHead className="text-white/70">Last Order</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40">No customers found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow
                        key={customer.customerPhone}
                        className={`border-white/5 hover:bg-white/5 ${customer.isInactive ? 'bg-red-950/10' : ''}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              customer.isInactive ? 'bg-red-500/20' : 'bg-amber-500/20'
                            }`}>
                              <span className={`font-bold text-sm ${customer.isInactive ? 'text-red-400' : 'text-amber-500'}`}>
                                {customer.customerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{customer.customerName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-white/70">
                              <Phone className="w-3 h-3" />
                              {customer.customerPhone}
                            </div>
                            {customer.customerEmail && (
                              <div className="flex items-center gap-1 text-sm text-white/50">
                                <Mail className="w-3 h-3" />
                                {customer.customerEmail}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="border-white/20">
                            {customer.totalOrders}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-white">
                          ₹{customer.totalSpent.toFixed(0)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-white/70">
                          ₹{customer.averageOrderValue.toFixed(0)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-white/40" />
                            <span className="text-sm text-white/70">
                              {new Date(customer.lastOrderDate).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-xs text-white/40">
                            {customer.daysSinceLastOrder} days ago
                          </span>
                        </TableCell>
                        <TableCell>
                          {customer.isInactive ? (
                            <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                              Inactive
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                              onClick={() => openWhatsApp(customer.customerPhone, customer.customerName)}
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                              onClick={() => openSMS(customer.customerPhone, customer.customerName)}
                              title="SMS"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                            {customer.customerEmail && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                onClick={() => sendEmail(customer.customerEmail!, customer.customerName)}
                                title="Email"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Footer */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-white/40">
            Showing {filteredCustomers.length} of {analytics?.totalCustomers || 0} customers
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
              onClick={() => {
                const phones = inactiveCustomers.map(c => c.customerPhone).join(',');
                navigator.clipboard.writeText(phones);
                toast({ title: "Phone numbers copied!", description: `${inactiveCustomers.length} inactive customer numbers copied` });
              }}
              disabled={inactiveCustomers.length === 0}
            >
              Copy Inactive Numbers
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
