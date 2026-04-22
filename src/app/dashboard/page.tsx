import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Resolve userId — also try email lookup if id missing
  let userId = (session.user as any).id as string | undefined;
  if (!userId && session.user.email) {
    const u = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    userId = u?.id;
  }
  if (!userId) redirect("/login");

  // Verify user actually exists in DB — guard against stale JWT
  const userInDb = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!userInDb) redirect("/login?error=session-expired");

  // Get or create profile
  let profile = await prisma.socialProfile.findUnique({ where: { userId } });
  if (!profile) {
    try {
      profile = await prisma.socialProfile.create({
        data: { userId, onboardingDone: false },
      });
    } catch {
      redirect("/login?error=session-expired");
    }
  }

  if (!profile.onboardingDone) redirect("/onboarding");

  // Restaurants partenaires
  const restaurants = await prisma.restaurant.findMany({
    where: { isPartner: true },
    include: { dishReviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Avis récents
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
    include: { restaurant: { select: { id: true, name: true, city: true, logoUrl: true } } },
    take: 5,
  });

  // Réservations à venir
  const upcomingReservations = await prisma.reservation.findMany({
    where: { userId, startsAt: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } },
    include: { restaurant: { select: { id: true, name: true, city: true, logoUrl: true } } },
    orderBy: { startsAt: "asc" },
    take: 3,
  });

  // Pings reçus non vus
  const pendingPings = await prisma.socialPing.count({
    where: { receiver: { userId }, status: "SENT" },
  });

  const enrichedRestaurants = restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    logoUrl: r.logoUrl,
    coverUrl: r.coverImageUrl,
    cuisine: r.description,
    acceptsReservations: r.acceptReservations,
    avgRating:
      r.dishReviews.length > 0
        ? (r.dishReviews.reduce((s, d) => s + d.rating, 0) / r.dishReviews.length).toFixed(1)
        : null,
    reviewsCount: r.dishReviews.length,
  }));

  return (
    <DashboardClient
      user={{ name: session.user.name, email: session.user.email, image: session.user.image }}
      profile={{ activeMode: profile.activeMode, interests: profile.interests }}
      restaurants={enrichedRestaurants as any}
      recentReviews={recentReviews as any}
      favorites={favorites as any}
      upcomingReservations={upcomingReservations as any}
      pendingPings={pendingPings}
    />
  );
}
