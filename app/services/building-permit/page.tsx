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
import { submitBuildingPermit } from "../actions";
import { buildingPermitTypes } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BuildingPermitPage() {
  const [formData, setFormData] = useState({
    ownerName: "",
    address: "",
    permitType: "",
    description: "",
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
      const request = await submitBuildingPermit({
        ownerName: formData.ownerName,
        address: formData.address,
        permitType: formData.permitType,
        description: formData.description || undefined,
        phone: formData.phone,
      });

      setTrackingCode(request.code);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.");
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
            <CardTitle className="text-2xl text-accent">درخواست شما با موفقیت ثبت شد</CardTitle>
            <CardDescription className="mt-4">
              کد رهگیری شما برای پیگیری وضعیت درخواست
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">کد رهگیری</p>
              <p className="text-3xl font-bold text-primary font-mono">{trackingCode}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href={`/track/${trackingCode}`}>مشاهده وضعیت</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services/building-permit">ثبت درخواست جدید</Link>
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
        <h1 className="text-4xl font-bold mb-8">درخواست پروانه ساختمانی</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>فرم درخواست پروانه</CardTitle>
            <CardDescription>
              لطفاً اطلاعات مربوط به ملک و درخواست را به دقت وارد کنید
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
                <Label htmlFor="ownerName">نام مالک *</Label>
                <Input
                  id="ownerName"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="نام و نام خانوادگی مالک"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">آدرس ملک *</Label>
                <Textarea
                  id="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="آدرس کامل ملک"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permitType">نوع درخواست *</Label>
                <Select
                  required
                  value={formData.permitType}
                  onValueChange={(value) => setFormData({ ...formData, permitType: value })}
                >
                  <SelectTrigger id="permitType">
                    <SelectValue placeholder="انتخاب نوع درخواست" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingPermitTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات تکمیلی</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="توضیحات اضافی در مورد درخواست..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">شماره تماس *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09123456789"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "در حال ثبت..." : "ثبت درخواست"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

