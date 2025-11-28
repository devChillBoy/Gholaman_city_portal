/**
 * Shared type definitions for the application
 */

// =============================================================================
// News Types
// =============================================================================

export type NewsStatus = "draft" | "published";

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  status: NewsStatus;
  created_at: string;
  published_at: string | null;
}

export interface NewsInput {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  status?: NewsStatus;
  published_at?: string | null;
}

// =============================================================================
// Request Types
// =============================================================================

export type RequestStatus = "pending" | "in-review" | "completed" | "rejected";

export type ServiceType = "complaint_137" | "building_permit" | "payment";

export interface RequestRecord {
  id: string;
  code: string;
  service_type: ServiceType;
  title: string;
  description: string | null;
  status: RequestStatus;
  payload: Record<string, unknown> | null;
  citizen_name: string | null;
  citizen_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRequestInput {
  service_type: ServiceType;
  title: string;
  description?: string;
  payload?: Record<string, unknown>;
  citizen_name?: string;
  citizen_phone?: string;
}

// =============================================================================
// User/Auth Types
// =============================================================================

export type AppRole = "admin" | "employee" | "unknown";

// =============================================================================
// Service Types
// =============================================================================

import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

