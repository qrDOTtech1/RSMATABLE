import { prisma } from "@/lib/db";

// Force le rendu dynamique pour avoir les dernières données
export const dynamic = "force-dynamic";

export default async function SocialDashboard() {
  // Récupération des restaurants partenaires avec leurs notes moyennes
  const restaurants = await prisma.restaurant.findMany({
    include: {
      dishReviews: true,
    },
    take: 20,
  });

  // Simulation d'un flux d'avis récents sur la plateforme
  const recentReviews = await prisma.dishReview.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      restaurant: true,
      menuItem: true,
    }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 pb-32 selection:bg-orange-500/30 font-sans">
      {/* Sidebar Simulée (Style Spotify) */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-white/5 hidden lg:flex flex-col p-6 space-y-8">
        <div className="text-xl font-black tracking-tighter">MA <span className="text-orange-500">TABLE</span></div>
        <nav className="space-y-4">
          <NavItem icon="🏠" label="Accueil" active />
          <NavItem icon="🔍" label="Rechercher" />
          <NavItem icon="🧭" label="Découvrir" />
          <NavItem icon="✨" label="Nova Connect" />
        </nav>
        <div className="pt-8">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Vos Favoris</p>
          <div className="space-y-3">
             <div className="text-sm text-white/60 hover:text-white cursor-pointer">Le Bistro du Coin</div>
             <div className="text-sm text-white/60 hover:text-white cursor-pointer">Sushi Master</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 max-w-7xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <header className="relative h-64 rounded-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-rose-600 opacity-80 group-hover:scale-105 transition-transform duration-700" />
          <div className="relative z-10 p-10 h-full flex flex-col justify-end">
            <h1 className="text-5xl font-black tracking-tight mb-2">VOTRE FLOW CULINAIRE.</h1>
            <p className="text-white/80 font-medium">L'IA Nova a sélectionné les meilleures tables pour votre humeur actuelle.</p>
          </div>
        </header>

        {/* Restaurants Grid (Style Spotify Albums) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Nos Partenaires <span className="text-orange-500">Premium</span></h2>
            <button className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors">Tout afficher</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </section>

        {/* Flux d'avis (Activity Stream) */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight italic text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">L'Actu des Assiettes.</h2>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          </div>

          {/* Sidebar Droite - Matching IA */}
          <div className="space-y-8">
             <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-orange-500">✨</span> Nova Match
                </h3>
                <p className="text-sm text-white/40 mb-6">3 personnes partagent vos goûts pour le <span className="text-white">Bordeaux</span> à proximité.</p>
                <button className="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-600/20">
                  Lancer Nova Connect
                </button>
             </div>
          </div>
        </section>
      </main>

      {/* "Now Playing" Bar (Social Footer) */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#121212]/90 backdrop-blur-xl border-t border-white/5 z-50 px-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center text-2xl shadow-lg">🍕</div>
            <div className="hidden sm:block">
              <div className="font-bold text-sm">Pizza Margherita</div>
              <div className="text-xs text-white/40">Mamma Mia Restaurant</div>
            </div>
         </div>
         
         <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="flex items-center justify-center gap-6 mb-2">
               <span className="text-white/40 hover:text-white cursor-pointer transition-colors">⏮️</span>
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-xs font-black cursor-pointer hover:scale-105 transition-transform">GO</div>
               <span className="text-white/40 hover:text-white cursor-pointer transition-colors">⏭️</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-orange-500 w-1/3" />
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button className="p-2 text-white/40 hover:text-white transition-colors">💬</button>
            <button className="p-2 text-white/40 hover:text-white transition-colors">⚙️</button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 p-[2px]">
               <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[10px] font-bold">ME</div>
            </div>
         </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 cursor-pointer transition-all ${active ? "text-white" : "text-white/40 hover:text-white"}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: any }) {
  const avgRating = restaurant.dishReviews.length > 0 
    ? (restaurant.dishReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / restaurant.dishReviews.length).toFixed(1)
    : "—";

  return (
    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-all group cursor-pointer">
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center text-4xl shadow-2xl">
        {restaurant.logoUrl ? <img src={restaurant.logoUrl} className="w-full h-full object-cover" /> : "🍽️"}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl shadow-xl scale-90 group-hover:scale-100 transition-transform">
             ✨
           </div>
        </div>
      </div>
      <h3 className="font-bold truncate text-sm mb-1">{restaurant.name}</h3>
      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest flex items-center gap-2">
        ⭐ {avgRating} • {restaurant.city || "France"}
      </p>
    </div>
  );
}

function ReviewItem({ review }: { review: any }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex gap-4 hover:bg-white/[0.04] transition-all">
      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs shrink-0">
        {review.name?.[0] || "U"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-white/90">
            <span className="text-orange-500">@user</span> a adoré le <span className="italic">{review.menuItem.name}</span>
          </p>
          <span className="text-[10px] text-white/20">{new Date(review.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-3">"{review.comment || "Pas de commentaire, juste du plaisir."}"</p>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white/5 rounded flex items-center justify-center text-[10px]">🏠</div>
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">{review.restaurant.name}</span>
        </div>
      </div>
    </div>
  );
}
