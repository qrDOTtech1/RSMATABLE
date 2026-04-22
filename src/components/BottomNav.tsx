"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Heart, User as UserIcon, Compass } from "lucide-react";

type Item = { href: string; label: string; Icon: any; match: (p: string) => boolean };

const ITEMS: Item[] = [
  { href: "/dashboard", label: "Accueil", Icon: Home, match: (p) => p === "/dashboard" },
  { href: "/dashboard#explore", label: "Explorer", Icon: Compass, match: (p) => p.startsWith("/dashboard") && p.includes("explore") },
  { href: "/reservations", label: "Resas", Icon: Calendar, match: (p) => p.startsWith("/reservations") },
  { href: "/favoris", label: "Favoris", Icon: Heart, match: (p) => p.startsWith("/favoris") },
  { href: "/profile", label: "Profil", Icon: UserIcon, match: (p) => p.startsWith("/profile") },
];

export default function BottomNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e10]/95 backdrop-blur-xl border-t border-white/5"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="max-w-2xl mx-auto grid grid-cols-5">
        {ITEMS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                  active ? "text-orange-400" : "text-white/50 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
