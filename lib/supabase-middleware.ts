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
  // Create response that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  return { supabase, response };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(request: NextRequest) {
  const { supabase, response } = await createMiddlewareClient(request);
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, response, error };
}

