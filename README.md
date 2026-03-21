# DocSante — Plateforme documentaire sante numerique

Plateforme web de gestion, structuration et exploitation d'un fonds documentaire dedie au numerique en sante.

Concue pour les associations, institutions et professionnels du secteur sante qui gerent un corpus documentaire heterogene (Word, PowerPoint, PDF) et ont besoin de le centraliser, le classer et l'exploiter.

## Fonctionnalites

- **Gestion documentaire** — CRUD complet avec upload de fichiers, recherche plein texte, 6 filtres combinables, pagination, export CSV
- **6 axes de classification** — Type, thematique, public cible, source, confidentialite, statut + systeme de tags libres
- **Tableau de bord** — KPIs animes, graphiques interactifs (Recharts), activite recente, derniers documents
- **Statistiques** — Repartition par statut, sources, thematiques avec barres de progression et tableaux
- **Assistant IA** — Chat contextuel branche sur Claude (Anthropic) qui analyse le corpus pour synthetiser, aider a la redaction et identifier les documents pertinents
- **Gestion des roles** — 3 niveaux (admin, contributeur, lecteur) avec permissions differenciees
- **Authentification** — Sessions signees HMAC-SHA256, cookies HTTP-only, proxy de protection des routes
- **Landing page** — Page d'accueil marketing avec presentation du produit

## Stack

| Couche | Technologies |
|--------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI, Recharts, Framer Motion |
| **Backend** | Next.js API Routes, services layer, Prisma 7 |
| **Base de donnees** | PostgreSQL (Supabase) — 5 tables, 16 indexes |
| **IA** | API Anthropic (Claude) |
| **Auth** | HMAC-SHA256 sessions, bcrypt |

## Installation

```bash
git clone https://github.com/selyan-mhli/mission-sante-numerique.git
cd mission-sante-numerique/mission-sante-mvp
npm install
```

Creer un fichier `.env` :

```env
DATABASE_URL="postgresql://..."
SESSION_SECRET="votre-secret"
ANTHROPIC_API_KEY="sk-ant-..."
```

```bash
npx prisma generate
npx prisma migrate deploy
npx tsx src/lib/seed.ts
npm run dev
```

## Comptes de demo

| Role | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@sante-numerique.fr` | `admin123` |
| Contributeur | `contributeur@sante-numerique.fr` | `admin123` |
| Lecteur | `lecteur@sante-numerique.fr` | `admin123` |

## Structure

```
mission-sante-mvp/
├── src/
│   ├── services/          # Couche metier (document, activity, stats, user)
│   ├── app/
│   │   ├── (auth)/        # Login
│   │   ├── (dashboard)/   # Dashboard, documents, assistant IA, statistiques
│   │   └── api/           # Auth, documents CRUD, stats, upload, AI chat
│   ├── components/        # Sidebar, KPIs, charts, cards, formulaires, filtres, chat IA
│   └── lib/               # Prisma client, auth, utils, seed
├── prisma/                # Schema PostgreSQL, migrations
└── docs/                  # Rapport client, devis (LaTeX)
```

## Documents inclus

Le repo contient egalement :
- `rapport-client.tex` / `.pdf` — Rapport de cadrage et recommandations
- `devis.tex` / `.pdf` — Devis detaille de la prestation

## Auteur

**Selyan Mouhali** — 2026
