import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PermitsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">درخواست مجوزها</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>درخواست مجوزهای شهرداری</CardTitle>
            <CardDescription>
              این بخش در حال توسعه است
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              سامانه درخواست مجوزها به زودی راه‌اندازی خواهد شد. برای اطلاعات بیشتر با بخش خدمات شهری تماس بگیرید.
            </p>
            <Button asChild>
              <Link href="/services">بازگشت به لیست خدمات</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

