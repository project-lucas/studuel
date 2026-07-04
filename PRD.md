# Product Requirements Document (PRD) - Project: Scolaria

## 1. Overview
Scolaria est une application d'apprentissage adaptatif. Le projet est actuellement en phase de transition : le layout (Sidebar + Content) est en place, nous devons maintenant implémenter la logique métier, la base de données et les fonctionnalités par niveau d'abonnement.

## 2. Technical Stack
- **Framework:** Next.js (App Router, TypeScript) — installé : 16.2.10
- **Styling:** Tailwind CSS, ShadcnUI.
- **Backend/Database:** Supabase (Auth, PostgreSQL, Storage).
- **AI Integration:** OpenAI SDK (GPT-4o).
- **Visualization:** React Flow.

## 3. Database Schema (Supabase PostgreSQL)
L'agent doit s'assurer que ces tables sont créées dans Supabase.

```sql
-- Profiles (Abonnements)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'tier1', 'tier2', 'tier3')),
  full_name TEXT
);

-- Contenu Académique
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title TEXT,
  content TEXT, -- Markdown
  grade_level TEXT, -- 6e à Terminale
  subject TEXT
);

-- IA Data
CREATE TABLE flashcards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  front TEXT,
  back TEXT
);

CREATE TABLE mind_maps (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  nodes_json JSONB,
  edges_json JSONB
);

-- Coaching
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Annexe — Décisions produit (mise à jour 2026-07-04)

> Ajouts actés en session, non issus du PRD d'origine.

### A1. Navigation (mobile first)
Barre d'onglets en bas sur mobile / sidebar sur desktop, 5 onglets dans cet ordre :
1. **Formation** — banque de vidéos (futur)
2. **Studio** — flashcards + mind maps (IA)
3. **Test** — quiz / évaluations (ex-« Library »)
4. **Planning** — organisation des révisions
5. **Habitude** — suivi type "contribution graph" GitHub des sessions de test,
   habitudes personnalisables par l'élève.

### A2. Abonnements — interprétation actuelle
- `free` : accès aux contenus marqués gratuits (`is_free = true`).
- `tier1` (**Offre 1**) et supérieurs : accès aux Tests premium.
- Visiteur non connecté : traité comme `free` (catalogue visible, contenu premium verrouillé).

### A3.bis Tableau de révision (onglet Planning)
Fonctionnalité clé pour les classes à examen (3e → brevet, 1re → bac de
français écrit/oral, Tle → bac) :
- L'élève liste ses **matières** avec une **priorité** (normale / prioritaire /
  critique) et l'**examen visé** (brevet, bac français écrit/oral, spécialité,
  philo, grand oral).
- Chaque matière contient des **éléments** : *chapitres* ou *textes* (bac oral),
  avec un statut cliquable : À faire → En cours → À revoir → Maîtrisé.
- Le tableau trie les matières critiques en premier, affiche la progression
  par matière et signale les **urgences** (éléments non maîtrisés en matière
  critique) pour orienter les sessions de révision.
- Tables : `revision_subjects`, `revision_items` (RLS owner-only,
  migration 005).

### A5. Onboarding, flashcards du programme et gamification (migration 007)
Inspirations assumées : Wooflash/Quizlet (flashcards), Duolingo/HabitKit
(série, sons, objectif quotidien).
- **Onboarding** (`/onboarding`, déclenché à la première connexion) : choix de
  la classe (6e → Tle) et de l'objectif quotidien (1-3 sessions/jour), stockés
  dans `profiles` (`grade_level`, `daily_goal`, `onboarded`).
- **Personnalisation** : Test et Studio filtrent par défaut sur la classe de
  l'élève (lien « Voir toutes les classes » pour élargir).
- **Studio = flashcards du programme** : decks par classe/matière
  (`flashcard_decks` + `deck_cards`, gating Offre 1 comme les quiz), lecteur à
  carte 3D, boucle Wooflash (les cartes « À revoir » reviennent en fin de pile
  jusqu'à maîtrise), score « su du premier coup ».
- **Gamification** : chaque quiz ou session de flashcards terminé =
  1 activité (`test_sessions` + `study_sessions`). Page Habitude : anneau
  hebdomadaire L→D qui se remplit (mode série), streak 🔥 avec grâce d'un
  jour, objectif du jour, heatmap 26 semaines fusionnée.
- **Sound design** : sons synthétisés WebAudio (flip, juste/faux, victoire),
  préférence muet en localStorage, bouton sur les lecteurs.

### A6. Refonte Réviser — navigation à 3 niveaux (migration 008)
- **Niveau 1 `/reviser`** : « Mes matières » — grille 2 colonnes de cartes
  arrondies (émoji sticker + nom), groupée selon la classe (Collège = section
  unique ; Lycée = Tronc commun / Spécialités / Options). Bouton « Éditer »
  → sélection persistée dans `profiles.selected_subjects` (jsonb). Barre
  d'input IA flottante (placeholder).
- **Niveau 2 `/reviser/[subject]`** : header pastel de la matière (motif
  grille), recherche client, chapitres du programme du niveau de l'élève.
- **Niveau 3 `/reviser/[subject]/[chapter]`** : leçons (vignette mascotte 🦉,
  bouton « Leçon » → contenu, bouton play → quiz rattaché via
  `quizzes.lesson_id`). Page leçon en 4e segment d'URL.
- **Données** : `subjects` (slug, icon, color, category, levels[]),
  `chapters` (par matière ET niveau), `lessons` (2 placeholders/chapitre
  générés). Seed Éduscol : 15 matières, ~280 chapitres couvrant 6e → Tle.
- **Règles** : contenu filtré par `profiles.grade_level` ; lecture
  authentifiée (RLS) ; quiz premium toujours gatés par `subscription_tier`.
- L'ancien catalogue `/test` redirige vers `/reviser` ; les sessions de quiz
  restent sur `/test/[id]`.

### A7. Onglet Moi (migration 010) — structure de travail
Navigation : Formation · Studio · 🏠 Réviser · 🧑 Moi · Coaching (ex-Planning).
- **Score de structure** (0-100) : moyenne des taux de complétion des
  habitudes sur 7 jours, cercle de progression + libellé d'état.
- **Habitudes clés** : catalogue prédéfini (8 entrées avec rationale
  scientifique affiché) — sommeil, révision quotidienne (validation AUTO via
  les sessions), test sur trajets (AUTO si quiz complété dans
  `profiles.commute_slots`), sport, lecture, écrans, petit-déj, téléphone.
  Check manuel quotidien pour les manuelles ; auto-validation « à la volée »
  au chargement de la page.
- **Structure ↔ notes** : courbe recharts 8 semaines (score de structure vs
  moyenne des quiz) — la preuve que la structure paye.
- **Records & badges** : plus longue série, sessions max/jour, habitude la
  plus ancrée ; 8 badges à jalons (7/30/100 jours, ancrage 21 j, 10 quiz en
  trajets…), débloqués en couleur / verrouillés grisés, évaluation
  idempotente à chaque visite.
- Tables : `habit_catalog`, `habits`, `habit_logs`, `badges`, `user_badges`
  (+ `profiles.commute_slots`). L'ancien onglet Habitude redirige vers /moi.

### A8. Le Défi au centre + XP (migration 011)
Recentrage produit : Scolaria n'est pas une app de révision, c'est un jeu
quotidien de 3 minutes qui utilise le programme scolaire. Pensé pour l'élève
peu motivé (gamer) : il ne choisit rien, il joue.
- **Navigation** : ✨ IA · 🏠 Réviser · **⚡ Défi (centre, bouton surélevé,
  onglet par défaut)** · 🧑 Moi · Coaching. Formation fusionne dans Réviser
  (redirection) ; Studio reste accessible hors nav.
- **Le Défi** (`/defi`, table `challenge_sessions`) : session auto-générée
  ~8 items (questions de quiz + flashcards), chapitres les plus faibles
  d'abord (via la maîtrise), gros bouton GO, +XP par bonne réponse,
  bonus de fin, valide la journée (série + habitude révision).
- **XP & niveaux** (`lib/xp.ts`) : dérivés de l'activité réelle (aucun
  compteur stocké) — quiz 10/bonne réponse, cartes 5, leçon 15, défi
  enregistré. 10 niveaux à titres fun (Nouveau 🐣 → Légende 👑).
- **IA** (`/ia`) : placeholder du tuteur GPT-4o.
- À venir (pack gamification) : gel de série ❄️, mini-jeu Match, mascotte
  réactive.

### A3. Module Test (v1)
- Tables `quizzes` (catalogue public) + `quiz_questions` (contenu, protégé par RLS).
- Types de questions : QCM (`mcq`) et Vrai/Faux (`true_false`).
- Parcours : liste par matière → sélection d'un quiz → session question par question
  avec correction immédiate et score final.
