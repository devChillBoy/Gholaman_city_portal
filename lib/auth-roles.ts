import type { User } from "@supabase/supabase-js";
import type { AppRole } from "./types";

/**
 * Shared role-checking utilities for both browser and server
 * This file contains pure functions with no side effects
 */

// =============================================================================
// Admin Email Configuration
// =============================================================================

/**
 * List of admin email addresses loaded from environment variable
 * Format: NEXT_PUBLIC_ADMIN_EMAILS=admin@gholaman.ir, boss@gholaman.ir
 */
const ADMIN_EMAILS: string[] = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// =============================================================================
// Role Functions (Email-based)
// =============================================================================

/**
 * Get the application role for a user based on their email address
 * - Admin: Email is in NEXT_PUBLIC_ADMIN_EMAILS list
 * - Employee: Any other authenticated user
 * - Unknown: Not authenticated
 * 
 * @param user - Supabase User object or null
 * @returns The user's role: "admin", "employee", or "unknown"
 */
export function getUserRole(user: User | null): AppRole {
  if (!user) {
    return "unknown";
  }

  const email = user.email?.toLowerCase() || "";

  // Check if email is in admin list
  if (ADMIN_EMAILS.includes(email)) {
    return "admin";
  }

  // Any logged-in user who is not in the admin list is treated as an employee
  return "employee";
}

/**
 * Check if the user is an admin
 * @param user - Supabase User object or null
 * @returns true if the user's email is in the admin list
 */
export function isAdmin(user: User | null): boolean {
  return getUserRole(user) === "admin";
}

/**
 * Check if the user is an employee (including admins)
 * Any authenticated user is considered an employee
 * @param user - Supabase User object or null
 * @returns true if the user is authenticated
 */
export function isEmployee(user: User | null): boolean {
  if (!user) return false;
  
  const role = getUserRole(user);
  // All authenticated users (admins and employees) can access employee pages
  return role === "employee" || role === "admin";
}

/**
 * Check if an email belongs to an admin (utility for middleware)
 * @param email - Email address to check
 * @returns true if the email is in the admin list
 */
export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

