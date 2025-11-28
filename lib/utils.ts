import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import type { ServiceType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string for display in Persian (Jalali) calendar
 * @param dateString - ISO date string
 * @returns Formatted Persian date string (e.g., "۱۴۰۳/۰۲/۱۵")
 */
export function formatNewsDate(dateString: string | null): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return format(date, "yyyy/MM/dd", { locale: faIR });
  } catch {
    return "";
  }
}

/**
 * Format Persian date from ISO string
 * @param dateString - ISO date string
 * @returns Formatted Persian date string
 */
export function formatPersianDate(dateString: string): string {
  return formatNewsDate(dateString);
}

/**
 * Format a date string with full Persian format (day name, month name, year)
 * @param dateString - ISO date string
 * @returns Formatted Persian date string (e.g., "۱۵ اردیبهشت ۱۴۰۳")
 */
export function formatPersianDateFull(dateString: string | null): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: faIR });
  } catch {
    return "";
  }
}

/**
 * Map service type to Persian label
 * @param serviceType - The service type
 * @returns Persian label for the service type
 */
export function getServiceTypeLabel(serviceType: ServiceType): string {
  const labels: Record<ServiceType, string> = {
    complaint_137: "شکایت ۱۳۷",
    building_permit: "پروانه ساختمانی",
    payment: "پرداخت عوارض",
  };
  return labels[serviceType] || serviceType;
}

