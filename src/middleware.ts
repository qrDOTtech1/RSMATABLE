import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "sid";
const ACTIVITY_COOKIE = "last_active"; // unix timestamp seconds
const INACTIVITY_TIMEOUT_H = 6; // hours before auto-logout
const INACTIVITY_TIMEOUT_S = INACTIVITY_TIMEOUT_H * 60 * 60;

const SECURE = process.env.NODE_ENV === "production";

// Old NextAuth cookies that cause 431 Request Header Too Large
const STALE_COOKIES = [
  "next-auth.session-token", "__Secure-next-auth.session-token",
  "next-auth.csrf-token", "__Secure-next-auth.csrf-token",
  "next-auth.callback-url", "__Secure-next-auth.callback-url",
  "__Host-next-auth.csrf-token",
  "next-auth.pkce.code_verifier", "__Secure-next-auth.pkce.code_verifier",
  "next-auth.state", "__Secure-next-auth.state",
  "authjs.session-token", "__Secure-authjs.session-token",
  "authjs.csrf-token", "__Secure-authjs.csrf-token",
  "__Host-authjs.csrf-token", "authjs.callback-url",
  "authjs.pkce.code_verifier", "__Secure-authjs.pkce.code_verifier",
];

function expireSession(req: NextRequest, reason: string): NextResponse {
  const url = new URL("/login", req.url);
  url.searchParams.set("error", reason);
  const res = NextResponse.redirect(url);
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  res.cookies.set(ACTIVITY_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── 0. Purge stale NextAuth cookies (prevents 431) ───────────────────────────
  const res = NextResponse.next();
  let hasStaleCookies = false;
  for (const name of STALE_COOKIES) {
    if (req.cookies.has(name)) {
      hasStaleCookies = true;
      res.cookies.delete(name);
    }
  }

  // ── 1. /clear-cookies: nuke everything → /login ──────────────────────────────
  if (pathname === "/clear-cookies") {
    const redirect = NextResponse.redirect(new URL("/login", req.url));
    for (const cookie of req.cookies.getAll()) redirect.cookies.delete(cookie.name);
    return redirect;
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isLoggedIn = !!token;

  // ── 2. Inactivity timeout (only for logged-in users) ─────────────────────────
  if (isLoggedIn && !pathname.startsWith("/api/")) {
    const now = Math.floor(Date.now() / 1000);
    const lastActiveRaw = req.cookies.get(ACTIVITY_COOKIE)?.value;
    const lastActive = lastActiveRaw ? parseInt(lastActiveRaw, 10) : null;

    if (lastActive && now - lastActive > INACTIVITY_TIMEOUT_S) {
      // User has been inactive for more than INACTIVITY_TIMEOUT_H hours
      return expireSession(req, "session-expired");
    }

    // Refresh the activity timestamp on every authenticated page visit
    res.cookies.set(ACTIVITY_COOKIE, String(now), {
      httpOnly: true,
      secure: SECURE,
      sameSite: "lax",
      path: "/",
      maxAge: INACTIVITY_TIMEOUT_S + 60, // expires slightly after the timeout window
    });
  }

  // ── 3. Protected routes ───────────────────────────────────────────────────────
  const protectedPaths = ["/dashboard", "/onboarding", "/profile", "/reservations", "/favoris"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 4. Redirect logged-in users away from /login ──────────────────────────────
  if (isLoggedIn && pathname === "/login" && !req.nextUrl.searchParams.has("error")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return hasStaleCookies ? res : NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
