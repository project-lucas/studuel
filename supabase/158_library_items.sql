-- =============================================================================
-- Studuel — Migration 158 : « Ma bibliothèque » — contenus créés par l'élève
-- library_items : les fiches de révision, quiz et cartes mentales que l'élève
-- CRÉE lui-même (à distinguer du contenu de catalogue, admin). Un seul type de
-- table, discriminé par `kind`, le détail vivant dans `content` (JSONB) selon le
-- type. Accessible depuis Réviser → « Ma bibliothèque ».
--
-- Formes de `content` (JSONB) selon `kind` :
--   fiche : { "markdown": "..." }
--   quiz  : { "questions": [ { "question": "...", "options": ["...","..."],
--                             "correct_index": 0, "explanation": "..."|null }, … ] }
--   carte : { "centre": "...", "branches": [ { "titre": "...",
--                                             "enfants": ["...", …] }, … ] }
--   (la forme « carte » = MindMapData, rendue par le composant MindMap existant.)
--
-- Sécurité : RLS owner-only (auth.uid() = user_id) sur TOUS les droits — même
-- idiome que flashcards / mind_maps. CRUD direct sous RLS (pas de RPC : pas de
-- lecture croisée, chacun ne touche que SES contenus).
--
-- PRÉREQUIS : schema.sql (profiles). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.library_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('fiche', 'quiz', 'carte')),
  title      TEXT NOT NULL DEFAULT 'Sans titre',
  subject    TEXT,                          -- slug de matière, facultatif
  content    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS library_items_user_kind_idx
  ON public.library_items (user_id, kind, updated_at DESC);

ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

-- Le propriétaire a tous les droits sur SES contenus (lecture/création/édition/
-- suppression) ; personne d'autre n'y accède.
DROP POLICY IF EXISTS "library_items_all_own" ON public.library_items;
CREATE POLICY "library_items_all_own" ON public.library_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
