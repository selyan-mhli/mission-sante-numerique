import { notFound } from "next/navigation";
import { findDocumentById } from "@/services/document.service";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DocumentForm from "@/components/documents/DocumentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSession();

  if (!user || user.role === "lecteur") {
    redirect("/documents");
  }

  const document = await findDocumentById(id);
  if (!document) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/documents/${document.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au document
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-lg font-bold text-slate-800 mb-6">Modifier le document</h1>
        <DocumentForm
          initialData={{
            id: document.id,
            titre: document.titre,
            resume: document.resume || "",
            type: document.type,
            theme: document.theme,
            publicCible: document.publicCible,
            source: document.source,
            confidentialite: document.confidentialite,
            statut: document.statut,
            tags: document.tags.map((t) => t.tag.name),
            dateDocument: document.dateDocument.toISOString(),
            fileName: document.fileName || undefined,
          }}
        />
      </div>
    </div>
  );
}
