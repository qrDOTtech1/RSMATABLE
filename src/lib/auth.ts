import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth.config";

// NOTE: No PrismaAdapter — we use JWT strategy (required for CredentialsProvider).
// PrismaAdapter + JWT caused duplicate cookies → 431 Request Header Fields Too Large.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = (credentials?.email as string)?.toLowerCase().trim();
          const password = credentials?.password as string;
          if (!email || !password) {
            console.log("[authorize] missing email/password");
            return null;
          }

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            console.log("[authorize] no user for", email);
            return null;
          }
          // RSMATABLE uses `password`, legacy rows from MaTable-API use `passwordHash`
          const hash = (user as any).password ?? (user as any).passwordHash;
          if (!hash) {
            console.log("[authorize] user has no password hash:", email, "— keys:", Object.keys(user));
            return null;
          }

          const valid = await bcrypt.compare(password, hash);
          if (!valid) {
            console.log("[authorize] bad password for", email);
            return null;
          }

          console.log("[authorize] OK", email, user.id);
          return { id: user.id, email: user.email, name: user.name, image: user.image };
        } catch (e: any) {
          console.error("[authorize] crash:", e?.message, e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (user?.id) {
        try {
          await prisma.socialProfile.upsert({
            where: { userId: user.id },
            create: { userId: user.id },
            update: {},
          });
        } catch {}
      }
      return true;
    },
  },
});
