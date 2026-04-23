"use client";
import { useState } from "react";
import { X, Calendar, Users, FileText, CheckCircle } from "lucide-react";

type Restaurant = {
  id: string; name: string; city: string | null; maxPartySize?: number;
};

export default function ReservationModal({
  restaurant,
  onClose,
}: {
  restaurant: Restaurant;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    date: "",
    time: "19:30",
    partySize: "2",
    notes: "",
    guestPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const dateTime = new Date(`${form.date}T${form.time}`);
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          startsAt: dateTime.toISOString(),
          partySize: parseInt(form.partySize),
          notes: form.notes || undefined,
          guestPhone: form.guestPhone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la réservation");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="text-center space-y-4 py-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <h2 className="text-2xl font-black">Réservation envoyée !</h2>
            <p className="text-white/50 text-sm">
              Votre demande chez <strong>{restaurant.name}</strong> a bien été transmise.
              Vous recevrez une confirmation par email.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 bg-orange-600 hover:bg-orange-500 rounded-2xl font-black text-sm transition-all"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black">Réserver une table</h2>
                <p className="text-sm text-orange-400 font-bold">{restaurant.name}{restaurant.city && ` · ${restaurant.city}`}</p>
              </div>
              <button onClick={onClose} className="p-2 text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                    <Calendar className="w-3 h-3 inline mr-1" />Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-orange-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Heure</label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-orange-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                  <Users className="w-3 h-3 inline mr-1" />Nombre de couverts
                </label>
                <select
                  value={form.partySize}
                  onChange={(e) => setForm((p) => ({ ...p, partySize: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-orange-500 outline-none transition-all"
                >
                  {Array.from({ length: restaurant.maxPartySize || 8 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} personne{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Téléphone (optionnel)</label>
                <input
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  value={form.guestPhone}
                  onChange={(e) => setForm((p) => ({ ...p, guestPhone: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
                  <FileText className="w-3 h-3 inline mr-1" />Demandes spéciales
                </label>
                <textarea
                  rows={2}
                  placeholder="Allergie, anniversaire, chaise bébé..."
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-orange-500 outline-none transition-all resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !form.date}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-white/5 disabled:text-white/20 rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-600/20"
              >
                {loading ? "Envoi en cours…" : "Confirmer la réservation"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
