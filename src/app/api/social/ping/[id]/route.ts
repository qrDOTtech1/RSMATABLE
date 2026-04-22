import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// PATCH — respond to ping (accept/decline/seen)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json();
  const { status } = body; // ACCEPTED | DECLINED | SEEN

  const profile = await prisma.socialProfile.findUnique({ where: { userId } });
  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  const ping = await prisma.socialPing.findUnique({ where: { id: params.id } });
  if (!ping || ping.receiverId !== profile.id) {
    return NextResponse.json({ error: "Ping introuvable" }, { status: 404 });
  }

  const updated = await prisma.socialPing.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ ping: updated });
}
