-- =============================================================================
-- Studuel — Migration 160 : backend de l'onglet Amis (« école » + « en direct »)
-- Débranche les deux dernières sections mockées d'Amis :
--   - clan_mates(level) : les camarades de MON école (le clan, migration 159),
--     classés par temps de travail → alimente la section « Mon école ».
--   - friends_live(minutes) : mes amis actifs à l'instant (une session dans les N
--     dernières minutes) → alimente la section « En direct ».
-- Toujours en SECURITY DEFINER (lecture croisée d'autres élèves), prénom seul.
--
-- PRÉREQUIS : 019 (friendships), 014 (work_seconds), 159 (schools + refs),
-- 003 (test_sessions), 011 (challenge_sessions), study_sessions,
-- lesson_completions. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------------------------- clan_mates
-- Camarades de mon école (du cycle demandé), classés par temps de travail.
-- JSONB { school_name, mates:[{ id, name, seconds }] } (top 50). school_name
-- null si pas d'école pour ce cycle.
CREATE OR REPLACE FUNCTION public.clan_mates(p_level TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_school UUID;
  v_name   TEXT;
BEGIN
  IF v_user IS NULL OR p_level NOT IN ('college', 'lycee') THEN RETURN NULL; END IF;

  IF p_level = 'college' THEN
    SELECT college_school_id INTO v_school FROM public.profiles WHERE id = v_user;
  ELSE
    SELECT lycee_school_id INTO v_school FROM public.profiles WHERE id = v_user;
  END IF;
  IF v_school IS NULL THEN RETURN jsonb_build_object('school_name', NULL, 'mates', '[]'::jsonb); END IF;
  SELECT name INTO v_name FROM public.schools WHERE id = v_school;

  RETURN jsonb_build_object(
    'school_name', v_name,
    'mates', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'id', p.id,
               'name', split_part(COALESCE(p.full_name, 'Élève'), ' ', 1),
               'seconds', COALESCE(p.work_seconds, 0))
             ORDER BY COALESCE(p.work_seconds, 0) DESC, p.id)
        FROM (
          SELECT id, full_name, work_seconds
            FROM public.profiles
           WHERE (CASE WHEN p_level = 'college'
                       THEN college_school_id ELSE lycee_school_id END) = v_school
           ORDER BY COALESCE(work_seconds, 0) DESC
           LIMIT 50
        ) p
    ), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.clan_mates(TEXT) TO authenticated;

-- ------------------------------------------------------------ friends_live
-- Amis acceptés ayant une activité dans les p_minutes dernières minutes (défi,
-- quiz, révision ou leçon). Renvoie l'activité LA PLUS RÉCENTE par ami, avec son
-- type et l'ancienneté en minutes. Prénom seul.
CREATE OR REPLACE FUNCTION public.friends_live(p_minutes INTEGER DEFAULT 20)
RETURNS TABLE (
  friend_id UUID,
  full_name TEXT,
  kind      TEXT,
  minutes   INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH my_friends AS (
    SELECT CASE WHEN f.requester_id = auth.uid()
                THEN f.addressee_id ELSE f.requester_id END AS fid
      FROM public.friendships f
     WHERE f.status = 'accepted'
       AND auth.uid() IN (f.requester_id, f.addressee_id)
  ),
  acts AS (
    SELECT user_id, created_at, 'quiz'::text     AS kind FROM public.test_sessions
    UNION ALL
    SELECT user_id, created_at, 'defi'::text     AS kind FROM public.challenge_sessions
    UNION ALL
    SELECT user_id, created_at, 'revision'::text AS kind FROM public.study_sessions
    UNION ALL
    SELECT user_id, created_at, 'lecon'::text    AS kind FROM public.lesson_completions
  ),
  ranked AS (
    SELECT a.user_id, a.kind, a.created_at,
           ROW_NUMBER() OVER (PARTITION BY a.user_id ORDER BY a.created_at DESC) AS rn
      FROM acts a
      JOIN my_friends mf ON mf.fid = a.user_id
     WHERE a.created_at > now() - make_interval(mins => GREATEST(1, LEAST(p_minutes, 240)))
  )
  SELECT r.user_id,
         split_part(COALESCE(p.full_name, 'Ami'), ' ', 1),
         r.kind,
         GREATEST(0, floor(extract(epoch FROM (now() - r.created_at)) / 60))::int
    FROM ranked r
    JOIN public.profiles p ON p.id = r.user_id
   WHERE r.rn = 1
   ORDER BY r.created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.friends_live(INTEGER) TO authenticated;
