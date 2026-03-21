"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

interface ChartData {
  name: string;
  count: number;
}

export function ThemePieChart({ data }: { data: ChartData[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Répartition par thématique</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
              dataKey="count"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} doc${Number(value) > 1 ? "s" : ""}`, ""]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-1.5">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-slate-600 truncate flex-1">{item.name}</span>
              <span className="font-semibold text-slate-800">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TypeBarChart({ data }: { data: ChartData[] }) {
  const typeColors: Record<string, string> = {
    PDF: "#ef4444",
    Word: "#3b82f6",
    PPTX: "#f59e0b",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Types de documents</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={50} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`${value} document${Number(value) > 1 ? "s" : ""}`, ""]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={typeColors[entry.name] || "#6b7280"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConfidentialiteChart({ data }: { data: ChartData[] }) {
  const confColors: Record<string, string> = {
    Public: "#10b981",
    Interne: "#f59e0b",
    Restreint: "#ef4444",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Niveaux de confidentialité</h3>
      <div className="space-y-3">
        {data.map((item) => {
          const total = data.reduce((s, d) => s + d.count, 0);
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">{item.name}</span>
                <span className="text-slate-400">{item.count} ({pct}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: confColors[item.name] || "#6b7280" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
