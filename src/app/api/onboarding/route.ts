import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Session expiree. Reconnectez-vous.", expired: true }, { status: 401 });
  }
  const userId = session.userId;

  const userExists = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!userExists) {
    return NextResponse.json({ error: "Session invalide. Reconnectez-vous.", expired: true }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requete invalide." }, { status: 400 });
  }

  const { mode, occupation, bio, interests, foodData } = body;

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
