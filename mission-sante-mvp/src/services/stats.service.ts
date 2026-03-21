import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    totalDocs,
    themes,
    sources,
    types,
    confidentialites,
    statuts,
  ] = await Promise.all([
    prisma.document.count(),
    prisma.document.groupBy({ by: ["theme"], _count: true, orderBy: { _count: { theme: "desc" } } }),
    prisma.document.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } } }),
    prisma.document.groupBy({ by: ["type"], _count: true }),
    prisma.document.groupBy({ by: ["confidentialite"], _count: true }),
    prisma.document.groupBy({ by: ["statut"], _count: true }),
  ]);

  const validatedCount = statuts.find(s => s.statut === "Valide")?._count ?? 0;
  const structurationRate = totalDocs > 0 ? Math.round((validatedCount / totalDocs) * 100) : 0;

  return {
    totalDocs,
    totalThemes: themes.length,
    totalSources: sources.length,
    structurationRate,
    themes: themes.map(t => ({ name: t.theme, count: t._count })),
    sources: sources.map(s => ({ name: s.source, count: s._count })),
    types: types.map(t => ({ name: t.type, count: t._count })),
    confidentialites: confidentialites.map(c => ({ name: c.confidentialite, count: c._count })),
    statuts: statuts.map(s => ({ name: s.statut, count: s._count })),
  };
}
