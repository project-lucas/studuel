-- =============================================================================
-- Scolaria — Migration 022 : examens blancs. Une ligne par examen passé :
-- score global + bilan par chapitre (JSON, calculé par l'application).
-- L'XP passe par test_sessions (insérée par l'action serveur) — cette table
-- sert l'historique (« ton dernier examen blanc : 65 % ») et la progression
-- vers l'épreuve mesurée sur des performances réelles.
-- PRÉREQUIS : 001 exécutée. Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.exam_blanc_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  score      INT  NOT NULL CHECK (score >= 0),
  total      INT  NOT NULL CHECK (total >= 0 AND score <= total),
  report     JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS exam_blanc_sessions_user_idx
  ON public.exam_blanc_sessions (user_id, created_at DESC);

ALTER TABLE public.exam_blanc_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exam_blanc_select_own" ON public.exam_blanc_sessions;
CREATE POLICY "exam_blanc_select_own" ON public.exam_blanc_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "exam_blanc_insert_own" ON public.exam_blanc_sessions;
CREATE POLICY "exam_blanc_insert_own" ON public.exam_blanc_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT ON public.exam_blanc_sessions TO authenticated;
