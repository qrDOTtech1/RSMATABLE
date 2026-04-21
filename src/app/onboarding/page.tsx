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

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    mode: "FUN",
    occupation: "",
    bio: "",
    interests: [] as string[],
  });
  const router = useRouter();

  const next = () => currentStep < STEPS.length - 1 && setCurrentStep(c => c + 1);
  const prev = () => currentStep > 0 && setCurrentStep(c => c - 1);

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const finish = async () => {
    // In a real scenario, we would call an API action here
    console.log("Saving onboarding data:", formData);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Progress bar */}
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
            className="space-y-8"
          >
            <h1 className="text-3xl font-black">{STEPS[currentStep].title}</h1>

            {currentStep === 0 && (
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "BUSINESS", icon: Briefcase, label: "Networking Business", color: "text-blue-400", border: "border-blue-500/30" },
                  { id: "DATE", icon: Heart, label: "Rencontres (Date)", color: "text-rose-400", border: "border-rose-500/30" },
                  { id: "FUN", icon: PartyPopper, label: "Social & Fun", color: "text-orange-400", border: "border-orange-500/30" },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setFormData(p => ({ ...p, mode: m.id }))}
                    className={`flex items-center gap-4 p-6 rounded-2xl border transition-all ${
                      formData.mode === m.id ? m.border + " bg-white/5" : "border-white/10 bg-transparent opacity-50"
                    }`}
                  >
                    <m.icon className={`w-8 h-8 ${m.color}`} />
                    <span className="text-xl font-bold">{m.label}</span>
                    {formData.mode === m.id && <Check className="ml-auto text-orange-500" />}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-white/50 mb-2 uppercase tracking-widest font-bold">Votre métier / Occupation</label>
                  <input 
                    value={formData.occupation}
                    onChange={e => setFormData(p => ({ ...p, occupation: e.target.value }))}
                    placeholder="ex: Designer, Entrepreneur, Chef..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-2 uppercase tracking-widest font-bold">Une courte bio</label>
                  <textarea 
                    value={formData.bio}
                    onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Dites-en un peu plus sur vous..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-wrap gap-3">
                {["Tech", "Gastronomie", "Sport", "Voyages", "Cinéma", "Musique", "IA", "Vin", "Gaming", "Lecture", "Design", "Finance"].map(interest => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      formData.interests.includes(interest) ? "bg-orange-500 border-orange-500 text-white" : "border-white/10 text-white/50"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12">
          <button 
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-0 transition-all"
          >
            <ChevronLeft /> Retour
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button 
              onClick={next}
              className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all"
            >
              Continuer <ChevronRight />
            </button>
          ) : (
            <button 
              onClick={finish}
              className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/20"
            >
              Terminer <Check />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
