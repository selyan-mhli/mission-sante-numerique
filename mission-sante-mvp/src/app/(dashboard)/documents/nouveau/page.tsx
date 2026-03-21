import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DocumentForm from "@/components/documents/DocumentForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewDocumentPage() {
  const user = await getSession();

  if (!user || user.role === "lecteur") {
    redirect("/documents");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/documents"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux documents
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-lg font-bold text-slate-800 mb-1">Nouveau document</h1>
        <p className="text-sm text-slate-500 mb-6">Ajoutez un document à la base documentaire</p>
        <DocumentForm />
      </div>
    </div>
  );
}
