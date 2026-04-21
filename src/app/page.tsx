"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, Heart, PartyPopper, ArrowRight } from "lucide-react";

export default function SocialLanding() {
  const modes = [
    { id: "BUSINESS", icon: Briefcase, label: "MaTable Business", desc: "Networking intelligent. L'IA Nova vous connecte aux profils stratégiques assis à côté de vous.", color: "from-blue-600 to-cyan-500" },
    { id: "DATE", icon: Heart, label: "MaTable Date", desc: "Brisez la glace avec élégance. L'IA suggère des icebreakers basés sur les goûts communs.", color: "from-rose-600 to-pink-500" },
    { id: "FUN", icon: PartyPopper, label: "MaTable Fun", desc: "Jeux, quiz et défis entre tables. Transformez votre attente en moment de pur plaisir.", color: "from-orange-600 to-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      {/* Glow effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center">
        <span className="text-2xl font-black tracking-tighter uppercase">
          MA <span className="text-orange-500">TABLE</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-xs text-white/30 font-mono">matable.app</span>
          <Link href="/login" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full text-sm font-bold transition-all">
            Connexion
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black leading-none tracking-tight mb-8"
          >
            LA RÉVOLUTION <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">EST À TABLE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/50 max-w-2xl mx-auto mb-12"
          >
            Ma Table transforme chaque restaurant en un réseau social vivant. 
            Utilisez la puissance de Nova IA pour rencontrer les bonnes personnes, au bon moment.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modes.map((mode) => (
            <motion.div
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <mode.icon className="w-12 h-12 mb-6 text-white group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-3">{mode.label}</h3>
              <p className="text-white/60 leading-relaxed mb-8">{mode.desc}</p>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                Découvrir <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <Link href="/login" className="inline-flex items-center gap-4 bg-orange-600 hover:bg-orange-500 text-white px-10 py-6 rounded-2xl font-black text-2xl transition-all hover:scale-105 shadow-2xl shadow-orange-600/20 cursor-pointer">
            LANCER L'EXPÉRIENCE <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-white/30 text-sm">
            Connexion Google sécurisée. Vos données sont protégées par Nova Context Engine.
          </p>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 text-sm">
          <span>© 2026 Ma Table — NovaTech OS Ecosystem</span>
          <div className="flex gap-8 font-mono text-xs">
            <span className="text-orange-500">matable.app</span>
            <a>Confidentialité</a>
            <a>IA Ethique</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
