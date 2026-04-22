"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithGoogle } from "@/lib/auth-actions";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";

type Tab = "login" | "register";

const GOOGLE_SVG = (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (params.get("verified") === "1") {
      setMessage({ type: "success", text: "Email confirmé ! Vous pouvez maintenant vous connecter." });
    }
    if (params.get("error") === "expired-token") {
      setMessage({ type: "error", text: "Ce lien de vérification a expiré. Créez un nouveau compte." });
    }
    if (params.get("error") === "invalid-token") {
      setMessage({ type: "error", text: "Lien invalide. Vérifiez votre email ou réinscrivez-vous." });
    }
    if (params.get("error") === "session-expired") {
      setMessage({ type: "error", text: "Session expirée. Reconnectez-vous." });
    }
  }, [params]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setLoading(true);
    setMessage(null);
    const res = await signIn("credentials", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setMessage({ type: "error", text: "Email ou mot de passe incorrect. Si vous venez de créer votre compte, vérifiez votre email ou réessayez." });
    } else {
      router.push("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword, name: regName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Erreur lors de l'inscription." });
      } else {
        setRegistered(true);
      }
    } catch {
      setMessage({ type: "error", text: "Erreur réseau. Réessayez." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-orange-500/30">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/15 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase mb-1">Ma <span className="text-orange-500">Table</span> RS</h1>
          <p className="text-white/40 text-sm">Le Réseau Social Culinaire</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">

          {/* TABS */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setMessage(null); setRegistered(false); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  tab === t ? "bg-orange-600 text-white shadow" : "text-white/40 hover:text-white"
                }`}
              >
                {t === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {/* Global message */}
          {message && (
            <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {message.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : "⚠️"}
              {message.text}
            </div>
          )}

          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.div key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email" required autoComplete="email"
                      placeholder="Votre email"
                      value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm focus:border-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"} required autoComplete="current-password"
                      placeholder="Mot de passe"
                      value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-11 text-sm focus:border-orange-500 outline-none transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
                    {loading ? "Connexion…" : <><span>Se connecter</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <div className="relative flex items-center py-6">
                  <div className="flex-grow border-t border-white/10" />
                  <span className="flex-shrink mx-4 text-white/20 text-[10px] uppercase font-bold tracking-widest">ou</span>
                  <div className="flex-grow border-t border-white/10" />
                </div>

                <button onClick={() => loginWithGoogle()}
                  className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-orange-500 hover:text-white font-bold py-4 rounded-2xl transition-all shadow-lg">
                  {GOOGLE_SVG} Continuer avec Google
                </button>
              </motion.div>
            ) : (
              <motion.div key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {registered ? (
                  <div className="text-center space-y-4 py-4">
                    <CheckCircle className="w-14 h-14 text-orange-400 mx-auto" />
                    <h2 className="text-xl font-black">Vérifiez votre email !</h2>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Un email de confirmation a été envoyé à <strong className="text-white">{regEmail}</strong>.
                      <br /><br />
                      Cliquez sur le lien pour activer votre compte. Le lien est valide <strong>24 heures</strong>.
                    </p>
                    <button onClick={() => { setTab("login"); setRegistered(false); }}
                      className="text-orange-400 text-sm font-bold hover:text-orange-300 transition-colors">
                      ← Retour à la connexion
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text" autoComplete="name"
                        placeholder="Votre prénom (optionnel)"
                        value={regName} onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm focus:border-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="email" required autoComplete="email"
                        placeholder="Votre email"
                        value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm focus:border-orange-500 outline-none transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type={showPassword ? "text" : "password"} required autoComplete="new-password"
                        placeholder="Mot de passe (min. 6 caractères)"
                        value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-11 text-sm focus:border-orange-500 outline-none transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-white/10 disabled:text-white/30 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
                      {loading ? "Création du compte…" : <><span>Créer mon compte</span><ArrowRight className="w-4 h-4" /></>}
                    </button>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-white/10" />
                      <span className="flex-shrink mx-4 text-white/20 text-[10px] uppercase font-bold tracking-widest">ou</span>
                      <div className="flex-grow border-t border-white/10" />
                    </div>

                    <button type="button" onClick={() => loginWithGoogle()}
                      className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-orange-500 hover:text-white font-bold py-4 rounded-2xl transition-all shadow-lg">
                      {GOOGLE_SVG} S'inscrire avec Google
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-[10px] text-white/20 leading-relaxed">
            En continuant, vous rejoignez l'écosystème NovaTech OS.<br />
            Vos données sont protégées par Nova Context Engine.
          </p>
        </div>

        <button onClick={() => router.push("/")}
          className="mt-6 mx-auto block text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
          ← Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
