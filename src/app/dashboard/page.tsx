import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { mediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let session;
  try {
    session = await auth();
  } catch {
    redirect("/clear-cookies");
  }
  if (!session) redirect("/login");

  const userId = session.userId;

  // Verify user actually exists in DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true },
  });
  if (!user) redirect("/clear-cookies");

  // Get or create profile
  let profile = await prisma.socialProfile.findUnique({ where: { userId } });
  if (!profile) {
    try {
      profile = await prisma.socialProfile.create({
        data: { userId, onboardingDone: false },
      });
    } catch {
      redirect("/clear-cookies");
    }
  }

  if (!profile.onboardingDone) redirect("/onboarding");

  // Restaurants partenaires — include media for photos
  const restaurants = await prisma.restaurant.findMany({
    where: { isPartner: true },
    select: {
      id: true, name: true, city: true, slug: true, description: true,
      logoId: true, coverImageId: true, acceptReservations: true,
      dishReviews: { select: { rating: true } },
      media: { select: { id: true }, take: 5 },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Avis recents
  const recentReviews = await prisma.dishReview.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      restaurant: { select: { id: true, name: true, city: true } },
      menuItem: { select: { id: true, name: true } },
      user: { select: { name: true, image: true } },
    },
  });

  // Favoris de l'utilisateur
  const favorites = await prisma.favoriteRestaurant.findMany({
    where: { userId },
    include: { restaurant: { select: { id: true, name: true, city: true, logoId: true, slug: true } } },
    take: 5,
  });

  // Reservations a venir
  const upcomingReservations = await prisma.reservation.findMany({
    where: { userId, startsAt: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } },
    include: { restaurant: { select: { id: true, name: true, city: true, logoId: true, slug: true } } },
    orderBy: { startsAt: "asc" },
    take: 3,
  });

  // Pings recus non vus
  const pendingPings = await prisma.socialPing.count({
    where: { receiver: { userId }, status: "SENT" },
  });

  const API = process.env.NEXT_PUBLIC_API_URL ?? "";

  const enrichedRestaurants = restaurants.map((r) => {
    // Build cover image: prefer coverImageId, then first media, then logoId
    let coverUrl = mediaUrl(r.coverImageId);
    if (!coverUrl && r.media?.length > 0) {
      coverUrl = `${API}/api/media/${r.media[0].id}`;
    }
    if (!coverUrl) coverUrl = mediaUrl(r.logoId);

    return {
      id: r.id,
      name: r.name,
      city: r.city,
      slug: r.slug,
      logoUrl: mediaUrl(r.logoId),
      coverUrl,
      cuisine: r.description,
      acceptsReservations: r.acceptReservations,
      avgRating:
        r.dishReviews.length > 0
          ? (r.dishReviews.reduce((s, d) => s + d.rating, 0) / r.dishReviews.length).toFixed(1)
          : null,
      reviewsCount: r.dishReviews.length,
    };
  });

  const enrichedFavorites = favorites.map((f) => ({
    ...f,
    restaurant: { ...f.restaurant, logoUrl: mediaUrl((f.restaurant as any).logoId) },
  }));

  const enrichedReservations = upcomingReservations.map((r) => ({
    ...r,
    restaurant: { ...r.restaurant, logoUrl: mediaUrl((r.restaurant as any).logoId) },
  }));

  return (
    <DashboardClient
      user={{ name: user.name, email: user.email, image: user.image }}
      profile={{ activeMode: profile.activeMode, interests: profile.interests }}
      restaurants={enrichedRestaurants as any}
      recentReviews={recentReviews as any}
      favorites={enrichedFavorites as any}
      upcomingReservations={enrichedReservations as any}
      pendingPings={pendingPings}
    />
  );
}
