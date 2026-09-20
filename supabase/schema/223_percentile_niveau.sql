-- =============================================================================
-- 223 — Classement en pourcentage par niveau (« top 2 % des 3e »)
--
-- Cadrage : docs/CADRAGE-PERCENTILE.md
--
-- Expose UNE fonction, my_grade_standings(), qui rend la place de l'élève dans
-- sa cohorte de niveau (profiles.grade_level) selon les trois mesures de
-- l'app : trophées (la compétition), assiduité (le travail fourni) et maîtrise
-- (par matière). La traduction en « top 2 % » ou « mieux que 30 % » se fait
-- côté TypeScript (lib/percentile.ts, pur et testé) : ici on ne renvoie que des
-- rangs et des effectifs.
--
-- SECURITY DEFINER, et ce n'est pas un détail : la RLS de `profiles` ne laisse
-- voir à l'élève que sa propre ligne. Une jointure ordinaire compterait donc
-- « 1 sur 1 » et annoncerait fièrement un top 100 %. C'est le piège maison
-- documenté du projet — toute lecture croisée de `profiles` passe par une RPC.
--
-- La fonction ne renvoie AUCUNE donnée nominative : que des rangs et des
-- totaux. Rien de ce qu'elle expose ne permet d'identifier un autre élève.
--
-- PRÉREQUIS : schema.sql (profiles.grade_level), 014 (work_seconds),
--             079 (trophies), 002 (quizzes.subject), 003 (test_sessions).
-- Idempotent.
-- =============================================================================

-- --------------------------------------------------------------------- index
-- Le classement balaie tous les profils d'un niveau. Sans index, chaque appel
-- fait un seq scan sur toute la table.
CREATE INDEX IF NOT EXISTS profiles_grade_trophies_idx
  ON public.profiles (grade_level, trophies DESC);

CREATE INDEX IF NOT EXISTS profiles_grade_work_idx
  ON public.profiles (grade_level, work_seconds DESC);

-- Le classement de maîtrise agrège test_sessions par (élève, quiz).
CREATE INDEX IF NOT EXISTS test_sessions_user_quiz_idx
  ON public.test_sessions (user_id, quiz_id);

-- --------------------------------------------------- my_grade_standings
-- JSONB :
--   {
--     "grade": "3e",
--     "trophies":  { "rank": 20, "total": 1000 } | null,
--     "assiduite": { "rank": 40, "total":  980 } | null,
--     "maitrise":  [ { "subject": "Maths", "rank": 8, "total": 412 }, … ]
--   }
--
-- null pour une mesure où l'élève n'est pas classé (voir « qui est classé »
-- ci-dessous). Le TypeScript sait déjà traiter ce cas (`kind: 'aucun'`).
--
-- QUI EST CLASSÉ, et pourquoi c'est la décision délicate de cette migration :
-- on n'inclut QUE les élèves dont la mesure est strictement positive. Compter
-- les comptes inactifs à 0 trophée gonflerait mécaniquement le classement de
-- tout le monde — « top 2 % » deviendrait facile, donc faux, et l'app se
-- retrouverait à flatter ses élèves. Un percentile parmi des gens qui ne jouent
-- pas ne veut rien dire. On classe donc parmi ceux qui font la chose, ce qui
-- est aussi le choix le plus SÉVÈRE des deux : la cohorte est plus petite et
-- plus dure. C'est voulu — cf. la règle « les arrondis vont contre l'élève ».
CREATE OR REPLACE FUNCTION public.my_grade_standings()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_grade TEXT;
  -- Nombre minimal de quiz passés dans une matière pour y être classé. Doit
  -- rester égal à MASTERY_MIN_QUIZZES (lib/percentile.ts) : sans lui, un seul
  -- 10/10 chanceux placerait n'importe qui premier de sa matière.
  c_min_quizzes CONSTANT INT := 3;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT grade_level INTO v_grade FROM public.profiles WHERE id = v_user;

  -- Sans niveau renseigné, il n'y a pas de cohorte : rien à comparer. L'élève
  -- le règle dans son profil, l'app n'invente pas un niveau à sa place.
  IF v_grade IS NULL OR btrim(v_grade) = '' THEN
    RETURN jsonb_build_object('grade', NULL,
                              'trophies', NULL,
                              'assiduite', NULL,
                              'maitrise', '[]'::jsonb);
  END IF;

  RETURN (
    WITH cohorte AS (
      SELECT id, trophies, work_seconds
        FROM public.profiles
       WHERE grade_level = v_grade
    ),
    -- ------------------------------------------------------------ trophées
    troph AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY trophies DESC, id) AS rank,
             count(*) OVER () AS total
        FROM cohorte
       WHERE COALESCE(trophies, 0) > 0
    ),
    -- ----------------------------------------------------------- assiduité
    assid AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY work_seconds DESC, id) AS rank,
             count(*) OVER () AS total
        FROM cohorte
       WHERE COALESCE(work_seconds, 0) > 0
    ),
    -- ------------------------------------------------------------ maîtrise
    -- Meilleur score par (élève, quiz) : refaire un quiz ne doit jamais
    -- pénaliser — c'est exactement le geste qu'on veut encourager.
    meilleurs AS (
      SELECT ts.user_id,
             q.subject,
             ts.quiz_id,
             max(ts.score::numeric / ts.total) AS best
        FROM public.test_sessions ts
        JOIN public.quizzes q ON q.id = ts.quiz_id
        JOIN cohorte c        ON c.id = ts.user_id
       WHERE ts.total > 0 AND q.subject IS NOT NULL
       GROUP BY ts.user_id, q.subject, ts.quiz_id
    ),
    par_matiere AS (
      SELECT user_id, subject, avg(best) AS mastery
        FROM meilleurs
       GROUP BY user_id, subject
      HAVING count(DISTINCT quiz_id) >= c_min_quizzes
    ),
    maitrise AS (
      SELECT user_id, subject,
             ROW_NUMBER() OVER (PARTITION BY subject
                                    ORDER BY mastery DESC, user_id) AS rank,
             count(*) OVER (PARTITION BY subject) AS total
        FROM par_matiere
    )
    SELECT jsonb_build_object(
      'grade', v_grade,
      'trophies', (
        SELECT jsonb_build_object('rank', rank, 'total', total)
          FROM troph WHERE id = v_user),
      'assiduite', (
        SELECT jsonb_build_object('rank', rank, 'total', total)
          FROM assid WHERE id = v_user),
      'maitrise', COALESCE((
        SELECT jsonb_agg(jsonb_build_object(
                 'subject', subject, 'rank', rank, 'total', total)
               ORDER BY subject)
          FROM maitrise WHERE user_id = v_user), '[]'::jsonb)
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.my_grade_standings() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.my_grade_standings() TO authenticated;
