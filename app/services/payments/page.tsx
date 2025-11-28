"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitPayment } from "../actions";
import { paymentTypes } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentsPage() {
  const [formData, setFormData] = useState({
    fileNumber: "",
    paymentType: "",
  });
  const [amount, setAmount] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock amount calculation
    const mockAmount = Math.floor(Math.random() * 5000000) + 500000;
    setAmount(mockAmount);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount) {
      handleCheck(e);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const request = await submitPayment({
        fileNumber: formData.fileNumber,
        paymentType: formData.paymentType,
        amount,
      });

      setTrackingCode(request.code);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت پرداخت. لطفاً دوباره تلاش کنید.");
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
            <CardTitle className="text-2xl text-accent">پرداخت با موفقیت ثبت شد</CardTitle>
            <CardDescription className="mt-4">
              اطلاعات پرداخت شما در سیستم ثبت شده است
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
                <Link href="/services/payments">پرداخت جدید</Link>
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
        <h1 className="text-4xl font-bold mb-8">پرداخت عوارض</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>فرم پرداخت عوارض</CardTitle>
            <CardDescription>
              لطفاً اطلاعات مربوط به پرونده را وارد کنید
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
                <Label htmlFor="fileNumber">شماره پرونده *</Label>
                <Input
                  id="fileNumber"
                  required
                  value={formData.fileNumber}
                  onChange={(e) => setFormData({ ...formData, fileNumber: e.target.value })}
                  placeholder="مثال: 12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentType">نوع عوارض *</Label>
                <Select
                  required
                  value={formData.paymentType}
                  onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
                >
                  <SelectTrigger id="paymentType">
                    <SelectValue placeholder="انتخاب نوع عوارض" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {amount && (
                <div className="bg-gray-100 p-6 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">مبلغ قابل پرداخت</p>
                  <p className="text-2xl font-bold text-primary">
                    {amount.toLocaleString("fa-IR")} تومان
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                {!amount && (
                  <Button type="button" variant="outline" onClick={handleCheck} className="flex-1">
                    استعلام مبلغ
                  </Button>
                )}
                <Button type="submit" className="flex-1" size="lg" disabled={!amount || isSubmitting}>
                  {isSubmitting ? "در حال ثبت..." : amount ? "ثبت پرداخت" : "لطفاً ابتدا مبلغ را استعلام کنید"}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                توجه: این یک سامانه آزمایشی است. در نسخه نهایی، پرداخت از طریق درگاه پرداخت انجام می‌شود.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

