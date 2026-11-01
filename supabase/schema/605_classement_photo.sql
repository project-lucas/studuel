-- =============================================================================
-- 605 — LE CLASSEMENT DU NIVEAU SANS BALAYER LA COHORTE À CHAQUE AFFICHAGE
-- (30/10/2026, chantier latence)
-- =============================================================================
-- `my_grade_standings()` (223) recalculait, à CHAQUE appel, la maîtrise de tous
-- les élèves du niveau en agrégeant toutes leurs sessions de quiz. Mesuré le
-- 30/10/2026 : 1,4 s par appel, et toute la base ralentie pendant ce temps.
-- Son coût grandit avec le nombre d'élèves ; à 50 000, c'était le mur.
--
-- Lucas : « lorsque le joueur joue, son classement doit être actualisé dans la
-- foulée. S'il bat son classement précédent mais ne le voit pas, il va croire
-- que ça bugue. » D'où le partage :
--
--   · LES AUTRES sont lus dans une PHOTO de la maîtrise (`classement_maitrise_photo`),
--     reprise quelques fois par jour aux heures où l'on révise ;
--   · L'ÉLÈVE est TOUJOURS calculé en direct, sur ses seules sessions (index
--     user_id) : un quiz réussi fait monter sa place à la seconde ;
--   · trophées et assiduité se comptent en direct sur `profiles`, par les index
--     (grade_level, trophies) et (grade_level, work_seconds) de la 223 : un
--     comptage d'index, pas une agrégation.
--
-- `my_grade_standings()` garde EXACTEMENT sa signature et la forme de sa
-- réponse : l'app (Moi, carte de joueur, dossier de matière) n'a rien à changer.
--
-- LES HEURES DE LA PHOTO (heure de Paris, changement d'heure compris) :
--   · lundi, mardi, jeudi, vendredi : 12 h, 17 h, 19 h, 21 h ;
--   · mercredi (après-midi libre au collège), samedi, dimanche :
--     10 h, 14 h, 17 h, 19 h, 21 h.
-- Une tâche pg_cron passe à 5 de chaque heure et ne recalcule qu'à ces heures.
-- Entre deux photos, un élève qui progresse voit sa place bouger tout de suite ;
-- celle des AUTRES attend la photo suivante (au plus quelques heures).
--
-- PRÉREQUIS : 223 (my_grade_standings, index), 003 (test_sessions), 002
-- (quizzes.subject). Extension pg_cron (Supabase : Database → Extensions) ;
-- sans elle, la migration passe quand même et la photo se reprend à la main :
--   SELECT public.classement_photo_reprendre();
-- Idempotent.
-- =============================================================================

-- ------------------------------------------------------------------ la photo
CREATE TABLE IF NOT EXISTS public.classement_maitrise_photo (
  user_id UUID    NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  grade   TEXT    NOT NULL,
  subject TEXT    NOT NULL,
  mastery NUMERIC NOT NULL,
  PRIMARY KEY (user_id, subject)
);

-- Le comptage « combien font mieux que moi dans ma matière, à mon niveau ».
CREATE INDEX IF NOT EXISTS classement_maitrise_photo_rang_idx
  ON public.classement_maitrise_photo (grade, subject, mastery DESC, user_id);

-- Quand la photo a été prise (une seule ligne).
CREATE TABLE IF NOT EXISTS public.classement_photo_etat (
  id         INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  prise_le   TIMESTAMPTZ NOT NULL,
  lignes     INT NOT NULL DEFAULT 0
);

-- Personne ne lit ces tables en direct : seules les fonctions SECURITY DEFINER
-- ci-dessous y touchent. RLS activée SANS policy = aucune ligne pour un client.
ALTER TABLE public.classement_maitrise_photo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classement_photo_etat ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.classement_maitrise_photo FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.classement_photo_etat FROM PUBLIC, anon, authenticated;

-- ------------------------------------------------------- reprendre la photo
-- La seule agrégation sur toute la base, quatre ou cinq fois par jour.
-- Même règle que la 223 : meilleur score par (élève, quiz), moyenne par matière,
-- classé seulement à partir de trois quiz différents dans la matière.
CREATE OR REPLACE FUNCTION public.classement_photo_reprendre()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c_min_quizzes CONSTANT INT := 3;
  v_lignes INT;
BEGIN
  DELETE FROM public.classement_maitrise_photo WHERE TRUE;

  INSERT INTO public.classement_maitrise_photo (user_id, grade, subject, mastery)
  SELECT m.user_id, p.grade_level, m.subject, avg(m.best)
    FROM (
      SELECT ts.user_id, q.subject, ts.quiz_id,
             max(ts.score::numeric / ts.total) AS best
        FROM public.test_sessions ts
        JOIN public.quizzes q ON q.id = ts.quiz_id
       WHERE ts.total > 0 AND q.subject IS NOT NULL
       GROUP BY ts.user_id, q.subject, ts.quiz_id
    ) m
    JOIN public.profiles p ON p.id = m.user_id
   WHERE p.grade_level IS NOT NULL AND btrim(p.grade_level) <> ''
   GROUP BY m.user_id, p.grade_level, m.subject
  HAVING count(DISTINCT m.quiz_id) >= c_min_quizzes;

  GET DIAGNOSTICS v_lignes = ROW_COUNT;

  INSERT INTO public.classement_photo_etat (id, prise_le, lignes)
  VALUES (1, now(), v_lignes)
  ON CONFLICT (id) DO UPDATE SET prise_le = EXCLUDED.prise_le, lignes = EXCLUDED.lignes;

  RETURN v_lignes;
END;
$$;

REVOKE ALL ON FUNCTION public.classement_photo_reprendre() FROM PUBLIC, anon, authenticated;

-- ------------------------------------------- l'heure est-elle une heure de photo ?
-- Pure, à part pour être testée : jour ISO (1 = lundi … 7 = dimanche) et heure
-- de Paris.
CREATE OR REPLACE FUNCTION public.classement_photo_heure(p_jour INT, p_heure INT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN p_jour IN (3, 6, 7) THEN p_heure IN (10, 14, 17, 19, 21)
    ELSE p_heure IN (12, 17, 19, 21)
  END;
$$;

REVOKE ALL ON FUNCTION public.classement_photo_heure(INT, INT) FROM PUBLIC, anon, authenticated;

-- Le passage horaire de pg_cron : ne reprend la photo qu'aux heures prévues.
CREATE OR REPLACE FUNCTION public.classement_photo_tic()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_paris TIMESTAMP := now() AT TIME ZONE 'Europe/Paris';
BEGIN
  IF public.classement_photo_heure(
       EXTRACT(ISODOW FROM v_paris)::INT,
       EXTRACT(HOUR FROM v_paris)::INT) THEN
    PERFORM public.classement_photo_reprendre();
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.classement_photo_tic() FROM PUBLIC, anon, authenticated;

-- -------------------------------------------------- my_grade_standings, réécrite
-- Même signature, même réponse que la 223 :
--   { "grade": "3e",
--     "trophies":  { "rank": 20, "total": 1000 } | null,
--     "assiduite": { "rank": 40, "total":  980 } | null,
--     "maitrise":  [ { "subject": "Maths", "rank": 8, "total": 412 }, … ] }
-- Mêmes règles de classement : seuls les élèves dont la mesure est > 0 sont
-- classés ; à égalité, l'identifiant départage (comme ROW_NUMBER … , id).
CREATE OR REPLACE FUNCTION public.my_grade_standings()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_grade    TEXT;
  v_trophies INT;
  v_work     BIGINT;
  v_troph    JSONB := NULL;
  v_assid    JSONB := NULL;
  v_maitrise JSONB;
  c_min_quizzes CONSTANT INT := 3;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT grade_level, COALESCE(trophies, 0), COALESCE(work_seconds, 0)
    INTO v_grade, v_trophies, v_work
    FROM public.profiles WHERE id = v_user;

  IF v_grade IS NULL OR btrim(v_grade) = '' THEN
    RETURN jsonb_build_object('grade', NULL,
                              'trophies', NULL,
                              'assiduite', NULL,
                              'maitrise', '[]'::jsonb);
  END IF;

  -- Trophées, en direct : ceux qui ont plus, puis l'égalité départagée par l'id.
  IF v_trophies > 0 THEN
    SELECT jsonb_build_object(
             'rank', 1 + count(*) FILTER (
               WHERE COALESCE(trophies, 0) > v_trophies
                  OR (COALESCE(trophies, 0) = v_trophies AND id < v_user)),
             'total', count(*))
      INTO v_troph
      FROM public.profiles
     WHERE grade_level = v_grade AND COALESCE(trophies, 0) > 0;
  END IF;

  -- Assiduité, en direct, même règle.
  IF v_work > 0 THEN
    SELECT jsonb_build_object(
             'rank', 1 + count(*) FILTER (
               WHERE COALESCE(work_seconds, 0) > v_work
                  OR (COALESCE(work_seconds, 0) = v_work AND id < v_user)),
             'total', count(*))
      INTO v_assid
      FROM public.profiles
     WHERE grade_level = v_grade AND COALESCE(work_seconds, 0) > 0;
  END IF;

  -- Maîtrise : la mienne en direct (mes seules sessions), les autres dans la photo.
  WITH meilleurs AS (
    SELECT q.subject, ts.quiz_id, max(ts.score::numeric / ts.total) AS best
      FROM public.test_sessions ts
      JOIN public.quizzes q ON q.id = ts.quiz_id
     WHERE ts.user_id = v_user AND ts.total > 0 AND q.subject IS NOT NULL
     GROUP BY q.subject, ts.quiz_id
  ),
  moi AS (
    SELECT subject, avg(best) AS mastery
      FROM meilleurs
     GROUP BY subject
    HAVING count(DISTINCT quiz_id) >= c_min_quizzes
  ),
  places AS (
    SELECT moi.subject,
           1 + (SELECT count(*) FROM public.classement_maitrise_photo ph
                 WHERE ph.grade = v_grade AND ph.subject = moi.subject
                   AND ph.user_id <> v_user
                   AND (ph.mastery > moi.mastery
                        OR (ph.mastery = moi.mastery AND ph.user_id < v_user))) AS rank,
           1 + (SELECT count(*) FROM public.classement_maitrise_photo ph
                 WHERE ph.grade = v_grade AND ph.subject = moi.subject
                   AND ph.user_id <> v_user) AS total
      FROM moi
  )
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
           'subject', subject, 'rank', rank, 'total', total) ORDER BY subject),
         '[]'::jsonb)
    INTO v_maitrise
    FROM places;

  RETURN jsonb_build_object('grade', v_grade,
                            'trophies', v_troph,
                            'assiduite', v_assid,
                            'maitrise', v_maitrise);
END;
$$;

REVOKE ALL ON FUNCTION public.my_grade_standings() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.my_grade_standings() TO authenticated;

-- ------------------------------------------------- la première photo, tout de suite
SELECT public.classement_photo_reprendre();

-- --------------------------------------------------------------- la planification
-- pg_cron absent ou refusé : la migration ne casse pas, la photo de ce jour
-- reste celle prise ci-dessus et se reprend à la main.
DO $cron$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  -- Re-planifier sous le même nom remplace la tâche : rejouer la migration ne
  -- la double pas.
  PERFORM cron.schedule(
    'classement-photo',
    '5 * * * *',
    'SELECT public.classement_photo_tic()'
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron indisponible (%), photo du classement à reprendre à la main', SQLERRM;
END;
$cron$;
