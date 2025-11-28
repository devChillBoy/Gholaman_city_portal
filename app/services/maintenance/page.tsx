import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">درخواست تعمیرات</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>درخواست تعمیرات و نگهداری</CardTitle>
            <CardDescription>
              این بخش در حال توسعه است
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              سامانه درخواست تعمیرات به زودی راه‌اندازی خواهد شد. برای درخواست فوری، می‌توانید از سامانه ۱۳۷ استفاده کنید.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/services/137">ثبت درخواست ۱۳۷</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services">بازگشت به لیست خدمات</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

