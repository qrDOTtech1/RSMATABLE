"use client";
import { useState } from "react";
import Link from "next/link";
import { Home, Search, Compass, Zap, Heart, Calendar, Bell, Settings, LogOut, Star, MapPin, ChefHat, Utensils } from "lucide-react";
import { logout } from "@/lib/auth-actions";
import ReservationModal from "@/components/ReservationModal";
import BottomNav from "@/components/BottomNav";

type Restaurant = {
  id: string; name: string; city: string | null; logoUrl: string | null;
  coverUrl: string | null; cuisine: string | null;
  acceptsReservations: boolean; avgRating: string | null; reviewsCount: number;
};

type Review = {
  id: string; rating: number; comment: string | null; createdAt: string;
  restaurant: { id: string; name: string; city: string | null };
  menuItem: { id: string; name: string } | null;
  user: { name: string | null; image: string | null };
};

type Favorite = {
  restaurantId: string;
  restaurant: { id: string; name: string; city: string | null; logoUrl: string | null };
};

type Reservation = {
  id: string; startsAt: string; partySize: number; status: string;
  restaurant: { id: string; name: string; city: string | null; logoUrl: string | null };
};

const MODE_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  BUSINESS: { label: "Business", color: "text-blue-400", emoji: "💼" },
  DATE: { label: "Date", color: "text-rose-400", emoji: "❤️" },
  FUN: { label: "Fun", color: "text-orange-400", emoji: "🎉" },
  HIDDEN: { label: "Discret", color: "text-white/40", emoji: "👤" },
};

export default function DashboardClient({
  user, profile, restaurants, recentReviews, favorites, upcomingReservations, pendingPings,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
  profile: { activeMode: string; interests: string[] };
  restaurants: Restaurant[];
  recentReviews: Review[];
  favorites: Favorite[];
  upcomingReservations: Reservation[];
  pendingPings: number;
}) {
  const [reservationTarget, setReservationTarget] = useState<Restaurant | null>(null);
  const [activeNav, setActiveNav] = useState("home");
  const [favIds, setFavIds] = useState<Set<string>>(new Set(favorites.map((f) => f.restaurantId)));

  const mode = MODE_LABELS[profile.activeMode] || MODE_LABELS.HIDDEN;
  const initials = user.name ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "ME";

  const toggleFav = async (restaurantId: string) => {
    const res = await fetch(`/api/restaurants/${restaurantId}/favorite`, { method: "POST" });
    const data = await res.json();
    setFavIds((prev) => {
      const next = new Set(prev);
      data.favorited ? next.add(restaurantId) : next.delete(restaurantId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500/30 font-sans">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-white/5 hidden lg:flex flex-col p-6 z-40">
        <div className="text-xl font-black tracking-tighter mb-10">
          MA <span className="text-orange-500">TABLE</span>
        </div>

        <nav className="space-y-1 flex-1">
          {[
            { id: "home", icon: Home, label: "Accueil" },
            { id: "discover", icon: Compass, label: "Découvrir" },
            { id: "search", icon: Search, label: "Rechercher" },
            { id: "connect", icon: Zap, label: "Nova Connect" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all text-left ${
                activeNav === id ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-bold">{label}</span>
            </button>
          ))}

          <div className="pt-6">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3 px-3">Mes Favoris</p>
            {favorites.length === 0 ? (
              <p className="text-xs text-white/20 px-3">Aucun favori pour l'instant.</p>
            ) : (
              favorites.map((f) => (
                <div key={f.restaurantId} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-lg shrink-0">
                    {f.restaurant.logoUrl ? <img src={f.restaurant.logoUrl} className="w-full h-full object-cover rounded" /> : "🍽️"}
                  </div>
                  <span className="text-sm text-white/60 group-hover:text-white truncate">{f.restaurant.name}</span>
                </div>
              ))
            )}
          </div>

          {upcomingReservations.length > 0 && (
            <div className="pt-6">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3 px-3">Réservations</p>
              {upcomingReservations.map((r) => (
                <div key={r.id} className="px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <div className="text-xs font-bold text-white/70 truncate">{r.restaurant.name}</div>
                  <div className="text-[10px] text-orange-400">
                    {new Date(r.startsAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · {r.partySize} pers.
                  </div>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/5 pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-xs font-black shrink-0">
              {user.image ? <img src={user.image} className="w-full h-full rounded-full object-cover" /> : initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{user.name || user.email}</div>
              <div className={`text-[10px] ${mode.color}`}>{mode.emoji} {mode.label}</div>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5">
              <LogOut className="w-4 h-4" /> Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN */}
      <main className="lg:ml-64 pb-36">
        {/* Hero */}
        <section className="relative h-72 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-rose-600 to-purple-700" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
            <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">
              Bienvenue, {user.name?.split(" ")[0] || "ami(e) culinaire"} {mode.emoji}
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3">
              VOTRE FLOW<br />CULINAIRE.
            </h1>
            <p className="text-white/70 text-sm max-w-lg">
              Nova IA a sélectionné les meilleures tables pour votre humeur {mode.label.toLowerCase()}.
              {profile.interests.length > 0 && ` Basé sur vos goûts : ${profile.interests.slice(0, 3).join(", ")}.`}
            </p>
          </div>
        </section>

        <div className="px-6 md:px-10 py-8 space-y-14">

          {/* Notifications pings */}
          {pendingPings > 0 && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
              <Bell className="w-6 h-6 text-orange-400 shrink-0" />
              <p className="text-sm text-white/80">
                <span className="font-black text-orange-400">{pendingPings} nouvelle{pendingPings > 1 ? "s" : ""} demande{pendingPings > 1 ? "s" : ""} Nova Connect</span> en attente.
              </p>
              <button className="ml-auto text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors">Voir</button>
            </div>
          )}

          {/* Restaurants */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black tracking-tight">
                Restaurants <span className="text-orange-500">Partenaires</span>
              </h2>
              <button className="text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors">Tout afficher</button>
            </div>
            {restaurants.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Aucun restaurant partenaire pour l'instant.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {restaurants.map((r) => (
                  <RestaurantCard
                    key={r.id}
                    restaurant={r}
                    isFav={favIds.has(r.id)}
                    onFav={() => toggleFav(r.id)}
                    onReserve={() => r.acceptsReservations && setReservationTarget(r)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Grille : Reviews + Nova Match */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Activity stream */}
            <div className="xl:col-span-2 space-y-5">
              <h2 className="text-2xl font-black tracking-tight italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">
                L'Actu des Assiettes.
              </h2>
              {recentReviews.length === 0 ? (
                <div className="text-center py-12 text-white/20">
                  <Utensils className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Les premiers avis arrivent bientôt…</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentReviews.map((rev) => (
                    <ReviewCard key={rev.id} review={rev} />
                  ))}
                </div>
              )}
            </div>

            {/* Nova Match sidebar */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <h3 className="text-lg font-black mb-1 flex items-center gap-2">
                  <span className="text-orange-500">✨</span> Nova Match
                </h3>
                <p className="text-xs text-white/30 mb-4">Basé sur votre profil {mode.emoji} {mode.label}</p>
                {profile.interests.length > 0 ? (
                  <p className="text-sm text-white/50 mb-6">
                    Des personnes qui partagent vos goûts pour{" "}
                    <span className="text-white font-bold">{profile.interests[0]}</span> sont peut-être à proximité.
                  </p>
                ) : (
                  <p className="text-sm text-white/40 mb-6">Complétez votre profil pour activer le matching IA.</p>
                )}
                <button className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-600/20">
                  Lancer Nova Connect
                </button>
              </div>

              {/* Réservations rapides */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" /> Réserver Maintenant
                </h3>
                {restaurants.filter((r) => r.acceptsReservations).slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setReservationTarget(r)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left group mb-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                      {r.logoUrl ? <img src={r.logoUrl} className="w-full h-full object-cover rounded-xl" /> : "🍽️"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold truncate group-hover:text-orange-400 transition-colors">{r.name}</div>
                      {r.city && <div className="text-[10px] text-white/30 flex items-center gap-1"><MapPin className="w-3 h-3" />{r.city}</div>}
                    </div>
                    <Calendar className="w-4 h-4 text-white/20 group-hover:text-orange-400 transition-colors shrink-0" />
                  </button>
                ))}
                {restaurants.filter((r) => r.acceptsReservations).length === 0 && (
                  <p className="text-xs text-white/30">Aucun restaurant disponible.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mode indicator strip (just above the nav) */}
      <div
        className="fixed left-0 right-0 z-40 bg-[#121212]/90 backdrop-blur-xl border-t border-white/5 px-4 py-2 flex items-center justify-between lg:ml-64"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 60px)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-600 rounded-lg flex items-center justify-center text-sm shrink-0">🍽️</div>
          <div className="min-w-0">
            <div className="font-bold text-xs truncate">MA TABLE</div>
            <div className={`text-[10px] ${mode.color} truncate`}>{mode.emoji} Mode {mode.label}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {pendingPings > 0 && (
            <button className="relative p-1.5 text-orange-400">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>
          )}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-[10px] font-black overflow-hidden">
            {user.image ? <img src={user.image} className="w-full h-full rounded-full object-cover" /> : initials}
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Reservation Modal */}
      {reservationTarget && (
        <ReservationModal
          restaurant={reservationTarget}
          onClose={() => setReservationTarget(null)}
        />
      )}
    </div>
  );
}

function RestaurantCard({
  restaurant, isFav, onFav, onReserve,
}: {
  restaurant: Restaurant; isFav: boolean; onFav: () => void; onReserve: () => void;
}) {
  return (
    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.07] transition-all group cursor-pointer">
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center text-4xl shadow-2xl">
        {restaurant.logoUrl ? (
          <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-cover" />
        ) : (
          <span>🍽️</span>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {restaurant.acceptsReservations && (
            <button
              onClick={(e) => { e.stopPropagation(); onReserve(); }}
              className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-orange-400 transition-colors"
              title="Réserver"
            >
              <Calendar className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onFav(); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-colors ${
              isFav ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-rose-500"
            }`}
            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <h3 className="font-bold truncate text-sm mb-1 group-hover:text-orange-400 transition-colors">{restaurant.name}</h3>
      <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase font-bold tracking-tight">
        {restaurant.avgRating && (
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" fill="currentColor" />{restaurant.avgRating}</span>
        )}
        {restaurant.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{restaurant.city}</span>}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  return (
    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex gap-4 hover:bg-white/[0.04] transition-all">
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
        {review.user.image ? <img src={review.user.image} className="w-full h-full object-cover" /> : (review.user.name?.[0] || "U")}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-bold text-white/80">
            <span className="text-orange-400">{review.user.name || "Anonyme"}</span>
            {review.menuItem && <> a adoré le <span className="italic text-white">{review.menuItem.name}</span></>}
          </p>
          <span className="text-[10px] text-white/20 shrink-0">{new Date(review.createdAt).toLocaleDateString("fr-FR")}</span>
        </div>
        <p className="text-[10px] text-yellow-400 mb-1">{stars}</p>
        {review.comment && (
          <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-2">"{review.comment}"</p>
        )}
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-white/20" />
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">{review.restaurant.name}</span>
        </div>
      </div>
    </div>
  );
}
