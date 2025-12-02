import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "./supabaseBrowserClient";
import { getUserRole, isAdmin, isEmployee } from "./auth-roles";
import type { AppRole } from "./types";

// Re-export role functions for convenience
export { getUserRole, isAdmin, isEmployee };
export type { AppRole };

// =============================================================================
// Browser-side Authentication Functions
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
    
    if (!supabase) {
      return {
        success: false,
        error: "سرویس احراز هویت در دسترس نیست. لطفاً با مدیر سیستم تماس بگیرید.",
      };
    }

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
 * Get the current authenticated user (browser-side)
 * @returns Promise with User object or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    
    if (!supabase) {
      return null;
    }

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
  
  if (!supabase) {
    console.warn("[Auth] Cannot sign out: Supabase client not available");
    return;
  }

  await supabase.auth.signOut();
}
