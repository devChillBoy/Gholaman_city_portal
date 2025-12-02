import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for Server Components and Server Actions
 * This properly reads cookies for authentication
 * Returns null if environment variables are not configured or if creation fails
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error(
        "Missing Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
      );
      return null;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      console.error("Invalid NEXT_PUBLIC_SUPABASE_URL format");
      return null;
    }

    const cookieStore = await cookies();

    return createServerClient(url, key, {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll();
          } catch {
            console.warn("Failed to get cookies in Supabase client");
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    });
  } catch (error) {
    console.error("Failed to create Supabase server client:", error);
    return null;
  }
}

