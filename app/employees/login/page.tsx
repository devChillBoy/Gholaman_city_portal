"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInEmployee, getCurrentUser } from "@/lib/auth-helpers";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        // Use replace to prevent back button issues
        router.replace("/employees/dashboard");
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!formData.email || !formData.password) {
      setError("لطفاً تمامی فیلدها را پر کنید");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("ایمیل معتبر نیست");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInEmployee(formData.email, formData.password);

      if (result.success) {
        // Use replace to prevent back button returning to login
        // Add refresh to ensure auth state is synced
        router.refresh();
        router.replace("/employees/dashboard");
      } else {
        setError(result.error || "خطا در ورود. لطفاً دوباره تلاش کنید.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("خطا در ورود. لطفاً دوباره تلاش کنید.");
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">در حال بررسی...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ورود پرسنل شهرداری</CardTitle>
            <CardDescription>
              لطفاً اطلاعات ورود خود را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@gholaman.ir"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "در حال ورود..." : "ورود"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

