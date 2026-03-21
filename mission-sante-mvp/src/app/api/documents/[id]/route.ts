import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findDocumentById, updateDocument, deleteDocument } from "@/services/document.service";
import { logActivity } from "@/services/activity.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const document = await findDocumentById(id);

  if (!document) {
    return NextResponse.json({ error: "Document non trouvé" }, { status: 404 });
  }

  return NextResponse.json({ document });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user || user.role === "lecteur") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();

  const document = await updateDocument(id, data);

  await logActivity({
    action: "update",
    details: `Document "${document.titre}" modifié`,
    userId: user.id,
    documentId: document.id,
  });

  return NextResponse.json({ document });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { id } = await params;
  const document = await findDocumentById(id);

  if (document) {
    await logActivity({
      action: "delete",
      details: `Document "${document.titre}" supprimé`,
      userId: user.id,
    });
    await deleteDocument(id);
  }

  return NextResponse.json({ ok: true });
}
