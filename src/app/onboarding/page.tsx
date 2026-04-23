"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Briefcase, Heart, PartyPopper, Check, ChevronRight, ChevronLeft } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: "mode",       title: "Votre humeur ce soir" },
  { id: "you",        title: "Qui êtes-vous ?" },
  { id: "food",       title: "À table, vous êtes..." },
  { id: "diet",       title: "Ce que vous ne mangez pas" },
  { id: "interests",  title: "Vos obsessions" },
];

const INTERESTS = [
  { label: "🔥 Gastronomie",          value: "Gastronomie" },
  { label: "🚗 Passions automobiles", value: "Automobiles" },
  { label: "💻 Tech & IA",            value: "Tech" },
  { label: "📈 Finance",              value: "Finance" },
  { label: "✈️ Voyages",              value: "Voyages" },
  { label: "🎬 Cinéma",              value: "Cinéma" },
  { label: "🎵 Musique",              value: "Musique" },
  { label: "🏋️ Sport",               value: "Sport" },
  { label: "🎮 Gaming",              value: "Gaming" },
  { label: "📚 Lecture",             value: "Lecture" },
  { label: "🎨 Art & Design",        value: "Design" },
  { label: "🍷 Vins & Spiritueux",   value: "Vin" },
  { label: "🌿 Nature & Outdoor",    value: "Nature" },
  { label: "👔 Mode & Style",        value: "Mode" },
  { label: "🏗️ Immobilier",          value: "Immobilier" },
  { label: "🎭 Sorties & Culture",   value: "Culture" },
];

const CUISINE_TYPES = [
  "🇫🇷 Française", "🇮🇹 Italienne", "🇯🇵 Japonaise", "🇲🇦 Marocaine",
  "🌮 Mexicaine", "🍜 Asiatique", "🥩 Viande & Grillade", "🐟 Fruits de mer",
  "🌱 Végé & Végane", "🍕 Street Food", "🍮 Sucrée & Pâtisserie", "🌶️ Épicée",
];

const DIETARY = [
  { value: "VEGETARIAN",   label: "🌿 Végétarien" },
  { value: "VEGAN",        label: "🌱 Vegan" },
  { value: "GLUTEN_FREE",  label: "🌾 Sans gluten" },
  { value: "LACTOSE_FREE", label: "🥛 Sans lactose" },
  { value: "HALAL",        label: "☪️ Halal" },
  { value: "KOSHER",       label: "✡️ Casher" },
];

const ALLERGIES = [
  "🥜 Arachides", "🦐 Crustacés", "🐟 Poisson", "🥚 Œufs",
  "🌾 Gluten", "🥛 Lait", "🌰 Fruits à coque", "🌱 Soja",
  "🥬 Céleri", "🍯 Sulfites",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    mode: "FUN",
    occupation: "",
    bio: "",
    interests: [] as string[],
    cuisines: [] as string[],
    dietary: [] as string[],
    allergies: [] as string[],
    foodPersonality: "" as "ADVENTUROUS" | "CLASSIC" | "HEALTHY" | "GLUTTON" | "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const next = () => step < STEPS.length - 1 && setStep((s) => s + 1);
  const prev = () => step > 0 && setStep((s) => s - 1);

  const toggle = <T extends string>(field: keyof typeof form, val: T) => {
    setForm((p) => {
      const arr = (p[field] as T[]);
      return { ...p, [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  };

  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: form.mode,
          occupation: form.occupation,
          bio: form.bio,
          interests: form.interests,
          foodData: {
            cuisines: form.cuisines,
            dietary: form.dietary,
            allergies: form.allergies,
            personality: form.foodPersonality,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.expired) { router.push("/login?error=session-expired"); return; }
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-orange-500/30 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/8 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-black tracking-tighter">MA <span className="text-orange-500">TABLE</span></span>
          <p className="text-white/30 text-xs mt-1">On a besoin de vous connaître un minimum. Un minimum, pas un roman.</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-10">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-orange-500" : "bg-white/10"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <h1 className="text-2xl font-black leading-tight">{STEPS[step].title}</h1>

            {/* ── STEP 0 : Mode ── */}
            {step === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-white/40">
                  Personne ne viendra dans votre dos. Choisissez <em>vraiment</em>.
                </p>
                {[
                  { id: "BUSINESS", icon: Briefcase, label: "Business & Networking", desc: "Vous êtes là pour brasser des affaires, pas juste des frites.", color: "text-blue-400", border: "border-blue-500/40" },
                  { id: "DATE",     icon: Heart,       label: "Rencontres",           desc: "Séduire quelqu'un à table. L'art le plus noble qui soit.", color: "text-rose-400",  border: "border-rose-500/40" },
                  { id: "FUN",      icon: PartyPopper, label: "Social & Fun",          desc: "Jeux, bonne humeur, gens sympas. La vie quoi.",            color: "text-orange-400", border: "border-orange-500/40" },
                ].map((m) => (
                  <button key={m.id} onClick={() => setForm((p) => ({ ...p, mode: m.id }))}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                      form.mode === m.id ? `${m.border} bg-white/5` : "border-white/8 bg-transparent opacity-50 hover:opacity-90"
                    }`}
                  >
                    <m.icon className={`w-7 h-7 shrink-0 ${m.color}`} />
                    <div className="text-left flex-1">
                      <div className="font-bold text-sm">{m.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{m.desc}</div>
                    </div>
                    {form.mode === m.id && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                  </button>
                ))}
              </div>
            )}

            {/* ── STEP 1 : Qui êtes-vous ── */}
            {step === 1 && (
              <div className="space-y-5">
                <p className="text-sm text-white/40">On a besoin de savoir <em>vaguement</em> qui vous êtes. Pas votre CV complet.</p>
                <div>
                  <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest font-bold">Votre métier</label>
                  <input value={form.occupation}
                    onChange={(e) => setForm((p) => ({ ...p, occupation: e.target.value }))}
                    placeholder="Designer, Entrepreneur, Chef étoilé, Aventurier…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-orange-500 transition-all text-sm placeholder-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest font-bold">Une bio. Courte. Pas votre autobiographie.</label>
                  <textarea value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Quelques mots sur vous. Les gens n'ont pas toute la soirée."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-orange-500 transition-all resize-none text-sm placeholder-white/20"
                  />
                </div>
              </div>
            )}

            {/* ── STEP 2 : Goûts alimentaires ── */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Food personality */}
                <div>
                  <p className="text-sm text-white/40 mb-3">
                    Un seul mot suffit. Soyez honnête avec vous-même.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: "ADVENTUROUS", label: "🌍 Aventurier·e", desc: "Si c'est bizarre, vous le commandez." },
                      { val: "CLASSIC",     label: "🎩 Classique",     desc: "Filet mignon, bordeaux, merci." },
                      { val: "HEALTHY",     label: "🥗 Sain & Propre", desc: "Votre corps est un temple. Respectez-le." },
                      { val: "GLUTTON",     label: "🍔 Grand Appétit", desc: "La vie est trop courte pour les petites portions." },
                    ].map((p) => (
                      <button key={p.val}
                        onClick={() => setForm((f) => ({ ...f, foodPersonality: p.val as any }))}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          form.foodPersonality === p.val ? "border-orange-500 bg-orange-500/10" : "border-white/8 bg-white/3 hover:border-white/20"
                        }`}
                      >
                        <div className="font-bold text-sm">{p.label}</div>
                        <div className="text-[11px] text-white/40 mt-0.5">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cuisines favorites */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Cuisines que vous adorez</p>
                  <div className="flex flex-wrap gap-2">
                    {CUISINE_TYPES.map((c) => (
                      <button key={c}
                        onClick={() => toggle("cuisines", c)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          form.cuisines.includes(c) ? "bg-orange-500 border-orange-500 text-white" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3 : Régimes & allergies ── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-white/40 mb-3">
                    Ce que vous évitez. On ne jugera pas. Enfin, presque pas.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {DIETARY.map((d) => (
                      <button key={d.value}
                        onClick={() => toggle("dietary", d.value)}
                        className={`px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                          form.dietary.includes(d.value) ? "bg-green-500/15 border-green-500/50 text-green-300" : "border-white/8 text-white/50 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Allergies (important — pas de blague là-dessus)</p>
                  <div className="flex flex-wrap gap-2">
                    {ALLERGIES.map((a) => (
                      <button key={a}
                        onClick={() => toggle("allergies", a)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          form.allergies.includes(a) ? "bg-red-500/20 border-red-500/50 text-red-300" : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  {form.allergies.length === 0 && form.dietary.length === 0 && (
                    <p className="text-xs text-white/20 mt-3 italic">Aucune restriction ? Excellent. Vous pouvez tout commander. Profitez-en.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 4 : Centres d'intérêt ── */}
            {step === 4 && (
              <div>
                <p className="text-sm text-white/40 mb-4">
                  Choisissez au moins 2. Nova IA s'en sert pour trouver les gens qui vous ressemblent.
                  <span className="text-white/20 block mt-0.5">Ne choisissez pas « Gastronomie » juste pour faire bonne impression. On sait.</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button key={i.value}
                      onClick={() => toggle("interests", i.value)}
                      className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                        form.interests.includes(i.value)
                          ? "bg-orange-500 border-orange-500 text-white scale-105"
                          : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {i.label}
                    </button>
                  ))}
                </div>
                {form.interests.length > 0 && (
                  <p className="mt-4 text-xs text-orange-400 font-bold">
                    {form.interests.length} passion{form.interests.length > 1 ? "s" : ""} assumée{form.interests.length > 1 ? "s" : ""}. Bien.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">⚠️ {error}</p>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          <button onClick={prev} disabled={step === 0}
            className="flex items-center gap-2 text-white/40 hover:text-white disabled:opacity-0 transition-all text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={next}
              className="bg-white text-black px-7 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all"
            >
              Continuer <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={finish} disabled={loading || form.interests.length < 2}
              className="bg-orange-600 text-white px-7 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-orange-500 disabled:bg-white/10 disabled:text-white/20 transition-all shadow-xl shadow-orange-600/20"
            >
              {loading ? "Sauvegarde…" : <><span>C'est parti</span> <Check className="w-4 h-4" /></>}
            </button>
          )}
        </div>

        {step === STEPS.length - 1 && form.interests.length < 2 && (
          <p className="text-center text-xs text-white/25 mt-3">Choisissez au moins 2 centres d'intérêt.</p>
        )}
      </div>
    </div>
  );
}
