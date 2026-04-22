import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  let userId: string | null = null;

  try {
    const session = await auth();
    if (session?.user) userId = (session.user as any).id as string;
  } catch {}

  if (!userId) {
    try {
      const token = await getToken({ req, secret: process.env.AUTH_SECRET });
      if (token?.id) userId = token.id as string;
      else if (token?.sub) userId = token.sub as string;
    } catch {}
  }

  if (!userId) {
    return NextResponse.json({ error: "Session expirée. Reconnectez-vous.", expired: true }, { status: 401 });
  }

  // Verify user actually exists in DB (guards against stale JWT from old resets)
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

  const { mode, occupation, bio, interests } = body;

  try {
    const profile = await prisma.socialProfile.upsert({
      where: { userId },
      create: {
        userId,
        activeMode: mode || "FUN",
        occupation: occupation || null,
        bio: bio || null,
        interests: interests || [],
        onboardingDone: true,
        onboardingData: body,
      },
      update: {
        activeMode: mode || "FUN",
        occupation: occupation || null,
        bio: bio || null,
        interests: interests || [],
        onboardingDone: true,
        onboardingData: body,
      },
    });

    return NextResponse.json({ ok: true, profile });
  } catch (err: any) {
    console.error("Onboarding error:", err);
    return NextResponse.json({ error: "Erreur serveur lors de la sauvegarde." }, { status: 500 });
  }
}
