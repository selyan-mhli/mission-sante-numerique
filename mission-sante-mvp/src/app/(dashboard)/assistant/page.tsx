import AiPanel from "@/components/ai/AiPanel";
import { Sparkles, Search, FileEdit, BarChart3, Brain, Zap, BookOpen } from "lucide-react";

export default function AssistantPage() {
  const features = [
    { icon: Search, title: "Recherche sémantique", desc: "Trouvez les documents par le sens, pas seulement par mots-clés." },
    { icon: FileEdit, title: "Aide à la rédaction", desc: "Rédigez des articles structurés à partir du corpus existant." },
    { icon: BarChart3, title: "Synthèse automatique", desc: "Générez des résumés transversaux par thématique." },
    { icon: Brain, title: "Suggestions intelligentes", desc: "L'IA recommande les contenus les plus pertinents." },
    { icon: Zap, title: "Extraction de données", desc: "Extraire automatiquement les métadonnées des documents." },
    { icon: BookOpen, title: "Base de connaissances", desc: "Transformez votre corpus en base de connaissances interrogeable." },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          Assistant IA
          <span className="text-[10px] font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-0.5 rounded-full">
            BETA
          </span>
        </h1>
        <p className="text-sm text-slate-500">
          Interrogez votre base documentaire et obtenez de l'aide pour vos contenus
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chat - main area */}
        <div className="lg:col-span-2">
          <AiPanel />
        </div>

        {/* Features sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-bleu-profond to-bleu-fonce rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm">Capacités IA</h3>
            </div>
            <p className="text-xs text-blue-200/70 leading-relaxed">
              L'assistant IA exploite la structuration documentaire pour offrir des réponses contextuelles et pertinentes.
            </p>
          </div>

          {features.map((feat) => (
            <div key={feat.title} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <feat.icon className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-700">{feat.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{feat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
