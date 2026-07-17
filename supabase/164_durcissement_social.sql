-- =============================================================================
-- Studuel — Migration 164 : durcissements post-revue du backend social
--
-- Trois corrections issues de la revue de correctness du 2026-07-17, toutes en
-- CREATE OR REPLACE à signature inchangée (modèle 088 : on répare une fonction
-- déjà en prod sans toucher ses appelants) :
--
-- 1. friend_preview (163) — ne renvoie plus que le PRÉNOM. La fonction
--    renvoyait profiles.full_name entier : le nom de famille fuyait dans la
--    réponse réseau alors que l'UI n'affiche que le prénom, et que toutes les
--    autres RPC croisées (159/160) exposent déjà split_part(full_name,' ',1).
--    App utilisée par des mineurs : minimum d'exposition.
--
-- 2. school_tournament_standings (162) — garde de cycle NULL-safe. Avec
--    p_level NULL, « NOT IN ('college','lycee') » vaut NULL (pas TRUE) : la
--    garde ne court-circuitait pas et la fonction répondait comme pour
--    'lycee' au lieu de NULL.
--
-- 3. process_league_rollover (161) — rattrapage des lundis manqués. La
--    fonction ne traitait que LA semaine précédant now() : un cron raté
--    (panne, gel de déploiement) perdait définitivement les promotions/
--    relégations de cette semaine-là. Elle rejoue désormais chaque semaine
--    non journalisée, de la plus ancienne à la dernière révolue.
--
-- PRÉREQUIS : 161, 162, 163. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------------------------ friend_preview
CREATE OR REPLACE FUNCTION public.friend_preview(p_code TEXT)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT split_part(full_name, ' ', 1) FROM public.profiles
   WHERE friend_code = upper(trim(p_code));
$$;

GRANT EXECUTE ON FUNCTION public.friend_preview(TEXT) TO authenticated;

-- ------------------------------------------- school_tournament_standings
CREATE OR REPLACE FUNCTION public.school_tournament_standings(p_level TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_now    TIMESTAMPTZ := now();
  v_monday TIMESTAMPTZ := (date_trunc('week', (now() AT TIME ZONE 'UTC'))) AT TIME ZONE 'UTC';
  v_sat    TIMESTAMPTZ := v_monday + INTERVAL '5 days';
  v_start  TIMESTAMPTZ;
  v_end    TIMESTAMPTZ;
  v_open   BOOLEAN;
  v_school UUID;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  -- NULL-safe : p_level NULL doit répondre NULL, pas « comme lycée ».
  IF p_level IS NULL OR p_level NOT IN ('college', 'lycee') THEN
    RETURN NULL;
  END IF;

  -- Week-end en cours (samedi/dimanche), sinon le DERNIER week-end joué.
  IF v_now >= v_sat THEN
    v_start := v_sat;
    v_open  := true;
  ELSE
    v_start := v_sat - INTERVAL '7 days';
    v_open  := false;
  END IF;
  v_end := v_start + INTERVAL '2 days';

  SELECT CASE WHEN p_level = 'college' THEN p.college_school_id
              ELSE p.lycee_school_id END
    INTO v_school
    FROM public.profiles p
   WHERE p.id = v_user;

  RETURN (
    WITH members AS (
      SELECT p.id AS user_id,
             CASE WHEN p_level = 'college' THEN p.college_school_id
                  ELSE p.lycee_school_id END AS school_id
        FROM public.profiles p
       WHERE (CASE WHEN p_level = 'college' THEN p.college_school_id
                   ELSE p.lycee_school_id END) IS NOT NULL
    ),
    scored AS (
      SELECT m.school_id,
             m.user_id,
             COALESCE((
               SELECT sum(cs.xp) FROM public.challenge_sessions cs
                WHERE cs.user_id = m.user_id
                  AND cs.created_at >= v_start AND cs.created_at < v_end
             ), 0)::int AS xp
        FROM members m
    ),
    by_school AS (
      SELECT s.school_id,
             sum(s.xp)::int                        AS points,
             count(*) FILTER (WHERE s.xp > 0)::int AS students
        FROM scored s
       GROUP BY s.school_id
    )
    SELECT jsonb_build_object(
      'tournament_start', v_start::date,
      'is_open', v_open,
      'my_school_id', v_school,
      'entries', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'school_id', b.school_id,
                 'name', sc.name,
                 'city', sc.city,
                 'points', b.points,
                 'students', b.students))
          FROM (SELECT * FROM by_school
                 ORDER BY points DESC, school_id
                 LIMIT 20) b
          JOIN public.schools sc ON sc.id = b.school_id), '[]'::jsonb)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.school_tournament_standings(TEXT) TO authenticated;

-- --------------------------------------------------- process_league_rollover
-- Rejoue chaque semaine révolue non journalisée (rattrapage d'un cron manqué),
-- dans l'ordre chronologique — les tiers évoluent semaine après semaine comme
-- si le cron n'avait jamais raté. Premier lancement (journal vide) : seule la
-- dernière semaine révolue est traitée, comme avant.
CREATE OR REPLACE FUNCTION public.process_league_rollover()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_this  TIMESTAMPTZ := (date_trunc('week', (now() AT TIME ZONE 'UTC'))) AT TIME ZONE 'UTC';
  v_prev  TIMESTAMPTZ := v_this - INTERVAL '7 days';
  v_last  DATE;
  v_week  TIMESTAMPTZ;
  v_end   TIMESTAMPTZ;
  v_moved INTEGER := 0;
  v_total INTEGER := 0;
  v_weeks JSONB := '[]'::jsonb;
BEGIN
  SELECT max(week_start) INTO v_last FROM public.league_rollovers;
  IF v_last IS NULL THEN
    v_week := v_prev; -- premier lancement : pas d'historique à rejouer
  ELSE
    v_week := ((v_last + 7)::timestamp) AT TIME ZONE 'UTC';
  END IF;

  WHILE v_week <= v_prev LOOP
    v_end := v_week + INTERVAL '7 days';

    IF NOT EXISTS (SELECT 1 FROM public.league_rollovers
                    WHERE week_start = v_week::date) THEN
      WITH lastweek AS (
        SELECT p.id, COALESCE(p.league_tier, 0) AS tier,
               COALESCE((
                 SELECT sum(cs.xp) FROM public.challenge_sessions cs
                  WHERE cs.user_id = p.id
                    AND cs.created_at >= v_week AND cs.created_at < v_end
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

      INSERT INTO public.league_rollovers (week_start, moved)
      VALUES (v_week::date, v_moved);

      v_total := v_total + v_moved;
      v_weeks := v_weeks || to_jsonb(v_week::date);
    END IF;

    v_week := v_week + INTERVAL '7 days';
  END LOOP;

  IF v_weeks = '[]'::jsonb THEN
    RETURN jsonb_build_object('already', true, 'week_start', v_prev::date);
  END IF;
  RETURN jsonb_build_object(
    'ok', true,
    'week_start', v_prev::date,
    'weeks', v_weeks,
    'moved', v_total
  );
END;
$$;

-- Réservé au cron (service_role), comme en 161 (CREATE OR REPLACE conserve
-- les ACL, on les réaffirme par sûreté).
REVOKE ALL ON FUNCTION public.process_league_rollover() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.process_league_rollover() TO service_role;
