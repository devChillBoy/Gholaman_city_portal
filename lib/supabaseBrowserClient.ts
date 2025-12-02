import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
let envWarningLogged = false;

/**
 * Get a Supabase client instance for browser-side use
 * Uses @supabase/ssr for proper cookie handling with Next.js App Router
 * This function should only be used in client components
 * 
 * Returns null if environment variables are not configured (fails gracefully)
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      // Log error only once to avoid console spam
      if (!envWarningLogged) {
        console.error(
          "[Supabase Browser Client] Missing environment variables:",
          !url ? "NEXT_PUBLIC_SUPABASE_URL" : "",
          !key ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : "",
          "- Authentication and database features will not work."
        );
        envWarningLogged = true;
      }
      return null;
    }

    client = createBrowserClient(url, key);
  }
  return client;
}
