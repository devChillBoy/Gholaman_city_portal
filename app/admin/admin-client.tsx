"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldX } from "lucide-react";

interface AdminClientProps {
  children: ReactNode;
}

type AuthState = "checking" | "unauthorized" | "access-denied" | "authorized";

/**
 * Admin client wrapper that requires admin authentication
 * - Shows loading state while checking auth
 * - Redirects to login if not authenticated
 * - Shows access denied message if authenticated but not admin
 * - Renders children only for admin users
 */
export function AdminClient({ children }: AdminClientProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();

      if (!user) {
        // Not authenticated - redirect to login
        router.replace("/employees/login");
        setAuthState("unauthorized");
        return;
      }

      if (!isAdmin(user)) {
        // Authenticated but not admin - show access denied
        setAuthState("access-denied");
        return;
      }

      // User is admin - allow access
      setAuthState("authorized");
    };

    checkAuth();
  }, [router]);

  // Loading state
  if (authState === "checking") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">در حال بررسی دسترسی...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Redirecting to login (not authenticated)
  if (authState === "unauthorized") {
    return null;
  }

  // Access denied (authenticated but not admin)
  if (authState === "access-denied") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex justify-center mb-4">
                <ShieldX className="h-16 w-16 text-destructive" />
              </div>
              <p className="font-medium mb-2 text-lg">دسترسی غیرمجاز</p>
              <p className="text-muted-foreground text-sm mb-6">
                شما دسترسی لازم برای مشاهده این بخش را ندارید.
              </p>
              <Button asChild variant="outline">
                <Link href="/employees/dashboard">بازگشت به داشبورد</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}
