import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Utensils, ShoppingBag, Settings, LogOut, Users } from "lucide-react";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AdminSettings() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

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
            <Button variant="ghost" className="w-full justify-start gap-3">
              <ShoppingBag className="w-4 h-4" /> Orders
            </Button>
          </Link>
          <Link href="/admin/customers">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Users className="w-4 h-4" /> Customers
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="ghost" className="w-full justify-start gap-3 bg-accent/50">
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
        <header className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your admin account and preferences</p>
        </header>

        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-base">{user.name || 'Admin'}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-base">{user.email}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Role</Label>
                <p className="text-base capitalize">{user.role}</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Member Since</Label>
                <p className="text-base">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Restaurant Name</Label>
                <p className="text-base">Infusionist</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Cuisine Type</Label>
                <p className="text-base">Infused Chicken & Specialty Dishes</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Status</Label>
                <p className="text-base text-green-600 font-medium">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Application Version</Label>
                <p className="text-base">1.0.0</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Database</Label>
                <p className="text-base text-green-600 font-medium">Connected</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Payment Gateway</Label>
                <p className="text-base">Razorpay (Configured)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
