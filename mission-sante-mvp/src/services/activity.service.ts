import { prisma } from "@/lib/prisma";

export interface CreateActivityInput {
  action: string;
  details: string;
  userId: string;
  documentId?: string;
}

export async function logActivity(input: CreateActivityInput) {
  return prisma.activity.create({
    data: {
      action: input.action,
      details: input.details,
      userId: input.userId,
      documentId: input.documentId,
    },
  });
}

export async function getRecentActivities(take = 8) {
  return prisma.activity.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      document: { select: { titre: true } },
    },
  });
}
