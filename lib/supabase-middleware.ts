import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "./auth-roles";

// Re-export for middleware use
export { isAdminEmail };

/**
 * Create a Supabase client for use in middleware
 * This properly handles cookie-based sessions
 */
export async function createMiddlewareClient(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // If env vars are missing, return a response that allows the request to continue
    // This prevents middleware from breaking the entire site
    console.error(
      "Missing Supabase environment variables in middleware. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
    );
    return {
      supabase: null as any,
      response: NextResponse.next(),
    };
  }

  // Create response that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  return { supabase, response };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(request: NextRequest) {
  const { supabase, response } = await createMiddlewareClient(request);
  
  // If Supabase client is not available (env vars missing), treat as not authenticated
  if (!supabase) {
    return { user: null, response, error: new Error("Supabase not configured") };
  }
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, response, error };
}

