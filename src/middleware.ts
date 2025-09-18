import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith("/api/auth")
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for authentication token (Edge-safe)
  const token =
    request.cookies.get("auth-token")?.value ||
    (request.headers.get("authorization")?.startsWith("Bearer ")
      ? request.headers.get("authorization")!.substring(7)
      : null);

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify JWT using jose (Edge-compatible)
  let payload: any | null = null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: verified } = await jwtVerify(token, secret);
    payload = verified;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control for admin area
  if (
    pathname.startsWith("/admin") &&
    String(payload?.role || "") !== "admin" &&
    String(payload?.role || "") !== "mentor"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Forward user info as headers for convenience (APIs can still verify cookie)
  const requestHeaders = new Headers(request.headers);
  if (payload?.userId) requestHeaders.set("x-user-id", String(payload.userId));
  if (payload?.role) requestHeaders.set("x-user-role", String(payload.role));
  if (payload?.teamCode)
    requestHeaders.set("x-team-code", String(payload.teamCode));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
