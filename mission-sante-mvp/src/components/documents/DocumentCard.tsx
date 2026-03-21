"use client";

import Link from "next/link";
import { FileText, FileSpreadsheet, Presentation, Calendar, Building2 } from "lucide-react";
import { cn, formatDate, getTypeColor, getConfidentialiteColor, getStatutLabel, getStatutColor } from "@/lib/utils";

interface Doc {
  id: string;
  titre: string;
  resume: string | null;
  type: string;
  theme: string;
  source: string;
  confidentialite: string;
  statut: string;
  tags: { tag: { name: string } }[];
  dateDocument: string;
  createdBy?: { name: string } | null;
}

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  Word: FileSpreadsheet,
  PPTX: Presentation,
};

export default function DocumentCard({ doc, index = 0 }: { doc: Doc; index?: number }) {
  const colors = getTypeColor(doc.type);
  const Icon = typeIcons[doc.type] || FileText;
  const tagNames = doc.tags.map((t) => t.tag.name);

  return (
    <Link
      href={`/documents/${doc.id}`}
      className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all hover:-translate-y-0.5 block relative overflow-hidden animate-fade-in-up opacity-0"
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "forwards" }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-4 right-4 h-[3px] rounded-b opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: colors.accent }}
      />

      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="text-sm font-semibold text-bleu-profond leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {doc.titre}
        </h3>
        <div className={cn("w-9 h-9 rounded-lg flex flex-col items-center justify-center flex-shrink-0", colors.bg)}>
          <Icon className={cn("w-4 h-4", colors.text)} />
          <span className={cn("text-[8px] font-bold uppercase mt-0.5", colors.text)}>{doc.type}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mb-2.5">
        <span>{doc.theme}</span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 opacity-50" />
          {formatDate(doc.dateDocument)}
        </span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span className="flex items-center gap-1">
          <Building2 className="w-3 h-3 opacity-50" />
          {doc.source}
        </span>
      </div>

      {doc.resume && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {doc.resume}
        </p>
      )}

      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-wrap gap-1 flex-1 overflow-hidden max-h-6">
          {tagNames.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-medium">
              {tag}
            </span>
          ))}
          {tagNames.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 text-slate-400">+{tagNames.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold border", getConfidentialiteColor(doc.confidentialite))}>
            {doc.confidentialite}
          </span>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold", getStatutColor(doc.statut))}>
            {getStatutLabel(doc.statut)}
          </span>
        </div>
      </div>
    </Link>
  );
}
