"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, LogOut, ArrowLeft, Check, X } from "lucide-react";
import BottomNav from "@/components/BottomNav";


const MODES = [
  { value: "HIDDEN", label: "Discret", emoji: "👤" },
  { value: "BUSINESS", label: "Business", emoji: "💼" },
  { value: "FUN", label: "Fun", emoji: "🎉" },
  { value: "DATE", label: "Date", emoji: "❤️" },
];

const INTEREST_SUGGEST = [
  "Gastronomie", "Vin", "Café", "Brunch", "Sushi", "Pizza", "Burger", "Végétarien",
  "Cuisine du monde", "Pâtisserie", "Cocktails", "Bistrot", "Terrasse", "Rooftop",
];

async function resizeImageToDataUrl(file: File, maxDim = 512, quality = 0.85): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function ProfileClient({
  initial,
}: {
  initial: {
    name: string;
    email: string;
    image: string | null;
    bio: string;
    occupation: string;
    interests: string[];
    activeMode: string;
  };
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initial.name);
  const [image, setImage] = useState<string | null>(initial.image);
  const [bio, setBio] = useState(initial.bio);
  const [occupation, setOccupation] = useState(initial.occupation);
  const [interests, setInterests] = useState<string[]>(initial.interests);
  const [newInterest, setNewInterest] = useState("");
  const [activeMode, setActiveMode] = useState(initial.activeMode);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function onPickPhoto(file: File) {
    try {
      setMessage(null);
      const dataUrl = await resizeImageToDataUrl(file, 512, 0.85);
      setImage(dataUrl);
      // Save immediately
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "upload failed");
      }
      setMessage({ type: "ok", text: "Photo mise à jour." });
    } catch (e: any) {
      setMessage({ type: "error", text: e.message ?? "Erreur photo" });
    }
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, occupation, interests, activeMode }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "save failed");
      }
      setMessage({ type: "ok", text: "Profil enregistré." });
      router.refresh();
    } catch (e: any) {
      setMessage({ type: "error", text: e.message ?? "Erreur" });
    } finally {
      setSaving(false);
    }
  }

  function addInterest(tag: string) {
    const t = tag.trim();
    if (!t || interests.includes(t) || interests.length >= 20) return;
    setInterests([...interests, t]);
    setNewInterest("");
  }

  const initials = (name || initial.email)[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Retour</span>
          </Link>
          <h1 className="text-base font-bold">Mon profil</h1>
          <button
            onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; }}
            className="text-white/50 hover:text-rose-400 p-1" title="Deconnexion"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Avatar */}
        <section className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-4xl font-black ring-4 ring-white/5">
              {image ? (
                <img src={image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center shadow-lg"
              title="Changer la photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPickPhoto(f);
                e.target.value = "";
              }}
            />
          </div>
          <p className="mt-3 text-xs text-white/40">JPG ou PNG — redimensionnée à 512px</p>
        </section>

        {/* Identité */}
        <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Nom affiché</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400/60"
              placeholder="Prénom Nom"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Email</label>
            <input
              value={initial.email}
              readOnly
              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/40 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Occupation</label>
            <input
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400/60"
              placeholder="Chef de projet, Étudiante, …"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={300}
              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400/60 resize-none"
              placeholder="Quelques mots sur vous…"
            />
            <div className="text-[10px] text-white/30 text-right mt-1">{bio.length}/300</div>
          </div>
        </section>

        {/* Mode */}
        <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Mode actif</label>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setActiveMode(m.value)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  activeMode === m.value
                    ? "bg-orange-500/20 border-orange-400 text-orange-300"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <div className="text-xl">{m.emoji}</div>
                <div className="text-[10px] font-bold mt-1">{m.label}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Centres d'intérêt */}
        <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Centres d'intérêt</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-400/30 text-orange-300 text-xs px-2.5 py-1 rounded-full"
              >
                {tag}
                <button
                  onClick={() => setInterests(interests.filter((t) => t !== tag))}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest(newInterest))}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400/60"
              placeholder="Ajouter un centre d'intérêt"
            />
            <button
              onClick={() => addInterest(newInterest)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-xl text-sm font-bold"
            >
              Ajouter
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {INTEREST_SUGGEST.filter((s) => !interests.includes(s)).map((s) => (
              <button
                key={s}
                onClick={() => addInterest(s)}
                className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white px-2 py-1 rounded-full"
              >
                + {s}
              </button>
            ))}
          </div>
        </section>

        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              message.type === "ok"
                ? "bg-green-500/10 border border-green-500/30 text-green-300"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:brightness-110 disabled:opacity-50 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>

        {/* Déconnexion */}
        <button
          onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; }}
          className="w-full py-3 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
