"use client";

import { useState, useEffect, useCallback } from "react";
import DocumentCard from "@/components/documents/DocumentCard";
import FiltersSidebar from "@/components/documents/FiltersSidebar";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface FiltersState {
  type: string[];
  theme: string[];
  publicCible: string[];
  source: string[];
  confidentialite: string[];
  statut: string[];
}

const emptyFilters: FiltersState = {
  type: [],
  theme: [],
  publicCible: [],
  source: [],
  confidentialite: [],
  statut: [],
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");
  const [filters, setFilters] = useState<FiltersState>(emptyFilters);
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (filters.type.length === 1) params.set("type", filters.type[0]);
    if (filters.theme.length === 1) params.set("theme", filters.theme[0]);
    if (filters.publicCible.length === 1) params.set("publicCible", filters.publicCible[0]);
    if (filters.source.length === 1) params.set("source", filters.source[0]);
    if (filters.confidentialite.length === 1) params.set("confidentialite", filters.confidentialite[0]);
    if (filters.statut.length === 1) params.set("statut", filters.statut[0]);

    const res = await fetch(`/api/documents?${params.toString()}`);
    const data = await res.json();

    let filtered = data.documents || [];
    if (filters.type.length > 1) filtered = filtered.filter((d: any) => filters.type.includes(d.type));
    if (filters.theme.length > 1) filtered = filtered.filter((d: any) => filters.theme.includes(d.theme));
    if (filters.publicCible.length > 1) filtered = filtered.filter((d: any) => filters.publicCible.includes(d.publicCible));
    if (filters.source.length > 1) filtered = filtered.filter((d: any) => filters.source.includes(d.source));
    if (filters.confidentialite.length > 1) filtered = filtered.filter((d: any) => filters.confidentialite.includes(d.confidentialite));
    if (filters.statut.length > 1) filtered = filtered.filter((d: any) => filters.statut.includes(d.statut));

    setDocs(filtered);
    setTotal(data.total || filtered.length);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [search, sort, filters, page]);

  useEffect(() => {
    const timeout = setTimeout(fetchDocs, 200);
    return () => clearTimeout(timeout);
  }, [fetchDocs]);

  // Reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [search, sort, filters]);

  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  const handleExportCSV = () => {
    const headers = ["Titre", "Type", "Thematique", "Source", "Public cible", "Confidentialite", "Statut", "Date", "Tags"];
    const rows = docs.map((d: any) => [
      d.titre,
      d.type,
      d.theme,
      d.source,
      d.publicCible,
      d.confidentialite,
      d.statut,
      d.dateDocument?.split("T")[0] || "",
      (d.tags || []).map((t: any) => t.tag?.name || t).join("; "),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c: string) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documents-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Documents</h1>
          <p className="text-sm text-slate-500">Explorez et gerez votre base documentaire</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={docs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un document, un theme, un protocole..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition ${
            showFilters ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="date-desc">Plus recents</option>
          <option value="date-asc">Plus anciens</option>
          <option value="alpha">Alphabetique</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex gap-4">
        {showFilters && (
          <div className="w-60 flex-shrink-0 rounded-xl overflow-hidden border border-slate-200">
            <FiltersSidebar filters={filters} onFilterChange={setFilters} />
          </div>
        )}

        <div className="flex-1">
          <div className="text-xs text-slate-500 mb-3">
            <strong className="text-slate-700">{total}</strong> document{total !== 1 ? "s" : ""}
            {totalPages > 1 && <span className="text-slate-400"> — page {page}/{totalPages}</span>}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : docs.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Aucun document trouve</p>
              <p className="text-xs text-slate-400 mt-1">Essayez de modifier vos criteres de recherche</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {docs.map((doc, i) => (
                  <DocumentCard key={doc.id} doc={doc} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Precedent
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                        p === page
                          ? "bg-blue-500 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-40"
                  >
                    Suivant
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
