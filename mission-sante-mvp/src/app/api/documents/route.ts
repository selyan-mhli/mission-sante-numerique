import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findDocuments, createDocument } from "@/services/document.service";
import { logActivity } from "@/services/activity.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const result = await findDocuments(
    {
      search: searchParams.get("search") || undefined,
      theme: searchParams.get("theme") || undefined,
      type: searchParams.get("type") || undefined,
      publicCible: searchParams.get("publicCible") || undefined,
      source: searchParams.get("source") || undefined,
      confidentialite: searchParams.get("confidentialite") || undefined,
      statut: searchParams.get("statut") || undefined,
      sort: searchParams.get("sort") || undefined,
    },
    { page, limit }
  );

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role === "lecteur") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const data = await req.json();

  const tags = Array.isArray(data.tags) ? data.tags : [];
  const document = await createDocument({
    ...data,
    tags,
    createdById: user.id,
  });

  await logActivity({
    action: "create",
    details: `Document "${document.titre}" ajouté`,
    userId: user.id,
    documentId: document.id,
  });

  return NextResponse.json({ document }, { status: 201 });
}
