-- =============================================================================
-- Studuel — Migration 317 : LE CARNET REJOINT LE RESTE DE L'APP (lot 5).
--
-- Constat de l'audit (docs/audit-carnet.md, C4) : le carnet était une ÎLE.
-- Réviser ses propres cartes ne donnait aucun XP, ne comptait pas dans la
-- série, n'existait pour aucune autre partie du produit. Un élève qui révise
-- une heure sur son carnet voyait sa flamme s'éteindre le soir même.
--
-- C'est pourtant le seul terrain où ni Anki ni Wooflash ne peuvent nous
-- suivre : eux n'ont pas de monde autour de la carte.
--
-- 1. LA SÉRIE compte les sessions de carnet (`current_streak`).
-- 2. L'XP est versée à la fin d'une session (source `flashcards`, déjà prévue
--    par `wallet_award_xp` — elle n'était simplement jamais appelée depuis le
--    carnet).
--
-- PRÉREQUIS : 155 + 170 (current_streak), 186 (carnet_review_sessions),
-- 192 (wallet_award_xp), 315 (course_id facultatif). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- Miroir EXACT de la 170, avec une cinquième source : les sessions de carnet.
-- On garde la borne à 400 jours (miroir d'activityCutoff, lib/streak.ts) et la
-- marche récursive à l'identique — seule la liste des activités change.
CREATE OR REPLACE FUNCTION public.current_streak(p_user UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE
  days AS (
    SELECT DISTINCT ((created_at AT TIME ZONE 'UTC')::date) AS d
    FROM (
      SELECT created_at FROM public.test_sessions
        WHERE user_id = p_user AND created_at >= now() - INTERVAL '400 days'
      UNION ALL
      SELECT created_at FROM public.study_sessions
        WHERE user_id = p_user AND created_at >= now() - INTERVAL '400 days'
      UNION ALL
      SELECT created_at FROM public.lesson_completions
        WHERE user_id = p_user AND created_at >= now() - INTERVAL '400 days'
      UNION ALL
      SELECT created_at FROM public.challenge_sessions
        WHERE user_id = p_user AND created_at >= now() - INTERVAL '400 days'
      UNION ALL
      -- LE CARNET. `started_at` et non `ended_at` : une session commencée est
      -- du travail, même si l'élève a fermé l'onglet avant le bilan.
      SELECT started_at AS created_at FROM public.carnet_review_sessions
        WHERE user_id = p_user AND started_at >= now() - INTERVAL '400 days'
    ) a
  ),
  anchor AS (
    SELECT CASE
      WHEN EXISTS (SELECT 1 FROM days WHERE d = (now() AT TIME ZONE 'UTC')::date)
        THEN (now() AT TIME ZONE 'UTC')::date
      WHEN EXISTS (SELECT 1 FROM days WHERE d = ((now() AT TIME ZONE 'UTC')::date - 1))
        THEN ((now() AT TIME ZONE 'UTC')::date - 1)
      ELSE NULL
    END AS a
  ),
  walk AS (
    SELECT a AS d FROM anchor WHERE a IS NOT NULL
    UNION ALL
    SELECT w.d - 1
    FROM walk w
    WHERE EXISTS (SELECT 1 FROM days WHERE days.d = w.d - 1)
  )
  SELECT COUNT(*)::int FROM walk;
$$;

REVOKE ALL ON FUNCTION public.current_streak(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_streak(UUID) TO authenticated;

-- L'index qui rend la nouvelle branche aussi peu chère que les quatre autres :
-- sans lui, chaque calcul de série balaierait toutes les sessions de carnet.
CREATE INDEX IF NOT EXISTS carnet_review_sessions_user_started_idx
  ON public.carnet_review_sessions (user_id, started_at DESC);
