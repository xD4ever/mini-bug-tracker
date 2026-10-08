# BugBoard — Mini Bug Tracker

> Application web moderne de gestion et suivi d'anomalies (bug tracker) développée avec **Vue 3 (Composition API / `<script setup>`)**, **TypeScript**, **Vite** et **Vue Router**.

---

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture & Composants](#-architecture--composants)
- [Modélisation & DTOs](#-modélisation--dtos)
- [API & Intégration HTTP](#-api--intégration-http)
- [Installation et Démarrage](#-installation-et-démarrage)
- [Variables d'Environnement](#-variables-denvironnement)
- [Qualité & Responsive](#-qualité--responsive)

---

## ✨ Fonctionnalités

1. **Tableau de bord interactif** :
   - Consultation de la liste des tickets sous forme de grille de cartes responsive.
   - Filtre instantané par mot-clé (titre) avec recherche debouncée (300ms) pour économiser la bande passante.
   - Filtre par statut (`open`, `in_progress`, `resolved`) et par priorité (`low`, `medium`, `high`).
   - Bouton de réinitialisation rapide des filtres (`v-show`).
   - Pagination serveur dynamique avec contrôles première/dernière page, précédent/suivant et numéros de pages.
   - Indicateurs de chargement (loaders) et affichage d'état vide convivial.

2. **Création d'un ticket (Vue Formulaire)** :
   - Formulaire réactif avec validation client (`v-model`, champs requis, compteurs de caractères dynamiques).
   - Validation en temps réel de la longueur minimale (description ≥ 15 caractères).
   - Gestion des états d'enregistrement et redirections fluides sans rechargement de page.

3. **Vue détaillée & Gestion CRUD** :
   - Affichage complet des informations et métadonnées formatées (dates de création et modification en français).
   - Modification réactive du statut et de la priorité via des requêtes HTTP `PATCH` en direct avec retour visuel immédiat.
   - Suppression sécurisée via une boîte de dialogue modale de confirmation (`DELETE`).
   - Système de notifications Toasts (succès, erreurs, alertes) avec animations douces.

4. **UI & Thème** :
   - Code couleur dynamique pour les priorités (Haute en rouge, Moyenne en orange, Faible en vert) et les statuts.
   - Support complet du **mode sombre / clair** (Dark Mode persistant via LocalStorage).
   - Interface 100% responsive adaptée aux mobiles, tablettes et ordinateurs de bureau.

---

## 🏗️ Architecture & Composants

Le projet respecte une architecture modulaire et découpe clairement les responsabilités, sans code plat dans `App.vue` :

```
src/
├── assets/                  # Feuilles de styles CSS globales et thèmes
│   ├── base.css
│   └── main.css             # Design tokens, variables CSS, Dark mode, composants UI
├── components/              # Composants réutilisables
│   ├── AppHeader.vue        # En-tête avec navigation, branding et toggle thème
│   ├── ConfirmModal.vue     # Boîte de dialogue modale de confirmation (Teleport)
│   ├── FilterBar.vue        # Barre de filtres et recherche réactive
│   ├── PaginationBar.vue    # Composant autonome de pagination serveur
│   ├── PriorityBadge.vue    # Badge dynamique de priorité avec pastille de couleur
│   ├── StatusBadge.vue      # Badge dynamique de statut
│   ├── TicketCard.vue       # Carte d'affichage d'un ticket pour la grille
│   └── ToastNotification.vue# Système de notifications toasts réactives
├── composables/             # Logique réutilisable (Composition API)
│   ├── useTheme.ts          # Gestion du thème sombre / clair persistant
│   └── useToast.ts          # Gestion globale des notifications toast
├── models/                  # Modèles de données & DTOs TypeScript
│   └── Ticket.ts            # Classe Ticket, DTOs de requête/réponse et typages
├── router/                  # Configuration du routage SPA
│   └── index.ts             # Routes Vue Router (dashboard, ticket-create, ticket-detail)
├── services/                # Couche d'accès aux données (Fetch API)
│   └── ticketApi.ts         # Service CRUD HTTP complet avec gestion d'erreurs
├── views/                   # Vues principales de l'application
│   ├── DashboardView.vue    # Vue d'accueil : liste paginée, filtres, grille
│   ├── TicketCreateView.vue # Vue formulaire : création d'un ticket
│   └── TicketDetailView.vue # Vue détaillée : consultation, édition PATCH, suppression
├── App.vue                  # Composant racine orchestrateur (Shell + Header + Toasts)
└── main.ts                  # Point d'entrée de l'application Vue 3
```

---

## 📦 Modélisation & DTOs

La modélisation s'appuie sur TypeScript et des classes / DTOs explicites :

- **`Ticket` (Classe)** : Encapsule les données d'un ticket, normalise les identifiants (Hydra IRIs ou IDs scalaires), expose des getters de formatage (`priorityLabel`, `statusLabel`, `formattedCreatedAt`, `formattedUpdatedAt`, `priorityClass`, `statusClass`, `isResolved`, `isHighPriority`).
- **`CreateTicketDto`** : Typage strict pour l'envoi des données lors de la création (`title`, `description`, `priority`).
- **`UpdateTicketDto`** : Typage partiel pour les modifications ciblées (`PATCH`).
- **`TicketFilterDto`** : Structure pour les requêtes de recherche et pagination.
- **`PaginatedTicketsDto`** : Structure normalisée des réponses paginées.

---

## 🌐 API & Intégration HTTP

Le service `ticketApi.ts` utilise l'API standard `fetch` et prend en charge toutes les opérations CRUD :

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/tickets?page=1&status=...&priority=...&title=...` | Récupération paginée et filtrée |
| `GET` | `/tickets/:id` | Récupération d'un ticket spécifique |
| `POST` | `/tickets` | Création d'un ticket |
| `PATCH` | `/tickets/:id` | Mise à jour partielle (statut, priorité, etc.) |
| `DELETE` | `/tickets/:id` | Suppression définitive du ticket |

Une gestion robuste des erreurs réseau et HTTP (statuts 4xx, 5xx) extrait les messages d'erreur détaillés (RFC 7807, Hydra, REST standard) pour les afficher sous forme d'alertes ou de toasts.

---

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 18+ recommandée)
- npm ou pnpm / yarn

### Installation des dépendances
```sh
npm install
```

### Lancement du serveur de développement
```sh
npm run dev
```

L'application est accessible par défaut sur `http://localhost:5173`.

### Compilation pour la production
```sh
npm run build
```

### Vérification des types TypeScript
```sh
npm run type-check
```

---

## ⚙️ Variables d'Environnement

Pour pointer vers une URL d'API spécifique (ex. backend Symfony/API Platform ou Mock Server) :

Créez un fichier `.env` ou `.env.local` à la racine :
```env
VITE_API_URL=http://localhost:8000/api
```
*(Par défaut, les requêtes sont envoyées vers `/api`)*.

---

## 🎯 Directives & Réactivité Vue 3

- **`v-model`** : Utilisé pour la synchronisation bidirectionnelle sur les champs de formulaire (`TicketCreateView`) et sur les filtres personnalisés (`FilterBar`).
- **`v-for` & `:key`** : Rendu optimal des listes avec identifiants stables et uniques (`:key="ticket.id"`).
- **`v-if` / `v-else-if` / `v-else`** : Gestion conditionnelle des états (chargement, erreur, liste vide, contenu disponible).
- **`v-show`** : Affichage conditionnel des éléments fréquents (ex: bouton de réinitialisation des filtres).
