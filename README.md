# DocSante — Plateforme documentaire sante numerique

Plateforme web de gestion, structuration et exploitation d'un fonds documentaire dedie au numerique en sante.

**Demo live** : [docsante.vercel.app](https://docsante.vercel.app)

## Fonctionnalites

- **Gestion documentaire** — CRUD complet avec upload, recherche plein texte, 6 filtres combinables, pagination, export CSV
- **6 axes de classification** — Type, thematique, public cible, source, confidentialite, statut + tags libres
- **Tableau de bord** — KPIs animes, graphiques interactifs, activite recente
- **Assistant IA** — Chat contextuel (Claude / Anthropic) qui analyse le corpus pour synthetiser, aider a la redaction et identifier les documents pertinents
- **Gestion des roles** — Admin, contributeur, lecteur avec permissions differenciees
- **Authentification** — Inscription, connexion, sessions signees HMAC-SHA256
- **Statistiques** — Repartition par statut, sources, thematiques
- **Landing page** — Page d'accueil de presentation du produit

## Stack

| Couche | Technologies |
|--------|-------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Radix UI, Recharts |
| Backend | Next.js API Routes, services layer, Prisma 7 |
| Base de donnees | PostgreSQL (Supabase) — 5 tables, 16 indexes |
| IA | API Anthropic (Claude) |
| Deploiement | Vercel |

## Installation locale

```bash
git clone https://github.com/selyan-mhli/mission-sante-numerique.git
cd mission-sante-numerique/mission-sante-mvp
npm install
cp .env.example .env  # configurer DATABASE_URL, SESSION_SECRET, ANTHROPIC_API_KEY
npx prisma generate
npx prisma migrate deploy
npx tsx src/lib/seed.ts
npm run dev
```

## Compte demo

| Role | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@sante-numerique.fr` | `admin123` |

## Donnees

- 48 documents realistes couvrant 7 thematiques sante numerique
- 143 tags uniques
- 3 utilisateurs de demo

## Auteur

**Selyan Mouhali** — 2026
