import { notFound } from "next/navigation";
import Link from "next/link";
import { findDocumentById } from "@/services/document.service";
import { getSession } from "@/lib/auth";
import { formatDate, getTypeColor, getConfidentialiteColor, getStatutColor, getStatutLabel } from "@/lib/utils";
import { ArrowLeft, Edit, Trash2, FileText, Calendar, Building2, Users, Lock, CheckCircle, Tag, Download, User } from "lucide-react";
import DeleteButton from "./DeleteButton";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSession();

  const document = await findDocumentById(id);

  if (!document) notFound();

  const colors = getTypeColor(document.type);
  const tags = document.tags.map((t) => t.tag.name);
  const canEdit = user && (user.role === "admin" || user.role === "contributeur");
  const canDelete = user && user.role === "admin";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href="/documents"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux documents
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        {/* Top accent bar */}
        <div className="h-1.5" style={{ backgroundColor: colors.accent }} />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className={`w-14 h-14 rounded-xl ${colors.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                <FileText className={`w-6 h-6 ${colors.text}`} />
                <span className={`text-[9px] font-bold uppercase mt-0.5 ${colors.text}`}>{document.type}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-snug mb-2">
                  {document.titre}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${getConfidentialiteColor(document.confidentialite)}`}>
                    {document.confidentialite}
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${getStatutColor(document.statut)}`}>
                    {getStatutLabel(document.statut)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {document.filePath && (
                <a
                  href={document.filePath}
                  download
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger
                </a>
              )}
              {canEdit && (
                <Link
                  href={`/documents/${document.id}/edit`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Modifier
                </Link>
              )}
              {canDelete && <DeleteButton id={document.id} />}
            </div>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Thématique", value: document.theme, icon: Tag },
              { label: "Date", value: formatDate(document.dateDocument), icon: Calendar },
              { label: "Source", value: document.source, icon: Building2 },
              { label: "Public cible", value: document.publicCible, icon: Users },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <item.icon className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{item.label}</span>
                </div>
                <p className="text-sm text-slate-700 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resume */}
      {document.resume && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Résumé</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{document.resume}</p>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Meta info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Informations</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          {document.createdBy && (
            <div>
              <span className="text-slate-400">Ajouté par</span>
              <p className="text-slate-700 font-medium flex items-center gap-1 mt-0.5">
                <User className="w-3 h-3" />
                {document.createdBy.name}
              </p>
            </div>
          )}
          <div>
            <span className="text-slate-400">Date d'ajout</span>
            <p className="text-slate-700 font-medium mt-0.5">{formatDate(document.createdAt)}</p>
          </div>
          {document.fileName && (
            <div>
              <span className="text-slate-400">Fichier</span>
              <p className="text-slate-700 font-medium mt-0.5">{document.fileName}</p>
            </div>
          )}
          {document.fileSize && (
            <div>
              <span className="text-slate-400">Taille</span>
              <p className="text-slate-700 font-medium mt-0.5">{(document.fileSize / 1024).toFixed(1)} KB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
