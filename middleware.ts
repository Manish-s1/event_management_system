import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isValidToken = token && token.userId && token.email;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/events", "/categories"];
  const isPublicPath = publicRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users away from protected routes
  if (
    !isValidToken &&
    !isPublicPath &&
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/organizer") ||
      pathname.startsWith("/user") ||
      pathname.startsWith("/verification"))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect authenticated users from auth pages to their dashboard (but allow home page)
  if (
    isValidToken &&
    pathname.startsWith("/auth")
  ) {
    const redirectUrl = token.isVerified
      ? token.role === "ADMIN"
        ? "/admin"
        : token.role === "ORGANIZER"
        ? "/organizer"
        : "/user"
      : "/verification";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Prevent verified users from accessing verification page
  if (token?.isVerified && pathname.startsWith("/verification")) {
    const redirectUrl =
      token.role === "ADMIN"
        ? "/admin"
        : token.role === "ORGANIZER"
        ? "/organizer"
        : "/user";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Prevent unverified users from accessing app and admin routes
  if (
    isValidToken &&
    !token.isVerified &&
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/organizer") ||
      pathname.startsWith("/user"))
  ) {
    return NextResponse.redirect(new URL("/verification", request.url));
  }

  // Role-based access control for verified users
  if (isValidToken && token?.isVerified) {
    // ADMIN can only access /admin, redirect from /organizer or /user
    if (
      token.role === "ADMIN" &&
      (pathname.startsWith("/organizer") || pathname.startsWith("/user"))
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // ORGANIZER can only access /organizer, redirect from /admin or /user
    if (
      token.role === "ORGANIZER" &&
      (pathname.startsWith("/admin") || pathname.startsWith("/user"))
    ) {
      return NextResponse.redirect(new URL("/organizer", request.url));
    }
    // USER can only access /user, redirect from /admin or /organizer
    if (
      token.role === "USER" &&
      (pathname.startsWith("/admin") || pathname.startsWith("/organizer"))
    ) {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
