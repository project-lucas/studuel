-- =============================================================================
-- Scolaria — Migration 011 : le Défi (session quotidienne de ~3 minutes)
-- Chaque défi terminé compte comme une session (série, habitudes, XP).
-- PRÉREQUIS : schema.sql exécuté. Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.challenge_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  score      INT  NOT NULL,             -- bonnes réponses
  total      INT  NOT NULL,             -- items du défi
  xp         INT  NOT NULL DEFAULT 0,   -- XP gagnés sur ce défi
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS challenge_sessions_user_created_idx
  ON public.challenge_sessions (user_id, created_at DESC);

ALTER TABLE public.challenge_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "challenge_sessions_select_own" ON public.challenge_sessions;
CREATE POLICY "challenge_sessions_select_own" ON public.challenge_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "challenge_sessions_insert_own" ON public.challenge_sessions;
CREATE POLICY "challenge_sessions_insert_own" ON public.challenge_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
