import { createClient } from "@supabase/supabase-js";

/**
 * Get a Supabase client instance for server-side use
 * This function should only be used in server components, server actions, API routes, etc.
 */
export function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env.local"
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

