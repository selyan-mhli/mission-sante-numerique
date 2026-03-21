import Link from "next/link";
import { FolderOpen, Search, BarChart3, Shield, Sparkles, ArrowRight, FileText, Tags, Building2 } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Recherche instantanee",
    desc: "Retrouvez n'importe quel document en quelques secondes grace a la recherche plein texte et aux 6 axes de filtres combines.",
  },
  {
    icon: Tags,
    title: "Classification intelligente",
    desc: "Chaque document est indexe sur 6 axes : type, thematique, public cible, source, confidentialite et statut.",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord analytique",
    desc: "Visualisez l'etat de votre base documentaire en un coup d'oeil : KPIs, graphiques, activite recente.",
  },
  {
    icon: Sparkles,
    title: "Assistant IA integre",
    desc: "Interrogez votre corpus, generez des syntheses par thematique et obtenez de l'aide pour rediger vos contenus.",
  },
  {
    icon: Shield,
    title: "Gestion des acces",
    desc: "Trois niveaux de roles (admin, contributeur, lecteur) pour controler qui peut voir, ajouter ou modifier.",
  },
  {
    icon: FileText,
    title: "Gestion du cycle de vie",
    desc: "De la creation a la validation : suivez le statut de chaque document et maintenez votre base a jour.",
  },
];

const stats = [
  { value: "6", label: "axes de classification" },
  { value: "7", label: "thematiques sante" },
  { value: "3", label: "niveaux d'acces" },
  { value: "< 1s", label: "temps de recherche" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-bleu-profond via-bleu-fonce to-bleu-moyen text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">DocSante</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-white/80 hover:text-white transition flex items-center gap-1"
          >
            Se connecter <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              Plateforme avec assistant IA integre
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Structurez et exploitez votre base documentaire{" "}
              <span className="text-blue-300">sante numerique</span>
            </h1>
            <p className="text-lg text-blue-200/70 leading-relaxed mb-8 max-w-2xl">
              Centralisez vos documents, classez-les selon 6 axes metier, retrouvez-les instantanement
              et exploitez votre corpus grace a l'intelligence artificielle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white text-bleu-profond px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-lg shadow-black/10"
              >
                Acceder a la plateforme
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-bleu-profond">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Tout ce dont vous avez besoin pour gerer vos documents
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Une plateforme concue specifiquement pour les acteurs du numerique en sante,
            avec les outils adaptes a vos enjeux documentaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                <f.icon className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-bleu-profond to-bleu-fonce text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Pret a structurer votre base documentaire ?
          </h2>
          <p className="text-blue-200/70 text-sm mb-8 max-w-lg mx-auto">
            Commencez a centraliser, classer et exploiter vos documents des maintenant.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-bleu-profond px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition shadow-lg"
          >
            Demarrer maintenant
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FolderOpen className="w-4 h-4" />
            <span className="font-medium">DocSante</span>
            <span>— Plateforme documentaire sante numerique</span>
          </div>
          <span className="text-xs text-slate-400">Selyan Mouhali — 2026</span>
        </div>
      </div>
    </div>
  );
}
