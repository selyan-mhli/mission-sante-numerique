"use client";

import { useState, useEffect } from "react";
import { ThemePieChart, TypeBarChart, ConfidentialiteChart } from "@/components/dashboard/StatsCharts";
import RecentActivity from "@/components/dashboard/RecentActivity";
import KpiCards from "@/components/dashboard/KpiCards";

export default function StatistiquesPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-6">Statistiques</h1>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
              <div className="h-8 bg-slate-100 rounded w-1/2 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Statistiques</h1>
        <p className="text-sm text-slate-500">Vue d'ensemble de votre base documentaire</p>
      </div>

      <KpiCards
        totalDocs={stats.totalDocs}
        totalThemes={stats.totalThemes}
        totalSources={stats.totalSources}
        structurationRate={stats.structurationRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ThemePieChart data={stats.themes} />
        <TypeBarChart data={stats.types} />
        <ConfidentialiteChart data={stats.confidentialites} />
      </div>

      {/* Statuts breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Répartition par statut</h3>
          <div className="space-y-3">
            {stats.statuts.map((s: any) => {
              const total = stats.totalDocs;
              const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
              const colors: Record<string, string> = { Valide: "#10b981", EnCours: "#3b82f6", Brouillon: "#94a3b8" };
              const labels: Record<string, string> = { Valide: "Validé", EnCours: "En cours", Brouillon: "Brouillon" };
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">{labels[s.name] || s.name}</span>
                    <span className="text-slate-400">{s.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${pct}%`, backgroundColor: colors[s.name] || "#6b7280" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <RecentActivity activities={stats.recentActivity} />
      </div>

      {/* Sources table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Documents par source</h3>
        <div className="overflow-hidden rounded-lg border border-slate-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Source</th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Documents</th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-slate-500">Part</th>
              </tr>
            </thead>
            <tbody>
              {stats.sources.map((s: any) => (
                <tr key={s.name} className="border-t border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 text-slate-700 font-medium text-xs">{s.name}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600 text-xs">{s.count}</td>
                  <td className="px-4 py-2.5 text-right text-slate-400 text-xs">
                    {stats.totalDocs > 0 ? Math.round((s.count / stats.totalDocs) * 100) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
