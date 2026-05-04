import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // ── Auth ──────────────────────────────────────────────────────────────────────
  let session: { userId: string } | null = null;
  try { session = await auth(); } catch { redirect("/clear-cookies"); }
  if (!session) redirect("/login");
  const userId = session.userId;

  // ── User + profile ─────────────────────────────────────────────────────────
  let user: any = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  } catch (e) {
    console.error("[profile] user lookup threw:", e);
    redirect("/dashboard"); // can't load profile → go home
  }
  if (!user) redirect("/dashboard");

  // Ensure profile exists (create if first visit)
  if (!user.profile) {
    try {
      await prisma.socialProfile.upsert({
        where: { userId },
        update: {},
        create: { userId, onboardingDone: false },
      });
      // re-fetch with profile
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });
    } catch (e) {
      console.error("[profile] profile upsert threw:", e);
    }
  }

  return (
    <ProfileClient
      initial={{
        name: user?.name ?? "",
        email: user?.email ?? "",
        image: user?.image ?? null,
        bio: user?.profile?.bio ?? "",
        occupation: user?.profile?.occupation ?? "",
        interests: Array.isArray(user?.profile?.interests) ? user.profile.interests : [],
        activeMode: (user?.profile?.activeMode as string) ?? "HIDDEN",
      }}
    />
  );
}
