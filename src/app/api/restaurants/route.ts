import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    const restaurants = await prisma.restaurant.findMany({
      where: {
        isPartner: true,
        ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      },
      include: {
        dishReviews: { select: { rating: true } },
        _count: { select: { reservations: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const enriched = restaurants.map((r) => ({
      ...r,
      avgRating: r.dishReviews.length > 0
        ? (r.dishReviews.reduce((sum, d) => sum + d.rating, 0) / r.dishReviews.length).toFixed(1)
        : null,
      reviewsCount: r.dishReviews.length,
      dishReviews: undefined,
    }));

    return NextResponse.json({ restaurants: enriched });
  } catch (e) {
    console.error("[GET /api/restaurants] threw:", e);
    return NextResponse.json({ restaurants: [] });
  }
}
