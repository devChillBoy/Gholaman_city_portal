import { NextResponse, type NextRequest } from "next/server";
import { isAuthenticated, isAdminEmail } from "@/lib/supabase-middleware";

/**
 * Middleware for protecting routes
 * - /employees/dashboard requires authentication (employee or admin)
 * - /admin/* requires admin role
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isEmployeeRoute = pathname.startsWith("/employees/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");

  // Skip if not a protected route
  if (!isEmployeeRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // Get authentication status
  const { user, response, error } = await isAuthenticated(request);

  // If not authenticated, redirect to login
  if (!user || error) {
    const loginUrl = new URL("/employees/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, check if user has admin role
  if (isAdminRoute) {
    if (!isAdminEmail(user.email)) {
      // User is authenticated but not admin - show forbidden or redirect to dashboard
      const dashboardUrl = new URL("/employees/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // User is authenticated (and admin for admin routes) - allow access
  return response;
}

/**
 * Configure which routes should run the middleware
 */
export const config = {
  matcher: [
    // Protected employee routes
    "/employees/dashboard/:path*",
    // Protected admin routes  
    "/admin/:path*",
  ],
};

