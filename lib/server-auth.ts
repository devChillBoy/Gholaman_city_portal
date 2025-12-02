import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "./supabase-server";
import { getUserRole, isAdmin, isEmployee } from "./auth-roles";
import { authLogger } from "./logger";
import type { AppRole } from "./types";

// Re-export role functions for convenience
export { getUserRole, isAdmin, isEmployee };
export type { AppRole };

// =============================================================================
// Types for authenticated context
// =============================================================================

/**
 * Result of successful authentication containing both user and supabase client
 * Using the same client ensures session consistency for database operations
 */
export interface AuthenticatedContext {
  user: User;
  supabase: SupabaseClient;
}

// =============================================================================
// Server-side Authentication Functions
// =============================================================================

/**
 * Get the current authenticated user on the server side
 * Uses cookies to properly read the session
 * @returns Promise with User object or null if not authenticated
 */
export async function getServerUser(): Promise<User | null> {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      authLogger.error("Failed to create Supabase client: environment variables may be missing");
      return null;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      authLogger.warn("Failed to get user from session", {
        errorCode: error.status,
        errorMessage: error.message,
      });
      return null;
    }

    return user;
  } catch (error) {
    authLogger.error("Unexpected error getting server user", error);
    return null;
  }
}

/**
 * Get authenticated user along with the Supabase client that validated them
 * This is important for session consistency - the same client should be used
 * for both auth validation and subsequent database operations
 * @returns Promise with AuthenticatedContext or null if not authenticated
 */
export async function getAuthenticatedContext(): Promise<AuthenticatedContext | null> {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      authLogger.error("Failed to create Supabase client: environment variables may be missing");
      return null;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      authLogger.warn("Failed to get authenticated context", {
        errorCode: error?.status,
        errorMessage: error?.message,
      });
      return null;
    }

    return { user, supabase };
  } catch (error) {
    authLogger.error("Unexpected error getting authenticated context", error);
    return null;
  }
}

// =============================================================================
// Server Action Middleware
// =============================================================================

/**
 * Require admin role for server actions
 * Returns both the user AND the Supabase client to ensure session consistency
 * The returned Supabase client should be used for all subsequent database operations
 * 
 * @throws Error if user is not authenticated or not an admin
 * @returns AuthenticatedContext with user and supabase client
 */
export async function requireAdmin(): Promise<AuthenticatedContext> {
  const context = await getAuthenticatedContext();

  if (!context) {
    authLogger.warn("Admin access attempted without authentication");
    throw new Error("Authentication required");
  }

  const { user, supabase } = context;

  if (!isAdmin(user)) {
    authLogger.warn("Non-admin user attempted admin action", {
      userId: user.id,
      email: user.email,
      role: getUserRole(user),
    });
    throw new Error("Admin access required");
  }

  authLogger.debug("Admin access granted", {
    userId: user.id,
    email: user.email,
  });

  return { user, supabase };
}

/**
 * Require employee role for server actions
 * Returns both the user AND the Supabase client to ensure session consistency
 * 
 * @throws Error if user is not authenticated or not an employee
 * @returns AuthenticatedContext with user and supabase client
 */
export async function requireEmployee(): Promise<AuthenticatedContext> {
  const context = await getAuthenticatedContext();

  if (!context) {
    authLogger.warn("Employee access attempted without authentication");
    throw new Error("Authentication required");
  }

  const { user, supabase } = context;

  if (!isEmployee(user)) {
    authLogger.warn("Non-employee user attempted employee action", {
      userId: user.id,
      email: user.email,
      role: getUserRole(user),
    });
    throw new Error("Employee access required");
  }

  authLogger.debug("Employee access granted", {
    userId: user.id,
    email: user.email,
  });

  return { user, supabase };
}
