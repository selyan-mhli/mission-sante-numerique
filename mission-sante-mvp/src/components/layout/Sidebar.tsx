"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Plus,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  FolderOpen,
  Shield,
} from "lucide-react";

const navigation = [
  { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Nouveau document", href: "/documents/nouveau", icon: Plus },
  { name: "Assistant IA", href: "/assistant", icon: Sparkles },
];

const secondaryNav = [
  { name: "Statistiques", href: "/statistiques", icon: BarChart3 },
];

export default function Sidebar({ user }: { user: { name: string; email: string; role: string } | null }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-bleu-profond to-bleu-fonce text-white flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Base documentaire</h1>
            <p className="text-[11px] text-white/50">Santé numérique</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold px-3 py-2">
          Principal
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all",
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.name}
              {item.name === "Assistant IA" && (
                <span className="ml-auto text-[9px] font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-white px-1.5 py-0.5 rounded-full">
                  BETA
                </span>
              )}
            </Link>
          );
        })}

        <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold px-3 py-2 mt-4">
          Analyse
        </div>
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all",
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      {user && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[11px] font-bold">
              {user.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {user.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
