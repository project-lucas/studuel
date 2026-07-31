-- =============================================================================
-- Studuel — Migration 211 : reprise des contrôles hérités (087 → 203)
--
-- La 203 a fait du contrôle un OBJET UNIQUE (`controles` + `sessions_preparation`)
-- et `AddExamSheet` ne crée plus que par là. Les contrôles annoncés AVANT, eux,
-- dorment encore dans `profiles.upcoming_exams` (087) : ils n'ouvrent aucune
-- carte de préparation sur Réviser. Cette migration les recopie.
--
-- Ce qu'elle fait :
--   • regroupe les entrées 087 d'un élève par (matière, date) — c'est exactement
--     le regroupement d'origine : `addUpcomingExams` éclatait UNE annonce
--     (1 matière + 1 date + N chapitres cochés) en N entrées ;
--   • crée un `controle` par groupe, avec ses N chapitres ;
--   • crée son plan de préparation, MIROIR EXACT de lib/prep-plan :
--       planSessionCount : J-5 ou plus → 3 · J-2 à J-4 → 2 · sinon (ou sans
--                          date) → 1
--       offsets          : 3 → J-4, J-2, J-1 · 2 → J-2, J-1 · 1 → aujourd'hui
--       bornes           : jamais avant aujourd'hui, dédoublonné, trié
--       chapitres        : rotation session i → chapitre (i modulo N)
--       durée            : DEFAULT_GOAL_MINUTES = 10 min
--     (Ce miroir est verrouillé par lib/prep-plan-mirror.test.ts : toute
--      modification de l'algorithme côté TypeScript fait passer le test au
--      rouge. Ce dépôt s'est fait mordre CINQ fois par un miroir qui dérive.)
--
-- Ce qu'elle NE fait PAS :
--   • elle ne SUPPRIME rien — `profiles.upcoming_exams` reste intact, et les RPC
--     `add_upcoming_exam` / `remove_upcoming_exam` (087) restent en place. On
--     garde la réversibilité ; le code, lui, fusionne déjà les deux sources en
--     dédoublonnant par chapitre (lib/controle-exams), donc un contrôle repris
--     ne compte jamais deux fois.
--   • elle ne touche pas aux contrôles déjà créés depuis la 203.
--
-- Idempotente : un groupe (élève, matière, date) qui a DÉJÀ un `controle` est
-- ignoré — relancer le fichier ne duplique rien.
--
-- PRÉREQUIS : 087_upcoming_exams.sql et 203_plan_preparation.sql.
-- À EXÉCUTER À LA MAIN dans : Supabase Dashboard → SQL Editor.
-- Astuce : sélectionne TOUT le fichier (Ctrl+A) avant de lancer.
-- =============================================================================

DO $$
DECLARE
  v_today    DATE := (now() AT TIME ZONE 'utc')::date;
  v_goal     INTEGER := 10;   -- miroir de DEFAULT_GOAL_MINUTES (lib/prep-plan)
  g          RECORD;
  v_id       UUID;
  v_delta    INTEGER;
  v_count    INTEGER;
  v_offsets  INTEGER[];
  v_dates    DATE[];
  v_day      DATE;
  v_off      INTEGER;
  v_i        INTEGER;
  v_nchap    INTEGER;
  v_made     INTEGER := 0;
BEGIN
  -- Les tables de la 203 doivent exister ; sinon on ne fait rien (et on le dit).
  IF to_regclass('public.controles') IS NULL THEN
    RAISE NOTICE 'Migration 211 ignorée : la 203 (controles) n''est pas passée.';
    RETURN;
  END IF;

  FOR g IN
    SELECT
      p.id                                          AS user_id,
      e.value->>'subject'                           AS subject_slug,
      NULLIF(e.value->>'date', '')::date            AS exam_date,
      -- Le niveau du 1er chapitre du groupe fait office de `grade` : c'est ce
      -- que `addUpcomingExams` résolvait en base (chapters.level).
      (array_agg(e.value->>'level' ORDER BY e.ordinality))[1] AS grade,
      jsonb_agg(
        jsonb_build_object(
          'id',    e.value->>'chapterId',
          'title', e.value->>'chapterTitle'
        )
        ORDER BY e.ordinality
      )                                             AS chapters
    FROM public.profiles p
    CROSS JOIN LATERAL jsonb_array_elements(
      CASE
        WHEN jsonb_typeof(COALESCE(p.upcoming_exams, '[]'::jsonb)) = 'array'
          THEN p.upcoming_exams
        ELSE '[]'::jsonb
      END
    ) WITH ORDINALITY AS e(value, ordinality)
    WHERE COALESCE(e.value->>'subject', '')     <> ''
      AND COALESCE(e.value->>'chapterId', '')   <> ''
      AND COALESCE(e.value->>'chapterTitle','') <> ''
    GROUP BY p.id, e.value->>'subject', NULLIF(e.value->>'date', '')::date
  LOOP
    -- Idempotence : ce groupe a-t-il déjà son contrôle ? (`IS NOT DISTINCT FROM`
    -- pour que deux dates NULL se reconnaissent.)
    IF EXISTS (
      SELECT 1 FROM public.controles c
       WHERE c.user_id = g.user_id
         AND c.subject_slug = g.subject_slug
         AND c.exam_date IS NOT DISTINCT FROM g.exam_date
    ) THEN
      CONTINUE;
    END IF;

    INSERT INTO public.controles (user_id, subject_slug, chapters, exam_date, grade)
    VALUES (
      g.user_id,
      LEFT(g.subject_slug, 80),
      g.chapters,
      g.exam_date,
      LEFT(COALESCE(g.grade, ''), 20)
    )
    RETURNING id INTO v_id;

    -- --- Plan de préparation : miroir de planDates() -------------------------
    IF g.exam_date IS NULL THEN
      v_dates := ARRAY[v_today];
    ELSE
      v_delta := g.exam_date - v_today;
      IF v_delta < 0 THEN
        -- Contrôle déjà passé (cas limite) : une session aujourd'hui.
        v_dates := ARRAY[v_today];
      ELSE
        IF    v_delta >= 5 THEN v_count := 3;
        ELSIF v_delta >= 2 THEN v_count := 2;
        ELSE                    v_count := 1;
        END IF;

        IF v_count = 1 THEN
          v_dates := ARRAY[v_today];
        ELSE
          IF v_count = 3 THEN v_offsets := ARRAY[4, 2, 1];
          ELSE                v_offsets := ARRAY[2, 1];
          END IF;
          v_dates := ARRAY[]::DATE[];
          FOREACH v_off IN ARRAY v_offsets LOOP
            -- Jamais avant aujourd'hui, jamais deux fois le même jour.
            v_day := GREATEST(g.exam_date - v_off, v_today);
            IF NOT (v_day = ANY (v_dates)) THEN
              v_dates := v_dates || v_day;
            END IF;
          END LOOP;
          SELECT array_agg(d ORDER BY d) INTO v_dates
            FROM unnest(v_dates) AS d;
        END IF;
      END IF;
    END IF;

    -- Rotation des chapitres : session i → chapitre (i modulo N).
    v_nchap := jsonb_array_length(g.chapters);
    FOR v_i IN 1 .. array_length(v_dates, 1) LOOP
      INSERT INTO public.sessions_preparation
        (controle_id, user_id, planned_date, duration_min, chapter_id, position)
      VALUES (
        v_id,
        g.user_id,
        v_dates[v_i],
        v_goal,
        LEFT(COALESCE(g.chapters -> ((v_i - 1) % v_nchap) ->> 'id', ''), 80),
        v_i - 1
      );
    END LOOP;

    v_made := v_made + 1;
  END LOOP;

  RAISE NOTICE 'Migration 211 : % contrôle(s) repris depuis upcoming_exams.', v_made;
END;
$$;
