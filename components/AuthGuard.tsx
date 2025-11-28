"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, isAdmin, isEmployee } from "@/lib/auth-helpers";
import { Card, CardContent } from "@/components/ui/card";

type AuthRequirement = "admin" | "employee" | "authenticated";

interface AuthGuardProps {
  children: ReactNode;
  /** The type of authentication required */
  require?: AuthRequirement;
  /** Where to redirect if authentication fails */
  redirectTo?: string;
  /** Custom loading message */
  loadingMessage?: string;
}

/**
 * Check if user meets the authentication requirement
 */
function meetsRequirement(user: User | null, requirement: AuthRequirement): boolean {
  if (!user) return false;
  
  switch (requirement) {
    case "admin":
      return isAdmin(user);
    case "employee":
      return isEmployee(user);
    case "authenticated":
      return true;
    default:
      return false;
  }
}

/**
 * Reusable authentication guard component
 * Wraps content and protects it based on user role
 */
export function AuthGuard({
  children,
  require = "authenticated",
  redirectTo = "/employees/login",
  loadingMessage = "در حال بررسی دسترسی...",
}: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      
      if (meetsRequirement(user, require)) {
        setIsAuthorized(true);
      } else {
        router.replace(redirectTo);
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [router, require, redirectTo]);

  if (isChecking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{loadingMessage}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

