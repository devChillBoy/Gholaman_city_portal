import type { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "./supabaseClient";
import type { AppRole } from "./types";

export type { AppRole };

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
// Server-side Authentication Functions
// =============================================================================

/**
 * Get the current authenticated user on the server side
 * Uses cookies/headers to determine the authenticated user
 * @returns Promise with User object or null if not authenticated
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const supabase = getSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

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

// =============================================================================
// Server Action Middleware
// =============================================================================

/**
 * Require admin role for server actions
 * Throws an error if user is not authenticated or not an admin
 */
export async function requireAdmin(): Promise<User> {
  const user = await getServerUser();
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  if (!isAdmin(user)) {
    throw new Error("Admin access required");
  }
  
  return user;
}

/**
 * Require employee role for server actions
 * Throws an error if user is not authenticated or not an employee
 */
export async function requireEmployee(): Promise<User> {
  const user = await getServerUser();
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  if (!isEmployee(user)) {
    throw new Error("Employee access required");
  }
  
  return user;
}
