import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale";
import DOMPurify from "isomorphic-dompurify";
import type { ServiceType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - Raw HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  
  return DOMPurify.sanitize(html, {
    // Allow common HTML tags for content
    ALLOWED_TAGS: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "a", "img",
      "blockquote", "pre", "code",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "span",
    ],
    // Allow safe attributes
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "class", "id",
      "target", "rel",
    ],
    // Force all links to open in new tab with safe rel attribute
    ADD_ATTR: ["target", "rel"],
    // Transform links to be safe
    ALLOW_DATA_ATTR: false,
  });
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

