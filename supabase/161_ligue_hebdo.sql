-- =============================================================================
-- Studuel — Migration 161 : ligue hebdomadaire réelle
-- Débranche le mock de la ligue du Défi. Principe :
--   - L'XP de la semaine est CALCULÉE (somme de challenge_sessions.xp depuis le
--     lundi) → aucun stockage/reset à gérer pour le classement courant.
--   - Le palier (league_tier 0..5 : Bronze→Maître) est stocké sur profiles.
--   - Chaque lundi, un CRON appelle process_league_rollover() : dans chaque
--     palier, les 5 premiers de la semaine écoulée montent, les 5 derniers
--     descendent. Idempotent (journal league_rollovers).
--
-- Sécurité : league_standings() est en SECURITY DEFINER (lecture croisée), gardé
-- par auth.uid(). process_league_rollover() n'est exécutable QUE par service_role
-- (le cron) — révoqué de PUBLIC.
--
-- PRÉREQUIS : schema.sql (profiles), 011 (challenge_sessions.xp). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS league_tier SMALLINT NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_league_tier_range;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_league_tier_range CHECK (league_tier BETWEEN 0 AND 5);

CREATE INDEX IF NOT EXISTS profiles_league_tier_idx
  ON public.profiles (league_tier);

-- Journal des semaines déjà traitées (idempotence du rollover).
CREATE TABLE IF NOT EXISTS public.league_rollovers (
  week_start   DATE PRIMARY KEY,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  moved        INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE public.league_rollovers ENABLE ROW LEVEL SECURITY;
-- Aucune policy : seules les fonctions DEFINER / le service_role y touchent.

-- ------------------------------------------------------- league_standings
-- Classement de MON palier pour la semaine en cours (XP calculée depuis lundi).
-- JSONB { tier, week_start, my_rank, total, entries:[{id,name,weekly_xp,rank}] }
-- (top 30). Prénom seul.
CREATE OR REPLACE FUNCTION public.league_standings()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_tier  SMALLINT;
  v_start TIMESTAMPTZ := (date_trunc('week', (now() AT TIME ZONE 'UTC'))) AT TIME ZONE 'UTC';
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  SELECT COALESCE(league_tier, 0) INTO v_tier FROM public.profiles WHERE id = v_user;

  RETURN (
    WITH members AS (
      SELECT p.id,
             split_part(COALESCE(p.full_name, 'Élève'), ' ', 1) AS name,
             COALESCE((
               SELECT sum(cs.xp) FROM public.challenge_sessions cs
                WHERE cs.user_id = p.id AND cs.created_at >= v_start
             ), 0)::int AS weekly_xp
        FROM public.profiles p
       WHERE COALESCE(p.league_tier, 0) = v_tier
    ),
    ranked AS (
      SELECT *, ROW_NUMBER() OVER (ORDER BY weekly_xp DESC, id) AS rank FROM members
    )
    SELECT jsonb_build_object(
      'tier', v_tier,
      'week_start', v_start::date,
      'total', (SELECT count(*) FROM ranked),
      'my_rank', (SELECT rank FROM ranked WHERE id = v_user),
      'entries', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'id', id, 'name', name, 'weekly_xp', weekly_xp, 'rank', rank))
          FROM (SELECT * FROM ranked ORDER BY rank LIMIT 30) t), '[]'::jsonb)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.league_standings() TO authenticated;

-- -------------------------------------------------- process_league_rollover
-- Traite la semaine ÉCOULÉE (lundi précédent) : par palier, +1 aux 5 premiers,
-- −1 aux 5 derniers (si le palier compte > 10 joueurs, pour ne pas vider les
-- petits paliers). Idempotent (journal). Réservé au service_role (le cron).
CREATE OR REPLACE FUNCTION public.process_league_rollover()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_this  TIMESTAMPTZ := (date_trunc('week', (now() AT TIME ZONE 'UTC'))) AT TIME ZONE 'UTC';
  v_prev  TIMESTAMPTZ := v_this - INTERVAL '7 days';
  v_week  DATE := v_prev::date;
  v_moved INTEGER := 0;
BEGIN
  IF EXISTS (SELECT 1 FROM public.league_rollovers WHERE week_start = v_week) THEN
    RETURN jsonb_build_object('already', true, 'week_start', v_week);
  END IF;

  WITH lastweek AS (
    SELECT p.id, COALESCE(p.league_tier, 0) AS tier,
           COALESCE((
             SELECT sum(cs.xp) FROM public.challenge_sessions cs
              WHERE cs.user_id = p.id
                AND cs.created_at >= v_prev AND cs.created_at < v_this
           ), 0) AS xp
      FROM public.profiles p
  ),
  ranked AS (
    SELECT id, tier, xp,
           ROW_NUMBER() OVER (PARTITION BY tier ORDER BY xp DESC, id) AS rank_top,
           ROW_NUMBER() OVER (PARTITION BY tier ORDER BY xp ASC, id)  AS rank_bottom,
           COUNT(*)     OVER (PARTITION BY tier)                       AS tier_size
      FROM lastweek
  ),
  moves AS (
    SELECT id, tier,
      CASE
        WHEN rank_top <= 5 AND tier < 5 THEN (tier + 1)::smallint
        WHEN rank_bottom <= 5 AND tier > 0 AND tier_size > 10 THEN (tier - 1)::smallint
        ELSE tier
      END AS new_tier
      FROM ranked
  ),
  applied AS (
    UPDATE public.profiles p
       SET league_tier = m.new_tier
      FROM moves m
     WHERE p.id = m.id AND m.new_tier <> m.tier
    RETURNING p.id
  )
  SELECT count(*) INTO v_moved FROM applied;

  INSERT INTO public.league_rollovers (week_start, moved) VALUES (v_week, v_moved);
  RETURN jsonb_build_object('ok', true, 'week_start', v_week, 'moved', v_moved);
END;
$$;

-- Réservé au cron (service_role) : on retire l'accès par défaut à PUBLIC.
REVOKE ALL ON FUNCTION public.process_league_rollover() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.process_league_rollover() TO service_role;
