import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const documents = [
  // Telesurveillance
  { titre: "Guide de mise en oeuvre de la telesurveillance medicale", type: "PDF", theme: "Telesurveillance", dateDocument: new Date("2025-11-15"), source: "ARS Ile-de-France", confidentialite: "Public", statut: "Valide", publicCible: "Professionnels de sante", tags: ["telesurveillance", "dispositifs medicaux", "suivi patient", "reglementation"], resume: "Guide operationnel detaillant les etapes de deploiement d'un programme de telesurveillance, incluant cadre reglementaire, choix techniques et indicateurs de suivi." },
  { titre: "Fiche pratique : teleconsultation en cabinet liberal", type: "PDF", theme: "Telesurveillance", dateDocument: new Date("2025-05-14"), source: "Ordre des medecins", confidentialite: "Public", statut: "Valide", publicCible: "Professionnels de sante", tags: ["teleconsultation", "cabinet liberal", "fiche pratique"], resume: "Guide operationnel pour les medecins liberaux souhaitant integrer la teleconsultation dans leur pratique." },
  { titre: "Bilan 2025 du programme national de telesurveillance", type: "PDF", theme: "Telesurveillance", dateDocument: new Date("2026-01-30"), source: "DNS", confidentialite: "Interne", statut: "Valide", publicCible: "Institutionnels", tags: ["telesurveillance", "bilan", "indicateurs", "programme national"], resume: "Rapport annuel sur les resultats du programme ETAPES et les deploiements regionaux de telesurveillance." },
  { titre: "Protocole de telesuivi des patients diabetiques", type: "Word", theme: "Telesurveillance", dateDocument: new Date("2025-09-05"), source: "CHU de Bordeaux", confidentialite: "Restreint", statut: "EnCours", publicCible: "Professionnels de sante", tags: ["diabete", "telesuivi", "protocole", "chronique"], resume: "Protocole de suivi a distance des patients diabetiques de type 2 avec dispositifs connectes." },
  { titre: "Cahier des charges plateforme de telemonitoring", type: "Word", theme: "Telesurveillance", dateDocument: new Date("2025-07-22"), source: "GCS e-Sante Bretagne", confidentialite: "Restreint", statut: "EnCours", publicCible: "DSI hospitaliers", tags: ["telemonitoring", "cahier des charges", "plateforme", "IoT"], resume: "Specifications pour une plateforme regionale de telemonitoring des patients insuffisants cardiaques." },

  // Strategie e-sante
  { titre: "Strategie nationale e-sante 2025-2030 — Synthese", type: "PPTX", theme: "Strategie e-sante", dateDocument: new Date("2025-09-22"), source: "DNS", confidentialite: "Public", statut: "Valide", publicCible: "Institutionnels", tags: ["feuille de route", "e-sante", "politique publique", "interoperabilite"], resume: "Presentation des orientations strategiques nationales en matiere de sante numerique pour la periode 2025-2030." },
  { titre: "Plan d'action : acces aux soins par le numerique", type: "Word", theme: "Strategie e-sante", dateDocument: new Date("2025-11-28"), source: "Ministere de la Sante", confidentialite: "Interne", statut: "EnCours", publicCible: "Institutionnels", tags: ["acces aux soins", "deserts medicaux", "teleconsultation"], resume: "Plan interministeriel visant a reduire les inegalites territoriales d'acces aux soins par le deploiement d'outils numeriques." },
  { titre: "Benchmark europeen de la sante numerique", type: "PDF", theme: "Strategie e-sante", dateDocument: new Date("2025-06-18"), source: "Commission europeenne", confidentialite: "Public", statut: "Valide", publicCible: "Institutionnels", tags: ["benchmark", "europe", "e-sante", "comparaison"], resume: "Comparaison des strategies e-sante de 12 pays europeens : maturite numerique, adoption, investissements." },
  { titre: "Note strategique : IA et transformation du systeme de sante", type: "Word", theme: "Strategie e-sante", dateDocument: new Date("2026-02-12"), source: "DNS", confidentialite: "Interne", statut: "Brouillon", publicCible: "Institutionnels", tags: ["IA", "transformation", "strategie", "systeme de sante"], resume: "Reflexion prospective sur l'impact de l'IA generative sur l'organisation des soins et la formation des professionnels." },
  { titre: "Feuille de route regionale e-sante Occitanie 2026", type: "PPTX", theme: "Strategie e-sante", dateDocument: new Date("2026-01-08"), source: "ARS Occitanie", confidentialite: "Interne", statut: "EnCours", publicCible: "Institutionnels", tags: ["feuille de route", "region", "Occitanie", "e-sante"], resume: "Declinaison regionale de la strategie nationale avec priorites locales et calendrier de deploiement." },

  // Interoperabilite
  { titre: "Referentiel d'interoperabilite des SI hospitaliers", type: "Word", theme: "Interoperabilite", dateDocument: new Date("2025-07-03"), source: "ANS", confidentialite: "Interne", statut: "Valide", publicCible: "DSI hospitaliers", tags: ["HL7 FHIR", "interoperabilite", "SI hospitalier", "normes"], resume: "Standards techniques et bonnes pratiques pour assurer l'interoperabilite entre systemes d'information de sante." },
  { titre: "Note de cadrage : entrepot de donnees de sante regional", type: "Word", theme: "Interoperabilite", dateDocument: new Date("2026-02-05"), source: "ARS Occitanie", confidentialite: "Restreint", statut: "Brouillon", publicCible: "DSI hospitaliers", tags: ["entrepot de donnees", "EDS", "donnees massives"], resume: "Cadrage preliminaire pour un entrepot de donnees de sante regional a des fins de recherche et de pilotage." },
  { titre: "Guide d'implementation HL7 FHIR en etablissement", type: "PDF", theme: "Interoperabilite", dateDocument: new Date("2025-10-20"), source: "ANS", confidentialite: "Public", statut: "Valide", publicCible: "DSI hospitaliers", tags: ["HL7 FHIR", "implementation", "API", "standard"], resume: "Guide technique pas-a-pas pour implementer les ressources FHIR dans un SI hospitalier existant." },
  { titre: "Retour d'experience : migration vers FHIR R4 au CHU de Lille", type: "Word", theme: "Interoperabilite", dateDocument: new Date("2025-12-15"), source: "CHU de Lille", confidentialite: "Interne", statut: "Valide", publicCible: "DSI hospitaliers", tags: ["FHIR R4", "migration", "retour d'experience", "CHU"], resume: "Bilan de 18 mois de migration progressive vers FHIR R4 : difficultes, solutions et gains mesures." },
  { titre: "Cartographie des flux d'interoperabilite en Bretagne", type: "PPTX", theme: "Interoperabilite", dateDocument: new Date("2025-08-10"), source: "GCS e-Sante Bretagne", confidentialite: "Interne", statut: "Valide", publicCible: "DSI hospitaliers", tags: ["cartographie", "flux", "interoperabilite", "region"], resume: "Etat des lieux des echanges de donnees entre les 45 etablissements connectes au reseau regional." },

  // Securite des donnees
  { titre: "Protocole de securite des donnees de sante — RGPD & HDS", type: "PDF", theme: "Securite des donnees", dateDocument: new Date("2025-10-08"), source: "CNIL / ANS", confidentialite: "Restreint", statut: "Valide", publicCible: "DPO et RSSI", tags: ["RGPD", "HDS", "cybersecurite", "donnees de sante", "conformite"], resume: "Exigences de securite applicables a l'hebergement et au traitement des donnees de sante a caractere personnel." },
  { titre: "Formation : cybersecurite en etablissement de sante", type: "PPTX", theme: "Securite des donnees", dateDocument: new Date("2025-08-20"), source: "ANSSI", confidentialite: "Public", statut: "Valide", publicCible: "Personnel soignant", tags: ["cybersecurite", "formation", "sensibilisation", "hopital"], resume: "Support de formation couvrant les bonnes pratiques de securite informatique au quotidien en contexte hospitalier." },
  { titre: "Plan de continuite d'activite SI hospitalier", type: "Word", theme: "Securite des donnees", dateDocument: new Date("2025-04-12"), source: "ANSSI", confidentialite: "Restreint", statut: "Valide", publicCible: "DSI hospitaliers", tags: ["PCA", "continuite", "sinistre", "resilience"], resume: "Modele de plan de continuite d'activite adapte aux etablissements de sante, incluant scenarios de cyberattaque." },
  { titre: "Audit de conformite HDS — Guide methodologique", type: "PDF", theme: "Securite des donnees", dateDocument: new Date("2025-11-05"), source: "CNIL / ANS", confidentialite: "Interne", statut: "Valide", publicCible: "DPO et RSSI", tags: ["audit", "HDS", "conformite", "methodologie"], resume: "Methodologie d'audit pour verifier la conformite d'un hebergeur de donnees de sante aux exigences reglementaires." },
  { titre: "Retour incident : ransomware en centre hospitalier", type: "PDF", theme: "Securite des donnees", dateDocument: new Date("2025-03-28"), source: "CERT-Sante", confidentialite: "Restreint", statut: "Valide", publicCible: "DSI hospitaliers", tags: ["ransomware", "incident", "CERT", "retour d'experience"], resume: "Analyse post-incident d'une attaque ransomware sur un centre hospitalier : chronologie, impact, mesures correctives." },
  { titre: "Charte informatique type pour etablissement de sante", type: "Word", theme: "Securite des donnees", dateDocument: new Date("2025-06-30"), source: "ANSSI", confidentialite: "Public", statut: "Valide", publicCible: "Personnel soignant", tags: ["charte", "informatique", "regles", "utilisateur"], resume: "Modele de charte informatique couvrant l'usage des postes, mots de passe, messagerie et appareils mobiles." },

  // DMP / Mon Espace Sante
  { titre: "Retour d'experience : deploiement du DMP en Nouvelle-Aquitaine", type: "Word", theme: "DMP / Mon Espace Sante", dateDocument: new Date("2025-06-12"), source: "CHU de Bordeaux", confidentialite: "Interne", statut: "Valide", publicCible: "Professionnels de sante", tags: ["DMP", "Mon Espace Sante", "retour d'experience", "deploiement"], resume: "Analyse du deploiement du Dossier Medical Partage en Nouvelle-Aquitaine : facteurs de succes et difficultes rencontrees." },
  { titre: "Guide d'alimentation de Mon Espace Sante", type: "PDF", theme: "DMP / Mon Espace Sante", dateDocument: new Date("2025-09-18"), source: "ANS", confidentialite: "Public", statut: "Valide", publicCible: "Professionnels de sante", tags: ["Mon Espace Sante", "alimentation", "guide", "documents"], resume: "Procedures et formats pour l'alimentation automatique de Mon Espace Sante depuis les logiciels metier." },
  { titre: "Enquete satisfaction usagers Mon Espace Sante 2025", type: "PPTX", theme: "DMP / Mon Espace Sante", dateDocument: new Date("2025-12-20"), source: "France Assos Sante", confidentialite: "Public", statut: "Valide", publicCible: "Institutionnels", tags: ["enquete", "satisfaction", "usagers", "Mon Espace Sante"], resume: "Resultats de l'enquete aupres de 5 000 usagers sur leur utilisation et perception de Mon Espace Sante." },
  { titre: "Specifications techniques API Mon Espace Sante v3", type: "PDF", theme: "DMP / Mon Espace Sante", dateDocument: new Date("2026-01-15"), source: "ANS", confidentialite: "Interne", statut: "EnCours", publicCible: "DSI hospitaliers", tags: ["API", "specifications", "Mon Espace Sante", "technique"], resume: "Documentation technique de la v3 de l'API Mon Espace Sante avec nouveaux endpoints et modele de donnees." },

  // Coordination des soins
  { titre: "Cahier des charges — Plateforme de coordination des soins", type: "Word", theme: "Coordination des soins", dateDocument: new Date("2025-12-01"), source: "GCS e-Sante Bretagne", confidentialite: "Restreint", statut: "EnCours", publicCible: "DSI hospitaliers", tags: ["cahier des charges", "coordination", "parcours patient", "plateforme"], resume: "Specifications fonctionnelles et techniques pour une plateforme regionale de coordination des parcours de soins." },
  { titre: "Presentation partenaires : ecosysteme numerique en sante", type: "PPTX", theme: "Coordination des soins", dateDocument: new Date("2026-01-22"), source: "France Assos Sante", confidentialite: "Public", statut: "EnCours", publicCible: "Partenaires", tags: ["ecosysteme", "partenariat", "associations"], resume: "Cartographie des acteurs du numerique en sante a destination des partenaires institutionnels et associatifs." },
  { titre: "Protocole de partage de donnees ville-hopital", type: "Word", theme: "Coordination des soins", dateDocument: new Date("2025-10-05"), source: "ARS Ile-de-France", confidentialite: "Interne", statut: "Valide", publicCible: "Professionnels de sante", tags: ["ville-hopital", "partage", "donnees", "parcours"], resume: "Cadre de partage de donnees entre medecine de ville et etablissements hospitaliers pour le suivi des patients chroniques." },
  { titre: "Retour d'experience CPTS numerique en milieu rural", type: "PDF", theme: "Coordination des soins", dateDocument: new Date("2025-08-25"), source: "ARS Occitanie", confidentialite: "Public", statut: "Valide", publicCible: "Professionnels de sante", tags: ["CPTS", "rural", "coordination", "numerique"], resume: "Bilan de 2 ans de fonctionnement d'une CPTS numerique en zone rurale : outils, usages et resultats." },
  { titre: "Guide d'utilisation de la messagerie securisee MSSante", type: "PDF", theme: "Coordination des soins", dateDocument: new Date("2025-05-30"), source: "ANS", confidentialite: "Public", statut: "Valide", publicCible: "Professionnels de sante", tags: ["MSSante", "messagerie", "securisee", "guide"], resume: "Guide utilisateur de la messagerie securisee de sante pour l'echange de documents entre professionnels." },

  // Intelligence artificielle
  { titre: "Etude d'impact : intelligence artificielle en imagerie medicale", type: "PDF", theme: "Intelligence artificielle", dateDocument: new Date("2026-01-10"), source: "Inserm", confidentialite: "Public", statut: "Valide", publicCible: "Institutionnels", tags: ["IA", "imagerie medicale", "radiologie", "diagnostic"], resume: "Impact de l'integration d'outils d'IA dans les services de radiologie sur la qualite et la rapidite du diagnostic." },
  { titre: "Cadre ethique pour l'IA en sante — Recommandations", type: "PDF", theme: "Intelligence artificielle", dateDocument: new Date("2025-11-20"), source: "Comite national d'ethique", confidentialite: "Public", statut: "Valide", publicCible: "Institutionnels", tags: ["ethique", "IA", "recommandations", "cadre"], resume: "Recommandations du comite d'ethique sur l'usage de l'IA dans le parcours de soins et la prise de decision medicale." },
  { titre: "IA generative et aide a la redaction medicale", type: "Word", theme: "Intelligence artificielle", dateDocument: new Date("2026-02-28"), source: "Inserm", confidentialite: "Interne", statut: "Brouillon", publicCible: "Professionnels de sante", tags: ["IA generative", "redaction", "LLM", "comptes-rendus"], resume: "Experimentation de l'IA generative pour la production de comptes-rendus medicaux structures." },
  { titre: "Benchmark des solutions d'IA pour le triage aux urgences", type: "PPTX", theme: "Intelligence artificielle", dateDocument: new Date("2025-10-15"), source: "CHU de Bordeaux", confidentialite: "Restreint", statut: "EnCours", publicCible: "DSI hospitaliers", tags: ["triage", "urgences", "IA", "benchmark"], resume: "Evaluation comparative de 5 solutions d'IA pour l'aide au triage des patients aux urgences." },
  { titre: "Guide de validation des dispositifs medicaux bases sur l'IA", type: "PDF", theme: "Intelligence artificielle", dateDocument: new Date("2025-07-10"), source: "HAS", confidentialite: "Public", statut: "Valide", publicCible: "DPO et RSSI", tags: ["validation", "dispositif medical", "IA", "certification"], resume: "Processus de validation et de certification des logiciels de sante integrant des algorithmes d'intelligence artificielle." },
  { titre: "Formation : comprendre l'IA pour les decideurs de sante", type: "PPTX", theme: "Intelligence artificielle", dateDocument: new Date("2025-09-30"), source: "Ministere de la Sante", confidentialite: "Public", statut: "Valide", publicCible: "Institutionnels", tags: ["formation", "IA", "decideurs", "vulgarisation"], resume: "Module de sensibilisation a l'IA destine aux directeurs d'etablissements et aux cadres de sante." },

  // Documents supplementaires transversaux
  { titre: "Annuaire des acteurs du numerique en sante en France", type: "PDF", theme: "Coordination des soins", dateDocument: new Date("2026-03-01"), source: "DNS", confidentialite: "Public", statut: "Valide", publicCible: "Partenaires", tags: ["annuaire", "acteurs", "numerique", "France"], resume: "Repertoire des 200 principaux acteurs du numerique en sante : editeurs, institutionnels, associations, startups." },
  { titre: "Modele de convention de partenariat numerique en sante", type: "Word", theme: "Coordination des soins", dateDocument: new Date("2025-04-20"), source: "France Assos Sante", confidentialite: "Interne", statut: "Valide", publicCible: "Partenaires", tags: ["convention", "partenariat", "modele", "juridique"], resume: "Modele type de convention entre une association et un partenaire institutionnel pour un projet numerique en sante." },
  { titre: "Etude : cout de la non-interoperabilite en France", type: "PDF", theme: "Interoperabilite", dateDocument: new Date("2025-05-18"), source: "Cour des comptes", confidentialite: "Public", statut: "Valide", publicCible: "Institutionnels", tags: ["cout", "interoperabilite", "etude", "economique"], resume: "Estimation du cout de la fragmentation des SI de sante en France : 3,2 milliards d'euros par an." },
  { titre: "Guide de deploiement du DPI en clinique privee", type: "PDF", theme: "Interoperabilite", dateDocument: new Date("2025-12-08"), source: "FHP", confidentialite: "Interne", statut: "Valide", publicCible: "DSI hospitaliers", tags: ["DPI", "clinique", "deploiement", "dossier patient"], resume: "Retour d'experience et guide pratique pour le deploiement d'un dossier patient informatise en clinique privee." },
  { titre: "Synthese des incidents cyber sante T1-T3 2025", type: "PDF", theme: "Securite des donnees", dateDocument: new Date("2025-10-30"), source: "CERT-Sante", confidentialite: "Restreint", statut: "Valide", publicCible: "DPO et RSSI", tags: ["incidents", "cyber", "synthese", "CERT-Sante"], resume: "Bilan des 147 incidents de cybersecurite declares par les etablissements de sante sur les 9 premiers mois de 2025." },
  { titre: "Referentiel de competences numeriques pour soignants", type: "PPTX", theme: "Strategie e-sante", dateDocument: new Date("2025-07-15"), source: "Ministere de la Sante", confidentialite: "Public", statut: "Valide", publicCible: "Personnel soignant", tags: ["competences", "numerique", "formation", "referentiel"], resume: "Les 40 competences numeriques essentielles pour les professionnels de sante, avec niveaux de maitrise attendus." },
  { titre: "Analyse juridique : responsabilite et IA medicale", type: "PDF", theme: "Intelligence artificielle", dateDocument: new Date("2025-11-08"), source: "Ordre des medecins", confidentialite: "Public", statut: "Valide", publicCible: "Professionnels de sante", tags: ["juridique", "responsabilite", "IA", "medecin"], resume: "Analyse des enjeux de responsabilite juridique lies a l'utilisation d'outils d'IA dans la pratique medicale." },
  { titre: "Bilan de la feuille de route du numerique en sante 2023-2025", type: "PPTX", theme: "Strategie e-sante", dateDocument: new Date("2026-03-10"), source: "DNS", confidentialite: "Public", statut: "EnCours", publicCible: "Institutionnels", tags: ["bilan", "feuille de route", "numerique", "sante"], resume: "Point d'etape sur les 52 mesures de la feuille de route : avancement, resultats et ajustements." },
  { titre: "Guide RGPD pour les applications mobiles de sante", type: "PDF", theme: "Securite des donnees", dateDocument: new Date("2025-08-05"), source: "CNIL / ANS", confidentialite: "Public", statut: "Valide", publicCible: "DPO et RSSI", tags: ["RGPD", "mobile", "application", "sante"], resume: "Recommandations CNIL pour la mise en conformite des applications mobiles de sante avec le RGPD." },
  { titre: "Etude de faisabilite : chatbot de pre-orientation patients", type: "Word", theme: "Intelligence artificielle", dateDocument: new Date("2025-12-22"), source: "CHU de Lille", confidentialite: "Restreint", statut: "Brouillon", publicCible: "DSI hospitaliers", tags: ["chatbot", "pre-orientation", "patients", "faisabilite"], resume: "Etude de faisabilite pour un chatbot d'orientation des patients avant consultation aux urgences." },
  { titre: "Tableau de bord regional Mon Espace Sante — Bretagne", type: "PPTX", theme: "DMP / Mon Espace Sante", dateDocument: new Date("2025-11-12"), source: "GCS e-Sante Bretagne", confidentialite: "Interne", statut: "Valide", publicCible: "Institutionnels", tags: ["tableau de bord", "Mon Espace Sante", "region", "Bretagne"], resume: "Indicateurs d'adoption et d'usage de Mon Espace Sante en Bretagne : taux d'alimentation, consultations, profils." },
  { titre: "Convention type hebergement donnees de sante (HDS)", type: "Word", theme: "Securite des donnees", dateDocument: new Date("2025-03-15"), source: "CNIL / ANS", confidentialite: "Interne", statut: "Valide", publicCible: "DPO et RSSI", tags: ["convention", "HDS", "hebergement", "type"], resume: "Modele de convention entre un etablissement de sante et un hebergeur certifie HDS." },
];

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sante-numerique.fr" },
    update: {},
    create: { name: "Selyan Mouhali", email: "admin@sante-numerique.fr", password: hashedPassword, role: "admin" },
  });

  const contributeur = await prisma.user.upsert({
    where: { email: "contributeur@sante-numerique.fr" },
    update: {},
    create: { name: "Marie Dupont", email: "contributeur@sante-numerique.fr", password: hashedPassword, role: "contributeur" },
  });

  const lecteur = await prisma.user.upsert({
    where: { email: "lecteur@sante-numerique.fr" },
    update: {},
    create: { name: "Pierre Martin", email: "lecteur@sante-numerique.fr", password: hashedPassword, role: "lecteur" },
  });

  const users = [admin, contributeur];

  for (const doc of documents) {
    const { tags, ...docData } = doc;
    await prisma.document.create({
      data: {
        ...docData,
        createdById: users[Math.floor(Math.random() * users.length)].id,
        tags: {
          create: tags.map((tagName) => ({
            tag: { connectOrCreate: { where: { name: tagName }, create: { name: tagName } } },
          })),
        },
      },
    });
  }

  const allDocs = await prisma.document.findMany();
  const actions = ["create", "update", "view"];
  for (const doc of allDocs.slice(0, 15)) {
    await prisma.activity.create({
      data: {
        action: actions[Math.floor(Math.random() * actions.length)],
        details: `Document "${doc.titre}" ${actions[Math.floor(Math.random() * actions.length)] === "create" ? "ajoute" : "consulte"}`,
        userId: users[Math.floor(Math.random() * users.length)].id,
        documentId: doc.id,
      },
    });
  }

  const tagCount = await prisma.tag.count();
  console.log("Seed completed!");
  console.log(`  - 3 users`);
  console.log(`  - ${documents.length} documents`);
  console.log(`  - ${tagCount} tags uniques`);
  console.log(`  - 15 activites`);
  console.log(`  - Login: admin@sante-numerique.fr / admin123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
