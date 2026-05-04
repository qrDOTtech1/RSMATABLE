import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "sid";

// Old NextAuth cookies that cause 431 Request Header Too Large
const STALE_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.csrf-token",
  "__Secure-next-auth.csrf-token",
  "next-auth.callback-url",
  "__Secure-next-auth.callback-url",
  "__Host-next-auth.csrf-token",
  // PKCE cookies — biggest offenders, accumulate on every failed OAuth attempt
  "next-auth.pkce.code_verifier",
  "__Secure-next-auth.pkce.code_verifier",
  "next-auth.state",
  "__Secure-next-auth.state",
  // NextAuth v5 / Auth.js renamed cookies
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "authjs.csrf-token",
  "__Secure-authjs.csrf-token",
  "__Host-authjs.csrf-token",
  "authjs.callback-url",
  "authjs.pkce.code_verifier",
  "__Secure-authjs.pkce.code_verifier",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ── 0. Always purge stale NextAuth cookies → prevents 431 ─────────────────
  let hasStaleCookies = false;
  for (const name of STALE_COOKIES) {
    if (req.cookies.has(name)) {
      hasStaleCookies = true;
      res.cookies.delete(name);
    }
  }

  // ── 1. /clear-cookies route: nuke everything and redirect to /login ────────
  if (pathname === "/clear-cookies") {
    const redirect = NextResponse.redirect(new URL("/login", req.url));
    for (const cookie of req.cookies.getAll()) {
      redirect.cookies.delete(cookie.name);
    }
    return redirect;
  }

  // ── 2. Check session via our single tiny JWT cookie ────────────────────────
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isLoggedIn = !!token;

  // ── 3. Protected routes ────────────────────────────────────────────────────
  const protectedPaths = ["/dashboard", "/onboarding", "/profile", "/reservations", "/favoris"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 4. Redirect logged-in users away from /login ───────────────────────────
  if (isLoggedIn && pathname === "/login" && !req.nextUrl.searchParams.has("error")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Return response with purged cookies headers if any stale ones found
  return hasStaleCookies ? res : NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
