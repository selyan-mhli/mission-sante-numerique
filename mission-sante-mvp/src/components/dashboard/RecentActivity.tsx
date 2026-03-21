"use client";

import { formatDate } from "@/lib/utils";
import { FilePlus, FileEdit, Trash2, Eye, Download } from "lucide-react";

interface Activity {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  user: { name: string } | null;
  document: { titre: string } | null;
}

const actionIcons: Record<string, { icon: typeof FilePlus; color: string; bg: string }> = {
  create: { icon: FilePlus, color: "text-emerald-600", bg: "bg-emerald-50" },
  update: { icon: FileEdit, color: "text-blue-600", bg: "bg-blue-50" },
  delete: { icon: Trash2, color: "text-red-600", bg: "bg-red-50" },
  view: { icon: Eye, color: "text-slate-600", bg: "bg-slate-50" },
  download: { icon: Download, color: "text-violet-600", bg: "bg-violet-50" },
};

export default function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Activité récente</h3>
      {activities.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">Aucune activité récente</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const config = actionIcons[activity.action] || actionIcons.view;
            const Icon = config.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                    {activity.details || `Action: ${activity.action}`}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400">
                      {activity.user?.name || "Système"}
                    </span>
                    <span className="text-[10px] text-slate-300">·</span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(activity.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
