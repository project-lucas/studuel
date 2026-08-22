-- =============================================================================
-- Studuel — Migration 242 : l'ÉCOLE PRIMAIRE devient un cycle de clan
--
-- Depuis la 159, un élève appartient à une école qui lui sert de clan, et il en
-- a une PAR CYCLE : `college_school_id`, `lycee_school_id`. Deux cycles, parce
-- que l'app s'arrêtait à la 6e. Avec l'arrivée du primaire (migration 241), un
-- élève de CM1 tombait dans le repli — le cycle « collège » — et l'app lui
-- proposait de chercher SON COLLÈGE, puis le classait avec des 3e.
--
-- CE QUI CHANGE
--   1. `schools.level` accepte 'primaire' (la contrainte n'en listait que deux).
--   2. `profiles.primaire_school_id` : la troisième école de l'élève.
--   3. Les SIX fonctions qui décidaient du cycle par un booléen déguisé
--      (`CASE WHEN p_level = 'college' THEN … ELSE lycee_school_id END`) — un
--      `ELSE` qui envoyait TOUT ce qui n'est pas le collège au lycée, primaire
--      compris. Elles sont redéfinies avec les trois branches explicites :
--        · find_or_create_school       (159)
--        · set_my_school               (159)
--        · clan_ranking                (159)
--        · clan_mates                  (160)
--        · school_tournament_standings (166, la dernière version)
--        · clan_active_school          (210, la dernière version)
--      CREATE OR REPLACE : les migrations d'origine ne sont pas modifiées.
--
-- CE QUI NE CHANGE PAS : aucune école, aucun rattachement, aucun classement
-- existant n'est touché. Les élèves du collège et du lycée ne voient rien.
--
-- PRÉREQUIS : 159, 160, 166, 210, 241. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Le troisième cycle
-- -----------------------------------------------------------------------------
ALTER TABLE public.schools DROP CONSTRAINT IF EXISTS schools_level_check;
ALTER TABLE public.schools
  ADD CONSTRAINT schools_level_check
  CHECK (level IN ('primaire', 'college', 'lycee'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS primaire_school_id UUID
    REFERENCES public.schools (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS profiles_primaire_school_idx
  ON public.profiles (primaire_school_id) WHERE primaire_school_id IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 2. find_or_create_school — accepte le cycle « primaire »
--    Corps inchangé par rapport à la 159 : seule la garde s'ouvre.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.find_or_create_school(
  p_name TEXT, p_city TEXT, p_level TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_name TEXT := btrim(COALESCE(p_name, ''));
  v_city TEXT := NULLIF(btrim(COALESCE(p_city, '')), '');
  v_id   UUID;
BEGIN
  IF v_user IS NULL
     OR length(v_name) < 2
     OR p_level NOT IN ('primaire', 'college', 'lycee') THEN
    RETURN NULL;
  END IF;

  SELECT id INTO v_id FROM public.schools
   WHERE lower(name) = lower(v_name)
     AND level = p_level
     AND lower(COALESCE(city, '')) = lower(COALESCE(v_city, ''));

  IF v_id IS NULL THEN
    INSERT INTO public.schools (name, city, level, created_by)
    VALUES (v_name, v_city, p_level, v_user)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_id;
  END IF;

  -- Course perdue (autre insert simultané) : on relit.
  IF v_id IS NULL THEN
    SELECT id INTO v_id FROM public.schools
     WHERE lower(name) = lower(v_name)
       AND level = p_level
       AND lower(COALESCE(city, '')) = lower(COALESCE(v_city, ''));
  END IF;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.find_or_create_school(TEXT, TEXT, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. set_my_school — trois colonnes, trois branches
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_my_school(p_school_id UUID, p_level TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL OR p_level NOT IN ('primaire', 'college', 'lycee') THEN
    RETURN false;
  END IF;

  IF p_school_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.schools WHERE id = p_school_id AND level = p_level
    ) THEN
      RETURN false;
    END IF;
  END IF;

  IF p_level = 'primaire' THEN
    UPDATE public.profiles SET primaire_school_id = p_school_id WHERE id = v_user;
  ELSIF p_level = 'college' THEN
    UPDATE public.profiles SET college_school_id = p_school_id WHERE id = v_user;
  ELSE
    UPDATE public.profiles SET lycee_school_id = p_school_id WHERE id = v_user;
  END IF;
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_my_school(UUID, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. clan_ranking — le classement de MON école
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.clan_ranking(p_level TEXT)
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
  IF v_user IS NULL OR p_level NOT IN ('primaire', 'college', 'lycee') THEN
    RETURN NULL;
  END IF;

  SELECT CASE p_level
           WHEN 'primaire' THEN primaire_school_id
           WHEN 'college'  THEN college_school_id
           ELSE lycee_school_id
         END
    INTO v_school
    FROM public.profiles WHERE id = v_user;

  IF v_school IS NULL THEN
    RETURN jsonb_build_object('school_id', NULL);
  END IF;
  SELECT name INTO v_name FROM public.schools WHERE id = v_school;

  RETURN (
    WITH members AS (
      SELECT p.id,
             split_part(COALESCE(p.full_name, 'Élève'), ' ', 1) AS name,
             p.trophies,
             ROW_NUMBER() OVER (ORDER BY p.trophies DESC, p.id) AS rank
        FROM public.profiles p
       WHERE (CASE p_level
                WHEN 'primaire' THEN p.primaire_school_id
                WHEN 'college'  THEN p.college_school_id
                ELSE p.lycee_school_id
              END) = v_school
    )
    SELECT jsonb_build_object(
      'school_id', v_school,
      'school_name', v_name,
      'total', (SELECT count(*) FROM members),
      'my_rank', (SELECT rank FROM members WHERE id = v_user),
      'entries', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'id', id, 'name', name, 'trophies', trophies, 'rank', rank))
          FROM (SELECT * FROM members ORDER BY rank LIMIT 50) t), '[]'::jsonb)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.clan_ranking(TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 5. clan_mates — les camarades de mon école (onglet Amis)
-- -----------------------------------------------------------------------------
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
  IF v_user IS NULL OR p_level NOT IN ('primaire', 'college', 'lycee') THEN
    RETURN NULL;
  END IF;

  SELECT CASE p_level
           WHEN 'primaire' THEN primaire_school_id
           WHEN 'college'  THEN college_school_id
           ELSE lycee_school_id
         END
    INTO v_school
    FROM public.profiles WHERE id = v_user;

  IF v_school IS NULL THEN
    RETURN jsonb_build_object('school_name', NULL, 'mates', '[]'::jsonb);
  END IF;
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
           WHERE (CASE p_level
                    WHEN 'primaire' THEN primaire_school_id
                    WHEN 'college'  THEN college_school_id
                    ELSE lycee_school_id
                  END) = v_school
           ORDER BY COALESCE(work_seconds, 0) DESC
           LIMIT 50
        ) p
    ), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.clan_mates(TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 6. school_tournament_standings — le tournoi des écoles du week-end
--    Reprise de la version 166 (la plus récente), cycle « primaire » compris.
-- -----------------------------------------------------------------------------
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
  IF p_level IS NULL OR p_level NOT IN ('primaire', 'college', 'lycee') THEN
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

  SELECT CASE p_level
           WHEN 'primaire' THEN p.primaire_school_id
           WHEN 'college'  THEN p.college_school_id
           ELSE p.lycee_school_id
         END
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
             CASE p_level
               WHEN 'primaire' THEN p.primaire_school_id
               WHEN 'college'  THEN p.college_school_id
               ELSE p.lycee_school_id
             END AS school_id
        FROM public.profiles p
       WHERE (CASE p_level
                WHEN 'primaire' THEN p.primaire_school_id
                WHEN 'college'  THEN p.college_school_id
                ELSE p.lycee_school_id
              END) IS NOT NULL
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

-- -----------------------------------------------------------------------------
-- 7. clan_active_school — l'école du cycle courant (clan hebdo)
--    La 210 lisait le cycle dans la classe : `grade_level IN ('2de','1re','Tle')`.
--    Deux oublis à réparer d'un coup — le primaire, et la voie technologique
--    (un 1re techno est au lycée, il partage l'établissement de son voisin de
--    voie générale). Miroir exact de lib/grades.cycleOf.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.clan_active_school(p_user UUID)
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school UUID;
BEGIN
  SELECT CASE
           WHEN grade_level IN ('CP', 'CE1', 'CE2', 'CM1', 'CM2')
             THEN primaire_school_id
           WHEN grade_level IN ('2de', '1re', '1re techno', 'Tle', 'Tle techno')
             THEN lycee_school_id
           ELSE college_school_id
         END
    INTO v_school
    FROM public.profiles WHERE id = p_user;
  RETURN v_school;
END;
$$;

-- -----------------------------------------------------------------------------
-- 8. Sonde
-- -----------------------------------------------------------------------------
DO $sonde$
DECLARE
  v_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'profiles'
       AND column_name = 'primaire_school_id'
  ) THEN
    RAISE EXCEPTION 'profiles.primaire_school_id absente';
  END IF;

  -- La contrainte doit accepter le nouveau cycle. On teste pour de vrai, puis
  -- on annule : une contrainte mal reconstruite ne se voit pas autrement.
  BEGIN
    INSERT INTO public.schools (name, city, level)
    VALUES ('__sonde_242__', NULL, 'primaire') RETURNING id INTO v_id;
    DELETE FROM public.schools WHERE id = v_id;
  EXCEPTION WHEN check_violation THEN
    RAISE EXCEPTION 'schools.level refuse encore le cycle primaire';
  END;

  RAISE NOTICE 'Migration 242 OK - ecole primaire reconnue comme cycle de clan.';
END $sonde$;
