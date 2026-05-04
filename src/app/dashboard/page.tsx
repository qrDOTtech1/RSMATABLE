import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { mediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // ── 1. Auth ──────────────────────────────────────────────────────────────────
  let session: { userId: string } | null = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("[dashboard] auth() threw:", e);
    redirect("/clear-cookies");
  }
  if (!session) redirect("/login");

  const userId = session.userId;

  // ── 2. User ───────────────────────────────────────────────────────────────────
  let user: { id: string; name: string | null; email: string | null; image: string | null } | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true },
    });
  } catch (e) {
    console.error("[dashboard] user lookup threw:", e);
  }
  if (!user) redirect("/clear-cookies");

  // ── 3. Profile ────────────────────────────────────────────────────────────────
  let profile: { activeMode: string; interests: string[]; onboardingDone: boolean } | null = null;
  try {
    const raw = await prisma.socialProfile.findUnique({ where: { userId } });
    if (raw) {
      profile = {
        activeMode: raw.activeMode ?? "HIDDEN",
        interests: Array.isArray(raw.interests) ? raw.interests : [],
        onboardingDone: raw.onboardingDone ?? false,
      };
    }
  } catch (e) {
    console.error("[dashboard] socialProfile lookup threw:", e);
  }

  // Create profile if missing
  if (!profile) {
    try {
      const created = await prisma.socialProfile.create({
        data: { userId, onboardingDone: false },
      });
      profile = {
        activeMode: created.activeMode ?? "HIDDEN",
        interests: Array.isArray(created.interests) ? created.interests : [],
        onboardingDone: false,
      };
    } catch (e) {
      console.error("[dashboard] socialProfile create threw:", e);
      // Use a safe fallback so the page can still render
      profile = { activeMode: "HIDDEN", interests: [], onboardingDone: true };
    }
  }

  if (!profile.onboardingDone) redirect("/onboarding");

  const API = process.env.NEXT_PUBLIC_API_URL ?? "";

  // ── 4. Restaurants partenaires ────────────────────────────────────────────────
  let enrichedRestaurants: any[] = [];
  try {
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

    enrichedRestaurants = restaurants.map((r) => {
      let coverUrl = mediaUrl(r.coverImageId);
      if (!coverUrl && r.media?.length > 0) coverUrl = `${API}/api/media/${r.media[0].id}`;
      if (!coverUrl) coverUrl = mediaUrl(r.logoId);
      return {
        id: r.id, name: r.name, city: r.city, slug: r.slug,
        logoUrl: mediaUrl(r.logoId), coverUrl,
        cuisine: r.description, acceptsReservations: r.acceptReservations,
        avgRating: r.dishReviews.length > 0
          ? (r.dishReviews.reduce((s, d) => s + d.rating, 0) / r.dishReviews.length).toFixed(1)
          : null,
        reviewsCount: r.dishReviews.length,
      };
    });
  } catch (e) {
    console.error("[dashboard] restaurants query threw:", e);
  }

  // ── 5. Avis récents ───────────────────────────────────────────────────────────
  let recentReviews: any[] = [];
  try {
    recentReviews = await prisma.dishReview.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: { select: { id: true, name: true, city: true } },
        menuItem: { select: { id: true, name: true } },
        user: { select: { name: true, image: true } },
      },
    });
  } catch (e) {
    console.error("[dashboard] dishReview query threw:", e);
  }

  // ── 6. Favoris ────────────────────────────────────────────────────────────────
  let enrichedFavorites: any[] = [];
  try {
    const favorites = await prisma.favoriteRestaurant.findMany({
      where: { userId },
      include: { restaurant: { select: { id: true, name: true, city: true, logoId: true, slug: true } } },
      take: 5,
    });
    enrichedFavorites = favorites.map((f) => ({
      ...f,
      restaurant: { ...f.restaurant, logoUrl: mediaUrl((f.restaurant as any).logoId) },
    }));
  } catch (e) {
    console.error("[dashboard] favorites query threw:", e);
  }

  // ── 7. Réservations à venir ───────────────────────────────────────────────────
  let enrichedReservations: any[] = [];
  try {
    const upcomingReservations = await prisma.reservation.findMany({
      where: { userId, startsAt: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } },
      include: { restaurant: { select: { id: true, name: true, city: true, logoId: true, slug: true } } },
      orderBy: { startsAt: "asc" },
      take: 3,
    });
    enrichedReservations = upcomingReservations.map((r) => ({
      ...r,
      restaurant: { ...r.restaurant, logoUrl: mediaUrl((r.restaurant as any).logoId) },
    }));
  } catch (e) {
    console.error("[dashboard] reservations query threw:", e);
  }

  // ── 8. Pings ──────────────────────────────────────────────────────────────────
  let pendingPings = 0;
  try {
    pendingPings = await prisma.socialPing.count({
      where: { receiver: { userId }, status: "SENT" },
    });
  } catch (e) {
    console.error("[dashboard] socialPing count threw:", e);
  }

  return (
    <DashboardClient
      user={{ name: user.name, email: user.email, image: user.image }}
      profile={{ activeMode: profile.activeMode, interests: profile.interests }}
      restaurants={enrichedRestaurants}
      recentReviews={recentReviews}
      favorites={enrichedFavorites}
      upcomingReservations={enrichedReservations}
      pendingPings={pendingPings}
    />
  );
}
