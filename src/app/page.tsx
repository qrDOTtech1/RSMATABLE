"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, Heart, PartyPopper, ArrowRight, Star, MapPin, Users, Zap, ExternalLink } from "lucide-react";

export default function SocialLanding() {
  const modes = [
    {
      id: "BUSINESS", icon: Briefcase, label: "MaTable Business",
      desc: "Networking intelligent. L'IA Nova vous connecte aux profils stratégiques assis à côté de vous.",
      color: "from-blue-600 to-cyan-500", tag: "B2B & Pros",
    },
    {
      id: "DATE", icon: Heart, label: "MaTable Date",
      desc: "Brisez la glace avec élégance. L'IA suggère des icebreakers basés sur vos goûts communs.",
      color: "from-rose-600 to-pink-500", tag: "Rencontres",
    },
    {
      id: "FUN", icon: PartyPopper, label: "MaTable Fun",
      desc: "Jeux, quiz et défis entre tables. Transformez votre attente en moment de pur plaisir.",
      color: "from-orange-600 to-amber-500", tag: "Social",
    },
  ];

  const stats = [
    { value: "12k+", label: "Connexions créées" },
    { value: "320", label: "Restaurants partenaires" },
    { value: "4.9★", label: "Note moyenne" },
    { value: "98%", label: "Satisfait·e·s" },
  ];

  const testimonials = [
    { name: "Camille R.", role: "Designeuse, Paris", text: "J'ai rencontré mon associée autour d'un verre de Bordeaux grâce à Nova Match. Incroyable.", mode: "BUSINESS" },
    { name: "Lucas M.", role: "Dev, Lyon", text: "Le mode Fun a sauvé notre soirée d'attente. Les quiz entre tables, c'est addictif !", mode: "FUN" },
    { name: "Inès B.", role: "Chef, Bordeaux", text: "Je gère mes réservations directement depuis l'app. Mes clients adorent.", mode: "DATE" },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 overflow-x-hidden">
      {/* BG glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/8 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/8 blur-[150px] rounded-full" />
      </div>

      {/* NAV */}
      <nav className="relative z-10 px-6 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <span className="text-2xl font-black tracking-tighter uppercase">
          MA <span className="text-orange-500">TABLE</span>
          <span className="text-xs text-white/20 font-mono ml-2 normal-case">RS</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-white/20 font-mono">matable.app</span>
          <Link
            href="/login"
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full text-sm font-bold transition-all"
          >
            Connexion
          </Link>
          <Link
            href="/login"
            className="bg-orange-600 hover:bg-orange-500 px-5 py-2 rounded-full text-sm font-bold transition-all hidden sm:inline-flex items-center gap-2"
          >
            Rejoindre <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-xs font-bold text-orange-400 mb-8"
          >
            <Zap className="w-3 h-3" /> Powered by Nova IA · NovaTech OS v1.2
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-8"
          >
            LA RÉVOLUTION<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">
              EST À TABLE.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-xl text-white/50 max-w-2xl mx-auto mb-12"
          >
            Ma Table transforme chaque restaurant en un réseau social vivant.
            Rencontrez les bonnes personnes, au bon moment, dans le bon restaurant.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-2xl shadow-orange-600/25"
            >
              LANCER L'EXPÉRIENCE <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-white/30 text-xs">
              Connexion par email ou Google · Gratuit
            </p>
          </motion.div>
        </section>

        {/* STATS */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center">
                <div className="text-3xl font-black text-orange-400 mb-1">{s.value}</div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* MODES */}
        <section className="max-w-7xl mx-auto px-6 pb-28">
          <h2 className="text-3xl font-black text-center mb-3">Choisissez votre humeur</h2>
          <p className="text-center text-white/40 text-sm mb-10 max-w-xl mx-auto">
            Trois expériences distinctes, une seule app. Nova IA adapte chaque interaction à votre mode.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modes.map((mode) => (
              <Link key={mode.id} href="/login" className="block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="flex items-center justify-between mb-6">
                    <mode.icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 border border-white/10 px-2 py-1 rounded-full">{mode.tag}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{mode.label}</h3>
                  <p className="text-white/50 leading-relaxed mb-8 text-sm">{mode.desc}</p>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
                    Découvrir <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-7xl mx-auto px-6 pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6 leading-tight">
                Retrouvez vos<br /><span className="text-orange-400">restaurants favoris</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Star, title: "Vos favoris en un clic", desc: "Sauvegardez vos adresses préférées et retrouvez-les instantanément dans votre dashboard." },
                  { icon: MapPin, title: "Réservation instantanée", desc: "Réservez directement chez nos restaurants partenaires en quelques secondes, sans téléphone." },
                  { icon: Users, title: "Historique & avis", desc: "Suivez vos dernières visites, notez vos plats et partagez vos découvertes culinaires." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-1">{title}</div>
                      <div className="text-xs text-white/40 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-orange-400" />
                <span className="font-black text-lg">Nova Match</span>
                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full font-bold">IA</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Nova analyse vos centres d'intérêt, votre occupation et votre mode actif pour vous suggérer les
                connexions les plus pertinentes dans votre restaurant.
              </p>
              <div className="pt-4 space-y-2">
                {["Amateurs de vin · 3 personnes à proximité", "Entrepreneurs Tech · Table 12", "Même goût pour le Bordeaux & le Sushi"].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0 animate-pulse" />
                    <span className="text-xs text-white/60">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="max-w-7xl mx-auto px-6 pb-28">
          <h2 className="text-3xl font-black text-center mb-10">Ce qu'ils en disent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                <p className="text-white/70 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center font-black text-xs">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-white/30">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA PRO — NOUVEAU */}
        <section className="max-w-7xl mx-auto px-6 pb-28">
          <div className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-600/10 to-rose-600/5 p-10 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-orange-400 mb-3">Pour les professionnels</p>
                <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  Vous êtes un pro ?<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Devenez partenaire.</span>
                </h2>
                <p className="text-white/50 text-sm max-w-lg leading-relaxed">
                  Rejoignez le réseau Ma Table et touchez des milliers de clients connectés.
                  Gérez vos tables, vos réservations, votre menu et boostez votre visibilité grâce à Nova IA.
                </p>
                <ul className="mt-6 space-y-2">
                  {[
                    "Tableau de bord restaurateur complet",
                    "Réservations en temps réel",
                    "Visibilité auprès de notre communauté",
                    "IA Nova pour analyser vos performances",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                      <span className="text-orange-400">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center gap-4 shrink-0">
                <a
                  href="https://matable.pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-2xl shadow-orange-600/30 whitespace-nowrap"
                >
                  Devenir partenaire <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-xs text-white/20 text-center">Accès sur <span className="font-mono text-orange-400/60">matable.pro</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-6 pb-32 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Prêt à changer<br />la façon dont vous mangez ?
          </h2>
          <Link
            href="/login"
            className="inline-flex items-center gap-4 bg-orange-600 hover:bg-orange-500 text-white px-10 py-6 rounded-2xl font-black text-2xl transition-all hover:scale-105 shadow-2xl shadow-orange-600/20"
          >
            REJOINDRE MA TABLE <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-white/20 text-xs">
            Inscription par email ou Google · Gratuit · Vos données protégées par Nova Context Engine.
          </p>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <span className="text-white/20">© 2026 Ma Table · NovaTech OS Ecosystem</span>
          <div className="flex gap-8 font-mono text-xs text-white/20">
            <a className="hover:text-orange-400 transition-colors cursor-pointer">matable.app</a>
            <a href="https://matable.pro" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">matable.pro</a>
            <a href="/conf" className="hover:text-white transition-colors">Confidentialité</a>
            <a className="hover:text-white transition-colors cursor-pointer">IA Éthique</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
