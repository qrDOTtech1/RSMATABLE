import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { status } = body;
  const { id } = await params;

  const profile = await prisma.socialProfile.findUnique({ where: { userId: session.userId } });
  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  const ping = await prisma.socialPing.findUnique({ where: { id } });
  if (!ping || ping.receiverId !== profile.id) {
    return NextResponse.json({ error: "Ping introuvable" }, { status: 404 });
  }

  const updated = await prisma.socialPing.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ ping: updated });
}
