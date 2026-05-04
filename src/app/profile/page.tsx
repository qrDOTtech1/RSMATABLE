import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  let session;
  try { session = await auth(); } catch { redirect("/clear-cookies"); }
  if (!session) redirect("/login");
  const userId = session.userId;

  let user: any = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  } catch (e) {
    console.error("[profile] user lookup threw:", e);
  }
  if (!user) redirect("/login");

  return (
    <ProfileClient
      initial={{
        name: user.name ?? "",
        email: user.email ?? "",
        image: user.image ?? null,
        bio: user.profile?.bio ?? "",
        occupation: user.profile?.occupation ?? "",
        interests: user.profile?.interests ?? [],
        activeMode: (user.profile?.activeMode as string) ?? "HIDDEN",
      }}
    />
  );
}
