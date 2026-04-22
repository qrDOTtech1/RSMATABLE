import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) redirect("/login?callbackUrl=/profile");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
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
