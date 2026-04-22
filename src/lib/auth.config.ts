import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no Prisma, no bcrypt). Used by middleware.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [], // real providers live in auth.ts (Node runtime only)
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && (token as any).id) {
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
} satisfies NextAuthConfig;
