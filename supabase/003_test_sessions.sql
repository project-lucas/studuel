-- =============================================================================
-- Scolaria — Migration 003 : sessions de test (Habitude) + durcissement profiles
-- PRÉREQUIS : schema.sql et 002_quizzes.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : réexécutable sans erreur.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TEST_SESSIONS — chaque quiz terminé alimente l'historique (heatmap Habitude)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.test_sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  quiz_id    UUID REFERENCES public.quizzes (id) ON DELETE SET NULL,
  score      INT  NOT NULL,
  total      INT  NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS test_sessions_user_created_idx
  ON public.test_sessions (user_id, created_at DESC);

ALTER TABLE public.test_sessions ENABLE ROW LEVEL SECURITY;

-- Chacun voit et enregistre uniquement ses propres sessions.
DROP POLICY IF EXISTS "test_sessions_select_own" ON public.test_sessions;
CREATE POLICY "test_sessions_select_own" ON public.test_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "test_sessions_insert_own" ON public.test_sessions;
CREATE POLICY "test_sessions_insert_own" ON public.test_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2. DURCISSEMENT PROFILES — un utilisateur ne doit PAS pouvoir changer
--    lui-même son niveau d'abonnement via l'API (auto-upgrade gratuit !).
--    On limite le droit UPDATE à la seule colonne full_name.
-- -----------------------------------------------------------------------------
REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT  UPDATE (full_name) ON public.profiles TO authenticated;
