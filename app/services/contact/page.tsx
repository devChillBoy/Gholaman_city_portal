import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">تماس با شهرداری</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <Phone className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">تلفن</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">۰۲۱-۱۲۳۴۵۶۷۸</p>
              <p className="text-sm text-gray-500 mt-2">سامانه ۱۳۷</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Mail className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">ایمیل</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">info@gholaman.ir</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">آدرس</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                خیابان اصلی، میدان مرکزی، شهرداری غلامان
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ساعات کاری</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-600">
              <p><strong>شنبه تا چهارشنبه:</strong> ۸:۰۰ تا ۱۶:۰۰</p>
              <p><strong>پنج‌شنبه:</strong> ۸:۰۰ تا ۱۲:۰۰</p>
              <p><strong>جمعه:</strong> تعطیل</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/services">بازگشت به لیست خدمات</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

