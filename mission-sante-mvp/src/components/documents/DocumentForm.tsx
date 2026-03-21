"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES, PUBLICS, SOURCES } from "@/lib/utils";
import { Upload, X, Loader2 } from "lucide-react";

interface DocumentFormProps {
  initialData?: {
    id?: string;
    titre: string;
    resume: string;
    type: string;
    theme: string;
    publicCible: string;
    source: string;
    confidentialite: string;
    statut: string;
    tags: string[];
    dateDocument: string;
    fileName?: string;
  };
}

export default function DocumentForm({ initialData }: DocumentFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [form, setForm] = useState({
    titre: initialData?.titre || "",
    resume: initialData?.resume || "",
    type: initialData?.type || "PDF",
    theme: initialData?.theme || THEMES[0],
    publicCible: initialData?.publicCible || PUBLICS[0],
    source: initialData?.source || "",
    confidentialite: initialData?.confidentialite || "Interne",
    statut: initialData?.statut || "Brouillon",
    dateDocument: initialData?.dateDocument?.split("T")[0] || new Date().toISOString().split("T")[0],
  });

  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let fileData = {};

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Erreur lors de l'upload");
        fileData = await uploadRes.json();
      }

      const url = isEditing ? `/api/documents/${initialData!.id}` : "/api/documents";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags, ...fileData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const { document } = await res.json();
      router.push(`/documents/${document.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Titre */}
      <div>
        <label className={labelClass}>Titre du document *</label>
        <input
          type="text"
          required
          value={form.titre}
          onChange={(e) => setForm({ ...form, titre: e.target.value })}
          className={inputClass}
          placeholder="Ex: Guide de mise en oeuvre de la telesurveillance"
        />
      </div>

      {/* Resume */}
      <div>
        <label className={labelClass}>Resume</label>
        <textarea
          rows={3}
          value={form.resume}
          onChange={(e) => setForm({ ...form, resume: e.target.value })}
          className={inputClass + " resize-none"}
          placeholder="Description courte du contenu du document..."
        />
      </div>

      {/* Grid 2 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Type de document *</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
            <option value="PDF">PDF</option>
            <option value="Word">Word</option>
            <option value="PPTX">PowerPoint</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Thematique *</label>
          <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} className={inputClass}>
            {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Public cible *</label>
          <select value={form.publicCible} onChange={(e) => setForm({ ...form, publicCible: e.target.value })} className={inputClass}>
            {PUBLICS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Source / partenaire *</label>
          <input
            type="text"
            required
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className={inputClass}
            placeholder="Ex: ARS Ile-de-France"
            list="sources-list"
          />
          <datalist id="sources-list">
            {SOURCES.map((s) => <option key={s} value={s} />)}
          </datalist>
        </div>
        <div>
          <label className={labelClass}>Confidentialite *</label>
          <select value={form.confidentialite} onChange={(e) => setForm({ ...form, confidentialite: e.target.value })} className={inputClass}>
            <option value="Public">Public</option>
            <option value="Interne">Interne</option>
            <option value="Restreint">Restreint</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Statut *</label>
          <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })} className={inputClass}>
            <option value="Brouillon">Brouillon</option>
            <option value="EnCours">En cours</option>
            <option value="Valide">Valide</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Date du document</label>
          <input
            type="date"
            value={form.dateDocument}
            onChange={(e) => setForm({ ...form, dateDocument: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className={labelClass}>Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            className={inputClass}
            placeholder="Ajouter un tag puis Entree"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200 transition font-medium"
          >
            Ajouter
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Upload */}
      <div>
        <label className={labelClass}>Fichier joint</label>
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            {file ? (
              <p className="text-sm text-slate-700 font-medium">{file.name}</p>
            ) : initialData?.fileName ? (
              <p className="text-sm text-slate-500">Fichier actuel : {initialData.fileName}</p>
            ) : (
              <p className="text-sm text-slate-400">
                Cliquez ou glissez un fichier ici<br />
                <span className="text-xs">PDF, Word, PowerPoint (max 50 MB)</span>
              </p>
            )}
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? "Enregistrer les modifications" : "Creer le document"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
