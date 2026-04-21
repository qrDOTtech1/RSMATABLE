"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Heart, PartyPopper, Zap, MessageSquare, User } from "lucide-react";
import { io, Socket } from "socket.io-client";

// Assume these are provided via context or props in a real app
const API_URL = "http://localhost:8080"; // To be updated with Railway URL

interface Person {
  id: string;
  name: string;
  image?: string;
  occupation?: string;
  interests: string[];
  activeMode: string;
  bio?: string;
  matchScore?: number;
  icebreaker?: string;
}

export default function SocialDashboard() {
  const [nearby, setNearby] = useState<Person[]>([]);
  const [activeMode, setActiveMode] = useState("BUSINESS");
  const [loading, setLoading] = useState(true);
  const [pings, setPings] = useState<any[]>([]);

  useEffect(() => {
    // 1. Load nearby people (Mocking restaurantId for now)
    const restaurantId = "demo-resto-uuid"; 
    fetch(`${API_URL}/api/social/nearby/${restaurantId}`)
      .then(res => res.json())
      .then(data => {
        setNearby(data.nearby);
        setLoading(false);
      });

    // 2. Setup Socket.io for real-time pings
    const sessionId = "current-session-id"; // Get from localStorage/Auth
    const socket: Socket = io(API_URL, { auth: { sessionId } });
    
    socket.on("social:ping", (ping) => {
      setPings(prev => [ping, ...prev]);
      // Play a subtle notification sound
      new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3").play().catch(() => {});
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black">Nova <span className="text-orange-500">Connect</span></h1>
          <p className="text-slate-500 text-sm">Session au Restaurant "Le Comptoir"</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center font-bold">
          JD
        </div>
      </header>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: "BUSINESS", icon: Briefcase, label: "Business" },
          { id: "DATE", icon: Heart, label: "Date" },
          { id: "FUN", icon: PartyPopper, label: "Fun" },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMode(m.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all shrink-0 ${
              activeMode === m.id ? "bg-white text-black border-white" : "bg-transparent text-white/50 border-white/10"
            }`}
          >
            <m.icon className="w-4 h-4" />
            <span className="text-sm font-bold">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Nearby List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Autour de vous <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-400 font-mono">{nearby.length}</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
              </div>
            ) : nearby.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <Ghost className="w-12 h-12 mx-auto mb-4 text-white/20" />
                <p className="text-slate-500">Personne n'est actif en mode {activeMode} ici.</p>
              </div>
            ) : (
              nearby.map(person => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.08] transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden">
                      {person.image ? <img src={person.image} className="w-full h-full object-cover" /> : <User className="text-white/20" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold truncate">{person.name}</h3>
                        {person.matchScore && (
                          <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 fill-current" /> {person.matchScore}% match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{person.occupation || "Épicurien"}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {person.interests.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-slate-300">#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <button className="bg-orange-600 hover:bg-orange-500 p-2.5 rounded-xl self-center transition-colors">
                      <Zap className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Real-time Notifications / Pings */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Interactions <MessageSquare className="w-5 h-5 text-blue-500" />
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {pings.map(ping => (
                <motion.div
                  key={ping.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                    {ping.senderName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{ping.senderName} vous a envoyé un Ping !</p>
                    <p className="text-xs text-slate-400 italic">"{ping.message || "Engageons la conversation..."}"</p>
                  </div>
                  <button className="text-xs font-bold text-blue-400 hover:text-blue-300">RÉPONDRE</button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {pings.length === 0 && (
              <p className="text-center py-10 text-slate-500 text-sm italic">Aucun nouveau ping pour le moment.</p>
            )}
          </div>
        </section>
      </div>

      {/* Persistent Social Bar for the main App */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold">Mode {activeMode} Actif</p>
              <p className="text-[10px] text-slate-500">Visible par 4 personnes à proximité</p>
            </div>
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
            Changer
          </button>
        </div>
      </div>
    </div>
  );
}

function Ghost(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
    </svg>
  );
}
