"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/CopyButton";
import { useToast } from "@/components/ui/toast";
import { submitComplaint137 } from "../actions";
import { complaintCategories } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Complaint137Page() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    latitude: "",
    longitude: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const request = await submitComplaint137({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        phone: formData.phone || undefined,
      });

      setTrackingCode(request.code);
      setSubmitted(true);
      toast.success("شکایت شما با موفقیت ثبت شد");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در ثبت شکایت. لطفاً دوباره تلاش کنید.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-accent" />
            </div>
            <CardTitle className="text-2xl text-accent">شکایت شما با موفقیت ثبت شد</CardTitle>
            <CardDescription className="mt-4">
              کد رهگیری شما برای پیگیری وضعیت درخواست
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">کد رهگیری</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-bold text-primary font-mono">{trackingCode}</p>
                <CopyButton text={trackingCode} showLabel={false} size="icon" />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              این کد را ذخیره کنید. برای پیگیری وضعیت درخواست به آن نیاز دارید.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href={`/track/${trackingCode}`}>مشاهده وضعیت</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services/137">ثبت شکایت جدید</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">ثبت شکایت ۱۳۷</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>فرم ثبت شکایت</CardTitle>
            <CardDescription>
              لطفاً اطلاعات مربوط به مشکل را به دقت وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">عنوان مشکل *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: مشکل در جمع‌آوری زباله"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">شرح تفصیلی مشکل *</Label>
                <Textarea
                  id="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="توضیحات کامل مشکل را اینجا بنویسید..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">دسته‌بندی *</Label>
                <Select
                  required
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">عرض جغرافیایی</Label>
                  <Input
                    id="latitude"
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="مثال: 35.6892"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">طول جغرافیایی</Label>
                  <Input
                    id="longitude"
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="مثال: 51.3890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">شماره تماس شهروند (اختیاری)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09123456789"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "در حال ثبت..." : "ثبت شکایت"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
