"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Briefcase, Heart, PartyPopper, Check, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = [
  { id: "mode", title: "Choisissez votre humeur" },
  { id: "details", title: "Quelques détails" },
  { id: "interests", title: "Vos centres d'intérêt" },
];

const INTERESTS = [
  "Tech", "Gastronomie", "Sport", "Voyages", "Cinéma",
  "Musique", "IA", "Vin", "Gaming", "Lecture", "Design",
  "Finance", "Art", "Cuisine", "Nature", "Mode",
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    mode: "FUN",
    occupation: "",
    bio: "",
    interests: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const next = () => currentStep < STEPS.length - 1 && setCurrentStep((c) => c + 1);
  const prev = () => currentStep > 0 && setCurrentStep((c) => c - 1);

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-orange-500/30">
      {/* BG glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-10">
          <span className="text-2xl font-black tracking-tighter">MA <span className="text-orange-500">TABLE</span></span>
          <p className="text-white/30 text-xs mt-1">Configurez votre expérience sociale</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-12">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? "bg-orange-500" : "bg-white/10"}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <h1 className="text-3xl font-black">{STEPS[currentStep].title}</h1>

            {currentStep === 0 && (
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "BUSINESS", icon: Briefcase, label: "Networking Business", desc: "Rencontrez des profils stratégiques", color: "text-blue-400", border: "border-blue-500/40", glow: "hover:shadow-blue-500/10" },
                  { id: "DATE", icon: Heart, label: "Rencontres", desc: "Brisez la glace avec élégance", color: "text-rose-400", border: "border-rose-500/40", glow: "hover:shadow-rose-500/10" },
                  { id: "FUN", icon: PartyPopper, label: "Social & Fun", desc: "Jeux, quiz et bonne humeur", color: "text-orange-400", border: "border-orange-500/40", glow: "hover:shadow-orange-500/10" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setFormData((p) => ({ ...p, mode: m.id }))}
                    className={`flex items-center gap-5 p-6 rounded-2xl border transition-all shadow-lg ${
                      formData.mode === m.id
                        ? `${m.border} bg-white/5 scale-[1.01]`
                        : "border-white/10 bg-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <m.icon className={`w-8 h-8 shrink-0 ${m.color}`} />
                    <div className="text-left">
                      <div className="text-lg font-bold">{m.label}</div>
                      <div className="text-xs text-white/40">{m.desc}</div>
                    </div>
                    {formData.mode === m.id && <Check className="ml-auto text-orange-500 shrink-0" />}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest font-bold">Votre métier / Occupation</label>
                  <input
                    value={formData.occupation}
                    onChange={(e) => setFormData((p) => ({ ...p, occupation: e.target.value }))}
                    placeholder="ex: Designer, Entrepreneur, Chef..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest font-bold">Une courte bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Dites-en un peu plus sur vous..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-orange-500 transition-all resize-none text-sm"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <p className="text-sm text-white/40 mb-4">Sélectionnez au moins 2 centres d'intérêt pour que Nova IA puisse vous matcher.</p>
                <div className="flex flex-wrap gap-3">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                        formData.interests.includes(interest)
                          ? "bg-orange-500 border-orange-500 text-white scale-105"
                          : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {formData.interests.length > 0 && (
                  <p className="mt-4 text-xs text-orange-400 font-bold">{formData.interests.length} sélectionné{formData.interests.length > 1 ? "s" : ""}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">⚠️ {error}</p>
        )}

        <div className="flex justify-between mt-10">
          <button
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-0 transition-all text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all"
            >
              Continuer <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={loading}
              className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-orange-500 disabled:bg-white/10 disabled:text-white/30 transition-all shadow-xl shadow-orange-600/20"
            >
              {loading ? "Sauvegarde…" : <><span>Lancer l'expérience</span> <Check className="w-4 h-4" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
