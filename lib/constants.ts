import { AlertCircle, Building2, FileText, CreditCard, Wrench, MapPin, Phone } from "lucide-react";
import type { Service } from "./types";

export type { Service };

export const services: Service[] = [
  {
    id: "137",
    title: "ثبت شکایت ۱۳۷",
    description: "ثبت و پیگیری شکایات شهری و مشکلات محلی",
    href: "/services/137",
    icon: AlertCircle,
  },
  {
    id: "building-permit",
    title: "درخواست پروانه ساختمانی",
    description: "ثبت درخواست برای دریافت پروانه ساخت و ساز",
    href: "/services/building-permit",
    icon: Building2,
  },
  {
    id: "payments",
    title: "پرداخت عوارض",
    description: "پرداخت عوارض شهرداری و مالیات",
    href: "/services/payments",
    icon: CreditCard,
  },
  {
    id: "permits",
    title: "درخواست مجوزها",
    description: "درخواست انواع مجوزهای شهرداری",
    href: "/services/permits",
    icon: FileText,
  },
  {
    id: "maintenance",
    title: "درخواست تعمیرات",
    description: "ثبت درخواست برای تعمیرات و نگهداری",
    href: "/services/maintenance",
    icon: Wrench,
  },
  {
    id: "address",
    title: "دریافت آدرس",
    description: "دریافت و استعلام آدرس ملک",
    href: "/services/address",
    icon: MapPin,
  },
  {
    id: "contact",
    title: "تماس با شهرداری",
    description: "ارتباط با بخش‌های مختلف شهرداری",
    href: "/services/contact",
    icon: Phone,
  },
];

export const requestStatuses: Record<string, string> = {
  pending: "در انتظار بررسی",
  "in-review": "در حال بررسی",
  completed: "تکمیل شده",
  rejected: "رد شده",
};

export const complaintCategories = [
  "نظافت",
  "معابر",
  "روشنایی",
  "فضای سبز",
  "سایر",
];

export const buildingPermitTypes = [
  "نوسازی",
  "اضافه بنا",
  "تغییر کاربری",
  "سایر",
];

export const paymentTypes = [
  "نوسازی",
  "کسب و پیشه",
  "پسماند",
  "سایر",
];

// =============================================================================
// Pagination Constants
// =============================================================================

/** Maximum number of requests to fetch for statistics calculation */
export const MAX_REQUESTS_FOR_STATS = 1000;

/** Default page size for dashboard request list */
export const DASHBOARD_PAGE_SIZE = 100;

/** Default page size for recent requests */
export const RECENT_REQUESTS_PAGE_SIZE = 20;

/** Default page size for filtered requests */
export const FILTERED_REQUESTS_PAGE_SIZE = 50;

