import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-zinc-900/50 border-white/10">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-display text-white">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-white/60 font-light mb-6">
            The page you're looking for seems to have evaporated.
          </p>
          
          <Link href="/">
            <Button variant="premium" className="w-full">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
