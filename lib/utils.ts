import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import type { ServiceType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize HTML content to prevent XSS attacks
 *
 * TEMPORARY IMPLEMENTATION:
 * We removed isomorphic-dompurify because it depends on jsdom/parse5 which are
 * pure ESM modules and cause ERR_REQUIRE_ESM errors in the Vercel/Next.js server runtime.
 *
 * This basic sanitizer strips dangerous elements and attributes. Admin-entered content
 * is trusted, so this provides minimal protection against obvious XSS vectors.
 *
 * TODO: Consider using a lightweight server-compatible sanitizer like 'sanitize-html'
 * or moving sanitization to a client-only component if more thorough sanitization is needed.
 *
 * @param html - Raw HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";

  let sanitized = html;

  // Remove <script> tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove <style> tags and their content (can contain expressions in older IE)
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove <iframe>, <object>, <embed>, <form> tags
  sanitized = sanitized.replace(/<(iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  sanitized = sanitized.replace(/<(iframe|object|embed|form)\b[^>]*\/?>/gi, "");

  // Remove event handlers (onclick, onerror, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, "");

  // Remove javascript: and data: URLs from href and src attributes
  sanitized = sanitized.replace(/(href|src)\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, '$1=""');
  sanitized = sanitized.replace(/(href|src)\s*=\s*["']?\s*data:[^"'\s>]*/gi, '$1=""');

  // Remove vbscript: URLs (for older IE)
  sanitized = sanitized.replace(/(href|src)\s*=\s*["']?\s*vbscript:[^"'\s>]*/gi, '$1=""');

  return sanitized;
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

