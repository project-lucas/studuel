-- =============================================================================
-- Studuel — Migration 162 : tournoi des écoles du week-end (fondation)
-- Chaque week-end (samedi 00:00 UTC → lundi 00:00 UTC), les élèves marquent des
-- points pour leur école-clan : la somme des XP de leurs défis
-- (challenge_sessions.xp) pendant la fenêtre. Principe identique à la ligue
-- hebdo (161) : le classement courant est CALCULÉ — aucun stockage, aucun
-- reset. En semaine, l'RPC renvoie les résultats du DERNIER week-end.
--
-- Fondation seulement : les récompenses de fin de tournoi (journal + cron,
-- façon process_league_rollover) viendront dans une migration dédiée.
--
-- Sécurité : school_tournament_standings() est en SECURITY DEFINER (lecture
-- croisée des écoles/sessions), gardée par auth.uid().
--
-- PRÉREQUIS : schema.sql (profiles), 011 (challenge_sessions.xp),
-- 159 (schools, profiles.college_school_id / lycee_school_id). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- --------------------------------------------- school_tournament_standings
-- Classement des écoles d'un cycle ('college' | 'lycee') pour le tournoi du
-- week-end. JSONB {
--   tournament_start (date du samedi), is_open, my_school_id,
--   entries: [{ school_id, name, city, points, students }] (top 20)
-- } — le tri/rang est refait côté client (lib/tournament.ts).
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
  IF p_level NOT IN ('college', 'lycee') THEN RETURN NULL; END IF;

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
