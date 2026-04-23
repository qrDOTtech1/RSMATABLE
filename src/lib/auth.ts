import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "sid";
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days

// ── Create a minimal JWT (only contains user id) ─────────────────────────────
export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${MAX_AGE}s`)
    .setIssuedAt()
    .sign(SECRET);
}

// ── Verify JWT → returns userId or null ──────────────────────────────────────
export async function verifyToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload.uid as string) ?? null;
  } catch {
    return null;
  }
}

// ── Set session cookie ───────────────────────────────────────────────────────
export async function setSessionCookie(userId: string) {
  const token = await createToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

// ── Clear session cookie ─────────────────────────────────────────────────────
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ── Get current session (server components & API routes) ─────────────────────
export async function auth(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const userId = await verifyToken(token);
  if (!userId) return null;
  return { userId };
}

// ── Login: verify credentials, set cookie, return result ─────────────────────
export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return { ok: false, error: "Email ou mot de passe incorrect." };

  const hash = (user as any).password ?? (user as any).passwordHash;
  if (!hash) return { ok: false, error: "Email ou mot de passe incorrect." };

  const valid = await bcrypt.compare(password, hash);
  if (!valid) return { ok: false, error: "Email ou mot de passe incorrect." };

  // Ensure social profile exists
  try {
    await prisma.socialProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });
  } catch {}

  await setSessionCookie(user.id);
  return { ok: true };
}
