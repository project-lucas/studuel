-- =============================================================================
-- Studuel — Migration 170 : borne temporelle de la série (perf + cohérence).
--
-- PROBLÈME. `current_streak` (155) construit son ensemble de jours actifs à
-- partir de TOUT l'historique de l'élève (4 tables d'activité, aucune borne
-- temporelle). Deux conséquences :
--   - PERF : chaque appel lit toutes les lignes de l'utilisateur, et
--     `friends_streaks()` l'appelle UNE FOIS PAR AMI (N+1). À mesure que les
--     tables d'activité grossissent, le mini-classement des séries devient cher.
--   - COHÉRENCE : l'app (lib/streak.ts) ne considère déjà que les 400 derniers
--     jours (`ACTIVITY_WINDOW_DAYS = 400`, `activityCutoff`) ; le SQL, lui, les
--     considérait TOUS — une série théorique > 400 j divergeait entre les deux.
--
-- CORRECTIF. On borne les 4 sous-requêtes de jours à `now() - 400 jours`,
-- miroir EXACT d'`activityCutoff` (lib/streak.ts). Effets :
--   - la marche arrière récursive ne peut plus descendre sous la borne (série
--     plafonnée à ~400, comme l'app) ;
--   - le prédicat `created_at >= …` autorise un range-scan sur l'index existant
--     `*_user_created_idx` (user_id, created_at DESC) — présent sur les 4
--     tables (003/007/009/011), donc chaque appel (y compris le N+1 de
--     friends_streaks) lit beaucoup moins de lignes.
-- Signature et sémantique (clémence « façon Duolingo ») inchangées.
--
-- NB : le N+1 structurel de friends_streaks (un appel par ami) subsiste mais
-- chaque appel est désormais borné + indexé ; une pré-agrégation ensembliste
-- ne se justifiera que si les listes d'amis deviennent très grandes.
--
-- PRÉREQUIS : 155 (current_streak). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

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
      -- Borne à 400 jours = miroir d'activityCutoff (lib/streak.ts). Une série
      -- plus longue est plafonnée à ~400, exactement comme côté app.
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

-- Reste interne (jamais appelable directement par le client) — on ré-applique
-- le REVOKE pour rester idempotent sur une exécution à froid.
REVOKE ALL ON FUNCTION public.current_streak(UUID) FROM PUBLIC;
