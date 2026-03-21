import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

async function getDocumentContext() {
  const docs = await prisma.document.findMany({
    select: {
      titre: true,
      resume: true,
      theme: true,
      type: true,
      source: true,
      publicCible: true,
      tags: { include: { tag: true } },
    },
    take: 50,
    orderBy: { dateDocument: "desc" },
  });

  return docs
    .map(
      (d) =>
        `- "${d.titre}" (${d.type}, ${d.theme}, source: ${d.source}, public: ${d.publicCible})${
          d.resume ? `\n  Resume: ${d.resume}` : ""
        }${
          d.tags.length ? `\n  Tags: ${d.tags.map((t) => t.tag.name).join(", ")}` : ""
        }`
    )
    .join("\n\n");
}

const SYSTEM_PROMPT = `Tu es l'assistant IA de DocSante, une plateforme de gestion documentaire dediee au numerique en sante.

Tu as acces au corpus documentaire de l'association. Voici les documents disponibles :

{DOCUMENTS}

Ton role :
- Repondre aux questions sur le corpus documentaire
- Synthetiser des documents par thematique
- Aider a la redaction en s'appuyant sur les documents existants
- Identifier les documents pertinents pour un besoin donne
- Proposer des plans d'articles structures bases sur le corpus

Reponds en francais, de maniere concise et structuree. Utilise le **gras** pour les points importants.
Si une question sort du perimetre du corpus, dis-le clairement.`;

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Non autorise" }, { status: 401 });
  }

  const { message, history } = await req.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message requis" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // If no API key, return simulated response
  if (!apiKey) {
    return NextResponse.json({
      response: `**Reponse basee sur le corpus documentaire**

L'assistant IA analyse votre demande en s'appuyant sur les documents de la base.

> *Pour activer l'IA complete, configurez la variable ANTHROPIC_API_KEY dans le fichier .env.*`,
      simulated: true,
    });
  }

  try {
    const docContext = await getDocumentContext();
    const systemPrompt = SYSTEM_PROMPT.replace("{DOCUMENTS}", docContext);

    const messages: { role: "user" | "assistant"; content: string }[] = [];
    if (history?.length) {
      for (const msg of history) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
    messages.push({ role: "user", content: message });

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text, simulated: false });
  } catch (error) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la generation de la reponse" },
      { status: 500 }
    );
  }
}
