import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsent } from "@/components/CookieConsent";
import { Suspense, lazy } from "react";

// Lazy load pages for code splitting
const Home = lazy(() => import("@/pages/Home"));
const Menu = lazy(() => import("@/pages/Menu"));
const Cart = lazy(() => import("@/pages/Cart"));
const OrderSuccess = lazy(() => import("@/pages/OrderSuccess"));
const About = lazy(() => import("@/pages/About"));
const Address = lazy(() => import("@/pages/Address"));
const LoginPage = lazy(() => import("@/pages/login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminMenu = lazy(() => import("@/pages/admin/MenuManagement"));
const OrdersManagement = lazy(() => import("@/pages/admin/OrdersManagement"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));
const CustomerAnalytics = lazy(() => import("@/pages/admin/CustomerAnalytics"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/about" component={About} />
        <Route path="/address" component={Address} />
        <Route path="/cart" component={Cart} />
        <Route path="/order-success/:id" component={OrderSuccess} />
        <Route path="/login" component={LoginPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/menu" component={AdminMenu} />
        <Route path="/admin/orders" component={OrdersManagement} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/customers" component={CustomerAnalytics} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <CookieConsent />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
