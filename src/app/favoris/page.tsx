import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { mediaUrl } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function FavorisPage() {
  let session;
  try { session = await auth(); } catch { redirect("/clear-cookies"); }
  if (!session) redirect("/login");
  const userId = session.userId;

  const favorites = await prisma.favoriteRestaurant.findMany({
    where: { userId },
    include: { restaurant: { select: { id: true, name: true, city: true, slug: true, logoId: true, description: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-28">
      <header className="sticky top-0 z-40 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/dashboard" className="text-white/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-bold">Mes favoris</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-10 text-center">
            <Heart className="w-10 h-10 mx-auto text-white/20 mb-3" />
            <p className="text-sm text-white/60 mb-1">Aucun restaurant en favoris</p>
            <p className="text-xs text-white/40 mb-4">Appuyez sur ♥ depuis un restaurant pour l'ajouter ici.</p>
            <Link
              href="/dashboard"
              className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-xl text-xs font-bold"
            >
              Explorer
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {favorites.map((f) => (
              <li key={f.restaurantId}>
                <Link
                  href={f.restaurant.slug ? `/restaurant/${f.restaurant.slug}` : `/restaurant/${f.restaurant.id}`}
                  className="block bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.06] transition-colors"
                >
                  <div className="aspect-square bg-slate-800 flex items-center justify-center text-4xl">
                    {(f.restaurant as any).logoId ? (
                      <img src={mediaUrl((f.restaurant as any).logoId)!} className="w-full h-full object-cover" />
                    ) : (
                      "🍽️"
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-sm truncate">{f.restaurant.name}</div>
                    {f.restaurant.city && (
                      <div className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {f.restaurant.city}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
