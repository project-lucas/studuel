-- =============================================================================
-- Studuel — Migration 199 : le score par matière du parent suit la classe
--
-- Suite directe de la 197 (qui avait aligné la MÉTRIQUE : meilleur score par
-- quiz, comme lib/mastery.ts). Il restait un écart de PÉRIMÈTRE.
--
-- Côté élève, l'anneau de progression d'une matière ne couvre que les
-- chapitres de sa classe courante (`app/reviser/[subject]/page.tsx` lit
-- `subject.fixed_level ?? grade`). Côté parent, `per_subject` agrégeait TOUT
-- l'historique : les quiz de 6e d'un élève aujourd'hui en 3e pesaient à vie
-- dans sa moyenne « Maths ». Deux ans de progrès pouvaient être noyés par une
-- année ancienne — ou l'inverse, une moyenne flatteuse tenue par du contenu
-- que l'élève ne révise plus.
--
-- On borne donc à `profiles.grade_level`, PLUS le niveau `'tous'` : les
-- matières hors-programme (`subjects.fixed_level = 'tous'`, migration 150 —
-- culture générale) sont visibles par l'élève à toutes les classes, elles
-- doivent rester dans la moyenne du parent.
--
-- `avg_ratio` suit le même périmètre, sans quoi la moyenne globale
-- contredirait de nouveau les matières affichées juste en dessous — c'est
-- exactement l'invariant que la 197 avait posé.
--
-- Cas limite assumé : un élève qui change de classe repart d'un score par
-- matière vide côté parent. C'est ce que l'élève voit aussi (ses anneaux
-- repartent à zéro) ; l'écran affiche alors « — » et « Pas encore assez de
-- quiz par matière pour les évaluer », pas un faux 0 %.
--
-- Si `grade_level` est NULL (profil incomplet), on ne borne rien : mieux vaut
-- un périmètre trop large qu'un tableau de bord vide.
--
-- Le reste de la fonction est repris À L'IDENTIQUE de la 197, à un détail
-- près : `best_per_quiz` JOINT désormais `quizzes` au lieu de tester
-- `quiz_id IS NOT NULL`. Une session pointant un quiz supprimé était jusqu'ici
-- comptée dans `avg_ratio` mais écartée de `per_subject` (la jointure du CTE
-- `subjects` la retirait déjà) — les deux chiffres divergeaient en silence.
--
-- ⚠️ Ne change QUE des chiffres affichés : sûre à exécuter avant ou après le
-- déploiement du code, dans n'importe quel ordre.
--
-- PRÉREQUIS : 044 (parent_children), 084 (child_dashboard, work_daily),
-- 197 (miroir de maîtrise). Idempotent.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.child_dashboard(p_child UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent UUID := auth.uid();
  v_result JSONB;
  v_since  DATE := (now() AT TIME ZONE 'utc')::date - 6;
  v_grade  TEXT;
BEGIN
  IF v_parent IS NULL THEN RETURN NULL; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.parent_children
     WHERE parent_id = v_parent AND child_id = p_child
  ) THEN RETURN NULL; END IF;

  SELECT grade_level INTO v_grade FROM public.profiles WHERE id = p_child;

  WITH days AS (
    SELECT DISTINCT to_char((created_at AT TIME ZONE 'utc')::date, 'YYYY-MM-DD') AS d
      FROM (
        SELECT created_at FROM public.test_sessions
          WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.study_sessions
          WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.lesson_completions
          WHERE user_id = p_child
        UNION ALL
        SELECT created_at FROM public.challenge_sessions
          WHERE user_id = p_child
      ) act
     -- Miroir d'ACTIVITY_WINDOW_DAYS (lib/streak.ts) et de la migration 170.
     WHERE created_at >= now() - INTERVAL '400 days'
  ),
  -- Miroir de lib/mastery.ts : un quiz vaut son MEILLEUR essai, ratio écrêté
  -- à 1 (un score supérieur au total ne doit pas gonfler la moyenne).
  -- Borné à la classe courante (+ le hors-programme 'tous'), comme l'anneau
  -- de progression de l'élève.
  best_per_quiz AS (
    SELECT ts.quiz_id,
           max(least(ts.score::numeric / ts.total, 1)) AS ratio,
           count(*) AS attempts
      FROM public.test_sessions ts
      JOIN public.quizzes q ON q.id = ts.quiz_id
     WHERE ts.user_id = p_child
       AND ts.total > 0
       AND (v_grade IS NULL OR q.grade_level IS NULL
            OR q.grade_level IN (v_grade, 'tous'))
     GROUP BY ts.quiz_id
  ),
  subjects AS (
    SELECT q.subject AS subject,
           avg(b.ratio) AS ratio,
           -- `attempts` reste le nombre d'ESSAIS : c'est la quantité de preuve
           -- que demande MIN_ATTEMPTS_FOR_SIGNAL, pas un nombre de quiz.
           sum(b.attempts) AS attempts
      FROM best_per_quiz b
      JOIN public.quizzes q ON q.id = b.quiz_id
     GROUP BY q.subject
  )
  SELECT jsonb_build_object(
    'full_name', (SELECT full_name FROM public.profiles WHERE id = p_child),
    'work_seconds', COALESCE((SELECT work_seconds FROM public.profiles WHERE id = p_child), 0),
    'week_seconds', COALESCE((SELECT sum(seconds) FROM public.work_daily
                                WHERE user_id = p_child AND day >= v_since), 0),
    'week_active_days', COALESCE((SELECT count(*) FROM public.work_daily
                                    WHERE user_id = p_child AND day >= v_since AND seconds > 0), 0),
    'active_days', COALESCE((SELECT jsonb_agg(d ORDER BY d) FROM days), '[]'::jsonb),
    'sessions_total', (SELECT count(*) FROM public.test_sessions WHERE user_id = p_child),
    'sessions_7', (SELECT count(*) FROM public.test_sessions
                    WHERE user_id = p_child AND created_at >= now() - INTERVAL '7 days'),
    'avg_ratio', (SELECT round(avg(ratio), 4) FROM best_per_quiz),
    'per_subject', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'subject', subject,
               'ratio', round(ratio, 4),
               'attempts', attempts
             ) ORDER BY ratio ASC, attempts DESC)
        FROM subjects
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.child_dashboard(UUID) TO authenticated;
