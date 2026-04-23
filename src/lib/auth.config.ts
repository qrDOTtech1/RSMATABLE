import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no Prisma, no bcrypt). Used by middleware.
export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (shorter = smaller cookies)
  },
  cookies: {
    sessionToken: {
      name: "sid", // ultra-short cookie name to minimize header size
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [], // real providers live in auth.ts (Node runtime only)
  callbacks: {
    async jwt({ token, user }) {
      // ABSOLUTE MINIMUM payload — only store id to prevent 431
      if (user) return { sub: (user as any).id };
      return { sub: token.sub };
    },
    async session({ session, token }) {
      // Minimal session — only expose id
      if (session.user) (session.user as any).id = token.sub;
      return session;
    },
  },
  pages: { signIn: "/login" },
} satisfies NextAuthConfig;
