import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Globe, Clock, Star, Calendar, ChefHat } from "lucide-react";
import BottomNav from "@/components/BottomNav";

import RestaurantReserveButton from "./ReserveButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function minToTime(min: number) {
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}h${m}`;
}

function absUrl(url: string) {
  if (!url) return url;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}

export const dynamic = "force-dynamic";

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let data: any;
  try {
    const res = await fetch(`${API_URL}/api/r/${slug}`, { cache: "no-store" });
    if (!res.ok) return notFound();
    data = await res.json();
  } catch {
    return notFound();
  }

  const { restaurant } = data;
  if (!restaurant) return notFound();
  const menuByCategory = ((restaurant.menuItems ?? []) as any[]).reduce((acc: Record<string, any[]>, item: any) => {
    const cat = item.category || "Autres";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const hoursGrouped = ((restaurant.openingHours ?? []) as any[]).reduce((acc: Record<number, any[]>, h: any) => {
    if (!acc[h.dayOfWeek]) acc[h.dayOfWeek] = [];
    acc[h.dayOfWeek].push(h);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-28">
      {/* HERO cover */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-slate-900">
        {restaurant.coverImageUrl ? (
          <img src={absUrl(restaurant.coverImageUrl)} alt={restaurant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-900/40 to-slate-900 flex items-center justify-center">
            <ChefHat className="w-20 h-20 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/20 to-transparent" />
        <Link href="/dashboard" className="absolute top-4 left-4 w-10 h-10 bg-black/60 backdrop-blur rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <main className="max-w-2xl mx-auto px-4 -mt-16 relative z-10 space-y-8">
        {/* Header */}
        <div className="flex items-end gap-4">
          <div className="w-20 h-20 rounded-2xl border-2 border-white/10 bg-slate-800 overflow-hidden flex items-center justify-center text-3xl shrink-0 shadow-2xl">
            {restaurant.logoUrl ? (
              <img src={absUrl(restaurant.logoUrl)} alt="" className="w-full h-full object-cover" />
            ) : "🍽️"}
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <h1 className="text-2xl font-black leading-tight truncate">{restaurant.name}</h1>
            {restaurant.city && (
              <div className="flex items-center gap-1 text-white/40 text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" />{restaurant.city}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {restaurant.description && (
          <p className="text-white/60 text-sm leading-relaxed">{restaurant.description}</p>
        )}

        {/* Contacts + réservation */}
        <div className="flex flex-wrap gap-2">
          {restaurant.acceptReservations && (
            <RestaurantReserveButton restaurant={{ id: restaurant.id, name: restaurant.name, city: restaurant.city }} />
          )}
          {restaurant.phone && (
            <a href={`tel:${restaurant.phone}`} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white/70 transition-colors border border-white/10">
              <Phone className="w-3.5 h-3.5" /> {restaurant.phone}
            </a>
          )}
          {restaurant.website && (
            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white/70 transition-colors border border-white/10">
              <Globe className="w-3.5 h-3.5" /> Site web
            </a>
          )}
        </div>

        {/* Photos du restaurant */}
        {restaurant.photos?.length > 0 && (
          <section>
            <h2 className="text-base font-bold mb-3 text-white/80">Photos</h2>
            <div className="grid grid-cols-3 gap-2">
              {restaurant.photos.map((p: any) => (
                <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-slate-800">
                  <img src={absUrl(p.url)} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Horaires */}
        {restaurant.openingHours?.length > 0 && (
          <section>
            <h2 className="text-base font-bold mb-3 flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4 text-orange-400" /> Horaires
            </h2>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl divide-y divide-white/5">
              {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                const slots = hoursGrouped[day];
                return (
                  <div key={day} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-white/50 font-medium w-24">{DAYS[day]}</span>
                    {slots?.length ? (
                      <span className="text-white/80 text-right">
                        {slots.map((s: any, i: number) => (
                          <span key={i}>{i > 0 ? " · " : ""}{minToTime(s.openMin)} – {minToTime(s.closeMin)}</span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-white/20">Fermé</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Menu */}
        {Object.keys(menuByCategory).length > 0 && (
          <section>
            <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-white/80">
              <ChefHat className="w-4 h-4 text-orange-400" /> Menu
            </h2>
            <div className="space-y-6">
              {Object.entries(menuByCategory).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-3">{category}</h3>
                  <div className="space-y-2">
                    {(items as any[]).map((item) => (
                      <div key={item.id} className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
                        <div className="flex gap-3 p-3">
                          {item.photos?.length > 0 ? (
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                              <img src={absUrl(item.photos[0].url)} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ) : null}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-bold text-sm">{item.name}</p>
                              <span className="text-orange-400 font-black text-sm shrink-0">
                                {(item.priceCents / 100).toFixed(2)} €
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                            )}
                            {item.allergens?.length > 0 && (
                              <p className="text-[10px] text-white/25 mt-1">Allergènes : {item.allergens.join(", ")}</p>
                            )}
                          </div>
                        </div>
                        {/* Photos supplémentaires du plat */}
                        {item.photos?.length > 1 && (
                          <div className="flex gap-1.5 px-3 pb-3">
                            {item.photos.slice(1).map((p: any) => (
                              <div key={p.id} className="w-14 h-14 rounded-lg overflow-hidden bg-slate-800">
                                <img src={absUrl(p.url)} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
