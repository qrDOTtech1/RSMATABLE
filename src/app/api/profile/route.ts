import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, image: true, profile: true },
  });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  const userId = session.userId;

  try {
    const body = await req.json();
    const { name, image, bio, occupation, interests, activeMode } = body ?? {};

    if (typeof image === "string" && image.length > 1_400_000) {
      return NextResponse.json({ error: "Image trop lourde (max ~1 Mo)." }, { status: 413 });
    }

    const userUpdate: any = {};
    if (typeof name === "string") userUpdate.name = name.trim() || null;
    if (typeof image === "string") userUpdate.image = image || null;

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: userUpdate });
    }

    const profileData: any = {};
    if (typeof bio === "string") profileData.bio = bio.trim() || null;
    if (typeof occupation === "string") profileData.occupation = occupation.trim() || null;
    if (Array.isArray(interests)) profileData.interests = interests.filter((x) => typeof x === "string").slice(0, 20);
    if (typeof activeMode === "string" && ["BUSINESS", "FUN", "DATE", "HIDDEN"].includes(activeMode)) {
      profileData.activeMode = activeMode;
    }

    if (Object.keys(profileData).length > 0) {
      await prisma.socialProfile.upsert({
        where: { userId },
        create: { userId, ...profileData },
        update: profileData,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[profile PATCH] crash:", e?.message);
    return NextResponse.json({ error: e?.message ?? "server_error" }, { status: 500 });
  }
}
