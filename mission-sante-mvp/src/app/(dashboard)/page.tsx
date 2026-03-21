import { getSession } from "@/lib/auth";
import { getDashboardStats } from "@/services/stats.service";
import { getRecentActivities } from "@/services/activity.service";
import { getRecentDocuments } from "@/services/document.service";
import KpiCards from "@/components/dashboard/KpiCards";
import { ThemePieChart, TypeBarChart, ConfidentialiteChart } from "@/components/dashboard/StatsCharts";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AiPanel from "@/components/ai/AiPanel";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const user = await getSession();

  const [stats, recentActivity, recentDocs] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(8),
    getRecentDocuments(5),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Bonjour, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm text-slate-500">
            Voici l'état de votre base documentaire
          </p>
        </div>
        <Link
          href="/documents/nouveau"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Nouveau document
        </Link>
      </div>

      {/* KPIs */}
      <KpiCards
        totalDocs={stats.totalDocs}
        totalThemes={stats.totalThemes}
        totalSources={stats.totalSources}
        structurationRate={stats.structurationRate}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ThemePieChart data={stats.themes} />
        <TypeBarChart data={stats.types} />
        <ConfidentialiteChart data={stats.confidentialites} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent docs */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Derniers documents</h3>
            <Link href="/documents" className="text-[11px] text-blue-500 hover:underline font-medium flex items-center gap-1">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold ${
                  doc.type === "PDF" ? "bg-red-50 text-red-600" : doc.type === "Word" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {doc.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{doc.titre}</p>
                  <p className="text-[10px] text-slate-400">{doc.theme}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="lg:col-span-1">
          <RecentActivity activities={JSON.parse(JSON.stringify(recentActivity))} />
        </div>

        {/* AI Panel */}
        <div className="lg:col-span-1">
          <AiPanel />
        </div>
      </div>
    </div>
  );
}
