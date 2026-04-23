import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "sid";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 1. /clear-cookies route: nuke everything and redirect to /login ──
  if (pathname === "/clear-cookies") {
    const res = NextResponse.redirect(new URL("/login", req.url));
    for (const cookie of req.cookies.getAll()) {
      res.cookies.delete(cookie.name);
    }
    return res;
  }

  // ── 2. Check session via our single tiny JWT cookie ──
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isLoggedIn = !!token;

  // ── 3. Protected routes ──
  const protectedPaths = ["/dashboard", "/onboarding", "/profile", "/reservations", "/favoris"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 4. Redirect logged-in users away from /login ──
  if (isLoggedIn && pathname === "/login" && !req.nextUrl.searchParams.has("error")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
