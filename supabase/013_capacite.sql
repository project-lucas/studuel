-- =============================================================================
-- Scolaria — Migration 013 : bilan de capacités
-- Après l'onboarding, l'élève répond à un questionnaire d'habitudes
-- d'apprentissage (hydratation, sucre, se tester, révision espacée…).
-- Le résultat — « tu es à X % de tes capacités » — est stocké sur le profil :
--   profiles.capacity_quiz = {"answers": {"id": 0-3, …}, "score": 0-100,
--                             "date": "YYYY-MM-DD"}
-- PRÉREQUIS : 001 exécutée. Idempotent.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS capacity_quiz JSONB;
