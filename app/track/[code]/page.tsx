import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrackingCodeDisplay } from "@/components/TrackingCodeDisplay";
import { requestStatuses } from "@/lib/constants";
import { formatPersianDate, getServiceTypeLabel } from "@/lib/utils";
import type { RequestRecord } from "@/lib/types";
import { ArrowRight, CheckCircle2, Clock, XCircle, FileSearch } from "lucide-react";

// Force dynamic rendering to handle Supabase connection safely
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
}

// Helper function to safely fetch request by code
async function fetchRequestByCode(code: string): Promise<RequestRecord | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase environment variables not configured");
      return null;
    }
    
    const { getRequestByCode } = await import("@/lib/request-service");
    return await getRequestByCode(code);
  } catch (error) {
    console.error("Failed to load request by code:", error);
    return null;
  }
}

export default async function TrackDetailsPage({ params }: PageProps) {
  const { code } = await params;
  const request = await fetchRequestByCode(code);

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <FileSearch className="h-16 w-16 text-gray-400" />
            </div>
            <CardTitle className="text-2xl">درخواستی با این کد یافت نشد</CardTitle>
            <CardDescription className="mt-4">
              لطفاً کد رهگیری را بررسی کنید و دوباره تلاش کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/track">بازگشت به صفحه پیگیری</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: Clock, color: "warning" as const, label: requestStatuses.pending },
    "in-review": { icon: Clock, color: "default" as const, label: requestStatuses["in-review"] },
    completed: { icon: CheckCircle2, color: "success" as const, label: requestStatuses.completed },
    rejected: { icon: XCircle, color: "destructive" as const, label: requestStatuses.rejected },
  };

  const currentStatus = statusConfig[request.status];
  const StatusIcon = currentStatus.icon;

  const statusSteps = [
    { key: "pending", label: requestStatuses.pending, completed: request.status !== "pending" },
    { key: "in-review", label: requestStatuses["in-review"], completed: ["completed", "rejected"].includes(request.status) },
    { 
      key: request.status === "rejected" ? "rejected" : "completed", 
      label: request.status === "rejected" ? requestStatuses.rejected : requestStatuses.completed,
      completed: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/track">
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">جزئیات درخواست</CardTitle>
              <Badge variant={currentStatus.color}>
                <StatusIcon className="ml-2 h-4 w-4" />
                {currentStatus.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">نوع خدمت</p>
                <p className="font-semibold">{getServiceTypeLabel(request.service_type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">کد رهگیری</p>
                <TrackingCodeDisplay code={request.code} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">تاریخ ثبت</p>
                <p className="font-semibold">{formatPersianDate(request.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">وضعیت فعلی</p>
                <Badge variant={currentStatus.color}>{currentStatus.label}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">عنوان</p>
              <p className="font-semibold">{request.title}</p>
            </div>
            {request.description && (
              <div>
                <p className="text-sm text-gray-600 mb-1">توضیحات</p>
                <p className="whitespace-pre-line">{request.description}</p>
              </div>
            )}
            {request.payload && Object.keys(request.payload).length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">اطلاعات تکمیلی</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {Object.entries(request.payload).map(([key, value]) => {
                    // Skip null/undefined values
                    if (value === null || value === undefined) return null;
                    
                    // Format key to Persian-friendly labels
                    const keyLabels: Record<string, string> = {
                      file_number: "شماره پرونده",
                      fee_type: "نوع عوارض",
                      category: "دسته‌بندی",
                      payment_type: "نوع پرداخت",
                      amount: "مبلغ",
                      permit_type: "نوع مجوز",
                      owner_name: "نام مالک",
                      address: "آدرس",
                      latitude: "عرض جغرافیایی",
                      longitude: "طول جغرافیایی",
                      phone: "شماره تماس",
                    };
                    
                    const label = keyLabels[key] || key;
                    let displayValue = String(value);
                    
                    // Format amount if it's a number
                    if (key === "amount" && typeof value === "number") {
                      displayValue = `${value.toLocaleString("fa-IR")} تومان`;
                    }
                    
                    return (
                      <div key={key} className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">{label}:</span>
                        <span className="text-sm font-semibold text-right">{displayValue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>وضعیت درخواست</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              {statusSteps.map((step, index) => {
                const isActive = step.completed;
                const StepIcon = isActive ? CheckCircle2 : Clock;
                const isLast = index === statusSteps.length - 1;
                return (
                  <div key={step.key} className="relative flex items-start gap-4 pb-8">
                    <div className="relative flex flex-col items-center">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        isActive ? "bg-accent text-white" : "bg-gray-200 text-gray-400"
                      }`}>
                        <StepIcon className="h-5 w-5" />
                      </div>
                      {!isLast && (
                        <div className={`absolute top-10 w-0.5 h-full ${isActive ? "bg-accent" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div className="flex-1 pt-2 pb-8">
                      <p className={`font-semibold ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

