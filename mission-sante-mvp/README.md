# DocSante — Plateforme documentaire sante numerique

MVP d'une plateforme web de gestion, structuration et exploitation d'un fonds documentaire dedie au numerique en sante. Concue pour une association du secteur en lien avec hopitaux, medecins et institutions publiques.

---

## Table des matieres

- [Le produit](#le-produit)
- [Fonctionnalites](#fonctionnalites)
- [Les 6 axes de classification](#les-6-axes-de-classification)
- [Architecture technique](#architecture-technique)
- [Modele de donnees](#modele-de-donnees)
- [Stack technologique](#stack-technologique)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Comptes de demonstration](#comptes-de-demonstration)
- [API](#api)
- [Auteur](#auteur)

---

## Le produit

### Probleme

L'association gere un corpus de **100 a 200 documents** (Word, PowerPoint, PDF) accumules au fil du temps. Ces documents couvrent la telesurveillance, l'interoperabilite, la strategie e-sante, la securite des donnees, la coordination des soins et l'intelligence artificielle.

Aujourd'hui : documents disperses, pas de taxonomie, pas de metadonnees exploitables, impossible de retrouver rapidement un contenu ou d'identifier les doublons.

### Solution

DocSante est une plateforme web qui permet de :

- **Centraliser** tous les documents dans une base structuree avec 6 axes de classification
- **Explorer** le corpus via recherche plein texte et filtres combines
- **Gerer** le cycle de vie des documents (creation, edition, validation, suppression)
- **Analyser** la base via un tableau de bord avec KPIs et graphiques
- **Preparer l'IA** avec une architecture pensee pour un futur RAG (recherche semantique, aide a la redaction)
- **Controller les acces** avec 3 niveaux de roles (admin, contributeur, lecteur)

### Utilisateurs cibles

| Role | Usage |
|------|-------|
| **Admin** | Gestion complete : CRUD, suppression, supervision |
| **Contributeur** | Ajout et modification de documents |
| **Lecteur** | Consultation, recherche, exploration |

---

## Fonctionnalites

### Tableau de bord
- 4 KPIs animes (documents, thematiques, sources, taux de structuration)
- 3 graphiques interactifs (repartition par theme, type, confidentialite)
- Fil d'activite recente
- Acces rapide aux derniers documents

### Gestion documentaire
- CRUD complet avec upload de fichiers (PDF, Word, PowerPoint)
- Recherche plein texte instantanee (debounce 200ms)
- 6 filtres combinables avec selection multiple
- Tri par date, alphabetique, ou plus recents
- Fiches document detaillees avec toutes les metadonnees
- Systeme de tags avec relation many-to-many

### Statistiques
- Repartition par statut avec barres de progression
- Tableau des sources avec pourcentages
- Tous les graphiques du dashboard en version etendue

### Assistant IA
- Chat contextuel branche sur Claude (Anthropic)
- Analyse le corpus documentaire (titres, resumes, tags) pour repondre
- Cas d'usage : synthese par thematique, aide a la redaction, identification de contenus pertinents
- Historique de conversation

### Authentification et roles
- Login/logout avec sessions HTTP-only cookies
- 3 niveaux de permissions (admin, contributeur, lecteur)
- Protection des routes cote serveur
- Guards sur les pages et les API

---

## Les 6 axes de classification

Le modele documentaire repose sur 6 axes definis pour le secteur sante numerique :

| Axe | Valeurs |
|-----|---------|
| **Type** | PDF, Word, PPTX |
| **Thematique** | Telesurveillance, Strategie e-sante, Interoperabilite, Securite des donnees, DMP / Mon Espace Sante, Coordination des soins, Intelligence artificielle |
| **Public cible** | Professionnels de sante, DSI hospitaliers, Institutionnels, DPO et RSSI, Personnel soignant, Partenaires |
| **Source** | ARS, DNS, ANS, CNIL, CHU, GCS, ANSSI, Inserm, Ministere, Ordre des medecins, etc. |
| **Confidentialite** | Public, Interne, Restreint |
| **Statut** | Brouillon, En cours, Valide |

Chaque document est indexe sur ces 6 axes + un systeme de **tags libres** (many-to-many) pour un etiquetage fin.

---

## Architecture technique

```
┌─────────────────────────────────────────────────────┐
│                    VIEWS (React)                     │
│  Server Components (SSR) + Client Components         │
│  src/app/  +  src/components/                        │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              CONTROLLERS (API Routes)                │
│  src/app/api/  — auth, validation, orchestration     │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                SERVICES (Model)                      │
│  src/services/  — logique metier, acces donnees      │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              DATABASE (Prisma + SQLite)               │
│  5 tables — indexes sur tous les champs filtrables   │
└─────────────────────────────────────────────────────┘
```

**Flux de donnees :**
- Les **Server Components** appellent directement les services (zero latence reseau)
- Les **Client Components** appellent les API routes via `fetch`
- Les **API routes** delegent aux services pour la logique metier
- Les **services** encapsulent tous les appels Prisma

---

## Modele de donnees

### Schema relationnel (5 tables)

```
User ──────< Document ──────< DocumentTag >────── Tag
  │                │
  │                │
  └────< Activity >┘
```

### Tables et indexes

**User** — Utilisateurs de la plateforme
- Champs : `id`, `name`, `email` (unique), `password` (bcrypt 12 rounds), `role`, `avatar`
- Index : `email`, `role`

**Document** — Documents de la base
- Champs : `id`, `titre`, `resume`, `type`, `theme`, `publicCible`, `source`, `confidentialite`, `statut`, `dateDocument`, `fileName`, `fileSize`, `filePath`
- Relations : `createdBy` → User, `tags` → DocumentTag[]
- **9 indexes** : `theme`, `type`, `source`, `statut`, `confidentialite`, `publicCible`, `createdById`, `dateDocument`, `createdAt`

**Tag** — Tags uniques partages entre documents
- Champs : `id`, `name` (unique)
- Index : `name`

**DocumentTag** — Table de jointure many-to-many
- Cle composite : `[documentId, tagId]`
- Cascade delete : supprimer un document supprime ses associations
- Indexes : `documentId`, `tagId`

**Activity** — Journal d'activite
- Champs : `id`, `action` (create/update/delete/view/download), `details`, `createdAt`
- Relations : `user` → User, `document` → Document (SetNull on delete)
- **4 indexes** : `userId`, `documentId`, `createdAt`, `action`

### Pourquoi ce schema

| Decision | Raison |
|----------|--------|
| Tags en many-to-many | Requetes propres (`where tags.some`), pas de JSON.parse, reutilisation des tags entre documents, comptage natif |
| 9 indexes sur Document | Chaque axe de filtre a son index — les requetes combinees restent rapides meme a 10 000+ documents |
| Cascade delete sur DocumentTag | Supprimer un document nettoie automatiquement ses tags sans orphelins |
| SetNull sur Activity→Document | L'historique d'activite survit a la suppression d'un document |
| SQLite en dev | Zero config, fichier unique, portable — migration vers PostgreSQL triviale via Prisma |

---

## Stack technologique

### Core

| Tech | Version | Role |
|------|---------|------|
| **Next.js** | 16.2.0 | Framework fullstack (App Router, SSR, API Routes) |
| **React** | 19.2.4 | UI avec Server Components |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | 4.x | Design system utilitaire |

### Data

| Tech | Version | Role |
|------|---------|------|
| **Prisma** | 7.5.0 | ORM type-safe, migrations, schema declaratif |
| **SQLite** | better-sqlite3 12.x | BDD embarquee (migration PostgreSQL ready) |

### UI

| Tech | Version | Role |
|------|---------|------|
| **Radix UI** | multiples | Primitives accessibles (Dialog, Select, Dropdown, Tabs, Tooltip) |
| **Lucide React** | 0.577.0 | Icones |
| **Recharts** | 3.8.0 | Graphiques (PieChart, BarChart) |
| **Framer Motion** | 12.38.0 | Animations |

### Utils

| Tech | Version | Role |
|------|---------|------|
| **bcryptjs** | 3.0.3 | Hash mots de passe |
| **date-fns** | 4.1.0 | Dates en francais |
| **clsx + tailwind-merge** | 2.1.1 / 3.5.0 | Classes CSS conditionnelles |

---

## Structure du projet

```
mission-sante-mvp/
├── prisma/
│   ├── schema.prisma              # 5 modeles, 16 indexes
│   ├── migrations/                # Historique migrations
│   └── dev.db                     # SQLite locale
│
├── src/
│   ├── services/                  # Couche metier
│   │   ├── document.service.ts    # CRUD, recherche, filtres, tags
│   │   ├── activity.service.ts    # Journal d'activite
│   │   ├── stats.service.ts       # Agregations dashboard
│   │   └── user.service.ts        # Auth, profils
│   │
│   ├── app/
│   │   ├── (auth)/login/          # Page connexion
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx           # Tableau de bord
│   │   │   ├── documents/         # CRUD documents (liste, detail, nouveau, edit)
│   │   │   ├── assistant/         # Chat IA
│   │   │   └── statistiques/      # Stats detaillees
│   │   └── api/
│   │       ├── auth/              # login, logout, me
│   │       ├── documents/         # CRUD + filtres
│   │       ├── stats/             # Agregations
│   │       └── upload/            # Upload fichiers
│   │
│   ├── components/
│   │   ├── layout/Sidebar.tsx     # Navigation + roles
│   │   ├── dashboard/             # KpiCards, StatsCharts, RecentActivity
│   │   ├── documents/             # DocumentCard, DocumentForm, FiltersSidebar
│   │   └── ai/AiPanel.tsx         # Chat IA simule
│   │
│   └── lib/
│       ├── prisma.ts              # Client singleton
│       ├── auth.ts                # Sessions cookie
│       ├── utils.ts               # Helpers + constantes metier
│       └── seed.ts                # 48 documents + 143 tags + 3 users
│
└── public/uploads/                # Fichiers uploades
```

**~2 900 lignes de code** source

---

## Installation

### Pre-requis

- Node.js >= 18
- npm >= 9

### Setup

```bash
git clone <url-du-repo>
cd mission-sante-mvp
npm install
npx prisma generate
npx prisma db push
npx tsx src/lib/seed.ts
```

### Lancement

```bash
npm run dev
# → http://localhost:3000/login
```

### Production

```bash
npm run build
npm start
```

---

## Comptes de demonstration

| Role | Email | Mot de passe | Droits |
|------|-------|-------------|--------|
| **Admin** | `admin@sante-numerique.fr` | `admin123` | CRUD + suppression |
| **Contributeur** | `contributeur@sante-numerique.fr` | `admin123` | Lecture + ajout + edition |
| **Lecteur** | `lecteur@sante-numerique.fr` | `admin123` | Lecture seule |

---

## API

### Auth

| Methode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/logout` | Deconnexion |
| GET | `/api/auth/me` | Utilisateur courant |

### Documents

| Methode | Route | Description | Acces |
|---------|-------|-------------|-------|
| GET | `/api/documents?search=&theme=&type=&sort=...` | Liste filtree | Tous |
| POST | `/api/documents` | Creation | Admin, Contributeur |
| GET | `/api/documents/:id` | Detail | Tous |
| PUT | `/api/documents/:id` | Modification | Admin, Contributeur |
| DELETE | `/api/documents/:id` | Suppression | Admin |

### Autres

| Methode | Route | Description |
|---------|-------|-------------|
| GET | `/api/stats` | KPIs + agregations |
| POST | `/api/upload` | Upload fichier |

---

## Auteur

**Selyan Mouhali** — Mars 2026
