import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const body = await req.json();
  const { mode, occupation, bio, interests } = body;

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
}
