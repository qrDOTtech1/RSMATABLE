import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no Prisma, no bcrypt). Used by middleware.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [], // real providers live in auth.ts (Node runtime only)
  callbacks: {
    async jwt({ token, user }) {
      // Only store id — strip name/email/picture from JWT to prevent 431
      if (user) return { id: (user as any).id, sub: (user as any).id };
      return { id: (token as any).id, sub: token.sub };
    },
    async session({ session, token }) {
      // Minimal session — only expose id to avoid bloated cookies
      if (session.user) (session.user as any).id = (token as any).id ?? token.sub;
      return session;
    },
  },
  pages: { signIn: "/login" },
} satisfies NextAuthConfig;
