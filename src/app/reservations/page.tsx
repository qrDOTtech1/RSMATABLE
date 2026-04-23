import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
  CONFIRMED: "bg-green-500/10 text-green-300 border-green-500/30",
  CANCELLED: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  DONE: "bg-white/5 text-white/40 border-white/10",
};

export default async function ReservationsPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) redirect("/login?callbackUrl=/reservations");

  const reservations = await prisma.reservation.findMany({
    where: { userId },
    include: { restaurant: { select: { id: true, name: true, city: true, slug: true, logoId: true } } },
    orderBy: { startsAt: "desc" },
    take: 50,
  });

  const upcoming = reservations.filter((r) => new Date(r.startsAt) >= new Date());
  const past = reservations.filter((r) => new Date(r.startsAt) < new Date());

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-28">
      <header className="sticky top-0 z-40 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/dashboard" className="text-white/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base font-bold">Mes réservations</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <section>
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
            À venir ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center">
              <Calendar className="w-8 h-8 mx-auto text-white/20 mb-2" />
              <p className="text-sm text-white/50">Aucune réservation à venir.</p>
              <Link
                href="/dashboard"
                className="inline-block mt-4 text-xs font-bold text-orange-400 hover:text-orange-300"
              >
                Découvrir des restaurants →
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((r) => <ReservationCard key={r.id} r={r} />)}
            </ul>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
              Passées ({past.length})
            </h2>
            <ul className="space-y-2 opacity-75">
              {past.map((r) => <ReservationCard key={r.id} r={r} />)}
            </ul>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

function ReservationCard({ r }: { r: any }) {
  const d = new Date(r.startsAt);
  return (
    <li className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] rounded-2xl p-4 flex items-center gap-4 transition-colors">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center text-2xl shrink-0">
        {(r.restaurant as any).logoId ? <img src={`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/media/${(r.restaurant as any).logoId}`} className="w-full h-full object-cover" /> : "🍽️"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{r.restaurant.name}</div>
        {r.restaurant.city && (
          <div className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {r.restaurant.city}
          </div>
        )}
        <div className="text-xs text-white/60 mt-1.5 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
            {" · "}
            {d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {r.partySize}
          </span>
        </div>
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${
          STATUS_STYLE[r.status] ?? STATUS_STYLE.PENDING
        }`}
      >
        {r.status}
      </span>
    </li>
  );
}
