<div align="center">

# DEFCI-SMART

**Défense & Sécurité Numérique Intelligente de Côte d'Ivoire**

*« Une gestion moderne, transparente et intelligente des forces de défense et de sécurité »*

---

![Version](https://img.shields.io/badge/version-1.0.0--MVP-2D6A4F?style=flat-square)
![Statut](https://img.shields.io/badge/statut-En%20développement-F4A261?style=flat-square)
![Licence](https://img.shields.io/badge/licence-Open%20Source-1B4332?style=flat-square)
![Concours](https://img.shields.io/badge/Concours-Digitalisation%20Services%20Publics%20CI-185FA5?style=flat-square)

</div>

---

## Contexte

En Côte d'Ivoire, les Forces de Défense et de Sécurité (FDS) regroupent environ **57 000 agents** répartis dans cinq corps :

| Corps | Effectif estimé | Tutelle |
|-------|----------------|---------|
| Forces Armées de Côte d'Ivoire (FACI) | ~22 000 | Ministère de la Défense |
| Gendarmerie Nationale | ~15 000 | Ministère de la Défense |
| Police Nationale | ~15 000 | Ministère de l'Intérieur |
| Eaux et Forêts | ~3 000 | Ministère des Eaux |
| Protection Civile | ~2 000 | Ministère de l'Intérieur |

Ces 57 000 agents sont encore gérés avec des **dossiers papier**, des **fichiers Excel dispersés** et des **procédures manuelles** qui génèrent des dysfonctionnements graves et coûteux pour l'État ivoirien.

---

## Problèmes résolus

| Problème | Gravité | Impact |
|----------|---------|--------|
| Agents fictifs & doublons dans les registres | 🔴 Critique | Milliards FCFA perdus annuellement |
| Racket aux barrages (58% des Ivoiriens concernés) | 🔴 Critique | Zéro mécanisme de signalement existant |
| Pensions bloquées 12 à 24 mois | 🔴 Critique | Des milliers de retraités sans revenus |
| Mutations traitées en 30 à 90 jours | 🟠 Haute | Blocage des affectations, frustration |
| Promotions opaques et arbitraires | 🟠 Haute | Favoritisme, pyramide déséquilibrée |
| Zéro vision nationale des effectifs | 🟠 Haute | Décisions ministérielles sans données |

---

## Solution — DEFCI-SMART

DEFCI-SMART est une **plateforme web nationale PWA** (Progressive Web Application) qui numérise intégralement la gestion des carrières des FDS et offre aux citoyens un outil de lutte contre la corruption.

### Innovations clés

- **Matricule unique national** — attribué automatiquement à chaque agent à la sortie de l'école de formation, au format `CORPS-ANNÉE-NUMÉRO` (ex : `GEN-2024-0247`). Inchangeable, permanent, élimine 100% des doublons.
- **SIGNAL-CI** — module de signalement anonyme accessible à tout citoyen sans inscription depuis `/signal`. Numéro de suivi généré instantanément.
- **PWA hors-ligne** — fonctionne sans réseau pour les unités en zone rurale. Actions synchronisées automatiquement au retour de la connexion.
- **IA prédictive** — 4 moteurs de prévision : retraites imminentes, besoins en recrutement, compétences manquantes, renouvellement équipements.

---

## Architecture des modules

### Version 1 — MVP (Ce projet)

| # | Module | Statut |
|---|--------|--------|
| 01 | Gestion RH & Carrières (avec matricule unique) | ✅ Inclus |
| 02 | Portail Agent (PWA) | ✅ Inclus |
| 04 | Discipline & Anti-Corruption (SIGNAL-CI) | ✅ Inclus |
| 09 | Audit & Cybersécurité | ✅ Inclus |

### Version 2 — Extension (Phase 2 & 3)

| # | Module | Statut |
|---|--------|--------|
| 03 | Formation & Compétences (module complet) | 🕐 V2 |
| 05 | Solde & Rémunération (bulletins PDF complets) | 🕐 V2 |
| 06 | Logistique | 🕐 V2 |
| 07 | SIG National (Cartographie Leaflet) | 🕐 V3 |
| 08 | Reporting Décisionnel | 🕐 V3 |
| 10 | Intelligence Artificielle (4 moteurs) | 🕐 V3 |

---

## Stack technique

### Frontend
```
React 18 + TypeScript      — Framework UI
Vite 5                     — Bundler ultra-rapide
Tailwind CSS 3             — Styles utilitaires
shadcn/ui                  — Composants accessibles
React Router v6            — Navigation SPA
Zustand                    — État global
TanStack Query             — Cache requêtes API
vite-plugin-pwa            — Service Worker hors-ligne
Leaflet + React-Leaflet    — Cartographie SIG (v3)
Recharts                   — Graphiques et dashboards
```

### Backend (prévu Phase 2)
```
Spring Boot 3 (Java 21)    — API REST
Spring Security + JWT      — Auth + RBAC 7 rôles
PostgreSQL 15              — Base de données principale
Redis 7                    — Cache serveur
MinIO                      — Stockage documents (PDF, photos)
Flyway                     — Migrations SQL versionnées
```

### Infrastructure
```
Docker + Docker Compose    — Conteneurisation
Nginx                      — Reverse proxy
GitLab CI/CD               — Intégration continue
AES-256 + TLS 1.3          — Chiffrement données et transit
Serveurs souverains CI     — Hébergement national
```

---

## Système matricule unique

Chaque agent reçoit un matricule **permanent et unique** à la sortie de son école de formation :

```
Format :  CORPS-ANNÉE-SÉQUENCE
Exemple : GEN-2024-0247

CORPS     = Code du corps (3 lettres)
            FAC = Forces Armées CI
            GEN = Gendarmerie Nationale
            POL = Police Nationale
            EAF = Eaux et Forêts
            PRC = Protection Civile

ANNÉE     = Année de sortie de l'école (4 chiffres)
SÉQUENCE  = Numéro d'ordre dans la promotion (4 chiffres, zéro-padded)
```

**Règles :**
- Généré automatiquement par DEFCI-SMART lors de l'enregistrement de la promotion
- Contrainte `UNIQUE` en base de données — aucun doublon possible
- Inchangeable quelle que soit la mutation, le grade ou le corps
- Passe au statut `INACTIF` à la retraite ou au décès (jamais supprimé)
- **Objectif : 0% de doublons actifs dans le registre**

---

## Acteurs du système

| Rôle | Accès principal |
|------|----------------|
| Super Administrateur | Accès total, configuration, audit complet |
| Ministre | Tableaux de bord nationaux, validation finale |
| Directeur Général | Supervision d'un corps, rapports |
| DRH | Gestion complète carrières, mutations, promotions |
| Commandant d'unité | Gestion de son unité, validations niveau 1 |
| Auditeur | Enquêtes anti-corruption, signalements SIGNAL-CI |
| Agent FDS | Portail personnel — consultation et demandes |
| Citoyen (public) | SIGNAL-CI — signalement anonyme sans inscription |

---

## Indicateurs de performance cibles (KPIs à 18 mois)

| Indicateur | Avant | Objectif |
|------------|-------|----------|
| Doublons actifs dans le registre | Inconnu | **0%** |
| Délai traitement mutations | 30–90 jours | **< 5 jours** |
| Délai liquidation pensions | 12–24 mois | **< 30 jours** |
| Délai traitement promotions | Plusieurs semaines | **< 10 jours** |
| Signalements SIGNAL-CI traités en 30j | Aucun mécanisme | **> 85%** |
| Agents avec bulletin numérique | ~0% | **> 99%** |
| Disponibilité système | — | **99,9%** |

---

## Lancer le projet (MVP frontend)

### Prérequis
- Node.js 20+
- npm 9+

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/VOTRE-EQUIPE/defci-smart.git
cd defci-smart

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application est accessible sur `http://localhost:5173`

### Comptes de démonstration

| Rôle | Matricule | Mot de passe |
|------|-----------|--------------|
| DRH (accès complet) | `DRH-ADMIN` | `defci2024` |
| Commandant d'unité | `GEN-2020-0012` | `defci2024` |
| Agent FDS | `POL-2023-0089` | `defci2024` |
| Auditeur SIGNAL-CI | `AUD-2022-0003` | `defci2024` |

### Page publique SIGNAL-CI (sans connexion)

```
http://localhost:5173/signal
```
Accessible sans authentification — tout citoyen peut signaler un abus.

---

## Structure du projet

```
defci-smart/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── api/                   # Données mock JSON (démo)
│   │   ├── agents.json
│   │   ├── mutations.json
│   │   └── signalements.json
│   ├── components/
│   │   ├── ui/                # shadcn/ui (générés)
│   │   ├── layout/            # AppShell, Sidebar, Header
│   │   └── shared/            # DataTable, StatCard, Badge, WorkflowTimeline
│   ├── pages/
│   │   ├── auth/              # Login
│   │   ├── rh/                # Agents, Fiche agent
│   │   ├── mutations/         # Workflow
│   │   ├── signal/            # Page publique SIGNAL-CI
│   │   ├── discipline/        # Dashboard auditeur
│   │   ├── portail/           # Portail agent
│   │   └── dashboard/         # KPIs ministère
│   ├── store/                 # Zustand (auth, notifications)
│   ├── hooks/                 # useAgents, useMutations, useSignalCI
│   ├── types/                 # Types TypeScript globaux
│   └── utils/                 # Formatters, matricule generator
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## Roadmap

```
Phase 1 — MVP (Semaines 1–2, concours)
├── ✅ Module 01 — RH & Carrières + matricule unique
├── ✅ Module 04 — SIGNAL-CI page publique + dashboard
├── ✅ Module 02 — Portail agent
└── ✅ Dashboard KPIs (données mock)

Phase 2 — Extension (Mois 1–6 post-concours)
├── 🕐 Backend Spring Boot + PostgreSQL réel
├── 🕐 Module 03 — Formation & Compétences complet
├── 🕐 Module 05 — Solde & Bulletins PDF
├── 🕐 Module 06 — Logistique
└── 🕐 PWA hors-ligne complète

Phase 3 — Avancé (Mois 7–18)
├── 🕐 Module 07 — SIG National (Leaflet)
├── 🕐 Module 08 — Reporting Décisionnel
├── 🕐 Module 09 — Audit & Cybersécurité (backend)
├── 🕐 Module 10 — Intelligence Artificielle (4 moteurs)
└── 🕐 Déploiement sur serveurs souverains CI
```

---

## Équipe

Projet réalisé dans le cadre du **Concours Universitaire — Digitalisation des Services Publics en Côte d'Ivoire**.

| Membre | Rôle |
|--------|------|
| [Ton nom] | Documentation, Stratégie, Maquettes, Présentation |
| [Nom coéquipier] | Développement frontend, Prototype, Déploiement |

---

## Licence

Projet open source — tous les composants utilisés (React, Vite, Tailwind, Spring Boot, PostgreSQL, Leaflet) sont sous licences libres. Aucune licence propriétaire.

---

<div align="center">

**DEFCI-SMART** — Transformons 57 000 dossiers papier en un système national intelligent au service de chaque Ivoirien.

*Concours Digitalisation des Services Publics — Côte d'Ivoire — 2025*

</div>
