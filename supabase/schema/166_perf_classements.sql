-- =============================================================================
-- Studuel — Migration 166 : performance des RPC de classement (revue perf du
-- 2026-07-17). Aucune sémantique ne change — mêmes formes JSONB, mêmes rangs.
--
-- 1. Index challenge_sessions (created_at) : les agrégats « depuis lundi » /
--    « du week-end » filtrent par date seule — l'index existant
--    (user_id, created_at) ne les sert pas.
-- 2. league_standings (161) : la sous-requête corrélée (1 sum par élève du
--    palier) devient UNE pré-agrégation jointe — challenge_sessions n'est
--    scannée qu'une fois, quel que soit le nombre d'élèves.
-- 3. school_tournament_standings (162→164) : même réécriture (elle scannait
--    un sum par élève scolarisé de TOUT le cycle) ; conserve la garde
--    NULL-safe introduite en 164.
-- 4. national_ranking (159) : mon rang ne trie plus toute la table via
--    ROW_NUMBER — count des joueurs devant moi (index trophies) + top 50.
--
-- PRÉREQUIS : 159, 161, 162, 164. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE INDEX IF NOT EXISTS challenge_sessions_created_at_idx
  ON public.challenge_sessions (created_at);

-- ------------------------------------------------------- league_standings
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
    -- Pré-agrégation UNIQUE de l'XP de la semaine (un seul scan indexé de
    -- challenge_sessions), jointe au palier — plus de sum() par élève.
    WITH weekly AS (
      SELECT cs.user_id, sum(cs.xp)::int AS xp
        FROM public.challenge_sessions cs
       WHERE cs.created_at >= v_start
       GROUP BY cs.user_id
    ),
    members AS (
      SELECT p.id,
             split_part(COALESCE(p.full_name, 'Élève'), ' ', 1) AS name,
             COALESCE(w.xp, 0) AS weekly_xp
        FROM public.profiles p
        LEFT JOIN weekly w ON w.user_id = p.id
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
  -- NULL-safe (164) : p_level NULL doit répondre NULL, pas « comme lycée ».
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
    -- Pré-agrégation UNIQUE de l'XP du week-end, jointe aux élèves scolarisés
    -- — un seul scan indexé de challenge_sessions au lieu d'un par élève.
    WITH weekend AS (
      SELECT cs.user_id, sum(cs.xp)::int AS xp
        FROM public.challenge_sessions cs
       WHERE cs.created_at >= v_start AND cs.created_at < v_end
       GROUP BY cs.user_id
    ),
    members AS (
      SELECT p.id AS user_id,
             CASE WHEN p_level = 'college' THEN p.college_school_id
                  ELSE p.lycee_school_id END AS school_id
        FROM public.profiles p
       WHERE (CASE WHEN p_level = 'college' THEN p.college_school_id
                   ELSE p.lycee_school_id END) IS NOT NULL
    ),
    scored AS (
      SELECT m.school_id, COALESCE(w.xp, 0) AS xp
        FROM members m
        LEFT JOIN weekend w ON w.user_id = m.user_id
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

-- ------------------------------------------------------ national_ranking
CREATE OR REPLACE FUNCTION public.national_ranking()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_mine     BIGINT;
  v_my_rank  BIGINT;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- Mon rang SANS trier toute la table : nombre de joueurs devant moi + 1
  -- (même départage que l'ancien ROW_NUMBER : trophies DESC, id).
  SELECT trophies INTO v_mine FROM public.profiles WHERE id = v_user;
  IF FOUND THEN
    SELECT count(*) + 1 INTO v_my_rank
      FROM public.profiles p
     WHERE p.trophies > v_mine
        OR (p.trophies = v_mine AND p.id < v_user);
  END IF;

  RETURN (
    SELECT jsonb_build_object(
      'total', (SELECT count(*) FROM public.profiles),
      'my_rank', v_my_rank,
      'entries', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'id', id, 'name', name, 'trophies', trophies, 'rank', rank))
          FROM (
            SELECT p.id,
                   split_part(COALESCE(p.full_name, 'Élève'), ' ', 1) AS name,
                   p.trophies,
                   ROW_NUMBER() OVER (ORDER BY p.trophies DESC, p.id) AS rank
              FROM public.profiles p
             ORDER BY p.trophies DESC, p.id
             LIMIT 50
          ) t), '[]'::jsonb)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.national_ranking() TO authenticated;
