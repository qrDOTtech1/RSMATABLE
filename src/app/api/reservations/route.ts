import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const reservations = await prisma.reservation.findMany({
    where: { userId },
    include: { restaurant: { select: { id: true, name: true, city: true, logoUrl: true } } },
    orderBy: { startsAt: "desc" },
  });

  return NextResponse.json({ reservations });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const body = await req.json();
  const { restaurantId, startsAt, partySize, notes, guestName, guestPhone } = body;

  if (!restaurantId || !startsAt || !partySize) {
    return NextResponse.json({ error: "restaurantId, startsAt, partySize requis" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  if (!restaurant.acceptReservations) return NextResponse.json({ error: "Ce restaurant n'accepte pas les réservations en ligne" }, { status: 400 });

  const reservation = await prisma.reservation.create({
    data: {
      userId,
      restaurantId,
      startsAt: new Date(startsAt),
      partySize: parseInt(partySize),
      notes: notes || null,
      customerName: guestName || session.user.name || "Client",
      customerEmail: session.user.email || "",
      customerPhone: guestPhone || null,
    },
    include: { restaurant: { select: { name: true, city: true } } },
  });

  return NextResponse.json({ reservation }, { status: 201 });
}
