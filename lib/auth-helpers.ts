import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./supabaseBrowserClient";
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
// Authentication Functions
// =============================================================================

/**
 * Sign in an employee with email and password
 * @param email - Employee email address
 * @param password - Employee password
 * @returns Promise with success status and optional error message
 */
export async function signInEmployee(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "خطا در ورود. لطفاً دوباره تلاش کنید.",
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "خطا در ورود. لطفاً دوباره تلاش کنید.",
    };
  }
}

/**
 * Get the current authenticated user
 * @returns Promise with User object or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = getSupabaseBrowserClient();
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

/**
 * Sign out the current employee
 * @returns Promise that resolves when sign out is complete
 */
export async function signOutEmployee(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  await supabase.auth.signOut();
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
