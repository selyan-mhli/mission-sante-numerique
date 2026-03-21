import { prisma } from "@/lib/prisma";

export interface DocumentFilters {
  search?: string;
  theme?: string;
  type?: string;
  publicCible?: string;
  source?: string;
  confidentialite?: string;
  statut?: string;
  sort?: string;
}

export interface CreateDocumentInput {
  titre: string;
  resume?: string;
  type: string;
  theme: string;
  publicCible: string;
  source: string;
  confidentialite: string;
  statut?: string;
  tags?: string[];
  fileName?: string;
  fileSize?: number;
  filePath?: string;
  dateDocument?: string;
  createdById: string;
}

export interface UpdateDocumentInput {
  titre?: string;
  resume?: string;
  type?: string;
  theme?: string;
  publicCible?: string;
  source?: string;
  confidentialite?: string;
  statut?: string;
  tags?: string[];
  dateDocument?: string;
}

const tagsInclude = {
  tags: {
    include: { tag: true },
  },
} as const;

function buildWhereClause(filters: DocumentFilters) {
  const where: Record<string, unknown> = {};

  if (filters.search) {
    where.OR = [
      { titre: { contains: filters.search } },
      { resume: { contains: filters.search } },
      { source: { contains: filters.search } },
      { theme: { contains: filters.search } },
      { tags: { some: { tag: { name: { contains: filters.search } } } } },
    ];
  }
  if (filters.theme) where.theme = filters.theme;
  if (filters.type) where.type = filters.type;
  if (filters.publicCible) where.publicCible = filters.publicCible;
  if (filters.source) where.source = filters.source;
  if (filters.confidentialite) where.confidentialite = filters.confidentialite;
  if (filters.statut) where.statut = filters.statut;

  return where;
}

function buildOrderBy(sort?: string) {
  if (sort === "date-asc") return { dateDocument: "asc" as const };
  if (sort === "alpha") return { titre: "asc" as const };
  if (sort === "recent") return { createdAt: "desc" as const };
  return { dateDocument: "desc" as const };
}

export async function findDocuments(
  filters: DocumentFilters,
  pagination?: { page: number; limit: number }
) {
  const where = buildWhereClause(filters);
  const orderBy = buildOrderBy(filters.sort);
  const include = { createdBy: { select: { name: true } }, ...tagsInclude };

  if (pagination) {
    const { page, limit } = pagination;
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy,
        include,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.document.count({ where }),
    ]);
    return { documents, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  const documents = await prisma.document.findMany({ where, orderBy, include });
  return { documents, total: documents.length, page: 1, limit: documents.length, totalPages: 1 };
}

export async function findDocumentById(id: string) {
  return prisma.document.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true, email: true } },
      ...tagsInclude,
    },
  });
}

function buildTagsConnect(tags: string[]) {
  return {
    create: tags.map((name) => ({
      tag: {
        connectOrCreate: {
          where: { name },
          create: { name },
        },
      },
    })),
  };
}

export async function createDocument(input: CreateDocumentInput) {
  return prisma.document.create({
    data: {
      titre: input.titre,
      resume: input.resume || "",
      type: input.type,
      theme: input.theme,
      publicCible: input.publicCible,
      source: input.source,
      confidentialite: input.confidentialite,
      statut: input.statut || "Brouillon",
      fileName: input.fileName,
      fileSize: input.fileSize,
      filePath: input.filePath,
      dateDocument: input.dateDocument ? new Date(input.dateDocument) : new Date(),
      createdById: input.createdById,
      tags: input.tags?.length ? buildTagsConnect(input.tags) : undefined,
    },
    include: tagsInclude,
  });
}

export async function updateDocument(id: string, input: UpdateDocumentInput) {
  // If tags are provided, delete existing and recreate
  if (input.tags !== undefined) {
    await prisma.documentTag.deleteMany({ where: { documentId: id } });
  }

  return prisma.document.update({
    where: { id },
    data: {
      titre: input.titre,
      resume: input.resume,
      type: input.type,
      theme: input.theme,
      publicCible: input.publicCible,
      source: input.source,
      confidentialite: input.confidentialite,
      statut: input.statut,
      dateDocument: input.dateDocument ? new Date(input.dateDocument) : undefined,
      tags: input.tags?.length ? buildTagsConnect(input.tags) : undefined,
    },
    include: tagsInclude,
  });
}

export async function deleteDocument(id: string) {
  return prisma.document.delete({ where: { id } });
}

export async function countDocuments() {
  return prisma.document.count();
}

export async function getRecentDocuments(take = 5) {
  return prisma.document.findMany({
    take,
    orderBy: { createdAt: "desc" },
    select: { id: true, titre: true, type: true, theme: true, createdAt: true },
  });
}
