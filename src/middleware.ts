import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Edge-safe: uses the minimal authConfig (no Prisma/bcrypt imports).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const protectedPaths = ["/dashboard", "/onboarding", "/profile", "/reservations"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const res = NextResponse.redirect(loginUrl);

    // Purge all NextAuth cookies to prevent stale cookie accumulation (431)
    const cookieNames = [
      "authjs.session-token",
      "__Secure-authjs.session-token",
      "authjs.csrf-token",
      "__Host-authjs.csrf-token",
      "authjs.callback-url",
      "__Secure-authjs.callback-url",
      // Legacy next-auth cookie names
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "next-auth.callback-url",
    ];
    for (const name of cookieNames) {
      res.cookies.delete(name);
    }
    return res;
  }

  // Redirect logged-in users away from /login — BUT NOT if an error query param is present
  // (otherwise dashboard -> /login?error=session-expired -> /dashboard -> loop forever)
  if (isLoggedIn && pathname === "/login" && !req.nextUrl.searchParams.has("error")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
