-- =============================================================================
-- Studuel — Migration 188 : tour guidé post-onboarding.
--
-- PROFILES.TUTORIAL_COMPLETED : le tour (spotlights sur la nav + bulles) se
-- lance à la première connexion après l'onboarding et ne se remontre plus une
-- fois terminé ou passé. Relançable depuis Mon compte (« Revoir le tutoriel »,
-- /reviser?tour=1).
--
-- Sécurité : profiles est sous GRANT UPDATE par colonnes (003/007/008/010/016)
-- → grant ADDITIF sur la seule nouvelle colonne, comme 082 (avatar) et
-- 176 (squad_name). L'élève ne peut passer la colonne qu'à sa guise sur SA
-- ligne (RLS existante) — aucun enjeu d'économie.
--
-- PRÉREQUIS : schema.sql (profiles). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tutorial_completed BOOLEAN NOT NULL DEFAULT false;

GRANT UPDATE (tutorial_completed) ON public.profiles TO authenticated;
