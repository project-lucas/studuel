-- =============================================================================
-- Scolaria — Migration 005 : tableau de révision (classes à examen)
-- Brevet (3e), bac de français écrit/oral (1re), bac (Tle)…
-- L'élève liste ses matières (avec priorité) et leurs chapitres/textes,
-- suit leur statut et voit où concentrer ses sessions.
-- PRÉREQUIS : schema.sql exécuté. Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. REVISION_SUBJECTS — les matières du tableau, avec priorité et examen visé
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.revision_subjects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  name       TEXT NOT NULL,                       -- Maths, Français, Histoire…
  exam       TEXT,                                -- brevet, bac_fr_oral, bac_spe…
  priority   TEXT NOT NULL DEFAULT 'normale'
               CHECK (priority IN ('normale', 'prioritaire', 'critique')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS revision_subjects_user_idx
  ON public.revision_subjects (user_id);

-- -----------------------------------------------------------------------------
-- 2. REVISION_ITEMS — chapitres ou textes (bac oral) d'une matière
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.revision_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.revision_subjects (id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title      TEXT NOT NULL,                       -- « Probabilités », « Le Rouge et le Noir, ch. 4 »…
  kind       TEXT NOT NULL DEFAULT 'chapitre'
               CHECK (kind IN ('chapitre', 'texte')),
  status     TEXT NOT NULL DEFAULT 'a_faire'
               CHECK (status IN ('a_faire', 'en_cours', 'a_revoir', 'maitrise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS revision_items_subject_idx
  ON public.revision_items (subject_id);
CREATE INDEX IF NOT EXISTS revision_items_user_idx
  ON public.revision_items (user_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY — chacun gère uniquement son propre tableau
-- -----------------------------------------------------------------------------
ALTER TABLE public.revision_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_items    ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "revision_subjects_all_own" ON public.revision_subjects;
CREATE POLICY "revision_subjects_all_own" ON public.revision_subjects
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "revision_items_all_own" ON public.revision_items;
CREATE POLICY "revision_items_all_own" ON public.revision_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
