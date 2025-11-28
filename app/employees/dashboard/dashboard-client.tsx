"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOutEmployee } from "@/lib/auth-helpers";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";

interface DashboardClientProps {
  children: ReactNode;
}

/**
 * Dashboard client wrapper that requires employee authentication
 */
export function DashboardClient({ children }: DashboardClientProps) {
  return (
    <AuthGuard require="employee" redirectTo="/employees/login">
      {children}
    </AuthGuard>
  );
}

/**
 * Logout button component for employee dashboard
 */
export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOutEmployee();
    router.replace("/employees/login");
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      خروج از حساب کاربری
    </Button>
  );
}
