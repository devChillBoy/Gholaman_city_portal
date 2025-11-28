"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">خطایی رخ داده است</CardTitle>
          <CardDescription className="mt-4">
            متأسفانه در بارگذاری صفحه مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="bg-gray-100 p-4 rounded-lg text-right text-sm text-gray-600 overflow-auto max-h-32">
              <code>{error.message}</code>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <Button onClick={reset} variant="default">
              <RefreshCw className="ml-2 h-4 w-4" />
              تلاش مجدد
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="ml-2 h-4 w-4" />
                صفحه اصلی
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

