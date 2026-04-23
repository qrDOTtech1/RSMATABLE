import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.socialProfile.findUnique({ where: { userId: session.userId } });
  if (!profile) return NextResponse.json({ pings: [] });

  const pings = await prisma.socialPing.findMany({
    where: { receiverId: profile.id },
    include: {
      sender: { include: { user: { select: { name: true, image: true, email: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ pings });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { receiverProfileId, message, mode } = body;

  const senderProfile = await prisma.socialProfile.findUnique({ where: { userId: session.userId } });
  if (!senderProfile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  if (senderProfile.id === receiverProfileId) {
    return NextResponse.json({ error: "Impossible de se pinger soi-meme" }, { status: 400 });
  }

  const ping = await prisma.socialPing.create({
    data: {
      senderId: senderProfile.id,
      receiverId: receiverProfileId,
      message: message || null,
      mode: mode || senderProfile.activeMode,
    },
  });

  return NextResponse.json({ ping }, { status: 201 });
}
