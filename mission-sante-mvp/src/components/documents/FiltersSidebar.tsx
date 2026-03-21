"use client";

import { cn, THEMES, PUBLICS, SOURCES } from "@/lib/utils";
import { FileText, Tags, Users, Building2, Lock, CheckCircle } from "lucide-react";

interface FiltersState {
  type: string[];
  theme: string[];
  publicCible: string[];
  source: string[];
  confidentialite: string[];
  statut: string[];
}

interface FiltersSidebarProps {
  filters: FiltersState;
  onFilterChange: (filters: FiltersState) => void;
  counts?: Record<string, Record<string, number>>;
}

function FilterGroup({
  label,
  icon: Icon,
  options,
  selected,
  onChange,
  counts,
}: {
  label: string;
  icon: typeof FileText;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  counts?: Record<string, number>;
}) {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="pb-4 mb-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[11px] font-semibold text-slate-700">{label}</span>
      </div>
      <div className="space-y-0.5">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 px-1 py-1 rounded cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
              className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 flex-1 truncate">{option}</span>
            {counts?.[option] !== undefined && (
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full font-medium">
                {counts[option]}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function FiltersSidebar({ filters, onFilterChange, counts }: FiltersSidebarProps) {
  const hasFilters = Object.values(filters).some((arr) => arr.length > 0);

  const updateFilter = (key: keyof FiltersState) => (values: string[]) => {
    onFilterChange({ ...filters, [key]: values });
  };

  const clearAll = () => {
    onFilterChange({
      type: [],
      theme: [],
      publicCible: [],
      source: [],
      confidentialite: [],
      statut: [],
    });
  };

  return (
    <div className="bg-white border-r border-slate-200 p-4 overflow-y-auto h-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Filtres</span>
        {hasFilters && (
          <button onClick={clearAll} className="text-[11px] text-blue-500 hover:underline font-medium">
            Réinitialiser
          </button>
        )}
      </div>

      <FilterGroup
        label="Type de document"
        icon={FileText}
        options={["PDF", "Word", "PPTX"]}
        selected={filters.type}
        onChange={updateFilter("type")}
        counts={counts?.type}
      />
      <FilterGroup
        label="Thématique"
        icon={Tags}
        options={THEMES}
        selected={filters.theme}
        onChange={updateFilter("theme")}
        counts={counts?.theme}
      />
      <FilterGroup
        label="Public cible"
        icon={Users}
        options={PUBLICS}
        selected={filters.publicCible}
        onChange={updateFilter("publicCible")}
        counts={counts?.publicCible}
      />
      <FilterGroup
        label="Source / partenaire"
        icon={Building2}
        options={SOURCES}
        selected={filters.source}
        onChange={updateFilter("source")}
        counts={counts?.source}
      />
      <FilterGroup
        label="Confidentialité"
        icon={Lock}
        options={["Public", "Interne", "Restreint"]}
        selected={filters.confidentialite}
        onChange={updateFilter("confidentialite")}
        counts={counts?.confidentialite}
      />
      <FilterGroup
        label="Statut"
        icon={CheckCircle}
        options={["Valide", "EnCours", "Brouillon"]}
        selected={filters.statut}
        onChange={updateFilter("statut")}
        counts={counts?.statut}
      />
    </div>
  );
}
