import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { Link } from "wouter";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect when user is loaded after successful login
  useEffect(() => {
    if (loginSuccess && !authLoading && user) {
      // Redirect admin to admin dashboard, others to home
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [loginSuccess, authLoading, user, navigate]);

  // If already logged in, redirect
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      setLoginSuccess(true);
    } catch (error: any) {
      // Error handled by useAuth hook
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-zinc-900/50 border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
            <Lock className="w-6 h-6 text-amber-500" />
          </div>
          <CardTitle className="text-3xl font-bold font-display text-white">Admin Login</CardTitle>
          <CardDescription className="text-white/60">
            Enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/70">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@infusionist.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/30 border-white/10 focus:border-amber-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black/30 border-white/10 focus:border-amber-500"
              />
            </div>
            <Button
              type="submit"
              variant="premium"
              className="w-full mt-2"
              disabled={isLoading || loginSuccess}
            >
              {isLoading || loginSuccess ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loginSuccess ? "Redirecting..." : "Logging in..."}
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/">
              <span className="text-sm text-white/40 hover:text-white/60 cursor-pointer transition-colors">
                ← Back to Home
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
