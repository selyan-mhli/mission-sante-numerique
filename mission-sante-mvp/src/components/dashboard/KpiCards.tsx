"use client";

import { useEffect, useRef } from "react";
import { FileText, Tags, Building2, ShieldCheck } from "lucide-react";

interface KpiCardsProps {
  totalDocs: number;
  totalThemes: number;
  totalSources: number;
  structurationRate: number;
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const duration = 1200;
    const start = performance.now();

    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el!.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }, [target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const kpis = [
  { key: "totalDocs", label: "Documents référencés", icon: FileText, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", textColor: "text-blue-600" },
  { key: "totalThemes", label: "Thématiques couvertes", icon: Tags, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", textColor: "text-emerald-600" },
  { key: "totalSources", label: "Sources & partenaires", icon: Building2, color: "from-amber-500 to-amber-600", bg: "bg-amber-50", textColor: "text-amber-600" },
  { key: "structurationRate", label: "Taux de structuration", icon: ShieldCheck, color: "from-violet-500 to-violet-600", bg: "bg-violet-50", textColor: "text-violet-600", suffix: "%" },
];

export default function KpiCards({ totalDocs, totalThemes, totalSources, structurationRate }: KpiCardsProps) {
  const values: Record<string, number> = { totalDocs, totalThemes, totalSources, structurationRate };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div
          key={kpi.key}
          className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 animate-fade-in-up opacity-0"
          style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center`}>
              <kpi.icon className={`w-6 h-6 ${kpi.textColor}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 tracking-tight">
                <AnimatedCounter target={values[kpi.key]} suffix={kpi.suffix} />
              </div>
              <div className="text-xs text-slate-500 font-medium">{kpi.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
