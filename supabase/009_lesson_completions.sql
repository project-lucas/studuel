-- =============================================================================
-- Scolaria — Migration 009 : leçons terminées
-- Terminer une leçon fait progresser le chapitre (plancher 30 %) et valide
-- la journée dans la série — le quiz reste le seul moyen d'aller au-delà.
-- PRÉREQUIS : 008_reviser.sql exécuté. Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.lesson_completions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  lesson_id  UUID NOT NULL REFERENCES public.lessons (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS lesson_completions_user_idx
  ON public.lesson_completions (user_id, created_at DESC);

ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lesson_completions_select_own" ON public.lesson_completions;
CREATE POLICY "lesson_completions_select_own" ON public.lesson_completions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "lesson_completions_insert_own" ON public.lesson_completions;
CREATE POLICY "lesson_completions_insert_own" ON public.lesson_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
