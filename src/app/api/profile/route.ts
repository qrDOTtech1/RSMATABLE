import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getToken } from "next-auth/jwt";

async function resolveUserId(req: NextRequest): Promise<string | null> {
  try {
    const session = await auth();
    const id = (session?.user as any)?.id;
    if (id) return id;
  } catch {}
  try {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token) return null;
    if (token.id && typeof token.id === "string") return token.id;
    const sub = token.sub as string | undefined;
    if (!sub) return null;
    if (sub.includes("@")) {
      const user = await prisma.user.findUnique({ where: { email: sub }, select: { id: true } });
      return user?.id ?? null;
    }
    return sub;
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const userId = await resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, profile: true },
  });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const userId = await resolveUserId(req);
  if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, image, bio, occupation, interests, activeMode } = body ?? {};

    // Guard image payload size (~1MB max base64)
    if (typeof image === "string" && image.length > 1_400_000) {
      return NextResponse.json({ error: "Image trop lourde (max ~1 Mo). Réessayez avec une photo plus petite." }, { status: 413 });
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
    console.error("[profile PATCH] crash:", e?.message, e);
    return NextResponse.json({ error: e?.message ?? "server_error" }, { status: 500 });
  }
}
