import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <FileQuestion className="h-16 w-16 text-gray-400" />
          </div>
          <CardTitle className="text-2xl">صفحه یافت نشد</CardTitle>
          <CardDescription className="mt-4">
            صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">بازگشت به صفحه اصلی</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

