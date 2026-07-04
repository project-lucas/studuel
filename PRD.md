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

### A3. Module Test (v1)
- Tables `quizzes` (catalogue public) + `quiz_questions` (contenu, protégé par RLS).
- Types de questions : QCM (`mcq`) et Vrai/Faux (`true_false`).
- Parcours : liste par matière → sélection d'un quiz → session question par question
  avec correction immédiate et score final.
