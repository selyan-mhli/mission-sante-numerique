"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, ClipboardList, FileEdit, Briefcase, Send, Loader2 } from "lucide-react";

const suggestions = [
  { icon: ClipboardList, text: "Resumer les documents sur la telesurveillance" },
  { icon: FileEdit, text: "M'aider a rediger un article pour des medecins" },
  { icon: Briefcase, text: "Contenus utiles pour un partenariat institutionnel" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (userMsg: string) => {
    if (!userMsg.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.response }]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: `**Erreur** : ${data.error || "Impossible de generer une reponse."}` },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "**Erreur** : Impossible de contacter le serveur." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Assistant IA{" "}
            </h3>
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          Interrogez la base documentaire et obtenez de l'aide pour rediger.
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Essayez par exemple
            </p>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s.text)}
                disabled={loading}
                className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-blue-50/50 hover:border-blue-200 hover:text-blue-700 transition-all group disabled:opacity-50"
              >
                <s.icon className="w-4 h-4 text-blue-400 opacity-60 group-hover:opacity-100 flex-shrink-0" />
                {s.text}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.role === "user"
                ? "ml-8 bg-blue-500 text-white rounded-2xl rounded-br-md px-3.5 py-2.5"
                : "mr-4 bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-md px-3.5 py-2.5"
            } text-xs leading-relaxed animate-fade-in-up`}
          >
            <div
              className={msg.role === "assistant" ? "prose prose-xs prose-slate max-w-none" : ""}
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n- /g, "<br/>- ")
                  .replace(/\n\d\. /g, (m) => `<br/>${m.trim()} `)
                  .replace(/\n> \*(.*?)\*/g, '<br/><em class="text-[10px] text-slate-400 block mt-2 pt-2 border-t border-slate-200">$1</em>')
                  .replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        ))}

        {loading && (
          <div className="mr-4 bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Posez une question sur vos documents..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-9 h-9 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
