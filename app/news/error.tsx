"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">خطا در بارگذاری اخبار</CardTitle>
          <CardDescription className="mt-4">
            متأسفانه در بارگذاری اخبار مشکلی پیش آمده است.
          </CardDescription>
        </CardHeader>
        <CardContent>
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

