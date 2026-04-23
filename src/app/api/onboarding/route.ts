import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getToken } from "next-auth/jwt";

async function resolveUserId(req: NextRequest): Promise<string | null> {
  // 1. Try auth() session first
  try {
    const session = await auth();
    const id = (session?.user as any)?.id;
    if (id) return id;
  } catch {}

  // 2. Fallback: read JWT token
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token) return null;

    // token.id is set by our jwt callback with the real DB user id
    if (token.id && typeof token.id === "string") return token.id;

    // token.sub may be email (CredentialsProvider) or actual ID (Google)
    const sub = token.sub as string | undefined;
    if (!sub) return null;

    // If sub looks like an email → look up user by email
    if (sub.includes("@")) {
      const user = await prisma.user.findUnique({ where: { email: sub }, select: { id: true } });
      return user?.id ?? null;
    }

    return sub;
  } catch {}

  return null;
}

export async function POST(req: NextRequest) {
  const userId = await resolveUserId(req);

  if (!userId) {
    return NextResponse.json({ error: "Session expirée. Reconnectez-vous.", expired: true }, { status: 401 });
  }

  // Guard: user must exist in DB
  const userExists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!userExists) {
    return NextResponse.json({ error: "Session invalide. Reconnectez-vous.", expired: true }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const { mode, occupation, bio, interests, foodData } = body;

  // Merge food interests into interests array for Nova matching
  const allInterests = [...(interests || [])];
  if (foodData?.cuisines?.length) allInterests.push(...foodData.cuisines.map((c: string) => `cuisine:${c}`));

  try {
    const profile = await prisma.socialProfile.upsert({
      where: { userId },
      create: {
        userId,
        activeMode: mode || "FUN",
        occupation: occupation || null,
        bio: bio || null,
        interests: allInterests,
        onboardingDone: true,
        onboardingData: { mode, occupation, bio, interests, foodData },
      },
      update: {
        activeMode: mode || "FUN",
        occupation: occupation || null,
        bio: bio || null,
        interests: allInterests,
        onboardingDone: true,
        onboardingData: { mode, occupation, bio, interests, foodData },
      },
    });

    return NextResponse.json({ ok: true, profile });
  } catch (err: any) {
    console.error("Onboarding error:", err);
    return NextResponse.json({ error: "Erreur serveur lors de la sauvegarde." }, { status: 500 });
  }
}
