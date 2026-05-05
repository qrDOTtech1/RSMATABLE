import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const reservations = await prisma.reservation.findMany({
      where: { userId: session.userId },
      include: { restaurant: { select: { id: true, name: true, city: true, logoId: true } } },
      orderBy: { startsAt: "desc" },
    });
    return NextResponse.json({ reservations });
  } catch (e) {
    console.error("[GET /api/reservations] threw:", e);
    return NextResponse.json({ reservations: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.userId;

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
    const body = await req.json();
    const { restaurantId, startsAt, partySize, notes, guestName, guestPhone } = body ?? {};

    if (!restaurantId || !startsAt || !partySize) {
      return NextResponse.json({ error: "restaurantId, startsAt, partySize requis" }, { status: 400 });
    }

    const parsedDate = new Date(startsAt);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
    if (!restaurant.acceptReservations) {
      return NextResponse.json({ error: "Ce restaurant n'accepte pas les réservations en ligne" }, { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        restaurantId,
        startsAt: parsedDate,
        partySize: parseInt(String(partySize)),
        notes: notes || null,
        customerName: guestName || user?.name || "Client",
        customerEmail: user?.email || "",
        customerPhone: guestPhone || null,
      },
      include: { restaurant: { select: { name: true, city: true } } },
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (e: any) {
    console.error("[POST /api/reservations] threw:", e?.message);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
