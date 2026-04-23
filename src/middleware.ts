import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of ALL cookies NextAuth v5 / authjs can set (including our short "sid")
const AUTH_COOKIES = [
  "sid",
  "__Secure-sid",
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "authjs.csrf-token",
  "__Host-authjs.csrf-token",
  "authjs.callback-url",
  "__Secure-authjs.callback-url",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.csrf-token",
  "next-auth.callback-url",
];

// Maximum safe cookie header size (keep well under 8KB Railway/nginx limit)
const MAX_COOKIE_HEADER_SIZE = 4096;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 1. Emergency cookie nuke: if cookie header is too large, wipe everything ──
  const cookieHeader = req.headers.get("cookie") ?? "";
  if (cookieHeader.length > MAX_COOKIE_HEADER_SIZE) {
    // Redirect to same URL but with all cookies deleted
    const res = NextResponse.redirect(req.url);
    for (const name of AUTH_COOKIES) {
      res.cookies.delete(name);
    }
    // Also nuke any unknown cookies
    for (const cookie of req.cookies.getAll()) {
      res.cookies.delete(cookie.name);
    }
    return res;
  }

  // ── 2. /clear-cookies route: manual cookie purge endpoint ──
  if (pathname === "/clear-cookies") {
    const res = NextResponse.redirect(new URL("/login", req.url));
    for (const cookie of req.cookies.getAll()) {
      res.cookies.delete(cookie.name);
    }
    return res;
  }

  // ── 3. Check auth via session cookie (lightweight, no NextAuth import) ──
  const sessionToken =
    req.cookies.get("sid")?.value ??
    req.cookies.get("__Secure-sid")?.value ??
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;
  const isLoggedIn = !!sessionToken;

  // ── 4. Protected routes ──
  const protectedPaths = ["/dashboard", "/onboarding", "/profile", "/reservations"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const res = NextResponse.redirect(loginUrl);
    // Clean up any stale auth cookies
    for (const name of AUTH_COOKIES) {
      res.cookies.delete(name);
    }
    return res;
  }

  // ── 5. Redirect logged-in users away from /login ──
  if (isLoggedIn && pathname === "/login" && !req.nextUrl.searchParams.has("error")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
