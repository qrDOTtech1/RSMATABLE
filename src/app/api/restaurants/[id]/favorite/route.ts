import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const existing = await prisma.favoriteRestaurant.findUnique({
    where: { userId_restaurantId: { userId, restaurantId: params.id } },
  });

  if (existing) {
    await prisma.favoriteRestaurant.delete({
      where: { userId_restaurantId: { userId, restaurantId: params.id } },
    });
    return NextResponse.json({ favorited: false });
  }

  await prisma.favoriteRestaurant.create({ data: { userId, restaurantId: params.id } });
  return NextResponse.json({ favorited: true });
}
